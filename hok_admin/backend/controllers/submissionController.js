import Submission from '../models/Submission.js';
import Lister from '../models/Lister.js';
import Product from '../models/Product.js';
import Designer from '../models/Designer.js';
import mongoose from 'mongoose';

// Helper to populate real Lister details from DB
const enrichSubmissionWithLister = async (subObj) => {
  if (!subObj) return subObj;
  let item = subObj.toObject ? subObj.toObject() : subObj;
  if (item._data) item = { ...item._data, ...item };
  if (item.data) item = { ...item.data, ...item };

  const keys = [item.lister_id, item.listerId, item.listerID].filter(k => k && k !== 'LST-GENERAL');
  const listerKey = keys[0] || item.lister_id || item.listerId || item.listerID;
  if (listerKey) {
    try {
      const listerObj = await Lister.findOne({
        $or: [{ _id: listerKey }, { listerId: listerKey }, { id: listerKey }]
      });
      if (listerObj) {
        const rawLister = listerObj._data || (listerObj.toObject ? listerObj.toObject() : listerObj);
        item.listerName = rawLister.name || item.listerName;
        item.listerPhone = rawLister.phone || item.listerPhone || item.phone;
        item.listerEmail = rawLister.email || item.listerEmail || item.email;
        item.email = rawLister.email || item.email || '';
        item.phone = rawLister.phone || item.phone || '';
        if (!item.city || item.city === '—') item.city = rawLister.city || rawLister.pickup?.city || '';
      }
    } catch (e) {
      // ignore
    }
  }
  return item;
};

