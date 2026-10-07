import React, { useState, useMemo, useEffect } from "react";
import {
  ChefHat,
  DoorOpen,
  Tv,
  SunMedium,
  Paintbrush,
  Bath,
  Armchair,
  Zap,
  Layers,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  Phone,
  MessageCircle,
  Building2,
  Home,
  Briefcase,
  BadgePercent,
  Calculator,
  Loader2,
  Info,
  Calendar,
  MapPin,
  ExternalLink,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input, Textarea } from "./ui/input";
import { fetchEstimatorSpaces } from "../lib/estimator-service";

export const ICON_MAP: Record<string, React.ElementType> = {
  ChefHat,
  DoorOpen,
  Tv,
  SunMedium,
  Paintbrush,
  Bath,
  Armchair,
  Zap,
  Layers,
  Home,
  Briefcase,
  Building2,
  Sparkles,
};

export type FloorPlanType = "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK / Villa";

export interface ScopeWorkItem {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  tagline: string;
  specs: string[];
  popular?: boolean;
  pricing: Record<FloorPlanType, { min: number; max: number; label: string }>;
}

export const FLOOR_PLANS: {
  type: FloorPlanType;
  title: string;
  subtitle: string;
  carpetArea: string;
  handoverDays: string;
  badge?: string;
  icon: React.ElementType;
}[] = [
  {
    type: "1 BHK",
    title: "1 BHK Apartment",
    subtitle: "Smart space optimization for Mumbai compact homes",
    carpetArea: "450 – 600 sq.ft",
    handoverDays: "40 Days Handover",
    icon: Home,
  },
  {
    type: "2 BHK",
    title: "2 BHK Residence",
    subtitle: "Most popular Mumbai family home configuration",
    carpetArea: "650 – 950 sq.ft",
    handoverDays: "45 Days Handover",
    badge: "Most Popular in Mumbai",
    icon: Building2,
  },
  {
    type: "3 BHK",
    title: "3 BHK Premium Home",
    subtitle: "Expansive layouts with architectural finish",
    carpetArea: "1000 – 1400 sq.ft",
    handoverDays: "55 Days Handover",
    icon: Building2,
  },
  {
    type: "4 BHK / Villa",
    title: "4 BHK / Penthouse / Villa",
    subtitle: "Grand proportions, bespoke luxury joinery",
    carpetArea: "1500+ sq.ft",
    handoverDays: "60 Days Handover",
    badge: "Ultra Luxury",
    icon: Sparkles,
  },
];

