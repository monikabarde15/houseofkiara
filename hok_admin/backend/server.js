import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";

const app = express();
let dbReady = false;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (dbReady) return next();
  return res.status(503).json({
    success: false,
    message: "Database is connecting. Please try signing in again in a moment.",
  });
});

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

// Development services use fixed ports. Port 3000 is reserved for the
// browser-facing reverse proxy, so the API must never bind to it.
const PORT = Number(process.env.API_PORT || 5003);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Admin API could not start: port ${PORT} is already in use.`);
    return;
  }
  console.error("Admin API server error:", error.message);
});

connectDB()
  .then(() => {
    dbReady = true;
  })
  .catch((err) => {
    console.error("Non-blocking DB connection note:", err.message);
  });
