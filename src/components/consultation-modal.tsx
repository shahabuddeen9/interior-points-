import React, { useState } from "react";
import { Dialog } from "./ui/dialog";
import { Input, Textarea } from "./ui/input";
import { Button } from "./ui/button";
import { CheckCircle2, Loader2, ArrowRight, MessageCircle } from "lucide-react";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Mumbai",
    bhkType: "2 BHK",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError("Please fill in your name, phone number, and email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Submission failed");
      }

      const whatsappRedirectUrl =
        result.whatsappUrl ||
        `/api/whatsapp-redirect?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&email=${encodeURIComponent(formData.email)}&city=${encodeURIComponent(formData.city)}&bhkType=${encodeURIComponent(formData.bhkType)}&message=${encodeURIComponent(formData.message)}`;

      setSubmittedData({
        ...result.data,
        whatsappUrl: whatsappRedirectUrl,
      });

      // Automatically forward to WhatsApp (+91 7903038750)
      try {
        window.open(whatsappRedirectUrl, "_blank");
      } catch (e) {
        console.warn("Popup blocked, redirecting on screen:", e);
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "Mumbai",
        bhkType: "2 BHK",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-lg">
      {submittedData ? (
        <div className="py-6 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
            Consultation Query Forwarded!
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-sm mx-auto leading-relaxed">
            Thank you, <strong className="text-[var(--foreground)]">{submittedData.name}</strong>. Your consultation details have been sent to our design studio at{" "}
            <strong className="text-[var(--foreground)]">+91 7903038750</strong> on WhatsApp.
          </p>

          <div className="max-w-xs mx-auto p-3 rounded bg-neutral-50 border border-[var(--border)] text-left text-xs space-y-1 font-body">
            <div><span className="text-[var(--muted-foreground)]">Configuration:</span> <strong>{submittedData.bhkType}</strong></div>
            <div><span className="text-[var(--muted-foreground)]">Location:</span> <strong>{submittedData.city}</strong></div>
            <div><span className="text-[var(--muted-foreground)]">Phone:</span> <strong>{submittedData.phone}</strong></div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={submittedData.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-[#20bd5a] transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Continue on WhatsApp (+91 7903038750)</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubmittedData(null);
                onOpenChange(false);
              }}
              className="text-xs uppercase tracking-wider"
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[var(--accent-foreground)] font-semibold">
              Free 3D Architectural Consultation
            </span>
            <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mt-0.5">
              Book Your 1-on-1 Design Session
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Zero fee • Physical material swatches • Direct WhatsApp sync (+91 7903038750)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <Input
                required
                placeholder="Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--foreground)]">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="+91 79030 38750"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--foreground)]">
                  Mumbai Area <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="h-11 w-full rounded-[var(--radius)] border border-[var(--border)] px-3 text-xs bg-white text-[var(--foreground)]"
                >
                  <option value="Mumbai - Central Suburbs (Asalpha, Ghatkopar, Powai)">Central Suburbs (Asalpha, Ghatkopar, Powai)</option>
                  <option value="Mumbai - Western Suburbs (Andheri, Bandra, Juhu)">Western Suburbs (Andheri, Bandra, Juhu)</option>
                  <option value="Mumbai - South Mumbai (Worli, Lower Parel)">South Mumbai (Worli, Lower Parel)</option>
                  <option value="Mumbai - Thane & Navi Mumbai">Thane & Navi Mumbai</option>
                  <option value="Mumbai - Other Area">Other Mumbai Region</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Email Address <span className="text-rose-600">*</span>
              </label>
              <Input
                required
                type="email"
                placeholder="priya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Configuration
              </label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {["1 BHK", "2 BHK", "3 BHK", "Kitchen"].map((bhk) => (
                  <button
                    type="button"
                    key={bhk}
                    onClick={() => setFormData({ ...formData, bhkType: bhk })}
                    className={`py-1.5 px-2 rounded-xs text-xs font-medium border text-center transition-all ${
                      formData.bhkType === bhk
                        ? "bg-[var(--primary)] text-white border-[var(--primary)] font-semibold"
                        : "bg-white border-[var(--border)] text-[var(--foreground)]"
                    }`}
                  >
                    {bhk}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--foreground)]">
                Optional Notes
              </label>
              <Textarea
                placeholder="Society name, possession date, or specific interior requests..."
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            {error && (
              <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded-xs border border-rose-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={loading}
              className="w-full text-xs font-semibold uppercase tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Forwarding to WhatsApp (+91 7903038750)...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Confirm & Connect on WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      )}
    </Dialog>
  );
}
