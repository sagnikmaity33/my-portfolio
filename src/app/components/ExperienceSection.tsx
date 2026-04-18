import { useRef } from "react";
import { useScroll, useTransform, motion, Variants } from "framer-motion";
import { experiences } from "@/data/content";
import { BriefcaseBusiness, CalendarDays, MapPin, SendHorizontal } from "lucide-react";

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

export function ExperienceSection() {
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
                        isLeft ? "md:text-right" : "md:text-left",
                      ].join(" ")}
                    >
                      <div className={["min-w-0", isLeft ? "md:order-2" : ""].join(" ")}>
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

                      <div
                        className={[
                          "flex flex-col gap-1.5 text-[11px] text-slate-400 sm:text-xs",
                          isLeft
                            ? "md:items-end md:text-right md:order-1"
                            : "md:items-start md:text-left",
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
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-3 text-sm text-slate-300 sm:text-[15px]">
                      {exp.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className={[
                            "flex items-start gap-3 leading-relaxed",
                            isLeft ? "md:flex-row-reverse md:text-right" : "md:text-left",
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
                          isLeft ? "md:justify-end" : "md:justify-start",
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


export default ExperienceSection;