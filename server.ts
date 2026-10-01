import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db";
import { generateConsultationReply } from "./server/gemini";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with 50mb limit for image uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Upload directories configuration
  const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
  const TMP_UPLOADS_DIR = path.join(
    process.platform === "win32" ? process.env.TEMP || "C:\\temp" : "/tmp",
    "interior-points-uploads"
  );

  try {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch {}
  try {
    if (!fs.existsSync(TMP_UPLOADS_DIR)) fs.mkdirSync(TMP_UPLOADS_DIR, { recursive: true });
  } catch {}

  const memoryImages = new Map<string, { buffer: Buffer; contentType: string }>();

  // Statically serve uploaded images before Vite middleware
  app.use("/uploads", express.static(UPLOADS_DIR));
  app.use("/uploads", express.static(TMP_UPLOADS_DIR));
  app.get("/uploads/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    const mainFile = path.join(UPLOADS_DIR, filename);
    const tmpFile = path.join(TMP_UPLOADS_DIR, filename);

    if (fs.existsSync(mainFile)) {
      return res.sendFile(mainFile);
    }
    if (fs.existsSync(tmpFile)) {
      return res.sendFile(tmpFile);
    }
    const mem = memoryImages.get(filename);
    if (mem) {
      res.setHeader("Content-Type", mem.contentType);
      return res.send(mem.buffer);
    }
    res.status(404).send("Image not found");
  });

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
    const cleanTitle = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = body.slug || `${cleanTitle}-${Date.now().toString().slice(-4)}`;
    const coverImage = body.coverImage || (Array.isArray(body.images) && body.images.length > 0 ? body.images[0] : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80");
    const images = Array.isArray(body.images) && body.images.length > 0 ? body.images : [coverImage];
    const scope = Array.isArray(body.scope)
      ? body.scope
      : typeof body.scope === "string"
      ? body.scope.split(",").map((s: string) => s.trim()).filter(Boolean)
      : ["Modular Kitchen", "Wardrobes", "False Ceiling"];

    const newProject = {
      ...body,
      id: body.id || `proj-${Date.now()}`,
      slug,
      coverImage,
      images,
      scope,
      roomTypes: body.roomTypes || ["Full Home"],
      timeline: body.timeline || "60 Days",
      budgetRange: body.budgetRange || "₹10.75L",
      description: body.description || "Bespoke home interior designed and executed by Interior Points.",
      featured: body.featured ?? true,
    };
    const saved = db.saveProject(newProject);
    res.status(201).json({ success: true, data: saved });
  });

  app.put("/api/projects/:id", (req, res) => {
    try {
      const rawParam = req.params.id || "";
      const decodedParam = decodeURIComponent(rawParam);
      const body = req.body || {};

      // Match existing project by param, decoded param, body.id, or body.slug
      const allProjects = db.getProjects();
      let existing = allProjects.find(
        (p) =>
          p.id === rawParam ||
          p.slug === rawParam ||
          p.id === decodedParam ||
          p.slug === decodedParam ||
          p.id?.toLowerCase() === rawParam.toLowerCase() ||
          p.slug?.toLowerCase() === rawParam.toLowerCase() ||
          p.id?.toLowerCase() === decodedParam.toLowerCase() ||
          p.slug?.toLowerCase() === decodedParam.toLowerCase()
      );

      if (!existing && body.id) {
        existing = allProjects.find((p) => p.id === body.id || p.id?.toLowerCase() === body.id.toLowerCase());
      }
      if (!existing && body.slug) {
        existing = allProjects.find((p) => p.slug === body.slug || p.slug?.toLowerCase() === body.slug.toLowerCase());
      }

      const coverImage = body.coverImage || existing?.coverImage || (Array.isArray(body.images) && body.images[0]) || "";
      let images = Array.isArray(body.images) && body.images.length > 0 ? body.images : (existing?.images || [coverImage]);
      if ((!images || images.length === 0) && coverImage) {
        images = [coverImage];
      }
      const scope = Array.isArray(body.scope)
        ? body.scope
        : typeof body.scope === "string"
        ? body.scope.split(",").map((s: string) => s.trim()).filter(Boolean)
        : existing?.scope || ["Full Home Modular Carpentry"];

      const targetId = existing?.id || body.id || (rawParam.startsWith("proj-") ? rawParam : `proj-${Date.now()}`);
      const targetSlug = body.slug || existing?.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : rawParam);

      const updated = db.saveProject({
        title: body.title || existing?.title || "Custom Residence",
        bhkType: body.bhkType || existing?.bhkType || "2 BHK",
        location: body.location || existing?.location || "Mumbai",
        city: body.city || existing?.city || "Mumbai",
        roomTypes: body.roomTypes || existing?.roomTypes || ["Full Home"],
        timeline: body.timeline || existing?.timeline || "50-60 Days",
        budgetRange: body.budgetRange || existing?.budgetRange || "₹10L - ₹15L",
        description: body.description || existing?.description || "",
        featured: body.featured !== undefined ? body.featured : (existing?.featured ?? true),
        ...(existing || {}),
        ...body,
        id: targetId,
        slug: targetSlug,
        coverImage,
        images,
        scope,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      console.error("Error in PUT /api/projects/:id:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", (req, res) => {
    const deleted = db.deleteProject(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: "Project not found" });
      return;
    }
    res.json({ success: true, message: "Project removed successfully" });
  });

  // Dedicated Image Upload API
  app.post("/api/upload", (req, res) => {
    try {
      const { image, data, filename, name } = req.body;
      const rawData = image || data;

      if (!rawData || typeof rawData !== "string") {
        res.status(400).json({ success: false, error: "Image data is required" });
        return;
      }

      // Detect format and extract base64 binary
      const matches = rawData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = "jpg";
      let contentType = "image/jpeg";

      if (matches && matches.length === 3) {
        contentType = matches[1];
        buffer = Buffer.from(matches[2], "base64");
        if (contentType.includes("png")) extension = "png";
        else if (contentType.includes("webp")) extension = "webp";
        else if (contentType.includes("gif")) extension = "gif";
        else if (contentType.includes("svg")) extension = "svg+xml";
      } else {
        buffer = Buffer.from(rawData, "base64");
      }

      const generatedName = `residence-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;

      // 1. Try to save to public uploads directory
      try {
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        fs.writeFileSync(path.join(UPLOADS_DIR, generatedName), buffer);
      } catch (err) {
        console.warn("Could not save to UPLOADS_DIR:", err);
      }

      // 2. Try to save to tmp directory
      try {
        if (!fs.existsSync(TMP_UPLOADS_DIR)) fs.mkdirSync(TMP_UPLOADS_DIR, { recursive: true });
        fs.writeFileSync(path.join(TMP_UPLOADS_DIR, generatedName), buffer);
      } catch (err) {
        console.warn("Could not save to TMP_UPLOADS_DIR:", err);
      }

      // 3. Fallback memory retention
      memoryImages.set(generatedName, { buffer, contentType });

      const url = `/uploads/${generatedName}`;
      res.json({
        success: true,
        url,
        filename: generatedName,
        size: buffer.length,
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to process image upload" });
    }
  });

  // Direct Photo Sync for an existing project (prevents unsaved image loss)
  app.post("/api/projects/:id/photos", (req, res) => {
    try {
      const targetId = req.params.id;
      const { images, coverImage } = req.body;
      const allProjects = db.getProjects();
      const existing = allProjects.find(
        (p) =>
          p.id === targetId ||
          p.slug === targetId ||
          p.id?.toLowerCase() === targetId.toLowerCase() ||
          p.slug?.toLowerCase() === targetId.toLowerCase()
      );

      if (!existing) {
        res.status(404).json({ success: false, error: "Project not found" });
        return;
      }

      const newImages = Array.isArray(images) && images.length > 0 ? images : existing.images;
      const newCover = coverImage || newImages[0] || existing.coverImage;

      const updated = db.saveProject({
        ...existing,
        images: newImages,
        coverImage: newCover,
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      console.error("Error updating project photos:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to update project photos" });
    }
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
      location: body.location || "Mumbai",
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
      `• *City / Location:* ${data.city || "Mumbai"}`,
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
    try {
      const body = req.body || {};
      const { name, phone, email, city, bhkType, message } = body;

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Please enter your name" });
      }
      if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
        return res.status(400).json({ success: false, error: "Please enter a valid phone number" });
      }
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "Please enter a valid email address" });
      }

      const cleanCity = typeof city === "string" && city.trim() ? city.trim() : "Mumbai";
      const cleanBhk = typeof bhkType === "string" && bhkType.trim() ? bhkType.trim() : "2 BHK";
      const cleanMessage = typeof message === "string" && message.trim() ? message.trim() : "";

      let lead;
      try {
        lead = db.addLead({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: cleanCity,
          bhkType: cleanBhk,
          message: cleanMessage,
        });
      } catch (dbErr) {
        console.warn("Could not save lead to disk store, using fallback record:", dbErr);
        lead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: cleanCity,
          bhkType: cleanBhk,
          message: cleanMessage,
          status: "new" as const,
          createdAt: new Date().toISOString(),
        };
      }

      const whatsappUrl = buildWhatsAppConsultationUrl({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        city: lead.city,
        bhkType: lead.bhkType,
        message: lead.message,
      });

      return res.status(201).json({
        success: true,
        message: "Consultation inquiry registered successfully",
        data: lead,
        whatsappUrl,
        whatsappPhone: "+91 7903038750",
      });
    } catch (err: any) {
      console.error("Error in POST /api/leads:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Failed to register consultation inquiry",
      });
    }
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
    const validPasscodes = ["saifi@2005", process.env.ADMIN_PASSCODE, "interiorpoints2026"].filter(Boolean);
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
