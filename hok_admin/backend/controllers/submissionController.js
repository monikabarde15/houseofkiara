import Submission from '../models/Submission.js';
import Lister from '../models/Lister.js';

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
    if (listerId) filter.listerId = listerId;
    if (status && status !== 'All Statuses' && status !== 'All') filter.status = status;
    if (intent && intent !== 'All Intent' && intent !== 'All') filter.intent = intent;
    if (channel && channel !== 'All Channels' && channel !== 'All') filter.channel = channel;
    if (search) {
      filter.$or = [
        { subid: { $regex: search, $options: 'i' } },
        { piece: { $regex: search, $options: 'i' } },
        { listerName: { $regex: search, $options: 'i' } },
        { designer: { $regex: search, $options: 'i' } }
      ];
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

    const submission = new Submission(submissionData);
    const saved = await submission.save();
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
    if (!updateData.listerId && !updateData.listerID && !updateData.lister_id) {
      updateData.listerId = 'LST-GENERAL';
    }
    const updated = await Submission.findOneAndUpdate(
      { $or: [{ subid: id }, { _id: id }] },
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
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
    const enriched = await enrichSubmissionWithLister(updated);
    res.json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const requestMoreInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { moreInfo } = req.body;
    const updated = await Submission.findOneAndUpdate(
      { $or: [{ subid: id }, { _id: id }] },
      { $set: { moreInfo: moreInfo } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    const enriched = await enrichSubmissionWithLister(updated);
    res.json(enriched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
