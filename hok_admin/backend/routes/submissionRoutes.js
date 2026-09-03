import express from 'express';
import { getSubmissions, createSubmission, updateSubmission, updateSubmissionDecision, requestMoreInfo } from '../controllers/submissionController.js';

const router = express.Router();

router.get('/', getSubmissions);
router.post('/', createSubmission);
router.put('/:id', updateSubmission);
router.put('/:id/decision', updateSubmissionDecision);
router.put('/:id/more-info', requestMoreInfo);

export default router;
