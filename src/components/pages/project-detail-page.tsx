import React, { useState, useEffect } from "react";
import { Project } from "../../types";
import { Link, useRouter } from "../../lib/router";
import { MapPin, Clock, ArrowLeft, ShieldCheck, Check, Star, Quote, ChevronRight, Share2, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { initialProjects } from "../../../server/seedData";

export function ProjectDetailPage({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const { params, navigate } = useRouter();
  const slug = params.slug;

  const [project, setProject] = useState<Project | null>(() => {
    return initialProjects.find((p) => p.slug === slug || p.id === slug) || null;
  });
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/projects/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProject(data.data);
        }
      })
      .catch((err) => console.error("Error loading project detail:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!project) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[var(--background)]">
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">
          Project Not Found
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">
          The requested project record could not be located.
        </p>
        <Button variant="primary" size="md" onClick={() => navigate("/projects")} className="mt-6">
          Back to Portfolio
        </Button>
      </div>
    );
  }

  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  return (
    <div className="py-10 md:py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xs bg-[var(--primary)] text-white text-xs font-semibold uppercase tracking-wider">
              {project.bhkType}
            </span>
            <span className="px-3 py-1 rounded-xs bg-[var(--secondary)] text-[var(--foreground)] text-xs font-semibold uppercase tracking-wider border border-[var(--border)]">
              {project.location}, {project.city}
            </span>
          </div>
        </div>

        {/* Project Title & Narrative */}
        <div className="max-w-4xl space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)]">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed font-body">
            {project.description}
          </p>
        </div>

        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[16/9] md:aspect-[21/10] rounded-[var(--radius)] overflow-hidden border border-[var(--border)] shadow-md bg-neutral-100">
            <img
              src={images[activeImageIndex]}
              alt={`${project.title} gallery shot ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xs text-xs text-white">
              Photo {activeImageIndex + 1} of {images.length}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 w-28 rounded-xs overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30 scale-102"
                      : "border-[var(--border)] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Meta Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-[var(--radius)] bg-white border border-[var(--border)] shadow-xs">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium">
              Home Configuration
            </div>
            <div className="font-display text-xl font-bold text-[var(--foreground)] mt-0.5">
              {project.bhkType}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium">
              Execution Timeline
            </div>
            <div className="font-display text-xl font-bold text-[var(--foreground)] mt-0.5 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[var(--accent)]" />
              {project.timeline}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium">
              Investment Bracket
            </div>
            <div className="font-display text-xl font-bold text-[var(--foreground)] mt-0.5">
              {project.budgetRange}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-medium">
              Location
            </div>
            <div className="font-display text-xl font-bold text-[var(--foreground)] mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[var(--accent)]" />
              {project.location}
            </div>
          </div>
        </div>

        {/* Detailed Scope of Work & Client Testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Scope of Work */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[var(--radius)] border border-[var(--border)] shadow-xs space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                Scope of Work & Architectural Interventions
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Bespoke millwork engineered, pre-fabricated in factory, and assembled on site.
              </p>
            </div>

            <ul className="space-y-3.5">
              {project.scope.map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm text-[var(--foreground)]">
                  <span className="h-5 w-5 rounded-full bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[var(--border)]/70 flex flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--muted-foreground)] mr-2 self-center">
                Room Elements:
              </span>
              {project.roomTypes.map((room, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xs bg-[var(--secondary)] text-[var(--foreground)] text-xs font-medium"
                >
                  {room}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial & Consultation Card */}
          <div className="lg:col-span-5 space-y-6">
            {project.clientTestimonial && (
              <div className="bg-[var(--secondary)]/40 p-8 rounded-[var(--radius)] border border-[var(--border)] relative space-y-4">
                <Quote className="h-10 w-10 text-[var(--accent)]/40 absolute top-4 right-4" />
                <div className="flex items-center space-x-1 text-[#c49b4c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="font-display text-lg text-[var(--foreground)] italic font-normal leading-relaxed">
                  "{project.clientTestimonial.quote}"
                </blockquote>
                <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                  — {project.clientTestimonial.clientName}
                </div>
              </div>
            )}

            {/* Custom CTA Box */}
            <div className="bg-[var(--primary)] text-[var(--primary-foreground)] p-8 rounded-[var(--radius)] space-y-4 shadow-sm">
              <h4 className="font-display text-2xl font-bold">
                Admire the craftsmanship in this {project.bhkType}?
              </h4>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-body">
                Let our senior architects design a customized layout for your apartment floorplan with
                transparent itemized costing.
              </p>
              <Button
                variant="gold"
                size="md"
                onClick={onOpenConsultation}
                className="w-full text-xs font-semibold uppercase tracking-wider"
              >
                Get a Quote for Your Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
