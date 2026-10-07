import defaultCategoriesData from "../data/home/categoriesData.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:5003/api" : "/api");

// Master Category fallback map referencing default storefront items and assets
const MASTER_CATEGORY_MAP = {
  "bridal-lehenga": {
    id: 1,
    name: "Bridal Lehengas",
    variant: "Bridal%20Lehengas",
    defaultLabel: "Bridal Lehengas",
    cta: "Shop Now",
    desktopImage: defaultCategoriesData.rowOne[0]?.desktopImage,
    mobile: {
      eyebrow: "Curated for every occasion",
      pieces: "480 pieces",
      image: defaultCategoriesData.rowOne[0]?.mobile?.image,
    },
  },
  "sherwani": {
    id: 2,
    name: "Sherwanis",
    variant: "Sherwanis",
    defaultLabel: "Sherwanis",
    cta: "Shop Now",
    desktopImage: defaultCategoriesData.rowOne[1]?.desktopImage,
    mobile: {
      eyebrow: "For the groom",
      pieces: "210 pieces",
      image: defaultCategoriesData.rowOne[1]?.mobile?.image,
    },
  },
  "saree": {
    id: 3,
    name: "Sarees",
    variant: "Sarees",
    defaultLabel: "Sarees",
    cta: "Shop Now",
    desktopImage: defaultCategoriesData.rowTwo[0]?.desktopImage,
    mobile: {
      eyebrow: "Timeless drapes",
      pieces: "640 pieces",
      image: defaultCategoriesData.rowTwo[0]?.mobile?.image,
    },
  },
  "anarkali": {
    id: 4,
    name: "Anarkalis",
    variant: "Anarkalis",
    defaultLabel: "Anarkalis",
    cta: "Shop Now",
    desktopImage: defaultCategoriesData.rowTwo[1]?.desktopImage,
    mobile: {
      eyebrow: "Ethereal silhouettes",
      pieces: "380 pieces",
      image: defaultCategoriesData.rowTwo[1]?.mobile?.image,
    },
  },
  "indo-western": {
    id: 5,
    name: "Indo-Western",
    variant: "Indo-Western",
    defaultLabel: "Indo-Western",
    cta: "Shop Now",
    desktopImage: defaultCategoriesData.rowTwo[2]?.desktopImage,
    mobile: {
      eyebrow: "Modern fusion",
      pieces: "290 pieces",
      image: defaultCategoriesData.rowTwo[2]?.mobile?.image,
    },
  },
};

/**
 * Resolves CMS tiles into the storefront category rows and mobile slides.
 */
export function resolveCategoriesFromCms(cmsData) {
  if (!cmsData || !cmsData.tiles || Object.keys(cmsData.tiles).length === 0) {
    return {
      rowOne: defaultCategoriesData.rowOne,
      rowTwo: defaultCategoriesData.rowTwo,
      slides: [...defaultCategoriesData.rowOne, ...defaultCategoriesData.rowTwo],
    };
  }

  const entries = Object.entries(cmsData.tiles);
  const resolvedTiles = entries.map(([key, tileConfig], index) => {
    const master = MASTER_CATEGORY_MAP[key] || {};
    const name = tileConfig.lbl?.trim() || master.name || key;
    const cta = cmsData.ctaLbl || master.cta || "Shop Now";
    const desktopImage = tileConfig.img || master.desktopImage || "";
    const mobileImage = tileConfig.img || master.mobile?.image || desktopImage;
    const mobileEyebrow = tileConfig.kickMob || master.mobile?.eyebrow || cmsData.eyebrow || "Curated for every occasion";
    const mobilePieces = master.mobile?.pieces || "Available";
    const variant = master.variant || encodeURIComponent(name);

    return {
      id: master.id || index + 1,
      name,
      cta,
      variant,
      desktopImage,
      mobile: {
        eyebrow: mobileEyebrow,
        pieces: mobilePieces,
        image: mobileImage,
      },
    };
  });

  // Split into rowOne (first 2 items) and rowTwo (remaining items) to match Mosaic layout
  const rowOne = resolvedTiles.slice(0, 2);
  const rowTwo = resolvedTiles.slice(2);

  return {
    rowOne,
    rowTwo,
    slides: resolvedTiles,
  };
}

/**
 * Fetches Shop by Category configuration from the CMS endpoint.
 */
export async function getCategorySection() {
  try {
    const res = await fetch(`${API_BASE_URL}/homepage/category`);
    if (!res.ok) {
      throw new Error(`Failed to fetch category section: ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      const data = json.data;
      const { rowOne, rowTwo, slides } = resolveCategoriesFromCms(data);
      return {
        isVisible: data.isVisible !== false,
        eyebrow: data.eyebrow || defaultCategoriesData.eyebrow,
        heading: data.heading || defaultCategoriesData.title,
        viewAll: {
          text: data.viewAll?.text || data.viewAll?.lbl || "View All →",
          link: data.viewAll?.link || data.viewAll?.url || "/main-page?section=new&category",
        },
        ctaLbl: data.ctaLbl || "Shop Now",
        rowOne,
        rowTwo,
        slides,
      };
    }
  } catch (err) {
    console.warn("Using default category data as fallback:", err.message);
  }

  return {
    isVisible: true,
    eyebrow: defaultCategoriesData.eyebrow,
    heading: defaultCategoriesData.title,
    viewAll: {
      text: "View All →",
      link: "/main-page?section=new&category",
    },
    ctaLbl: "Shop Now",
    rowOne: defaultCategoriesData.rowOne,
    rowTwo: defaultCategoriesData.rowTwo,
    slides: [...defaultCategoriesData.rowOne, ...defaultCategoriesData.rowTwo],
  };
}
