import React from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  MessageCircle,
  Star,
  Bed,
  ChefHat,
  DoorOpen,
  Tv,
  Paintbrush,
  SunMedium,
  Layers,
  Bath,
  Armchair,
  Lock,
  Zap,
  Palette,
  FileCheck,
  Compass,
} from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";

interface OfficialPackageProps {
  onOpenConsultation: (bhk?: "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK / Villa") => void;
}

const SERVICE_ITEMS = [
  {
    num: "1",
    title: "All Bedroom Beds and Wardrobes",
    desc: "Bespoke beds with hydraulic storage & floor-to-ceiling wardrobes",
    icon: Bed,
  },
  {
    num: "2",
    title: "Modular Kitchen with 3 Tandem",
    desc: "Cabinets, deep storage drawers & cutlery organizers",
    icon: ChefHat,
  },
  {
    num: "3",
    title: "Dressing Table",
    desc: "Designer vanity mirror with integrated drawers & jewelry slots",
    icon: Compass,
  },
  {
    num: "4",
    title: "TV Unit",
    desc: "Floating media console with acoustic fluted backdrop",
    icon: Tv,
  },
  {
    num: "5",
    title: "2 Coat Asian Royal Paint",
    desc: "Washable luxury emulsion with smooth acrylic putty preparation",
    icon: Paintbrush,
  },
  {
    num: "6",
    title: "Mandir",
    desc: "Handcrafted devotional temple niche with brass & bell accents",
    icon: Sparkles,
  },
  {
    num: "7",
    title: "Shoes Rack",
    desc: "Ventilated entryway foyer cabinet with seating cushion",
    icon: DoorOpen,
  },
  {
    num: "8",
    title: "Laminate Work",
    desc: "Scratch-resistant premium 1mm designer surface laminates",
    icon: Layers,
  },
  {
    num: "9",
    title: "Wash Basin Storage",
    desc: "Under-counter vanity with moisture-proof carcass & mirror unit",
    icon: Bath,
  },
  {
    num: "10",
    title: "False Ceiling",
    desc: "Saint-Gobain gypsum ceiling with perimeter warm 3000K cove glow",
    icon: SunMedium,
  },
  {
    num: "11",
    title: "Study Table",
    desc: "Ergonomic work-from-home desk with concealed wire ports",
    icon: Armchair,
  },
  {
    num: "12",
    title: "Safety Door",
    desc: "Heavy-duty security main door with brass peephole & multi-lever lock",
    icon: Lock,
  },
  {
    num: "13",
    title: "Electrical Work, Wiring, & Switchboard",
    desc: "Concealed copper wiring, MCB box & branded modular switchplates",
    icon: Zap,
  },
  {
    num: "14",
    title: "Wall Molding Design",
    desc: "Neo-classical architectural wall paneling for luxury depth",
    icon: Palette,
  },
  {
    num: "15",
    title: "Free Consultation (2D drawings, 3D view, site visit)",
    desc: "Complete architectural drawings, 3D walkthrough & on-site measurement",
    icon: FileCheck,
  },
];

const MATERIAL_HIGHLIGHTS = [
  {
    title: "Good Quality Sturdy 18mm Semi Marin Ply",
    detail: "Borer & termite proof, moisture-resistant calibrated core for long structural life",
  },
  {
    title: "1000 to 1300 Range Premium Laminate",
    detail: "Hand-curated catalogue of high-texture, suede, and ultra-matte designer sheets",
  },
  {
    title: "Thickness of Laminate 1mm",
    detail: "Strict 1mm thickness preventing chipping, cracking, and surface waviness",
  },
  {
    title: "2 Coat of Asian Royal Washable Paint",
    detail: "Stain-resistant luxury silk sheen with multi-layer surface leveling putty",
  },
  {
    title: "Hinges will be Hettich or Hafele",
    detail: "German engineered soft-close hydraulic hinges with 100,000+ cycle testing",
  },
  {
    title: "10 Year Comprehensive Warranty",
    detail: "Written studio guarantee covering woodwork joinery & moving hardware parts",
  },
];

const PACKAGES = [
  {
    bhk: "1BHK" as const,
    targetBhk: "1 BHK" as const,
    price: "8.45 Lacs",
    tagline: "Complete 15-Service Turnkey Solution for compact residences",
    popular: false,
  },
  {
    bhk: "2BHK" as const,
    targetBhk: "2 BHK" as const,
    price: "10.75 Lacs",
    tagline: "Our most requested package across Mumbai high-rises",
    popular: true,
  },
  {
    bhk: "3BHK" as const,
    targetBhk: "3 BHK" as const,
    price: "13.75 Lacs",
    tagline: "Full turnkey luxury transformation for spacious family homes",
    popular: false,
  },
];

