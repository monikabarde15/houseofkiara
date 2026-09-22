import mongoose from "../db/postgresAdapter.js";

const submissionSchema = new mongoose.Schema(
  {
    subid: { type: String, unique: true, required: true },
    listerId: { type: String, required: true },
    queueRow: { type: Number, default: null },
    piece: { type: String, required: true },
    designer: { type: String, required: true },
    category: { type: String, required: true },
    submitted: { type: String, required: true },
    channel: { type: String, required: true },
    intent: { type: String, required: true },
    askRent: { type: String, default: null },
    askSell: { type: String, default: null },
    conditionClaim: { type: String },
    timesWorn: { type: String },
    yearOfPurchase: { type: String },
    originalPrice: { type: String },
    colour: { type: String },
    size: { type: String },
    photos: { type: Number, default: 0 },
    videos: { type: Number, default: 0 },
    media: [mongoose.Schema.Types.Mixed],
    notes: { type: String, default: null },
    sku: { type: String, default: null },
    decision: mongoose.Schema.Types.Mixed,
    moreInfo: mongoose.Schema.Types.Mixed,
    assignedTo: { type: String, default: 'Unassigned' },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Submission", submissionSchema);
