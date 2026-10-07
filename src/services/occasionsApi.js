// src/services/occasionsApi.js
import defaultOccasionsData, { defaultOccasionsList } from "../data/home/occasionsData";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5003/api" : "/api");

const MASTER_OCCASIONS_MAP = defaultOccasionsList.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

/**
 * Resolves CMS occasion settings and tile overrides into storefront occasion items.
 */
export function resolveOccasionsFromCms(cmsData) {
  if (!cmsData) {
    return defaultOccasionsData;
  }

  const ctaLbl = cmsData.ctaLbl || defaultOccasionsData.ctaLbl;
  const showCount = cmsData.showCount !== undefined ? cmsData.showCount : defaultOccasionsData.showCount;
  const layout = cmsData.layout || defaultOccasionsData.layout;
  const eyebrow = cmsData.eyebrow || defaultOccasionsData.eyebrow;
  const heading = cmsData.heading || defaultOccasionsData.title;
  const viewAll = {
    lbl: cmsData.viewAll?.lbl || defaultOccasionsData.viewAll.lbl,
    url: cmsData.viewAll?.url || defaultOccasionsData.viewAll.url,
  };

  const tiles = cmsData.tiles || {};
  const items = defaultOccasionsList.map((defaultItem) => {
    const tileOverride = tiles[defaultItem.id];
    if (!tileOverride) {
      return defaultItem;
    }
    return {
      ...defaultItem,
      name: tileOverride.lbl?.trim() || defaultItem.name,
      eyebrow: tileOverride.kickMob?.trim() || defaultItem.eyebrow,
      image: tileOverride.img?.trim() || defaultItem.image,
      alt: tileOverride.alt?.trim() || defaultItem.name,
    };
  });

  return {
    isVisible: cmsData.isVisible !== false,
    eyebrow,
    heading,
    viewAll,
    layout,
    ctaLbl,
    showCount,
    items,
  };
}

/**
 * Fetches the Shop by Occasion section settings from the backend.
 */
export async function getOccasionsSection() {
  try {
    const response = await fetch(`${API_BASE_URL}/homepage/occasions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch occasions section: ${response.status}`);
    }
    const result = await response.json();
    const cmsPayload = result.data || result;
    return resolveOccasionsFromCms(cmsPayload);
  } catch (err) {
    console.warn("Could not fetch occasions from CMS, using default state:", err);
    return {
      ...defaultOccasionsData,
      isVisible: false, // Default is false per spec until enabled
    };
  }
}
