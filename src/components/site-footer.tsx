import React from "react";
import { Link } from "../lib/router";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Instagram, Facebook, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e6dfd2] bg-[#f4eee3] text-[#151413] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-sm shrink-0">
                <div className="w-full h-full rounded-[10px] bg-[#151413] flex flex-col items-center justify-center">
                  <span className="font-display font-black text-sm text-amber-300 tracking-tighter leading-none">JP</span>
                  <span className="text-[6px] text-amber-200/90 uppercase tracking-widest font-bold leading-none mt-0.5">STUDIO</span>
                </div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-display text-2xl font-bold tracking-tight text-[#151413]">
                  INTERIOR POINTS
                </span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c59b4c]"></span>
              </div>
            </div>
            <p className="font-display italic text-base text-[#151413]/85">
              "Designing Spaces. Creating Experiences."
            </p>
            <p className="text-sm text-[#5e594f] leading-relaxed max-w-sm font-body">
              A premier interior design studio crafting luxury 1, 2, and 3 BHK residences,
              commercial interiors, and turnkey renovations exclusively across Mumbai. We bridge
              refined architectural aesthetics with factory-engineered precision, 18mm semi-marine ply,
              and transparent 60-day delivery packages.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-[#5e594f]">
              <a
                href="https://www.instagram.com/interior_points/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram @interior_points"
                className="h-9 w-9 rounded-full border border-[#e6dfd2] bg-white/70 flex items-center justify-center hover:text-[#8a6218] hover:border-[#c59b4c] transition-colors"
                title="Follow @interior_points on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full border border-[#e6dfd2] bg-white/70 flex items-center justify-center hover:text-[#8a6218] hover:border-[#c59b4c] transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full border border-[#e6dfd2] bg-white/70 flex items-center justify-center hover:text-[#8a6218] hover:border-[#c59b4c] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#151413] border-b border-[#e6dfd2] pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#5e594f]">
              <li>
                <Link href="/about" className="hover:text-[#151413] transition-colors">
                  Studio Story & About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#151413] transition-colors">
                  Portfolio & Featured Work
                </Link>
              </li>
              <li>
                <Link href="/reels" className="hover:text-[#151413] transition-colors">
                  Instagram Home Reels
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#151413] transition-colors">
                  Transparent BHK Pricing
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-[#151413] transition-colors">
                  Why Choose Interior Points
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-[#151413] transition-colors">
                  Homeowner Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#151413] transition-colors">
                  Book Free Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#151413] border-b border-[#e6dfd2] pb-2">
              Our Craft
            </h4>
            <ul className="space-y-2 text-sm text-[#5e594f]">
              <li>
                <Link href="/projects" className="hover:text-[#151413] transition-colors">
                  1 BHK Smart Interiors
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#151413] transition-colors">
                  2 BHK Premium Interiors
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#151413] transition-colors">
                  3 BHK Luxury Residences
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#151413] transition-colors">
                  Modular Kitchens (Acrylic & PU)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#151413] transition-colors">
                  Floor-to-Ceiling Wardrobes
                </Link>
              </li>
              <li>
                <Link href="/turnkey-package" className="hover:text-[#151413] transition-colors">
                  15-Point Turnkey Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Studios & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#151413] border-b border-[#e6dfd2] pb-2">
              Mumbai Studio & Experience Center
            </h4>
            <div className="space-y-2.5 text-xs text-[#5e594f]">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#c59b4c] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-[#151413] block">Studio Address:</strong>
                  Shop no 3, Haji Fatima Manzil, near Asalpha Metro Station, Pereira Wadi, Asalpha, Mumbai, Maharashtra 400084
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-[#c59b4c] shrink-0 mt-0.5" />
                <span>Mon – Sun: 10:00 AM – 8:30 PM IST</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-[#c59b4c] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+917903038750" className="hover:text-[#151413] font-medium text-[#151413]">
                    +91 7903038750
                  </a>
                  <a href="tel:+918788516537" className="hover:text-[#151413] text-[#151413]">
                    +91 8788516537
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-[#c59b4c] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href="mailto:interiorpoints97@gmail.com" className="hover:text-[#151413] font-medium text-[#8a6218]">
                    interiorpoints97@gmail.com
                  </a>
                  <a href="mailto:msfusionarchitects@gmail.com" className="hover:text-[#151413] text-[11px]">
                    msfusionarchitects@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#e6dfd2] flex flex-col md:flex-row items-center justify-between text-xs text-[#5e594f] gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>©</span>
            <Link
              href="/admin"
              id="admin-page-bottom-link"
              className="font-semibold text-[#151413] hover:text-[#8a6218] hover:underline transition-colors cursor-pointer"
              title="Click to access Admin Login Portal"
            >
              2026 INTERIOR POINTS Studio
            </Link>
            <span>•</span>
            <span>Pvt. Ltd. All rights reserved.</span>
            <span>•</span>
            <span>CIN: U74999MH2018PTC312345</span>
            <span>•</span>
            <span>Operating Exclusively in Mumbai</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-[11px] text-[#5e594f] hover:text-[#151413] hover:underline transition-colors"
            >
              Admin Portal
            </Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#151413]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c59b4c]" />
              100% In-House Factory Execution • 60-Day Guarantee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
