import React, { useState, useEffect } from "react";
import { EstimatorSpace, FloorPlanType, ScopeWorkPricing } from "../../types";
import {
  X,
  Sparkles,
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
  Building2,
  Briefcase,
  Check,
  Plus,
  Trash2,
  Loader2,
  DollarSign,
  Info,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";
import { formatPriceInLakhs, generatePriceLabel } from "../../lib/estimator-service";

interface EstimatorSpaceModalProps {
  isOpen: boolean;
  spaceToEdit: EstimatorSpace | null;
  onClose: () => void;
  onSave: (space: EstimatorSpace) => Promise<void>;
}

const AVAILABLE_ICONS = [
  { name: "ChefHat", label: "Kitchen", icon: ChefHat },
  { name: "DoorOpen", label: "Wardrobe", icon: DoorOpen },
  { name: "Tv", label: "TV / Living", icon: Tv },
  { name: "SunMedium", label: "Ceiling / Light", icon: SunMedium },
  { name: "Paintbrush", label: "Painting / Wall", icon: Paintbrush },
  { name: "Bath", label: "Bathroom / Civil", icon: Bath },
  { name: "Armchair", label: "Furniture / Decor", icon: Armchair },
  { name: "Zap", label: "Electrical / Smart", icon: Zap },
  { name: "Layers", label: "Flooring / Marble", icon: Layers },
  { name: "Briefcase", label: "Study / Office", icon: Briefcase },
  { name: "Home", label: "Balcony / Space", icon: Home },
  { name: "Sparkles", label: "Luxury Feature", icon: Sparkles },
];

const FLOOR_PLANS: FloorPlanType[] = ["1 BHK", "2 BHK", "3 BHK", "4 BHK / Villa"];

export function EstimatorSpaceModal({
  isOpen,
  spaceToEdit,
  onClose,
  onSave,
}: EstimatorSpaceModalProps) {
  const [formData, setFormData] = useState<EstimatorSpace>({
    id: "",
    name: "",
    category: "Living & Joinery",
    iconName: "Sparkles",
    tagline: "",
    specs: [""],
    popular: false,
    enabled: true,
    pricing: {
      "1 BHK": { min: 40000, max: 55000, label: "₹40k – ₹55k" },
      "2 BHK": { min: 70000, max: 95000, label: "₹70k – ₹95k" },
      "3 BHK": { min: 110000, max: 145000, label: "₹1.10L – ₹1.45L" },
      "4 BHK / Villa": { min: 155000, max: 195000, label: "₹1.55L – ₹1.95L" },
    },
  });

  const [activeBhkTab, setActiveBhkTab] = useState<FloorPlanType>("2 BHK");
  const [priceViewMode, setPriceViewMode] = useState<"all" | "tabs">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (spaceToEdit) {
      setFormData(JSON.parse(JSON.stringify(spaceToEdit)));
    } else {
      setFormData({
        id: `space-${Date.now()}`,
        name: "",
        category: "Custom Space",
        iconName: "Sparkles",
        tagline: "Custom crafted joinery and architectural fittings for Mumbai homes",
        specs: [
          "Bespoke layout with high-durability hardware",
          "Seamless edge banding with 10-year warranty",
        ],
        popular: false,
        enabled: true,
        pricing: {
          "1 BHK": { min: 40000, max: 55000, label: "₹40k – ₹55k" },
          "2 BHK": { min: 70000, max: 95000, label: "₹70k – ₹95k" },
          "3 BHK": { min: 110000, max: 145000, label: "₹1.10L – ₹1.45L" },
          "4 BHK / Villa": { min: 155000, max: 195000, label: "₹1.55L – ₹1.95L" },
        },
      });
    }
    setError(null);
  }, [spaceToEdit, isOpen]);

  const handleApplyPercentageChange = (percent: number) => {
    setFormData((prev) => {
      const nextPricing = { ...prev.pricing };
      FLOOR_PLANS.forEach((bhk) => {
        const cur = nextPricing[bhk];
        if (cur) {
          const factor = 1 + percent / 100;
          const newMin = Math.round((cur.min * factor) / 1000) * 1000;
          const newMax = Math.round((cur.max * factor) / 1000) * 1000;
          nextPricing[bhk] = {
            min: newMin,
            max: newMax,
            label: generatePriceLabel(newMin, newMax),
          };
        }
      });
      return { ...prev, pricing: nextPricing };
    });
  };

  if (!isOpen) return null;

  const handlePriceChange = (
    bhk: FloorPlanType,
    field: "min" | "max" | "label",
    value: any
  ) => {
    setFormData((prev) => {
      const nextPricing = { ...prev.pricing };
      const currentBhkPricing = nextPricing[bhk] || { min: 0, max: 0, label: "" };

      let updatedVal = value;
      if (field === "min" || field === "max") {
        updatedVal = Math.max(0, parseInt(value, 10) || 0);
      }

      nextPricing[bhk] = {
        ...currentBhkPricing,
        [field]: updatedVal,
      };

      return {
        ...prev,
        pricing: nextPricing,
      };
    });
  };

  const handleAutoLabel = (bhk: FloorPlanType) => {
    const current = formData.pricing[bhk];
    if (!current) return;
    const autoLabel = generatePriceLabel(current.min, current.max);
    handlePriceChange(bhk, "label", autoLabel);
  };

  const handleAutoLabelAll = () => {
    setFormData((prev) => {
      const nextPricing = { ...prev.pricing };
      FLOOR_PLANS.forEach((bhk) => {
        const cur = nextPricing[bhk];
        if (cur) {
          nextPricing[bhk] = {
            ...cur,
            label: generatePriceLabel(cur.min, cur.max),
          };
        }
      });
      return { ...prev, pricing: nextPricing };
    });
  };

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), ""],
    }));
  };

  const handleUpdateSpec = (index: number, val: string) => {
    setFormData((prev) => {
      const nextSpecs = [...(prev.specs || [])];
      nextSpecs[index] = val;
      return { ...prev, specs: nextSpecs };
    });
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => {
      const nextSpecs = (prev.specs || []).filter((_, i) => i !== index);
      return { ...prev, specs: nextSpecs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please provide a name for this space/work.");
      return;
    }

    // Clean specs
    const cleanSpecs = (formData.specs || [])
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: EstimatorSpace = {
      ...formData,
      name: formData.name.trim(),
      category: formData.category.trim() || "Custom Space",
      tagline: formData.tagline.trim(),
      specs: cleanSpecs.length > 0 ? cleanSpecs : ["Bespoke execution with branded materials"],
    };

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || "Failed to save estimator space");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[var(--border)] max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--accent-foreground)]">
              Cost Estimator Configuration
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              {spaceToEdit ? `Edit "${spaceToEdit.name}" & Market Prices` : "Add New Space to Estimator"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                Space / Work Name *
              </label>
              <Input
                required
                placeholder="e.g. Modular Kitchen, Home Office, Balcony Deck"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
                Category Title
              </label>
              <Input
                placeholder="e.g. Cooking Sanctuary, Workspace, Outdoor Living"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-xs font-semibold text-[var(--foreground)] block mb-1.5">
              Choose Visual Icon
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = formData.iconName === item.name;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconName: item.name })}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? "border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-2xs"
                        : "border-[var(--border)] bg-neutral-50/70 hover:bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <IconComp className="h-4 w-4" />
                    <span className="text-[10px] truncate max-w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tagline / Material Highlights */}
          <div>
            <label className="text-xs font-semibold text-[var(--foreground)] block mb-1">
              Tagline &amp; Material Guarantee (Shown on Card)
            </label>
            <Input
              placeholder="e.g. 18mm Marine Ply, Anti-scratch Acrylic & Blum Tandem Drawers"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="text-xs"
            />
          </div>

          {/* Specifications list */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Specification Bullet Points
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Bullet Point</span>
              </button>
            </div>
            <div className="space-y-2">
              {(formData.specs || []).map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono w-4">{idx + 1}.</span>
                  <Input
                    placeholder="e.g. L-shape layout with Quartz countertop & soft-close drawers"
                    value={spec}
                    onChange={(e) => handleUpdateSpec(idx, e.target.value)}
                    className="text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-2 text-neutral-400 hover:text-rose-600 transition-colors rounded-md"
                    title="Remove point"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Featured Flags */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled !== false}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-[var(--foreground)] font-semibold">
                Active in "Select Spaces &amp; Calculate" (Public Estimator)
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="h-4 w-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-[var(--foreground)] font-semibold">
                Mark as "Popular / Recommended Choice"
              </span>
            </label>
          </div>

          {/* Market Price Management Matrix */}
          <div className="space-y-3 pt-2 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[var(--foreground)] font-display flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span>Market Price According to Flat Size (BHK)</span>
                </h4>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Live calculations dynamically calculate Min &amp; Max prices when customers select this space on the website.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* View Mode Toggle */}
                <div className="inline-flex p-0.5 rounded-lg bg-neutral-100 border border-[var(--border)] text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPriceViewMode("all")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      priceViewMode === "all"
                        ? "bg-white text-[var(--foreground)] shadow-xs"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    All BHKs Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceViewMode("tabs")}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      priceViewMode === "tabs"
                        ? "bg-white text-[var(--foreground)] shadow-xs"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Tab View
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAutoLabelAll}
                  className="text-xs text-emerald-700 hover:underline font-semibold"
                >
                  Auto-Format All Labels
                </button>
              </div>
            </div>

            {/* Quick Market Adjustment Presets */}
            <div className="flex items-center gap-1.5 flex-wrap p-2.5 rounded-xl bg-neutral-50 border border-[var(--border)] text-xs">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mr-1">
                Quick Market Adjust:
              </span>
              <button
                type="button"
                onClick={() => handleApplyPercentageChange(5)}
                className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 font-semibold text-[11px] transition-colors"
                title="Increase all BHK prices by 5% according to inflation/material cost"
              >
                +5% Rise
              </button>
              <button
                type="button"
                onClick={() => handleApplyPercentageChange(10)}
                className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 font-semibold text-[11px] transition-colors"
                title="Increase all BHK prices by 10%"
              >
                +10% Rise
              </button>
              <button
                type="button"
                onClick={() => handleApplyPercentageChange(-5)}
                className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 font-semibold text-[11px] transition-colors"
                title="Discount all BHK prices by 5%"
              >
                -5% Discount
              </button>
            </div>

            {/* Price View: All BHKs Grid */}
            {priceViewMode === "all" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {FLOOR_PLANS.map((bhk) => {
                  const currentPricing = formData.pricing[bhk] || {
                    min: 0,
                    max: 0,
                    label: "",
                  };

                  return (
                    <div
                      key={bhk}
                      className="p-3.5 rounded-xl bg-neutral-50/90 border border-neutral-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                          {bhk} Market Rates
                        </span>
                        <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 font-bold truncate max-w-[150px]">
                          {currentPricing.label || "₹0"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-semibold text-neutral-600 block mb-1">
                            Min Price (₹)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={currentPricing.min}
                            onChange={(e) =>
                              handlePriceChange(bhk, "min", e.target.value)
                            }
                            className="text-xs font-mono h-8"
                          />
                          <span className="text-[9px] text-neutral-400 mt-0.5 block">
                            {formatPriceInLakhs(currentPricing.min)}
                          </span>
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-neutral-600 block mb-1">
                            Max Price (₹)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={currentPricing.max}
                            onChange={(e) =>
                              handlePriceChange(bhk, "max", e.target.value)
                            }
                            className="text-xs font-mono h-8"
                          />
                          <span className="text-[9px] text-neutral-400 mt-0.5 block">
                            {formatPriceInLakhs(currentPricing.max)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-semibold text-neutral-600">
                            Display Label
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAutoLabel(bhk)}
                            className="text-[9px] text-rose-600 hover:underline font-bold"
                          >
                            Auto
                          </button>
                        </div>
                        <Input
                          placeholder="e.g. ₹1.85L – ₹2.20L"
                          value={currentPricing.label}
                          onChange={(e) =>
                            handlePriceChange(bhk, "label", e.target.value)
                          }
                          className="text-xs font-mono h-8"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Tab Mode */
              <>
                <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-[var(--border)] gap-1 w-full sm:w-auto">
                  {FLOOR_PLANS.map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setActiveBhkTab(bhk)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeBhkTab === bhk
                          ? "bg-white text-[var(--foreground)] shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>

                {(() => {
                  const currentPricing = formData.pricing[activeBhkTab] || {
                    min: 0,
                    max: 0,
                    label: "",
                  };

                  return (
                    <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                          Market Pricing for {activeBhkTab}
                        </span>
                        <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 font-bold">
                          Preview: {currentPricing.label || "No price specified"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                            Minimum Price (₹)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={currentPricing.min}
                            onChange={(e) =>
                              handlePriceChange(activeBhkTab, "min", e.target.value)
                            }
                            className="text-xs font-mono"
                          />
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">
                            Equivalent: {formatPriceInLakhs(currentPricing.min)}
                          </span>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                            Maximum Price (₹)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={currentPricing.max}
                            onChange={(e) =>
                              handlePriceChange(activeBhkTab, "max", e.target.value)
                            }
                            className="text-xs font-mono"
                          />
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">
                            Equivalent: {formatPriceInLakhs(currentPricing.max)}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-semibold text-neutral-600">
                              Display Label
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAutoLabel(activeBhkTab)}
                              className="text-[10px] text-rose-600 hover:underline font-bold"
                            >
                              Auto Label
                            </button>
                          </div>
                          <Input
                            placeholder="e.g. ₹1.85L – ₹2.20L"
                            value={currentPricing.label}
                            onChange={(e) =>
                              handlePriceChange(activeBhkTab, "label", e.target.value)
                            }
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="text-xs font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving Space &amp; Prices...
                </>
              ) : (
                "Save Space & Market Prices"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
