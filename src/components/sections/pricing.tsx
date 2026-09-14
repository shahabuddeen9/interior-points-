import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { pricingPlans } from "../../../server/seedData";
import { Button } from "../ui/button";

export function Pricing({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const [selectedBhk, setSelectedBhk] = useState<"1 BHK" | "2 BHK" | "3 BHK">("2 BHK");

  return (
    <section id="pricing" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 pb-8 border-b border-[var(--border)]">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
              Investment Guide
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
              Transparent Estimates by Home Size
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
              Every home receives an itemized, line-by-line Bill of Quantities before work begins.
              The figures below reflect real completed project averages.
            </p>
          </div>

          {/* Clean BHK Selector */}
          <div className="inline-flex p-1 rounded-full bg-[var(--secondary)]/60 border border-[var(--border)] shrink-0">
            {(["1 BHK", "2 BHK", "3 BHK"] as const).map((bhk) => (
              <button
                key={bhk}
                onClick={() => setSelectedBhk(bhk)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                  selectedBhk === bhk
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Editorial Columns (No cheesy SaaS cards or neon badges) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const price = plan.startingRange[selectedBhk];

            return (
              <div
                key={plan.id}
                className="flex flex-col justify-between p-8 rounded-[var(--radius)] border border-[var(--border)] bg-white hover:border-[var(--accent)] transition-colors duration-200"
              >
                <div className="space-y-6">
                  {/* Tier Title */}
                  <div className="border-b border-[var(--border)] pb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                        {plan.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[var(--accent-foreground)]">
                        {selectedBhk}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed font-body">
                      {plan.tagline}
                    </p>
                    <div className="mt-4">
                      <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] block">
                        Estimated Budget
                      </span>
                      <div className="font-display text-3xl font-bold text-[var(--foreground)] mt-0.5">
                        {price}
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground)]">
                      Specification & Warranty
                    </div>
                    <div className="space-y-2 text-xs text-[var(--muted-foreground)] font-body">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-[var(--foreground)] shrink-0">Materials:</span>
                        <span>{plan.materials}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-[var(--foreground)] shrink-0">Warranty:</span>
                        <span>{plan.warranty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground)]">
                      Included In Package
                    </div>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-[var(--foreground)]">
                        <Check className="h-3.5 w-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-[var(--border)]">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full text-xs font-semibold uppercase tracking-wider hover:bg-[var(--primary)] hover:text-white transition-colors"
                    onClick={onOpenConsultation}
                  >
                    <span>Request {plan.name} Spec</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on custom BOQs */}
        <div className="mt-12 text-center text-xs text-[var(--muted-foreground)] font-body max-w-2xl mx-auto">
          * Figures are indicative based on standard room sizes. Every Interior Points quote is backed by a locked,
          non-escalating itemized agreement prior to token advance.
        </div>
      </div>
    </section>
  );
}
