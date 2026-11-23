import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, pool } from "./config/db.js";
import apiRouter from "./routes/index.js";
import { officialValidationGuard } from "./middleware/officialValidationGuard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
let dbReady = false;

// Disable ETag so API responses never return stale 304 browser cache
app.set("etag", false);

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Prevent browser/proxy stale HTTP caching on all API endpoints
app.use("/api", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

app.use(officialValidationGuard);
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../../public/uploads"), {
    maxAge: "1h",
  }),
);
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../public/uploads"), {
    maxAge: "1h",
  }),
);

app.use((req, res, next) => {
  if (dbReady) return next();
  return res.status(503).json({
    success: false,
    message: "Database is connecting. Please try signing in again in a moment.",
  });
});

// Root endpoints for SEO
app.get("/robots.txt", (req, res, next) => {
  req.url = "/site-settings/robots.txt";
  apiRouter(req, res, next);
});
app.get("/sitemap.xml", (req, res, next) => {
  req.url = "/site-settings/sitemap.xml";
  apiRouter(req, res, next);
});

// Mount Centralized API Routes
app.use("/api", apiRouter);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// Development services use fixed ports. Port 3000 is reserved for the
// browser-facing reverse proxy, so the API must never bind to it.
const PORT = Number(process.env.PORT || process.env.API_PORT || 5003);

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

async function initializeDatabase() {
  while (!dbReady) {
    try {
      await connectDB(2);
      dbReady = true;
      console.log("Database connected and ready.");
      // Pre-warm frequently accessed tables in the background for instant first load
      Promise.allSettled([
        pool.query(
          `SELECT * FROM products WHERE (data->>'status' = ANY($1::text[])) ORDER BY created_at DESC`,
          [["Live", "Out of Stock", "Out Of Stock"]],
        ),
        pool.query(`SELECT * FROM products WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT * FROM designers WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT * FROM categories WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT * FROM orders WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT * FROM submissions WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT * FROM customers WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT * FROM listers WHERE 1=1 ORDER BY created_at DESC`),
        pool.query(`SELECT data FROM site_settings WHERE key = 'global_settings' LIMIT 1`),
        pool.query(`SELECT * FROM pages ORDER BY created_at ASC`),
      ]).catch(() => {});
      break;
    } catch (err) {
      console.error("Database connection failed, retrying in 3 seconds:", err.message);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}
initializeDatabase();
