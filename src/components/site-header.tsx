import React, { useState, useEffect } from "react";
import { Menu, X, Phone, ShieldCheck, Mail, Instagram, Sparkles } from "lucide-react";
import { Link, useRouter } from "../lib/router";
import { Button } from "./ui/button";
import { BrandLogo } from "./brand-logo";
import { motion, AnimatePresence } from "motion/react";

export function SiteHeader({ onOpenConsultation }: { onOpenConsultation?: () => void }) {
  const { path, navigate, isActive } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Reels", href: "/reels" },
    { name: "Cost Estimator", href: "/book-consultation", isBadge: true },
    { name: "Services", href: "/services" },
    { name: "Why Us", href: "/why-us" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#fdfbf7]/95 backdrop-blur-md shadow-xs border-b border-[#e6dfd2]"
          : "bg-[#fdfbf7]/80 backdrop-blur-xs border-b border-[#e6dfd2]/60"
      }`}
    >
      {/* Top Micro-Bar with Refined Architectural Sand & Gold Accent */}
      <div className="hidden lg:block border-b border-[#e6dfd2]/80 bg-[#f4eee3] px-6 py-1.5 text-xs text-[#5e594f]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-medium text-[#151413]">Operating Exclusively in Mumbai</span>
              <span className="text-[#787368]">• Near Asalpha Metro Station, Mumbai 400084</span>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1.5 font-semibold text-[#8a6218]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#c59b4c]" />
              60-Day Dream Home Guarantee • 10-Year Studio Warranty
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="mailto:interiorpoints97@gmail.com"
              className="flex items-center gap-1 hover:text-[#151413] transition-colors"
              title="Official Studio Email"
            >
              <Mail className="h-3 w-3 text-[#c59b4c]" />
              interiorpoints97@gmail.com
            </a>
            <span className="text-[#d8d0c2]">|</span>
            <a
              href="https://www.instagram.com/interior_points/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-[#151413] transition-colors"
            >
              <Instagram className="h-3 w-3 text-rose-500" />
              <span className="font-semibold text-[#8a6218]">@interior_points</span>
            </a>
            <span className="text-[#d8d0c2]">|</span>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-[#c59b4c]" />
              <a
                href="tel:+917903038750"
                className="hover:text-[#151413] transition-colors font-semibold text-[#151413]"
              >
                +91 7903038750
              </a>
              <span className="text-[#9e988d]">/</span>
              <a
                href="tel:+918788516537"
                className="hover:text-[#151413] transition-colors font-semibold text-[#151413]"
              >
                +91 8788516537
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Authentic Brand Logo (iP | Interior Points) */}
          <BrandLogo href="/" size="md" />

          {/* Desktop Nav with Refined Underlines & Subtle Indicators */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium tracking-wide">
            {navLinks.map((link) => {
              const current = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`py-1 transition-all flex items-center gap-1.5 ${
                    current
                      ? "text-[#151413] font-bold border-b-2 border-[#c59b4c]"
                      : "text-[#44413b] hover:text-[#151413] hover:border-b-2 hover:border-[#c59b4c]/60"
                  }`}
                >
                  {link.name === "Reels" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  )}
                  {link.name === "Cost Estimator" && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-[#8a6218] border border-amber-400/30 font-bold text-[9px] uppercase tracking-wider">
                      10 Spaces
                    </span>
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  navigate("/book-consultation");
                }
              }}
              className="text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow-md transition-all bg-[#151413] text-[#fdfbf7] hover:bg-neutral-800"
            >
              Book Free Consultation
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden space-x-2">
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                if (onOpenConsultation) {
                  onOpenConsultation();
                } else {
                  navigate("/book-consultation");
                }
              }}
              className="text-[11px] px-2.5 py-1.5 font-bold"
            >
              Free Quote
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#151413] hover:bg-black/5 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-[#e6dfd2] bg-[#fdfbf7] px-6 py-5 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const current = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base py-2 border-b border-[#e6dfd2]/60 flex items-center justify-between transition-colors ${
                      current
                        ? "font-bold text-[#151413] pl-2 border-l-2 border-l-[#c59b4c]"
                        : "font-medium text-[#44413b] hover:text-[#151413]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.name === "Reels" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 font-semibold uppercase">
                        Live
                      </span>
                    )}
                    {link.name === "Cost Estimator" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 text-[#8a6218] border border-amber-400/30 font-bold uppercase">
                        10 Spaces
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="pt-3 flex flex-col gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-[#151413] text-[#fdfbf7]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenConsultation) onOpenConsultation();
                    else navigate("/book-consultation");
                  }}
                >
                  Book Free Consultation
                </Button>
                <a
                  href="https://wa.me/917903038750?text=Hello%20Interior%20Points,%20I%20would%20like%20to%20inquire%20about%20interior%20design%20services."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2.5 text-xs uppercase tracking-wider font-semibold border border-[#25D366] text-[#128C7E] rounded-[var(--radius)] hover:bg-[#25D366]/10 transition-colors"
                >
                  Chat on WhatsApp (+91 7903038750)
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
