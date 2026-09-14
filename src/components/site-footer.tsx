import React from "react";
import { Link } from "../lib/router";
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Instagram, Facebook, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--secondary)]/40 text-[var(--foreground)] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--foreground)]">
                INTERIOR POINTS
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
            </div>
            <p className="font-display italic text-base text-[var(--foreground)]/80">
              "Designing Spaces. Creating Experiences."
            </p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-sm font-body">
              A boutique interior design studio crafting bespoke 1, 2, and 3 BHK homes across
              Bengaluru, Mumbai, and Hyderabad. We bridge refined architectural aesthetics with
              factory-engineered precision and transparent pricing.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[var(--muted-foreground)]">
              <a
                href="https://www.instagram.com/interior_points/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram @interior_points"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white/50 flex items-center justify-center hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                title="Follow @interior_points on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white/50 flex items-center justify-center hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full border border-[var(--border)] bg-white/50 flex items-center justify-center hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/#about" className="hover:text-[var(--foreground)] transition-colors">
                  Studio Story & About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  Portfolio & Featured Work
                </Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/interior_points/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  Instagram (@interior_points)
                </a>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[var(--foreground)] transition-colors">
                  Transparent BHK Pricing
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="hover:text-[var(--foreground)] transition-colors">
                  Why Choose Interior Points
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="hover:text-[var(--foreground)] transition-colors">
                  Homeowner Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                  Book Free Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Our Craft
            </h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  1 BHK Smart Interiors
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  2 BHK Premium Interiors
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  3 BHK Luxury Residences
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  Modular Kitchens (Acrylic & PU)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  Floor-to-Ceiling Wardrobes
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[var(--foreground)] transition-colors">
                  Gypsum & Wood False Ceilings
                </Link>
              </li>
            </ul>
          </div>

          {/* Studios & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] border-b border-[var(--border)] pb-2">
              Experience Centers
            </h4>
            <div className="space-y-2.5 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>
                  <strong>Bengaluru:</strong> 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>
                  <strong>Mumbai:</strong> Turner Rd, Bandra West, Mumbai, MH 400050
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>Mon – Sun: 10:00 AM – 8:00 PM IST</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <a href="tel:+917903038750" className="hover:text-[var(--foreground)]">
                  +91 7903038750
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <a href="mailto:hello@interiorpoints.in" className="hover:text-[var(--foreground)]">
                  hello@interiorpoints.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & SEO Seed Keywords */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} INTERIOR POINTS Studio Pvt. Ltd. All rights reserved.</span>
            <span>•</span>
            <span>CIN: U74999KA2018PTC112345</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1 text-[var(--foreground)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
              100% In-House Execution
            </span>
          </div>
        </div>

        {/* Clearly marked integration point for analytics */}
        <div
          id="analytics-provider-hook"
          data-integration="Vercel-Analytics-or-Google-Tag-Manager"
          className="hidden"
          aria-hidden="true"
        >
          {/* Analytics initialized via layout or client event emitter */}
        </div>
      </div>
    </footer>
  );
}
