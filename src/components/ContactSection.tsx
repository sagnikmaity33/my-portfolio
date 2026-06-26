"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleX, X, MessageSquare } from "lucide-react";
import { profile } from "@/data/content";
import { sectionVariants, cardVariants, gmailComposeHref } from "@/lib/constants";
import { useNotification } from "@/components/notification/NotificationProvider";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "timeout-callback"?: () => void;
        },
      ) => void;
      reset?: (widgetId?: string) => void;
    };
  }
}

export default function ContactSection() {
  const TOAST_DURATION_MS = 5000;
  const MAIL_PAUSED_INLINE_MESSAGE =
    "Messaging is temporarily paused due to high request volume. Please reach out via LinkedIn.";
  const MAIL_PAUSED_BANNER_MESSAGE =
    "Contact requests are temporarily paused. Please use alternate contact options.";
  const requiredMark = (
    <span aria-hidden="true" className="ml-1 text-[11px] text-red-400">
      *
    </span>
  );
  const [mode, setMode] = useState<"message" | "referral">("message");
  const modeRef = useRef<"message" | "referral">("message");
  const [showJobIdToast, setShowJobIdToast] = useState(false);
  const [status, setStatus] = useState<"idle" | "validating" | "submitting" | "success" | "error">("idle");
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const [apiErrorBannerMessage, setApiErrorBannerMessage] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const pendingSubmissionRef = useRef(false);
  const formErrorTimeoutRef = useRef<number | null>(null);
  const apiErrorTimeoutRef = useRef<number | null>(null);
  const { showNotification } = useNotification();

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
  const isMailEnabled = process.env.NEXT_PUBLIC_MAIL_ENABLED !== "false";
  const isSubmitDisabled = status === "validating" || status === "submitting" || !siteKey || !isMailEnabled;

  useEffect(() => {
    if (!siteKey) {
      console.warn(
        "NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY (or CLOUDFARE_TURNSTILE_SITE_KEY) is not set.",
      );
      return;
    }

    let cancelled = false;
    let pollId: number | undefined;

    const renderTurnstile = () => {
      if (cancelled) return;
      if (!window.turnstile) {
        return;
      }

      window.turnstile.render("#turnstile-container", {
        sitekey: siteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
          if (pendingSubmissionRef.current && formRef.current) {
            void submitForm(formRef.current, token);
          }
        },
        "error-callback": () => {
          setTurnstileToken(null);
          if (pendingSubmissionRef.current) {
            pendingSubmissionRef.current = false;
            showFormError(
              "Sorry about that! The security check couldn\u2019t be completed \u2014 please refresh the page and try again.",
            );
          }
        },
        "timeout-callback": () => {
          setTurnstileToken(null);
          if (pendingSubmissionRef.current) {
            pendingSubmissionRef.current = false;
            showFormError(
              "Sorry about that! The security check couldn\u2019t be completed \u2014 please refresh the page and try again.",
            );
          }
        },
      });
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      pollId = window.setInterval(() => {
        if (window.turnstile) {
          if (pollId !== undefined) {
            window.clearInterval(pollId);
          }
          renderTurnstile();
        }
      }, 400);
    }

    return () => {
      cancelled = true;
      if (pollId !== undefined) {
        window.clearInterval(pollId);
      }
    };
  }, [siteKey]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const syncModeFromUrl = () => {
      if (typeof window === "undefined") return;
      const isReferralIntent =
        window.location.hash === "#contact" &&
        new URLSearchParams(window.location.search).get("mode") ===
          "referral";
      setMode(isReferralIntent ? "referral" : "message");
    };

    syncModeFromUrl();
    window.addEventListener("hashchange", syncModeFromUrl);
    window.addEventListener("popstate", syncModeFromUrl);
    window.addEventListener("referral-intent-change", syncModeFromUrl);

    return () => {
      window.removeEventListener("hashchange", syncModeFromUrl);
      window.removeEventListener("popstate", syncModeFromUrl);
      window.removeEventListener("referral-intent-change", syncModeFromUrl);
    };
  }, []);

  const clearFormErrorTimer = () => {
    if (formErrorTimeoutRef.current !== null) {
      window.clearTimeout(formErrorTimeoutRef.current);
      formErrorTimeoutRef.current = null;
    }
  };

  const clearApiErrorTimer = () => {
    if (apiErrorTimeoutRef.current !== null) {
      window.clearTimeout(apiErrorTimeoutRef.current);
      apiErrorTimeoutRef.current = null;
    }
  };

  const showFormError = (message: string) => {
    clearFormErrorTimer();
    setStatus("error");
    setFormErrorMessage(message);
    formErrorTimeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
      setFormErrorMessage(null);
    }, TOAST_DURATION_MS);
  };

  const showApiErrorBanner = (message: string) => {
    clearApiErrorTimer();
    setApiErrorBannerMessage(message);
    apiErrorTimeoutRef.current = window.setTimeout(() => {
      setApiErrorBannerMessage(null);
    }, TOAST_DURATION_MS);
  };

  useEffect(() => {
    return () => {
      clearFormErrorTimer();
      clearApiErrorTimer();
    };
  }, []);

  const isReferral = mode === "referral";
  const isAvailableForWork = profile.availableForWork === true;

  async function submitForm(form: HTMLFormElement, token: string) {
    if (!isMailEnabled) {
      setStatus("error");
      showApiErrorBanner(MAIL_PAUSED_BANNER_MESSAGE);
      return;
    }

    const formData = new FormData(form);

    formData.append("mode", modeRef.current === "referral" ? "referral" : "message");
    formData.append("turnstileToken", token);

    try {
      setStatus("submitting");
      setApiErrorBannerMessage(null);
      clearApiErrorTimer();

      const response = await fetch(`/api/send-email`, {
        method: "POST",
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            error?: string;
          }
        | null;

      if (response.status === 503) {
        setStatus("error");
        showApiErrorBanner(MAIL_PAUSED_BANNER_MESSAGE);
        return;
      }

      if (!response.ok || !data?.success) {
        setStatus("error");
        showApiErrorBanner(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      form.reset();
      setMode("message");
      setFormErrorMessage(null);
      const resumeInput = document.getElementById(
        "resume",
      ) as HTMLInputElement | null;
      if (resumeInput) {
        resumeInput.value = "";
      }
      setResumeFile(null);
      showNotification({
        message: "Mail sent successfully",
        description: "Thanks for reaching out! Please check your inbox.",
        type: "success",
        durationMs: 5000,
      });
    } catch (error) {
      console.error("Failed to send contact form:", error);
      setStatus("error");
      showApiErrorBanner("Something went wrong. Please try again.");
    } finally {
      pendingSubmissionRef.current = false;
      setTurnstileToken(null);
      window.turnstile?.reset?.();
      setStatus("idle");
    }
  }

  return (
    <motion.section
      id="contact"
      className="section-container pb-20 scroll-mt-24 md:scroll-mt-28"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-emerald-500/80" />
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-50 sm:text-2xl">
              <MessageSquare size={18} className="text-emerald-300" aria-hidden="true" />
              Contact Me
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Let&apos;s talk about building something impactful together.
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <AnimatePresence mode="wait">
          {apiErrorBannerMessage ? (
            <motion.div
              key={apiErrorBannerMessage}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="api-error-banner pointer-events-auto w-full max-w-2xl"
              role="alert"
              aria-live="assertive"
            >
              <div className="api-error-banner__icon-wrap">
                <CircleX size={22} strokeWidth={2.2} />
              </div>
              <div className="api-error-banner__content">
                <p className="api-error-banner__title">Something went wrong!</p>
                <p className="api-error-banner__message">{apiErrorBannerMessage}</p>
              </div>
              <button
                type="button"
                className="api-error-banner__dismiss"
                onClick={() => {
                  clearApiErrorTimer();
                  setApiErrorBannerMessage(null);
                }}
                aria-label="Dismiss error message"
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
      >
        <motion.div
          className="card space-y-4 opacity-90 bg-slate-900/45 shadow-black/20 backdrop-blur-xl hover:opacity-100 hover:-translate-y-0.5 hover:border-emerald-500/55 hover:bg-slate-900/75 hover:shadow-emerald-500/12"
          variants={cardVariants}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              LET&apos;S WORK TOGETHER
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-50">
              Opportunities & Collaboration
            </h3>
            <div className="mt-3 space-y-2 text-xs text-slate-200">
              <p>
                Prefer backend engineering roles and distributed systems work
              </p>
              <p className="text-slate-300">
                Happy to collaborate on impactful projects and open-source
                contributions 🚀
              </p>
              <p className="text-[11px] text-slate-400">
                For fastest response, use the form in the portfolio.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-slate-300">
              What you can reach out for:
            </h4>
            <ul className="mt-2 space-y-2">
              {[
                "Freelance Projects",
                "Full-time Opportunities",
                "Collaborations",
                "Open Source",
              ]
                .filter((item) =>
                  isAvailableForWork ? true : item !== "Full-time Opportunities",
                )
                .map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-slate-200"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.35)]" />
                  <span>{item}</span>
                </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-slate-300">
              Impact Snapshot
            </h4>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                "1K+ Users Impacted",
                "3× Engineering Awards & Bounties",
                "Production Backend Experience",
                "10+ Projects Built",
              ].map((stat) => (
                <div
                  key={stat}
                  className="impact-badge-card rounded-xl border border-slate-800/60 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-100 shadow-[0_0_30px_rgba(16,185,129,0.06)]"
                >
                  {stat}
                </div>
              ))}
            </div>
          </div>

          <div className="contact-social-row pt-2">
            <a
              href={gmailComposeHref(profile.email)}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-btn"
              aria-label="Send email in Gmail"
              title="Email"
            >
              <img
                src="/gmail-icon.png"
                alt=""
                width={24}
                height={24}
                decoding="async"
                className="h-6 w-6 shrink-0 object-contain opacity-90"
              />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-btn"
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <img
                src="/linkedin-app-icon.png"
                alt=""
                width={24}
                height={24}
                decoding="async"
                className="h-6 w-6 shrink-0 object-contain opacity-90"
              />
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-btn"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <img
                src="/github-white-icon.png"
                alt=""
                width={24}
                height={24}
                decoding="async"
                className="github-contact-icon--dark-theme h-6 w-6 shrink-0 object-contain opacity-90"
              />
              <img
                src="/github-icon.png"
                alt=""
                width={24}
                height={24}
                decoding="async"
                className="github-contact-icon--light-theme h-6 w-6 shrink-0 object-contain opacity-90"
              />
            </a>
          </div>
        </motion.div>

        <motion.form
          ref={formRef}
          className="card space-y-4"
          variants={cardVariants}
          onSubmit={async (event) => {
            event.preventDefault();
            setFormErrorMessage(null);
            if (!isMailEnabled) {
              setStatus("error");
              showApiErrorBanner(MAIL_PAUSED_BANNER_MESSAGE);
              return;
            }

            const form = event.currentTarget;
            const formData = new FormData(form);
            const name = formData.get("name");
            const email = formData.get("email");
            const subject = formData.get("subject");
            const message = formData.get("message");

            if (!name || !email || !subject || !message) {
              return;
            }
            const messageText = String(message);
            if (messageText.trim().length < 10) {
              showFormError(
                "Message must be at least 10 characters long so that I have enough context.",
              );
              return;
            }

            if (isReferral) {
              if (!resumeFile) {
                showFormError(
                  "Please upload your resume before requesting a referral.",
                );
                return;
              }

              const subjectStr = String(subject || "");
              const jobIdPattern = /^REF\d{6}W$/;
              const jobIds = subjectStr
                .split(",")
                .map((id) => id.trim())
                .filter((id) => id.length > 0);

              if (
                jobIds.length === 0 ||
                jobIds.some((id) => !jobIdPattern.test(id))
              ) {
                setShowJobIdToast(true);
                setTimeout(() => setShowJobIdToast(false), TOAST_DURATION_MS);
                return;
              }
            }

            pendingSubmissionRef.current = true;
            setStatus("validating");
            setTurnstileToken(null);
            window.turnstile?.reset?.();
          }}
        >
          {status === "error" && formErrorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 rounded-lg border border-red-500/60 bg-red-900/70 px-3 py-2 text-[11px] text-red-100 shadow-lg"
              role="alert"
            >
              {formErrorMessage}
            </motion.div>
          )}
          {showJobIdToast && (
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              className="mb-2 rounded-lg border border-red-500/60 bg-red-900/70 px-3 py-2 text-[11px] text-red-100 shadow-lg"
            >
              Job IDs are not of correct format.
            </motion.div>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {isReferral ? "Ask for referral" : "Send a Message"}
                  </h3>
                  {!isMailEnabled && (
                    <span
                      role="status"
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
                    >
                      <span aria-hidden="true" className="paused-status-dot shrink-0 text-sm">
                        ●
                      </span>
                      Temporarily Paused
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {isReferral ? (
                    <>
                      Get relevant Job ID from {" "}
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
                      >
                        VISA careers
                      </a>{" "}
                      and add it in the subject.
                    </>
                  ) : (
                    "A copy of this email will be shared with you. Let's Connect! 🚀"
                  )}
                </p>
              </div>
              <div className="contact-toggle relative inline-flex w-full items-center justify-between p-0.5 text-[10px] shadow-sm shadow-black/30 sm:w-auto">
                <motion.div
                  className="absolute inset-y-0 left-0 my-0.5 h-[calc(100%-4px)] w-1/2 rounded-full bg-emerald-500/85 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                  animate={{ left: isReferral ? "50%" : "0%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                />
                <button
                  type="button"
                  className={`relative z-10 px-2 py-1 rounded-full transition-colors duration-150 ${
                    !isReferral
                      ? "text-slate-950"
                      : "contact-toggle-label-inactive"
                  }`}
                  onClick={() => setMode("message")}
                >
                  Message
                </button>
                <button
                  type="button"
                  className={`relative z-10 px-2 py-1 rounded-full transition-colors duration-150 ${
                    isReferral
                      ? "text-slate-950"
                      : "contact-toggle-label-inactive"
                  }`}
                  onClick={() => setMode("referral")}
                >
                  Referral
                </button>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <div id="turnstile-container" className="mt-1" />
            {!siteKey && (
              <p className="mt-2 text-[11px] text-red-300">
                Contact form verification is misconfigured. Please try again
                later.
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-medium text-slate-300"
              >
                Name{requiredMark}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-300"
              >
                Email{requiredMark}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div
            className="sr-only"
            aria-hidden="true"
          >
            <label htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="off"
              tabIndex={-1}
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-medium text-slate-300"
            >
              {isReferral ? "Job IDs" : "Subject"}
              {requiredMark}
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              className="h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
              placeholder={
                isReferral
                  ? "e.g. REF075148W, REF075149W"
                  : "Portfolio feedback, Project opportunity, collaboration, etc."
              }
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="message"
              className="text-xs font-medium text-slate-300"
            >
              {isReferral ? "Why are you a good fit for this role?" : "Message"}
              {requiredMark}
            </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={700}
                className="w-full resize-none rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
                placeholder={
                  isReferral
                    ? "Write the response in a third-person narrative format (e.g., \u201CRohit has improved pipeline efficiency by 10%\u201D).\n\nTip: Add numbers to make it more impactful as shown in the example \uD83D\uDE09"
                    : "Tell me a bit about what you have in mind... \uD83E\uDD14"
                }
                required
              />
          </div>
          <input
            id="resume"
            name="resume"
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setResumeFile(file ?? null);
            }}
          />
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="btn-primary hover:-translate-y-0.5 transform transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitDisabled}
                title={
                  !isMailEnabled
                    ? "Temporarily unavailable due to high request volume"
                    : undefined
                }
              >
                {status === "validating"
                  ? "Validating..."
                  : status === "submitting"
                  ? (
                    <span className="sending-dots" aria-live="polite">
                      <span className="sr-only">Sending</span>
                      <span aria-hidden="true">Sending</span>
                      <span className="sending-dots__dot" aria-hidden="true">
                        .
                      </span>
                      <span className="sending-dots__dot" aria-hidden="true">
                        .
                      </span>
                      <span className="sending-dots__dot" aria-hidden="true">
                        .
                      </span>
                    </span>
                  )
                  : isReferral
                    ? "Request Referral"
                    : "Send Message"}
              </button>
              <button
                type="button"
                className="btn-secondary px-3 py-1.5 text-xs"
                onClick={() => {
                  const input = document.getElementById(
                    "resume",
                  ) as HTMLInputElement | null;
                  input?.click();
                }}
              >
                {isReferral ? "Upload Resume" : "Upload Document"}
              </button>
              {resumeFile && (
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="max-w-[160px] truncate">
                    {resumeFile.name}
                  </span>
                  <span className="text-slate-500">
                    {`${Math.round(resumeFile.size / 1024)} KB`}
                  </span>
                  <button
                    type="button"
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                    onClick={() => {
                      const input = document.getElementById(
                        "resume",
                      ) as HTMLInputElement | null;
                      if (input) {
                        input.value = "";
                      }
                      setResumeFile(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Allowed formats: .pdf, .doc, .docx
            </p>
            {!isMailEnabled && (
              <p className="mt-3 text-center text-[11px] text-slate-400">
                {MAIL_PAUSED_INLINE_MESSAGE}
              </p>
            )}
          </div>
        </motion.form>
      </motion.div>
    </motion.section>
  );
}
