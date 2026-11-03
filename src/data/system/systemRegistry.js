/**
 * House of Kaira: System Registry & Piece Records
 * Sections 5.1, 5.4, 5.6, 6.4, 6.5, 9.5 of System Pages Specification v1.0
 */

export const SYSTEM_DESIGNERS = [
  { id: "sabyasachi", name: "Sabyasachi", path: "/main-page?section=designers&d=sabyasachi", hasLivePieces: true },
  { id: "sabyasachi-mukherjee", name: "Sabyasachi Mukherjee", path: "/main-page?section=designers&d=sabyasachi", hasLivePieces: true },
  { id: "neha-tomar", name: "Neha Tomar", path: "/main-page?section=designers&d=neha-tomar", hasLivePieces: true },
  { id: "manish-malhotra", name: "Manish Malhotra", path: "/main-page?section=designers&d=manish-malhotra", hasLivePieces: true },
  { id: "anita-dongre", name: "Anita Dongre", path: "/main-page?section=designers&d=anita-dongre", hasLivePieces: true },
  { id: "tarun-tahiliani", name: "Tarun Tahiliani", path: "/main-page?section=designers&d=tarun-tahiliani", hasLivePieces: true },
  { id: "gaurav-gupta", name: "Gaurav Gupta", path: "/main-page?section=designers&d=gaurav-gupta", hasLivePieces: true },
  { id: "seema-gujral", name: "Seema Gujral", path: "/main-page?section=designers&d=seema-gujral", hasLivePieces: true },
  { id: "torani", name: "Torani", path: "/main-page?section=designers&d=torani", hasLivePieces: true },
  { id: "raw-mango", name: "Raw Mango", path: "/main-page?section=designers&d=raw-mango", hasLivePieces: true },
  { id: "rimzim-dadu", name: "Rimzim Dadu", path: "/main-page?section=designers&d=rimzim-dadu", hasLivePieces: true },
  { id: "rahul-mishra", name: "Rahul Mishra", path: "/main-page?section=designers&d=rahul-mishra", hasLivePieces: false }
];

