import React, { useState } from "react";
import { MessageCircle, Phone, Calendar, Sparkles } from "lucide-react";

interface FloatingActionsProps {
  onOpenConsultation: () => void;
}

export function FloatingActions({ onOpenConsultation }: FloatingActionsProps) {
  return (
    <aside aria-label="Quick contact actions" className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2.5">
      {/* Quick Call Action */}
      <a
        href="tel:+917903038750"
        className="h-11 w-11 rounded-full bg-white text-[var(--foreground)] border border-[var(--border)] shadow-md flex items-center justify-center hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all group"
        aria-label="Call studio"
        title="Direct Phone Consultation (+91 7903038750)"
      >
        <Phone className="h-4 w-4 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors" />
      </a>

      {/* WhatsApp Action */}
      <a
        href="https://wa.me/917903038750?text=Hello%20Interior%20Points,%20I'm%20interested%20in%20a%20free%20design%20consultation%20for%20my%20home."
        target="_blank"
        rel="noreferrer"
        className="h-11 w-11 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        aria-label="WhatsApp consultation"
        title="Chat on WhatsApp (+91 7903038750)"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      {/* Book Consultation Trigger */}
      <button
        onClick={onOpenConsultation}
        className="h-12 px-4 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xl flex items-center space-x-2 hover:bg-black hover:scale-105 active:scale-95 border border-[var(--accent)]/40 transition-all font-medium text-xs uppercase tracking-wider"
        aria-label="Get a Free Consultation"
      >
        <Calendar className="h-4 w-4 text-[var(--accent)]" />
        <span className="hidden sm:inline">Get a Quote</span>
      </button>
    </aside>
  );
}
