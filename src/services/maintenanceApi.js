// src/services/maintenanceApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent redundant fetches
let cachedMaintenance = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultMaintenanceConfig = {
  maintenance: {
    enabled: false,
    heading: "We’ll be right back",
    expectedBack: "",
    body: "House of Kaira is briefly down for scheduled work. Rentals already booked are unaffected.",
    allowList: "Soumya, Priya (Ops)",
  },
  notFoundPage: {
    heading: "This piece has moved on",
    body: "The page you were looking for is no longer here — which happens on a platform where pieces find new homes.",
    suggestedLinks: "Rent, Buy Preloved, New Arrivals",
  },
};

/**
 * Checks whether the current visitor is authorized to bypass maintenance mode.
 * Rules:
 * 1. Admin paths (/hok_admin) and API routes (/api/) are NEVER blocked.
 * 2. Explicit bypass via session / query parameter (?bypass=true or ?hok_bypass=1).
 * 3. Logged-in admin user (SUPER_ADMIN, ADMIN).
 * 4. User identifier matching the configured allowList.
 */
export function isUserBypassingMaintenance(user, allowListString = "") {
  if (typeof window === "undefined") return false;

  // Check query parameter & persist to sessionStorage
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("bypass") === "true" || params.get("hok_bypass") === "1") {
      sessionStorage.setItem("hok_maintenance_bypass", "true");
      return true;
    }
    if (sessionStorage.getItem("hok_maintenance_bypass") === "true") {
      return true;
    }
  } catch (e) {
    // sessionStorage or URL error fallback
  }

  // Check admin token in storage
  try {
    const adminToken = localStorage.getItem("admin_token") || localStorage.getItem("hok_admin_token");
    if (adminToken) return true;
  } catch (e) {}

  // Check logged in user role
  if (user) {
    const role = (user.role || "").toUpperCase();
    if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "OPERATIONS") {
      return true;
    }

    // Check allowList entries
    if (allowListString) {
      const allowedEntries = allowListString
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      const userEmail = (user.email || "").toLowerCase();
      const userName = (user.name || "").toLowerCase();
      const userPhone = (user.phone || "").toLowerCase();

      const matched = allowedEntries.some((entry) => {
        return (
          (userEmail && userEmail.includes(entry)) ||
          (userName && userName.includes(entry)) ||
          (userPhone && userPhone.includes(entry))
        );
      });

      if (matched) return true;
    }
  }

  return false;
}

/**
 * Fetches the active maintenance and 404 configuration from the public API.
 */
export async function getMaintenanceSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedMaintenance && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedMaintenance;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/maintenance/public`);
    if (res.ok) {
      const json = await res.json();
      const raw = json && (json.data || json);

      const rawMaint = raw.maintenance || {};
      const raw404 = raw.notFoundPage || {};

      cachedMaintenance = {
        maintenance: {
          enabled:
            rawMaint.enabled !== undefined
              ? !!rawMaint.enabled
              : defaultMaintenanceConfig.maintenance.enabled,
          heading:
            rawMaint.heading || defaultMaintenanceConfig.maintenance.heading,
          expectedBack:
            rawMaint.expectedBack !== undefined
              ? rawMaint.expectedBack
              : defaultMaintenanceConfig.maintenance.expectedBack,
          body: rawMaint.body || defaultMaintenanceConfig.maintenance.body,
          allowList:
            rawMaint.allowList !== undefined
              ? rawMaint.allowList
              : defaultMaintenanceConfig.maintenance.allowList,
        },
        notFoundPage: {
          heading:
            raw404.heading || defaultMaintenanceConfig.notFoundPage.heading,
          body: raw404.body || defaultMaintenanceConfig.notFoundPage.body,
          suggestedLinks:
            raw404.suggestedLinks !== undefined
              ? raw404.suggestedLinks
              : defaultMaintenanceConfig.notFoundPage.suggestedLinks,
        },
      };

      lastFetchTime = now;
      return cachedMaintenance;
    }
  } catch (err) {
    console.warn("Could not fetch public Maintenance settings, using fallback:", err);
  }

  return defaultMaintenanceConfig;
}