// Get submissions (with full search, status, intent, channel filters)
export const getSubmissions = async (req, res) => {
  try {
    const { listerId, search, status, intent, channel, dateFrom, dateTo } = req.query || {};
    const filter = {};
    if (listerId) {
      try {
        const lister = await Lister.findOne({ $or: [{ _id: listerId }, { listerId: listerId }, { id: listerId }] });
        const ids = [listerId];
        if (lister && lister.listerId) ids.push(lister.listerId);
        if (lister && lister._id) ids.push(lister._id.toString());
        filter.$or = [
          { listerId: { $in: ids } },
          { lister_id: { $in: ids } }
        ];
      } catch (e) {
        filter.$or = [
          { listerId: listerId },
          { lister_id: listerId }
        ];
      }
    }
    if (status && status !== 'All Statuses' && status !== 'All') filter.status = status;
    if (intent && intent !== 'All Intent' && intent !== 'All') filter.intent = intent;
    if (channel && channel !== 'All Channels' && channel !== 'All') filter.channel = channel;
    if (search) {
      const searchOr = [
        { subid: { $regex: search, $options: 'i' } },
        { piece: { $regex: search, $options: 'i' } },
        { listerName: { $regex: search, $options: 'i' } },
        { designer: { $regex: search, $options: 'i' } }
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }
    
    const rawSubmissions = await Submission.find(filter).sort({ createdAt: -1 });
    const submissions = await Promise.all(rawSubmissions.map(enrichSubmissionWithLister));
    res.json({ data: submissions, total: submissions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single submission by subid or _id
export const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const rawSubmission = await Submission.findOne({
      $or: [{ subid: id }, { _id: id }]
    });
    if (!rawSubmission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    const submission = await enrichSubmissionWithLister(rawSubmission);
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logListerActivity = async (listerId, color, text) => {
  if (!listerId) return;
  try {
    const lister = await Lister.findOne({ $or: [{ listerId: listerId }, { _id: listerId }] });
    if (lister) {
      const entry = { c: color, e: text, t: new Date().toISOString() };
      lister.activities = [entry, ...(lister.activities || [])];
      await lister.save();
    }
  } catch(err) {
    console.error('Failed to log lister activity:', err);
  }
};



// Create a new submission
export const createSubmission = async (req, res) => {
  try {
    const submissionData = req.body;
    if (!submissionData.subid) {
      submissionData.subid = `SUB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    }
    const listerId = submissionData.listerId || submissionData.listerID || submissionData.lister_id || 'LST-GENERAL';
    submissionData.listerId = listerId;
    submissionData.listerID = listerId;
    submissionData.lister_id = listerId;

    if (listerId) {
      try {
        const listerObj = await Lister.findOne({
          $or: [{ _id: listerId }, { listerId: listerId }, { id: listerId }]
        });
        if (listerObj && listerObj.name) {
          submissionData.listerName = listerObj.name;
          submissionData.listerPhone = listerObj.phone;
          if (!submissionData.city) submissionData.city = listerObj.city;
        }
      } catch (e) {
        // ignore lookup error
      }
    }

    // Check if product exists by name and designer
    if (submissionData.piece && submissionData.designer) {
      try {
        const existingProduct = await Product.findOne({
          $or: [
            { 'data.name': submissionData.piece, 'data.designer': submissionData.designer },
            { 'data.title': submissionData.piece, 'data.designer': submissionData.designer },
            { name: submissionData.piece, designer: submissionData.designer }
          ]
        });

        let productId = existingProduct ? (existingProduct.sku || existingProduct.id) : null;

        if (!existingProduct) {
          // Create Draft Product
          const draftSku = `HOK-PRD-${Date.now()}`;
          const newProduct = {
            productId: draftSku,
            sku: draftSku,
            status: 'Draft',
            listerId: listerId,
            name: submissionData.piece,
            designer: submissionData.designer,
            category: submissionData.category,
            color: submissionData.colour,
            sizes: submissionData.size ? [submissionData.size] : [],
            originalRetailPrice: parseFloat(submissionData.originalPrice?.replace(/[^0-9.-]+/g,"")) || undefined,
            rentalPrice: parseFloat(submissionData.askRent?.replace(/[^0-9.-]+/g,"")) || undefined,
            listingPrice: parseFloat(submissionData.askSell?.replace(/[^0-9.-]+/g,"")) || undefined,
            condition: submissionData.conditionClaim,
            images: (submissionData.media || []).map(m => m.url).filter(Boolean),
            data: {
              name: submissionData.piece,
              designer: submissionData.designer
            }
          };
          await Product.create(newProduct);
          productId = draftSku;
        }

        submissionData.sku = productId;
      } catch (err) {
        console.error("Error auto-creating product:", err);
      }
    }

    // Auto-create Designer if it doesn't exist
    if (submissionData.designer) {
      try {
        const designerSlug = submissionData.designer.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        // Our postgresAdapter doesn't support $or properly with RegExp, so we just search by slug or name exactly.
        const existingDesigners = await Designer.find({});
        const designerExists = existingDesigners.some(d => 
          (d.name && d.name.toLowerCase() === submissionData.designer.toLowerCase()) || 
          (d.slug && d.slug === designerSlug) ||
          (d.designerId && d.designerId.toLowerCase() === submissionData.designer.toLowerCase())
        );
        
        if (!designerExists) {
          await Designer.create({
            designerId: `DES-${Date.now()}`,
            name: submissionData.designer,
            slug: designerSlug,
            type: "Indie Designer",
            status: "Active",
            joinedAt: new Date().toISOString().split("T")[0],
            isNewToHOK: true,
            isFeatured: false,
            livePieces: 0,
            totalPieces: 1
          });
        } else {
          const existing = existingDesigners.find(d => 
            (d.name && d.name.toLowerCase() === submissionData.designer.toLowerCase()) || 
            (d.slug && d.slug === designerSlug) ||
            (d.designerId && d.designerId.toLowerCase() === submissionData.designer.toLowerCase())
          );
          if (existing) {
            existing.totalPieces = (existing.totalPieces || 0) + 1;
            await existing.save();
          }
        }
      } catch (err) {
        console.error("Error auto-creating designer:", err);
      }
    }

    const submission = new Submission(submissionData);
    const saved = await submission.save();
    
    await logListerActivity(saved.listerId, 'blue', `Submitted a new piece: "${saved.piece}"`);
    
    const enriched = await enrichSubmissionWithLister(saved);
    res.status(201).json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update submission
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const updated = await Submission.findOneAndUpdate(
      { $or: [{ subid: id }, { _id: id }] },
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    
    await logListerActivity(updated.listerId, 'muted', `Updated submission details for "${updated.piece}"`);
    
    const enriched = await enrichSubmissionWithLister(updated);
    res.json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actions (approve, reject, withdraw, requestMoreInfo)
export const updateSubmissionDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;
    const updated = await Submission.findOneAndUpdate(
      { $or: [{ subid: id }, { _id: id }] },
      { $set: { decision: decision, moreInfo: null } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    
    let color = 'muted';
    if (decision === 'Approved') color = 'green';
    if (decision === 'Rejected') color = 'red';
    if (decision === 'Withdrawn') color = 'orange';
    await logListerActivity(updated.listerId, color, `Submission decision set to "${decision}" for "${updated.piece}"`);
    
    const enriched = await enrichSubmissionWithLister(updated);
    res.json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const requestMoreInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { infoRequired, deadline, requestedBy, comment } = req.body;
    const sub = await Submission.findOne({ $or: [{ subid: id }, { _id: id }] });
    if (!sub) return res.status(404).json({ message: 'Submission not found' });
    const infoPayload = {
      requestedAt: new Date().toISOString(),
      requestedBy: requestedBy || 'System',
      infoRequired,
      deadline,
      comment
    };
    sub.moreInfo = infoPayload;
    sub.status = 'Action Required';
    await sub.save();
    
    await logListerActivity(sub.listerId, 'orange', `Requested more info on submission "${sub.piece}": ${infoRequired}`);
    
    res.json({ data: await enrichSubmissionWithLister(sub), message: 'More info requested successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignees = async (req, res) => {
  try {
    const assignees = await Submission.distinct('assignedTo');
    const validAssignees = assignees.filter(a => a != null && a.trim() !== '' && a !== 'Unassigned');
    
    // Add default LYP assignees if they aren't already in the DB
    if (!validAssignees.includes('Soumya')) validAssignees.push('Soumya');
    if (!validAssignees.includes('Operations Team')) validAssignees.push('Operations Team');
    
    res.json({ data: validAssignees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
