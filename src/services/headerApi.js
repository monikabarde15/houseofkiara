// src/services/headerApi.js
import { navigationItems as defaultNavigationItems } from "../data/navigationData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent refetching on every render
let cachedHeader = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultHeaderConfig = {
  searchPlaceholder: "Search lehengas, designers, occasions...",
  bagCartLabel: "Cart",
  stickyHeader: true,
  showTagline: true,
  reducedHeader: {
    backLink: "Back to cart",
    securityLine: "SSL encrypted · Secured by Razorpay",
    pagesUsingIt: "Checkout, Payment, Order confirmation",
  },
  navItems: defaultNavigationItems.map((item) => ({
    id: item.id,
    label: item.label,
    link: item.route || `/${item.id}`,
    badge: item.badge || "",
    style: item.variant === "accent" ? "Accent" : item.variant === "green" ? "Highlight" : "Plain",
    hasMenu: !!item.dropdown,
    menuEnabled: !!item.dropdown,
    shown: true,
  })),
};

/**
 * Maps a NavItem (from CMS or fallback) to the internal dropdown ID if it matches
 * one of the built-in dropdown flyouts.
 */
export function resolveDropdownId(item) {
  if (!item) return null;
  const id = (item.id || "").toLowerCase();
  const label = (item.label || "").toLowerCase();

  if (id.includes("rent") || label === "rent") return "rent";
  if (id.includes("preloved") || label.includes("preloved")) return "preloved";
  if (id.includes("buy-new") || id === "new" || label === "buy new") return "new";
  if (id.includes("women") || label === "women") return "women";
  if (id.includes("men") || label === "men") return "men";
  if (id.includes("occasion") || label.includes("occasion")) return "occasions";
  if (id.includes("designer") || label.includes("designer")) return "designers";

  return null;
}

/**
 * Resolves the CSS variant style for a navigation item.
 */
export function resolveItemStyle(item) {
  if (!item) return "";
  const style = item.style || "";
  if (style === "Accent" || item.variant === "accent") return "accent";
  if (style === "Highlight" || item.variant === "green") return "green";
  return "";
}

/**
 * Cleans /main-page?... dropdown URLs so clicking a specific sub-option
 * applies only that single clicked filter (no extra parent section/mode/gender).
 */
export function stripExtraParentParams(rawPath) {
  const path = String(rawPath || "").trim();
  if (!path.startsWith("/main-page?")) return path;
  const qIdx = path.indexOf("?");
  const params = new URLSearchParams(path.slice(qIdx + 1));

  const hasSpecific =
    Boolean(params.get("category")) ||
    Boolean(params.get("designer")) ||
    Boolean(params.get("occasion")) ||
    Boolean(params.get("condition")) ||
    Boolean(params.get("minPrice")) ||
    Boolean(params.get("maxPrice"));

  if (hasSpecific) {
    params.delete("section");
    params.delete("mode");
    params.delete("gender");
  } else {
    const sec = String(params.get("section") || "").toLowerCase();
    if (["rent", "preloved", "new"].includes(sec)) {
      params.delete("mode");
      params.delete("gender");
    }
  }

  const qs = params.toString();
  return qs ? `/main-page?${qs}` : "/main-page";
}

/**
 * Fetches the active header configuration from the public API.
 */
export async function getHeaderSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedHeader && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedHeader;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/header/public`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        cachedHeader = {
          searchPlaceholder:
            json.data.searchPlaceholder || defaultHeaderConfig.searchPlaceholder,
          bagCartLabel:
            json.data.bagCartLabel === "Bag" ? "Bag" : "Cart",
          stickyHeader:
            typeof json.data.stickyHeader === "boolean"
              ? json.data.stickyHeader
              : defaultHeaderConfig.stickyHeader,
          showTagline:
            typeof json.data.showTagline === "boolean"
              ? json.data.showTagline
              : defaultHeaderConfig.showTagline,
          reducedHeader: json.data.reducedHeader || defaultHeaderConfig.reducedHeader,
          navItems: Array.isArray(json.data.navItems) && json.data.navItems.length > 0
            ? json.data.navItems
            : defaultHeaderConfig.navItems,
        };
        lastFetchTime = now;
        return cachedHeader;
      }
    }
  } catch (err) {
    console.warn("Could not load header settings from API, using fallback:", err.message);
  }

  return defaultHeaderConfig;
}
