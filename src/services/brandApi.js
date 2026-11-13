// src/services/brandApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

// In-memory cache to prevent refetching on every render
let cachedBrand = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds

export const defaultBrandConfig = {
  siteName: "House of Kaira",
  tagline: "Circular Luxury Fashion",
  brandQuote: "Every outfit has a story. We make sure it's never the last chapter.",
  assets: {
    logoMark: {
      file: "hok-logo.png",
      dataUrl: "",
      dimensions: "512×512",
      sizeKb: 24,
      addedBy: "Soumya",
      addedWhen: "12 days ago",
    },
    wordmark: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    inverseMark: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    browserTabIcon: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    phoneHomeScreenIcon: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
    linkPreviewImage: { file: "", dataUrl: "", dimensions: "", sizeKb: 0 },
  },
};

/**
 * Resolves an asset slot to a usable image URL.
 */
export function resolveAssetUrl(slot, fallback = "") {
  if (!slot) return fallback;
  if (slot.dataUrl && typeof slot.dataUrl === "string" && slot.dataUrl.trim().length > 0) {
    return slot.dataUrl;
  }
  if (slot.file && typeof slot.file === "string") {
    const file = slot.file.trim();
    if (file.startsWith("http://") || file.startsWith("https://") || file.startsWith("data:") || file.startsWith("/")) {
      return file;
    }
    if (file.length > 0 && !file.includes("hok-logo.png")) {
      return `/uploads/${file}`;
    }
  }
  return fallback;
}

/**
 * Synchronizes browser tab favicon, title, and apple touch icon from brand settings.
 */
export function applyBrandToDocument(brand) {
  if (typeof document === "undefined" || !brand) return;

  // 1. Favicon (browserTabIcon)
  const tabIconUrl = resolveAssetUrl(brand.assets?.browserTabIcon);
  if (tabIconUrl) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.head.appendChild(link);
    }
    link.href = tabIconUrl;
  }

  // 2. Apple Touch Icon (phoneHomeScreenIcon)
  const phoneIconUrl = resolveAssetUrl(brand.assets?.phoneHomeScreenIcon);
  if (phoneIconUrl) {
    let appleLink = document.querySelector("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement("link");
      appleLink.rel = "apple-touch-icon";
      document.head.appendChild(appleLink);
    }
    appleLink.href = phoneIconUrl;
  }
}

/**
 * Fetches the active brand configuration from the public API.
 */
export async function getBrandSettings(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedBrand && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedBrand;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings/brand/public`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        cachedBrand = {
          siteName: json.data.siteName || defaultBrandConfig.siteName,
          tagline: json.data.tagline || defaultBrandConfig.tagline,
          brandQuote: json.data.brandQuote || defaultBrandConfig.brandQuote,
          assets: {
            logoMark: json.data.assets?.logoMark || defaultBrandConfig.assets.logoMark,
            wordmark: json.data.assets?.wordmark || defaultBrandConfig.assets.wordmark,
            inverseMark: json.data.assets?.inverseMark || defaultBrandConfig.assets.inverseMark,
            browserTabIcon: json.data.assets?.browserTabIcon || defaultBrandConfig.assets.browserTabIcon,
            phoneHomeScreenIcon: json.data.assets?.phoneHomeScreenIcon || defaultBrandConfig.assets.phoneHomeScreenIcon,
            linkPreviewImage: json.data.assets?.linkPreviewImage || defaultBrandConfig.assets.linkPreviewImage,
          },
        };
        lastFetchTime = now;
        applyBrandToDocument(cachedBrand);
        return cachedBrand;
      }
    }
  } catch (err) {
    console.warn("Could not fetch public brand settings, using fallback:", err);
  }

  return defaultBrandConfig;
}