export const SYSTEM_PIECES = [
  // Sold sample for Section 5.1 & 5.4 testing
  {
    id: "hok-sab-001",
    houseNumber: "HOK-SAB-001",
    slug: "sabyasachi-crimson-zardozi-bridal-lehenga",
    name: "Crimson Zardozi Bridal Lehenga",
    designer: "Sabyasachi",
    designerId: "sabyasachi",
    category: "lehenga",
    occasions: ["bridal", "wedding-guest"],
    mode: "rent",
    price: "₹28,000",
    window: "for 3 days",
    status: "sold",
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  // Withdrawn sample for Section 5.1 & 5.4 testing
  {
    id: "hok-rim-002",
    houseNumber: "HOK-RIM-002",
    slug: "rimzim-dadu-saree",
    name: "Metallic Cord Saree",
    designer: "Rimzim Dadu",
    designerId: "rimzim-dadu",
    category: "saree",
    occasions: ["cocktail", "reception"],
    mode: "rent",
    price: "₹16,000",
    window: "for 3 days",
    status: "withdrawn",
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  // Fallback live pieces when backend is offline
  {
    id: "hok-sab-003",
    houseNumber: "HOK-SAB-003",
    slug: "sabyasachi-ivory-chikankari-bridal-lehenga",
    name: "Ivory Chikankari Bridal Lehenga",
    designer: "Sabyasachi",
    designerId: "sabyasachi",
    category: "lehenga",
    occasions: ["bridal", "wedding-guest"],
    mode: "rent",
    price: "₹19,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 1,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-sab-004",
    houseNumber: "HOK-SAB-004",
    slug: "sabyasachi-organza-saree-with-blouse",
    name: "Organza Saree with Blouse",
    designer: "Sabyasachi",
    designerId: "sabyasachi",
    category: "saree",
    occasions: ["festive", "reception"],
    mode: "preloved",
    price: "₹42,000",
    window: null,
    status: "live",
    createdOrder: 2,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-sab-005",
    houseNumber: "HOK-SAB-005",
    slug: "sabyasachi-scarlet-bridal-lehenga",
    name: "Scarlet Bridal Lehenga",
    designer: "Sabyasachi",
    designerId: "sabyasachi",
    category: "lehenga",
    occasions: ["bridal"],
    mode: "rent",
    price: "₹22,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 3,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-sab-006",
    houseNumber: "HOK-SAB-006",
    slug: "sabyasachi-bengal-tiger-silk-saree",
    name: "Bengal Tiger Silk Saree",
    designer: "Sabyasachi",
    designerId: "sabyasachi",
    category: "saree",
    occasions: ["cocktail", "reception"],
    mode: "rent",
    price: "₹14,500",
    window: "for 3 days",
    status: "live",
    createdOrder: 4,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-rim-007",
    houseNumber: "HOK-RIM-007",
    slug: "rimzim-dadu-cord-draped-saree-gown",
    name: "Cord Draped Saree Gown",
    designer: "Rimzim Dadu",
    designerId: "rimzim-dadu",
    category: "saree",
    occasions: ["cocktail", "reception"],
    mode: "rent",
    price: "₹9,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 5,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-raw-008",
    houseNumber: "HOK-RAW-008",
    slug: "raw-mango-organza-saree-in-blush",
    name: "Organza Saree in Blush",
    designer: "Raw Mango",
    designerId: "raw-mango",
    category: "saree",
    occasions: ["festive", "mehendi-sangeet"],
    mode: "preloved",
    price: "₹21,000",
    window: null,
    status: "live",
    createdOrder: 6,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-mm-009",
    houseNumber: "HOK-MM-009",
    slug: "manish-malhotra-sequin-draped-saree",
    name: "Sequin Draped Saree",
    designer: "Manish Malhotra",
    designerId: "manish-malhotra",
    category: "saree",
    occasions: ["cocktail", "reception"],
    mode: "rent",
    price: "₹13,500",
    window: "for 3 days",
    status: "live",
    createdOrder: 7,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-ad-010",
    houseNumber: "HOK-AD-010",
    slug: "anita-dongre-rose-georgette-anarkali",
    name: "Rose Georgette Anarkali",
    designer: "Anita Dongre",
    designerId: "anita-dongre",
    category: "anarkali",
    occasions: ["festive", "wedding-guest"],
    mode: "rent",
    price: "₹12,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 8,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-tor-011",
    houseNumber: "HOK-TOR-011",
    slug: "torani-festive-anarkali-set",
    name: "Festive Anarkali Set",
    designer: "Torani",
    designerId: "torani",
    category: "anarkali",
    occasions: ["festive", "mehendi-sangeet"],
    mode: "rent",
    price: "₹15,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 9,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-sab-012",
    houseNumber: "HOK-TOR-012",
    slug: "sabyasachi-raw-silk-anarkali",
    name: "Raw Silk Anarkali",
    designer: "Sabyasachi",
    designerId: "sabyasachi",
    category: "anarkali",
    occasions: ["festive", "wedding-guest"],
    mode: "rent",
    price: "₹24,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 10,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-mm-013",
    houseNumber: "HOK-MM-013",
    slug: "manish-malhotra-velvet-anarkali",
    name: "Velvet Anarkali",
    designer: "Manish Malhotra",
    designerId: "manish-malhotra",
    category: "anarkali",
    occasions: ["reception", "wedding-guest"],
    mode: "rent",
    price: "₹18,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 11,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  },
  {
    id: "hok-ad-014",
    houseNumber: "HOK-AD-014",
    slug: "anita-dongre-embroidered-cape",
    name: "Embroidered Silk Cape",
    designer: "Anita Dongre",
    designerId: "anita-dongre",
    category: "cape",
    occasions: ["festive", "cocktail"],
    mode: "rent",
    price: "₹11,000",
    window: "for 3 days",
    status: "live",
    createdOrder: 12,
    image: "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
  }
];

let dynamicBackendPieces = [];

export const mapBackendProductToSystemPiece = (p, idx = 0) => {
  const rawModes = Array.isArray(p.listingModes)
    ? p.listingModes.map((m) => String(m).toLowerCase())
    : [];
  const isPreloved =
    p.preloved === true ||
    String(p.type || "").toLowerCase() === "preloved" ||
    rawModes.some((m) => m.includes("preloved"));
  const mode = isPreloved ? "preloved" : "rent";

  const rawPrice =
    (isPreloved ? p.buyPrice || p.listingPrice : p.rentPrice || p.rentalPrice) ||
    p.rentPrice ||
    p.rentalPrice ||
    p.buyPrice ||
    p.listingPrice ||
    p.price ||
    "14,999";
  const formattedPrice = String(rawPrice).startsWith("₹")
    ? String(rawPrice)
    : `₹${rawPrice}`;

  const firstImage = Array.isArray(p.image)
    ? p.image[0]
    : Array.isArray(p.images)
      ? p.images[0]
      : p.image || "";

  const designer = p.designer || "House of Kaira";
  const designerId = String(designer)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const categoryRaw = String(p.category || "lehenga").toLowerCase();
  const occasionsList = [
    ...(Array.isArray(p.occasion)
      ? p.occasion
      : p.occasion
      ? String(p.occasion).split(",")
      : []),
    ...(Array.isArray(p.occasions) ? p.occasions : []),
    ...(Array.isArray(p.color) ? p.color : p.color ? [p.color] : []),
  ]
    .map((o) => String(o).trim().toLowerCase())
    .filter(Boolean);

  return {
    id: p._id || p.id || p.productId || p.sku || `live-${idx}`,
    houseNumber: p.productId || p.id || p.sku || `HOK-${idx + 1}`,
    slug: String(p.name || p.title || `piece-${idx}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name: p.name || p.title || "Designer Piece",
    designer,
    designerId,
    category: categoryRaw,
    occasions: occasionsList,
    mode,
    price: formattedPrice,
    window: mode === "rent" ? "for 3 days" : null,
    status: "live",
    createdOrder: idx + 1,
    image: typeof firstImage === "string" ? firstImage : firstImage?.url || "",
    rawProduct: p,
  };
};

export const setDynamicBackendPieces = (rawProducts = []) => {
  if (!Array.isArray(rawProducts) || rawProducts.length === 0) return [];
  dynamicBackendPieces = rawProducts.map((p, idx) =>
    mapBackendProductToSystemPiece(p, idx)
  );
  return dynamicBackendPieces;
};

export const fetchAndSyncLivePieces = async () => {
  const backendUrl =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_BACKEND_URL) ||
    "";
  const urlsToTry = backendUrl
    ? [`${backendUrl}/api/web-products`, "/api/web-products"]
    : ["/api/web-products", "http://localhost:5003/api/web-products"];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
        return setDynamicBackendPieces(json.data);
      }
    } catch {
      // try next url
    }
  }
  return dynamicBackendPieces;
};

export const getLivePieces = () => {
  if (dynamicBackendPieces.length > 0) {
    return dynamicBackendPieces;
  }
  return SYSTEM_PIECES.filter((p) => p.status === "live");
};

export const findPieceBySlugOrHouseNumber = (identifier) => {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase();
  const pool = [...dynamicBackendPieces, ...SYSTEM_PIECES];
  return (
    pool.find(
      (p) =>
        String(p.id || "").toLowerCase() === clean ||
        String(p.houseNumber || "").toLowerCase() === clean ||
        String(p.slug || "").toLowerCase() === clean ||
        clean.includes(String(p.houseNumber || "").toLowerCase()) ||
        clean.includes(String(p.slug || "").toLowerCase())
    ) || null
  );
};

export const getPiecesByDesigner = (designerName, excludeSlug = null) => {
  const norm = String(designerName).trim().toLowerCase();
  return getLivePieces().filter(
    (p) => p.designer.toLowerCase() === norm && (!excludeSlug || p.slug !== excludeSlug)
  );
};

export const getPiecesByCategory = (categoryName, excludeSlug = null) => {
  const norm = String(categoryName).trim().toLowerCase();
  return getLivePieces().filter(
    (p) =>
      (p.category.toLowerCase() === norm ||
        p.category.toLowerCase().includes(norm) ||
        norm.includes(p.category.toLowerCase())) &&
      (!excludeSlug || p.slug !== excludeSlug)
  );
};

export const getNewestLivePieces = (count = 4, excludeSlugs = []) => {
  return getLivePieces()
    .filter((p) => !excludeSlugs.includes(p.slug))
    .slice(0, count);
};

export const getDesignerByName = (name) => {
  if (!name) return null;
  const clean = String(name).trim().toLowerCase();
  return (
    SYSTEM_DESIGNERS.find(
      (d) =>
        d.name.toLowerCase() === clean ||
        clean.includes(d.name.toLowerCase()) ||
        d.id === clean
    ) || null
  );
};
