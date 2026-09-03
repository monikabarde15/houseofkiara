import mongoose from "../db/postgresAdapter.js";

const promoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ["percent", "flat", "freedel"], required: true },
    value: { type: Number, required: true },
    maxDiscount: { type: Number, default: null },
    minOrder: { type: Number, default: null },
    modes: { type: Array, default: [] },
    scope: { type: Object, default: { categories: [], designerIds: [], skus: [] } },
    stacksWith: { type: Array, default: [] },
    audience: { type: String, enum: ["public", "private"], default: "public" },
    customerIds: { type: Array, default: [] },
    firstOrderOnly: { type: Boolean, default: false },
    usesTotalCap: { type: Number, default: null },
    usesPerCustomer: { type: Number, default: null },
    validFrom: { type: String, default: null },
    validUntil: { type: String, default: null },
    status: { type: String, enum: ["Active", "Paused"], default: "Active" },
    visibility: { type: String, enum: ["share", "drawer"], default: "share" },
    publicDesc: { type: String, default: "" },
    reason: { type: String, required: true },
    notes: { type: String, default: "" },
    createdBy: { type: String, default: "Admin" },
    createdOn: { type: String, default: "" },
    history: { type: Array, default: [] },
    attnSnooze: { type: Object, default: {} },
    supersedes: { type: String, default: null },
    supersededBy: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("PromoCode", promoCodeSchema);
