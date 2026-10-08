import featuredDesignersData from "../data/home/featuredDesignersData.js";
import designer1 from "../assets/Designers/Designer-1.jpg";
import designer2 from "../assets/Designers/Designer-2.jpg";
import designer3 from "../assets/Designers/Designer-3.jpg";
import designer4 from "../assets/Designers/Designer-4.jpg";
import designer5 from "../assets/Designers/Designer-5.jpg";
import designer6 from "../assets/Designers/Designer-6.jpg";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5003/api" : "/api");

// Master designer repository with high-res portraits and catalogue metadata
export const MASTER_DESIGNERS_MAP = {
  sabyasachi: {
    id: "sabyasachi",
    name: "Sabyasachi",
    variant: "Sabyasachi",
    image: designer1,
    piecesCount: 214,
    livePieces: 3,
  },
  "manish-malhotra": {
    id: "manish-malhotra",
    name: "Manish Malhotra",
    variant: "Manish%20Malhotra",
    image: designer2,
    piecesCount: 187,
    livePieces: 0,
  },
  "tarun-tahiliani": {
    id: "tarun-tahiliani",
    name: "Tarun Tahiliani",
    variant: "Tarun%20Tahiliani",
    image: designer3,
    piecesCount: 143,
    livePieces: 1,
  },
  "anita-dongre": {
    id: "anita-dongre",
    name: "Anita Dongre",
    variant: "Anita%20Dongre",
    image: designer4,
    piecesCount: 118,
    livePieces: 1,
  },
  "raw-mango": {
    id: "raw-mango",
    name: "Raw Mango",
    variant: "Raw%20Mango",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    piecesCount: 92,
    livePieces: 0,
  },
  "abu-jani-sandeep": {
    id: "abu-jani-sandeep",
    name: "Abu Jani Sandeep",
    variant: "Abu%20Jani%20Sandeep",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    piecesCount: 76,
    livePieces: 0,
  },
  torani: {
    id: "torani",
    name: "Torani",
    variant: "Torani",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    piecesCount: 65,
    livePieces: 0,
  },
  ekaya: {
    id: "ekaya",
    name: "Ekaya",
    variant: "Ekaya",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    piecesCount: 54,
    livePieces: 0,
  },
  "papa-dont-preach": {
    id: "papa-dont-preach",
    name: "Papa Don't Preach",
    variant: "Papa%20Don't%20Preach",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    piecesCount: 48,
    livePieces: 0,
  },
  "rahul-mishra": {
    id: "rahul-mishra",
    name: "Rahul Mishra",
    variant: "Rahul%20Mishra",
    image: designer6,
    piecesCount: 84,
    livePieces: 0,
  },
  "rimzim-dadu": {
    id: "rimzim-dadu",
    name: "Rimzim Dadu",
    variant: "Rimzim%20Dadu",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80",
    piecesCount: 39,
    livePieces: 0,
  },
  "ritu-kumar": {
    id: "ritu-kumar",
    name: "Ritu Kumar",
    variant: "Ritu%20Kumar",
    image: designer5,
    piecesCount: 96,
    livePieces: 0,
  },
};

/**
 * Resolves CMS slots and layout configuration into designer card objects for storefront.
 */
export function resolveDesignersFromCms(cmsData) {
  const cap = typeof cmsData?.cap === "number" ? cmsData.cap : 6;
  const slots = Array.isArray(cmsData?.slots) && cmsData.slots.length > 0
    ? cmsData.slots
    : ["sabyasachi", "manish-malhotra", "tarun-tahiliani", "anita-dongre", "raw-mango", "abu-jani-sandeep"];

  const showCount = cmsData?.showCount !== false;
  const countLbl = cmsData?.countLbl || "{n} PIECES";
  const countLblMob = cmsData?.countLblMob || "{n} pieces available";
  const ctaLbl = cmsData?.ctaLbl || "Shop Now";

  // Take up to `cap` slots
  const activeSlots = slots.slice(0, cap);

  const designers = activeSlots.map((slotId, index) => {
    // Check if slotId matches key or fallback
    const key = String(slotId).toLowerCase().trim();
    const master = MASTER_DESIGNERS_MAP[key] || {
      id: key,
      name: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      variant: encodeURIComponent(key),
      image: designer1,
      piecesCount: 100 - index * 10,
    };

    const countNumber = master.piecesCount || master.livePieces || 0;
    const piecesDesktop = showCount
      ? countLbl.replace("{n}", countNumber)
      : "";
    const piecesMobile = showCount
      ? countLblMob.replace("{n}", countNumber)
      : "";

    return {
      id: master.id || index + 1,
      name: master.name,
      variant: master.variant || master.name,
      image: master.image,
      pieces: piecesDesktop,
      piecesMobile: piecesMobile,
      cta: ctaLbl,
    };
  });

  return designers;
}

/**
 * Fetches Featured Designers section data from the CMS API.
 */
export async function getDesignersSection() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/designers`);
    if (!res.ok) {
      throw new Error(`Failed to fetch designers section: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      const data = json.data;
      const designers = resolveDesignersFromCms(data);
      return {
        isVisible: data.isVisible !== false,
        eyebrow: data.eyebrow || featuredDesignersData.eyebrow,
        heading: data.heading || "Featured *Designers*",
        viewAll: {
          lbl: data.viewAll?.lbl || "All Designers →",
          url: data.viewAll?.url || "/main-page?section=designers",
        },
        header: data.header !== false,
        headerMob: data.headerMob === true,
        slideKick: data.slideKick || "Featured Designer",
        ctaLbl: data.ctaLbl || "Shop Now",
        showCount: data.showCount !== false,
        cap: data.cap || 6,
        layout: data.layout || "Grid",
        layoutMob: data.layoutMob || "Carousel",
        designers,
        settings: data.settings || data,
      };
    }
  } catch (err) {
    console.warn("Using default designers data as fallback:", err.message);
  }

  // Fallback to default featuredDesignersData
  return {
    isVisible: true,
    eyebrow: featuredDesignersData.eyebrow,
    heading: "Featured *Designers*",
    viewAll: {
      lbl: "View All →",
      url: "/main-page?section=designers",
    },
    header: true,
    headerMob: false,
    slideKick: "Featured Designer",
    ctaLbl: "Shop Now",
    showCount: true,
    cap: 6,
    layout: "Grid",
    layoutMob: "Carousel",
    designers: featuredDesignersData.designers.map((d) => ({
      ...d,
      piecesMobile: d.pieces,
      cta: "Shop Now",
    })),
  };
}
