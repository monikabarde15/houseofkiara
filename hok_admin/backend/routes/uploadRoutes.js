import express from "express";
import upload from "../middleware/upload.js";
import { uploadFile, deleteFile } from "../controllers/uploadController.js";
const router = express.Router();
router.post("/uploads", upload.single("file"), uploadFile); router.delete("/uploads", deleteFile);
export default router;
