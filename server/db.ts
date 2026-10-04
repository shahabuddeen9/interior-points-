import fs from "fs";
import path from "path";
import { Project, Testimonial, CredibilityStat, LeadSubmission, InstagramReel } from "../src/types";
import { initialProjects, initialTestimonials, initialStats, initialLeads, initialReels } from "./seedData";

interface DatabaseSchema {
  projects: Project[];
  testimonials: Testimonial[];
  stats: CredibilityStat[];
  leads: LeadSubmission[];
  reels: InstagramReel[];
}

let memoryDb: DatabaseSchema | null = null;

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const TMP_DIR = path.join(process.platform === "win32" ? process.env.TEMP || "C:\\temp" : "/tmp", "interior-points-data");
const TMP_DB_FILE = path.join(TMP_DIR, "db.json");

function getInitialData(): DatabaseSchema {
  return {
    projects: [...initialProjects],
    testimonials: [...initialTestimonials],
    stats: [...initialStats],
    leads: [...initialLeads],
    reels: [...initialReels],
  };
}

function ensureDbExists(): DatabaseSchema {
  if (memoryDb) {
    if (!memoryDb.reels) memoryDb.reels = [...initialReels];
    return memoryDb;
  }

  // 1. Try reading from DATA_DIR/db.json
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      memoryDb = {
        projects: parsed.projects || [...initialProjects],
        testimonials: parsed.testimonials || [...initialTestimonials],
        stats: parsed.stats || [...initialStats],
        leads: parsed.leads || [...initialLeads],
        reels: parsed.reels || [...initialReels],
      };
      return memoryDb;
    }
  } catch (err) {
    console.warn("Could not read from data/db.json:", err);
  }

  // 2. Try reading from temporary directory (serverless fallback)
  try {
    if (fs.existsSync(TMP_DB_FILE)) {
      const raw = fs.readFileSync(TMP_DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      memoryDb = {
        projects: parsed.projects || [...initialProjects],
        testimonials: parsed.testimonials || [...initialTestimonials],
        stats: parsed.stats || [...initialStats],
        leads: parsed.leads || [...initialLeads],
        reels: parsed.reels || [...initialReels],
      };
      return memoryDb;
    }
  } catch (err) {
    // Ignore fallback read error
  }

  // 3. Initialize fresh memory copy
  memoryDb = getInitialData();
  writeDb(memoryDb);
  return memoryDb;
}

function writeDb(data: DatabaseSchema) {
  memoryDb = data;

  // 1. Try to write to project data directory
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return;
  } catch (err) {
    // Read-only filesystem in serverless / production container
  }

  // 2. Try writing to /tmp directory (writable in Vercel and Cloud Run)
  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
    fs.writeFileSync(TMP_DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return;
  } catch (err) {
    // Safe in-memory retention if all disk writes are restricted
    console.warn("Filesystem write restricted; database state preserved safely in server memory.");
  }
}

