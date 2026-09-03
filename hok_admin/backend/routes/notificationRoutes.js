import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT mark all as read
router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany({}, { $set: { unread: false } });
    res.json({ success: true, message: "Marked all as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT mark single notification read
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findOneAndUpdate(
      { $or: [{ notificationId: id }, { _id: id }] },
      { $set: { unread: false } },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE single notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.deleteOne({ $or: [{ notificationId: id }, { _id: id }] });
    res.json({ success: true, message: "Deleted notification successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
