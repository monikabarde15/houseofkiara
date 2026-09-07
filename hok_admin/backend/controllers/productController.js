import Product from "../models/Product.js";
import mongoose from "mongoose";
import { validateProduct } from "../validations/productValidation.js";

const normalize = (p) => ({ ...p.toObject(), id: p.productId });

// ✅ FIXED: Sirf EK baar define kiya gaya hai
const productFilter = (id) => {
  // Agar valid MongoDB ObjectId hai, toh _id se dhoondho
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }
  // Warna productId se dhoondho
  return { productId: id };
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
    
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: normalize(p) });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getProductActivity = async (req, res) => {
  try {
    const id = req.params.id;
    const p = await Product.findOne(productFilter(id));
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p.activityLog || [] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ CLEAN PAYLOAD HELPER (Extra MongoDB & transient UI fields hatao)
const cleanPayload = (body) => {
  const clean = { ...body };
  const forbidden = [
    'id', '_id', '__v', 'createdAt', 'updatedAt',
    'rentalStatus', 'rentStatus', 'currentRenterName',
    'currentOrderId', 'rentUntil', 'nextFreeDate',
    'earnedAmount', 'listerName'
  ];
  forbidden.forEach(f => delete clean[f]);
  return clean;
};

export const createProduct = async (req, res) => { 
  try { 
    // ✅ FIX: Payload clean karo
    const cleanBody = cleanPayload(req.body);
    
    const { error, value } = validateProduct(cleanBody); 
    if (error) {
      return res.status(422).json({ 
        success: false, 
        message: error.details.map(d => d.message).join("; ") 
      });
    }
    
    // Ensure productId is set
    if (!value.productId) {
      value.productId = `HOK-PRD-${Date.now()}`;
    }
    
    const p = await Product.create(value); 
    res.status(201).json({ success: true, data: normalize(p) }); 
  } catch (e) { 
    res.status(400).json({ success: false, message: e.message }); 
  } 
};

export const updateProduct = async (req, res) => { 
  try { 
    const existing = await Product.findOne(productFilter(req.params.id)); 
    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found" }); 
    }
    
    // ✅ FIX: Payload clean karo (Extra fields hatao)
    const cleanBody = cleanPayload(req.body);

    // Merge existing with new data
    const updatedData = {
      ...existing.toObject(),
      ...cleanBody,
      productId: existing.productId,
      // Ensure arrays are handled properly
      listingModes: cleanBody.listingModes || existing.listingModes || ["RENTAL"],
      tags: cleanBody.tags || existing.tags || [],
      images: cleanBody.images || existing.images || [],
      sizes: cleanBody.sizes || existing.sizes || [],
      measurements: cleanBody.measurements || existing.measurements || {},
      measurementsCm: cleanBody.measurementsCm || existing.measurementsCm || {},
      blockedDates: cleanBody.blockedDates || existing.blockedDates || [],
      bookingHistory: cleanBody.bookingHistory || existing.bookingHistory || [],
      externalBookings: cleanBody.externalBookings || existing.externalBookings || [],
      activityLog: cleanBody.activityLog || existing.activityLog || [],
      relatedProductIds: cleanBody.relatedProductIds || existing.relatedProductIds || [],
      timesRented: cleanBody.timesRented !== undefined ? cleanBody.timesRented : existing.timesRented || 0,
      rating: cleanBody.rating !== undefined ? cleanBody.rating : existing.rating,
      reviewCount: cleanBody.reviewCount !== undefined ? cleanBody.reviewCount : existing.reviewCount || 0,
    };

    const { error, value } = validateProduct(updatedData); 
    if (error) {
      return res.status(422).json({ 
        success: false, 
        message: error.details.map(d => d.message).join("; ") 
      });
    }

    const p = await Product.findByIdAndUpdate(existing._id, value, { 
      new: true, 
      runValidators: true 
    }); 
    
    res.json({ success: true, data: normalize(p) }); 
  } catch (e) { 
    res.status(400).json({ success: false, message: e.message }); 
  } 
};

export const deleteProduct = async (req, res) => { 
  try { 
    const p = await Product.findOneAndDelete(productFilter(req.params.id)); 
    if (!p) return res.status(404).json({ success: false, message: "Product not found" }); 
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
            remarks: req.body.remarks || ""
          } 
        } 
      }, 
      { new: true }
    ); 
    if (!p) return res.status(404).json({ success: false, message: "Product not found" }); 
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
            remarks: req.body.remarks || ""
          } 
        } 
      }, 
      { new: true }
    ); 
    if (!p) return res.status(404).json({ success: false, message: "Product not found" }); 
    res.json({ success: true, data: normalize(p) }); 
  } catch (e) { 
    res.status(422).json({ success: false, message: e.message }); 
  } 
};

export const updateProductImages = async (req, res) => { 
  try { 
    if (!Array.isArray(req.body.images)) {
      return res.status(422).json({ success: false, message: "images must be an array" }); 
    }
    
    const images = req.body.images.filter(x => typeof x === "string" && x.trim()); 
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id), 
      { 
        images, 
        $push: { 
          activityLog: { 
            action: "Product images updated", 
            user: req.body.user || "Admin" 
          } 
        } 
      }, 
      { new: true }
    ); 
    
    if (!p) return res.status(404).json({ success: false, message: "Product not found" }); 
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
            remarks: req.body.remarks || "New rental booking"
          }
        }
      },
      { new: true }
    );
    
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
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
      return res.status(422).json({ success: false, message: "listingModes must be an array" });
    }
    
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      { 
        listingModes,
        $push: {
          activityLog: {
            action: "Listing modes updated",
            user: req.body.user || "Admin",
            remarks: `Updated to: ${listingModes.join(', ')}`
          }
        }
      },
      { new: true }
    );
    
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: { listingModes: p.listingModes } });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const updateMeasurements = async (req, res) => {
  try {
    const { measurements, measurementsCm, bestSuitedForHeight } = req.body;
    const updateData = {};  // 👈 'any' HATAO
    
    if (measurements) updateData.measurements = measurements;
    if (measurementsCm) updateData.measurementsCm = measurementsCm;
    if (bestSuitedForHeight !== undefined) updateData.bestSuitedForHeight = bestSuitedForHeight;
    
    const p = await Product.findOneAndUpdate(
      productFilter(req.params.id),
      { 
        ...updateData,
        $push: {
          activityLog: {
            action: "Measurements updated",
            user: req.body.user || "Admin"
          }
        }
      },
      { new: true }
    );
    
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: { 
      measurements: p.measurements,
      measurementsCm: p.measurementsCm,
      bestSuitedForHeight: p.bestSuitedForHeight
    }});
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};