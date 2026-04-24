"use client";

import Script from "next/script";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, Variant, Variants} from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  BriefcaseBusiness,
  CircleX,
  Code2,
  FolderCode,
  MessageSquare,
  SendHorizontal,
  SquareArrowOutUpRight,
  Trophy,
  X,ChevronDown, Github
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import {
  profile,
  skills,
  experiences,
  projects,
  awards,
} from "@/data/content";
import { useNotification } from "@/components/notification/NotificationProvider";

import {  MapPin, CalendarDays} from "lucide-react";



const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function gmailComposeHref(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMailEnabled = process.env.NEXT_PUBLIC_MAIL_ENABLED !== "false";

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const stored = window.localStorage.getItem("theme");
    // if (stored === "light" || stored === "dark") {
    //   setTheme(stored);
    //   document.documentElement.setAttribute("data-theme", stored);
    //   return;
    // }

  //   const prefersLight = window.matchMedia(
  //     "(prefers-color-scheme: light)",
  //   ).matches;
  //   const initial = prefersLight ? "light" : "dark";
  //   setTheme(initial);
  //   document.documentElement.setAttribute("data-theme", initial);
  // }, []);

  // Persist theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const updateUrl = (url: URL) => {
    const search = url.searchParams.toString();
    const nextUrl = `${url.pathname}${search ? `?${search}` : ""}${url.hash}`;
    window.history.replaceState({}, "", nextUrl);
  };

  const clearReferralIntent = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("mode") !== "referral") return;
    url.searchParams.delete("mode");
    updateUrl(url);
  };

  const handleReferralClick = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("mode", "referral");
    url.hash = "contact";
    updateUrl(url);
    window.dispatchEvent(new Event("referral-intent-change"));
    document.querySelector<HTMLElement>("#contact")?.scrollIntoView({
      behavior: "smooth",
    });
    setIsMobileNavOpen(false);
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-transparent">
        <div
          className="h-full bg-emerald-500/80 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="section-container flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-emerald-400/80 bg-emerald-500/20 shadow-lg shadow-emerald-500/40">
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-emerald-300">
                SM
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-100">
                {profile.name}
              </span>
              <span className="text-xs text-slate-400">
                {profile.title} · {profile.location}
              </span>
            </div>
          </div>
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="nav-link"
                onClick={() => {
                  if (section.id === "contact") {
                    clearReferralIntent();
                  }
                }}
              >
                {section.label}
              </a>
            ))}
            {isMailEnabled ? (
              <button
                type="button"
                className="nav-link"
                onClick={handleReferralClick}
              >
                Referral
              </button>
            ) : null}
          </nav>
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm shadow-black/40 transition hover:border-emerald-400 hover:text-emerald-300"
              aria-label="Toggle color theme"
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-slate-500"
                style={{
                  background:
                    theme === "dark"
                      ? "radial-gradient(circle at 30% 30%, #22c55e, #020617)"
                      : "radial-gradient(circle at 30% 30%, #f97316, #f9fafb)",
                }}
              />
              <span className="hidden sm:inline">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button> */}
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="mobile-menu-btn inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-200 shadow-sm shadow-black/40 transition hover:border-emerald-400 hover:text-emerald-300 md:hidden"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileNavOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="flex flex-col gap-0.5">
                <span className="block h-[2px] w-4 rounded-full bg-current" />
                <span className="block h-[2px] w-4 rounded-full bg-current" />
                <span className="block h-[2px] w-4 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
        {/* Mobile nav dropdown */}
        {isMobileNavOpen && (
          <div
            className={`border-t md:hidden ${
              theme === "light"
                ? "border-slate-200 bg-white"
                : "border-slate-800/80 bg-slate-950/95"
            }`}
          >
            <nav className="section-container flex flex-col gap-1 py-3">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="nav-link py-1.5"
                  onClick={() => {
                    if (section.id === "contact") {
                      clearReferralIntent();
                    }
                    setIsMobileNavOpen(false);
                  }}
                >
                  {section.label}
                </a>
              ))}
              {isMailEnabled ? (
                <button
                  type="button"
                  className="nav-link py-1.5 text-left"
                  onClick={handleReferralClick}
                >
                  Referral
                </button>
              ) : null}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
