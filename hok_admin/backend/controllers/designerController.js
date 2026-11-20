import mongoose from "mongoose";
import Designer from "../models/Designer.js";
import Product from "../models/Product.js";
import { validateDesignerInput } from "../validations/designerValidation.js";

const initialDesigners = [];

const formatDesignerResponse = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  const commTerms = obj.commercialTerms || {};

  return {
    id: obj.designerId || obj._id.toString(),
    _id: obj._id,
    designerId: obj.designerId || obj._id.toString(),
    name: obj.name,
    slug:
      obj.slug || (obj.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    bio: obj.bio || obj.shortBio || "",
    shortBio: obj.shortBio || obj.bio || "",
    type: obj.type || "Indie Designer",
    status: obj.status || "Active",
    joinedAt: obj.joinedAt || new Date().toISOString().split("T")[0],
    joinedDate: obj.joinedAt || new Date().toISOString().split("T")[0],
    isNewToHOK: obj.isNewToHOK || false,
    inNewToHok: obj.isNewToHOK || false,
    isFeatured: obj.isFeatured || false,
    featured: obj.isFeatured || false,
    featuredOrder: obj.featuredOrder || null,
    featuredRank: obj.featuredOrder || null,
    sortOrder: obj.sortOrder || 99,
    livePieces: obj.livePieces || 0,
    activeListingsCount: obj.livePieces || 0,
    totalPieces: obj.totalPieces || 0,
    totalPiecesCount: obj.totalPieces || 0,
    counterfeitRiskTier: obj.counterfeitRiskTier || "Low",
    riskTier: obj.counterfeitRiskTier || "Low",
    authenticationChecklist: obj.authenticationChecklist || "",
    checklist: obj.authenticationChecklist || "",
    websiteUrl: obj.websiteUrl || "",
    brandWebsite: obj.websiteUrl || "",
    instagramHandle: obj.instagramHandle || "",
    brandInstagram: obj.instagramHandle || "",
    commercialTerms: {
      suppliesFreshStockBuyNow: commTerms.suppliesFreshStockBuyNow || false,
      isBuyNewPartner: commTerms.suppliesFreshStockBuyNow || false,
      commissionRateBuyNow: commTerms.commissionRateBuyNow || "",
      commissionPercent: commTerms.commissionRateBuyNow || "",
      paymentTerms: commTerms.paymentTerms || "Standard T+3",
      brandFulfilmentPolicy: commTerms.brandFulfilmentPolicy || "",
      fulfilmentReturnsPolicy: commTerms.brandFulfilmentPolicy || "",
      accountManagerName: commTerms.accountManagerName || "",
      contactEmail: commTerms.contactEmail || "",
      contactPhone: commTerms.contactPhone || "",
      internalNotes: commTerms.internalNotes || "",
    },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const ensureSeedData = async () => {
  try {
    const count = await Designer.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding initial designers data into MongoDB...");
      await Designer.insertMany(initialDesigners);
    }
  } catch (err) {
    console.error("Failed to seed initial designers:", err.message);
  }
};

// GET /api/designers
export const getDesigners = async (req, res) => {
  try {
    const { search, status, type } = req.query || {};
    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (type && type !== "All") {
      query.type = type;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { designerId: regex },
        { slug: regex },
        { bio: regex },
      ];
    }

    const docs = await Designer.find(query).sort({ createdAt: -1 });
    const formattedDocs = docs.map(formatDesignerResponse);

    // Dynamically calculate live and total pieces
    const allProducts = await Product.find({});
    const counts = {};
    allProducts.forEach((p) => {
      const dName = p.designer;
      if (!dName) return;
      if (!counts[dName]) counts[dName] = { live: 0, total: 0 };
      counts[dName].total += 1;
      if (p.status === "Live") {
        counts[dName].live += 1;
      }
    });

    formattedDocs.forEach((d) => {
      const stats = counts[d.name] || { live: 0, total: 0 };
      d.livePieces = stats.live;
      d.activeListingsCount = stats.live;
      d.totalPieces = stats.total;
      d.totalPiecesCount = stats.total;
    });

    return res.json({
      success: true,
      count: formattedDocs.length,
      data: formattedDocs,
    });
  } catch (err) {
    console.error("🔥 Error in getDesigners:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/designers/:id
export const getDesignerById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Designer.findOne({
      $or: [
        { designerId: id },
        { slug: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
      ],
    });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    }

    const formattedDoc = formatDesignerResponse(doc);
    const allProducts = await Product.find({ designer: formattedDoc.name });
    const stats = { live: 0, total: 0 };
    allProducts.forEach((p) => {
      stats.total += 1;
      if (p.status === "Live") stats.live += 1;
    });

    formattedDoc.livePieces = stats.live;
    formattedDoc.activeListingsCount = stats.live;
    formattedDoc.totalPieces = stats.total;
    formattedDoc.totalPiecesCount = stats.total;

    return res.json({
      success: true,
      data: formattedDoc,
    });
  } catch (err) {
    console.error("🔥 Error in getDesignerById:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const extractDesignerFields = (body) => {
  const fields = {};

  if (body.name !== undefined) fields.name = body.name.trim();
  if (body.slug !== undefined) fields.slug = body.slug.trim().toLowerCase();
  if (body.bio !== undefined) fields.bio = body.bio;
  if (body.shortBio !== undefined) fields.shortBio = body.shortBio;
  if (body.type !== undefined) fields.type = body.type;
  if (body.status !== undefined) fields.status = body.status;
  if (body.joinedAt !== undefined) fields.joinedAt = body.joinedAt;
  if (body.isNewToHOK !== undefined) fields.isNewToHOK = body.isNewToHOK;
  if (body.isFeatured !== undefined) fields.isFeatured = body.isFeatured;
  if (body.featuredOrder !== undefined)
    fields.featuredOrder = body.featuredOrder;
  if (body.sortOrder !== undefined) fields.sortOrder = body.sortOrder;

  // Authentication fields
  if (body.counterfeitRiskTier !== undefined || body.riskTier !== undefined) {
    fields.counterfeitRiskTier = body.counterfeitRiskTier || body.riskTier;
  }
  if (
    body.authenticationChecklist !== undefined ||
    body.checklist !== undefined
  ) {
    fields.authenticationChecklist =
      body.authenticationChecklist || body.checklist;
  }
  if (body.websiteUrl !== undefined || body.brandWebsite !== undefined) {
    fields.websiteUrl = body.websiteUrl || body.brandWebsite;
  }
  if (body.instagramHandle !== undefined || body.brandInstagram !== undefined) {
    fields.instagramHandle = body.instagramHandle || body.brandInstagram;
  }

  // Commercial terms
  if (
    body.commercialTerms ||
    body.isBuyNewPartner !== undefined ||
    body.commissionPercent !== undefined ||
    body.accountManagerName !== undefined
  ) {
    const ct = body.commercialTerms || {};
    fields.commercialTerms = {
      suppliesFreshStockBuyNow:
        ct.suppliesFreshStockBuyNow ?? body.isBuyNewPartner ?? false,
      commissionRateBuyNow:
        ct.commissionRateBuyNow || body.commissionPercent || "",
      paymentTerms: ct.paymentTerms || body.paymentTerms || "Standard T+3",
      brandFulfilmentPolicy:
        ct.brandFulfilmentPolicy || body.fulfilmentReturnsPolicy || "",
      accountManagerName:
        ct.accountManagerName || body.accountManagerName || "",
      contactEmail: ct.contactEmail || body.contactEmail || "",
      contactPhone: ct.contactPhone || body.contactPhone || "",
      internalNotes: ct.internalNotes || body.internalNotes || "",
    };
  }

  return fields;
};

// POST /api/designers
export const createDesigner = async (req, res) => {
  try {
    const validation = validateDesignerInput(req.body, false);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validation.errors.join(", ") });
    }

    const fields = extractDesignerFields(req.body);
    const name = fields.name;
    const generatedSlug =
      fields.slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    const designerId =
      req.body.designerId || req.body.id || `DES-${Date.now()}`;

    // Check if designerId or slug already exists
    const existing = await Designer.findOne({
      $or: [{ designerId }, { slug: generatedSlug }],
    });

    if (existing) {
      Object.assign(existing, fields, { slug: generatedSlug });
      const updated = await existing.save();
      return res.json({
        success: true,
        message: "Designer updated successfully",
        data: formatDesignerResponse(updated),
      });
    }

    const newDesigner = await Designer.create({
      designerId,
      ...fields,
      slug: generatedSlug,
    });

    return res.status(201).json({
      success: true,
      message: "Designer created successfully",
      data: formatDesignerResponse(newDesigner),
    });
  } catch (err) {
    console.error("🔥 Error in createDesigner:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/designers/:id
export const updateDesigner = async (req, res) => {
  try {
    const { id } = req.params;

    const validation = validateDesignerInput(req.body, true);
    if (!validation.isValid) {
      return res
        .status(400)
        .json({ success: false, message: validation.errors.join(", ") });
    }

    const doc = await Designer.findOne({
      $or: [
        { designerId: id },
        { slug: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
      ],
    });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    }

    const fields = extractDesignerFields(req.body);
    Object.assign(doc, fields);

    if (fields.name && !fields.slug) {
      doc.slug = String(fields.name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    }

    const updated = await doc.save();

    return res.json({
      success: true,
      message: "Designer updated successfully",
      data: formatDesignerResponse(updated),
    });
  } catch (err) {
    console.error("🔥 Error in updateDesigner:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/designers/:id
export const deleteDesigner = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Designer.findOneAndDelete({
      $or: [
        { designerId: id },
        { slug: id },
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
      ],
    });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    }

    return res.json({
      success: true,
      message: "Designer deleted successfully",
    });
  } catch (err) {
    console.error("🔥 Error in deleteDesigner:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/designers/bulk/reorder-featured
export const reorderFeaturedDesigners = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res
        .status(400)
        .json({ success: false, message: "orderedIds array is required" });
    }

    const promises = orderedIds.map((id, index) => {
      return Designer.findOneAndUpdate(
        {
          $or: [
            { designerId: id },
            { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
          ],
        },
        { featuredOrder: index + 1, isFeatured: true },
      );
    });

    await Promise.all(promises);

    return res.json({
      success: true,
      message: "Featured designers reordered successfully",
    });
  } catch (err) {
    console.error("🔥 Error in reorderFeaturedDesigners:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/designers/bulk/update-type
export const updateDesignerType = async (req, res) => {
  try {
    const { id, type } = req.body;
    if (!id || !type) {
      return res
        .status(400)
        .json({ success: false, message: "id and type are required" });
    }

    const doc = await Designer.findOneAndUpdate(
      {
        $or: [
          { designerId: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        ],
      },
      { type: type },
      { new: true },
    );

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    }

    return res.json({
      success: true,
      message: "Designer type updated successfully",
      data: formatDesignerResponse(doc),
    });
  } catch (err) {
    console.error("🔥 Error in updateDesignerType:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
