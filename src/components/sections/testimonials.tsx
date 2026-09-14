import React, { useState, useEffect } from "react";
import { Testimonial } from "../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { initialTestimonials } from "../../../server/seedData";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTestimonials(data.data);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err));
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section id="testimonials" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
            Client Voices
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
            Stories from Completed Interior Points Residences
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed font-body">
            Direct, unedited feedback from homeowners who entrusted our studio with their primary homes.
          </p>
        </div>

        {/* Minimalist Editorial Testimonial (Non-Boxy) */}
        {current && (
          <div className="max-w-4xl py-6 space-y-8">
            <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-[var(--foreground)] leading-snug font-normal">
              "{current.quote}"
            </blockquote>

            <div className="flex items-center justify-between pt-8 border-t border-[var(--border)] flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                {current.avatar && (
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="h-12 w-12 rounded-full object-cover border border-[var(--border)]"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    {current.name}
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] font-body">
                    {current.bhkType} • {current.location}
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center space-x-3">
                <span className="text-xs text-[var(--muted-foreground)] font-mono">
                  0{currentIndex + 1} / 0{testimonials.length}
                </span>
                <button
                  onClick={prevTestimonial}
                  className="h-9 w-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="h-9 w-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
                  aria-label="Next story"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
