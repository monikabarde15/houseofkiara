import PromoCode from "../models/PromoCode.js";

// GET /api/promotions — all promo codes
export const getAllPromoCodes = async (req, res) => {
  try {
    const codes = await PromoCode.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: codes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/promotions/:code — single promo code
export const getPromoCode = async (req, res) => {
  try {
    const code = await PromoCode.findOne({ code: req.params.code.toUpperCase() });
    if (!code) return res.status(404).json({ success: false, message: "Promo code not found" });
    res.json({ success: true, data: code });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/promotions — create promo code
export const createPromoCode = async (req, res) => {
  try {
    const { code, type, value, reason } = req.body;
    if (!code || !type || value === undefined || !reason) {
      return res.status(400).json({ success: false, message: "code, type, value, reason are required" });
    }
    const exists = await PromoCode.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ success: false, message: "Promo code already exists" });

    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const createdBy = req.body.createdBy || "Admin";

    const newCode = new PromoCode({
      ...req.body,
      code: code.toUpperCase(),
      createdBy,
      createdOn: today,
      history: [{ e: "Code created", t: `${today} - ${createdBy}` }],
    });
    await newCode.save();
    res.status(201).json({ success: true, data: newCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/promotions/:code — update promo code
export const updatePromoCode = async (req, res) => {
  try {
    const existing = await PromoCode.findOne({ code: req.params.code.toUpperCase() });
    if (!existing) return res.status(404).json({ success: false, message: "Promo code not found" });

    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const updatedBy = req.body.updatedBy || "Admin";
    const historyEntry = { e: `Updated by ${updatedBy}`, t: `${today} - ${updatedBy}` };

    const updated = await PromoCode.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      {
        $set: { ...req.body, code: req.params.code.toUpperCase() },
        $push: { history: historyEntry },
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/promotions/:code/pause — toggle Active/Paused
export const togglePromoCodeStatus = async (req, res) => {
  try {
    const existing = await PromoCode.findOne({ code: req.params.code.toUpperCase() });
    if (!existing) return res.status(404).json({ success: false, message: "Promo code not found" });

    const newStatus = existing.status === "Active" ? "Paused" : "Active";
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const by = req.body.by || "Admin";

    const updated = await PromoCode.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      {
        $set: { status: newStatus },
        $push: { history: { e: `Status: ${existing.status} → ${newStatus}`, t: `${today} - ${by}` } },
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/promotions/:code — delete promo code
export const deletePromoCode = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const Order = (await import("../models/Order.js")).default;
    const usedOrders = await Order.find({ promoCode: code });
    if (usedOrders.length > 0) {
      return res.status(409).json({ success: false, message: `This promo has been used on ${usedOrders.length} order(s). Pause it instead to preserve order history.` });
    }
    const deleted = await PromoCode.findOneAndDelete({ code });
    if (!deleted) return res.status(404).json({ success: false, message: "Promo code not found" });
    res.json({ success: true, message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
