import React from "react";
import { Check, X, Shield, Clock, Compass, FileSpreadsheet } from "lucide-react";

export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
            Why Homeowners Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
            The Peace of Mind You Deserve
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
            Building a home should be an exciting milestone, not three months of managing uncooperative
            contractors and unexpected bill escalations.
          </p>
        </div>

        {/* 2 Column Editorial Comparison & Differentiators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          {/* Left Column: The Problem with Traditional Alternatives */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
              The Reality of Home Interiors in India
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
              Homeowners typically find themselves caught between two extremes:
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[var(--muted-foreground)]">
              <div className="p-5 rounded-xs bg-[var(--secondary)]/40 border-l-2 border-rose-400 space-y-1.5">
                <span className="font-semibold text-[var(--foreground)] block">
                  Local Unorganized Contractors
                </span>
                <p className="leading-relaxed">
                  No written contracts, manual hand-pressed laminates prone to peeling, carpenter
                  absenteeism for weeks during festival seasons, and bills that inflate 30–50% by the end.
                </p>
              </div>

              <div className="p-5 rounded-xs bg-[var(--secondary)]/40 border-l-2 border-amber-400 space-y-1.5">
                <span className="font-semibold text-[var(--foreground)] block">
                  Big-Box Aggregators & Tech Startups
                </span>
                <p className="leading-relaxed">
                  Heavy 35–40% marketing surcharges, impersonal customer care tickets, and outsourced
                  third-party installers who have never met the designer who drew your home.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: The Interior Points Difference */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
              Our 4 Pillars of Studio Integrity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <FileSpreadsheet className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    Itemized Transparency
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  Every square foot of BWP ply, every Blum hinge, and every litre of PU paint is
                  itemized with brand names and unit rates before you pay a single rupee.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <Clock className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    45-Day Handover Clause
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  We commit to a handover date in writing. If we delay, we compensate you ₹1,000 per
                  day. In 2025, 96.4% of our homes were handed over on or ahead of time.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <Compass className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    100% In-House Factory
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  All cabinetry is cut, routed, and edge-banded with German PUR hot-melt adhesives in our
                  own production facility. No dusty on-site saw machines in your apartment.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[var(--accent-foreground)]">
                  <Shield className="h-4 w-4" />
                  <h4 className="font-display text-lg font-bold text-[var(--foreground)]">
                    10-Year Hardware Warranty
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  Backed by direct OEM certificates from Hafele, Blum, and Hettich. Includes two
                  complimentary deep-alignment visits in the first 24 months.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Comparison Table with Clean Hairlines */}
        <div className="pt-10 border-t border-[var(--border)] overflow-x-auto">
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
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Transparent Itemized BOQ</td>
                <td className="py-3.5 px-4 text-neutral-400">Rarely (lump sum)</td>
                <td className="py-3.5 px-4 text-neutral-400">Opaque bundle pricing</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">100% Itemized & Locked</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Move-In Timeline Commitment</td>
                <td className="py-3.5 px-4 text-neutral-400">Unpredictable (3–6 mo)</td>
                <td className="py-3.5 px-4 text-neutral-400">60–90 days average</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">Strict 45 Days with Penalty</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Hardware Authenticity</td>
                <td className="py-3.5 px-4 text-neutral-400">Mixed / counterfeit risk</td>
                <td className="py-3.5 px-4 text-neutral-400">Proprietary private label</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">Direct Hafele / Blum OEM</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-medium text-[var(--foreground)]">Design Accountability</td>
                <td className="py-3.5 px-4 text-neutral-400">No architectural drawings</td>
                <td className="py-3.5 px-4 text-neutral-400">Call-centre escalations</td>
                <td className="py-3.5 pl-4 font-semibold text-emerald-800 bg-[var(--secondary)]/30">Dedicated Project Architect</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
