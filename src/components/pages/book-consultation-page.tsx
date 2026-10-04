import React, { useEffect } from "react";
import { ConsultationFlow, FloorPlanType } from "../consultation-flow";
import { Link, useRouter } from "../../lib/router";
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

export function BookConsultationPage() {
  const { path } = useRouter();

  const queryBhk =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("bhk")
      : null;

  let initialBhk: FloorPlanType | undefined = undefined;
  if (queryBhk) {
    const q = queryBhk.toUpperCase().replace(/\s+/g, "");
    if (q.includes("1")) initialBhk = "1 BHK";
    else if (q.includes("2")) initialBhk = "2 BHK";
    else if (q.includes("3")) initialBhk = "3 BHK";
    else if (q.includes("4") || q.includes("VILLA")) initialBhk = "4 BHK / Villa";
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24">
      {/* Breadcrumb Header Banner */}
      <section className="bg-[var(--secondary)]/60 border-b border-[var(--border)] py-8 md:py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center space-x-2 text-xs text-[var(--muted-foreground)] mb-3">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[var(--foreground)] font-medium">Book Free Consultation</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs uppercase tracking-wider font-bold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant Cost Estimator &amp; 3D Design Session</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)]">
              Calculate Your 1, 2, or 3 BHK Interior Cost &amp; Connect on WhatsApp
            </h1>

            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
              Select your Mumbai apartment floor plan, pick the rooms you want to design, see instant itemized pricing, and receive a verified 3D layout consultation directly on WhatsApp.
            </p>
          </div>

          {/* Key Value Badges */}
          <div className="mt-6 pt-6 border-t border-[var(--border)]/70 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-semibold text-[var(--foreground)]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              10-Year Hardware Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-600" />
              60-Day Dream Home Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
              100% Price Transparency (Zero Escalation)
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-600" />
              Direct WhatsApp Desk (+91 7903038750 / +91 8788516537)
            </span>
          </div>
        </div>
      </section>

      {/* Main Estimator Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[var(--border)] p-6 sm:p-10 shadow-lg">
            <ConsultationFlow isFullPage={true} initialBhk={initialBhk} />
          </div>
        </div>
      </section>

      {/* FAQ & Trust Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5">
            Everything you need to know about our instant room-by-room cost estimator and free consultation.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[var(--border)] space-y-1.5">
            <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[var(--accent)] shrink-0" />
              How accurate is the price calculated here?
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pl-6">
              Our instant calculator is calibrated using real Mumbai turnkey project data. Over 95% of our final executed project bills stay strictly within the estimated price range shown here. Any variations only occur if you choose exotic natural stones or luxury smart motorized fittings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--border)] space-y-1.5">
            <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[var(--accent)] shrink-0" />
              Is the 3D design consultation really 100% free?
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pl-6">
              Yes, absolutely. You receive a dedicated 1-on-1 consultation session with our Senior Principal Architect, preliminary 2D space layouts, material swatches (18mm semi-marine ply, acrylic, quartz samples), and an itemized BOQ with zero upfront fee or commitment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--border)] space-y-1.5">
            <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[var(--accent)] shrink-0" />
              How does the WhatsApp consultation work?
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pl-6">
              As soon as you submit your requirements, the formatted quote with your chosen floor plan and selected works opens automatically in WhatsApp with our design desk (+91 7903038750 / +91 8788516537). Our architect will review your floor plan, share matching project photos, and schedule an on-site visit.
            </p>
          </div>
        </div>

        {/* Bottom Floating Contact Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold">Prefer a direct call with our Mumbai Studio?</div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Call our Senior Principal Architect directly at +91 7903038750 or +91 8788516537 • Email: interiorpoints97@gmail.com
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:+917903038750"
              className="px-4 py-2 rounded-full bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-colors"
            >
              Call +91 7903038750
            </a>
            <a
              href="tel:+918788516537"
              className="px-4 py-2 rounded-full bg-neutral-800 text-white text-xs font-bold hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Call +91 8788516537
            </a>
            <a
              href="https://wa.me/917903038750?text=Hi%20Interior%20Points%2C%20I%20am%20looking%20for%20a%20home%20interior%20consultation."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
