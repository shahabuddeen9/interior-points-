import { EstimatorSpace, FloorPlanType } from "../types";
import { initialEstimatorSpaces } from "../../server/seedData";

const ESTIMATOR_CACHE_KEY = "interior_points_estimator_spaces_v3";

/**
 * Returns locally stored estimator spaces with 100% guarantee of falling back
 * to all 10 turnkey spaces from seedData.
 */
export function getStoredEstimatorSpaces(includeDisabled = false): EstimatorSpace[] {
  if (typeof window === "undefined") {
    return includeDisabled
      ? [...initialEstimatorSpaces]
      : initialEstimatorSpaces.filter((s) => s.enabled !== false);
  }

  // Clear any legacy empty caches
  try {
    localStorage.removeItem("interior_points_estimator_spaces_v1");
    sessionStorage.removeItem("interior_points_estimator_spaces_v1");
  } catch {}

  try {
    const raw = localStorage.getItem(ESTIMATOR_CACHE_KEY) || sessionStorage.getItem(ESTIMATOR_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return includeDisabled
          ? parsed
          : parsed.filter((s: EstimatorSpace) => s.enabled !== false);
      }
    }
  } catch (err) {
    console.warn("Could not read estimator spaces from storage:", err);
  }

  // Pre-seed storage with all 10 turnkey spaces
  try {
    const copy = JSON.parse(JSON.stringify(initialEstimatorSpaces));
    localStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(copy));
    sessionStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(copy));
  } catch {}

  return includeDisabled
    ? [...initialEstimatorSpaces]
    : initialEstimatorSpaces.filter((s) => s.enabled !== false);
}

/**
 * Persists estimator spaces to browser storage and dispatches sync event.
 */
export function persistEstimatorSpacesLocally(spaces: EstimatorSpace[]): void {
  if (typeof window === "undefined") return;
  const safeSpaces = Array.isArray(spaces) && spaces.length > 0 ? spaces : [...initialEstimatorSpaces];
  try {
    localStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(safeSpaces));
    sessionStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(safeSpaces));
    // Clean up older caches
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
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          persistEstimatorSpacesLocally(data.data);
          return includeDisabled
            ? data.data
            : data.data.filter((s: EstimatorSpace) => s.enabled !== false);
        }

        // If the server returned an empty array (unseeded database), heal the server with all 10 spaces!
        if (data.success && Array.isArray(data.data) && data.data.length === 0) {
          console.warn("Server returned 0 estimator spaces. Auto-healing server with 10 default spaces...");
          fetch("/api/estimator-spaces/reset", { method: "POST" })
            .then((r) => r.json())
            .then((resData) => {
              if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
                persistEstimatorSpacesLocally(resData.data);
              }
            })
            .catch(() => {});
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch estimator spaces from server, using guaranteed local spaces:", err);
  }

  // Guaranteed fallback to all 10 configured spaces
  const fallback = localSpaces.length > 0 ? localSpaces : [...initialEstimatorSpaces];
  persistEstimatorSpacesLocally(fallback);
  return includeDisabled
    ? fallback
    : fallback.filter((s: EstimatorSpace) => s.enabled !== false);
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
  const filtered = current.filter((s) => s.id !== id);
  persistEstimatorSpacesLocally(filtered);

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
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
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
