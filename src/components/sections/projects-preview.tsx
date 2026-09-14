import React, { useState, useEffect } from "react";
import { Project } from "../../types";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "../../lib/router";
import { initialProjects } from "../../../server/seedData";
import { motion, AnimatePresence } from "motion/react";

export function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const filterOptions = ["All", "1 BHK", "2 BHK", "3 BHK"];

  const filteredProjects =
    activeFilter === "All"
      ? projects.slice(0, 6)
      : projects.filter((p) => p.bhkType === activeFilter).slice(0, 6);

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-[var(--border)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs uppercase tracking-[0.2em] text-[var(--accent-foreground)] font-semibold font-body mb-3">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Completed Handover Archive</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
              Recent Residential Handings
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
              Every home showcased here is an actual residence designed, factory-fabricated, and handed
              over to homeowners across Mumbai within our strict 60-day delivery commitment.
            </p>
          </motion.div>

          {/* BHK Filter tabs with Motion pill */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-white"
                      : "bg-[var(--secondary)]/50 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[var(--primary)] -z-10 shadow-xs"
                    />
                  )}
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimalist Editorial Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block space-y-4"
                >
                  {/* Image Frame with Motion Hover */}
                  <div className="relative aspect-[16/11] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)] shadow-xs">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-white border border-white/10">
                      {project.bhkType}
                    </div>
                  </div>

                  {/* Editorial Caption Underneath */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span className="uppercase tracking-wider font-semibold text-[var(--accent-foreground)]">
                        {project.timeline} Turnkey
                      </span>
                      <span>{project.location}, {project.city}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed font-body">
                      {project.description}
                    </p>

                    <div className="text-xs font-semibold text-[var(--foreground)] pt-1 flex items-center justify-between">
                      <span>Package: {project.budgetRange}</span>
                      <span className="text-[var(--accent-foreground)] text-[11px] group-hover:underline">
                        View Project Tour →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Archive CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center pt-8 border-t border-[var(--border)]"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors group"
          >
            <span>Explore All Completed Residences</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