export const DEFAULT_SCOPE_WORKS: ScopeWorkItem[] = [
  {
    id: "kitchen",
    name: "Modular Kitchen",
    category: "Cooking Sanctuary",
    icon: ChefHat,
    tagline: "18mm Marine Ply, Anti-scratch Acrylic & Blum Tandem Drawers",
    specs: [
      "L-shape / Parallel layout with Kalinga Quartz or Granite countertop",
      "Cutlery, thali & bottle pull-out organizers",
      "Soft-close tandem drawers & hydraulic overhead lift-ups",
      "Under-cabinet warm 3000K task lighting profiles",
    ],
    popular: true,
    pricing: {
      "1 BHK": { min: 140000, max: 165000, label: "₹1.40L – ₹1.65L" },
      "2 BHK": { min: 185000, max: 220000, label: "₹1.85L – ₹2.20L" },
      "3 BHK": { min: 240000, max: 285000, label: "₹2.40L – ₹2.85L" },
      "4 BHK / Villa": { min: 295000, max: 350000, label: "₹2.95L – ₹3.50L" },
    },
  },
  {
    id: "wardrobes",
    name: "Wardrobes & Joinery",
    category: "Master Bedrooms",
    icon: DoorOpen,
    tagline: "Floor-to-Ceiling Wardrobes with Concealed Lofts & Sensor Lights",
    specs: [
      "Sliding or hinged doors with zero-gap PUR edge banding",
      "Matte PU / Tinted fluted glass finish with bronze profiles",
      "Internal sensor LED profiles and digital locker drawers",
      "18mm marine grade ply with 10-year hardware warranty",
    ],
    popular: true,
    pricing: {
      "1 BHK": { min: 85000, max: 105000, label: "₹85k – ₹1.05L (1 Unit)" },
      "2 BHK": { min: 160000, max: 195000, label: "₹1.60L – ₹1.95L (2 Units)" },
      "3 BHK": { min: 235000, max: 285000, label: "₹2.35L – ₹2.85L (3 Units)" },
      "4 BHK / Villa": { min: 310000, max: 375000, label: "₹3.10L – ₹3.75L (4 Units)" },
    },
  },
  {
    id: "living_tv",
    name: "Living Room & TV Console",
    category: "Entertainment",
    icon: Tv,
    tagline: "Floating TV Console, Fluted Acoustic Wood & Foyer Divider",
    specs: [
      "Bespoke CNC fluted panelling with hidden master bedroom door",
      "Floating drawer unit with concealed wire conduits",
      "Foyer shoe cabinet with integrated seating cushion",
      "Champagne brass trims & low-glare display niches",
    ],
    pricing: {
      "1 BHK": { min: 55000, max: 70000, label: "₹55k – ₹70k" },
      "2 BHK": { min: 95000, max: 120000, label: "₹95k – ₹1.20L" },
      "3 BHK": { min: 145000, max: 180000, label: "₹1.45L – ₹1.80L" },
      "4 BHK / Villa": { min: 195000, max: 240000, label: "₹1.95L – ₹2.40L" },
    },
  },
  {
    id: "ceiling_lighting",
    name: "False Ceiling & Lighting",
    category: "Atmosphere",
    icon: SunMedium,
    tagline: "Saint-Gobain Gypsum with Warm 3000K Indirect Cove Glow",
    specs: [
      "Zero-crack GI channel framing across living & bedrooms",
      "Indirect perimeter cove lighting with uniform warm glow",
      "Architectural magnetic track lights & COB low-glare spots",
      "Fan point re-routing and concealed wiring integration",
    ],
    pricing: {
      "1 BHK": { min: 40000, max: 50000, label: "₹40k – ₹50k" },
      "2 BHK": { min: 70000, max: 88000, label: "₹70k – ₹88k" },
      "3 BHK": { min: 105000, max: 130000, label: "₹1.05L – ₹1.30L" },
      "4 BHK / Villa": { min: 140000, max: 175000, label: "₹1.40L – ₹1.75L" },
    },
  },
  {
    id: "painting",
    name: "Luxury Painting & Moldings",
    category: "Surfaces",
    icon: Paintbrush,
    tagline: "Asian Paints Royale Luxury Washable Emulsion & Wall Moldings",
    specs: [
      "Complete surface acrylic putty levelling & sanding",
      "2 coats Asian Paints Royale luxury washable emulsion",
      "French-inspired neo-classical wall trim moldings",
      "Accent color wall or tactile microcement texture",
    ],
    pricing: {
      "1 BHK": { min: 35000, max: 45000, label: "₹35k – ₹45k" },
      "2 BHK": { min: 60000, max: 75000, label: "₹60k – ₹75k" },
      "3 BHK": { min: 85000, max: 105000, label: "₹85k – ₹1.05L" },
      "4 BHK / Villa": { min: 115000, max: 145000, label: "₹1.15L – ₹1.45L" },
    },
  },
  {
    id: "bathroom_civil",
    name: "Bathroom & Civil Revamp",
    category: "Sanitary & Civil",
    icon: Bath,
    tagline: "Vitrified Tile Cladding, Vanity Counter & Grohe/Kohler Diverters",
    specs: [
      "Quartz counter with under-counter basin & mirror cabinet",
      "Wall-hung WC with concealed dual-flush cistern",
      "Complete water-proofing with 5-year guarantee",
      "Concealed plumbing and premium matte black / chrome fittings",
    ],
    pricing: {
      "1 BHK": { min: 50000, max: 65000, label: "₹50k – ₹65k (1 Bath)" },
      "2 BHK": { min: 85000, max: 110000, label: "₹85k – ₹1.10L (2 Baths)" },
      "3 BHK": { min: 125000, max: 155000, label: "₹1.25L – ₹1.55L (3 Baths)" },
      "4 BHK / Villa": { min: 165000, max: 210000, label: "₹1.65L – ₹2.10L (4 Baths)" },
    },
  },
  {
    id: "furniture_decor",
    name: "Loose Furniture & Mandir",
    category: "Furnishings",
    icon: Armchair,
    tagline: "Custom Upholstered Sofa, Dining Table & Teak Pooja Mandir",
    specs: [
      "Custom 3+2 high-density foam sofa in spill-resistant fabric",
      "Solid ashwood or quartz 4/6 seater dining table with chairs",
      "Bespoke teakwood and brass accent Pooja Mandir niche",
      "Master bed frame with plush fabric headboard panelling",
    ],
    pricing: {
      "1 BHK": { min: 55000, max: 75000, label: "₹55k – ₹75k" },
      "2 BHK": { min: 95000, max: 130000, label: "₹95k – ₹1.30L" },
      "3 BHK": { min: 145000, max: 190000, label: "₹1.45L – ₹1.90L" },
      "4 BHK / Villa": { min: 195000, max: 250000, label: "₹1.95L – ₹2.50L" },
    },
  },
  {
    id: "electrical_smart",
    name: "Electrical & Smart Wiring",
    category: "Automation & Power",
    icon: Zap,
    tagline: "Concealed Polycab Conduits, Legrand/Schneider Modular Switches & Smart Relays",
    specs: [
      "Complete concealed copper wiring with individual MCB distribution",
      "Legrand Arteor / Schneider Opale modular switchplates",
      "Smart WiFi scene controllers & two-way bed switches",
      "AC, geyser & high-load kitchen appliance dedicated lines",
    ],
    pricing: {
      "1 BHK": { min: 25000, max: 35000, label: "₹25k – ₹35k" },
      "2 BHK": { min: 45000, max: 60000, label: "₹45k – ₹60k" },
      "3 BHK": { min: 70000, max: 90000, label: "₹70k – ₹90k" },
      "4 BHK / Villa": { min: 95000, max: 125000, label: "₹95k – ₹1.25L" },
    },
  },
  {
    id: "flooring_tiling",
    name: "Flooring & Italian Marble Polish",
    category: "Floors & Polish",
    icon: Layers,
    tagline: "High-Gloss Vitrified Tiles / Italian Marble Diamond Polish & Skirting",
    specs: [
      "Seamless vitrified tile installation with 2mm epoxy spacers",
      "Multi-stage diamond pad polish with anti-stain crystallizer",
      "Flush hardwood or brass transition thresholds",
      "Matching 4-inch perimeter wall skirting",
    ],
    pricing: {
      "1 BHK": { min: 30000, max: 42000, label: "₹30k – ₹42k" },
      "2 BHK": { min: 55000, max: 72000, label: "₹55k – ₹72k" },
      "3 BHK": { min: 85000, max: 110000, label: "₹85k – ₹1.10L" },
      "4 BHK / Villa": { min: 120000, max: 155000, label: "₹1.20L – ₹1.55L" },
    },
  },
];

