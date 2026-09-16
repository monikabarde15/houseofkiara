import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import offersRouter from "./routes/offerRoutes.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import payoutRouter from "./routes/payoutRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import listerRouter from "./routes/listerRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import designerRouter from "./routes/designerRoutes.js";
import customerAuthRouter from "./routes/customerAuthRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import submissionRouter from "./routes/submissionRoutes.js";
import promotionRouter from "./routes/promotionRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import siteSettingsRouter from "./routes/siteSettingsRoutes.js";

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

// Specific API Endpoints
app.use("/api/site-settings", siteSettingsRouter);
app.use("/api/listers", listerRouter); 
app.use("/api/designers", designerRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/submissions", submissionRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/notifications", notificationRouter);

app.use("/api", productRouter);
app.use("/api", offersRouter);
app.use("/api", authRouter);
app.use("/api", payoutRouter);
app.use("/api", orderRouter);
app.use("/api", uploadRouter);
app.use("/api", messageRouter);
app.use("/api", customerRouter);
app.use("/api/customer/auth", customerAuthRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
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
