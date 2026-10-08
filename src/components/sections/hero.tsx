import React from "react";
import { ArrowRight, ShieldCheck, Clock, Award, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "../../lib/router";
import { motion } from "motion/react";

export function Hero({
  onOpenConsultation,
}: {
  onOpenConsultation: (bhk?: "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK / Villa") => void;
}) {
  const { navigate } = useRouter();

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-20 md:pb-24 border-b border-[var(--border)]">
      {/* Soft Ambient Light Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Text Column with Motion Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-bold uppercase tracking-wider text-amber-900">
                Get Your Dream Home Interior Done in 60 Days!
              </span>
              <span className="text-amber-500">•</span>
              <span className="font-semibold text-neutral-700">Turnkey Packages from ₹8.45L</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-[var(--foreground)] leading-[1.08]"
            >
              Designing Spaces. <br />
              <span className="italic font-normal text-[var(--accent-foreground)]/90">
                Creating Experiences.
              </span>
            </motion.h1>

            {/* Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl font-body"
            >
              Bespoke 1, 2, and 3 BHK home interiors designed for modern Indian living.
              From German-engineered modular kitchens and floor-to-ceiling wardrobes to architectural
              cove lighting — executed with transparent pricing, in-house craftspeople, and zero surprise costs.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenConsultation()}
                className="group flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
              >
                <span>Book a Free Consultation</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/projects")}
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Explore Selected Residences
              </Button>
            </motion.div>

            {/* 1/2/3 BHK Quick Cost Estimator Launcher */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e6dfd2] shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-bold text-[#151413] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#c59b4c]" />
                  Instant Interior Cost Estimator (10 Spaces Available)
                </span>
                <span className="text-[11px] text-[#5e594f]">
                  Pick your flat size to customize all 10 turnkey spaces &amp; forward quote to WhatsApp:
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { bhk: "1 BHK", area: "15 Services Turnkey", start: "₹8.45 Lacs" },
                  { bhk: "2 BHK", area: "15 Services Turnkey", start: "₹10.75 Lacs", popular: true },
                  { bhk: "3 BHK", area: "15 Services Turnkey", start: "₹13.75 Lacs" },
                  { bhk: "4 BHK / Villa", area: "Bespoke Villa", start: "Custom Spec" },
                ].map((item) => (
                  <button
                    key={item.bhk}
                    type="button"
                    onClick={() => onOpenConsultation(item.bhk as any)}
                    className={`relative p-2.5 sm:p-3 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      item.popular
                        ? "border-amber-400 bg-amber-50/60 shadow-xs ring-1 ring-amber-400/40"
                        : "border-[#e6dfd2] bg-[#fdfbf7] hover:bg-amber-50/30 hover:border-amber-300"
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#8a6218] text-white text-[8px] font-bold uppercase tracking-wider shadow-xs">
                        Most Popular
                      </span>
                    )}
                    <div className="text-xs sm:text-sm font-bold text-[#151413]">{item.bhk}</div>
                    <div className="text-[10px] text-[#5e594f]">{item.area}</div>
                    <div className="text-[11px] font-bold text-emerald-700 mt-1">{item.start}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Honest Credibility Bar with Fine Hairlines & Motion */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-8 mt-4 border-t border-[var(--border)] grid grid-cols-3 gap-6 text-left"
            >
              <div className="group cursor-default">
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  60 Days
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span>Dream Home Guarantee</span>
                </div>
              </div>
              <div className="group cursor-default">
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  10 Years
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span>Warranty on Hardware</span>
                </div>
              </div>
              <div className="group cursor-default">
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  350+
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span>Homes Handed Over</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual Showcase Column with Entrance Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="space-y-3">
              {/* Unboxed, architectural framing with hover effect */}
              <div className="relative aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-neutral-100 shadow-md border border-[var(--border)] group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Interior Points bespoke modular living and dining interior"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Featured Handover</span>
                </div>
              </div>

              {/* Refined editorial caption */}
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] px-1">
                <span className="font-medium text-[var(--foreground)]">
                  The Marina Crest, Bandra West, Mumbai • 3 BHK
                </span>
                <span className="italic">60-day dream home delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