export const db = {
  getProjects: (): Project[] => {
    const data = ensureDbExists();
    return data.projects;
  },
  getProjectBySlug: (slug: string): Project | undefined => {
    const data = ensureDbExists();
    const clean = (slug || "").trim().toLowerCase();
    const decoded = decodeURIComponent(clean);
    return data.projects.find(
      (p) =>
        p.slug?.toLowerCase() === clean ||
        p.id?.toLowerCase() === clean ||
        p.slug?.toLowerCase() === decoded ||
        p.id?.toLowerCase() === decoded
    );
  },
  saveProject: (project: Project): Project => {
    const data = ensureDbExists();
    const projId = (project.id || "").trim();
    const projSlug = (project.slug || "").trim();

    const existingIndex = data.projects.findIndex(
      (p) =>
        (projId && (p.id === projId || p.id?.toLowerCase() === projId.toLowerCase())) ||
        (projSlug && (p.slug === projSlug || p.slug?.toLowerCase() === projSlug.toLowerCase()))
    );

    if (existingIndex >= 0) {
      data.projects[existingIndex] = {
        ...data.projects[existingIndex],
        ...project,
      };
      writeDb(data);
      return data.projects[existingIndex];
    } else {
      data.projects.unshift(project);
      writeDb(data);
      return project;
    }
  },
  deleteProject: (id: string): boolean => {
    const data = ensureDbExists();
    const initialLength = data.projects.length;
    const cleanId = (id || "").trim();
    const decoded = decodeURIComponent(cleanId);
    data.projects = data.projects.filter(
      (p) =>
        p.id !== cleanId &&
        p.slug !== cleanId &&
        p.id !== decoded &&
        p.slug !== decoded &&
        p.id?.toLowerCase() !== cleanId.toLowerCase() &&
        p.slug?.toLowerCase() !== cleanId.toLowerCase() &&
        p.id?.toLowerCase() !== decoded.toLowerCase() &&
        p.slug?.toLowerCase() !== decoded.toLowerCase()
    );
    if (data.projects.length !== initialLength) {
      writeDb(data);
      return true;
    }
    return false;
  },

  getTestimonials: (): Testimonial[] => {
    const data = ensureDbExists();
    return data.testimonials;
  },
  saveTestimonial: (test: Testimonial): Testimonial => {
    const data = ensureDbExists();
    const idx = data.testimonials.findIndex((t) => t.id === test.id);
    if (idx >= 0) {
      data.testimonials[idx] = test;
    } else {
      data.testimonials.unshift(test);
    }
    writeDb(data);
    return test;
  },
  deleteTestimonial: (id: string): boolean => {
    const data = ensureDbExists();
    const len = data.testimonials.length;
    data.testimonials = data.testimonials.filter((t) => t.id !== id);
    if (data.testimonials.length !== len) {
      writeDb(data);
      return true;
    }
    return false;
  },

  getStats: (): CredibilityStat[] => {
    const data = ensureDbExists();
    return data.stats;
  },
  saveStats: (stats: CredibilityStat[]): CredibilityStat[] => {
    const data = ensureDbExists();
    data.stats = stats;
    writeDb(data);
    return data.stats;
  },

  getLeads: (): LeadSubmission[] => {
    const data = ensureDbExists();
    return data.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  addLead: (lead: Omit<LeadSubmission, "id" | "createdAt" | "status">): LeadSubmission => {
    const data = ensureDbExists();
    const newLead: LeadSubmission = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    data.leads.unshift(newLead);
    writeDb(data);
    return newLead;
  },
  updateLeadStatus: (id: string, status: LeadSubmission["status"]): LeadSubmission | null => {
    const data = ensureDbExists();
    const lead = data.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      writeDb(data);
      return lead;
    }
    return null;
  },
  deleteLead: (id: string): boolean => {
    const data = ensureDbExists();
    const len = data.leads.length;
    data.leads = data.leads.filter((l) => l.id !== id);
    if (data.leads.length !== len) {
      writeDb(data);
      return true;
    }
    return false;
  },

  getReels: (): InstagramReel[] => {
    const data = ensureDbExists();
    return data.reels || [...initialReels];
  },
  saveReel: (reel: InstagramReel): InstagramReel => {
    const data = ensureDbExists();
    if (!data.reels) data.reels = [...initialReels];
    const idx = data.reels.findIndex(
      (r) => r.id === reel.id || r.shortcode === reel.shortcode
    );
    if (idx >= 0) {
      data.reels[idx] = { ...data.reels[idx], ...reel };
    } else {
      data.reels.unshift(reel);
    }
    writeDb(data);
    return idx >= 0 ? data.reels[idx] : reel;
  },
  setReels: (reels: InstagramReel[]): InstagramReel[] => {
    const data = ensureDbExists();
    data.reels = reels;
    writeDb(data);
    return data.reels;
  },
  deleteReel: (id: string): boolean => {
    const data = ensureDbExists();
    if (!data.reels) return false;
    const len = data.reels.length;
    data.reels = data.reels.filter((r) => r.id !== id && r.shortcode !== id);
    if (data.reels.length !== len) {
      writeDb(data);
      return true;
    }
    return false;
  },
};
