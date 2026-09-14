import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db";
import { generateConsultationReply } from "./server/gemini";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Baseline Security Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Projects
  app.get("/api/projects", (req, res) => {
    let projects = db.getProjects();
    const { featured, bhk, room } = req.query;

    if (featured === "true") {
      projects = projects.filter((p) => p.featured);
    }
    if (bhk && typeof bhk === "string" && bhk !== "All") {
      projects = projects.filter((p) => p.bhkType.toLowerCase() === bhk.toLowerCase());
    }
    if (room && typeof room === "string" && room !== "All") {
      projects = projects.filter((p) => p.roomTypes.some((r) => r.toLowerCase() === room.toLowerCase()));
    }

    res.json({ success: true, count: projects.length, data: projects });
  });

  app.get("/api/projects/:slug", (req, res) => {
    const project = db.getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }
    res.json({ success: true, data: project });
  });

  app.post("/api/projects", (req, res) => {
    const body = req.body;
    if (!body.title || !body.bhkType || !body.location) {
      res.status(400).json({ success: false, error: "Title, BHK type, and location are required" });
      return;
    }
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newProject = {
      ...body,
      id: body.id || `proj-${Date.now()}`,
      slug,
      roomTypes: body.roomTypes || ["Full Home"],
      images: body.images && body.images.length > 0 ? body.images : [body.coverImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
      scope: body.scope || ["Modular Kitchen", "Wardrobes", "False Ceiling"],
      timeline: body.timeline || "45 Days",
      budgetRange: body.budgetRange || "₹8.0L - ₹12.0L",
      description: body.description || "Bespoke home interior designed and executed by Interior Points.",
      featured: body.featured ?? true,
    };
    const saved = db.saveProject(newProject);
    res.status(201).json({ success: true, data: saved });
  });

  app.put("/api/projects/:id", (req, res) => {
    const existing = db.getProjectBySlug(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }
    const updated = db.saveProject({
      ...existing,
      ...req.body,
      id: existing.id,
    });
    res.json({ success: true, data: updated });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const deleted = db.deleteProject(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }
    res.json({ success: true, message: "Project removed successfully" });
  });

  // Testimonials
  app.get("/api/testimonials", (req, res) => {
    const testimonials = db.getTestimonials();
    res.json({ success: true, count: testimonials.length, data: testimonials });
  });

  app.post("/api/testimonials", (req, res) => {
    const body = req.body;
    if (!body.name || !body.quote) {
      res.status(400).json({ success: false, error: "Name and testimonial quote are required" });
      return;
    }
    const newTestimonial = {
      id: body.id || `test-${Date.now()}`,
      name: body.name,
      bhkType: body.bhkType || "3 BHK Home",
      location: body.location || "Bengaluru",
      quote: body.quote,
      rating: Number(body.rating) || 5,
      avatar: body.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      date: body.date || "Recent",
      projectSlug: body.projectSlug,
    };
    const saved = db.saveTestimonial(newTestimonial);
    res.status(201).json({ success: true, data: saved });
  });

  app.delete("/api/testimonials/:id", (req, res) => {
    const deleted = db.deleteTestimonial(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "Testimonial not found" });
      return;
    }
    res.json({ success: true, message: "Testimonial deleted successfully" });
  });

  // Credibility Stats
  app.get("/api/stats", (req, res) => {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  });

  app.put("/api/stats", (req, res) => {
    if (!Array.isArray(req.body)) {
      res.status(400).json({ success: false, error: "Stats must be an array" });
      return;
    }
    const saved = db.saveStats(req.body);
    res.json({ success: true, data: saved });
  });

  // WhatsApp helper for consultation forwarding (+91 7903038750)
  const WHATSAPP_CONSULTATION_PHONE = "917903038750";

  function buildWhatsAppConsultationUrl(data: {
    name?: string;
    phone?: string;
    email?: string;
    city?: string;
    bhkType?: string;
    message?: string;
  }) {
    const parts = [
      `*New Free Consultation Query — Interior Points*`,
      `• *Full Name:* ${data.name || "Customer"}`,
      `• *Phone Number:* ${data.phone || "Not provided"}`,
      `• *Email Address:* ${data.email || "Not provided"}`,
      `• *City / Location:* ${data.city || "Bengaluru"}`,
      `• *Home Configuration:* ${data.bhkType || "Residential"}`,
    ];
    if (data.message && data.message.trim()) {
      parts.push(`• *Apartment / Requirements:* ${data.message.trim()}`);
    }
    parts.push(`\n_Forwarded automatically from Interior Points Web Studio_`);
    const text = parts.join("\n");
    return `https://wa.me/${WHATSAPP_CONSULTATION_PHONE}?text=${encodeURIComponent(text)}`;
  }

  // Leads (Contact form submissions) & WhatsApp forwarding
  app.post("/api/leads", (req, res) => {
    const { name, phone, email, city, bhkType, message } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ success: false, error: "Name is required" });
      return;
    }
    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      res.status(400).json({ success: false, error: "A valid phone number is required" });
      return;
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, error: "A valid email address is required" });
      return;
    }
    if (!bhkType) {
      res.status(400).json({ success: false, error: "Please select your BHK type" });
      return;
    }

    const lead = db.addLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city?.trim() || "Bengaluru",
      bhkType: bhkType,
      message: message?.trim() || "",
    });

    const whatsappUrl = buildWhatsAppConsultationUrl({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: lead.city,
      bhkType: lead.bhkType,
      message: lead.message,
    });

    res.status(201).json({
      success: true,
      message: "Consultation inquiry registered successfully",
      data: lead,
      whatsappUrl,
      whatsappPhone: "+91 7903038750",
    });
  });

  // Dedicated WhatsApp API Route for direct redirecting consultation queries with full form data
  app.get("/api/whatsapp-redirect", (req, res) => {
    const { name, phone, email, city, bhkType, message } = req.query;
    const whatsappUrl = buildWhatsAppConsultationUrl({
      name: typeof name === "string" ? name : undefined,
      phone: typeof phone === "string" ? phone : undefined,
      email: typeof email === "string" ? email : undefined,
      city: typeof city === "string" ? city : undefined,
      bhkType: typeof bhkType === "string" ? bhkType : undefined,
      message: typeof message === "string" ? message : undefined,
    });

    if (req.headers.accept?.includes("application/json")) {
      res.json({ success: true, whatsappUrl, whatsappPhone: "+91 7903038750" });
      return;
    }
    res.redirect(whatsappUrl);
  });

  app.get("/api/leads", (req, res) => {
    const leads = db.getLeads();
    res.json({ success: true, count: leads.length, data: leads });
  });

  app.patch("/api/leads/:id", (req, res) => {
    const { status } = req.body;
    if (!status || !["new", "contacted", "scheduled", "closed"].includes(status)) {
      res.status(400).json({ success: false, error: "Valid status required" });
      return;
    }
    const updated = db.updateLeadStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    res.json({ success: true, data: updated });
  });

  app.delete("/api/leads/:id", (req, res) => {
    const deleted = db.deleteLead(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "Lead not found" });
      return;
    }
    res.json({ success: true, message: "Lead removed" });
  });

  // Admin Auth / Verification
  app.post("/api/admin/verify", (req, res) => {
    const { passcode } = req.body;
    // Primary admin password: saifi@2005
    const validPasscodes = ["saifi@2005", process.env.ADMIN_PASSCODE, "interiorpoints2026", "nivas2026"].filter(Boolean);
    if (validPasscodes.includes(passcode)) {
      res.json({ success: true, authenticated: true, token: "interiorpoints-admin-authenticated-session" });
    } else {
      res.status(401).json({
        success: false,
        authenticated: false,
        error: "Incorrect password.",
        hint: "Hint: birth year",
      });
    }
  });

  // Gemini Consultation Chatbot
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ success: false, error: "Message is required" });
      return;
    }

    try {
      const reply = await generateConsultationReply(message, history || []);
      res.json({ success: true, reply });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to generate AI consultation reply",
        reply: "Our senior design consultants are available to guide you through materials, 3D layouts, and ballpark estimates for your 1, 2, or 3 BHK. Please submit the consultation form on this page or message us directly via WhatsApp (+91 7903038750)!",
      });
    }
  });

  // --- Vite Dev Middleware or Production Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Interior Points server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
