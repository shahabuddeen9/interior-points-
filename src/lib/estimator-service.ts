import { EstimatorSpace, FloorPlanType } from "../types";
import { initialEstimatorSpaces } from "../../server/seedData";

const ESTIMATOR_CACHE_KEY = "interior_points_estimator_spaces_v3";

/**
 * Ensures that all 10 turnkey spaces are ALWAYS present and properly formatted.
 * If user added custom spaces (e.g. Balcony, Home Office), preserves them while
 * ensuring the core 10 turnkey spaces can NEVER drop to 0.
 */
export function ensureAll10Spaces(spaces: EstimatorSpace[]): EstimatorSpace[] {
  const current = Array.isArray(spaces)
    ? spaces.map((s) => (s.id === "space-1791096152751" ? { ...s, id: "molding" } : { ...s }))
    : [];

  // Guarantee that every single one of the 10 standard spaces exists
  initialEstimatorSpaces.forEach((base) => {
    const existingIdx = current.findIndex(
      (s) =>
        s.id === base.id ||
        (base.id === "molding" && (s.id === "space-1791096152751" || s.name.toLowerCase().includes("molding"))) ||
        s.name.toLowerCase().trim() === base.name.toLowerCase().trim()
    );
    if (existingIdx < 0) {
      current.push(JSON.parse(JSON.stringify(base)));
    } else {
      // If the space is present but missing specs or pricing, backfill from base
      if (!current[existingIdx].pricing || Object.keys(current[existingIdx].pricing).length === 0) {
        current[existingIdx].pricing = JSON.parse(JSON.stringify(base.pricing));
      }
      if (!current[existingIdx].specs || current[existingIdx].specs.length === 0) {
        current[existingIdx].specs = [...(base.specs || [])];
      }
      if (current[existingIdx].enabled === undefined) {
        current[existingIdx].enabled = true;
      }
    }
  });

  // If literally every space is disabled, enable them all so cost estimator works
  const anyEnabled = current.some((s) => s.enabled !== false);
  if (!anyEnabled) {
    current.forEach((s) => (s.enabled = true));
  }

  // Sort by order
  return current.sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Returns locally stored estimator spaces with 100% guarantee of falling back
 * to all 10 turnkey spaces from seedData. NEVER returns 0 spaces.
 */
export function getStoredEstimatorSpaces(includeDisabled = false): EstimatorSpace[] {
  if (typeof window === "undefined") {
    const safe = ensureAll10Spaces(initialEstimatorSpaces);
    return includeDisabled ? safe : safe.filter((s) => s.enabled !== false);
  }

  // Clean any legacy empty caches
  try {
    localStorage.removeItem("interior_points_estimator_spaces_v1");
    sessionStorage.removeItem("interior_points_estimator_spaces_v1");
    localStorage.removeItem("interior_points_estimator_spaces_v2");
    sessionStorage.removeItem("interior_points_estimator_spaces_v2");
  } catch {}

  let loaded: EstimatorSpace[] | null = null;

  try {
    const raw = localStorage.getItem(ESTIMATOR_CACHE_KEY) || sessionStorage.getItem(ESTIMATOR_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        loaded = ensureAll10Spaces(parsed);
      }
    }
  } catch (err) {
    console.warn("Could not read estimator spaces from storage:", err);
  }

  if (!loaded || loaded.length < 10) {
    loaded = ensureAll10Spaces(initialEstimatorSpaces);
  }

  // Persist guaranteed sanitized spaces to storage
  try {
    localStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(loaded));
    sessionStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(loaded));
  } catch {}

  const filtered = includeDisabled ? loaded : loaded.filter((s) => s.enabled !== false);
  return filtered.length > 0 ? filtered : loaded;
}

/**
 * Persists estimator spaces to browser storage and dispatches sync event.
 */
export function persistEstimatorSpacesLocally(spaces: EstimatorSpace[]): void {
  if (typeof window === "undefined") return;
  const safeSpaces = ensureAll10Spaces(spaces);
  try {
    localStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(safeSpaces));
    sessionStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(safeSpaces));
    localStorage.removeItem("interior_points_estimator_spaces_v1");
    localStorage.removeItem("interior_points_estimator_spaces_v2");
    sessionStorage.removeItem("interior_points_estimator_spaces_v1");
    sessionStorage.removeItem("interior_points_estimator_spaces_v2");
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent("estimator-spaces-updated", { detail: safeSpaces }));
  } catch {}
}

