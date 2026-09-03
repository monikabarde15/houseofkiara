import mongoose from "../db/postgresAdapter.js";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, default: "Just now" },
    date: { type: String, default: "" },
    category: {
      type: String,
      enum: ["System", "Order", "Lister", "Customer", "Security", "WhatsApp"],
      default: "System",
    },
    channel: {
      type: String,
      enum: ["Email", "WhatsApp", "System", "KYC", "Dashboard"],
      default: "System",
    },
    unread: { type: Boolean, default: true },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    actionText: { type: String, default: "" },
    actionUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

notificationSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret.notificationId || ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Notification", notificationSchema);
