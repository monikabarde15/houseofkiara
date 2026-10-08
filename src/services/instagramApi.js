import defaultInstagramData from "../data/home/instagramData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5003/api" : "/api");

/**
 * Resolves CMS tiles into storefront Instagram posts, using local assets as fallbacks.
 */
export function resolveInstagramFromCms(cmsData) {
  const tiles = Array.isArray(cmsData?.tiles) ? cmsData.tiles : [];
  if (tiles.length === 0) {
    return defaultInstagramData.posts;
  }

  return tiles.map((tile, idx) => {
    const fallbackPost = defaultInstagramData.posts[idx] || defaultInstagramData.posts[0];
    const image = tile.img && tile.img.trim() ? tile.img : fallbackPost.image;
    const link = tile.url && tile.url.trim() ? tile.url : (fallbackPost.link || "https://instagram.com/house_of_kaira");
    const alt = tile.alt && tile.alt.trim() ? tile.alt : `Instagram Post ${idx + 1}`;

    return {
      id: tile.id || fallbackPost.id || idx + 1,
      image,
      link,
      alt,
    };
  });
}

/**
 * Fetches Instagram section data from the CMS endpoint.
 */
export async function getInstagramSection() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/instagram`);
    if (!res.ok) {
      throw new Error(`Failed to fetch instagram: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      const data = json.data;
      const posts = resolveInstagramFromCms(data);
      return {
        isVisible: data.isVisible !== false,
        eyebrow: data.eyebrow || defaultInstagramData.eyebrow,
        heading: data.heading || "As seen on *Instagram*",
        viewAll: data.viewAll || { lbl: "Follow →", url: "https://instagram.com/house_of_kaira" },
        viewAllMob: data.viewAllMob || "Follow →",
        source: data.source || "Manual tiles",
        strip: data.strip || "Follow our story at",
        stripMob: data.stripMob || "Follow us at",
        posts,
        settings: data.settings || data,
      };
    }
  } catch (err) {
    console.warn("Using default instagram data as fallback:", err.message);
  }

  return {
    isVisible: true,
    eyebrow: defaultInstagramData.eyebrow,
    heading: "As seen on *Instagram*",
    viewAll: { lbl: "Follow →", url: "https://instagram.com/house_of_kaira" },
    viewAllMob: "Follow →",
    source: "Manual tiles",
    strip: "Follow our story at",
    stripMob: "Follow us at",
    posts: defaultInstagramData.posts,
  };
}
