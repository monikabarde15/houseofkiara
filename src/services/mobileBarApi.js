// src/services/mobileBarApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent refetching on every render
let cachedMobile = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultMobileConfig = {
  tabs: [
    { id: "mtab-1", label: "Home", path: "/", shown: true },
    { id: "mtab-2", label: "Browse", path: "/rent", shown: true },
    { id: "mtab-3", label: "Wishlist", path: "/wishlist", shown: true },
    { id: "mtab-4", label: "Bag", path: "/cart", shown: true, isBagTab: true },
    { id: "mtab-5", label: "Account", path: "/profile", shown: true },
  ],
  drawer: {
    showSearchField: true,
    showModeShortcuts: true,
    itemVisibility: {
      "nav-rent": true,
      "nav-preloved": true,
      "nav-buy-new": true,
      "nav-women": true,
      "nav-men": true,
      "nav-occasions": true,
      "nav-designers": true,
      "nav-shop-cat": true,
      "nav-how-it-works": true,
      "nav-about": true,
      "nav-new-arrivals": true,
      "nav-list-your-piece": true,
    },
  },
};

/**
 * Fetches the active mobile bar and drawer configuration from the public API.
 */
export async function getMobileSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedMobile && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedMobile;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/mobile/public`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        cachedMobile = {
          tabs: Array.isArray(json.data.tabs) && json.data.tabs.length > 0
            ? json.data.tabs
            : defaultMobileConfig.tabs,
          drawer: {
            showSearchField: json.data.drawer?.showSearchField !== false,
            showModeShortcuts: json.data.drawer?.showModeShortcuts !== false,
            itemVisibility: json.data.drawer?.itemVisibility || defaultMobileConfig.drawer.itemVisibility,
          },
        };
        lastFetchTime = now;
        return cachedMobile;
      }
    }
  } catch (err) {
    console.warn("Could not fetch public mobile settings, using fallback:", err);
  }

  return defaultMobileConfig;
}
