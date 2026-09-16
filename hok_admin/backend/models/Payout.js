import mongoose from "../db/postgresAdapter.js";

const payoutSchema = new mongoose.Schema({
  payoutId: { type: String, unique: true, required: true },
  productId: String, customerId: String, offerId: String, promoCode: String,
  listerId: { type: String, required: true }, listerName: { type: String, required: true },
  orderId: { type: String, required: true }, productName: String, mode: String,
  transactionAmount: { type: Number, min: 0 }, payoutPercentage: { type: Number, min: 0, max: 100, default: 80 }, listerShare: { type: Number, required: true, min: 0 }, hokCommission: { type: Number, default: 0, min: 0 }, taxDeduction: { type: Number, default: 0, min: 0 }, netPayout: { type: Number, min: 0 },
  dueDate: { type: Date, required: true }, status: { type: String, enum: ["Pending", "Paid", "Failed", "Reversed"], default: "Pending" },
  paidAt: Date, paidBy: String, paymentReference: String, notes: String
}, { timestamps: true, strict: false });
payoutSchema.index({ listerId: 1, status: 1 });
payoutSchema.index({ orderId: 1 }, { unique: true });
export default mongoose.model("Payout", payoutSchema);
