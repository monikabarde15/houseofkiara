import mongoose from "../db/postgresAdapter.js";

const commercialTermsSchema = new mongoose.Schema(
  {
    suppliesFreshStockBuyNow: { type: Boolean, default: false },
    commissionRateBuyNow: { type: String, default: "" },
    paymentTerms: { type: String, default: "" },
    brandFulfilmentPolicy: { type: String, default: "" },
    accountManagerName: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    internalNotes: { type: String, default: "" }
  },
  { _id: false }
);

const designerSchema = new mongoose.Schema(
  {
    designerId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    bio: { type: String, default: "" },
    shortBio: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Couture House", "Contemporary Label", "Heritage Weave", "Indie Designer", "Unclassified"],
      default: "Indie Designer"
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active"
    },
    joinedAt: { type: String, default: () => new Date().toISOString().split("T")[0] },
    isNewToHOK: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    featuredOrder: { type: Number, default: null },
    sortOrder: { type: Number, default: 99 },
    livePieces: { type: Number, default: 0 },
    totalPieces: { type: Number, default: 0 },
    counterfeitRiskTier: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low"
    },
    authenticationChecklist: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    instagramHandle: { type: String, default: "" },
    commercialTerms: { type: commercialTermsSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model("Designer", designerSchema);
