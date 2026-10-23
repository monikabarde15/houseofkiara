/**
 * House of Kaira: System Registry & Piece Records
 * Sections 5.1, 5.4, 5.6, 6.4, 6.5, 9.5 of System Pages Specification v1.0
 */

export const SYSTEM_DESIGNERS = [
  { id: "sabyasachi", name: "Sabyasachi", path: "/main-page?section=designers&d=sabyasachi", hasLivePieces: true },
  { id: "manish-malhotra", name: "Manish Malhotra", path: "/main-page?section=designers&d=manish-malhotra", hasLivePieces: true },
  { id: "anita-dongre", name: "Anita Dongre", path: "/main-page?section=designers&d=anita-dongre", hasLivePieces: true },
  { id: "torani", name: "Torani", path: "/main-page?section=designers&d=torani", hasLivePieces: true },
  { id: "raw-mango", name: "Raw Mango", path: "/main-page?section=designers&d=raw-mango", hasLivePieces: true },
  { id: "rimzim-dadu", name: "Rimzim Dadu", path: "/main-page?section=designers&d=rimzim-dadu", hasLivePieces: true },
  { id: "tarun-tahiliani", name: "Tarun Tahiliani", path: "/main-page?section=designers&d=tarun-tahiliani", hasLivePieces: true },
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
  // Live pieces (Section 5.6 & 6)
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
  // Single cape piece (to match screenshot 1: "zardozi cape" -> "Cape 1 PIECE")
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

export const getLivePieces = () => {
  return SYSTEM_PIECES.filter((p) => p.status === "live");
};

export const findPieceBySlugOrHouseNumber = (identifier) => {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase();
  return (
    SYSTEM_PIECES.find(
      (p) =>
        p.houseNumber.toLowerCase() === clean ||
        p.slug.toLowerCase() === clean ||
        clean.includes(p.houseNumber.toLowerCase()) ||
        clean.includes(p.slug.toLowerCase())
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
    (p) => p.category.toLowerCase() === norm && (!excludeSlug || p.slug !== excludeSlug)
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
