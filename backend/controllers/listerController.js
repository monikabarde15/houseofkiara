import mongoose from "mongoose";
import Lister from "../models/Lister.js";
import { validateListerInput } from "../validations/listerValidation.js";

const view = (x) => {
  if (!x) return null;
  const obj = x.toObject ? x.toObject() : x;
  const mongoId = obj._id ? obj._id.toString() : obj.id;
  return {
    ...obj,
    _id: mongoId,
    id: mongoId,
    listerId: obj.listerId && obj.listerId !== "new" ? obj.listerId : mongoId,
  };
};

const buildIdQuery = (id) => {
  const conditions = [{ listerId: id }, { id: id }];
  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.push({ _id: id });
  }
  return { $or: conditions };
};

export const getListers = async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      q.$or = [{ name: regex }, { email: regex }, { phone: regex }, { city: regex }];
    }
    const rows = await Lister.find(q).sort({ createdAt: -1 });
    res.json({ success: true, data: rows.map(view) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getLister = async (req, res) => {
  try {
    const x = await Lister.findOne(buildIdQuery(req.params.id));
    if (!x) return res.status(404).json({ success: false, message: "Lister not found" });
    res.json({ success: true, data: view(x) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const createLister = async (req, res) => {
  try {
    const validation = validateListerInput(req.body, false);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: validation.errors.join(" / "),
        errors: validation.errors,
      });
    }

    const name = req.body.name.trim();
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    let listerId = (req.body.listerId && req.body.listerId !== "new") ? req.body.listerId : (baseSlug || `lister-${Date.now()}`);
    
    // Check if listerId exists
    const existing = await Lister.findOne({ listerId });
    if (existing) {
      listerId = `${listerId}-${Date.now().toString().slice(-4)}`;
    }

    const initials = name
      .split(" ")
      .filter(Boolean)
      .map(w => w[0].toUpperCase())
      .join("")
      .slice(0, 2) || "NL";

    const payload = {
      ...req.body,
      listerId,
      name,
      initials,
      joined: req.body.joined || new Date().toISOString(),
      status: req.body.status || "Verified",
      verified: true
    };
    // Don't pass string "new" as _id or id
    delete payload._id;
    if (payload.id === "new") delete payload.id;

    const x = await Lister.create(payload);
    res.status(201).json({ success: true, data: view(x) });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const updateLister = async (req, res) => {
  try {
    const validation = validateListerInput(req.body, true);
    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        message: validation.errors.join(" / "),
        errors: validation.errors,
      });
    }

    const x = await Lister.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { $set: req.body },
      { new: true, runValidators: false }
    );
    if (!x) return res.status(404).json({ success: false, message: "Lister not found" });
    res.json({ success: true, data: view(x) });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const deleteLister = async (req, res) => {
  try {
    const x = await Lister.findOneAndDelete(buildIdQuery(req.params.id));
    if (!x) return res.status(404).json({ success: false, message: "Lister not found in database" });
    res.json({ success: true, message: "Lister deleted successfully from database" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const { accountHolder, accountNumber, ifsc, bankName } = req.body;
    const x = await Lister.findOneAndUpdate(
      buildIdQuery(req.params.id),
      { bankDetails: { accountHolder, accountNumber, ifsc: (ifsc || "").toUpperCase(), bankName } },
      { new: true }
    );
    if (!x) return res.status(404).json({ success: false, message: "Lister not found" });
    res.json({ success: true, data: view(x) });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};
