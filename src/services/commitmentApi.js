// src/services/commitmentApi.js
import commitmentData from "../data/home/commitmentData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5003/api" : "/api");

/**
 * Resolves CMS commitment settings and cards into the storefront format.
 */
export function resolveCommitmentFromCms(cmsData) {
  if (!cmsData) {
    return {
      isVisible: true,
      eyebrow: commitmentData.eyebrow,
      heading: `${commitmentData.title.normal} *${commitmentData.title.accent}*`,
      body: commitmentData.description,
      bodyMob: commitmentData.description,
      pills: commitmentData.servicePills.map((pill, idx) => ({
        id: `pill-${idx + 1}`,
        l: pill,
        u: "",
        on: true,
      })),
      cards: commitmentData.valueCards.map((c) => ({
        id: c.id,
        ico: c.icon,
        mob: true,
        h: c.headline,
        d: c.body,
      })),
    };
  }

  const eyebrow = cmsData.eyebrow || commitmentData.eyebrow;
  const heading = cmsData.heading || `${commitmentData.title.normal} *${commitmentData.title.accent}*`;
  const body = cmsData.body || commitmentData.description;
  const bodyMob = cmsData.bodyMob || body;

  const rawPills = Array.isArray(cmsData.pills) && cmsData.pills.length > 0
    ? cmsData.pills
    : commitmentData.servicePills.map((pill, idx) => ({
        id: `pill-${idx + 1}`,
        l: pill,
        u: "",
        on: true,
      }));

  const pills = rawPills
    .filter((p) => p && p.on !== false)
    .map((p, idx) => ({
      id: p.id || `pill-${idx + 1}`,
      l: p.l || p.label || (typeof p === "string" ? p : `Service ${idx + 1}`),
      u: p.u || p.url || p.link || "",
      on: p.on !== false,
    }));

  const rawCards = Array.isArray(cmsData.cards) && cmsData.cards.length > 0
    ? cmsData.cards
    : commitmentData.valueCards.map((c) => ({
        id: c.id,
        ico: c.icon,
        mob: true,
        h: c.headline,
        d: c.body,
      }));

  const cards = rawCards.map((c, idx) => ({
    id: c.id || `card-${idx + 1}`,
    ico: c.ico || c.icon || "recycle",
    mob: c.mob !== false,
    h: c.h || c.headline || "",
    d: c.d || c.body || "",
  }));

  return {
    isVisible: cmsData.isVisible !== false,
    eyebrow,
    heading,
    body,
    bodyMob,
    pills,
    cards,
  };
}

/**
 * Fetches the Our Commitment section settings from the backend.
 */
export async function getCommitmentSection() {
  try {
    const response = await fetch(`${API_BASE_URL}/homepage/commitment`);
    if (!response.ok) {
      throw new Error(`Failed to fetch commitment section: ${response.status}`);
    }
    const result = await response.json();
    const cmsPayload = result.data || result;
    return resolveCommitmentFromCms(cmsPayload);
  } catch (err) {
    console.warn("Could not fetch commitment from CMS, using default state:", err);
    return resolveCommitmentFromCms(null);
  }
}
