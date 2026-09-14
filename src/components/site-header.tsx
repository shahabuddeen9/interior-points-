import React, { useState, useEffect } from "react";
import { Menu, X, Phone, ShieldCheck, Mail, Instagram } from "lucide-react";
import { Link, useRouter } from "../lib/router";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

export function SiteHeader({ onOpenConsultation }: { onOpenConsultation?: () => void }) {
  const { path, navigate } = useRouter();
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
    { name: "About", href: path === "/" ? "#about" : "/#about" },
    { name: "Projects", href: "/projects" },
    { name: "Reels", href: path === "/" ? "#instagram-reels" : "/#instagram-reels" },
    { name: "Services", href: path === "/" ? "#services" : "/#services" },
    { name: "Why Us", href: path === "/" ? "#why-us" : "/#why-us" },
    { name: "Pricing", href: path === "/" ? "#pricing" : "/#pricing" },
    { name: "Testimonials", href: path === "/" ? "#testimonials" : "/#testimonials" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md shadow-xs border-b border-[var(--border)]"
          : "bg-[var(--background)]/60 backdrop-blur-xs border-b border-[var(--border)]/50"
      }`}
    >
      {/* Top micro-bar */}
      <div className="hidden lg:block border-b border-[var(--border)]/60 bg-[var(--secondary)]/40 px-6 py-1.5 text-xs text-[var(--muted-foreground)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-medium text-[var(--foreground)]">Operating Exclusively in Mumbai</span>
              <span className="text-[var(--muted-foreground)]">• Near Asalpha Metro Station, Mumbai 400084</span>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
              60-Day Dream Home Guarantee &amp; 10-Year Warranty
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href="mailto:msfusionarchitects@gmail.com"
              className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
              title="Official Studio Email"
            >
              <Mail className="h-3 w-3 text-[var(--accent)]" />
              msfusionarchitects@gmail.com
            </a>
            <span className="text-[var(--border)]">|</span>
            <a
              href="https://www.instagram.com/interior_points/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
            >
              <Instagram className="h-3 w-3 text-rose-500" />
              <span className="font-semibold text-[var(--accent-foreground)]">@interior_points</span>
            </a>
            <span className="text-[var(--border)]">|</span>
            <a
              href="tel:+917903038750"
              className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
            >
              <Phone className="h-3 w-3 text-[var(--accent)]" />
              +91 7903038750
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="group flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                INTERIOR POINTS
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] -mt-0.5 hidden sm:block font-body">
              Designing Spaces. Creating Experiences.
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:border-b-2 hover:border-[var(--accent)] py-1 transition-all flex items-center gap-1"
              >
                {link.name === "Reels" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
                <span>{link.name}</span>
              </Link>
            ))}
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
                  navigate(path === "/" ? "#contact" : "/contact");
                }
              }}
              className="text-xs font-semibold uppercase tracking-wider shadow-xs hover:shadow-md transition-all"
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
                  navigate(path === "/" ? "#contact" : "/contact");
                }
              }}
              className="text-[11px] px-2.5 py-1.5"
            >
              Free Quote
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[var(--foreground)] hover:bg-black/5 cursor-pointer"
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
            className="md:hidden border-b border-[var(--border)] bg-[var(--background)] px-6 py-5 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[var(--foreground)] py-1.5 border-b border-[var(--border)]/40 hover:text-[var(--accent)] flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  {link.name === "Reels" && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 font-semibold uppercase">
                      Live
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenConsultation) onOpenConsultation();
                    else navigate(path === "/" ? "#contact" : "/contact");
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
