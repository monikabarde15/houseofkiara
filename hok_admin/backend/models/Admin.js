import mongoose from "../db/postgresAdapter.js";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    sessionToken: String,
    roleId: { type: String, default: "founder" },
    personId: String,
    status: { type: String, default: "Active" },
  },
  { timestamps: true },
);

export default mongoose.model("Admin", adminSchema);
