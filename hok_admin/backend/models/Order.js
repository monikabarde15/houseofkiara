import mongoose from "../db/postgresAdapter.js";

const itemSchema = new mongoose.Schema({
  productId: String, productName: { type: String, required: true }, designer: String, mode: { type: String, enum: ["Rental", "Preloved", "Buy", "Multi-item"] }, size: String,
  rentalStartDate: String, rentalEndDate: String, dispatchDate: String, returnDueDate: String, amount: Number, deposit: Number, gst: Number, quantity: { type: Number, default: 1 }, status: String,
  preDispatch: { documented: Boolean, documentedBy: String, photos: [String], videoUrl: String }, dispatch: { date: String, courierPartner: String, trackingNumber: String, deliveryAddress: String, status: String },
  returnCondition: { receivedDate: String, dueDate: String, grade: { type: String, enum: ["A", "B", "C", "D"] }, assessedBy: String, notes: String, photos: [String], videoUrl: String },
  depositDecision: { status: { type: String, enum: ["Pending", "Released", "Partial", "Forfeited"] }, totalDeposit: Number, deductedAmount: Number, releasedAmount: Number, reason: String, releaseNote: String, processedAt: Date }
}, { _id: false });

const logSchema = new mongoose.Schema({ message: String, type: String, user: String, createdAt: { type: Date, default: Date.now } }, { _id: false });
const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true }, customerId: String, customerName: String, customerEmail: String, customerPhone: String, customerCity: String, customerState: String, gstin: String, address: String,
  items: [itemSchema], mode: String, status: { type: String, enum: ["Confirmed", "Packed", "Dispatched", "Shipped", "Delivered", "Return Due", "Return Sent", "Returned", "Complete", "Partially Returned", "Processing"], default: "Confirmed" },
  orderValue: Number, depositHeld: Number, depositStatus: { type: String, enum: ["Pending", "Released", "Partially Released", "Forfeited"], default: "Pending" }, grandTotal: Number, discount: Number, gst: Number, listerPayout: Number, payoutStatus: { type: String, enum: ["Pending Approval", "Approved", "Paid"], default: "Pending Approval" }, invoiceNo: String, invoiceDate: String,
  logs: [logSchema], internalNotes: String
}, { timestamps: true, strict: false });
export default mongoose.model("Order", orderSchema);
