import mongoose from "../db/postgresAdapter.js";

const wordingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    subject: String,
    previewLine: String,
    email: String,
    whatsapp: String,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: String, required: true, unique: true }, // e.g. msg_1 or uuid
    name: { type: String, required: true },
    wordingCount: { type: Number, default: 1 },
    isYours: { type: Boolean, default: true },
    trigger: { type: String, default: "" },
    subject: { type: String, default: "" },
    audience: {
      type: String,
      enum: ["Customer", "Lister", "Designer", "You"],
      default: "Customer",
    },
    class: {
      type: String,
      enum: ["Required", "Optional", "Marketing"],
      default: "Required",
    },
    channels: {
      type: [String],
      default: ["email"],
    },
    status: {
      type: String,
      enum: ["Live", "Paused", "Not written"],
      default: "Not written",
    },
    lastEdited: { type: String, default: "" },
    editor: { type: String, default: "Admin" },
    sentCount: { type: Number, default: 0 },
    wordings: [wordingSchema],
  },
  { timestamps: true }
);

messageSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret.messageId || ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Message", messageSchema);
