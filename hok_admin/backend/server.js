import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import offersRouter from "./routes/offerRoutes.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import payoutRouter from "./routes/payoutRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import listerRouter from "./routes/listerRoutes.js"; // ✅ Import sahi hai
import uploadRouter from "./routes/uploadRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import designerRouter from "./routes/designerRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", offersRouter);
app.use("/api", authRouter);

// ✅ FIX: SABSE PEHLE LISTER ROUTE REGISTER KARO (Taaki /api/listers product router se na takraye)
app.use("/api/listers", listerRouter); 
app.use("/api/designers", designerRouter);

app.use("/api", payoutRouter);
app.use("/api", productRouter); 
app.use("/api", orderRouter);
app.use("/api", uploadRouter);
app.use("/api", messageRouter);
app.use("/api", customerRouter);

// ✅ 404 handler (SABSE LAST MEIN)
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ✅ Error handler (SABSE LAST MEIN)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Unable to connect to PostgreSQL (Supabase):", error.message);
    process.exitCode = 1;
  });