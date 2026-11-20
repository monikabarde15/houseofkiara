import Product from "../models/Product.js";
import Designer from "../models/Designer.js";
import mongoose from "mongoose";
import { pool } from "../config/db.js";
import { validateProduct } from "../validations/productValidation.js";

// Ensure products.category supports long comma-separated multi-category strings
pool
  .query("ALTER TABLE products ALTER COLUMN category TYPE TEXT")
  .catch(() => {});
pool
  .query(
    "UPDATE products SET data = data - '_data' - '_model' - '_isNew' WHERE data ? '_data' OR data ? '_model' OR data ? '_isNew'",
  )
  .catch(() => {});

const assertDesignerExistsInRegistry = async (designerName) => {
  const trimmed = String(designerName || "").trim();
  if (!trimmed) return { valid: true, canonicalName: "" };
  const activeDesigners = await Designer.find({
    status: { $nin: ["Suspended", "Inactive"] },
  }).catch(() => []);
  const validList = (activeDesigners || []).filter(
    (d) => d && d.name && String(d.name).trim() !== "",
  );
  if (validList.length === 0) {
    return { valid: true, canonicalName: trimmed };
  }
  const matched = validList.find(
    (d) => String(d.name).trim().toLowerCase() === trimmed.toLowerCase(),
  );
  if (!matched) {
    return {
      valid: false,
      message: `Designer "${trimmed}" is not registered in the Designers table. Please select an existing designer from Designers first.`,
    };
  }
  return { valid: true, canonicalName: String(matched.name).trim() };
};

const normalize = (p) => {
  const obj = p.toObject();
  delete obj._data;
  delete obj._model;
  delete obj._isNew;
  return { ...obj, id: p.productId };
};

// ✅ FIXED: Sirf EK baar define kiya gaya hai
const productFilter = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  return { $or: [{ productId: id }, { sku: id }] };
};

