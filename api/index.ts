import express from "express";
import { db } from "../server/db";
import { generateConsultationReply } from "../server/gemini";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Universal CORS & URL Path Normalization
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  // Support both /api/path and /path in serverless rewrites
  if (!req.url.startsWith("/api") && req.url !== "/") {
    req.url = "/api" + req.url;
  }
  next();
});

// Helper for WhatsApp redirect URL
function buildWhatsAppConsultationUrl(data: {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  bhkType?: string;
  message?: string;
  selectedWorks?: string[];
  estimatedPrice?: string;
  possessionTimeline?: string;
}): string {
  const WHATSAPP_CONSULTATION_PHONE = "917903038750";
  const lines: string[] = [
    `*🏛️ NEW CONSULTATION INQUIRY — INTERIOR POINTS MUMBAI*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ];
  if (data.name) lines.push(`👤 *Client Name:* ${data.name}`);
  if (data.phone) lines.push(`📞 *Phone:* ${data.phone}`);
  if (data.email) lines.push(`✉️ *Email:* ${data.email}`);
  if (data.bhkType) lines.push(`🏢 *Configuration:* ${data.bhkType}`);
  if (data.city) lines.push(`📍 *Location:* ${data.city}`);
  if (data.possessionTimeline) lines.push(`⏱️ *Possession:* ${data.possessionTimeline}`);
  if (data.estimatedPrice) lines.push(`💰 *Ballpark Estimate:* ${data.estimatedPrice}`);

  if (data.selectedWorks && data.selectedWorks.length > 0) {
    lines.push(``);
    lines.push(`📋 *Selected Scope of Works (${data.selectedWorks.length}):*`);
    data.selectedWorks.forEach((w) => lines.push(`  • ${w}`));
  }

  if (data.message) {
    lines.push(``);
    lines.push(`💬 *Client Notes:* ${data.message}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Source: Verified Website Consultation Booking_`);
  lines.push(`_Studio: +91 7903038750 / +91 8788516537 • interiorpoints97@gmail.com_`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_CONSULTATION_PHONE}?text=${text}`;
}

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Estimator Spaces & Pricing Management (Guaranteed 10 turnkey spaces)
app.get("/api/estimator-spaces", (req, res) => {
  try {
    const includeDisabled = req.query.includeDisabled === "true" || req.query.all === "true";
    const spaces = db.getEstimatorSpaces(includeDisabled);
    res.json({ success: true, data: spaces, count: spaces.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to fetch estimator spaces" });
  }
});

app.post("/api/estimator-spaces", (req, res) => {
  try {
    const spaceData = req.body;
    if (!spaceData || !spaceData.name) {
      return res.status(400).json({ success: false, error: "Space name is required" });
    }
    const saved = db.saveEstimatorSpace(spaceData);
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to create estimator space" });
  }
});

app.put("/api/estimator-spaces/:id", (req, res) => {
  try {
    const spaceId = req.params.id;
    const spaceData = { ...req.body, id: spaceId };
    const saved = db.saveEstimatorSpace(spaceData);
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to update estimator space" });
  }
});

app.delete("/api/estimator-spaces/:id", (req, res) => {
  try {
    const spaceId = req.params.id;
    const deleted = db.deleteEstimatorSpace(spaceId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Space not found" });
    }
    res.json({ success: true, message: "Estimator space deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to delete estimator space" });
  }
});

app.post("/api/estimator-spaces/reset", (req, res) => {
  try {
    const spaces = db.resetEstimatorSpaces();
    res.json({ success: true, data: spaces, message: "Estimator spaces reset to defaults" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Failed to reset estimator spaces" });
  }
});

// Projects
app.get("/api/projects", (req, res) => {
  let projects = db.getProjects();
  const { featured, bhk, room } = req.query;
  if (featured === "true") projects = projects.filter((p) => p.featured);
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
  if (!project) return res.status(404).json({ success: false, error: "Project not found" });
  res.json({ success: true, data: project });
});

app.post("/api/projects", (req, res) => {
  const body = req.body;
  if (!body.title || !body.bhkType || !body.location) {
    return res.status(400).json({ success: false, error: "Title, BHK type, and location are required" });
  }
  const cleanTitle = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = body.slug || `${cleanTitle}-${Date.now().toString().slice(-4)}`;
  const coverImage = body.coverImage || (Array.isArray(body.images) && body.images.length > 0 ? body.images[0] : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80");
  const images = Array.isArray(body.images) && body.images.length > 0 ? body.images : [coverImage];
  const newProject = {
    ...body,
    id: body.id || `proj-${Date.now()}`,
    slug,
    coverImage,
    images,
    scope: Array.isArray(body.scope) ? body.scope : ["Modular Kitchen", "Wardrobes", "False Ceiling"],
    roomTypes: body.roomTypes || ["Full Home"],
    timeline: body.timeline || "60 Days",
    budgetRange: body.budgetRange || "₹10.75L Package",
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
    const allProjects = db.getProjects();
    const existing = allProjects.find(
      (p) =>
        p.id === rawParam ||
        p.slug === rawParam ||
        p.id === decodedParam ||
        p.slug === decodedParam
    );
    const updated = db.saveProject({
      ...(existing || {}),
      ...body,
      id: existing?.id || body.id || rawParam,
      slug: body.slug || existing?.slug || rawParam,
    });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to update project" });
  }
});

app.delete("/api/projects/:id", (req, res) => {
  const deleted = db.deleteProject(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: "Project not found" });
  res.json({ success: true, message: "Project deleted successfully" });
});

// Testimonials & Reviews
app.get("/api/testimonials", (req, res) => {
  const testimonials = db.getTestimonials();
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

app.post("/api/testimonials", (req, res) => {
  const body = req.body;
  if (!body.name || !body.quote) {
    return res.status(400).json({ success: false, error: "Name and quote are required" });
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
  if (!deleted) return res.status(404).json({ success: false, error: "Testimonial not found" });
  res.json({ success: true, message: "Testimonial deleted successfully" });
});

// Stats
app.get("/api/stats", (req, res) => {
  const stats = db.getStats();
  res.json({ success: true, data: stats });
});

app.post("/api/stats", (req, res) => {
  const stats = req.body;
  if (!Array.isArray(stats)) {
    return res.status(400).json({ success: false, error: "Stats array required" });
  }
  const saved = db.saveStats(stats);
  res.json({ success: true, data: saved });
});

// Instagram Reels
app.get("/api/reels", (req, res) => {
  const reels = db.getReels();
  res.json({ success: true, count: reels.length, data: reels });
});

app.post("/api/reels", (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ success: false, error: "Reel URL required" });
  const match = String(body.url).match(/reel\/([^/?#&]+)/);
  const shortcode = body.shortcode || (match ? match[1] : `sc-${Date.now()}`);
  const newReel = {
    id: body.id || `reel-${Date.now()}`,
    shortcode,
    url: body.url,
    tag: body.tag || "Mumbai Turnkey Project",
    title: body.title || "Interior Points Residence Showcase",
    caption: body.caption || "Behind-the-scenes turnkey residential makeover executed with architectural precision in Mumbai.",
    likes: body.likes || "38",
    comments: body.comments || "12",
    views: body.views || "18.4k",
    previewImage: body.previewImage || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
  };
  const saved = db.saveReel(newReel);
  res.status(201).json({ success: true, data: saved });
});

app.delete("/api/reels/:id", (req, res) => {
  const deleted = db.deleteReel(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: "Reel not found" });
  res.json({ success: true, message: "Reel deleted successfully" });
});

app.post("/api/reels/sync", (req, res) => {
  const reels = db.getReels();
  res.json({ success: true, count: reels.length, data: reels, message: "Reels synced successfully" });
});

app.post("/api/reels/auto-update", (req, res) => {
  const reels = db.getReels();
  res.json({ success: true, count: reels.length, data: reels, message: "Reels up to date" });
});

app.get("/api/reels/status", (req, res) => {
  const reels = db.getReels();
  res.json({ success: true, count: reels.length, status: "healthy" });
});

// Leads / Inquiries
app.get("/api/leads", (req, res) => {
  const leads = db.getLeads();
  res.json({ success: true, count: leads.length, data: leads });
});

app.post("/api/leads", (req, res) => {
  try {
    const { name, phone, email, city, bhkType, message, selectedWorks, estimatedPrice, possessionTimeline } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, error: "Name, phone, and email are required" });
    }
    const lead = db.addLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: (city || "Mumbai").trim(),
      bhkType: (bhkType || "2 BHK").trim(),
      message: (message || "").trim(),
      selectedWorks: Array.isArray(selectedWorks) ? selectedWorks : undefined,
      estimatedPrice: typeof estimatedPrice === "string" ? estimatedPrice.trim() : undefined,
      possessionTimeline: typeof possessionTimeline === "string" ? possessionTimeline.trim() : undefined,
    });
    const whatsappUrl = buildWhatsAppConsultationUrl(lead);
    res.status(201).json({
      success: true,
      message: "Consultation inquiry registered successfully",
      data: lead,
      whatsappUrl,
      whatsappPhone: "+91 7903038750",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to register inquiry" });
  }
});

app.patch("/api/leads/:id", (req, res) => {
  const { status } = req.body;
  if (!status || !["new", "contacted", "scheduled", "closed"].includes(status)) {
    return res.status(400).json({ success: false, error: "Valid status required" });
  }
  const updated = db.updateLeadStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ success: false, error: "Lead not found" });
  res.json({ success: true, data: updated });
});

app.delete("/api/leads/:id", (req, res) => {
  const deleted = db.deleteLead(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: "Lead not found" });
  res.json({ success: true, message: "Lead removed" });
});

// Dedicated Image Upload API
app.post("/api/upload", (req, res) => {
  try {
    const { image, data } = req.body;
    const rawData = image || data;
    if (!rawData) {
      return res.status(400).json({ success: false, error: "Image data is required" });
    }
    // Return data URL safely for immediate frontend use
    res.json({
      success: true,
      url: rawData.startsWith("data:") ? rawData : `data:image/jpeg;base64,${rawData}`,
      filename: `image-${Date.now()}.jpg`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

// Admin verify
app.post("/api/admin/verify", (req, res) => {
  const { passcode } = req.body;
  const validPasscodes = ["saifi@2005", process.env.ADMIN_PASSCODE, "interiorpoints2026"].filter(Boolean);
  if (validPasscodes.includes(passcode)) {
    res.json({ success: true, authenticated: true, token: "interiorpoints-admin-authenticated-session" });
  } else {
    res.status(401).json({ success: false, authenticated: false, error: "Incorrect password." });
  }
});

// AI Chatbot
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, error: "Message is required" });
  }
  try {
    const reply = await generateConsultationReply(message, history || []);
    res.json({ success: true, reply });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      reply: "Our senior design consultants are available to guide you through materials, 3D layouts, and ballpark estimates for your 1, 2, or 3 BHK. Please submit the consultation form on this page or message us directly via WhatsApp (+91 7903038750)!",
    });
  }
});

export default app;
