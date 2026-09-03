import express from "express";
import Message from "../models/Message.js";

const router = express.Router();
const deliveries = [];

// GET all messages with filtering
router.get("/messages", async (req, res) => {
  try {
    const { search, audience, type, status } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (audience && audience !== 'Everyone') {
      filter.audience = audience;
    }
    if (type && type !== 'Required and optional') {
      if (type === 'Required') filter.class = 'Required';
      if (type === 'Marketing') filter.class = 'Marketing';
    }
    if (status && status !== 'Any status') {
      filter.status = status;
    }

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single message by ID
router.get("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let message = await Message.findOne({ $or: [{ messageId: id }, { _id: id }] });
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new message
router.post("/messages", async (req, res) => {
  try {
    const data = req.body;
    const messageId = `msg_${Date.now()}`;
    const newMsg = new Message({
      messageId,
      name: data.name || "New Message",
      wordingCount: data.wordings ? data.wordings.length : 1,
      isYours: true,
      trigger: data.trigger || "Sent by hand, so nothing fires on its own.",
      subject: data.subject || "",
      audience: data.audience || "Customer",
      class: data.class || "Required",
      channels: data.channels || ["email"],
      status: "Not written",
      lastEdited: new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }),
      editor: "You",
      wordings: data.wordings || [
        {
          id: `w_${Date.now()}`,
          name: "Default",
          subject: data.subject || "",
          previewLine: "",
          email: "",
          whatsapp: "",
        }
      ]
    });
    await newMsg.save();
    res.status(201).json({ success: true, data: newMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update message
router.put("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.wordings) {
      updates.wordingCount = updates.wordings.length;
    }
    updates.lastEdited = new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });

    let message = await Message.findOneAndUpdate(
      { $or: [{ messageId: id }, { _id: id }] },
      { $set: updates },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE message
router.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Message.deleteOne({ $or: [{ messageId: id }, { _id: id }] });
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST send message delivery mock
router.post("/messages/send", (req, res) => {
  const { channel = "whatsapp", to, body } = req.body || {};
  if (!to || !body) return res.status(422).json({ success: false, message: "Recipient and message are required" });
  const delivery = { id: `MOCK-${Date.now()}`, channel, to, body, status: "mock-delivered", createdAt: new Date().toISOString() };
  deliveries.unshift(delivery);
  res.status(201).json({ success: true, data: delivery, provider: "mock" });
});

export default router;
