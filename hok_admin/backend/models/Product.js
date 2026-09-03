import mongoose from "../db/postgresAdapter.js";

const blockedDateSchema = new mongoose.Schema(
  { from: String, to: String, reason: String }, 
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  { 
    orderId: { type: String, required: true }, 
    customerName: String, 
    date: String, 
    startDate: String, 
    endDate: String, 
    amount: Number, 
    deposit: Number, 
    mode: String, 
    status: String, 
    source: String,
    whatsappNumber: String, // NEW: For external bookings
    city: String, // NEW: For dispatch estimate
    channel: String, // NEW: Instagram, WhatsApp, etc.
    listerSplitPercent: Number, // NEW: For payout tracking
    splitNote: String, // NEW: Why this split %
    depositStatus: String // NEW: Track deposit status
  }, 
  { _id: false }
);

const activityLogSchema = new mongoose.Schema(
  { 
    action: String, 
    user: String, 
    createdAt: { type: Date, default: Date.now }, 
    remarks: String 
  }, 
  { _id: false }
);

const productSchema = new mongoose.Schema({
  // ========== BASIC INFO ==========
  productId: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  designer: String,
  subtitle: String, // NEW: Listing card subtitle
  description: String,
  story: String, // Already exists
  
  // ========== CATEGORY & OCCASION ==========
  category: String,
  occasion: String,
  
  // ========== MATERIAL & CRAFT ==========
  material: String,
  color: String,
  craft: String,
  technique: String,
  embellishments: String,
  threadYarnDetail: String, // NEW: Thread/yarn detail
  threadWork: String, // Already exists
  
  // ========== SET & ORIGIN ==========
  setIncludes: String, // Already exists
  origin: String, // Already exists
  
  // ========== SIZE & MEASUREMENTS ==========
  sizes: [String],
  sizeGuide: String,
  measurements: { // NEW: Inches measurements
    bust: String,
    waist: String,
    hips: String,
    length: String
  },
  measurementsCm: { // NEW: Centimeters measurements
    bust: String,
    waist: String,
    hips: String,
    length: String
  },
  bestSuitedForHeight: String, // NEW: Height recommendation
  weight: String, // Already exists
  
  // ========== LISTING & AVAILABILITY ==========
  listingModes: { type: [String], default: ["RENTAL"] }, // Already exists
  availability: String,
  status: { type: String, default: "Draft" },
  condition: String,
  honestDisclosure: String, // NEW: Required for preloved
  
  // ========== RENTAL CONFIG ==========
  rentalPrice: Number,
  securityDeposit: Number,
  listingPrice: Number,
  commissionRate: Number,
  minimumDurationDays: Number,
  extensionWindowDays: Number,
  cleaningBufferDays: Number,
  preRentalBufferDays: { type: Number, default: 2 }, // NEW: Auto-block before dispatch
  postRentalBufferDays: { type: Number, default: 3 }, // NEW: Auto-block after return
  
  // ========== DELIVERY ==========
  deliveryTiming: String, // Already exists
  
  // ========== PRICING & TAX ==========
  taxRate: Number,
  gstRate: Number,
  cleaningFee: Number,
  extensionPrice: Number,
  
  // ========== LISTER ==========
  listerId: String, // NEW: Link to lister
  payoutPercentage: Number,
  payoutTerms: String,
  
  // ========== METRICS ==========
  rating: Number,
  reviewCount: Number,
  timesRented: { type: Number, default: 0 }, // Already exists
  
  // ========== MEDIA ==========
  images: [String],
  
  // ========== SEO ==========
  seoTitle: String,
  seoDescription: String,
  urlSlug: String,
  
  // ========== TAGS & RELATED ==========
  tags: [String],
  relatedProductIds: [String],
  
  // ========== BOOKINGS & BLOCKS ==========
  blockedDates: [blockedDateSchema],
  bookingHistory: [bookingSchema],
  externalBookings: [bookingSchema], // Already exists
  
  // ========== SKU ==========
  sku: String, // Already exists
  
  // ========== ACTIVITY LOG ==========
  activityLog: [activityLogSchema],

  // ========== CURATION ==========
  isPinnedToAteliers: { type: Boolean, default: false },
  ateliersOrder: { type: Number, default: null }
  
}, { timestamps: true, strict: false });

export default mongoose.model("Product", productSchema);