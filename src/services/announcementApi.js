import { announcementItems as fallbackItems } from "../data/announcementData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent refetching on every route transition
let cachedConfig = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultAnnouncementConfig = {
  showAcrossSite: true,
  howItMoves: "Scrolling loop",
  loopTimeSeconds: 28,
  pauseOnHover: true,
  backgroundColor: "#1a1612",
  textColor: "rgba(212, 197, 176, 0.72)",
  italicLineColor: "#e8d5b0",
  separator: "Dot",
  messages: fallbackItems.map((item, idx) => ({
    id: `fallback-${idx + 1}`,
    text: item.text,
    italicSerif: item.type === "italic",
    showsOn: "All pages",
    link: "",
  })),
};

/**
 * Checks whether an announcement message matches the current page scope.
 */
export function isScopeMatch(scope, pathname = "/") {
  if (!scope || scope === "All pages" || scope === "ALL PAGES") return true;

  const cleanScope = scope.trim().toLowerCase();
  const path = (pathname || "").toLowerCase();

  switch (cleanScope) {
    case "rent":
      return (
        path.startsWith("/rent") ||
        path.startsWith("/onlyrental") ||
        path.startsWith("/rentaland") ||
        path === "/main-page"
      );
    case "preloved":
      return path.startsWith("/preloved");
    case "buy new":
    case "buynew":
      return path.startsWith("/buynew") || path.startsWith("/buy-new");
    case "list your piece":
      return path.startsWith("/list-your-piece");
    case "account":
      return (
        path.startsWith("/profile") ||
        path.startsWith("/wishlist") ||
        path.startsWith("/auth")
      );
    default:
      return true;
  }
}

/**
 * Fetches the active announcement configuration from the API.
 */
export async function getAnnouncementSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedConfig && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedConfig;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/announcement/public`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        cachedConfig = {
          showAcrossSite: json.data.showAcrossSite !== false,
          howItMoves: json.data.howItMoves || "Scrolling loop",
          loopTimeSeconds: Number(json.data.loopTimeSeconds) || 28,
          pauseOnHover: json.data.pauseOnHover !== false,
          backgroundColor: json.data.backgroundColor || "#1a1612",
          textColor: json.data.textColor || "rgba(212, 197, 176, 0.72)",
          italicLineColor: json.data.italicLineColor || "#e8d5b0",
          separator: json.data.separator || "Dot",
          messages: Array.isArray(json.data.messages)
            ? json.data.messages
            : defaultAnnouncementConfig.messages,
        };
        lastFetchTime = now;
        return cachedConfig;
      }
    }
  } catch (err) {
    console.warn("Could not load announcement settings from API, using fallback:", err.message);
  }

  return defaultAnnouncementConfig;
}
