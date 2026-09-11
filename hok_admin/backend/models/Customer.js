import mongoose from "../db/postgresAdapter.js";

const addressSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    address: String,
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const occasionSchema = new mongoose.Schema(
  {
    id: String,
    occasion: String,
    date: String
  },
  { _id: false }
);

const commLogSchema = new mongoose.Schema(
  {
    id: String,
    message: String,
    channel: { type: String, default: "WhatsApp" },
    timestamp: { type: String, default: () => new Date().toLocaleString("en-IN") }
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    address: { type: String, default: "" },
    gstin: { type: String, default: "" },
    instagram: { type: String, default: "" },
    birthDate: { type: String, default: "" },
    referrer: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Suspended"], default: "Active" },
    source: { type: String, default: "Manual - WA" },
    flagReason: { type: String, default: "" },
    internalNotes: { type: String, default: "" },
    preferences: {
      preferredSize: { type: String, default: "" },
      preferredOccasions: { type: String, default: "" },
      preferredSilhouettes: { type: String, default: "" },
      newsletter: { type: Boolean, default: false },
      whatsappNotifications: { type: Boolean, default: false },
      marketingOptIn: { type: Boolean, default: false }
    },
    addresses: [addressSchema],
    occasions: [occasionSchema],
    communicationLog: [commLogSchema],
    joinedDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    },
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    lastOrderDate: { type: String, default: "—" },

    // Auth & E-commerce Fields
    passwordHash: { type: String, default: "" },
    googleId: { type: String, default: "" },
    otp: { type: String, default: "" },
    otpExpiresAt: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    phoneVerified: { type: Boolean, default: false },
    phoneVerifiedAt: { type: Date },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpiresAt: { type: Date },
    wishlist: [{ type: String }],
    cart: [{ type: mongoose.Schema.Types.Mixed }]
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Customer", customerSchema);
