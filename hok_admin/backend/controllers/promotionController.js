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
    const code = await PromoCode.findOne({
      code: req.params.code.toUpperCase(),
    });
    if (!code)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });
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
      return res
        .status(400)
        .json({
          success: false,
          message: "code, type, value, reason are required",
        });
    }
    const exists = await PromoCode.findOne({ code: code.toUpperCase() });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Promo code already exists" });

    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
    const existing = await PromoCode.findOne({
      code: req.params.code.toUpperCase(),
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });

    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const updatedBy = req.body.updatedBy || "Admin";
    const historyEntry = {
      e: `Updated by ${updatedBy}`,
      t: `${today} - ${updatedBy}`,
    };

    const updated = await PromoCode.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      {
        $set: { ...req.body, code: req.params.code.toUpperCase() },
        $push: { history: historyEntry },
      },
      { new: true },
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/promotions/:code/pause — toggle Active/Paused
export const togglePromoCodeStatus = async (req, res) => {
  try {
    const existing = await PromoCode.findOne({
      code: req.params.code.toUpperCase(),
    });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });

    const newStatus = existing.status === "Active" ? "Paused" : "Active";
    const today = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const by = req.body.by || "Admin";

    const updated = await PromoCode.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      {
        $set: { status: newStatus },
        $push: {
          history: {
            e: `Status: ${existing.status} → ${newStatus}`,
            t: `${today} - ${by}`,
          },
        },
      },
      { new: true },
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
      return res
        .status(409)
        .json({
          success: false,
          message: `This promo has been used on ${usedOrders.length} order(s). Pause it instead to preserve order history.`,
        });
    }
    const deleted = await PromoCode.findOneAndDelete({ code });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });
    res.json({ success: true, message: "Promo code deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const refusedAttempts = [
  { code: "KAIRA20", count: 3, lastAttempt: new Date().toISOString() }
];

export const logAttempt = async (req, res) => {
  try {
    const rawCode = (req.body?.code || "").trim().toUpperCase();
    if (rawCode) {
      const existing = refusedAttempts.find((a) => a.code === rawCode);
      if (existing) {
        existing.count += 1;
        existing.lastAttempt = new Date().toISOString();
      } else {
        refusedAttempts.push({
          code: rawCode,
          count: 1,
          lastAttempt: new Date().toISOString(),
        });
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRefusedAttempts = async (req, res) => {
  res.json({ success: true, data: refusedAttempts });
};

// POST /api/promotions/validate — validate all promo rules for cart/checkout
export const validatePromoCodeForCheckout = async (req, res) => {
  try {
    const rawCode = String(req.body?.code || "").trim().toUpperCase();
    if (!rawCode) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a promo code." });
    }

    const promo = await PromoCode.findOne({ code: rawCode });
    if (!promo) {
      return res
        .status(404)
        .json({ success: false, message: "This code is not valid." });
    }

    if (String(promo.status || "Active") !== "Active") {
      return res
        .status(400)
        .json({ success: false, message: "This promo code is currently paused." });
    }

    // 1. Date range check (YYYY-MM-DD)
    const now = new Date();
    const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const validFrom = promo.validFrom ? String(promo.validFrom).slice(0, 10) : "";
    const validUntil = promo.validUntil ? String(promo.validUntil).slice(0, 10) : "";
    if (validFrom && todayYmd < validFrom) {
      return res.status(400).json({
        success: false,
        message: `This code is not active yet (valid from ${validFrom}).`,
      });
    }
    if (validUntil && todayYmd > validUntil) {
      return res.status(400).json({
        success: false,
        message: "This promo code has expired.",
      });
    }

    // 2. Private audience / customer assignment check
    const customerEmail = String(req.body?.customerEmail || "").toLowerCase().trim();
    const customerId = String(req.body?.customerId || "").toLowerCase().trim();
    const customerPhoneDigits = String(req.body?.customerPhone || "").replace(/\D/g, "");
    const assignedList = Array.isArray(promo.customerIds) ? promo.customerIds : [];

    if (promo.audience === "private" || assignedList.length > 0) {
      if (!customerEmail && !customerId && !customerPhoneDigits) {
        return res.status(401).json({
          success: false,
          message: "Please sign in to apply this private promo code.",
        });
      }
      const allowed = assignedList.some((cid) => {
        const c = String(cid).toLowerCase().trim();
        const cDigits = String(cid).replace(/\D/g, "");
        return (
          (customerEmail && c === customerEmail) ||
          (customerId && c === customerId) ||
          (customerPhoneDigits &&
            cDigits &&
            cDigits.endsWith(customerPhoneDigits.slice(-10)))
        );
      });
      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "This code is linked to a different account.",
        });
      }
    }

    // 3. Usage caps & First Order Only check against live Orders
    const Order = (await import("../models/Order.js")).default;
    const allOrders = await Order.find({}).catch(() => []);
    const activeOrders = (Array.isArray(allOrders) ? allOrders : []).filter(
      (o) => String(o.status || "").toLowerCase() !== "cancelled",
    );

    if (promo.usesTotalCap && Number(promo.usesTotalCap) > 0) {
      const totalUses = activeOrders.filter(
        (o) => String(o.promoCode || "").trim().toUpperCase() === rawCode,
      ).length;
      if (totalUses >= Number(promo.usesTotalCap)) {
        return res.status(400).json({
          success: false,
          message: "This promo code has reached its total usage limit.",
        });
      }
    }

    const customerOrders = activeOrders.filter((o) => {
      const oEmail = String(o.customerEmail || "").toLowerCase().trim();
      const oCustId = String(o.customerId || "").toLowerCase().trim();
      const oPhone = String(o.customerPhone || "").replace(/\D/g, "");
      return (
        (customerEmail && oEmail && oEmail === customerEmail) ||
        (customerId && oCustId && oCustId === customerId) ||
        (customerPhoneDigits &&
          oPhone &&
          oPhone.endsWith(customerPhoneDigits.slice(-10)))
      );
    });

    if (promo.firstOrderOnly && customerOrders.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This code is valid on your first order only.",
      });
    }

    if (promo.usesPerCustomer && Number(promo.usesPerCustomer) > 0) {
      const custUses = customerOrders.filter(
        (o) => String(o.promoCode || "").trim().toUpperCase() === rawCode,
      ).length;
      if (custUses >= Number(promo.usesPerCustomer)) {
        return res.status(400).json({
          success: false,
          message:
            "You have already used this promo code the maximum number of times.",
        });
      }
    }

    // 4. Applicable modes & product scope check
    const normMode = (m) => {
      const s = String(m || "").toLowerCase().replace(/[\s_-]+/g, "");
      if (s === "rent" || s === "rental") return "rental";
      if (s === "preloved") return "preloved";
      if (s === "new" || s === "buy" || s === "buynew") return "buynew";
      return s;
    };

    const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
    let eligibleItems = rawItems;

    const allowedModes = Array.isArray(promo.modes)
      ? promo.modes.map(normMode).filter(Boolean)
      : [];
    if (allowedModes.length > 0 && rawItems.length > 0) {
      eligibleItems = eligibleItems.filter((it) =>
        allowedModes.includes(normMode(it.type || it.mode)),
      );
      if (eligibleItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "This code is not valid for the selected order mode.",
        });
      }
    }

    const scope = promo.scope || {};
    const scopeCats = Array.isArray(scope.categories)
      ? scope.categories.map((c) => String(c).toLowerCase().trim()).filter(Boolean)
      : [];
    const scopeDesigners = Array.isArray(scope.designerIds)
      ? scope.designerIds.map((d) => String(d).toLowerCase().trim()).filter(Boolean)
      : [];
    const scopeSkus = Array.isArray(scope.skus)
      ? scope.skus.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
      : [];

    if (
      rawItems.length > 0 &&
      (scopeCats.length > 0 || scopeDesigners.length > 0 || scopeSkus.length > 0)
    ) {
      eligibleItems = eligibleItems.filter((it) => {
        const cat = String(it.category || it.product?.category || "").toLowerCase().trim();
        const des = String(it.designer || it.product?.designer || "").toLowerCase().trim();
        const pid = String(it.productId || it.sku || it.id || it.product?.productId || it.product?.sku || "").toLowerCase().trim();
        return (
          (scopeCats.length > 0 && scopeCats.includes(cat)) ||
          (scopeDesigners.length > 0 && scopeDesigners.includes(des)) ||
          (scopeSkus.length > 0 && scopeSkus.includes(pid))
        );
      });
      if (eligibleItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "This code is not valid for the items in your cart.",
        });
      }
    }

    // 5. Minimum order check (merchandise subtotal before GST & deposit)
    const numSubtotal = Number(req.body?.subtotal) || 0;
    const minReq = Number(promo.minOrder) || 0;
    if (minReq > 0 && numSubtotal > 0 && numSubtotal < minReq) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₹${minReq.toLocaleString("en-IN")} required for ${promo.code}.`,
      });
    }

    // 6. Compute discount preview
    let discountAmount = 0;
    if (promo.type === "percent" || promo.type === "percentage") {
      discountAmount = Math.round((numSubtotal * Number(promo.value || 0)) / 100);
      if (promo.maxDiscount && Number(promo.maxDiscount) > 0) {
        discountAmount = Math.min(discountAmount, Number(promo.maxDiscount));
      }
    } else if (promo.type === "flat") {
      discountAmount = Math.min(Number(promo.value || 0), numSubtotal || Number(promo.value || 0));
    }

    return res.json({
      success: true,
      data: promo,
      discountAmount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
