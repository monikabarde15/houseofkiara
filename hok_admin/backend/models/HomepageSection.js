import mongoose from "../db/postgresAdapter.js";

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionId: { type: String, unique: true, required: true },
    isVisible: { type: Boolean, default: true },
    orderIndex: { type: Number, default: 1 },
    data: { type: Object, default: {} },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model("HomepageSection", homepageSectionSchema);
