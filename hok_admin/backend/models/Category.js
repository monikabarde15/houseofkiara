import mongoose from "../db/postgresAdapter.js";

const categorySchema = new mongoose.Schema({
  categoryId: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" }
}, { timestamps: true, strict: false });

export default mongoose.model("Category", categorySchema);
