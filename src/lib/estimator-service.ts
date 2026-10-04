import { EstimatorSpace, FloorPlanType } from "../types";

const ESTIMATOR_CACHE_KEY = "interior_points_estimator_spaces_v1";

export async function fetchEstimatorSpaces(includeDisabled = false): Promise<EstimatorSpace[]> {
  try {
    const url = `/api/estimator-spaces${includeDisabled ? "?includeDisabled=true" : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      try {
        sessionStorage.setItem(ESTIMATOR_CACHE_KEY, JSON.stringify(data.data));
      } catch {}
      return data.data;
    }
  } catch (err) {
    console.warn("Could not fetch estimator spaces from server, using local fallback:", err);
  }

  // Fallback to cache if available
  try {
    const cached = sessionStorage.getItem(ESTIMATOR_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return includeDisabled ? parsed : parsed.filter((s: EstimatorSpace) => s.enabled !== false);
      }
    }
  } catch {}

  return [];
}

export async function saveEstimatorSpace(space: EstimatorSpace): Promise<EstimatorSpace> {
  const isNew = !space.id || space.id.startsWith("new-") || space.id === "";
  const url = isNew ? "/api/estimator-spaces" : `/api/estimator-spaces/${encodeURIComponent(space.id)}`;
  const method = isNew ? "POST" : "PUT";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(space),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to save space (HTTP ${res.status})`);
  }

  const result = await res.json();
  try {
    sessionStorage.removeItem(ESTIMATOR_CACHE_KEY);
    window.dispatchEvent(new CustomEvent("estimator-spaces-updated", { detail: result.data }));
  } catch {}
  return result.data;
}

export async function deleteEstimatorSpace(id: string): Promise<boolean> {
  const res = await fetch(`/api/estimator-spaces/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to delete space (HTTP ${res.status})`);
  }

  try {
    sessionStorage.removeItem(ESTIMATOR_CACHE_KEY);
    window.dispatchEvent(new CustomEvent("estimator-spaces-updated", { detail: { deletedId: id } }));
  } catch {}
  return true;
}

export async function resetEstimatorSpaces(): Promise<EstimatorSpace[]> {
  const res = await fetch("/api/estimator-spaces/reset", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Failed to reset spaces (HTTP ${res.status})`);
  }

  const result = await res.json();
  try {
    sessionStorage.removeItem(ESTIMATOR_CACHE_KEY);
    window.dispatchEvent(new CustomEvent("estimator-spaces-updated", { detail: result.data }));
  } catch {}
  return result.data;
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
