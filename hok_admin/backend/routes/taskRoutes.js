import express from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(requireAuth, getTasks)
  .post(requireAuth, createTask);

router.route('/:id')
  .get(requireAuth, getTaskById)
  .put(requireAuth, updateTask)
  .delete(requireAuth, deleteTask);

export default router;
