import Payout from "../models/Payout.js";
import { validatePayout } from "../validations/payoutValidation.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

const view = (p) => ({ ...p.toObject(), id: p.payoutId, dueDate: p.dueDate?.toISOString().slice(0, 10) });

export const getPayouts = async (req, res) => {
  try {
    const query = {};

    // 1. FIX: Handle productId from URL or query params
    // Agar URL mein /products/:productId/payout-history hai, to req.params.productId milega
    // Agar query string mein ?productId=... hai, to req.query.productId milega
    const productId = req.params.productId || req.query.productId;

    if (productId) {
      // IMPORTANT FIX: Check if it's a valid ObjectId before casting, to avoid "CastError"
      if (mongoose.Types.ObjectId.isValid(productId)) {
        query.productId = new mongoose.Types.ObjectId(productId);
      } else {
        // If it's a custom string ID (like HOK-PRD...), treat it as a string field
        query.productId = productId;
      }
    }

    // Status filters
    if (req.query.status && ["Pending", "Paid", "Failed", "Reversed"].includes(req.query.status)) {
      query.status = req.query.status;
    }
    if (req.query.listerId) query.listerId = req.query.listerId;
    
    // Date filters
    if (req.query.from || req.query.to) {
      query.dueDate = {};
      if (req.query.from) query.dueDate.$gte = new Date(req.query.from);
      if (req.query.to) query.dueDate.$lte = new Date(req.query.to);
    }

    const payouts = await Payout.find(query).sort({ dueDate: 1, createdAt: -1 }).exec();
    
    const [pending, paid] = await Promise.all([
      Payout.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$listerShare" } } }]),
      Payout.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$listerShare" } } }])
    ]);

    res.json({ 
      success: true, 
      data: payouts.map(view), 
      summary: { pending: pending[0]?.total || 0, paid: paid[0]?.total || 0 } 
    });
  } catch (e) { 
    res.status(500).json({ success: false, message: e.message }); 
  }
};

export const exportPayouts = async (req, res) => { 
  try { 
    const rows = await Payout.find({}).sort({ dueDate: -1 }); 
    const headers = ["payoutId","listerId","listerName","orderId","productName","mode","transactionAmount","listerShare","hokCommission","taxDeduction","netPayout","status","dueDate"]; 
    const csv = [headers.join(","), ...rows.map(p => headers.map(h => JSON.stringify(p[h] ?? "")).join(","))].join("\n"); 
    res.setHeader("Content-Type", "text/csv"); 
    res.setHeader("Content-Disposition", "attachment; filename=payouts.csv"); 
    res.send(csv); 
  } catch (e) { 
    res.status(500).json({ success: false, message: e.message }); 
  } 
};

export const updatePayoutStatus = async (req, res) => { 
  try { 
    if (!["Failed", "Reversed", "Pending"].includes(req.body.status)) return res.status(422).json({ success: false, message: "Invalid payout status" }); 
    
    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }];
    // FIX: Prevent cast error by checking if param is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    const p = await Payout.findOneAndUpdate(
      { $or: queryConditions }, 
      { status: req.body.status, notes: req.body.notes, updatedBy: req.body.updatedBy || "Admin" }, 
      { new: true }
    ); 
    if (!p) return res.status(404).json({ success: false, message: "Payout not found" }); 
    res.json({ success: true, data: view(p) }); 
  } catch (e) { 
    res.status(422).json({ success: false, message: e.message }); 
  } 
};

export const getPayoutById = async (req, res) => { 
  try { 
    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }];
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    const p = await Payout.findOne({ $or: queryConditions }); 
    if (!p) return res.status(404).json({ success: false, message: "Payout not found" }); 
    res.json({ success: true, data: view(p) }); 
  } catch (e) { 
    res.status(400).json({ success: false, message: e.message }); 
  } 
};

export const createPayout = async (req, res) => { 
  try { 
    const { error, value } = validatePayout(req.body); 
    if (error) return res.status(422).json({ success: false, message: error.details.map(d => d.message).join("; ") }); 
    const p = await Payout.create({ ...value, payoutId: value.payoutId || `PAY-${Date.now()}` }); 
    res.status(201).json({ success: true, data: view(p) }); 
  } catch (e) { 
    res.status(400).json({ success: false, message: e.message }); 
  } 
};

export const markPayoutPaid = async (req, res) => { 
  try { 
    const taxDeduction = Math.max(0, Number(req.body.taxDeduction || 0)); 
    
    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }, { status: "Pending" }];
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    // FIX: Removed the buggy netPayout math from the $set object
    const p = await Payout.findOneAndUpdate(
      { $or: queryConditions }, 
      { 
        status: "Paid", 
        paidAt: new Date(), 
        paidBy: req.body.paidBy || "Admin", 
        paymentReference: req.body.paymentReference, 
        taxDeduction, 
        notes: req.body.notes 
      }, 
      { new: true }
    ); 

    if (!p) return res.status(404).json({ success: false, message: "Pending payout not found" }); 
    
    // FIX: Calculate netPayout after retrieving the correct document
    p.netPayout = Math.max(0, Number(p.listerShare || 0) - taxDeduction); 
    await p.save(); 
    
    res.json({ success: true, data: view(p) }); 
  } catch (e) { 
    res.status(400).json({ success: false, message: e.message }); 
  } 
};