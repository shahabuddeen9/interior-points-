import React, { useState } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { pricingPlans } from "../../../server/seedData";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "motion/react";

export function Pricing({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const [selectedBhk, setSelectedBhk] = useState<"1 BHK" | "2 BHK" | "3 BHK">("2 BHK");

  return (
    <section id="pricing" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
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
              <span>Investment Guide • Mumbai</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
              Transparent Estimates by Home Size
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
              Every home receives an itemized, line-by-line Bill of Quantities before work begins.
              Our turnkey 60-day dream home package guarantees zero hidden costs.
            </p>
          </motion.div>

          {/* Clean BHK Selector with Motion Pill */}
          <div className="inline-flex p-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] shrink-0">
            {(["1 BHK", "2 BHK", "3 BHK"] as const).map((bhk) => {
              const isActive = selectedBhk === bhk;
              return (
                <button
                  key={bhk}
                  onClick={() => setSelectedBhk(bhk)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors z-10 ${
                    isActive
                      ? "text-[var(--primary-foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBhkPill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-[var(--primary)] shadow-xs -z-10"
                    />
                  )}
                  <span>{bhk}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Editorial Columns with Motion Stagger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => {
            const price = plan.startingRange[selectedBhk];
            const isFeatured = plan.name.includes("60-Day");

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative flex flex-col justify-between p-8 rounded-[var(--radius)] border transition-all duration-300 ${
                  isFeatured
                    ? "bg-white border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/20"
                    : "bg-white border-[var(--border)] hover:border-[var(--accent)] shadow-xs"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-[var(--accent)] text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Tier Title */}
                  <div className="border-b border-[var(--border)] pb-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                        {plan.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[var(--accent-foreground)] px-2 py-0.5 rounded bg-[var(--secondary)]">
                        {selectedBhk}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed font-body">
                      {plan.tagline}
                    </p>
                    <div className="mt-4">
                      <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] block font-medium">
                        Estimated Budget
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={price}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="font-display text-3xl font-bold text-[var(--foreground)] mt-0.5"
                        >
                          {price}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground)]">
                      Specification &amp; Warranty
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
                    variant={isFeatured ? "primary" : "outline"}
                    size="md"
                    className="w-full text-xs font-semibold uppercase tracking-wider transition-colors group"
                    onClick={onOpenConsultation}
                  >
                    <span>Request {plan.name} Spec</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
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
