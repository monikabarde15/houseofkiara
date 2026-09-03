import Submission from '../models/Submission.js';

// Get submissions (optionally filtered by listerId)
export const getSubmissions = async (req, res) => {
  try {
    const { listerId } = req.query;
    const filter = {};
    if (listerId) filter.listerId = listerId;
    
    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json({ data: submissions, total: submissions.length });
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
    const submission = new Submission(submissionData);
    const saved = await submission.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update submission
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Submission.findOneAndUpdate({ subid: id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.json(updated);
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
      { subid: id },
      { $set: { decision: decision, moreInfo: null } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const requestMoreInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { moreInfo } = req.body;
    const updated = await Submission.findOneAndUpdate(
      { subid: id },
      { $set: { moreInfo: moreInfo } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Submission not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
