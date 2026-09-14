import React from "react";
import { Shield, Clock, Compass, FileSpreadsheet, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative overflow-hidden">
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
            <span>Why Homeowners Choose Us</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            The Peace of Mind You Deserve
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
            Building a home should be an exciting milestone, not months of managing uncooperative
            contractors and unexpected bill escalations.
          </p>
        </motion.div>

        {/* 2 Column Editorial Comparison & Differentiators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          {/* Left Column: The Problem with Traditional Alternatives */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
              The Reality of Home Interiors in Mumbai
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
              Homeowners typically find themselves caught between two extremes:
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--muted-foreground)]">
              <motion.div
                whileHover={{ x: 4 }}
                className="p-5 rounded-[var(--radius)] bg-[var(--secondary)]/40 border-l-2 border-rose-400 space-y-1.5 transition-transform"
              >
                <span className="font-semibold text-[var(--foreground)] block">
                  Local Unorganized Contractors
                </span>
                <p className="leading-relaxed">
                  No written contracts, manual hand-pressed laminates prone to peeling, carpenter
                  absenteeism for weeks, and bills that inflate 30–50% by the end.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="p-5 rounded-[var(--radius)] bg-[var(--secondary)]/40 border-l-2 border-amber-400 space-y-1.5 transition-transform"
              >
                <span className="font-semibold text-[var(--foreground)] block">
                  Big-Box Aggregators &amp; Startups
                </span>
                <p className="leading-relaxed">
                  Heavy 35–40% marketing surcharges, impersonal customer care tickets, and outsourced
                  third-party installers who have never met the designer who drew your home.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: The Interior Points Difference */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-8"
          >
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
              Our 4 Pillars of Studio Integrity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="space-y-2 group"
              >
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <FileSpreadsheet className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                    Itemized Transparency
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  Every square foot of 18mm semi-marine ply, Hettich/Hafele hardware, and paint is
                  itemized with brand names and unit rates before you pay a single rupee.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="space-y-2 group"
              >
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <Clock className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                    60-Day Dream Home Clause
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  We commit to a handover date in writing. If we delay, we compensate you ₹1,000 per
                  day. In 2025, 96.4% of our Mumbai homes were handed over on or ahead of time.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="space-y-2 group"
              >
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <Compass className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                    Mumbai Workshop Precision
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  All cabinetry is cut, routed, and edge-banded with German PUR hot-melt adhesives in our
                  own production facility near Asalpha. No dusty on-site saw machines.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="space-y-2 group"
              >
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <Shield className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                    10-Year Hardware Warranty
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  Backed by direct OEM hardware from Hafele, Blum, and Hettich. Includes complimentary
                  deep-alignment visits in the first 24 months.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Transparent Comparison Table with Clean Hairlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-10 border-t border-[var(--border)] overflow-x-auto"
        >
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)] uppercase tracking-wider text-[11px]">
                <th className="py-3 pr-4 font-semibold">Standard Checklist</th>
                <th className="py-3 px-4 font-semibold text-neutral-400">Local Carpenter</th>
                <th className="py-3 px-4 font-semibold text-neutral-400">Big-Box Brands</th>
                <th className="py-3 pl-4 font-semibold text-[var(--foreground)] bg-[var(--secondary)]/30 rounded-t-xs">
                  Interior Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/60 font-body">
              <tr className="hover:bg-neutral-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Transparent Itemized BOQ</td>
                <td className="py-3.5 px-4 text-neutral-400">Rarely (lump sum)</td>
                <td className="py-3.5 px-4 text-neutral-400">Opaque bundle pricing</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">100% Itemized &amp; Locked</td>
              </tr>
              <tr className="hover:bg-neutral-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Move-In Timeline Commitment</td>
                <td className="py-3.5 px-4 text-neutral-400">Unpredictable (3–6 mo)</td>
                <td className="py-3.5 px-4 text-neutral-400">60–90 days average</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">Strict 60 Days with Penalty</td>
              </tr>
              <tr className="hover:bg-neutral-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Hardware Authenticity</td>
                <td className="py-3.5 px-4 text-neutral-400">Mixed / counterfeit risk</td>
                <td className="py-3.5 px-4 text-neutral-400">Proprietary private label</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">Direct Hafele / Hettich OEM</td>
              </tr>
              <tr className="hover:bg-neutral-50/50 transition-colors">
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Design Accountability</td>
                <td className="py-3.5 px-4 text-neutral-400">No architectural drawings</td>
                <td className="py-3.5 px-4 text-neutral-400">Call-centre escalations</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">Dedicated Project Architect</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
