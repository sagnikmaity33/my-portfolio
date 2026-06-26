"use client";

import { motion, type Variants } from "framer-motion";

export default function About() {
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
      className="section-container relative py-12 sm:py-28 scroll-mt-24 md:scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-10%] top-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <motion.div
        className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
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

<motion.div
  variants={itemVariants}
  className="mt-10 hidden items-center gap-4 opacity-60 lg:flex"
>
  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 animate-[spin_10s_linear_infinite]">
    
    <div className="absolute top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />

    <div className="absolute top-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,1)]" />
<div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-md" />

    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
  </div>

  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
    System Active
  </span>
</motion.div>
        </div>

        <div className="hidden lg:block lg:col-span-1" />

        <div className="lg:col-span-6 space-y-8 sm:space-y-12">
          <div className="space-y-4 sm:space-y-6 text-base leading-relaxed text-slate-300 sm:text-lg">
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

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-slate-900/80">
              <div className="mb-3 text-3xl font-bold text-emerald-400 transition group-hover:scale-105">
                10M+
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Daily Events Processed
              </div>
            </div>

            <div className="group rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:border-emerald-500/40 hover:bg-slate-900/80">
              <div className="mb-3 text-3xl font-bold text-emerald-400 transition group-hover:scale-105">
                100+
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Live Network Nodes
              </div>
            </div>

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
