import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import { pool } from "../config/db.js";
import {
  sanitizeIdentifier,
  matchesFilter,
  applyUpdate,
  buildWhereClause,
  ObjectId
} from "../db/postgresAdapter.js";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";
import Designer from "../models/Designer.js";
import Lister from "../models/Lister.js";
import Offer from "../models/Offer.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import Product from "../models/Product.js";

const runForensicAudit = async () => {
  console.log("=== FORENSIC AUDITOR INDEPENDENT INTEGRITY VERIFICATION ===");

  // 1. Tables check
  console.log("\n[Check 1] Auditing PostgreSQL Tables in public schema...");
  const tablesRes = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
  );
  const existingTables = tablesRes.rows.map((r) => r.table_name);
  console.log("Existing Tables:", existingTables);
  const requiredTables = [
    "admins",
    "customers",
    "designers",
    "listers",
    "offers",
    "orders",
    "payouts",
    "products",
  ];
  for (const tbl of requiredTables) {
    if (!existingTables.includes(tbl)) {
      throw new Error(`Required table ${tbl} missing from PostgreSQL!`);
    }
  }
  console.log("✓ PASS: All 8 required tables present in PostgreSQL.");

  // 2. Column schema check for data JSONB and extracted columns
  console.log("\n[Check 2] Auditing Table Columns & Types...");
  const colsRes = await pool.query(
    "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;"
  );
  const colsByTable = {};
  for (const r of colsRes.rows) {
    if (!colsByTable[r.table_name]) colsByTable[r.table_name] = [];
    colsByTable[r.table_name].push({ col: r.column_name, type: r.data_type });
  }

  for (const tbl of requiredTables) {
    const cols = colsByTable[tbl] || [];
    const hasData = cols.some((c) => c.col === "data" && c.type === "jsonb");
    const hasId = cols.some((c) => c.col === "_id");
    const hasCreatedAt = cols.some((c) => c.col === "created_at");
    const hasUpdatedAt = cols.some((c) => c.col === "updated_at");

    if (!hasData || !hasId || !hasCreatedAt || !hasUpdatedAt) {
      throw new Error(`Table ${tbl} missing core columns (_id, data JSONB, created_at, updated_at)!`);
    }
    console.log(`✓ Table [${tbl}]: verified core columns (_id, data: jsonb, created_at, updated_at). Total columns: ${cols.length}`);
  }

  // 3. Indexes check (B-tree on PKs/unique, GIN on data)
  console.log("\n[Check 3] Auditing PostgreSQL Indexes & GIN Indexes...");
  const indexesRes = await pool.query(
    "SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;"
  );
  const indexesByTable = {};
  for (const r of indexesRes.rows) {
    if (!indexesByTable[r.tablename]) indexesByTable[r.tablename] = [];
    indexesByTable[r.tablename].push(r.indexname);
  }

  for (const tbl of requiredTables) {
    const tableIndexes = indexesByTable[tbl] || [];
    const hasGin = tableIndexes.some((idx) => idx.includes("data_gin"));
    if (!hasGin) {
      throw new Error(`Table ${tbl} missing GIN index on data column!`);
    }
    console.log(`✓ Table [${tbl}]: Verified indexes count=${tableIndexes.length}, including GIN index.`);
  }

  // 4. SQL Injection Resistance Check
  console.log("\n[Check 4] Auditing SQL Injection Sanitization...");
  const maliciousInputs = [
    "name; DROP TABLE admins; --",
    "user' OR '1'='1",
    "admin/*comment*/",
    "name\" OR \"\"=\"",
    "data->>'a' UNION SELECT * FROM admins",
    "field\x00nullbyte",
  ];

  for (const input of maliciousInputs) {
    let blocked = false;
    try {
      sanitizeIdentifier(input, "malicious test");
    } catch (err) {
      blocked = true;
    }
    if (!blocked) {
      throw new Error(`CRITICAL: sanitizeIdentifier failed to block malicious input: "${input}"`);
    }
  }
  console.log("✓ PASS: sanitizeIdentifier properly threw errors on all malicious injection payloads.");

  // Test SQL injection via sort & find
  try {
    let sqlInjBlocked = false;
    try {
      await Admin.find().sort({ "email; DROP TABLE users; --": 1 }).exec();
    } catch (e) {
      if (e.message.includes("Invalid sort field identifier")) {
        sqlInjBlocked = true;
      }
    }
    if (!sqlInjBlocked) {
      throw new Error("Sort SQL injection was not blocked!");
    }
    console.log("✓ PASS: Model.find().sort() with SQL injection payload safely rejected.");
  } catch (e) {
    if (!e.message.includes("safely rejected")) throw e;
  }

  // 5. Genuine End-to-End Persistence Check (Direct Database Read)
  console.log("\n[Check 5] Auditing Raw DB Persistence & JSONB Serialization...");
  const auditCustId = "AUDIT-" + Date.now() + "-CUST";
  const createdDoc = await Customer.create({
    customerId: auditCustId,
    name: "Auditor Test Customer",
    email: "audit.test@example.com",
    preferences: {
      newsletter: true,
      preferredSize: "L",
    },
    addresses: [
      { id: "ADDR-AUDIT-1", label: "Office", address: "Tech Park, Bengaluru" }
    ],
  });

  // Verify via raw SQL query bypassing Mongoose/adapter
  const rawRowRes = await pool.query(
    "SELECT _id, customer_id, email, data, created_at, updated_at FROM customers WHERE customer_id = $1",
    [auditCustId]
  );
  if (rawRowRes.rows.length !== 1) {
    throw new Error("Raw SQL query failed to find inserted customer!");
  }
  const rawRow = rawRowRes.rows[0];
  if (rawRow.customer_id !== auditCustId || rawRow.email !== "audit.test@example.com") {
    throw new Error("Raw SQL column values mismatch!");
  }
  if (!rawRow.data || rawRow.data.preferences?.preferredSize !== "L" || rawRow.data.addresses?.[0]?.label !== "Office") {
    throw new Error("Raw SQL JSONB data column content mismatch!");
  }
  console.log("✓ PASS: Verified genuine PostgreSQL persistence directly via raw SELECT * FROM customers.");

  // Test deep update via adapter and raw check
  await Customer.findOneAndUpdate(
    { customerId: auditCustId },
    {
      $set: { "preferences.preferredSize": "XL", location: "Bengaluru" },
      $push: { addresses: { id: "ADDR-AUDIT-2", label: "Home", address: "Indiranagar" } },
    }
  );

  const rawUpdatedRes = await pool.query(
    "SELECT data FROM customers WHERE customer_id = $1",
    [auditCustId]
  );
  const rawUpdatedData = rawUpdatedRes.rows[0].data;
  if (rawUpdatedData.preferences?.preferredSize !== "XL" || rawUpdatedData.addresses?.length !== 2) {
    throw new Error("Raw SQL verification of $set and $push update failed!");
  }
  console.log("✓ PASS: Verified genuine PostgreSQL updates ($set & $push) via raw SELECT.");

  // Clean up
  await pool.query("DELETE FROM customers WHERE customer_id = $1", [auditCustId]);
  console.log("✓ PASS: Cleaned up audit test record.");

  // 6. Inspect for Prohibited Patterns (Hardcoding, Facades, Fake arrays)
  console.log("\n[Check 6] Auditing for Prohibited Facades and Hardcoded Results...");
  // Check that queries actually return null for nonexistent records
  const nonExistent = await Product.findOne({ productId: "DOES_NOT_EXIST_FOR_SURE_99999" });
  if (nonExistent !== null) {
    throw new Error("Product.findOne returned a facade object for non-existent record!");
  }

  const nonExistentCount = await Order.countDocuments({ orderId: "NON_EXISTENT_ORD_99999" });
  if (nonExistentCount !== 0) {
    throw new Error("Order.countDocuments returned non-zero for non-existent record!");
  }
  console.log("✓ PASS: No facade returns for non-existent queries.");

  console.log("\n==========================================================================");
  console.log("🎉 ALL FORENSIC AUDITOR CHECKS PASSED EMPIRICALLY! ZERO VIOLATIONS! 🎉");
  console.log("==========================================================================");
};

runForensicAudit()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Forensic Audit Failed:", err);
    pool.end();
    process.exit(1);
  });
