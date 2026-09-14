import React, { useState, useEffect } from "react";
import { Project } from "../../types";
import { ArrowRight, ArrowUpRight, MapPin, Clock } from "lucide-react";
import { Link } from "../../lib/router";
import { initialProjects } from "../../../server/seedData";

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
    <section id="projects" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-[var(--border)]">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
              Completed Handover Archive
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
              Recent Residential Handings
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
              Every home showcased here is an actual residence designed, factory-fabricated, and handed
              over to homeowners in Bengaluru, Mumbai, and Hyderabad.
            </p>
          </div>

          {/* BHK Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                  activeFilter === opt
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--secondary)]/50 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Minimalist Editorial Projects Grid (Photographic Primacy) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block space-y-4"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/11] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)]">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Editorial Caption Underneath */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <span className="uppercase tracking-wider font-semibold text-[var(--accent-foreground)]">
                    {project.bhkType} • {project.timeline}
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

                <div className="text-xs font-medium text-[var(--foreground)] pt-1">
                  Budget: {project.budgetRange}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Archive CTA */}
        <div className="mt-16 text-center pt-8 border-t border-[var(--border)]">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors"
          >
            <span>Explore All Completed Residences</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
