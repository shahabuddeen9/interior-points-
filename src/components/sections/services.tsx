import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "../../lib/router";

const disciplines = [
  {
    num: "01",
    title: "Modular Kitchen Architecture",
    subtitle: "Dry & Wet Zones • Boiling Water Proof Ply",
    description:
      "Designed specifically for rigorous Indian cooking habits. Built with 100% IS 710 marine-grade BWP plywood, German anti-fingerprint acrylic or matte PU finishes, Blum soft-close tandem pull-outs, and heavy spice racks.",
    specifications: ["IS 710 Marine Ply", "German PUR Edge-Banding", "Blum Soft-Close", "Quartz Countertops"],
  },
  {
    num: "02",
    title: "Bespoke Floor-to-Ceiling Wardrobes",
    subtitle: "Walk-ins • Sliding & Hinged Systems",
    description:
      "Custom storage planned around saree folds, suit lengths, concealed vanity stations, and sensor-activated internal strip lighting. Finished in lacquered glass, fluted oak veneers, or synchronized textured laminates.",
    specifications: ["Floor-to-Ceiling Height", "Hafele Sliding Systems", "Sensor LED Profiles", "Concealed Lockers"],
  },
  {
    num: "03",
    title: "Architectural Ceilings & Warm Lighting",
    subtitle: "Shadow-line Details • Zero Cracking Guarantee",
    description:
      "Cove lighting schemes engineered with moisture-resistant Saint-Gobain Gyproc plasterboards. We design multi-layered ambient, task, and accent lighting with warm 3000K CRI>90 LED profiles to elevate room volume.",
    specifications: ["Saint-Gobain Gyproc", "3000K Architectural Coves", "Magnetic Track Rails", "Acoustic Insulation"],
  },
  {
    num: "04",
    title: "Living, Dining & Sacred Pooja Spaces",
    subtitle: "Floating Media Consoles • CNC Lattice Partitions",
    description:
      "Sculptural entertainment consoles with concealed cable raceways, fluted wood wall panelling, bespoke marble dining tables, and traditional yet contemporary brass-inlaid pooja mandirs.",
    specifications: ["Concealed Wire Trays", "CNC Jaali Partitions", "Brass Inlay Work", "Italian Marble Tops"],
  },
  {
    num: "05",
    title: "Complete 1, 2 & 3 BHK Turnkey Fit-Outs",
    subtitle: "End-to-End Civil, Electrical, Painting & Woodwork",
    description:
      "The complete studio experience. We oversee plumbing adjustments, electrical re-routing, Asian Paints Royale luxury emulsion, deep cleaning, and full furniture handover within 60 days.",
    specifications: ["Turnkey Project Management", "60-Day Delivery", "Dedicated Site Architect", "Zero Hidden Costs"],
  },
  {
    num: "06",
    title: "Bespoke Loose Furniture & Styling",
    subtitle: "Custom Sofas • Ergonomic Home Workstations",
    description:
      "Custom upholstered seating in stain-resistant fabrics, ergonomic dual-monitor study desks, and architectural accent pieces handcrafted by our Mumbai master craftsmen.",
    specifications: ["High-Density Foam", "Stain-Resistant Fabrics", "Teak & Oak Solids", "Ergonomic Wire Ports"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[var(--border)]">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
              Studio Disciplines
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
              Bespoke Interior Architecture
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed">
              We design and execute complete residential spaces with architectural discipline.
              Every component is factory-calibrated and fitted by our in-house craftsmen.
            </p>
          </div>

          <Link
            href="/contact"
            className="text-xs uppercase tracking-widest font-semibold text-[var(--foreground)] hover:text-[var(--accent-foreground)] flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Request Custom Specification</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Minimalist Editorial Discipline Register (Non-Boxy) */}
        <div className="divide-y divide-[var(--border)]">
          {disciplines.map((item) => (
            <div
              key={item.num}
              className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start group hover:bg-[var(--secondary)]/20 transition-colors px-2 rounded-xs"
            >
              {/* Index & Title */}
              <div className="md:col-span-4 space-y-1">
                <span className="font-mono text-xs text-[var(--accent-foreground)] font-medium">
                  {item.num}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-foreground)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] font-body">
                  {item.subtitle}
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                  {item.description}
                </p>
              </div>

              {/* Specification pills */}
              <div className="md:col-span-3 flex flex-wrap gap-1.5 md:justify-end">
                {item.specifications.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--secondary)]/60 text-[var(--foreground)] border border-[var(--border)]/70"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
