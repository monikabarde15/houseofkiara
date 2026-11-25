import mongoose from "../db/postgresAdapter.js";

const teamHistorySchema = new mongoose.Schema(
  {
    entryId: { type: String, required: true, unique: true, trim: true },
    kind: { type: String, enum: ["people", "roles"], required: true },
    who: { type: String, required: true },
    target: { type: String, default: "" },
    message: { type: String, required: true },
    occurredAt: { type: String, required: true },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("TeamHistory", teamHistorySchema);