export function OfficialPackageShowcase({ onOpenConsultation }: OfficialPackageProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0c1a16] via-[#091512] to-[#060e0c] text-white relative overflow-hidden border-y border-amber-900/30">
      {/* Decorative Golden Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Monogram & Banner Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-[0.25em]">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Official Turnkey Brochure Package</span>
          </div>

          <div className="flex flex-col items-center">
            {/* JP Monogram Crest */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/30 mb-3">
              <div className="w-full h-full rounded-[14px] bg-[#0c1a16] flex flex-col items-center justify-center">
                <span className="font-display font-black text-xl text-amber-300 tracking-tighter">JP</span>
                <span className="text-[7px] text-amber-200 uppercase tracking-widest -mt-1 font-bold">Studio</span>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-100 tracking-tight leading-tight">
              INTERIOR POINTS
            </h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3" />
            <p className="text-base sm:text-xl md:text-2xl font-display font-bold uppercase tracking-wider text-amber-300 leading-snug">
              GET YOUR DREAM HOME INTERIOR DONE IN 60 DAYS!
            </p>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl leading-relaxed">
              Transparent, non-escalating turnkey packages crafted with sturdy 18mm semi-marine ply, German hardware, and end-to-end design execution.
            </p>
          </div>
        </div>

        {/* 3 Package Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 items-stretch">
          {PACKAGES.map((pkg) => {
            return (
              <motion.div
                key={pkg.bhk}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? "bg-gradient-to-b from-[#132821] to-[#0d1d18] border-2 border-amber-400/80 shadow-2xl shadow-amber-900/20 ring-1 ring-amber-400/30"
                    : "bg-[#0f1f1a]/80 border border-amber-500/25 hover:border-amber-400/50 shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <Star className="h-3 w-3 fill-black text-black" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-display text-xl font-bold text-white tracking-wide">{pkg.bhk}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      Premium Styling
                    </span>
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-amber-200/70 font-medium">
                      All-Inclusive Package Rate
                    </div>
                    <div className="font-display text-3xl sm:text-4xl font-extrabold text-amber-300 mt-1 flex items-baseline gap-1">
                      <span>₹{pkg.price}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>All 15 services &amp; branded materials included</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                    {pkg.tagline}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-amber-500/20">
                  <Button
                    variant={pkg.popular ? "gold" : "outline"}
                    size="md"
                    onClick={() => onOpenConsultation(pkg.targetBhk)}
                    className={`w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 shadow-md font-extrabold"
                        : "border-amber-400/40 text-amber-300 hover:bg-amber-400/10"
                    }`}
                  >
                    <span>Request {pkg.bhk} Consultation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Two-Column Deep Inclusions & Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          {/* Left Column: OUR SERVICE INCLUDES (15 Services) */}
          <div className="lg:col-span-7 bg-[#0d1d18]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-amber-500/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Comprehensive 15-Point Scope
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                  OUR SERVICE INCLUDES
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                100% In-House Factory Execution
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SERVICE_ITEMS.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.num}
                    className="p-3 rounded-2xl bg-black/30 border border-amber-500/15 hover:border-amber-400/30 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300 font-bold text-xs">
                      {item.num}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5 leading-snug">
                        <IconComp className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: MATERIALS WE USE & QUALITY PROMISE */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Materials Box */}
            <div className="bg-[#0d1d18]/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 flex-1">
              <div className="border-b border-amber-500/20 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  Architectural Grade Standards
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                  MATERIALS WE USE
                </h3>
              </div>

              <div className="space-y-3.5">
                {MATERIAL_HIGHLIGHTS.map((mat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/30 border border-amber-500/15 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-100 leading-snug">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {mat.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Trust Highlight Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/30 text-center space-y-1">
                <Clock className="h-6 w-6 text-amber-400 mx-auto" />
                <div className="font-display text-xl font-bold text-white">60 Days</div>
                <div className="text-[11px] text-amber-200/80 font-medium">Guaranteed On-Time Handover</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30 text-center space-y-1">
                <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto" />
                <div className="font-display text-xl font-bold text-white">10 Years</div>
                <div className="text-[11px] text-emerald-200/80 font-medium">Written Hardware Warranty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gold Foil Contact Bar Matching Brochure */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900/20 pb-6">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-black text-neutral-800">
                Direct Studio Concierge Desk
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-extrabold text-neutral-950 mt-0.5">
                Ready to plan your 60-Day Dream Home Interior?
              </h4>
              <p className="text-xs text-neutral-800 mt-1 max-w-xl font-medium">
                Book a free site consultation. Includes complete 2D architectural drawings, 3D walkthrough views &amp; exact itemized BOQ.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/917903038750?text=Hi%20Interior%20Points%2C%20I%20am%20interested%20in%20your%2060-Day%20Dream%20Home%20Package."
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>WhatsApp Desk (+91 7903038750)</span>
              </a>

              <a
                href="tel:+918788516537"
                className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-neutral-900/20 shadow-sm transition-colors"
              >
                <Phone className="h-4 w-4 text-neutral-900" />
                <span>Call +91 8788516537</span>
              </a>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-neutral-900">
            <div className="flex items-start gap-2.5">
              <Phone className="h-4 w-4 text-neutral-950 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-700">Phone Consultation:</span>
                <div className="font-bold text-sm">
                  <a href="tel:+917903038750" className="hover:underline">+91 7903038750</a>
                  <span className="mx-1.5">•</span>
                  <a href="tel:+918788516537" className="hover:underline">+91 8788516537</a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 text-neutral-950 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-700">Official Email:</span>
                <a href="mailto:interiorpoints97@gmail.com" className="font-bold text-sm hover:underline block truncate">
                  interiorpoints97@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5 sm:col-span-1">
              <MapPin className="h-4 w-4 text-neutral-950 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-700">Studio &amp; Workshop Address:</span>
                <span className="text-[11px] leading-tight block font-medium">
                  Shop no 3, Haji Fatima Manzil, Near Asalpha Metro Station, Pereira Wadi, Asalpha, Mumbai, Maharashtra 400084.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
