import mongoose from "mongoose";

const blockedDateSchema = new mongoose.Schema({ from: String, to: String, reason: String }, { _id: false });
const bookingSchema = new mongoose.Schema({ orderId: { type: String, required: true }, customerName: String, date: String, startDate: String, endDate: String, amount: Number, deposit: Number, mode: String, status: String, source: String }, { _id: false });

const productSchema = new mongoose.Schema({
  productId: { type: String, unique: true, required: true }, name: { type: String, required: true, trim: true },
  designer: String, description: String, category: String, occasion: String, material: String, embellishments: String,
  sizes: [String], listingModes: [String], condition: String, availability: String, status: String,
  rentalPrice: Number, securityDeposit: Number, listingPrice: Number, commissionRate: Number,
  minimumDurationDays: Number, extensionWindowDays: Number, cleaningBufferDays: Number, images: [String],
  seoTitle: String, seoDescription: String, urlSlug: String, blockedDates: [blockedDateSchema], bookingHistory: [bookingSchema],
  sku: String, rating: Number, reviewCount: Number, color: String, craft: String, technique: String, threadWork: String,
  setIncludes: String, origin: String, sizeGuide: String, weight: String, deliveryTiming: String, story: String, timesRented: Number,
  tags: [String], relatedProductIds: [String], taxRate: Number, gstRate: Number, cleaningFee: Number, extensionPrice: Number,
  payoutPercentage: Number, payoutTerms: String, externalBookings: [bookingSchema], activityLog: [{ action: String, user: String, createdAt: { type: Date, default: Date.now }, remarks: String }]
}, { timestamps: true, strict: false });

export default mongoose.model("Product", productSchema);
