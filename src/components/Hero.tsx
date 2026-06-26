"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { profile } from "@/data/content";
import { sectionVariants } from "@/lib/constants";

function gmailComposeHref(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const fullName = profile.name;
  const roles = profile.roles;
  const isAvailableForWork = profile.availableForWork === true;

  const [nameIndex, setNameIndex] = useState(
    prefersReducedMotion ? fullName.length : 0,
  );
  const [descriptionIndex, setDescriptionIndex] = useState(
    prefersReducedMotion ? profile.summary.length : 0,
  );
  const [roleIndex, setRoleIndex] = useState(
    prefersReducedMotion ? roles[0].length : 0,
  );
  const [roleIdx, setRoleIdx] = useState(0);

const nameDone = prefersReducedMotion || nameIndex >= fullName.length;

useEffect(() => {
  if (prefersReducedMotion) return;
  if (nameIndex >= fullName.length) return;

  const typingSpeed = 90;

  const timeoutId = window.setTimeout(() => {
    setNameIndex((value) => value + 1);
  }, typingSpeed);

  return () => window.clearTimeout(timeoutId);
}, [nameIndex, prefersReducedMotion, fullName.length]);

  useEffect(() => {
  if (!nameDone) return;

  const typingSpeed = 90;
  const fullDescription = profile.summary;

  if (descriptionIndex >= fullDescription.length) return;

  const timeoutId = window.setTimeout(() => {
    setDescriptionIndex((value) => value + 1);
  }, typingSpeed);

  return () => window.clearTimeout(timeoutId);
}, [descriptionIndex, nameDone, profile.summary]);

  useEffect(() => {
  if (!nameDone) return;

  const typingSpeed = 90;
  const pauseBetweenRoles = 2200;

  const currentRole = roles[roleIdx];
  let timeoutId: number;

  if (roleIndex < currentRole.length) {
    timeoutId = window.setTimeout(() => {
      setRoleIndex((value) => value + 1);
    }, typingSpeed);
  } else {
    timeoutId = window.setTimeout(() => {
      setRoleIndex(0);
      setRoleIdx((idx) => (idx + 1) % roles.length);
    }, pauseBetweenRoles);
  }

  return () => window.clearTimeout(timeoutId);
}, [roleIndex, roleIdx, nameDone, roles]);

  return (
    <motion.section
      id="home"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="section-container relative flex min-h-[calc(100vh-4rem)] flex-col gap-10 pb-24 pt-12 md:flex-row md:items-center md:justify-between md:pt-16"
    >
      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-soft">
            {isAvailableForWork
              ? profile.availabilityBadge
              : "Freelancer"}
          </span>
          <span className="text-xs text-slate-400">
            {profile.location}
            {isAvailableForWork ? " · Open to roles" : ""}
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-400/90">
            Hello, I&apos;m
          </p>
          {prefersReducedMotion ? (
            <>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                {fullName}
              </h1>
              <p className="text-lg font-medium text-slate-300 sm:text-xl">
                {profile.roles.join(" · ")}
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {profile.summary}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                {fullName.slice(0, nameIndex)}
                <span className="inline-block w-1.5 ml-1 h-5 align-middle bg-emerald-400/80 animate-pulse rounded-sm" />
              </h1>
            </>
          )}
        </div>
        {!prefersReducedMotion && (
          <div className="space-y-2 min-h-[4.5rem] sm:min-h-[5rem]">
            <p className="text-lg font-medium text-slate-300 sm:text-xl min-h-[1.75rem]">
              {roleIndex === 0
                ? "\u00A0"
                : roles[roleIdx].slice(0, roleIndex)}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {descriptionIndex === 0
                ? "\u00A0"
                : profile.summary.slice(0, descriptionIndex || 0)}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={profile.resumePublicPath}
            download="sagnikmaity-resume"
            className="btn-primary"
          >
            Download Resume
          </a>
          <a href="#projects" className="btn-secondary">
            Explore Projects
          </a>
        </div>
        <div className="hero-quick-connect">
          <div className="hero-quick-connect__links">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <span className="hero-quick-connect__sep" aria-hidden>
              •
            </span>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="hero-quick-connect__sep" aria-hidden>
              •
            </span>
            <a
              href={gmailComposeHref(profile.email)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full justify-center md:mt-0 md:w-auto">
        <motion.div
          className="lottie-card relative h-50 w-52 overflow-hidden rounded-[2rem] border border-emerald-400/60 shadow-[0_0_60px_rgba(16,185,129,0.45)] md:h-56 md:w-56"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/a3236f17-3414-4357-b19f-13aa652223d4/5mAQMsmKdI.lottie"
              
              loop
              autoplay
              style={{ width: "100%", height: "100%", paddingBottom:"4%" }}
            />
      
          </div>
        </motion.div>
      </div>
      <div className="pointer-events-auto absolute bottom-6 left-1/2 flex w-full -translate-x-1/2 justify-center">
        <motion.button
          type="button"
          className="flex flex-col items-center gap-1 text-xs font-medium text-slate-400"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => {
            if (typeof document === "undefined") return;
            const nextSection =
              document.querySelector<HTMLElement>("#experience") ||
              document.querySelector<HTMLElement>("#projects");
            nextSection?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>Scroll to explore</span>
          <span className="text-lg">↓</span>
        </motion.button>
      </div>
    </motion.section>
  );
}
