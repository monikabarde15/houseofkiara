import Product from "./models/Product.js";

const cataloguePieces = [
  {
    sku: "HOK-SAB-002",
    productId: "HOK-PRD-SAB-002",
    name: "Gulabi Silk Bridal Lehenga",
    designer: "Sabyasachi",
    category: "Bridal Lehenga",
    sizes: ["S", "M"],
    status: "Live",
    rentalPrice: 6400,
    minimumDurationDays: 3,
    listingPrice: 110000,
    originalRetailPrice: 395000,
    listingModes: ["Rental", "Preloved"],
    condition: "Excellent",
    images: [
      "/uploads/grid-1.jpg",
      "/uploads/grid-11.jpg",
      "/uploads/grid-12.jpg",
      "/uploads/grid-13.jpg"
    ],
    shots: {
      "On model": "/uploads/grid-1.jpg",
      "Flat lay": "/uploads/grid-11.jpg",
      "Ghost mannequin": "/uploads/grid-12.jpg",
      "Detail shot": "/uploads/grid-13.jpg"
    }
  },
  {
    sku: "HOK-MM-001",
    productId: "HOK-PRD-MM-001",
    name: "Ivory Embroidered Sherwani",
    designer: "Manish Malhotra",
    category: "Sherwani",
    sizes: ["40"],
    status: "Sold",
    rentalPrice: 5800,
    minimumDurationDays: 3,
    listingPrice: 38000,
    originalRetailPrice: 145000,
    listingModes: ["Preloved"],
    condition: "Excellent",
    images: [
      "/uploads/grid-2.jpg",
      "/uploads/grid-12.jpg",
      "/uploads/grid-14.jpg"
    ],
    shots: {
      "On model": "/uploads/grid-2.jpg",
      "Flat lay": "/uploads/grid-12.jpg",
      "Ghost mannequin": "/uploads/grid-14.jpg",
      "Detail shot": "/uploads/grid-2.jpg"
    }
  },
  {
    sku: "HOK-TT-001",
    productId: "HOK-PRD-TT-001",
    name: "Midnight Blue Crepe Saree",
    designer: "Tarun Tahiliani",
    category: "Saree",
    sizes: ["Free"],
    status: "Live",
    rentalPrice: 3900,
    minimumDurationDays: 3,
    listingPrice: 24500,
    originalRetailPrice: 85000,
    listingModes: ["Preloved"],
    condition: "Excellent",
    images: [
      "/uploads/grid-3.jpg",
      "/uploads/grid-13.jpg"
    ],
    shots: {
      "On model": "/uploads/grid-3.jpg",
      "Flat lay": "/uploads/grid-13.jpg",
      "Ghost mannequin": "/uploads/grid-3.jpg",
      "Detail shot": "/uploads/grid-13.jpg"
    }
  },
  {
    sku: "HOK-AD-001",
    productId: "HOK-PRD-AD-001",
    name: "Rose Georgette Anarkali",
    designer: "Anita Dongre",
    category: "Anarkali",
    sizes: ["S"],
    status: "Live",
    rentalPrice: 4500,
    minimumDurationDays: 3,
    listingPrice: 32000,
    originalRetailPrice: 98000,
    listingModes: ["Rental"],
    condition: "Pristine",
    images: [
      "/uploads/grid-4.jpg",
      "/uploads/grid-14.jpg"
    ],
    shots: {
      "On model": "/uploads/grid-4.jpg",
      "Flat lay": "/uploads/grid-14.jpg",
      "Ghost mannequin": "/uploads/grid-4.jpg",
      "Detail shot": "/uploads/grid-14.jpg"
    }
  },
  {
    sku: "HOK-SAB-001",
    productId: "HOK-PRD-SAB-001",
    name: "Crimson Zardozi Bridal Lehenga",
    designer: "Sabyasachi",
    category: "Bridal Lehenga",
    sizes: ["M"],
    status: "Live",
    rentalPrice: 8500,
    minimumDurationDays: 3,
    listingPrice: 185000,
    originalRetailPrice: 450000,
    listingModes: ["Rental", "Preloved"],
    condition: "Pristine",
    images: [
      "/uploads/grid-1.jpg",
      "/uploads/grid-11.jpg"
    ],
    shots: {
      "On model": "/uploads/grid-1.jpg",
      "Flat lay": "/uploads/grid-11.jpg",
      "Ghost mannequin": "/uploads/grid-1.jpg",
      "Detail shot": "/uploads/grid-11.jpg"
    }
  },
  {
    sku: "HOK-SAB-003",
    productId: "HOK-PRD-SAB-003",
    name: "Rajputana Silk Bridal Lehenga",
    designer: "Sabyasachi",
    category: "Bridal Lehenga",
    sizes: ["L"],
    status: "Live",
    rentalPrice: 9200,
    minimumDurationDays: 3,
    listingPrice: 210000,
    originalRetailPrice: 520000,
    listingModes: ["Rental", "Preloved"],
    condition: "Pristine",
    images: ["/uploads/grid-1.jpg"],
    shots: {
      "On model": "/uploads/grid-1.jpg",
      "Flat lay": "/uploads/grid-1.jpg",
      "Ghost mannequin": "/uploads/grid-1.jpg",
      "Detail shot": "/uploads/grid-1.jpg"
    }
  },
  {
    sku: "HOK-AD-002",
    productId: "HOK-PRD-AD-002",
    name: "Blush Organza Gown",
    designer: "Anita Dongre",
    category: "Gown",
    sizes: ["M"],
    status: "Draft",
    rentalPrice: 5000,
    minimumDurationDays: 3,
    listingPrice: 42000,
    originalRetailPrice: 115000,
    listingModes: ["Rental"],
    condition: "Excellent",
    images: ["/uploads/grid-4.jpg"],
    shots: {
      "On model": "/uploads/grid-4.jpg",
      "Flat lay": "/uploads/grid-4.jpg",
      "Ghost mannequin": "/uploads/grid-4.jpg",
      "Detail shot": "/uploads/grid-4.jpg"
    }
  },
  {
    sku: "HOK-RK-001",
    productId: "HOK-PRD-RK-001",
    name: "Champagne Tissue Sharara",
    designer: "Ritu Kumar",
    category: "Sharara",
    sizes: ["M"],
    status: "Paused",
    rentalPrice: 3800,
    minimumDurationDays: 3,
    listingPrice: 26000,
    originalRetailPrice: 82000,
    listingModes: ["Rental", "Preloved"],
    condition: "Excellent",
    images: ["/uploads/grid-3.jpg"],
    shots: {
      "On model": "/uploads/grid-3.jpg",
      "Flat lay": "/uploads/grid-3.jpg",
      "Ghost mannequin": "/uploads/grid-3.jpg",
      "Detail shot": "/uploads/grid-3.jpg"
    }
  },
  {
    sku: "HOK-MM-002",
    productId: "HOK-PRD-MM-002",
    name: "Charcoal Silk Bandhgala",
    designer: "Manish Malhotra",
    category: "Bandhgala",
    sizes: ["42"],
    status: "Sold",
    rentalPrice: 6000,
    minimumDurationDays: 3,
    listingPrice: 42000,
    originalRetailPrice: 130000,
    listingModes: ["Preloved"],
    condition: "Excellent",
    images: ["/uploads/grid-2.jpg"],
    shots: {
      "On model": "/uploads/grid-2.jpg",
      "Flat lay": "/uploads/grid-2.jpg",
      "Ghost mannequin": "/uploads/grid-2.jpg",
      "Detail shot": "/uploads/grid-2.jpg"
    }
  }
];

export async function seedCataloguePieces() {
  for (const piece of cataloguePieces) {
    const existing = await Product.findOne({
      $or: [{ sku: piece.sku }, { productId: piece.productId }]
    });
    if (existing) {
      Object.assign(existing, piece);
      await existing.save();
    } else {
      await Product.create(piece);
    }
  }
  console.log(`Upserted ${cataloguePieces.length} catalogue pieces successfully`);
}

if (process.argv[1] && process.argv[1].includes("seed_featured_pieces.js")) {
  seedCataloguePieces().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
