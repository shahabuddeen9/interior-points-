import React, { useState, useEffect } from "react";
import { CredibilityStat } from "../../types";
import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function About() {
  const [stats, setStats] = useState<CredibilityStat[]>([
    {
      id: "stat-1",
      value: "8+",
      label: "Years of Practice",
      description: "Designing bespoke Mumbai residences with architectural nuance",
    },
    {
      id: "stat-2",
      value: "350+",
      label: "Homes Handed Over",
      description: "1, 2 & 3 BHK turnkey apartments delivered with zero defect audits",
    },
    {
      id: "stat-3",
      value: "60-Day",
      label: "Dream Home Guarantee",
      description: "Strict 60-day turnkey handover backed by written delay compensation",
    },
    {
      id: "stat-4",
      value: "10-Year",
      label: "Studio Hardware Warranty",
      description: "Partnered exclusively with authentic Hettich & Hafele hardware",
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
    <section id="about" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-xs uppercase tracking-[0.2em] text-[var(--accent-foreground)] font-semibold font-body mb-3">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Studio Philosophy</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            The Boutique Alternative to Mass Contractors
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed mt-4 font-body">
            At Interior Points, we believe Indian homes deserve architectural nuance, not cookie-cutter
            catalogs. We founded Interior Points in Mumbai to eliminate the two biggest frustrations homeowners face:
            unpredictable cost escalations and delayed handovers.
          </p>
        </motion.div>

        {/* 2 Column Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
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
              Mumbai facility near Asalpha, then assembled quietly on-site in days.
            </p>

            <div className="pt-2 space-y-3">
              {[
                "Good quality sturdy 18mm semi-marine ply for longevity and moisture resistance",
                "Premium 1mm laminate selection (₹1000 – ₹1300 range) across living and bedrooms",
                "2 coats of authentic Asian Paints Royale washable luxury finish",
                "Hettich or Hafele precision soft-close hinges backed by a 10-year warranty",
                "Free 1-on-1 consultation, complete 2D architectural drawings, and 3D view site visits",
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-start space-x-3 text-sm text-[var(--foreground)]"
                >
                  <span className="h-4 w-4 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent)] shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <div className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)] group">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
                    alt="Precision acrylic modular kitchen"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)] px-1 font-body">
                  German PUR edge-banding for zero moisture penetration
                </p>
              </div>

              <div className="space-y-3 pt-6 sm:pt-10">
                <div className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-neutral-100 border border-[var(--border)] group">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
                    alt="Floor-to-ceiling master wardrobe craftsmanship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-[var(--muted-foreground)] px-1 font-body">
                  Floor-to-ceiling wardrobes with acoustic soft-close dampers
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Clean Credibility Stats Bar with Motion */}
        <div className="pt-10 border-t border-[var(--border)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-1.5 group cursor-default"
              >
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] font-body">
                  {stat.label}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-[240px]">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
