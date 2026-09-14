import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight, MessageCircle } from "lucide-react";
import { Input, Textarea } from "../ui/input";
import { Button } from "../ui/button";

export function ContactSection({ standalone = false }: { standalone?: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Mumbai",
    bhkType: "2 BHK",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 9) {
      setError("Please enter a valid phone number so our team can connect with you.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
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
        throw new Error(result.error || "Failed to submit consultation request");
      }

      const whatsappRedirectUrl =
        result.whatsappUrl ||
        `/api/whatsapp-redirect?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&email=${encodeURIComponent(formData.email)}&city=${encodeURIComponent(formData.city)}&bhkType=${encodeURIComponent(formData.bhkType)}&message=${encodeURIComponent(formData.message)}`;

      setSubmittedLead({
        ...result.data,
        whatsappUrl: whatsappRedirectUrl,
      });

      // Forward consultation data directly to WhatsApp (+91 7903038750)
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
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again or reach out on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`py-20 md:py-28 ${standalone ? "pt-12" : "border-b border-[var(--border)]"} bg-[var(--background)]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent-foreground)] font-semibold font-body">
            Begin Your Conversation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] mt-2">
            Schedule a Free Design Consultation
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3 leading-relaxed font-body">
            Meet with an interior architect at our studio or schedule a virtual walkthrough.
            Your query and requirements are forwarded immediately to WhatsApp (+91 7903038750) for rapid review.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[var(--radius)] border border-[var(--border)]">
            {submittedLead ? (
              <div className="py-6 text-center space-y-5 animate-in fade-in-50">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                    Query Forwarded, {submittedLead.name}!
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed">
                    Your consultation booking reference is{" "}
                    <span className="font-mono font-semibold text-[var(--foreground)]">
                      {submittedLead.id}
                    </span>
                    . Your full floorplan details and preferences have been forwarded to our senior designer at{" "}
                    <strong className="text-[var(--foreground)]">+91 7903038750</strong> on WhatsApp.
                  </p>
                </div>

                {/* Forwarded Data Summary Box */}
                <div className="max-w-md mx-auto p-4 rounded-md bg-neutral-50 border border-[var(--border)] text-left text-xs space-y-1.5 font-body">
                  <div className="font-semibold uppercase tracking-wider text-[var(--foreground)] pb-1 border-b border-[var(--border)] text-[11px]">
                    Forwarded Query Details
                  </div>
                  <div><span className="text-[var(--muted-foreground)]">Name:</span> <strong>{submittedLead.name}</strong></div>
                  <div><span className="text-[var(--muted-foreground)]">Phone:</span> <strong>{submittedLead.phone}</strong></div>
                  <div><span className="text-[var(--muted-foreground)]">Email:</span> <strong>{submittedLead.email}</strong></div>
                  <div><span className="text-[var(--muted-foreground)]">Location:</span> <strong>{submittedLead.city}</strong></div>
                  <div><span className="text-[var(--muted-foreground)]">Home Plan:</span> <strong>{submittedLead.bhkType}</strong></div>
                  {submittedLead.message && (
                    <div><span className="text-[var(--muted-foreground)]">Requirements:</span> {submittedLead.message}</div>
                  )}
                </div>

                {/* Direct WhatsApp Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={submittedLead.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-[#20bd5a] hover:scale-102 transition-all"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Open Chat on WhatsApp (+91 7903038750)</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setSubmittedLead(null)}
                    className="text-xs uppercase tracking-wider font-semibold text-[var(--accent-foreground)] hover:underline"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                      Full Name
                    </label>
                    <Input
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                      Phone Number
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="+91 79030 38750"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                      Email Address
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                      Location in Mumbai
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="flex h-11 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="Mumbai - Central Suburbs (Asalpha, Ghatkopar, Powai)">Central Suburbs (Asalpha, Ghatkopar, Powai)</option>
                      <option value="Mumbai - Western Suburbs (Andheri, Bandra, Juhu, Goregaon)">Western Suburbs (Andheri, Bandra, Juhu, Goregaon)</option>
                      <option value="Mumbai - South Mumbai (Worli, Lower Parel, Colaba)">South Mumbai (Worli, Lower Parel, Colaba)</option>
                      <option value="Mumbai - Thane & Navi Mumbai">Thane & Navi Mumbai</option>
                      <option value="Mumbai - Other Area">Other Mumbai Region</option>
                    </select>
                  </div>
                </div>

                {/* BHK Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                    Home Configuration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["1 BHK", "2 BHK", "3 BHK", "Modular Kitchen"].map((bhk) => (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => setFormData({ ...formData, bhkType: bhk })}
                        className={`py-2 px-3 rounded-xs border text-xs font-medium transition-all ${
                          formData.bhkType === bhk
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--border)] bg-neutral-50/50 text-[var(--muted-foreground)] hover:border-[var(--foreground)]"
                        }`}
                      >
                        {bhk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                    Apartment Society / Design Requirements (Optional)
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="e.g. Sobha Dream Acres 2 BHK, possession next month, looking for acrylic kitchen and floor-to-ceiling wardrobes"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xs bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full text-xs font-semibold uppercase tracking-wider"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Forwarding to WhatsApp (+91 7903038750)...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Schedule Consultation & Connect on WhatsApp
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-[11px] text-center text-[var(--muted-foreground)] font-body">
                  No obligation • In-house senior architects • Direct forward to WhatsApp (+91 7903038750)
                </p>
              </form>
            )}
          </div>

          {/* Right Column: Studio Information (Unboxed & Editorial) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                Direct Studio Contacts
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                Prefer an immediate conversation? Call our principal desk or connect on WhatsApp (+91 7903038750).
              </p>

              <div className="space-y-4 pt-2 border-t border-[var(--border)]">
                <a
                  href="tel:+917903038750"
                  className="flex items-center space-x-3.5 text-sm text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors group"
                >
                  <div className="h-9 w-9 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent-foreground)] shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">+91 7903038750</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Direct Studio Desk (Mon–Sun 9am–8pm)</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/917903038750?text=Hello%20Interior%20Points,%20I'd%20like%20to%20consult%20on%20my%20home's%20interior."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3.5 text-sm text-[var(--foreground)] hover:text-[#128C7E] transition-colors group"
                >
                  <div className="h-9 w-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">WhatsApp Instant Connect</div>
                    <div className="text-xs text-[var(--muted-foreground)]">+91 7903038750 — Share floorplans for instant BOQ</div>
                  </div>
                </a>

                <a
                  href="tel:+918788516537"
                  className="flex items-center space-x-3.5 text-sm text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors group"
                >
                  <div className="h-9 w-9 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent-foreground)] shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">+91 8788516537</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Secondary Studio & Site Desk</div>
                  </div>
                </a>

                <a
                  href="mailto:msfusionarchitects@gmail.com"
                  className="flex items-center space-x-3.5 text-sm text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors group"
                >
                  <div className="h-9 w-9 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent-foreground)] shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">msfusionarchitects@gmail.com</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Architectural drawings & formal proposals</div>
                  </div>
                </a>

                <a
                  href="mailto:interiorpoints97@gmail.com"
                  className="flex items-center space-x-3.5 text-sm text-[var(--foreground)] hover:text-[var(--accent-foreground)] transition-colors group"
                >
                  <div className="h-9 w-9 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--accent-foreground)] shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">interiorpoints97@gmail.com</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Client coordination & accounts</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Studio Address */}
            <div className="pt-6 border-t border-[var(--border)] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                <MapPin className="h-4 w-4 text-[var(--accent-foreground)]" />
                <span>Mumbai Studio & Workshop</span>
              </div>
              <p className="text-xs text-[var(--foreground)] font-medium leading-relaxed font-body">
                Shop no 3, Haji Fatima Manzil, near Asalpha Metro Station, Pereira Wadi, Asalpha, Mumbai, Maharashtra 400084
              </p>
              <div className="flex items-center space-x-2 text-xs text-[var(--muted-foreground)] pt-1">
                <Clock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                <span>Studio Timings: Monday – Sunday, 9:00 AM – 9:00 PM IST</span>
              </div>
            </div>

            {/* Map Frame */}
            <div className="rounded-[var(--radius)] overflow-hidden border border-[var(--border)] bg-neutral-100 relative h-44">
              <iframe
                title="Interior Points Studio Mumbai Map"
                src="https://maps.google.com/maps?q=Asalpha%20Metro%20Station,%20Pereira%20Wadi,%20Asalpha,%20Mumbai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale contrast-125 opacity-80"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
