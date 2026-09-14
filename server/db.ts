import fs from "fs";
import path from "path";
import { Project, Testimonial, CredibilityStat, LeadSubmission } from "../src/types";
import { initialProjects, initialTestimonials, initialStats, initialLeads } from "./seedData";

interface DatabaseSchema {
  projects: Project[];
  testimonials: Testimonial[];
  stats: CredibilityStat[];
  leads: LeadSubmission[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      projects: initialProjects,
      testimonials: initialTestimonials,
      stats: initialStats,
      leads: initialLeads,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      projects: parsed.projects || initialProjects,
      testimonials: parsed.testimonials || initialTestimonials,
      stats: parsed.stats || initialStats,
      leads: parsed.leads || initialLeads,
    };
  } catch (err) {
    console.error("Error reading db.json, re-initializing:", err);
    const initialData: DatabaseSchema = {
      projects: initialProjects,
      testimonials: initialTestimonials,
      stats: initialStats,
      leads: initialLeads,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function writeDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  getProjects: (): Project[] => {
    const data = ensureDbExists();
    return data.projects;
  },
  getProjectBySlug: (slug: string): Project | undefined => {
    const data = ensureDbExists();
    return data.projects.find((p) => p.slug === slug || p.id === slug);
  },
  saveProject: (project: Project): Project => {
    const data = ensureDbExists();
    const existingIndex = data.projects.findIndex((p) => p.id === project.id || p.slug === project.slug);
    if (existingIndex >= 0) {
      data.projects[existingIndex] = project;
    } else {
      data.projects.unshift(project);
    }
    writeDb(data);
    return project;
  },
  deleteProject: (id: string): boolean => {
    const data = ensureDbExists();
    const initialLength = data.projects.length;
    data.projects = data.projects.filter((p) => p.id !== id && p.slug !== id);
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
};