/**
 * Fetches latest estimator spaces from server API.
 * Always returns at least the 10 standard spaces, never returns 0.
 */
export async function fetchEstimatorSpaces(includeDisabled = false): Promise<EstimatorSpace[]> {
  const localSpaces = getStoredEstimatorSpaces(true);

  try {
    const url = `/api/estimator-spaces?includeDisabled=true`;
    const res = await fetch(url);
    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        const rawList = Array.isArray(json)
          ? json
          : json.data && Array.isArray(json.data)
          ? json.data
          : [];

        if (rawList.length >= 10) {
          const sanitized = ensureAll10Spaces(rawList);
          persistEstimatorSpacesLocally(sanitized);
          const filtered = includeDisabled
            ? sanitized
            : sanitized.filter((s: EstimatorSpace) => s.enabled !== false);
          return filtered.length > 0 ? filtered : sanitized;
        }

        // If the server returned < 10 spaces, auto-heal the server with all 10 spaces
        fetch("/api/estimator-spaces/reset", { method: "POST" })
          .then((r) => r.json())
          .then((resData) => {
            if (resData.success && Array.isArray(resData.data) && resData.data.length >= 10) {
              persistEstimatorSpacesLocally(resData.data);
            }
          })
          .catch(() => {});
      }
    }
  } catch (err) {
    console.warn("Could not fetch estimator spaces from server, using guaranteed local spaces:", err);
  }

  // Guaranteed fallback to all 10 configured spaces
  const fallback = ensureAll10Spaces(localSpaces);
  persistEstimatorSpacesLocally(fallback);
  const filtered = includeDisabled ? fallback : fallback.filter((s: EstimatorSpace) => s.enabled !== false);
  return filtered.length > 0 ? filtered : fallback;
}

export async function saveEstimatorSpace(space: EstimatorSpace): Promise<EstimatorSpace> {
  const cleanId = (space.id || "").trim() || `space-${Date.now()}`;
  const formattedSpace: EstimatorSpace = {
    ...space,
    id: cleanId,
    enabled: space.enabled !== false,
    specs: Array.isArray(space.specs) ? space.specs : [],
  };

  // Update locally first for instantaneous UI update
  const current = getStoredEstimatorSpaces(true);
  const idx = current.findIndex((s) => s.id === cleanId);
  let updatedList: EstimatorSpace[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = formattedSpace;
  } else {
    formattedSpace.order = formattedSpace.order || current.length + 1;
    updatedList = [...current, formattedSpace];
  }
  persistEstimatorSpacesLocally(updatedList);

  // Sync to backend API
  const isNew = !space.id || space.id.startsWith("new-") || space.id === "";
  const url = isNew ? "/api/estimator-spaces" : `/api/estimator-spaces/${encodeURIComponent(cleanId)}`;
  const method = isNew ? "POST" : "PUT";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedSpace),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.data) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Could not sync space to backend server, saved in local store:", err);
  }

  return formattedSpace;
}

export async function deleteEstimatorSpace(id: string): Promise<boolean> {
  const current = getStoredEstimatorSpaces(true);
  // Do not delete below 10 core spaces unless it's a custom space
  const filtered = current.filter((s) => s.id !== id);
  // Ensure we still keep all 10 standard spaces
  const safe = ensureAll10Spaces(filtered);
  persistEstimatorSpacesLocally(safe);

  try {
    await fetch(`/api/estimator-spaces/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Could not sync deletion to server:", err);
  }

  return true;
}

export async function resetEstimatorSpaces(): Promise<EstimatorSpace[]> {
  const freshSpaces = JSON.parse(JSON.stringify(initialEstimatorSpaces));
  persistEstimatorSpacesLocally(freshSpaces);

  try {
    const res = await fetch("/api/estimator-spaces/reset", {
      method: "POST",
    });
    if (res.ok) {
      const result = await res.json();
      if (result.data && Array.isArray(result.data) && result.data.length >= 10) {
        persistEstimatorSpacesLocally(result.data);
        return result.data;
      }
    }
  } catch (err) {
    console.warn("Could not reset on server, local 10 spaces restored:", err);
  }

  return freshSpaces;
}

export function formatPriceInLakhs(val: number): string {
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)}L`;
  }
  return `₹${(val / 1000).toFixed(0)}k`;
}

export function generatePriceLabel(min: number, max: number, suffix = ""): string {
  const minText = formatPriceInLakhs(min);
  const maxText = formatPriceInLakhs(max);
  return `${minText} – ${maxText}${suffix ? ` (${suffix})` : ""}`;
}
