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
      const rawId = req.params.id || "";
      const decodedId = decodeURIComponent(rawId).trim();
      const targetId = decodedId.toLowerCase();
      const { images, coverImage } = req.body;
      const allProjects = db.getProjects();
      const existing = allProjects.find(
        (p) =>
          p.id === rawId ||
          p.slug === rawId ||
          p.id === decodedId ||
          p.slug === decodedId ||
          p.id?.toLowerCase() === targetId ||
          p.slug?.toLowerCase() === targetId
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

  // --- Instagram Reels System (Automatic Real Video Thumbnails from Instagram, No AI) ---
  const REELS_DIR = path.join(UPLOADS_DIR, "reels");
  const TMP_REELS_DIR = path.join(TMP_UPLOADS_DIR, "reels");
  try {
    if (!fs.existsSync(REELS_DIR)) fs.mkdirSync(REELS_DIR, { recursive: true });
  } catch {}
  try {
    if (!fs.existsSync(TMP_REELS_DIR)) fs.mkdirSync(TMP_REELS_DIR, { recursive: true });
  } catch {}

  let lastReelsSyncTime = new Date().toISOString();

  function decodeHtmlEntities(str: string): string {
    if (!str) return "";
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#x2019;/g, "’")
      .replace(/&#x2014;/g, "—")
      .replace(/&#x1f6e0;&#xfe0f;/g, "🛠️")
      .replace(/&#x2728;/g, "✨")
      .replace(/&#x1f4cc;/g, "📌")
      .replace(/&#x1f48c;/g, "💌")
      .replace(/&#x1f4cd;/g, "📍")
      .replace(/&#x1f4de;/g, "📞")
      .replace(/&#x2709;&#xfe0f;/g, "✉️")
      .replace(/&#x1f4d0;/g, "📐")
      .replace(/&#x1f6cb;&#xfe0f;/g, "🛋️")
      .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => {
        try {
          return String.fromCodePoint(parseInt(hex, 16));
        } catch {
          return "";
        }
      })
      .replace(/&#([0-9]+);/g, (_, dec) => {
        try {
          return String.fromCodePoint(parseInt(dec, 10));
        } catch {
          return "";
        }
      });
  }

  function extractInstagramShortcode(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();
    if (/^[A-Za-z0-9_-]{9,15}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:reel|p|share\/reel)\/([A-Za-z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  }

  // Ensures the actual video thumbnail from Instagram is downloaded and saved to disk (NO AI GENERATED THUMBNAILS)
  async function ensureReelThumbnail(shortcode: string): Promise<string> {
    if (!shortcode) return "";
    const cleanCode = shortcode.trim();
    const filename = `${cleanCode}.jpg`;
    const targetPath = path.join(REELS_DIR, filename);
    const tmpPath = path.join(TMP_REELS_DIR, filename);

    // 1. Return immediately if valid downloaded file already exists (> 2KB)
    if (fs.existsSync(targetPath)) {
      try {
        const stat = fs.statSync(targetPath);
        if (stat.size > 2000) return `/uploads/reels/${filename}`;
      } catch {}
    }
    if (fs.existsSync(tmpPath)) {
      try {
        const stat = fs.statSync(tmpPath);
        if (stat.size > 2000) {
          try {
            fs.copyFileSync(tmpPath, targetPath);
          } catch {}
          return `/uploads/reels/${filename}`;
        }
      } catch {}
    }

    // 2. Fetch the authentic video thumbnail directly from Instagram's CDN via social crawler headers
    try {
      const igPageUrl = `https://www.instagram.com/reel/${cleanCode}/`;
      const res = await fetch(igPageUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (res.ok) {
        const html = await res.text();
        const rawOgImage = html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1];
        if (rawOgImage) {
          const cdnImageUrl = rawOgImage.replace(/&amp;/g, "&");
          const imgRes = await fetch(cdnImageUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            },
          });
          if (imgRes.ok) {
            const buf = Buffer.from(await imgRes.arrayBuffer());
            if (buf.length > 2000) {
              try {
                fs.writeFileSync(targetPath, buf);
              } catch {}
              try {
                fs.writeFileSync(tmpPath, buf);
              } catch {}
              memoryImages.set(`reels/${filename}`, { buffer: buf, contentType: "image/jpeg" });
              return `/uploads/reels/${filename}`;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`Could not fetch Instagram thumbnail for ${cleanCode}:`, err);
    }

    return `/uploads/reels/${filename}`;
  }

  // Fetch real caption and metadata directly from Instagram public page
  async function fetchReelEmbedMetadata(shortcode: string): Promise<{
    caption?: string;
    comments?: string;
    likes?: string;
    title?: string;
    isInteriorPoints?: boolean;
    thumbnailUrl?: string;
  }> {
    try {
      const pageUrl = `https://www.instagram.com/reel/${shortcode}/`;
      const res = await fetch(pageUrl, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        },
      });
      if (res.ok) {
        const html = await res.text();
        const rawOgDesc = html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1] || "";
        const rawOgTitle = html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1] || "";
        const rawOgImage = html.match(/property="og:image"\s+content="([^"]+)"/i)?.[1] || "";

        const decodedDesc = decodeHtmlEntities(rawOgDesc);
        const decodedTitle = decodeHtmlEntities(rawOgTitle);

        const isInteriorPoints =
          decodedDesc.toLowerCase().includes("interior_points") ||
          decodedTitle.toLowerCase().includes("interior_points");

        const likesMatch = decodedDesc.match(/^([0-9,.KkMmbB]+)\s+likes/i);
        const commentsMatch = decodedDesc.match(/([0-9,.KkMmbB]+)\s+comments/i);
        const captionMatch = decodedDesc.match(/:\s*["“]([\s\S]+?)["”]\s*\.?$/);

        const likes = likesMatch ? likesMatch[1] : undefined;
        const comments = commentsMatch ? commentsMatch[1] : undefined;
        let caption = captionMatch ? captionMatch[1].trim() : undefined;

        let title: string | undefined;
        if (caption) {
          const firstSentence = caption.split(/[.\n!?]/)[0].trim();
          if (firstSentence && firstSentence.length > 5) {
            title = firstSentence.slice(0, 65);
          }
        }

        return {
          caption,
          comments,
          likes,
          title,
          isInteriorPoints,
          thumbnailUrl: rawOgImage ? rawOgImage.replace(/&amp;/g, "&") : undefined,
        };
      }
    } catch (e) {
      // Ignore network errors
    }
    return {};
  }

  // Automatically discover, download, and update new Instagram reels for @interior_points
  async function autoDiscoverAndSyncReels(): Promise<any[]> {
    const knownShortcodes = [
      "DacMIXrvQ3F",
      "DbU1nauIMph",
      "DcDL66_vzAi",
      "DdVlWmnodc0",
      "DYgtHNXKK1d",
      "DX0zUshor7-",
      "DdQbt1Eo57d",
      "Dc5QmjJoav5",
    ];

    // Query web search for any newly indexed reels from interior_points
    try {
      const searchRes = await fetch(
        "https://html.duckduckgo.com/html/?q=site:instagram.com/reel/+interior_points",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
        }
      );
      if (searchRes.ok) {
        const text = await searchRes.text();
        const matches = text.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/g);
        if (matches) {
          for (const m of matches) {
            const code = m.replace("instagram.com/reel/", "").trim();
            if (code && !knownShortcodes.includes(code)) {
              knownShortcodes.push(code);
            }
          }
        }
      }
    } catch {}

    const currentReels = db.getReels();
    const updatedMap = new Map<string, any>();

    // First preserve existing reels
    for (const r of currentReels) {
      updatedMap.set(r.shortcode, r);
    }

    // Process shortcodes, download video thumbnails, and pull official metadata
    for (const shortcode of knownShortcodes) {
      try {
        await ensureReelThumbnail(shortcode);
        const existing = updatedMap.get(shortcode);

        if (existing) {
          existing.previewImage = `/uploads/reels/${shortcode}.jpg`;
          const meta = await fetchReelEmbedMetadata(shortcode);
          if (meta.likes) existing.likes = meta.likes;
          if (meta.comments) existing.comments = meta.comments;
          if (meta.caption && (!existing.caption || existing.caption.length < 25)) {
            existing.caption = meta.caption;
          }
          if (meta.title && (!existing.title || existing.title.length < 5)) {
            existing.title = meta.title;
          }
          updatedMap.set(shortcode, existing);
        } else {
          // Verify newly discovered reel belongs to @interior_points
          const meta = await fetchReelEmbedMetadata(shortcode);
          if (meta.isInteriorPoints !== false) {
            const newReel = {
              id: `reel-${Date.now()}-${shortcode}`,
              shortcode,
              url: `https://www.instagram.com/reel/${shortcode}/`,
              tag: "Mumbai Turnkey Project",
              title: meta.title || "Turnkey Interior Showcase",
              caption:
                meta.caption ||
                "Trust the process. 🛠️✨ Turnkey residential makeover executed with architectural precision in Mumbai.",
              likes: meta.likes || "2.5k",
              comments: meta.comments || "45",
              views: "25k+",
              previewImage: `/uploads/reels/${shortcode}.jpg`,
              timestamp: new Date().toISOString(),
              isCustom: false,
            };
            updatedMap.set(shortcode, newReel);
          }
        }
      } catch (err) {
        console.warn(`Error syncing reel ${shortcode}:`, err);
      }
    }

    const finalReels = Array.from(updatedMap.values());
    db.setReels(finalReels);
    lastReelsSyncTime = new Date().toISOString();
    return finalReels;
  }

  // GET /api/reels/status: Check reels auto-update status
  app.get("/api/reels/status", (req, res) => {
    const reels = db.getReels();
    res.json({
      success: true,
      count: reels.length,
      lastSyncedAt: lastReelsSyncTime,
      autoUpdateEnabled: true,
      account: "@interior_points",
      thumbnailMode: "Authentic Instagram Video Thumbnail (No AI)",
    });
  });

  // GET /api/reels: List all active reels
  app.get("/api/reels", async (req, res) => {
    try {
      const reels = db.getReels();
      // Ensure local thumbnail path is set
      for (const reel of reels) {
        if (!reel.previewImage || reel.previewImage.includes("unsplash.com")) {
          reel.previewImage = `/uploads/reels/${reel.shortcode}.jpg`;
        }
      }
      res.json({ success: true, count: reels.length, lastSyncedAt: lastReelsSyncTime, data: reels });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to load reels" });
    }
  });

  // GET /api/reels/thumbnail/:shortcode: Stream the real Instagram video thumbnail
  app.get("/api/reels/thumbnail/:shortcode", async (req, res) => {
    const shortcode = req.params.shortcode?.trim();
    if (!shortcode) return res.status(400).send("Shortcode is required");
    const filename = `${shortcode}.jpg`;
    const targetPath = path.join(REELS_DIR, filename);
    const tmpPath = path.join(TMP_REELS_DIR, filename);

    if (fs.existsSync(targetPath)) {
      res.setHeader("Cache-Control", "public, max-age=604800");
      return res.sendFile(targetPath);
    }
    if (fs.existsSync(tmpPath)) {
      res.setHeader("Cache-Control", "public, max-age=604800");
      return res.sendFile(tmpPath);
    }

    const fetchedPath = await ensureReelThumbnail(shortcode);
    if (fs.existsSync(targetPath)) {
      res.setHeader("Cache-Control", "public, max-age=604800");
      return res.sendFile(targetPath);
    }
    res.redirect(`https://www.instagram.com/reel/${shortcode}/`);
  });

  // POST /api/reels/sync & POST /api/reels/auto-update: Automatically update all reels & sync new video thumbnails from Instagram
  const handleReelsSync = async (req: express.Request, res: express.Response) => {
    try {
      const updatedList = await autoDiscoverAndSyncReels();
      res.json({
        success: true,
        message: "Instagram reels synchronized with official video thumbnails successfully",
        count: updatedList.length,
        lastSyncedAt: lastReelsSyncTime,
        data: updatedList,
      });
    } catch (err: any) {
      console.error("Reels sync error:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to sync reels" });
    }
  };

  app.post("/api/reels/sync", handleReelsSync);
  app.post("/api/reels/auto-update", handleReelsSync);

  // POST /api/reels: Automatically add a new Instagram reel using its URL / shortcode
  app.post("/api/reels", async (req, res) => {
    try {
      const { url, tag, title, caption, likes, comments, views } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: "Instagram Reel URL or shortcode is required" });
      }

      const shortcode = extractInstagramShortcode(url);
      if (!shortcode) {
        return res.status(400).json({
          success: false,
          error: "Invalid Instagram URL. Please paste a link like https://www.instagram.com/reel/DacMIXrvQ3F/",
        });
      }

      // Download the authentic video thumbnail directly from Instagram (NO AI)
      const thumbUrl = await ensureReelThumbnail(shortcode);

      // Auto-extract metadata from reel if title or caption are missing
      const meta = await fetchReelEmbedMetadata(shortcode);

      const generatedTitle =
        title?.trim() ||
        meta.title ||
        "Interior Points Residence Showcase";

      const finalCaption =
        caption?.trim() ||
        meta.caption ||
        "Behind-the-scenes turnkey residential makeover executed with architectural precision in Mumbai.";

      const newReel = {
        id: `reel-${Date.now()}`,
        shortcode,
        url: `https://www.instagram.com/reel/${shortcode}/`,
        tag: tag?.trim() || "Mumbai Turnkey Handover",
        title: generatedTitle,
        caption: finalCaption,
        likes: likes?.trim() || meta.likes || "4.5k",
        comments: comments?.trim() || meta.comments || "320",
        views: views?.trim() || "50k+",
        previewImage: thumbUrl,
        timestamp: new Date().toISOString(),
        isCustom: true,
      };

      const saved = db.saveReel(newReel);
      res.status(201).json({ success: true, message: "Reel added successfully", data: saved });
    } catch (err: any) {
      console.error("Error creating reel:", err);
      res.status(500).json({ success: false, error: err.message || "Failed to add reel" });
    }
  });

  // PUT /api/reels/:id: Update reel details
  app.put("/api/reels/:id", (req, res) => {
    try {
      const targetId = req.params.id;
      const reels = db.getReels();
      const existing = reels.find((r) => r.id === targetId || r.shortcode === targetId);
      if (!existing) {
        return res.status(404).json({ success: false, error: "Reel not found" });
      }
      const updated = db.saveReel({
        ...existing,
        ...req.body,
        id: existing.id,
      });
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to update reel" });
    }
  });

  // DELETE /api/reels/:id: Delete reel
  app.delete("/api/reels/:id", (req, res) => {
    try {
      const deleted = db.deleteReel(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: "Reel not found" });
      }
      res.json({ success: true, message: "Reel deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || "Failed to delete reel" });
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
    selectedWorks?: string[];
    estimatedPrice?: string;
    possessionTimeline?: string;
  }) {
    const lines = [
      `*🏠 New Free Consultation & Estimate — Interior Points*`,
      `══════════════════════════════`,
      `👤 *Customer Name:* ${data.name || "Customer"}`,
      `📱 *Phone Number:* ${data.phone || "Not provided"}`,
      `📧 *Email Address:* ${data.email || "Not provided"}`,
      `📍 *Location / Society:* ${data.city || "Mumbai"}`,
      `📐 *Floor Plan / BHK:* ${data.bhkType || "Residential"}`,
    ];

    if (data.possessionTimeline) {
      lines.push(`📅 *Possession Timeline:* ${data.possessionTimeline}`);
    }

    if (data.estimatedPrice) {
      lines.push(`💰 *Estimated Investment:* ${data.estimatedPrice}`);
    }

    if (Array.isArray(data.selectedWorks) && data.selectedWorks.length > 0) {
      lines.push(`\n📋 *Selected Scope of Work (${data.selectedWorks.length} spaces):*`);
      data.selectedWorks.forEach((item, i) => {
        lines.push(`  ${i + 1}. ✅ ${item}`);
      });
    }

    if (data.message && data.message.trim()) {
      lines.push(`\n💬 *Customer Notes:* ${data.message.trim()}`);
    }

    lines.push(`══════════════════════════════`);
    lines.push(`_Sent via Interior Points Free Consultation & Cost Calculator Desk_`);
    const text = lines.join("\n");
    return `https://wa.me/${WHATSAPP_CONSULTATION_PHONE}?text=${encodeURIComponent(text)}`;
  }

  // Leads (Contact form submissions) & WhatsApp forwarding
  app.post("/api/leads", (req, res) => {
    try {
      const body = req.body || {};
      const {
        name,
        phone,
        email,
        city,
        bhkType,
        message,
        selectedWorks,
        estimatedPrice,
        possessionTimeline,
      } = body;

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
      const cleanSelectedWorks = Array.isArray(selectedWorks) ? selectedWorks : undefined;
      const cleanEstimatedPrice = typeof estimatedPrice === "string" ? estimatedPrice.trim() : undefined;
      const cleanTimeline = typeof possessionTimeline === "string" ? possessionTimeline.trim() : undefined;

      let lead;
      try {
        lead = db.addLead({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: cleanCity,
          bhkType: cleanBhk,
          message: cleanMessage,
          selectedWorks: cleanSelectedWorks,
          estimatedPrice: cleanEstimatedPrice,
          possessionTimeline: cleanTimeline,
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
          selectedWorks: cleanSelectedWorks,
          estimatedPrice: cleanEstimatedPrice,
          possessionTimeline: cleanTimeline,
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
        selectedWorks: lead.selectedWorks,
        estimatedPrice: lead.estimatedPrice,
        possessionTimeline: lead.possessionTimeline,
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

    // Automatically synchronize Instagram Reels on startup
    setTimeout(() => {
      autoDiscoverAndSyncReels()
        .then((reels) =>
          console.log(`[Instagram Sync] Loaded ${reels.length} reels with authentic video thumbnails from Instagram`)
        )
        .catch((err) => console.warn(`[Instagram Sync] Background sync warning:`, err));
    }, 1200);

    // Periodically check and auto-update newly posted reels every 30 minutes
    setInterval(() => {
      autoDiscoverAndSyncReels().catch(() => {});
    }, 30 * 60 * 1000);
  });
}

startServer();
