import defaultTestimonialsData from "../data/home/testimonialsData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5003/api" : "/api");

function getInitials(name, custom) {
  if (custom && custom.trim()) return custom.trim();
  if (!name || !name.trim()) return "PR";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Resolves CMS cards into storefront testimonial items.
 * Only cards with `on !== false` are displayed.
 */
export function resolveTestimonialsFromCms(cmsData) {
  const cards = Array.isArray(cmsData?.cards) ? cmsData.cards : [];
  if (cards.length === 0) {
    return defaultTestimonialsData.testimonials;
  }

  const activeCards = cards.filter((c) => c.on !== false);
  if (activeCards.length === 0) {
    return defaultTestimonialsData.testimonials;
  }

  return activeCards.map((c, index) => {
    const name = c.name || "Verified Customer";
    const initials = getInitials(name, c.ini);
    const city = c.city || "";
    const ctx = c.ctx || "";
    const meta = city && ctx ? `${city} · ${ctx}` : city || ctx || "Verified Customer";
    const review = c.q || c.review || "";
    const stars = typeof c.stars === "number" ? c.stars : 5;

    return {
      id: c.id || index + 1,
      name,
      initials,
      city,
      ctx,
      meta,
      review,
      stars,
      src: c.src,
      ref: c.ref,
    };
  });
}

/**
 * Fetches Testimonials section data from the CMS endpoint.
 */
export async function getTestimonialsSection() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/testimonials`);
    if (!res.ok) {
      throw new Error(`Failed to fetch testimonials: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      const data = json.data;
      const testimonials = resolveTestimonialsFromCms(data);
      return {
        isVisible: data.isVisible !== false,
        eyebrow: data.eyebrow || defaultTestimonialsData.eyebrow,
        heading: data.heading || "What our customers *say*",
        layout: data.layout || "Three across",
        layoutMob: data.layoutMob || "Swipe",
        testimonials,
        settings: data.settings || data,
      };
    }
  } catch (err) {
    console.warn("Using default testimonials data as fallback:", err.message);
  }

  return {
    isVisible: true,
    eyebrow: defaultTestimonialsData.eyebrow,
    heading: "What our customers *say*",
    layout: "Three across",
    layoutMob: "Swipe",
    testimonials: defaultTestimonialsData.testimonials,
  };
}
