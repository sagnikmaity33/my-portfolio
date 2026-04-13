import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { profile } from "@/data/content";
import {
  sanitizeEmail,
  sanitizeMessage,
  sanitizeName,
  sanitizeSubject,
} from "@/lib/sanitize";

const JOB_ID_PATTERN = /^REF\d{6}W$/;

// Upstash / Turso KV Redis client for rate limiting across serverless instances.
// Uses the existing Turso-style env names for connectivity.
const redis = new Redis({
  url: process.env.TT_KV_REST_API_URL!,
  token: process.env.TT_KV_REST_API_TOKEN!,
});

const RATE_LIMIT_WINDOW_SECONDS = process.env.RATE_LIMIT_WINDOW_SECONDS
  ? parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 10)
  : 3600; // Default to 1 hour if not set or invalid.

const RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS
  ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
  : 3; // Default to 3 messages per IP per hour if not set or invalid.

const DAILY_MAIL_QUOTA = process.env.DAILY_MAIL_QUOTA
  ? parseInt(process.env.DAILY_MAIL_QUOTA, 10)
  : 50; // Default to 50 emails per day if not set or invalid.


const DAILY_QUOTA_ERROR_MESSAGE =
  "Today's mail quota is exhausted please try again tomorrow.";
const MAIL_DISABLED_ERROR_MESSAGE = "Mail service temporarily disabled";
const MAIL_LATENCY_LOGS_ENABLED = process.env.MAIL_LATENCY_LOGS === "true";
const ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()) : [];

const REDIS_PRECHECK_SCRIPT = `
local ipKey = KEYS[1]
local dailyKey = KEYS[2]
local ipWindowSeconds = tonumber(ARGV[1])

local ipCount = redis.call("INCR", ipKey)
if ipCount == 1 then
  redis.call("EXPIRE", ipKey, ipWindowSeconds)
end

local dailyCount = tonumber(redis.call("GET", dailyKey) or "0")

return {ipCount, dailyCount}
`;

const REDIS_POSTSEND_SCRIPT = `
local dailyKey = KEYS[1]
local ttlSeconds = tonumber(ARGV[1])

local dailyCount = redis.call("INCR", dailyKey)
if dailyCount == 1 then
  redis.call("EXPIRE", dailyKey, ttlSeconds)
end

return dailyCount
`;

const getTodayQuotaKey = () => {
  const dateKey = new Date().toISOString().slice(0, 10);
  return `email-daily:${dateKey}`;
};

const getSecondsUntilNextUtcDay = () => {
  const now = new Date();
  const nextUtcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
  );
  return Math.max(1, Math.ceil((nextUtcMidnight - now.getTime()) / 1000));
};

const parseCounterValue = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const elapsedMs = (start: number) => Number((performance.now() - start).toFixed(1));

const logLatency = (requestId: string, stage: string, durationMs: number) => {
  if (!MAIL_LATENCY_LOGS_ENABLED) return;
  console.info(`[send-email][${requestId}] ${stage}=${durationMs}ms`);
};

const runRedisPrecheck = async (
  ipKey: string,
  dailyKey: string,
) => {
  const raw = await redis.eval(REDIS_PRECHECK_SCRIPT, [ipKey, dailyKey], [
    String(RATE_LIMIT_WINDOW_SECONDS),
  ]);

  const values = Array.isArray(raw) ? raw : [];
  const ipCount = parseCounterValue(values[0]);
  const dailyCount = parseCounterValue(values[1]);

  return { ipCount, dailyCount };
};

const runRedisPostsendUpdate = async (dailyKey: string, ttlSeconds: number) => {
  await redis.eval(REDIS_POSTSEND_SCRIPT, [dailyKey], [String(ttlSeconds)]);
};

const sendEmailSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name must be at most 100 characters long."),
  email: z
    .string()
    .email("Please provide a valid email address.")
    .max(254, "Email must be at most 254 characters long."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long.")
    .max(600, "Message must be at most 600 characters long."),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.join(", "),
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  const requestStart = performance.now();
  const requestId = crypto.randomUUID().slice(0, 8);
  const isMailEnabled = process.env.NEXT_PUBLIC_MAIL_ENABLED !== "false";

  if (!isMailEnabled) {
    return NextResponse.json(
      {
        success: false,
        error: MAIL_DISABLED_ERROR_MESSAGE,
      },
      {
        status: 503,
        headers: corsHeaders,
      },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "Email service is not configured. Missing RESEND_API_KEY.",
      },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  // Simple fixed-window rate limiting: 5 requests per 10 seconds per IP.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip =
    forwardedFor?.split(",")[0].trim() ?? realIp ?? "unknown";
  const dailyQuotaKey = getTodayQuotaKey();

  try {
    const redisPreStart = performance.now();
    const ipKey = `email-ip:${ip}`;
    const { ipCount, dailyCount } = await runRedisPrecheck(ipKey, dailyQuotaKey);
    logLatency(requestId, "redisPre", elapsedMs(redisPreStart));

    if (ipCount > RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your message limit is exhausted. Please try again after sometime.",
        },
        {
          status: 429,
          headers: corsHeaders,
        },
      );
    }

    if (dailyCount >= DAILY_MAIL_QUOTA) {
      return NextResponse.json(
        {
          success: false,
          error: DAILY_QUOTA_ERROR_MESSAGE,
        },
        {
          status: 429,
          headers: corsHeaders,
        },
      );
    }
  } catch (error) {
    console.error("Redis precheck failed; continuing without limit:", error);
  }

  const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!turnstileSecretKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Turnstile is not configured. Missing TURNSTILE_SECRET_KEY.",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const fromAddress = process.env.RESEND_FROM_ADDRESS;

  if (!fromAddress) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Email service is not fully configured. Missing RESEND_FROM_ADDRESS.",
      },
      { status: 500 ,
        headers: corsHeaders,
      },
    );
  }

  try {
    const formDataStart = performance.now();
    const formData = await request.formData();
    logLatency(requestId, "formDataParse", elapsedMs(formDataStart));

    const company = String(formData.get("company") || "").trim();

    if (company) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid submission.",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const turnstileToken = String(formData.get("turnstileToken") || "").trim();

    if (!turnstileToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Sorry about that! The security check couldn’t be completed — please refresh and try again.",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    try {
      const turnstileVerifyStart = performance.now();
      const verifyResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret: turnstileSecretKey,
            response: turnstileToken,
          }),
        },
      );

      const verifyData = (await verifyResponse.json()) as {
        success: boolean;
        "error-codes"?: string[];
      };
      logLatency(requestId, "turnstileVerify", elapsedMs(turnstileVerifyStart));

      if (!verifyData.success) {
        console.error(
          "Turnstile verification failed:",
          verifyData["error-codes"],
        );
        return NextResponse.json(
          {
            success: false,
            error:
              "Sorry—we couldn't complete the security check. Please refresh the page and fill out the form again.",
          },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }
    } catch (error) {
      console.error("Error verifying Turnstile token:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Sorry—we couldn't complete the security check. Please refresh the page and fill out the form again.",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const nameRaw = String(formData.get("name") || "").trim();
    const emailRaw = String(formData.get("email") || "").trim();
    const subjectRaw = String(formData.get("subject") || "").trim();
    const messageRaw = String(formData.get("message") || "").trim();
    const mode = (String(formData.get("mode") || "message").trim() ||
      "message") as "message" | "referral";
    const resume = formData.get("resume");

    if (!subjectRaw) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject is required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const validationResult = sendEmailSchema.safeParse({
      name: nameRaw,
      email: emailRaw,
      message: messageRaw,
    });

    if (!validationResult.success) {
      const message =
        validationResult.error.issues
          .map((issue) => issue.message)
          .filter((value, index, self) => self.indexOf(value) === index)
          .join(" ") || "Invalid request data.";

      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const { name, email, message } = validationResult.data;

    const safeName = sanitizeName(name);
    const safeEmail = sanitizeEmail(email);
    const safeSubject = sanitizeSubject(subjectRaw);
    const safeMessage = sanitizeMessage(message);

    if (!safeSubject) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject is required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!safeMessage) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    let jobIdsForReferral: string[] | undefined;

    if (mode === "referral") {
      const subjectStr = subjectRaw;
      const jobIds = subjectStr
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      if (jobIds.length === 0 || jobIds.some((id) => !JOB_ID_PATTERN.test(id))) {
        return NextResponse.json(
          {
            success: false,
            error: "Job IDs are not of correct format.",
          },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }

      jobIdsForReferral = jobIds;
    }

    const targetEmail =
      mode === "referral" ? profile.referralEmail : profile.referralEmail;

    let attachments:
      | {
          filename: string;
          content: string;
          contentType?: string;
        }[]
      | undefined;

    if (resume instanceof File && resume.size > 0) {
      const attachmentEncodeStart = performance.now();
      const allowedAttachmentTypes = new Set([
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]);

      if (resume.type && !allowedAttachmentTypes.has(resume.type)) {
        return NextResponse.json(
          {
            success: false,
            error: "Only PDF and Word attachments are allowed.",
          },
          { status: 400,
            headers: corsHeaders,
           },
        );
      }

      const arrayBuffer = await resume.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      attachments = [
        {
          filename: resume.name || "attachment.pdf",
          content: buffer.toString("base64"),
          contentType: resume.type || "application/pdf",
        },
      ];
      logLatency(requestId, "attachmentEncode", elapsedMs(attachmentEncodeStart));
    }

    const displayName = safeName || "there";

    const subjectForEmail =
      mode === "referral" && jobIdsForReferral
        ? profile.referralSubjectTemplate
            .replace("{Name}", displayName)
            .replace("{JobIds}", jobIdsForReferral.join(", "))
        : safeSubject;

    const textBody =
      mode === "referral"
        ? profile.referralBodyTemplate
            .replace("{Name}", displayName)
            .replace("{candidate_response}", safeMessage)
        : profile.messageBodyTemplate
            .replace("{Name}", displayName)
            .replace("{UserMessage}", safeMessage);

    const resendSendStart = performance.now();
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: targetEmail,
      cc: safeEmail || undefined,
      subject: subjectForEmail,
      replyTo: safeEmail,
      text: textBody,
      attachments,
    });
    logLatency(requestId, "resendSend", elapsedMs(resendSendStart));

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email.",
        },
        { status: 500,
          headers: corsHeaders,
         },
      );
    }

    try {
      const redisPostStart = performance.now();
      await runRedisPostsendUpdate(dailyQuotaKey, getSecondsUntilNextUtcDay());
      logLatency(requestId, "redisPost", elapsedMs(redisPostStart));
    } catch (error) {
      console.error("Failed to update daily mail quota counter:", error);
    }

    logLatency(requestId, "total", elapsedMs(requestStart));

    return NextResponse.json({ success: true },{headers: corsHeaders});
  } catch (error) {
    console.error("Unexpected error in /api/send-email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while sending email.",
      },
      { status: 500 ,
        headers: corsHeaders,
      },
    );
  }
}

