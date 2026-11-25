import mongoose from "../db/postgresAdapter.js";

const teamRoleSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    colour: { type: String, default: "#8A7E72" },
    isFixed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    levels: { type: mongoose.Schema.Types.Mixed, default: {} },
    decisions: { type: [String], default: [] },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("TeamRole", teamRoleSchema);
