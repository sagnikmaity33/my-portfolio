"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Github,
  SquareArrowOutUpRight,
  FolderCode,
  ChevronDown,
} from "lucide-react";
import { projects } from "@/data/content";
import { sectionVariants, cardVariants } from "@/lib/constants";

export default function ProjectsSection() {
  const [expanded, setExpanded] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
 
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
 
  const cardVariantsInternal = {
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
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-32 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_70%)] blur-3xl" />
 
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
              variants={cardVariantsInternal}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onHoverStart={() => setHoveredProject(project.name)}
              onHoverEnd={() => setHoveredProject(null)}
              className="group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-500"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(2,6,23,0.9))] rounded-3xl" />
              <div className="absolute inset-0 -z-10 rounded-3xl border border-slate-800/60 transition duration-500 group-hover:border-emerald-500/40" />
 
              <motion.div
                className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-emerald-500/10 to-cyan-400/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100 -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
 
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
 
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </motion.div>
              ) : (
                <div className="relative h-32 w-full rounded-t-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-slate-900/60 overflow-hidden">
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
 
              <div className="relative flex flex-col gap-4 p-6 sm:p-7">
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
 
                <motion.p
                  className="text-sm text-slate-300 leading-relaxed line-clamp-2"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {project.description}
                </motion.p>
 
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
 
      <div className="pointer-events-none absolute bottom-0 -right-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05),transparent_70%)] blur-3xl" />
    </motion.section>
  );
}
