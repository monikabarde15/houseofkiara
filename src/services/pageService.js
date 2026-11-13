/**
 * House of Kaira – Dynamic Page Content Service
 * Connects public website pages to the admin PostgreSQL pages API
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5003/api"
    : "/api");

const pageCache = new Map();
const CACHE_TTL_MS = 2000; // 2 seconds TTL so reloads & quick navigation get fresh database content immediately

export async function fetchPageContent(slug, bypassCache = false) {
  try {
    const rawSlug = String(slug || "").trim();
    const now = Date.now();

    if (!bypassCache && pageCache.has(rawSlug)) {
      const cached = pageCache.get(rawSlug);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    const clean = rawSlug.startsWith("/") ? rawSlug : `/${rawSlug}`;
    // Fetch from backend API with cache busting query parameter
    const res = await fetch(`${API_BASE_URL}/pages/content?slug=${encodeURIComponent(clean)}&_t=${now}`, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache"
      },
    });

    if (!res.ok) {
      // Fallback: try raw slug without leading slash
      const altSlug = clean.replace(/^\//, "");
      const resAlt = await fetch(`${API_BASE_URL}/pages/content?slug=${encodeURIComponent(altSlug)}&_t=${now}`, {
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
      });
      if (!resAlt.ok) return null;
      const jsonAlt = await resAlt.json();
      if (jsonAlt?.success && jsonAlt?.data) {
        pageCache.set(rawSlug, { data: jsonAlt.data, timestamp: now });
        return jsonAlt.data;
      }
      return null;
    }

    const json = await res.json();
    if (json?.success && json?.data) {
      pageCache.set(rawSlug, { data: json.data, timestamp: now });
      return json.data;
    }
    return null;
  } catch (err) {
    console.warn(`[pageService] Error loading content for ${slug}:`, err);
    return null;
  }
}

export function clearPageCache(slug) {
  if (slug) {
    pageCache.delete(slug);
    pageCache.delete(slug.startsWith("/") ? slug.replace(/^\//, "") : `/${slug}`);
  } else {
    pageCache.clear();
  }
}
