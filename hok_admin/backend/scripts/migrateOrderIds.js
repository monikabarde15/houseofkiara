// One-time migration: rename every existing order to the frozen format
//   HOK-REN-26-0001 / HOK-PRL-26-0031 / HOK-NEW-26-0008
// and update every place that mentions the old order id (payouts, products'
// booking history, offers, customers, messages, notifications, logs ...).
//
// Usage (from hok_admin/backend):
//   node scripts/migrateOrderIds.js            -> DRY RUN, only prints the mapping
//   node scripts/migrateOrderIds.js --apply    -> writes a backup file, then applies
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, pool } from "../config/db.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import Product from "../models/Product.js";
import Offer from "../models/Offer.js";
import Customer from "../models/Customer.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import Submission from "../models/Submission.js";
import Task from "../models/Task.js";
import { ORDER_ID_REGEX, orderTypeCode, yearCode } from "../services/orderIdService.js";

const APPLY = process.argv.includes("--apply");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const toObj = (d) => (d && typeof d.toObject === "function" ? d.toObject() : d);

const orderTimestamp = (o) => {
  const raw = o.orderDate || o.createdAt;
  const t = raw ? new Date(raw).getTime() : NaN;
  if (!Number.isNaN(t)) return t;
  const m = String(o.orderId || "").match(/^HOK-ORD-(\d{13})$/);
  return m ? Number(m[1]) : 0;
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function run() {
  await connectDB(2);
  const orders = (await Order.find({})).map(toObj);
  console.log(`Orders found: ${orders.length}`);

  // 1. Build old -> new mapping (oldest first, per type + year)
  const counters = new Map(); // prefix -> last number
  orders.forEach((o) => {
    const id = String(o.orderId || "");
    if (ORDER_ID_REGEX.test(id)) {
      const prefix = id.slice(0, 11); // HOK-REN-26-
      counters.set(prefix, Math.max(counters.get(prefix) || 0, parseInt(id.slice(11), 10)));
    }
  });

  const mapping = new Map();
  [...orders]
    .filter((o) => o.orderId && !ORDER_ID_REGEX.test(String(o.orderId)))
    .sort((a, b) => orderTimestamp(a) - orderTimestamp(b))
    .forEach((o) => {
      const ts = orderTimestamp(o);
      const prefix = `HOK-${orderTypeCode(
        Array.isArray(o.items) && o.items.length ? o.items : o.mode,
      )}-${yearCode(ts ? new Date(ts) : new Date())}-`;
      const n = (counters.get(prefix) || 0) + 1;
      counters.set(prefix, n);
      mapping.set(String(o.orderId), `${prefix}${String(n).padStart(4, "0")}`);
    });

  console.log(`Orders to rename: ${mapping.size}`);
  [...mapping.entries()].forEach(([o, n]) => console.log(`  ${o}  ->  ${n}`));

  if (!mapping.size) {
    console.log("Nothing to do.");
    return;
  }
  if (!APPLY) {
    console.log("\nDRY RUN only. Re-run with --apply to write the changes.");
    return;
  }

  const backupFile = path.join(
    __dirname,
    `order_id_migration_${Date.now()}.json`,
  );
  fs.writeFileSync(
    backupFile,
    JSON.stringify(Object.fromEntries(mapping), null, 2),
  );
  console.log(`Mapping backup written: ${backupFile}`);

  // 2. One regex for every old id (longest first, never match inside a longer id)
  const olds = [...mapping.keys()].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(?<![A-Za-z0-9-])(${olds.map(escapeRe).join("|")})(?![A-Za-z0-9])`, "g");
  const swap = (s) => s.replace(re, (m) => mapping.get(m) || m);

  const walk = (val) => {
    if (typeof val === "string") return swap(val);
    if (Array.isArray(val)) return val.map(walk);
    if (val && typeof val === "object" && !(val instanceof Date)) {
      const out = {};
      for (const [k, v] of Object.entries(val)) out[k] = walk(v);
      return out;
    }
    return val;
  };

  // 3. Rewrite every collection that can mention an order id
  const models = [
    ["orders", Order],
    ["payouts", Payout],
    ["products", Product],
    ["offers", Offer],
    ["customers", Customer],
    ["messages", Message],
    ["notifications", Notification],
    ["submissions", Submission],
    ["tasks", Task],
  ];

  for (const [label, Model] of models) {
    let changed = 0;
    const docs = (await Model.find({}).catch(() => [])).map(toObj);
    for (const d of docs) {
      const patch = {};
      for (const [k, v] of Object.entries(d)) {
        if (k === "_id") continue;
        const before = JSON.stringify(v);
        if (before === undefined || !re.test(before)) {
          re.lastIndex = 0;
          continue;
        }
        re.lastIndex = 0;
        patch[k] = walk(v);
      }
      if (Object.keys(patch).length) {
        await Model.findOneAndUpdate({ _id: d._id }, { $set: patch });
        changed += 1;
      }
    }
    console.log(`${label}: ${changed} document(s) updated`);
  }

  // Orders that had no orderDate lose their timestamp-id fallback, so keep it.
  for (const o of orders) {
    if (mapping.has(String(o.orderId)) && !o.orderDate) {
      const ts = orderTimestamp(o);
      if (ts) {
        await Order.findOneAndUpdate(
          { _id: o._id },
          { $set: { orderDate: new Date(ts).toISOString() } },
        );
      }
    }
  }

  console.log("Done. Restart the backend and refresh the admin panel.");
}

run()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await pool.end();
    } catch {}
  });
