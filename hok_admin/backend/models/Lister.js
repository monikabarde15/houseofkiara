import mongoose from "../db/postgresAdapter.js";

const listerSchema = new mongoose.Schema(
  {
    listerId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    initials: String,
    email: { type: String, lowercase: true, default: null },
    phone: String,
    city: String,
    location: String,
    status: {
      type: String,
      default: "Verified",
    },
    statusReason: String,
    source: { type: String, default: "Manual (Admin)" },
    referral: String,
    insta: String,
    joined: String,
    verified: { type: Boolean, default: true },
    address: mongoose.Schema.Types.Mixed,
    pickup: mongoose.Schema.Types.Mixed,
    pickupPrefs: String,
    bank: mongoose.Schema.Types.Mixed,
    bankDetails: mongoose.Schema.Types.Mixed,
    payoutPercentages: mongoose.Schema.Types.Mixed,
    gstReg: { type: Boolean, default: false },
    gstin: String,
    pan: String,
    panVerified: { type: Boolean, default: false },
    terms: mongoose.Schema.Types.Mixed,
    notes: String,
    internalNotes: String,
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Lister", listerSchema);
