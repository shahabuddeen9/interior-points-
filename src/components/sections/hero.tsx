import React from "react";
import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "../../lib/router";

export function Hero({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  const { navigate } = useRouter();

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-20 md:pb-24 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-[var(--muted-foreground)]">
                Boutique Residential Studio • Bengaluru • Mumbai • Hyderabad
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-[var(--foreground)] leading-[1.08]">
              Designing Spaces. <br />
              <span className="italic font-normal text-[var(--accent-foreground)]/90">
                Creating Experiences.
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl font-body">
              Bespoke 1, 2, and 3 BHK home interiors designed for modern Indian living.
              From German-engineered modular kitchens and floor-to-ceiling wardrobes to architectural
              cove lighting — executed with transparent pricing, in-house craftspeople, and zero surprise costs.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                className="group flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-wider"
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
            </div>

            {/* Honest Credibility Bar with Fine Hairlines */}
            <div className="pt-8 mt-4 border-t border-[var(--border)] grid grid-cols-3 gap-6 text-left">
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                  45 Days
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span>Move-in Guarantee</span>
                </div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                  10 Years
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span>Hardware Warranty</span>
                </div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                  350+
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                  <span>Homes Handed Over</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase Column */}
          <div className="lg:col-span-5">
            <div className="space-y-3">
              {/* Unboxed, architectural framing */}
              <div className="relative aspect-[4/5] rounded-[var(--radius)] overflow-hidden bg-neutral-100 shadow-sm border border-[var(--border)]">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Interior Points bespoke modular living and dining interior"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-102"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Refined editorial caption */}
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] px-1">
                <span className="font-medium text-[var(--foreground)]">
                  The Oberoi Sanctuary, Indiranagar • 3 BHK
                </span>
                <span className="italic">45-day turnkey delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
