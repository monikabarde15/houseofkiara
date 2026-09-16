import mongoose from "../db/postgresAdapter.js";

/* ===========================
   Notes Schema
=========================== */

const noteSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      default: "Admin",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ===========================
   Counter Offer Schema
=========================== */

const counterOfferSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    message: String,

    sentBy: {
      type: String,
      default: "Admin",
    },

    expiryDate: Date,

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ===========================
   Timeline Schema
=========================== */

const timelineSchema = new mongoose.Schema(
  {
    action: String,

    remarks: String,

    user: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ===========================
   Assignment History
=========================== */

const assignmentHistorySchema = new mongoose.Schema(
  {
    assignedTo: String,

    assignedBy: String,

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    remarks: String,
  },
  { _id: false }
);

/* ===========================
   Offer Schema
=========================== */

const offerSchema = new mongoose.Schema(
  {
    offerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    enquiryId: String,

    productId: String,

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: String,

    category: String,

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    customerPhone: String,

    customerCity: String,

    customerState: String,
    
    channel: {
      type: String,
      default: "Website",
    },

    // Filled when an offer is used to create a booking so customer history
    // can retrieve it directly and reliably.
    customerId: String,
    linkedOrderId: String,

    quantity: {
      type: Number,
      default: 1,
    },

    currency: {
      type: String,
      default: "INR",
    },

    originalAmount: {
      type: Number,
      default: 0,
    },

    offeredAmount: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Rejected",
        "Counter Offered",
        "Expired",
        "Assigned",
        "Completed",
      ],
      default: "Pending",
    },

    negotiationStatus: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
      ],
      default: "Not Started",
    },

    assignedTo: String,

    assignedBy: String,

    assignedAt: Date,

    assignmentHistory: [assignmentHistorySchema],

    expiresAt: Date,

    whatsappSent: {
      type: Boolean,
      default: false,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    notes: [noteSchema],

    counterOffers: [counterOfferSchema],

    timeline: [timelineSchema],

    createdBy: String,

    updatedBy: String,

    deletedBy: String,

    deletedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Offer", offerSchema);