//hero secttion present here.................................................................


function Hero() {
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
  // const [nameDone, setNameDone] = useState(prefersReducedMotion);

const nameDone = prefersReducedMotion || nameIndex >= fullName.length;

  // Type the name once
// useEffect(() => {
//   if (prefersReducedMotion || nameDone) return;

//   if (nameIndex >= fullName.length) {
//     setNameDone(true);
//     return;
//   }

//   const typingSpeed = 90;

//   const timeoutId = window.setTimeout(() => {
//     setNameIndex((value) => value + 1);
//   }, typingSpeed);

//   return () => window.clearTimeout(timeoutId);
// }, [nameIndex, prefersReducedMotion, nameDone, fullName.length]);
  
//new version of typing name
useEffect(() => {
  if (prefersReducedMotion) return;
  if (nameIndex >= fullName.length) return;

  const typingSpeed = 90;

  const timeoutId = window.setTimeout(() => {
    setNameIndex((value) => value + 1);
  }, typingSpeed);

  return () => window.clearTimeout(timeoutId);
}, [nameIndex, prefersReducedMotion, fullName.length]);


// Type description once, starting after name finishes
  // useEffect(() => {
  //   if (prefersReducedMotion || !nameDone) return;

  //   const typingSpeed = 90;
  //   const fullDescription = profile.summary;
  //   let timeoutId: number;

  //   if (descriptionIndex < fullDescription.length) {
  //     timeoutId = window.setTimeout(
  //       () => setDescriptionIndex((value) => value + 1),
  //       typingSpeed,
  //     );
  //   }

  //   return () => window.clearTimeout(timeoutId);
  // }, [descriptionIndex, prefersReducedMotion, nameDone]);

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

  // Continuously cycle through roles, starting after name finishes


  // useEffect(() => {
  //   if (prefersReducedMotion || !nameDone) return;

  //   const typingSpeed = 90;
  //   const pauseBetweenRoles = 2200;
  //   let timeoutId: number;

  //   const currentRole = roles[roleIdx];

  //   if (roleIndex < currentRole.length) {
  //     timeoutId = window.setTimeout(
  //       () => setRoleIndex((value) => value + 1),
  //       typingSpeed,
  //     );
  //   } else {
  //     timeoutId = window.setTimeout(() => {
  //       setRoleIndex(0);
  //       setRoleIdx((idx) => (idx + 1) % roles.length);
  //     }, pauseBetweenRoles);
  //   }

  //   return () => window.clearTimeout(timeoutId);
  // }, [roleIndex, roleIdx, prefersReducedMotion, nameDone, roles]);

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
            {/* Roles line: keep constant vertical space to avoid layout shift */}
            <p className="text-lg font-medium text-slate-300 sm:text-xl min-h-[1.75rem]">
              {roleIndex === 0
                ? "\u00A0"
                : roles[roleIdx].slice(0, roleIndex)}
            </p>
            {/* Description: types once, stays fixed below roles, with reserved space */}
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
          {/* <span className="hero-quick-connect__label">Connect quickly:</span> */}
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



function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      id="about"
      className="section-container relative py-20 md:py-28 scroll-mt-24 md:scroll-mt-28"
    >
      {/* 🌌 background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-10%] top-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <motion.div
        className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* LEFT */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <motion.h2
            variants={itemVariants}
            className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400"
          >
            <span className="h-px w-6 bg-emerald-400" />
            About
          </motion.h2>

          <motion.h3
            variants={itemVariants}
            className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl md:text-5xl"
          >
            I build high-performance{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              distributed systems
            </span>{" "}
            and secure backend infrastructure.
          </motion.h3>

          {/* subtle system indicator */}
<motion.div
  variants={itemVariants}
  className="mt-10 hidden items-center gap-4 opacity-60 lg:flex"
>
  {/* spinning orbital ring */}
  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 animate-[spin_10s_linear_infinite]">
    
    {/* orbiting particle */}
    <div className="absolute top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />

    <div className="absolute top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,1)]" />
<div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-md" />

    {/* subtle center glow */}
    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
  </div>

  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
    System Active
  </span>
</motion.div>
        </div>

        <div className="hidden lg:block lg:col-span-1" />

        {/* RIGHT */}
        <div className="lg:col-span-6 space-y-12">
          {/* TEXT */}
          <div className="space-y-6 text-base leading-relaxed text-slate-300 sm:text-lg">
            <motion.p variants={itemVariants}>
              I specialize in building robust backend systems that excel under
              pressure—leveraging SpringBoot, Node.js, and scalable distributed
              architectures to deliver reliable, high-performance solutions.
            </motion.p>

            <motion.p variants={itemVariants}>
              I have worked on production-grade distributed systems: event-driven
              microservices, low-latency pipelines, and infrastructure spanning
              large-scale node networks.
            </motion.p>

            <motion.p variants={itemVariants}>
              My roots are in Development infrastructure — high-stakes, always-on
              environments where fault tolerance is not optional.
            </motion.p>
          </div>

          {/* STATS */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {/* card 1 */}
            <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-slate-900/80">
              <div className="mb-3 text-3xl font-bold text-emerald-400 transition group-hover:scale-105">
                10M+
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Daily Events Processed
              </div>
            </div>

            {/* card 2 */}
            <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-slate-900/80">
              <div className="mb-3 text-3xl font-bold text-emerald-400 transition group-hover:scale-105">
                100+
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Live Network Nodes
              </div>
            </div>

            {/* stack */}
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 backdrop-blur-xl sm:col-span-2">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Core Stack
              </div>

              <div className="flex flex-wrap gap-2">
                {["Springboot", "Node", "Python", "PostgreSQL", "Docker"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}



function SkillPill({ label }: { label: string }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -3,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 20,
      }}
      className="
        group relative shrink-0 cursor-default
        rounded-2xl overflow-hidden
        px-6 py-3
        border border-slate-700/60
        bg-[linear-gradient(145deg,rgba(15,23,42,0.75),rgba(2,6,23,0.65))]
        text-slate-300 text-sm md:text-lg font-semibold
        backdrop-blur-xl
        transition-all duration-300
      "
    >
      {/* TEXT */}
      <span
        className="
          relative z-10 transition-all duration-300
          group-hover:text-emerald-200
          group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]
        "
      >
        {label}
      </span>

      {/* GLASS SHINE SWEEP */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute -left-full top-0 h-full w-1/2
            bg-gradient-to-r from-transparent via-white/15 to-transparent
            opacity-0 transition-all duration-700
            group-hover:left-full group-hover:opacity-100
          "
        />
      </div>

      {/* BRIGHTENED EMERALD GLOW */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 blur-xl transition duration-300
          bg-emerald-400/15
          group-hover:opacity-100
        "
      />

      {/* INNER LIGHT (sharp highlight layer) */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 transition duration-300
          bg-emerald-300/5
          group-hover:opacity-100
        "
      />

      {/* EDGE LIGHT */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl border
          border-emerald-400/0
          transition duration-300
          group-hover:border-emerald-400/35
        "
      />
    </motion.div>
  );
}

function MarqueeRow({
  items,
  direction = 1,
}: {
  items: string[];
  direction?: number;
}) {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <motion.div
        className="flex gap-5" // tighter spacing = cleaner
        animate={{
          x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          ease: "linear",
          duration: 16, // faster but smooth
          repeat: Infinity,
        }}
      >
        {[...items, ...items, ...items, ...items, ...items].map(
          (skill, idx) => (
            <SkillPill key={idx} label={skill} />
          )
        )}
      </motion.div>
    </div>
  );
}


function SkillsSection() {
  const containerRef = useRef(null);

  // scroll-based speed variation (subtle)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const speed = useTransform(scrollYProgress, [0, 1], [1, 1.4]);

  const row1 = [
    "SpringBoot", "TypeScript", "Python", "JavaScript",
    "React", "React Native", "Flutter", "C"
  ];

  const row2 = [
    "Linux", "Microservices", "Load Balancers", "Git"
  ];

  const row3 = [
    "gRPC", "WebSockets", "PostgreSQL", "Redis", "Docker", "AWS"
  ];

  return (
    <section
      ref={containerRef}
      id="skills"
      className="relative overflow-hidden py-28 bg-slate-950"
    >
      {/* EDGE FADE MASK (cleaner than div overlays) */}
      <div className="pointer-events-none absolute inset-0 z-10 
        [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />

      {/* HEADER */}
      <div className="relative z-20 mb-20 px-6 text-center">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400 mb-4">
          04. Capabilities
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-slate-100">
          Technical Arsenal
        </h3>
      </div>

      {/* MARQUEE */}
      <div className="relative z-0 flex flex-col gap-8 rotate-[-2deg] w-[110%] -ml-[5%]">
        <MarqueeRow items={row1} direction={1}  />
        <MarqueeRow items={row2} direction={-1}  />
        <MarqueeRow items={row3} direction={1}  />
      </div>
    </section>
  );
}



const timelineItemVariants = {
  hidden: (isLeft: boolean) => ({
    opacity: 0,
    y: 80,
    x: isLeft ? -70 : 70,
    scale: 0.94,
    filter: "blur(10px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


//changing now - mirror issue

function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement | null>(null);

const { scrollYProgress } = useScroll({
  target: timelineRef,
  offset: ["start end", "end start"],
});

const yMove = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.section
      id="experience"
      className="section-container relative pb-24 pt-6 scroll-mt-24 md:scroll-mt-28"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.08 }}
    >
      {/* Section glow */}
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-64 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.10),transparent_70%)] blur-3xl" />

      {/* Header */}
      <div className="mb-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="h-12 w-1 rounded-full bg-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-50 sm:text-3xl">
              <BriefcaseBusiness
                size={22}
                className="text-emerald-300"
                aria-hidden="true"
              />
              Experience
            </h2>
            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Roles where I&apos;ve built production systems at scale
            </p>
          </div>
        </div>
      </div>

      {/* Timeline wrapper */}
      <div ref={timelineRef} className="relative mx-auto max-w-6xl">
        {/* Center line */}
        <div className="experience-timeline-line hidden md:block" />
        
        <motion.div
  style={{ scaleY: scrollYProgress }}
  className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 origin-top md:block z-20"
>
  <div className="h-full w-full rounded-full bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.7)]" />
</motion.div>
<motion.div
  style={{ y: yMove }}
  className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 md:block z-30"
>
  <div className="h-24 w-[6px] rounded-full bg-gradient-to-b from-transparent via-emerald-300 to-transparent opacity-80 blur-md" />
</motion.div>

        {/* 🔥 SINGLE animated orb */}
  <motion.div
    style={{ y: yMove }}
    className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 md:block z-30"
  >
    <div className="relative">
      {/* core */}
      <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.9)]" />

      {/* pulse */}
      <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-30" />

      {/* aura */}
      <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-xl" />
    </div>
  </motion.div>

        <div className="space-y-12 md:space-y-20">
          <motion.div
  style={{ y: yMove }}
  className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 md:block z-30"
>
  <div className="relative">
    {/* core dot */}
    <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.95)]" />

    {/* glow pulse */}
    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-30" />

    {/* aura */}
    <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-xl" />
  </div>
