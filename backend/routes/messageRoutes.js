import express from "express";

const router = express.Router();
const deliveries = [];

// Development provider: records the message and returns a fake delivery id.
router.post("/messages/send", (req, res) => {
  const { channel = "whatsapp", to, body } = req.body || {};
  if (!to || !body) return res.status(422).json({ success: false, message: "Recipient and message are required" });
  const delivery = { id: `MOCK-${Date.now()}`, channel, to, body, status: "mock-delivered", createdAt: new Date().toISOString() };
  deliveries.unshift(delivery);
  res.status(201).json({ success: true, data: delivery, provider: "mock" });
});

router.get("/messages", (_req, res) => res.json({ success: true, data: deliveries }));
export default router;
