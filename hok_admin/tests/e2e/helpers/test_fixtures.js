/**
 * Test Fixture Generators with unique deterministic/random identifiers
 */

export const uniqueId = (prefix = "TEST") => {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${rand}`;
};

export const uniqueEmail = (prefix = "user") => {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${rand}@example.com`;
};

export const generateTestAdmin = (overrides = {}) => ({
  name: "E2E Test Admin",
  email: uniqueEmail("admin"),
  password: "Password@123",
  role: "Super Admin",
  ...overrides,
});

export const generateTestCustomer = (overrides = {}) => {
  const custId = uniqueId("HOK-CUST");
  return {
    customerId: custId,
    name: "Aanya Mehta",
    email: uniqueEmail("customer"),
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    address: "Flat 402, Sea Green Apts, Worli, Mumbai 400018",
    gstin: "27AAAAA0000A1Z5",
    instagram: "@aanyamehta",
    birthDate: "1994-06-15",
    source: "Manual - WA",
    status: "Active",
    preferences: {
      preferredSize: "M",
      preferredOccasions: ["Wedding", "Cocktail"],
      preferredSilhouettes: ["Lehenga", "Anarkali"],
      newsletter: true,
      whatsappNotifications: true,
    },
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        address: "Flat 402, Sea Green Apts, Worli, Mumbai 400018",
        isDefault: true,
      },
    ],
    occasions: [
      {
        id: "occ-1",
        occasion: "Sister's Wedding",
        date: "2026-11-20",
      },
    ],
    ...overrides,
  };
};

export const generateTestDesigner = (overrides = {}) => {
  const brandName = `Designer ${uniqueId("BRAND")}`;
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    designerId: slug,
    name: brandName,
    slug: slug,
    bio: "Luxury bridal couture house handcrafted in India.",
    shortBio: "Heritage couture and artisanal embroidery.",
    type: "Couture House",
    status: "Active",
    isFeatured: true,
    sortOrder: 1,
    counterfeitRiskTier: "Low",
    commercialTerms: {
      suppliesFreshStockBuyNow: true,
      commissionRateBuyNow: 25,
      paymentTerms: "Net 30",
      accountManagerName: "Rohan Varma",
      contactEmail: uniqueEmail("designer"),
      contactPhone: "+91 98200 11223",
    },
    ...overrides,
  };
};

export const generateTestLister = (overrides = {}) => {
  const listerId = uniqueId("LST");
  return {
    listerId: listerId,
    name: "Pooja Singhania",
    initials: "PS",
    email: uniqueEmail("lister"),
    phone: "+91 99887 76655",
    city: "New Delhi",
    location: "South Extension, New Delhi",
    status: "Verified",
    verified: true,
    bankDetails: {
      accountHolder: "Pooja Singhania",
      accountNumber: "98765432101234",
      ifsc: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "South Ext Branch",
      upi: "pooja@okhdfcbank",
    },
    pan: "ABCDE1234F",
    panVerified: true,
    payoutPercentages: {
      rental: 80,
      buy: 75,
    },
    notes: "Top-tier premium wardrobe lister.",
    ...overrides,
  };
};

export const generateTestProduct = (overrides = {}) => {
  const prodId = uniqueId("HOK-PRD");
  return {
    productId: prodId,
    name: `Bridal Silk Lehenga ${prodId}`,
    designer: "Sabyasachi",
    category: "Lehengas",
    occasion: "Bridal",
    material: "Raw Silk",
    color: "Crimson Red",
    sizes: ["S", "M", "L"],
    rentalPrice: 15000,
    securityDeposit: 20000,
    listingPrice: 185000,
    status: "Live",
    availability: "Available Now",
    listingModes: ["RENTAL", "PRELOVED"],
    minimumDurationDays: 3,
    preRentalBufferDays: 2,
    postRentalBufferDays: 3,
    gstRate: 18,
    cleaningFee: 1500,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
    ],
    measurements: {
      bust: 36,
      waist: 28,
      hips: 38,
      length: 42,
    },
    blockedDates: [],
    bookingHistory: [],
    ...overrides,
  };
};

