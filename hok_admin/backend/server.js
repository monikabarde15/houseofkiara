import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

// Mount Centralized API Routes
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

connectDB().catch((err) => {
  console.error("Non-blocking DB connection note:", err.message);
});