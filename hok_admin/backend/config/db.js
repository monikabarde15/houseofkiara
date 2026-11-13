import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignore if custom DNS setServers fails in environment
}

import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(configDir, "../.env") });

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_POOLER ||
  "postgresql://postgres.qfwrxdgjywseodbtadnx:DpUpEOIutDJo6l41@aws-0-ap-south-1.pooler.supabase.com:5432/postgres";

export const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 25,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 30000,
  lookup: (hostname, options, callback) => {
    const cb = typeof options === "function" ? options : callback;
    dns.lookup(hostname, { family: 4 }, (err, address, family) => {
      if (err) {
        dns.resolve4(hostname, (resErr, addresses) => {
          if (!resErr && addresses && addresses.length > 0) {
            return cb(null, addresses[0], 4);
          }
          return cb(err);
        });
      } else {
        cb(null, address, family);
      }
    });
  },
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL client error:", error.message);
});

// ============================================================================
// High-Speed Query Cache & In-Flight Deduplication (Zero Stale Cache on Write)
// ============================================================================
const QUERY_CACHE_TTL_MS = 20000; // 20s max TTL, plus instant write invalidation
const tableQueryCache = new Map(); // tableName -> Map<cacheKey, { timestamp, result }>
const inFlightSelects = new Map(); // cacheKey -> Promise

const cloneRowsResult = (res) => {
  if (!res || !Array.isArray(res.rows)) return res;
  return {
    ...res,
    rows: res.rows.map((r) => {
      if (!r || typeof r !== "object") return r;
      return {
        ...r,
        data:
          r.data && typeof r.data === "object"
            ? JSON.parse(JSON.stringify(r.data))
            : r.data,
      };
    }),
  };
};

const extractTableNameFromSelect = (sql) => {
  const match = sql.match(/\bFROM\s+([a-zA-Z0-9_]+)/i);
  return match ? match[1].toLowerCase() : "__general__";
};

const extractTableNameFromWrite = (sql) => {
  const tables = new Set();
  const insertMatch = sql.match(/\bINTO\s+([a-zA-Z0-9_]+)/i);
  if (insertMatch) tables.add(insertMatch[1].toLowerCase());
  const updateMatch = sql.match(/\bUPDATE\s+([a-zA-Z0-9_]+)/i);
  if (updateMatch) tables.add(updateMatch[1].toLowerCase());
  const deleteMatch = sql.match(/\bFROM\s+([a-zA-Z0-9_]+)/i);
  if (deleteMatch) tables.add(deleteMatch[1].toLowerCase());
  return Array.from(tables);
};

export const clearTableCache = (tableName) => {
  if (!tableName) {
    tableQueryCache.clear();
  } else {
    tableQueryCache.delete(String(tableName).toLowerCase());
    tableQueryCache.delete("__general__");
  }
  global.__webProductsCache = null;
  global.__webProductsCacheTime = 0;
  global.__webFiltersCache = null;
  global.__webFiltersCacheTime = 0;
};

export const clearAllQueryCaches = () => {
  tableQueryCache.clear();
  inFlightSelects.clear();
  global.__webProductsCache = null;
  global.__webProductsCacheTime = 0;
  global.__webFiltersCache = null;
  global.__webFiltersCacheTime = 0;
};

const rawPoolQuery = pool.query.bind(pool);

pool.query = async function (text, values, callback) {
  // If callback style is used, delegate directly to rawPoolQuery
  if (typeof values === "function" || typeof callback === "function") {
    clearAllQueryCaches();
    return rawPoolQuery(text, values, callback);
  }

  const sql = typeof text === "string" ? text.trim() : "";
  if (!sql) {
    return rawPoolQuery(text, values);
  }

  const upperSql = sql.toUpperCase();
  const isSelect =
    upperSql.startsWith("SELECT") &&
    !upperSql.includes("FOR UPDATE") &&
    !upperSql.includes("SELECT NOW()");

  if (isSelect) {
    const tableName = extractTableNameFromSelect(sql);
    const cacheKey = `${sql}::${JSON.stringify(values || [])}`;

    const tableMap = tableQueryCache.get(tableName);
    if (tableMap && tableMap.has(cacheKey)) {
      const entry = tableMap.get(cacheKey);
      if (Date.now() - entry.timestamp < QUERY_CACHE_TTL_MS) {
        return cloneRowsResult(entry.result);
      }
      tableMap.delete(cacheKey);
    }

    if (inFlightSelects.has(cacheKey)) {
      const sharedRes = await inFlightSelects.get(cacheKey);
      return cloneRowsResult(sharedRes);
    }

    const queryPromise = rawPoolQuery(text, values)
      .then((res) => {
        if (!tableQueryCache.has(tableName)) {
          tableQueryCache.set(tableName, new Map());
        }
        tableQueryCache.get(tableName).set(cacheKey, {
          timestamp: Date.now(),
          result: cloneRowsResult(res),
        });
        return res;
      })
      .finally(() => {
        inFlightSelects.delete(cacheKey);
      });

    inFlightSelects.set(cacheKey, queryPromise);
    const result = await queryPromise;
    return cloneRowsResult(result);
  }

  // Write or DDL query: immediately invalidate affected table caches before & after execution
  const writeTables = extractTableNameFromWrite(sql);
  if (writeTables.length > 0) {
    writeTables.forEach((t) => clearTableCache(t));
  } else {
    clearAllQueryCaches();
  }

  const writeRes = await rawPoolQuery(text, values);

  if (writeTables.length > 0) {
    writeTables.forEach((t) => clearTableCache(t));
  } else {
    clearAllQueryCaches();
  }

  return writeRes;
};

export const connectDB = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await rawPoolQuery("SELECT NOW()");
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
