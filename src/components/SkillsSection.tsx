"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
      <span
        className="
          relative z-10 transition-all duration-300
          group-hover:text-emerald-200
          group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.35)]
        "
      >
        {label}
      </span>

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

      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 blur-xl transition duration-300
          bg-emerald-400/15
          group-hover:opacity-100
        "
      />

      <div
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 transition duration-300
          bg-emerald-300/5
          group-hover:opacity-100
        "
      />

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
        className="flex gap-5"
        animate={{
          x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          ease: "linear",
          duration: 16,
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

export default function SkillsSection() {
  const containerRef = useRef(null);

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
      className="relative overflow-hidden py-16 sm:py-28 bg-slate-950"
    >
      <div className="pointer-events-none absolute inset-0 z-10 
        [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" />

      <div className="relative z-20 mb-20 px-6 text-center">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] text-emerald-400 mb-3 sm:mb-4">
          04. Capabilities
        </h2>
        <h3 className="text-3xl sm:text-5xl font-bold text-slate-100">
          Technical Arsenal
        </h3>
      </div>

      <div className="relative z-0 flex flex-col gap-8 rotate-[-2deg] w-[110%] -ml-[5%]">
        <MarqueeRow items={row1} direction={1}  />
        <MarqueeRow items={row2} direction={-1}  />
        <MarqueeRow items={row3} direction={1}  />
      </div>
    </section>
  );
}
