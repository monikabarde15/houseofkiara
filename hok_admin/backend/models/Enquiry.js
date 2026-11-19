import mongoose from "../db/postgresAdapter.js";

const enquiryPieceSchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    designer: String,
    image: String,
    rentalPrice: Number,
    perDayRate: Number,
    securityDeposit: Number,
    listingPrice: Number,
  },
  { _id: false },
);

const conversationLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    author: { type: String, default: "Soumya" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const enquirySchema = new mongoose.Schema(
  {
    enquiryId: { type: String, required: true, unique: true, trim: true },
    customerId: String,
    isOnFile: { type: Boolean, default: false },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, lowercase: true, trim: true },
    customerPhone: String,
    customerCity: String,
    channel: { type: String, default: "WhatsApp" },
    interestedIn: {
      type: String,
      default: "Rent", // "Rent" | "Buy preloved" | "Buy new" | "General"
    },
    assignedTo: { type: String, default: "Soumya" },
    pieces: [enquiryPieceSchema],
    eventDate: String,
    holdStartDate: String,
    holdEndDate: String,
    followUpDate: String,
    whatSheAsked: String,
    status: {
      type: String,
      default: "New", // "New" | "In Conversation" | "On Hold" | "Converted" | "Closed"
    },
    linkedOrderId: String,
    linkedOfferId: String,
    firstReplyAt: Date,
    conversationLog: [conversationLogSchema],
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("Enquiry", enquirySchema);
