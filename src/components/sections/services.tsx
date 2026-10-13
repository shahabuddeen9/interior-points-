import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "../../lib/router";

const disciplines = [
  {
    num: "01",
    title: "Modular Kitchen Architecture",
    subtitle: "Dry & Wet Zones • Boiling Water Proof Ply",
    description:
      "100% IS 710 marine-grade BWP ply, anti-fingerprint acrylic finishes, Blum soft-close tandem drawers, and quartz countertops.",
    specifications: ["IS 710 Marine Ply", "PUR Edge-Banding", "Blum Soft-Close", "Quartz Countertops"],
  },
  {
    num: "02",
    title: "Bespoke Floor-to-Ceiling Wardrobes",
    subtitle: "Walk-ins • Sliding & Hinged Systems",
    description:
      "Floor-to-ceiling wardrobes with sensor LED profiles, concealed lofts, digital lockers, and smooth German sliding hardware.",
    specifications: ["Floor-to-Ceiling", "Hafele Sliding Systems", "Sensor LED Profiles", "Concealed Lockers"],
  },
  {
    num: "03",
    title: "Architectural Ceilings & Warm Lighting",
    subtitle: "Shadow-line Details • Zero Cracking Guarantee",
    description:
      "Saint-Gobain Gyproc ceilings with indirect 3000K warm cove glow, magnetic track rails, and zero cracking guarantee.",
    specifications: ["Saint-Gobain Gyproc", "3000K Warm Coves", "Magnetic Track Rails", "Acoustic Insulation"],
  },
  {
    num: "04",
    title: "Living, Dining & Sacred Pooja Spaces",
    subtitle: "Floating Media Consoles • CNC Lattice Partitions",
    description:
      "Floating TV consoles with hidden wire raceways, fluted wood panelling, and handcrafted brass-inlaid pooja mandirs.",
    specifications: ["Concealed Wire Trays", "CNC Jaali Partitions", "Brass Inlay Work", "Italian Marble Tops"],
  },
  {
    num: "05",
    title: "Complete 1, 2 & 3 BHK Turnkey Fit-Outs",
    subtitle: "End-to-End Civil, Electrical, Painting & Woodwork",
    description:
      "Full turnkey execution covering civil revamp, concealed electricals, Asian Paints Royale, and full handover in 45 days.",
    specifications: ["Turnkey Management", "45-Day Handover", "Dedicated Site Lead", "Zero Hidden Costs"],
  },
  {
    num: "06",
    title: "Bespoke Loose Furniture & Styling",
    subtitle: "Custom Sofas • Ergonomic Home Workstations",
    description:
      "Custom upholstered seating in stain-resistant fabrics, quartz dining tables, and ergonomic work-from-home study desks.",
    specifications: ["High-Density Foam", "Stain-Resistant Fabrics", "Teak & Oak Solids", "Ergonomic Wire Ports"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] scroll-mt-20 sm:scroll-mt-24">
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
              Factory-calibrated modular joinery, custom woodwork, and end-to-end turnkey project management.
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
