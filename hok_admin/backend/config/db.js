import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDir, "../.env") });

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_POOLER ||
  "postgresql://postgres:DpUpEOIutDJo6l41@db.qfwrxdgjywseodbtadnx.supabase.co:5432/postgres";

export const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  lookup: (hostname, options, callback) => {
    const cb = typeof options === "function" ? options : callback;
    dns.lookup(hostname, { family: 4 }, cb);
  },
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL client error:", error.message);
});

export const connectDB = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query("SELECT NOW()");
      console.log("Connected to PostgreSQL (Supabase) at:", res.rows[0].now);

      // Auto-migrate tables in the background so requests (e.g. login)
      // are not blocked while the schema sync runs.
      import("../db/migrate.js")
        .then((migrationModule) => {
          const run =
            migrationModule.migrate ||
            migrationModule.runMigrations ||
            migrationModule.default;
          if (typeof run === "function") return run();
        })
        .catch((err) => console.error("Migration error:", err.message));
      return;
    } catch (error) {
      console.error(
        `PostgreSQL connection attempt ${attempt} failed:`,
        error.message,
      );
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

export default pool;