</motion.div>
          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0;

            

            return (
              <div
                key={`${exp.company}-${exp.role}-${index}`}
                className="relative"
                style={{ perspective: "1600px" }}
              >
                {/* Center timeline dot */}


                {/* Connector line from center to card */}
                <div
                  className={[
                    "pointer-events-none absolute top-9 hidden h-px w-10 bg-gradient-to-r md:block",
                    isLeft
                      ? "right-[calc(50%+0.55rem)] from-emerald-400/70 to-transparent"
                      : "left-[calc(50%+0.55rem)] from-transparent to-emerald-400/70",
                  ].join(" ")}
                />

                {/* existing line */}


                <motion.article
                  custom={isLeft}
                  variants={timelineItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.22, margin: "-8% 0px -8% 0px" }}
                  whileHover={{
                    y: -8,
                    rotateY: isLeft ? 5 : -5,
                    rotateX: 2,
                    scale: 1.018,
                    transition: { duration: 0.28, ease: "easeOut" },
                  }}
                  className={[
                    "group relative w-full md:w-[calc(50%-3rem)]",
                    "experience-glass-card",
                    isLeft ? "md:mr-auto" : "md:ml-auto",
                  ].join(" ")}
                >
                  {/* Outer glow halo */}
                  <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-400/5 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                  {/* Card */}
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.82))] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.38)] backdrop-blur-2xl transition-all duration-500 group-hover:border-emerald-500/35 group-hover:shadow-[0_16px_60px_rgba(16,185,129,0.10)] sm:p-6">
                    {/* top shimmer */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                    {/* subtle corner glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl transition duration-500 group-hover:bg-emerald-400/15" />

                    {/* Header row */}
                    <div
                      className={[
                        "mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
                        isLeft ? "md:flex-row-reverse md:text-left" : "md:text-left",
                      ].join(" ")}
                    >
                      {/* Date/Location - appears first on left cards due to flex-row-reverse */}
                      <div
                        className={[
                          "flex flex-col gap-1.5 text-[11px] text-slate-400 sm:text-xs",
                          isLeft ? "md:order-first" : "",
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1.5">
                          <CalendarDays size={13} className="text-emerald-300/80" />
                          {exp.period}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-900/70 px-3 py-1.5">
                          <MapPin size={13} className="text-emerald-300/80" />
                          {exp.location}
                        </span>
                      </div>

                      {/* Role/Company - appears last on left cards due to flex-row-reverse */}
                      <div className={["min-w-0"].join(" ")}>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.12)]">
                            <BriefcaseBusiness size={18} />
                          </span>
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                            Experience
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-50 sm:text-xl">
                          {exp.role}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-emerald-300 sm:text-base">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-3 text-sm text-slate-300 sm:text-[15px]">
                      {exp.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className={[
                            "flex items-start gap-3 leading-relaxed",
                            isLeft ? "md:text-left" : "md:text-left",
                          ].join(" ")}
                        >
                          <span className="mt-0.5 shrink-0 rounded-full bg-emerald-500/10 p-1 text-emerald-300/90 transition-transform duration-300 group-hover:scale-110">
                            <SendHorizontal size={12} />
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    {exp.tags?.length ? (
                      <div
                        className={[
                          "mt-6 flex flex-wrap gap-2",
                          isLeft ? "md:justify-start" : "md:justify-start",
                        ].join(" ")}
                      >
                        {exp.tags.map((tag) => (
                          <span key={tag} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}



function ProjectsSection() {
  const [expanded, setExpanded] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
 
  // Separate featured (4) and additional projects
  const featuredProjects = projects.slice(0, 4);
  const additionalProjects = projects.slice(4);
  const displayedProjects = expanded ? projects : featuredProjects;
 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };
 
  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
  };
 
  return (
    <motion.section
      id="projects"
      className="section-container relative pb-32 scroll-mt-24 md:scroll-mt-28 overflow-hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.1 },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
    >
      {/* 🔥 Animated background gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-32 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_70%)] blur-3xl" />
 
      {/* HEADER with animated underline */}
      <motion.div
        className="mb-16 flex flex-col gap-2"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <motion.span
            className="h-12 w-1 rounded-full bg-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: false }}
          />
          <div>
            <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-slate-50">
              <motion.div
                initial={{ rotate: -20 }}
                whileInView={{ rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: false }}
              >
                <FolderCode size={32} className="text-emerald-400" />
              </motion.div>
              Projects
            </h2>
            <motion.p
              className="mt-2 text-sm text-slate-400 sm:text-base"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: false }}
            >
              Crafted solutions across Web, backend systems, and mobile experiences
              {additionalProjects.length > 0 && (
                <span className="ml-1 text-emerald-400">
                  ({projects.length} total)
                </span>
              )}
            </motion.p>
          </div>
        </div>
      </motion.div>
 
      {/* GRID with staggered animations */}
      <motion.div
        className="grid gap-6 lg:gap-8 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.15, margin: "-100px" }}
      >
        <AnimatePresence mode="wait">
          {displayedProjects.map((project, index) => (
            <motion.article
              key={project.name}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onHoverStart={() => setHoveredProject(project.name)}
              onHoverEnd={() => setHoveredProject(null)}
              className="group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-500"
              style={{ perspective: "1200px" }}
            >
              {/* Background with gradient glow */}
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.9))] rounded-3xl" />
              <div className="absolute inset-0 -z-10 rounded-3xl border border-slate-800/60 transition duration-500 group-hover:border-emerald-500/40" />
 
              {/* Animated glow halo on hover */}
              <motion.div
                className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-emerald-500/10 to-cyan-400/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100 -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
 
              {/* Gradient shimmer on top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
 
              {/* PREVIEW IMAGE or gradient placeholder */}
              {project.preview ? (
                <motion.div
                  className="relative h-56 w-full overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-700/40 to-slate-900/60"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src={project.preview}
                    alt={project.name}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </motion.div>
              ) : (
                <div className="relative h-32 w-full rounded-t-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-slate-900/60 overflow-hidden">
                  {/* Animated gradient background for backend projects */}
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.2),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.15),transparent_50%)]" />
                  </div>
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-emerald-400/40">
                      <FolderCode size={40} />
                    </div>
                  </div>
                </div>
              )}
 
              {/* CONTENT SECTION */}
              <div className="relative flex flex-col gap-4 p-6 sm:p-7">
                {/* Header with type badge and actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
                        {project.type || "Project"}
                      </span>
                      {project.featured && (
                        <span className="inline-flex px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider text-amber-300 animate-pulse">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
 
                    <motion.h3
                      className="text-xl sm:text-2xl font-bold text-slate-50 group-hover:text-emerald-300 transition duration-300 line-clamp-2"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1, letterSpacing: "0.02em" }}
                    >
                      {project.name}
                    </motion.h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400">
                      {project.period}
                    </p>
                  </div>
 
                  {/* Action icons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.codeUrl && (
                      <motion.a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/50 text-slate-400 transition hover:bg-emerald-500/20 hover:text-emerald-300 hover:border hover:border-emerald-500/40"
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={16} />
                      </motion.a>
                    )}
 
                    {project.demoUrl && (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 transition hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-400/60"
                        whileHover={{ scale: 1.15, y: -2, rotate: 45 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SquareArrowOutUpRight size={16} />
                      </motion.a>
                    )}
                  </div>
                </div>
 
                {/* Description */}
                <motion.p
                  className="text-sm text-slate-300 leading-relaxed line-clamp-2"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {project.description}
                </motion.p>
 
                {/* Bullets with animated dots */}
                {project.bullets && project.bullets.length > 0 && (
                  <motion.ul
                    className="space-y-2 text-xs text-slate-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                  >
                    {project.bullets.slice(0, 2).map((bullet, idx) => (
                      <motion.li
                        key={bullet}
                        className="flex items-start gap-2.5"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: false }}
                      >
                        <motion.span
                          className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] flex-shrink-0"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ type: "spring", delay: idx * 0.1 }}
                          viewport={{ once: false }}
                        />
                        <span className="leading-relaxed pt-0.5">{bullet}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
 
                {/* Tags with hover effects */}
                <motion.div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <motion.span
                      key={tag}
                      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] sm:text-xs font-medium text-emerald-300 backdrop-blur-md transition group-hover:border-emerald-400/50 group-hover:bg-emerald-500/15"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      viewport={{ once: false }}
                      whileHover={{
                        scale: 1.08,
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
 
      {/* VIEW MORE / COLLAPSE BUTTON */}
      {additionalProjects.length > 0 && (
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="group relative inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-8 py-3.5 font-semibold text-emerald-300 backdrop-blur-md transition duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow background */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-500/20 via-transparent to-cyan-400/20 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />
 
            <span className="relative">
              {expanded ? "Show Less Projects" : `View More Projects`}
              {additionalProjects.length > 0 && (
                <span className="ml-2 text-sm font-normal opacity-80">
                  ({additionalProjects.length})
                </span>
              )}
            </span>
 
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
 
      {/* Decorative elements */}
      <div className="pointer-events-none absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05),transparent_70%)] blur-3xl" />
    </motion.section>
  );
}


// function AwardsSection() {
//   if (!awards?.length) return null;

//   return (
//     <motion.section
//       id="awards"
//       className="section-container pb-16 scroll-mt-24 md:scroll-mt-28"
//       variants={sectionVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ amount: 0.2 }}
//     >
//       <div className="mb-6 flex items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <span className="h-8 w-1 rounded-full bg-emerald-500/80" />
//           <div>
//             <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-50 sm:text-2xl">
//               <Trophy size={18} className="text-emerald-300" aria-hidden="true" />
//               Awards & Bounties
//             </h2>
//             <p className="mt-1 text-xs text-slate-400 sm:text-sm">
//               Recognition for impact, innovation, and delivery.
//             </p>
//           </div>
//         </div>
//       </div>
//       <motion.div
//         className="grid gap-4 md:grid-cols-3"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ amount: 0.2 }}
//         transition={{ staggerChildren: 0.08 }}
//       >
//         {awards.map((award) => (
//           <motion.article
//             key={award.title}
//             className="card space-y-2 transition-transform hover:-translate-y-1"
//             variants={cardVariants}
//           >
//             <h3 className="text-sm font-semibold text-slate-100">
//               {award.title}
//             </h3>
//             <p className="text-[11px] text-emerald-300">
//               {award.issuer} · {award.date}
//             </p>
//             <p className="text-xs text-slate-300">{award.description}</p>
//           </motion.article>
//         ))}
//       </motion.div>
//     </motion.section>
//   );
// }

// Cloudflare Turnstile globals
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

function ContactSection() {
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
  // Turnstile callback is registered once per `siteKey`. Keep a ref to the latest
  // tab selection so `submitForm()` sends the correct `mode` to the API.
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
              "Sorry about that! The security check couldn’t be completed — please refresh the page and try again.",
            );
          }
        },
        "timeout-callback": () => {
          setTurnstileToken(null);
          if (pendingSubmissionRef.current) {
            pendingSubmissionRef.current = false;
            showFormError(
              "Sorry about that! The security check couldn’t be completed — please refresh the page and try again.",
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
      // Clear resume attachment after successful submissi
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

            // Always request a fresh Turnstile token for each submission.
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
                        // href="https://www.visa.co.uk/en_gb/jobs/"
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
                    ? "Write the response in a third-person narrative format (e.g., “Rohit has improved pipeline efficiency by 10%”).\n\nTip: Add numbers to make it more impactful as shown in the example 😉"
                    : "Tell me a bit about what you have in mind... 🤔"
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

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90">
      <div className="section-container flex flex-col items-center justify-between gap-3 py-4 text-[11px] text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-500">
          {profile.roles.join(" · ")}
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main>
          <Hero />
          <About/>
          <ExperienceSection />
          <ProjectsSection />
          {/* <AwardsSection /> */}
          <SkillsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
