// Section 18: All Wishlist Cards — Reference Data
// Based on Mobile Spec Section 18

export const wishlistItems = {
  // Section 18.1: Rent Section (7 cards)
  rent: [
    {
      id: 1,
      name: "Crimson Zardozi Bridal Lehenga",
      designer: "Sabyasachi",
      mode: "rent",
      price: 8500,
      originalPrice: 340000,
      savePercentage: 97,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: true,
      dateSaved: "2025-05-20",
      tag: "In Demand",
      sizes: ["XS", "S", "M", "L"]
    },
    {
      id: 2,
      name: "Blush Ombre Sequin Lehenga",
      designer: "Manish Malhotra",
      mode: "rent",
      price: 5500,
      originalPrice: 210000,
      savePercentage: 97,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: true,
      dateSaved: "2025-05-28",
      tag: null,
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "Rose Embroidered Anarkali Gown",
      designer: "Tarun Tahiliani",
      mode: "rent",
      price: 4800,
      originalPrice: 160000,
      savePercentage: 97,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: false,
      dateSaved: "2025-05-15",
      tag: null,
      sizes: ["XS", "S", "M", "L"]
    },
    {
      id: 4,
      name: "Sage & Gold Floral Lehenga",
      designer: "Anita Dongre",
      mode: "rent",
      price: 16400,
      originalPrice: 240000,
      savePercentage: 93,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: true,
      dateSaved: "2025-05-08",
      tag: null,
      sizes: ["XS", "S", "M"]
    },
    {
      id: 9,
      name: "Deep Blue Silk Embroidered Lehenga",
      designer: "Rahul Mishra",
      mode: "rent",
      price: 17200,
      originalPrice: 280000,
      savePercentage: 94,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: true,
      dateSaved: "2025-05-26",
      tag: null,
      sizes: ["S", "M"]
    },
    {
      id: 10,
      name: "Terracotta Zardozi Anarkali Suit",
      designer: "Mrunalini Rao",
      mode: "rent",
      price: 14200,
      originalPrice: 160000,
      savePercentage: 91,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: true,
      dateSaved: "2026-05-21",
      tag: null,
      sizes: ["XS", "S", "M", "L"]
    },
    {
      id: 11,
      name: "Ivory Chanderi Floral Saree",
      designer: "Raw Mango",
      mode: "rent",
      price: 15800,
      originalPrice: 220000,
      savePercentage: 93,
      rentalDuration: "4 days",
      condition: null,
      isAvailable: true,
      dateSaved: "2026-05-17",
      tag: "Popular",
      sizes: ["Free Size"]
    }
  ],

  // Section 18.2: Buy Preloved Section (3 cards)
  preloved: [
    {
      id: 5,
      name: "Gold Tissue Banarasi Saree",
      designer: "Sabyasachi",
      mode: "preloved",
      price: 142000,
      originalPrice: 120000,
      savePercentage: 65,
      condition: "Pristine condition",
      isAvailable: true,
      dateSaved: "2026-05-26",
      sizes: ["Free Size"]
    },
    {
      id: 6,
      name: "Navy Chanderi Floral Anarkali",
      designer: "Ritu Kumar",
      mode: "preloved",
      price: 118500,
      originalPrice: 58000,
      savePercentage: 68,
      condition: "Excellent condition",
      isAvailable: true,
      dateSaved: "2025-05-19",
      sizes: ["S", "M", "L"]
    },
    {
      id: 7,
      name: "Blush Pink Mirrorwork Lehenga",
      designer: "Anita Dongre",
      mode: "preloved",
      price: 124000,
      originalPrice: 82000,
      savePercentage: 71,
      condition: "Good condition",
      isAvailable: true,
      dateSaved: "2025-05-01",
      sizes: ["S", "M", "L"]
    }
  ],

  // Section 18.3: Buy New Section (1 card)
  new: [
    {
      id: 8,
      name: "Emerald Gulbagh Embroidered Kurta Set",
      designer: "Torani",
      mode: "new",
      price: 128500,
      originalPrice: 128500,
      savePercentage: 0,
      condition: null,
      isAvailable: true,
      dateSaved: "2025-05-27",
      sizes: ["XS", "S", "M", "L", "XL"]
    }
  ]
};

// Limited availability items for notice (Section 5.2)
export const limitedAvailabilityItems = [
  {
    id: 1,
    name: "Crimson Zardozi Bridal Lehenga",
    designer: "Sabyasachi"
  },
  {
    id: 3,
    name: "Rose Embroidered Anarkali Gown",
    designer: "Tarun Tahiliani"
  }
];

// Stats for the page
export const wishlistStats = {
  totalPieces: 11,
  totalDesigners: 9,
  toRent: 7
};

// Tab counts
export const tabCounts = {
  all: 11,
  rent: 7,
  buyPreloved: 3,
  buyNew: 1
};