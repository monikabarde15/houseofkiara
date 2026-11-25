import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { requireAuth, enforceSectionIfAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(enforceSectionIfAdmin("calendar", "View"), getTasks)
  .post(enforceSectionIfAdmin("calendar", "Edit"), createTask);

router
  .route("/:id")
  .get(enforceSectionIfAdmin("calendar", "View"), getTaskById)
  .put(enforceSectionIfAdmin("calendar", "Edit"), updateTask)
  .delete(enforceSectionIfAdmin("calendar", "Edit"), deleteTask);

export default router;