export const SCOPE_WORKS = DEFAULT_SCOPE_WORKS;

interface ConsultationFlowProps {
  onSuccessClose?: () => void;
  initialBhk?: FloorPlanType;
  isFullPage?: boolean;
}

export function ConsultationFlow({
  onSuccessClose,
  initialBhk = "2 BHK",
  isFullPage = false,
}: ConsultationFlowProps) {
  // Step 1: Floor Plan | Step 2: Scope & Live Pricing | Step 3: Contact Details & WhatsApp Send | Step 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Dynamic Estimator Spaces (loaded from server / admin portal)
  const [spaces, setSpaces] = useState<ScopeWorkItem[]>(DEFAULT_SCOPE_WORKS);

  useEffect(() => {
    let active = true;

    const loadSpaces = () => {
      fetchEstimatorSpaces(false)
        .then((data) => {
          if (active && Array.isArray(data) && data.length > 0) {
            const mapped: ScopeWorkItem[] = data.map((item) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              tagline: item.tagline,
              specs: item.specs || [],
              popular: item.popular,
              icon: ICON_MAP[item.iconName || ""] || Sparkles,
              pricing: item.pricing,
            }));
            setSpaces(mapped);
            setSelectedWorkIds((prev) => prev.filter((id) => mapped.some((m) => m.id === id)));
          }
        })
        .catch((err) => console.warn("Using fallback default spaces:", err));
    };

    loadSpaces();

    const handleUpdate = () => {
      loadSpaces();
    };

    window.addEventListener("estimator-spaces-updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("estimator-spaces-updated", handleUpdate);
    };
  }, []);

  // Selections
  const [selectedBhk, setSelectedBhk] = useState<FloorPlanType>(initialBhk);
  const [selectedWorkIds, setSelectedWorkIds] = useState<string[]>([
    "kitchen",
    "wardrobes",
    "living_tv",
    "ceiling_lighting",
  ]);

  // Keep selectedBhk in sync if initialBhk prop changes
  useEffect(() => {
    if (initialBhk) {
      setSelectedBhk(initialBhk);
    }
  }, [initialBhk]);

  // Form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cityArea, setCityArea] = useState("Mumbai - Central Suburbs (Asalpha, Ghatkopar, Powai)");
  const [possessionTimeline, setPossessionTimeline] = useState("Within 30–60 Days");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<{
    whatsappUrl: string;
    bhk: string;
    totalRange: string;
    selectedWorks: string[];
    name: string;
    phone: string;
    area: string;
  } | null>(null);

  // Dynamic Price Calculator based on admin-configured market prices
  const calculation = useMemo(() => {
    let minSum = 0;
    let maxSum = 0;
    const items: { name: string; priceText: string; min: number; max: number }[] = [];

    spaces.forEach((w) => {
      if (selectedWorkIds.includes(w.id)) {
        const p = w.pricing?.[selectedBhk] || { min: 0, max: 0, label: "Price on request" };
        minSum += p.min;
        maxSum += p.max;
        items.push({
          name: w.name,
          priceText: p.label,
          min: p.min,
          max: p.max,
        });
      }
    });

    // Combo Bundle Discount: 12% if >= 4 works, 15% if all works selected
    const isTurnkeyCombo = selectedWorkIds.length >= 4;
    const discountRate = selectedWorkIds.length === spaces.length ? 0.15 : isTurnkeyCombo ? 0.12 : 0;

    const discountAmountMin = Math.round(minSum * discountRate);
    const discountAmountMax = Math.round(maxSum * discountRate);

    const finalMin = minSum - discountAmountMin;
    const finalMax = maxSum - discountAmountMax;

    const formatInLakhs = (val: number) => {
      if (val >= 100000) {
        return `₹${(val / 100000).toFixed(2)}L`;
      }
      return `₹${(val / 1000).toFixed(0)}k`;
    };

    return {
      rawMin: minSum,
      rawMax: maxSum,
      finalMin,
      finalMax,
      discountAmountMin,
      discountAmountMax,
      discountPercent: Math.round(discountRate * 100),
      isTurnkeyCombo,
      selectedItems: items,
      formattedRange: `${formatInLakhs(finalMin)} – ${formatInLakhs(finalMax)}`,
      formattedRawRange: `${formatInLakhs(minSum)} – ${formatInLakhs(maxSum)}`,
      formattedSavings: formatInLakhs(discountAmountMin),
    };
  }, [selectedBhk, selectedWorkIds, spaces]);

  const toggleWork = (id: string) => {
    setSelectedWorkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllWorks = () => {
    setSelectedWorkIds(spaces.map((w) => w.id));
  };

  const clearWorks = () => {
    setSelectedWorkIds([]);
  };

  const handleProceedToDetails = () => {
    if (selectedWorkIds.length === 0) {
      setError("Please select at least one scope of work to calculate your price.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanPhone || !cleanEmail) {
      setError("Please fill in your name, phone number, and email address.");
      return;
    }

    if (selectedWorkIds.length === 0) {
      setError("Please select at least one work category.");
      setStep(2);
      return;
    }

    setLoading(true);

    const selectedWorksSummary = calculation.selectedItems.map(
      (item) => `${item.name} (${item.priceText})`
    );

    const fallbackWhatsappUrl = `https://wa.me/917903038750?text=${encodeURIComponent(
      `*🏠 New Free Consultation & Estimate — Interior Points*\n` +
      `══════════════════════════════\n` +
      `👤 *Customer Name:* ${cleanName}\n` +
      `📱 *Phone Number:* ${cleanPhone}\n` +
      `📧 *Email Address:* ${cleanEmail}\n` +
      `📍 *Location / Society:* ${cityArea}\n` +
      `📐 *Floor Plan / BHK:* ${selectedBhk}\n` +
      `📅 *Possession Timeline:* ${possessionTimeline}\n` +
      `💰 *Estimated Total:* ${calculation.formattedRange}${
        calculation.discountPercent > 0
          ? ` (${calculation.discountPercent}% Turnkey Combo Discount applied)`
          : ""
      }\n\n` +
      `📋 *Selected Scope of Work (${selectedWorksSummary.length} spaces):*\n` +
      selectedWorksSummary.map((s, idx) => `  ${idx + 1}. ✅ ${s}`).join("\n") +
      (notes.trim() ? `\n\n💬 *Customer Notes:* ${notes.trim()}` : "") +
      `\n══════════════════════════════\n` +
      `_60-Day Dream Home Guarantee • 18mm Semi-Marin Ply • 10-Year Warranty_\n` +
      `_Studio: +91 7903038750 / +91 8788516537 • interiorpoints97@gmail.com_\n` +
      `_Shop no 3, Haji Fatima Manzil, Near Asalpha Metro Station, Mumbai 400084_`
    )}`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          city: cityArea,
          bhkType: selectedBhk,
          message: notes.trim(),
          selectedWorks: selectedWorksSummary,
          estimatedPrice: calculation.formattedRange,
          possessionTimeline,
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {}

      const targetWhatsappUrl = json?.whatsappUrl || fallbackWhatsappUrl;

      setFinalResult({
        whatsappUrl: targetWhatsappUrl,
        bhk: selectedBhk,
        totalRange: calculation.formattedRange,
        selectedWorks: selectedWorksSummary,
        name: cleanName,
        phone: cleanPhone,
        area: cityArea,
      });

      setStep(4);
    } catch (err: any) {
      console.warn("Lead error, falling back to direct WhatsApp:", err);
      setFinalResult({
        whatsappUrl: fallbackWhatsappUrl,
        bhk: selectedBhk,
        totalRange: calculation.formattedRange,
        selectedWorks: selectedWorksSummary,
        name: cleanName,
        phone: cleanPhone,
        area: cityArea,
      });
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${isFullPage ? "max-w-5xl mx-auto" : "max-w-3xl mx-auto"}`}>
      {/* Multi-step progress bar */}
      <div className="mb-6 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              <Calculator className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#8a6218]">
                Instant Cost Estimator &amp; Consultation
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--foreground)]">
                {step === 1 && "Step 1: Choose Your Home Configuration"}
                {step === 2 && `Step 2: Select Spaces & Calculate ${selectedBhk} Price`}
                {step === 3 && "Step 3: Connect With Senior Interior Architect"}
                {step === 4 && "Consultation Booked & Sent to WhatsApp!"}
              </h2>
            </div>
          </div>

          <div className="text-xs font-semibold text-[var(--muted-foreground)]">
            Step {step} of 3
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-[#c59b4c] to-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Floor Plan Selection (1 BHK, 2 BHK, 3 BHK, 4 BHK) */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Select your floor plan to view room-by-room modular kitchen, wardrobe, false ceiling, and civil revamp estimates tailored to Mumbai residences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FLOOR_PLANS.map((fp) => {
              const isSelected = selectedBhk === fp.type;
              const IconComp = fp.icon;

              return (
                <div
                  key={fp.type}
                  onClick={() => setSelectedBhk(fp.type)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-[#c59b4c] bg-amber-50/50 shadow-md ring-2 ring-[#c59b4c]/25"
                      : "border-[var(--border)] bg-white hover:border-amber-300 hover:shadow-xs"
                  }`}
                >
                  {fp.badge && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#8a6218] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      {fp.badge}
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#c59b4c] text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      <IconComp className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-[var(--foreground)]">
                          {fp.title}
                        </h3>
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-[#c59b4c] text-white flex items-center justify-center">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] leading-snug">
                        {fp.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1 font-mono">
                      <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                      {fp.carpetArea}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Clock className="h-3.5 w-3.5" />
                      {fp.handoverDays}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
            <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verified 60-day dream home delivery commitment across Mumbai</span>
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              className="text-xs uppercase tracking-wider font-semibold shadow-xs"
            >
              <span>Next: Select Works &amp; View Pricing</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Work Scope Selection with Real-Time Price Calculation */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          {/* Header controls: Interactive BHK Switcher & Quick Selection Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 p-4 rounded-2xl bg-neutral-50 border border-[var(--border)] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider shrink-0">
                Floor Plan:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-white border border-[var(--border)] shadow-2xs gap-1">
                {(["1 BHK", "2 BHK", "3 BHK", "4 BHK / Villa"] as const).map((bhk) => {
                  const isActive = selectedBhk === bhk;
                  return (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBhk(bhk)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#151413] text-white shadow-xs"
                          : "text-[var(--foreground)] hover:bg-neutral-100"
                      }`}
                    >
                      {bhk}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={selectAllWorks}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[var(--border)] hover:border-neutral-400 font-semibold text-[var(--foreground)] shadow-2xs transition-colors"
              >
                Select All ({spaces.length} Spaces)
              </button>
              <button
                type="button"
                onClick={clearWorks}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[var(--border)] hover:border-neutral-400 font-medium text-[var(--muted-foreground)] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Cards for each Work category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spaces.map((work) => {
              const isSelected = selectedWorkIds.includes(work.id);
              const priceInfo = work.pricing?.[selectedBhk] || { min: 0, max: 0, label: "Price on request" };
              const IconComp = work.icon || Sparkles;

              return (
                <div
                  key={work.id}
                  onClick={() => toggleWork(work.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/30 shadow-xs"
                      : "border-[var(--border)] bg-white hover:border-neutral-300 opacity-90"
                  }`}
                >
                  <div>
                    {/* Top Bar: Icon, Name & Checkbox */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
                            {work.category}
                          </div>
                          <h4 className="text-sm font-bold text-[var(--foreground)] font-display">
                            {work.name}
                          </h4>
                        </div>
                      </div>

                      {/* Checkbox badge */}
                      <div
                        className={`h-6 w-6 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
                      {work.tagline}
                    </p>

                    {/* Bullet Specs */}
                    <ul className="mt-2.5 space-y-1">
                      {work.specs.slice(0, 2).map((sp, idx) => (
                        <li key={idx} className="text-[11px] text-neutral-600 flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{sp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Tag Footer for this BHK */}
                  <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-[var(--muted-foreground)] font-medium">
                      Estimate for {selectedBhk}:
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-emerald-100 text-emerald-900 font-mono"
                          : "bg-neutral-100 text-neutral-700 font-mono"
                      }`}
                    >
                      {priceInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Live Price Estimate Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                    Estimated Investment ({selectedBhk})
                  </span>
                  {calculation.discountPercent > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      <BadgePercent className="h-3 w-3" />
                      {calculation.discountPercent}% Bundle Savings Applied!
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3 mt-1">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                    {calculation.selectedItems.length > 0
                      ? calculation.formattedRange
                      : "₹0 (Select spaces above)"}
                  </div>
                  {calculation.discountPercent > 0 && (
                    <div className="text-xs text-neutral-400 line-through">
                      {calculation.formattedRawRange}
                    </div>
                  )}
                </div>

                <p className="text-xs text-neutral-400 mt-1">
                  Includes 18mm semi-marine ply, branded hardware (Blum/Hettich), architectural drawings, 3D renders, civil labor &amp; GST.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="bg-transparent text-white border-neutral-700 hover:bg-neutral-800 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                  Back
                </Button>

                <Button
                  type="button"
                  variant="gold"
                  size="md"
                  onClick={handleProceedToDetails}
                  disabled={selectedWorkIds.length === 0}
                  className="text-xs uppercase tracking-wider font-bold shadow-lg"
                >
                  <span>Connect on WhatsApp</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Selected Work Pills */}
            <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-neutral-400 font-medium">Selected ({selectedWorkIds.length}):</span>
              {calculation.selectedItems.map((item) => (
                <span
                  key={item.name}
                  className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center gap-1"
                >
                  <Check className="h-2.5 w-2.5 text-emerald-400" />
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: Customer Details & Immediate WhatsApp Forwarding */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-6"
        >
          {/* Summary Banner of Chosen Estimate */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Your Instant Estimate Summary
              </span>
              <div className="text-lg font-bold font-display text-[var(--foreground)] mt-0.5">
                {selectedBhk} • {calculation.formattedRange}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {calculation.selectedItems.length} works selected • 45-day move-in guarantee
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-[#8a6218] hover:text-[#c59b4c] font-semibold hover:underline self-start sm:self-auto"
            >
              Modify Works &amp; Budget
            </button>
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                Your Full Name <span className="text-rose-600">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Priya Sharma / Rohan Deshmukh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                  WhatsApp Contact Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Input
                    required
                    type="tel"
                    placeholder="+91 98201 23456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-xs pl-8 font-mono"
                  />
                  <Phone className="h-3.5 w-3.5 text-neutral-400 absolute left-2.5 top-3.5" />
                </div>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                  We will forward the detailed quotation directly to this WhatsApp number.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="priya.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                  Mumbai Area / Society Name <span className="text-rose-600">*</span>
                </label>
                <select
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  className="h-11 w-full rounded-[var(--radius)] border border-[var(--border)] px-3 text-xs bg-white text-[var(--foreground)]"
                >
                  <option value="Central Suburbs (Asalpha, Ghatkopar, Powai)">Central Suburbs (Asalpha, Ghatkopar, Powai)</option>
                  <option value="Western Suburbs (Andheri, Bandra, Juhu, Malad)">Western Suburbs (Andheri, Bandra, Juhu, Malad)</option>
                  <option value="South Mumbai (Worli, Lower Parel, Byculla)">South Mumbai (Worli, Lower Parel, Byculla)</option>
                  <option value="Thane & Navi Mumbai">Thane &amp; Navi Mumbai</option>
                  <option value="Mira Road, Vasai & Virar">Mira Road, Vasai &amp; Virar</option>
                  <option value="Other Mumbai Region">Other Mumbai Region</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                  Possession / Move-in Timeline
                </label>
                <select
                  value={possessionTimeline}
                  onChange={(e) => setPossessionTimeline(e.target.value)}
                  className="h-11 w-full rounded-[var(--radius)] border border-[var(--border)] px-3 text-xs bg-white text-[var(--foreground)]"
                >
                  <option value="Ready to Move (Immediate execution)">Ready to Move (Immediate execution)</option>
                  <option value="Within 30–60 Days">Within 30–60 Days</option>
                  <option value="In 2–4 Months">In 2–4 Months</option>
                  <option value="In 4–6+ Months">In 4–6+ Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                Specific Requests or Floor Plan Link (Optional)
              </label>
              <Textarea
                placeholder="e.g. Society name (e.g. Hiranandani Powai, Godrej The Trees), modular kitchen counter shape, or preferred color palette..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Live WhatsApp Message Preview */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-emerald-800 font-semibold">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4 fill-[#25D366] text-[#25D366]" />
                  <span>Preview of message to WhatsApp (+91 7903038750):</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Verified Send
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-emerald-100 font-mono text-[11px] text-neutral-700 whitespace-pre-wrap leading-relaxed shadow-2xs">
                {`*🏠 New Free Consultation & Estimate — Interior Points*\n` +
                  `👤 *Customer Name:* ${name.trim() || "[Customer Name]"}\n` +
                  `📱 *Phone Number:* ${phone.trim() || "[WhatsApp Number]"}\n` +
                  `📍 *Location / Society:* ${cityArea}\n` +
                  `📐 *Floor Plan / BHK:* ${selectedBhk}\n` +
                  `💰 *Estimated Total:* ${calculation.formattedRange}\n` +
                  `📋 *Selected Works (${calculation.selectedItems.length}):*\n` +
                  calculation.selectedItems.map((item, idx) => `  ${idx + 1}. ✅ ${item.name} (${item.priceText})`).join("\n")}
              </div>
            </div>

            {/* Trust highlights */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 grid grid-cols-3 gap-2 text-center text-[10px] text-[var(--muted-foreground)]">
              <div>
                <span className="font-bold text-[var(--foreground)] block">₹0 Consultation</span>
                <span>Zero obligation</span>
              </div>
              <div>
                <span className="font-bold text-[var(--foreground)] block">60-Day Handover</span>
                <span>Dream Home Guarantee</span>
              </div>
              <div>
                <span className="font-bold text-[var(--foreground)] block">10-Yr Warranty</span>
                <span>Hettich / Hafele</span>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(2)}
                disabled={loading}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Pricing
              </Button>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={loading}
                className="flex-1 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting to WhatsApp Desk...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <MessageCircle className="h-4 w-4 fill-white" />
                    <span>Send Consultation to WhatsApp (+91 7903038750)</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STEP 4: Success & Direct WhatsApp Action Screen */}
      {step === 4 && finalResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-6 text-center space-y-5"
        >
          <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
              Consultation &amp; Estimate Ready!
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[var(--foreground)]">{finalResult.name}</strong>. Your custom {finalResult.bhk} scope ({finalResult.totalRange}) has been registered and formatted for our WhatsApp design desk at{" "}
              <strong className="text-[var(--foreground)]">+91 7903038750</strong>.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-50 border border-[var(--border)] text-left text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-[var(--muted-foreground)]">Configuration:</span>
              <strong className="text-[var(--foreground)] font-mono">{finalResult.bhk}</strong>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-[var(--muted-foreground)]">Estimated Investment:</span>
              <strong className="text-emerald-700 font-bold font-mono text-sm">{finalResult.totalRange}</strong>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-[var(--muted-foreground)]">Client WhatsApp:</span>
              <span className="font-mono text-[var(--foreground)]">{finalResult.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Location / Society:</span>
              <span className="text-[var(--foreground)] font-medium truncate max-w-[220px]">{finalResult.area}</span>
            </div>
          </div>

          <div className="pt-2 max-w-md mx-auto space-y-3">
            <a
              href={finalResult.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              <span>Open Chat on WhatsApp (+91 7903038750)</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+917903038750"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-neutral-50 text-[var(--foreground)] text-xs font-semibold shadow-2xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-[#c59b4c]" />
                <span>Call 7903038750</span>
              </a>

              <a
                href="tel:+918788516537"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-white hover:bg-neutral-50 text-[var(--foreground)] text-xs font-semibold shadow-2xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Call 8788516537</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                const summary =
                  `Interior Points Consultation — ${finalResult.bhk}\n` +
                  `Estimate: ${finalResult.totalRange}\n` +
                  `Client: ${finalResult.name} (${finalResult.phone})\n` +
                  `Location: ${finalResult.area}\n` +
                  `Works:\n` +
                  finalResult.selectedWorks.map((w) => `• ${w}`).join("\n");
                try {
                  navigator.clipboard.writeText(summary);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 3000);
                } catch {
                  // Fallback
                }
              }}
              className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all ${
                copied
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "border-[var(--border)] bg-white hover:bg-neutral-50 text-[var(--foreground)]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Quotation Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Copy Full Quotation Summary</span>
                </>
              )}
            </button>

            {onSuccessClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSuccessClose}
                className="w-full text-xs uppercase tracking-wider"
              >
                Close &amp; Return to Website
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
