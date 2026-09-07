import express from 'express';
import { getSubmissions, getSubmission, createSubmission, updateSubmission, updateSubmissionDecision, requestMoreInfo } from '../controllers/submissionController.js';

const router = express.Router();

router.get('/', getSubmissions);
router.get('/:id', getSubmission);
router.post('/', createSubmission);
router.put('/:id', updateSubmission);
router.put('/:id/decision', updateSubmissionDecision);
router.put('/:id/more-info', requestMoreInfo);

export default router;