export const generateTestOrder = (overrides = {}) => {
  const orderId = uniqueId("HOK-ORD");
  const custId = uniqueId("HOK-CUST");
  const prodId = uniqueId("HOK-PRD");
  const today = new Date();
  const startDate = new Date(today.getTime() + 5 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const endDate = new Date(today.getTime() + 9 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const dispatchDate = new Date(today.getTime() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const returnDueDate = new Date(today.getTime() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0];

  return {
    orderId,
    customerId: custId,
    customerName: "Sneha Kapoor",
    customerEmail: uniqueEmail("order_customer"),
    customerPhone: "+91 98111 22334",
    customerCity: "Bengaluru",
    customerState: "Karnataka",
    address: "12 Palm Meadows, Whitefield, Bengaluru 560066",
    status: "Confirmed",
    mode: "Rental",
    orderValue: 15000,
    depositHeld: 20000,
    depositStatus: "Pending",
    grandTotal: 37700, // 15000 + 20000 + 2700 (18% GST on 15k)
    gst: 2700,
    discount: 0,
    listerPayout: 12000, // 80% of 15000
    payoutStatus: "Pending Approval",
    items: [
      {
        productId: prodId,
        productName: "Crimson Velvet Zardozi Lehenga",
        designer: "Sabyasachi",
        mode: "Rental",
        size: "M",
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        dispatchDate: dispatchDate,
        returnDueDate: returnDueDate,
        amount: 15000,
        deposit: 20000,
        gst: 2700,
        quantity: 1,
        status: "Confirmed",
        dispatch: {
          courierPartner: "BlueDart Express",
          trackingNumber: "BD9928172635",
          date: dispatchDate,
          status: "Scheduled",
        },
        returnCondition: {
          grade: "A",
          notes: "Brand new condition.",
        },
        depositDecision: {
          status: "Pending",
          totalDeposit: 20000,
          releasedAmount: 0,
          deductedAmount: 0,
        },
      },
    ],
    logs: [
      {
        message: "Order placed via online portal",
        type: "System",
        user: "System",
        createdAt: new Date().toISOString(),
      },
    ],
    ...overrides,
  };
};

export const generateTestOffer = (overrides = {}) => {
  const offerId = uniqueId("OFF");
  return {
    offerId: offerId,
    productId: uniqueId("HOK-PRD"),
    productName: "Rose Gold Sequin Anarkali",
    customerName: "Riya Sen",
    customerEmail: uniqueEmail("offer_cust"),
    customerPhone: "+91 97777 88888",
    customerCity: "Kolkata",
    originalAmount: 25000,
    offeredAmount: 18000,
    discount: 28,
    finalAmount: 18000,
    status: "Pending",
    negotiationStatus: "Not Started",
    category: "Anarkalis",
    notes: [
      {
        message: "Customer inquired for wedding reception.",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      },
    ],
    timeline: [
      {
        action: "Offer Created",
        remarks: "Initial offer submitted.",
        user: "System",
        createdAt: new Date().toISOString(),
      },
    ],
    ...overrides,
  };
};

export const generateTestPayout = (overrides = {}) => {
  const payoutId = uniqueId("PAY");
  const orderId = uniqueId("HOK-ORD");
  const listerId = uniqueId("LST");
  return {
    payoutId,
    orderId,
    listerId,
    listerName: "Ananya Deshmukh",
    productId: uniqueId("HOK-PRD"),
    productName: "Midnight Blue Velvet Sherwani",
    mode: "Rental",
    transactionAmount: 20000,
    payoutPercentage: 80,
    listerShare: 16000,
    hokCommission: 4000,
    taxDeduction: 1600,
    netPayout: 14400,
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    status: "Pending",
    ...overrides,
  };
};

export const generateTestLYPSubmission = (overrides = {}) => {
  const subId = uniqueId("LYP-SUB");
  return {
    submissionId: subId,
    listerId: uniqueId("LST"),
    listerName: "Tanvi Shah",
    listerEmail: uniqueEmail("lyp_lister"),
    pieceName: "Pastel Pink Embroidered Gown",
    designer: "Manish Malhotra",
    category: "Gowns",
    size: "S",
    originalPrice: 120000,
    suggestedRentalPrice: 12000,
    condition: "Flawless / Like New",
    status: "New",
    photos: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
    ],
    submissionDate: new Date().toISOString(),
    ...overrides,
  };
};
