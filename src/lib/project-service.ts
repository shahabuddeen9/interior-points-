import { Project } from "../types";
import { initialProjects } from "../../server/seedData";

const STORAGE_KEY = "interior_points_projects_store_v1";
const SYNC_EVENT = "interior_points_projects_updated";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `residence-${Date.now()}`;
}

/**
 * Reads projects from localStorage with a fallback to initial seed projects.
 */
export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") {
    return initialProjects;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read projects from localStorage:", err);
  }

  // Initialize storage with seed projects if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
  } catch (e) {
    // Ignore storage quota or disabled storage
  }
  return initialProjects;
}

/**
 * Saves projects to localStorage and dispatches a broadcast event so all open views update instantly.
 */
export function persistProjectsLocally(projects: Project[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: projects }));
  } catch (err) {
    console.warn("Failed to write projects to localStorage:", err);
  }
}

/**
 * Fetches latest projects from the server API, reconciles with local storage, and notifies subscribers.
 */
export async function fetchProjects(): Promise<Project[]> {
  const localProjects = getStoredProjects();

  try {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Merge server data with any locally saved projects
          const serverProjects: Project[] = data.data;
          
          // Check if server is missing any locally created/edited projects
          const merged = [...serverProjects];
          for (const local of localProjects) {
            const exists = merged.some((p) => p.id === local.id || p.slug === local.slug);
            if (!exists) {
              merged.push(local);
            }
          }

          persistProjectsLocally(merged);
          return merged;
        }
      }
    }
  } catch (err) {
    console.warn("Server API not reachable or in static mode. Using local cache:", err);
  }

  return localProjects;
}

/**
 * Find a project by either its slug or ID.
 */
export function getProjectBySlugOrId(identifier: string): Project | undefined {
  if (!identifier) return undefined;
  const decoded = decodeURIComponent(identifier).trim().toLowerCase();
  const projects = getStoredProjects();

  return projects.find(
    (p) =>
      p.slug?.toLowerCase() === decoded ||
      p.id?.toLowerCase() === decoded ||
      p.slug?.toLowerCase() === identifier.toLowerCase() ||
      p.id?.toLowerCase() === identifier.toLowerCase()
  );
}

/**
 * Saves a project (new or edited) both to local persistence (for immediate UI reflection on all pages)
 * and attempts a synchronization with the server API.
 */
export async function saveProject(
  payload: Partial<Project>,
  isEditing: boolean,
  existingId?: string
): Promise<Project> {
  const currentProjects = getStoredProjects();
  let updatedProject: Project;

  if (isEditing && existingId) {
    // Find index of existing project
    const targetId = existingId.trim();
    const idx = currentProjects.findIndex(
      (p) =>
        p.id === targetId ||
        p.slug === targetId ||
        p.id?.toLowerCase() === targetId.toLowerCase() ||
        p.slug?.toLowerCase() === targetId.toLowerCase()
    );

    if (idx >= 0) {
      const existing = currentProjects[idx];
      updatedProject = {
        ...existing,
        ...payload,
        id: existing.id,
        slug: payload.slug || existing.slug || generateSlug(payload.title || existing.title),
      };
      currentProjects[idx] = updatedProject;
    } else {
      // Not found, treat as new or append
      const newId = existingId || `proj-${Date.now()}`;
      updatedProject = {
        id: newId,
        slug: payload.slug || generateSlug(payload.title || "residence"),
        title: payload.title || "Custom Residence",
        bhkType: payload.bhkType || "2 BHK",
        roomTypes: payload.roomTypes || ["Full Home"],
        location: payload.location || "Mumbai",
        city: payload.city || "Mumbai",
        coverImage: payload.coverImage || "",
        images: payload.images || [],
        scope: payload.scope || [],
        timeline: payload.timeline || "45-60 Days",
        budgetRange: payload.budgetRange || "₹10L - ₹15L",
        description: payload.description || "",
        featured: payload.featured ?? false,
        clientTestimonial: payload.clientTestimonial,
        ...payload,
      };
      currentProjects.unshift(updatedProject);
    }
  } else {
    // New project
    const newId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newSlug = payload.slug || generateSlug(payload.title || "new-residence");
    updatedProject = {
      id: newId,
      slug: newSlug,
      title: payload.title || "New Residence",
      bhkType: payload.bhkType || "2 BHK",
      roomTypes: payload.roomTypes || ["Full Home"],
      location: payload.location || "Mumbai",
      city: payload.city || "Mumbai",
      coverImage: payload.coverImage || "",
      images: payload.images || [],
      scope: payload.scope || [],
      timeline: payload.timeline || "50-60 Days",
      budgetRange: payload.budgetRange || "₹12L - ₹18L",
      description: payload.description || "",
      featured: payload.featured ?? false,
      clientTestimonial: payload.clientTestimonial,
      ...payload,
    };
    currentProjects.unshift(updatedProject);
  }

  // 1. Immediately persist locally and broadcast event to all views (Home, /projects, /projects/:slug, Admin)
  persistProjectsLocally(currentProjects);

  // 2. Synchronize to server API in background
  try {
    const endpoint = isEditing && existingId ? `/api/projects/${encodeURIComponent(existingId)}` : "/api/projects";
    const method = isEditing && existingId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.data) {
          // If server assigned a canonical record, reconcile
          const serverProj: Project = data.data;
          const reconciled = currentProjects.map((p) =>
            p.id === updatedProject.id || p.slug === updatedProject.slug ? serverProj : p
          );
          persistProjectsLocally(reconciled);
          return serverProj;
        }
      }
    } else {
      console.warn(`Server responded with ${res.status} on project save. Local persistence active.`);
    }
  } catch (serverErr) {
    console.warn("Server API unreachable during project save. Preserved in local storage:", serverErr);
  }

  return updatedProject;
}

/**
 * Deletes a project by ID or slug locally and attempts server deletion.
 */
export async function deleteProject(identifier: string): Promise<boolean> {
  const currentProjects = getStoredProjects();
  const clean = decodeURIComponent(identifier).trim().toLowerCase();

  const filtered = currentProjects.filter(
    (p) =>
      p.id?.toLowerCase() !== clean &&
      p.slug?.toLowerCase() !== clean &&
      p.id !== identifier &&
      p.slug !== identifier
  );

  // Immediately persist locally and update UI
  persistProjectsLocally(filtered);

  // Attempt server deletion
  try {
    await fetch(`/api/projects/${encodeURIComponent(identifier)}`, { method: "DELETE" });
  } catch (err) {
    console.warn("Could not delete from server API; removed from local cache:", err);
  }

  return true;
}

/**
 * Subscribes a React component to project changes across windows, tabs, and intra-app updates.
 */
export function subscribeToProjects(callback: (projects: Project[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent<Project[]>;
    if (custom.detail && Array.isArray(custom.detail)) {
      callback(custom.detail);
    } else {
      callback(getStoredProjects());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          callback(parsed);
        }
      } catch {
        callback(getStoredProjects());
      }
    }
  };

  window.addEventListener(SYNC_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(SYNC_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
