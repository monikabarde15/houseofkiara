import defaultFeaturedData from "../data/home/featuredProductsData.js";

// Known catalogue mapping by SKU
const CATALOGUE_MAP = {
  "HOK-SAB-002": defaultFeaturedData.products[0],
  "HOK-MM-001": defaultFeaturedData.products[1],
  "HOK-TT-001": defaultFeaturedData.products[2],
  "HOK-AD-001": defaultFeaturedData.products[3],
  "HOK-SAB-001": {
    id: "HOK-SAB-001",
    sku: "HOK-SAB-001",
    designer: "Sabyasachi",
    name: "Crimson Zardozi Bridal Lehenga",
    badge: "Rent",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
    price: "₹8,500",
    priceSuffix: "/ 3 days",
    retailPrice: "₹4,50,000",
  },
  "HOK-SAB-003": {
    id: "HOK-SAB-003",
    sku: "HOK-SAB-003",
    designer: "Sabyasachi",
    name: "Rajputana Silk Bridal Lehenga",
    badge: "Rent",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
    price: "₹9,200",
    priceSuffix: "/ 3 days",
    retailPrice: "₹5,20,000",
  },
  "HOK-AD-002": {
    id: "HOK-AD-002",
    sku: "HOK-AD-002",
    designer: "Anita Dongre",
    name: "Blush Organza Gown",
    badge: "Rent",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80",
    price: "₹5,000",
    priceSuffix: "/ 3 days",
    retailPrice: "₹1,15,000",
  },
  "HOK-RK-001": {
    id: "HOK-RK-001",
    sku: "HOK-RK-001",
    designer: "Ritu Kumar",
    name: "Champagne Tissue Sharara",
    badge: "Rent",
    image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=400&q=80",
    price: "₹3,800",
    priceSuffix: "/ 3 days",
    retailPrice: "₹82,000",
  },
  "HOK-MM-002": {
    id: "HOK-MM-002",
    sku: "HOK-MM-002",
    designer: "Manish Malhotra",
    name: "Charcoal Silk Bandhgala",
    badge: "Preloved",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80",
    price: "₹42,000",
    retailPrice: "₹1,30,000",
  },
};

/**
 * Resolves an array of SKU or ID slots to product card items.
 */
export function resolveProductsFromSlots(slots, liveProducts = []) {
  if (!Array.isArray(slots) || slots.length === 0) {
    return defaultFeaturedData.products;
  }

  const resolved = slots
    .map((sku) => {
      // 1. Direct SKU catalogue map
      if (CATALOGUE_MAP[sku]) {
        return CATALOGUE_MAP[sku];
      }

      // 2. Check live products from database
      if (Array.isArray(liveProducts)) {
        const found = liveProducts.find(
          (p) =>
            p.sku === sku ||
            p.productId === sku ||
            p._id === sku ||
            p.id === sku
        );
        if (found) {
          return {
            id: found.productId || found._id || found.id,
            sku: found.sku || sku,
            designer: found.designer || "Designer",
            name: found.name || "Curated Designer Piece",
            badge: Array.isArray(found.listingModes)
              ? found.listingModes.includes("RENTAL")
                ? "Rent"
                : found.listingModes.includes("PRELOVED")
                ? "Preloved"
                : "New"
              : "Rent",
            image:
              (Array.isArray(found.images) && found.images[0]) ||
              found.image ||
              defaultFeaturedData.products[0].image,
            price: found.rentalPrice
              ? `₹${Number(found.rentalPrice).toLocaleString("en-IN")}`
              : found.listingPrice
              ? `₹${Number(found.listingPrice).toLocaleString("en-IN")}`
              : "₹10,000",
            priceSuffix: found.rentalPrice ? "/ 4 days" : "",
            retailPrice: found.originalRetailPrice
              ? `₹${Number(found.originalRetailPrice).toLocaleString("en-IN")}`
              : undefined,
          };
        }
      }

      return null;
    })
    .filter(Boolean);

  return resolved.length > 0 ? resolved : defaultFeaturedData.products;
}

export async function fetchFeaturedData() {
  try {
    const res = await fetch("/api/homepage/featured-pieces");
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn("Could not load Featured Pieces data from API, using fallback:", err);
  }
  return null;
}

export { defaultFeaturedData };