export const getProducts = async (req, res) => {
  try {
    const q = req.query || {};
    const filter = q.productId ? { productId: q.productId } : {};
    const rows = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: rows.map(normalize) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    // ✅ CLEAN LOGIC: Filter apply karo
    const p = await Product.findOne(productFilter(id));

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Overdue pieces (Dispatched, past end date, not returned) stay blocked until today.
    // Sent as a separate read-only field so it is never saved into blockedDates.
    const out = normalize(p);
    try {
      const Order = (await import("../models/Order.js")).default;
      const orders = await Order.find({});
      const keys = [p.productId, String(p._id), p.sku].filter(Boolean).map(String);
      const todayStr = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });
      const overdue = [];
      (orders || []).forEach((o) => {
        const st = String(o.status || "").toLowerCase();
        if (["cancelled", "rejected", "returned", "completed", "refunded"].includes(st)) return;
        const its = Array.isArray(o.items) && o.items.length ? o.items : [o];
        its.forEach((it) => {
          const pid = String(it.productId || o.productId || "");
          const isRental =
            String(it.mode || o.mode || "").toLowerCase() === "rental";
          const start = String(it.rentalStartDate || o.rentalStartDate || "").slice(0, 10);
          const end = String(it.rentalEndDate || o.rentalEndDate || "").slice(0, 10);
          if (!keys.includes(pid) || !isRental || !end) return;
          // Live booking from orders (so web calendar blocks it even if blockedDates is missing)
          overdue.push({
            from: start || end,
            to: end,
            reason: `Booked (Order ${o.orderId})`,
          });
          // Overdue: dispatched, past end date, not returned -> blocked until today
          if (
            st === "dispatched" &&
            !o.returnedAt &&
            !o.conditionAssessment?.receivedDate &&
            end < todayStr
          ) {
            overdue.push({
              from: end,
              to: todayStr,
              reason: `Overdue return (Order ${o.orderId})`,
            });
          }
        });
      });
      out.overdueBlockedDates = overdue;
    } catch (err) {
      out.overdueBlockedDates = [];
    }

    res.json({ success: true, data: out });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getProductActivity = async (req, res) => {
  try {
    const id = req.params.id;
    const p = await Product.findOne(productFilter(id));
    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p.activityLog || [] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ CLEAN PAYLOAD HELPER (Extra MongoDB & transient UI fields hatao)
const cleanPayload = (body) => {
  const clean = { ...body };
  const forbidden = [
    "id",
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "rentalStatus",
    "rentStatus",
    "currentRenterName",
    "currentOrderId",
    "rentUntil",
    "nextFreeDate",
    "earnedAmount",
    "listerName",
  ];
  forbidden.forEach((f) => delete clean[f]);
  return clean;
};

export const createProduct = async (req, res) => {
  try {
    // ✅ FIX: Payload clean karo
    const cleanBody = cleanPayload(req.body);
    delete cleanBody.overdueBlockedDates;

    const { error, value } = validateProduct(cleanBody);
    if (error) {
      return res.status(422).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const designerCheck = await assertDesignerExistsInRegistry(value.designer);
    if (!designerCheck.valid) {
      return res.status(422).json({
        success: false,
        message: designerCheck.message,
      });
    }
    if (designerCheck.canonicalName) {
      value.designer = designerCheck.canonicalName;
    }

    // Ensure productId and non-null listerId are set
    if (!value.productId) {
      value.productId = `HOK-PRD-${Date.now()}`;
    }
    if (!value.listerId || !String(value.listerId).trim()) {
      value.listerId = "LST-GENERAL";
    }

    const p = await Product.create(value);
    global.__webProductsCache = null; global.__webFiltersCache = null;
    res.status(201).json({ success: true, data: normalize(p) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findOne(productFilter(req.params.id));
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // ✅ FIX: Payload clean karo (Extra fields hatao)
    const cleanBody = cleanPayload(req.body);
    delete cleanBody.overdueBlockedDates;

    // Merge existing with new data
    const updatedData = {
      ...existing.toObject(),
      ...cleanBody,
      productId: existing.productId,
      // Ensure arrays are handled properly
      listingModes: cleanBody.listingModes ||
        existing.listingModes || ["RENTAL"],
      tags: cleanBody.tags || existing.tags || [],
      images: cleanBody.images || existing.images || [],
      sizes: cleanBody.sizes || existing.sizes || [],
      measurements: cleanBody.measurements || existing.measurements || {},
      measurementsCm: cleanBody.measurementsCm || existing.measurementsCm || {},
      blockedDates: cleanBody.blockedDates || existing.blockedDates || [],
      bookingHistory: cleanBody.bookingHistory || existing.bookingHistory || [],
      externalBookings:
        cleanBody.externalBookings || existing.externalBookings || [],
      activityLog: cleanBody.activityLog || existing.activityLog || [],
      relatedProductIds:
        cleanBody.relatedProductIds || existing.relatedProductIds || [],
      timesRented:
        cleanBody.timesRented !== undefined
          ? cleanBody.timesRented
          : existing.timesRented || 0,
      rating:
        cleanBody.rating !== undefined ? cleanBody.rating : existing.rating,
      reviewCount:
        cleanBody.reviewCount !== undefined
          ? cleanBody.reviewCount
          : existing.reviewCount || 0,
    };

    const { error, value } = validateProduct(updatedData);
    if (error) {
      return res.status(422).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    if (cleanBody.designer !== undefined) {
      const designerCheck = await assertDesignerExistsInRegistry(value.designer);
      if (!designerCheck.valid) {
        return res.status(422).json({
          success: false,
          message: designerCheck.message,
        });
      }
      if (designerCheck.canonicalName) {
        value.designer = designerCheck.canonicalName;
      }
    }

    if (!value.listerId || !String(value.listerId).trim()) {
      value.listerId = existing.listerId || "LST-GENERAL";
    }

    const p = await Product.findByIdAndUpdate(existing._id, value, {
      new: true,
      runValidators: true,
    });
    global.__webProductsCache = null; global.__webFiltersCache = null;

    res.json({ success: true, data: normalize(p) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findOneAndDelete(productFilter(req.params.id));
    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    global.__webProductsCache = null; global.__webFiltersCache = null;
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const archiveProduct = async (req, res) => {
  try {
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      {
        status: "Archived",
        $push: {
          activityLog: {
            action: "Product archived",
            user: req.body.user || "Admin",
            remarks: req.body.remarks || "",
          },
        },
      },
      { new: true },
    );
    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    global.__webProductsCache = null; global.__webFiltersCache = null;
    res.json({ success: true, data: normalize(p) });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const restoreProduct = async (req, res) => {
  try {
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      {
        status: "Review",
        $push: {
          activityLog: {
            action: "Product restored for review",
            user: req.body.user || "Admin",
            remarks: req.body.remarks || "",
          },
        },
      },
      { new: true },
    );
    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: normalize(p) });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const updateProductImages = async (req, res) => {
  try {
    if (!Array.isArray(req.body.images)) {
      return res
        .status(422)
        .json({ success: false, message: "images must be an array" });
    }

    const images = req.body.images.filter(
      (x) => typeof x === "string" && x.trim(),
    );
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      {
        images,
        $push: {
          activityLog: {
            action: "Product images updated",
            user: req.body.user || "Admin",
          },
        },
      },
      { new: true },
    );

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p.images });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

// NEW: Increment timesRented counter
export const incrementTimesRented = async (req, res) => {
  try {
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      {
        $inc: { timesRented: 1 },
        $push: {
          activityLog: {
            action: "Times rented incremented",
            user: req.body.user || "System",
            remarks: req.body.remarks || "New rental booking",
          },
        },
      },
      { new: true },
    );

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: { timesRented: p.timesRented } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// NEW: Update listing modes
export const updateListingModes = async (req, res) => {
  try {
    const { listingModes } = req.body;
    if (!Array.isArray(listingModes)) {
      return res
        .status(422)
        .json({ success: false, message: "listingModes must be an array" });
    }

    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      {
        listingModes,
        $push: {
          activityLog: {
            action: "Listing modes updated",
            user: req.body.user || "Admin",
            remarks: `Updated to: ${listingModes.join(", ")}`,
          },
        },
      },
      { new: true },
    );

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: { listingModes: p.listingModes } });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const updateMeasurements = async (req, res) => {
  try {
    const { measurements, measurementsCm, bestSuitedForHeight } = req.body;
    const updateData = {}; // 👈 'any' HATAO

    if (measurements) updateData.measurements = measurements;
    if (measurementsCm) updateData.measurementsCm = measurementsCm;
    if (bestSuitedForHeight !== undefined)
      updateData.bestSuitedForHeight = bestSuitedForHeight;

    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      {
        ...updateData,
        $push: {
          activityLog: {
            action: "Measurements updated",
            user: req.body.user || "Admin",
          },
        },
      },
      { new: true },
    );

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({
      success: true,
      data: {
        measurements: p.measurements,
        measurementsCm: p.measurementsCm,
        bestSuitedForHeight: p.bestSuitedForHeight,
      },
    });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};
