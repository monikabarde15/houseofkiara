/**
 * HOK Admin Panel — Master E2E Test Suite Orchestrator & CLI Runner
 * Executes all 4 tiers of opaque-box E2E API tests against Express backend.
 */

import { run } from "node:test";
import { spec } from "node:test/reporters";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkServerLiveness } from "./helpers/server_harness.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000/api";

const TEST_FILES = [
  "tier1_auth.test.js",
  "tier1_orders.test.js",
  "tier1_offers.test.js",
  "tier1_calendar_dispatch.test.js",
  "tier1_returns_deposits.test.js",
  "tier1_payouts.test.js",
  "tier1_customers.test.js",
  "tier1_products.test.js",
  "tier1_designers.test.js",
  "tier1_listers.test.js",
  "tier1_lyp.test.js",
  "tier2_boundary.test.js",
  "tier3_cross_feature.test.js",
  "tier4_real_world.test.js",
];

async function main() {
  console.log("===============================================================");
  console.log("    HOK ADMIN PANEL — 4-TIER E2E TEST SUITE RUNNER           ");
  console.log("===============================================================");
  console.log(`Target Base URL : ${BASE_URL}`);
  console.log(`Test Files      : ${TEST_FILES.length} suites`);
  console.log("---------------------------------------------------------------");

  // Verify server reachability
  const health = await checkServerLiveness(BASE_URL);
  if (!health.alive) {
    console.warn(`⚠️ WARNING: Server at ${BASE_URL} is not currently responding.`);
    console.warn(`   Ensure the backend server is running via 'npm run server' or 'node backend/server.js'.`);
    console.warn(`   Running tests in standalone mode...\n`);
  } else {
    console.log(`✅ Backend server active and reachable at ${BASE_URL}\n`);
  }

  const absoluteFiles = TEST_FILES.map((f) => path.join(__dirname, f));

  const testStream = run({
    files: absoluteFiles,
    concurrency: 1, // Run sequentially to preserve clean cross-feature traces
  });

  testStream.compose(new spec()).pipe(process.stdout);

  testStream.on("test:fail", () => {
    process.exitCode = 1;
  });
}

main().catch((err) => {
  console.error("Test runner encountered a critical error:", err);
  process.exit(1);
});
