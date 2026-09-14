import React, { useState } from "react";
import { ContactSection } from "../sections/contact";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { Link } from "../../lib/router";

const faqs = [
  {
    q: "Is the initial 3D design consultation truly free?",
    a: "Yes, completely free with zero obligation. You can visit our Indiranagar (Bengaluru) or Bandra (Mumbai) studio with your floorplan, or meet virtually. We review your layout, show physical finish swatches, and provide an itemized ballpark BOQ at no charge.",
  },
  {
    q: "How does the 45-Day Move-in Guarantee work?",
    a: "Once you approve the finalized 3D renders and complete the initial site laser survey, our clock starts. We fabricate in our automated factory and assemble on site. If we do not hand over keys by day 45, we compensate you ₹1,000 per day delayed directly deducted from your final milestone.",
  },
  {
    q: "Can I choose my own laminate or acrylic brands?",
    a: "Absolutely. While we partner closely with Merino, Greenlam, Rehau, and Fenix, you are free to pick any grade. All wet zones in kitchens are strictly built using IS 710 Boiling Water Proof (BWP) marine plywood.",
  },
  {
    q: "Do you handle civil work, painting, and deep cleaning?",
    a: "Yes, Interior Points provides complete turnkey execution. That includes civil wall modifications, electrical rewiring, plumbing, gypsum false ceilings with cove lights, Asian Paints Royale luxury emulsion, and a professional HEPA deep clean before handover.",
  },
  {
    q: "What warranty coverage do you provide post-handover?",
    a: "We provide a 10-year warranty on all Blum/Hafele hardware and a 5-year warranty on modular woodwork. Plus, our care team provides three complimentary maintenance visits at month 3, 6, and 12.",
  },
];

export function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[var(--background)] min-h-screen">
      {/* Page Header */}
      <div className="bg-[var(--secondary)]/40 border-b border-[var(--border)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[var(--accent-foreground)] font-semibold mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Contact & Consultation</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            Connect with Our Design Architects
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2 font-body max-w-2xl">
            Schedule an on-site consultation, visit our experience center, or chat with us for
            instant floorplan review.
          </p>
        </div>
      </div>

      {/* Main Contact Section */}
      <ContactSection standalone={true} />

      {/* FAQ Accordion Section */}
      <section className="py-16 md:py-20 border-t border-[var(--border)] bg-[var(--secondary)]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-2">
              Everything You Need to Know Before Starting
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[var(--radius)] border border-[var(--border)] bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between font-display text-lg font-semibold text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-[var(--muted-foreground)] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)]/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
