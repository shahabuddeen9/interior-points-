import express from "express";
import { db } from "../server/db";
import { generateConsultationReply } from "../server/gemini";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Estimator Spaces & Pricing Management
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

// Testimonials & Reviews
app.get("/api/testimonials", (req, res) => {
  const testimonials = db.getTestimonials();
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// Stats
app.get("/api/stats", (req, res) => {
  const stats = db.getStats();
  res.json({ success: true, data: stats });
});

// Instagram Reels
app.get("/api/reels", (req, res) => {
  const reels = db.getReels();
  res.json({ success: true, count: reels.length, data: reels });
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
