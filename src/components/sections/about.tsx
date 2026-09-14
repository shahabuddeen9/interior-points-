import React, { useState, useEffect } from "react";
import { CredibilityStat } from "../../types";
import { Check } from "lucide-react";

export function About() {
  const [stats, setStats] = useState<CredibilityStat[]>([
    {
      id: "stat-1",
      value: "8+",
      label: "Years of Practice",
      description: "Designing bespoke Indian homes with architectural rigor",
    },
    {
      id: "stat-2",
      value: "350+",
      label: "Homes Completed",
      description: "1, 2 & 3 BHK residences delivered across premier societies",
    },
    {
      id: "stat-3",
      value: "45-Day",
      label: "Move-in Guarantee",
      description: "Strict project timelines backed by penalty compensation",
    },
    {
      id: "stat-4",
      value: "10-Year",
      label: "Hardware Warranty",
      description: "Partnered exclusively with genuine Blum & Hafele hardware",
    },
  ]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setStats(data.data);
        }
      })
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
            Studio Philosophy
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
            The Boutique Alternative to Mass Contractors
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed mt-4 font-body">
            At Interior Points, we believe Indian homes deserve architectural nuance, not cookie-cutter
            catalogs. We founded Interior Points to eliminate the two biggest frustrations homeowners face:
            unpredictable cost escalations and delayed handovers.
          </p>
        </div>

        {/* 2 Column Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--foreground)] leading-snug">
              Engineered for Indian BHK floorplans and everyday domestic rituals.
            </h3>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed font-body">
              Every home we craft begins with a millimeter-accurate site survey. We evaluate wet and dry
              kitchen zones, heavy Indian cookware storage, airflow, natural daylight, and sacred spaces
              like bespoke pooja niches.
            </p>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed font-body">
              Unlike traditional on-site carpenters who generate dust, noise, and uneven hand-pressed
              edges for months, our modular cabinetry is precision machine-cut and edge-banded in our
              facility, then assembled quietly on-site in days.
            </p>

            <div className="pt-2 space-y-3">
              {[
                "100% IS 710 Boiling Water Proof (BWP) marine plywood for wet kitchen zones",
                "Zero hidden items — full itemized Bill of Quantities (BOQ) with unit rates",
                "Single dedicated Senior Project Manager for single-point accountability",
                "Weekly photo and video progress audits via your homeowner portal",
              ].map((point, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm text-[var(--foreground)]">
                  <span className="h-4 w-4 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)]">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                    alt="Precision acrylic modular kitchen"
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)] px-1">
                  German PUR edge-banding for zero moisture penetration
                </p>
              </div>

              <div className="space-y-3 pt-6 sm:pt-10">
                <div className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)]">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
                    alt="Floor-to-ceiling master wardrobe craftsmanship"
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)] px-1">
                  Floor-to-ceiling wardrobes with acoustic soft-close dampers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Non-Boxy Credibility Stats Bar */}
        <div className="pt-10 border-t border-[var(--border)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.id} className="space-y-1.5">
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)]">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] font-body">
                  {stat.label}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-[240px]">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
