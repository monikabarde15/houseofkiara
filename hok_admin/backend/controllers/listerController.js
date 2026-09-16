import mongoose from "mongoose";
import Lister from "../models/Lister.js";
import Product from "../models/Product.js";
import Payout from "../models/Payout.js";
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
    const reqQ = req.query || {};
    const q = {};
    if (reqQ.status) q.status = reqQ.status;
    if (reqQ.search) {
      const regex = new RegExp(reqQ.search, "i");
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

const getListerRecord = (id) => Lister.findOne(buildIdQuery(id));

export const getListerListings = async (req, res) => {
  try {
    const lister = await getListerRecord(req.params.id);
    const ids = [req.params.id];
    if (lister && lister.listerId) ids.push(lister.listerId);
    if (lister && lister._id) ids.push(lister._id.toString());
    
    const rows = await Product.find({ listerId: { $in: ids } }).sort({ createdAt: -1 });
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getListerPayouts = async (req, res) => {
  try {
    const lister = await getListerRecord(req.params.id);
    const ids = [req.params.id];
    if (lister && lister.listerId) ids.push(lister.listerId);
    if (lister && lister._id) ids.push(lister._id.toString());

    const rows = await Payout.find({ listerId: { $in: ids } }).sort({ createdAt: -1 });
    const data = rows.map((p) => ({
      id: p.payoutId || String(p._id), listerId: p.listerId, orderId: p.orderId,
      sku: p.productId || '', type: p.mode === 'Preloved' ? 'Preloved Sale' : 'Rental',
      tag: p.productName || '', tv: Number(p.transactionAmount || 0),
      pct: Number(p.payoutPercentage || 0), amount: Number(p.listerShare || 0),
      commission: Number(p.hokCommission || 0), status: p.status === 'Pending' ? 'Pending Approval' : p.status,
      date: p.createdAt, dueDate: p.dueDate, ref: p.paymentReference || null, isDamage: false,
      stdPct: null, compPct: null, compAmount: null,
    }));
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getListerCommunications = async (req, res) => {
  try { const lister = await getListerRecord(req.params.id); if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' }); res.json({ success: true, data: lister.communications || [] }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const addListerCommunication = async (req, res) => {
  try { const lister = await getListerRecord(req.params.id); if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' }); const entry = { id: `COM-${Date.now()}`, channel: req.body.channel || 'WhatsApp', text: req.body.text || '', timestamp: new Date().toISOString() }; if (!entry.text) return res.status(422).json({ success: false, message: 'Communication text is required' }); lister.communications = [entry, ...(lister.communications || [])]; await lister.save(); res.status(201).json({ success: true, data: entry }); }
  catch (e) { res.status(422).json({ success: false, message: e.message }); }
};

export const getListerActivities = async (req, res) => {
  try { const lister = await getListerRecord(req.params.id); if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' }); res.json({ success: true, data: lister.activities || [] }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const addListerActivity = async (req, res) => {
  try { const lister = await getListerRecord(req.params.id); if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' }); const entry = { c: req.body.color || 'muted', e: req.body.text || '', t: new Date().toISOString() }; if (!entry.e) return res.status(422).json({ success: false, message: 'Activity text is required' }); lister.activities = [entry, ...(lister.activities || [])]; await lister.save(); res.status(201).json({ success: true, data: entry }); }
  catch (e) { res.status(422).json({ success: false, message: e.message }); }
};

export const getListerRecalls = async (req, res) => {
  try { const lister = await getListerRecord(req.params.id); if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' }); res.json({ success: true, data: lister.recalls || [] }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const createListerRecall = async (req, res) => {
  try {
    const lister = await getListerRecord(req.params.id);
    if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' });
    const piece = await Product.findOne({ $or: [{ productId: req.body.pieceId }, { _id: req.body.pieceId }] });
    if (!piece) return res.status(404).json({ success: false, message: 'Product not found' });
    const entry = { id: `RCL-${Date.now()}`, pieceId: piece.productId || String(piece._id), pieceName: piece.name, status: 'Requested', requestedDate: new Date().toISOString(), reason: req.body.reason, scheduledDate: null, returnedDate: null, declinedDate: null, declinedReason: null };
    if (!entry.reason) return res.status(422).json({ success: false, message: 'Recall reason is required' });
    lister.recalls = [entry, ...(lister.recalls || [])];
    // Log activity
    const actEntry = { c: 'orange', e: `Recall requested for "${piece.name}": ${req.body.reason}`, t: new Date().toISOString() };
    lister.activities = [actEntry, ...(lister.activities || [])];
    await lister.save();
    res.status(201).json({ success: true, data: entry });
  } catch (e) { res.status(422).json({ success: false, message: e.message }); }
};

export const updateListerRecall = async (req, res) => {
  try {
    const lister = await getListerRecord(req.params.id);
    if (!lister) return res.status(404).json({ success: false, message: 'Lister not found' });
    const recalls = lister.recalls || [];
    const index = recalls.findIndex((r) => r.id === req.params.recallId);
    if (index < 0) return res.status(404).json({ success: false, message: 'Recall not found' });
    const update = req.body || {};
    const recall = { ...recalls[index], ...update };
    if (update.status === 'Scheduled') recall.scheduledDate = update.scheduledDate || new Date().toISOString();
    if (update.status === 'Returned') recall.returnedDate = new Date().toISOString();
    if (update.status === 'Declined') { recall.declinedDate = new Date().toISOString(); recall.declinedReason = update.declinedReason || ''; }
    recalls[index] = recall;
    lister.recalls = recalls;
    // Log activity for status change
    let actColor = 'muted';
    let actText = `Recall updated for "${recall.pieceName}"`;
    if (update.status === 'Scheduled') { actColor = 'gold'; actText = `Pickup scheduled for "${recall.pieceName}" on ${recall.scheduledDate?.split('T')[0]}`; }
    if (update.status === 'Returned') { actColor = 'sage'; actText = `"${recall.pieceName}" returned to lister`; }
    if (update.status === 'Declined') { actColor = 'terra'; actText = `Recall declined for "${recall.pieceName}": ${recall.declinedReason}`; }
    const actEntry = { c: actColor, e: actText, t: new Date().toISOString() };
    lister.activities = [actEntry, ...(lister.activities || [])];
    await lister.save();
    res.json({ success: true, data: recall });
  } catch (e) { res.status(422).json({ success: false, message: e.message }); }
};
