import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestPayout, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Payouts to Listers", () => {
  const client = createApiClient();
  let testPayoutId;
  let testProductId;
  let testListerId;
  let createdPayout;

  test("Feature 13: POST /api/payouts creates a new lister payout record", async () => {
    testProductId = uniqueId("HOK-PRD-PAY");
    testListerId = uniqueId("LST-PAY");
    const payoutPayload = generateTestPayout({
      productId: testProductId,
      listerId: testListerId,
      transactionAmount: 25000,
      payoutPercentage: 80,
      listerShare: 20000,
      hokCommission: 5000,
      taxDeduction: 2000,
      netPayout: 18000,
    });
    testPayoutId = payoutPayload.payoutId;

    const res = await client.post("/payouts", payoutPayload);
    assert.ok([200, 201].includes(res.status), `Expected 200 or 201 on create payout, got ${res.status}`);
    assert.strictEqual(res.data?.success, true);
    assert.ok(res.data?.data);
    createdPayout = res.data.data;
  });

  test("Feature 13: GET /api/payouts lists all payouts and supports filtering by lister/status", async () => {
    const res = await client.get(`/payouts?listerId=${testListerId}`);
    assert.strictEqual(res.status, 200, "Get payouts should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    const payouts = res.data?.data || [];
    assert.ok(Array.isArray(payouts), "Payouts data must be an array");
    const found = payouts.some((p) => p.payoutId === testPayoutId || p.id === testPayoutId);
    assert.ok(found, `Created payout ${testPayoutId} should be returned in filtered list`);
  });

  test("Feature 13: GET /api/payouts/:id retrieves payout details by payoutId", async () => {
    const res = await client.get(`/payouts/${testPayoutId}`);
    assert.strictEqual(res.status, 200, "Get payout detail should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.payoutId, testPayoutId);
    assert.strictEqual(res.data.data.netPayout, 18000);
  });

  test("Feature 13: PATCH /api/payouts/:id/paid records transaction reference and marks payout as Paid", async () => {
    const paidPayload = {
      paidBy: "Finance Lead",
      paymentReference: "UTR-HDFC-9928172635",
      taxDeduction: 2000,
    };

    const res = await client.patch(`/payouts/${testPayoutId}/paid`, paidPayload);
    assert.strictEqual(res.status, 200, "Mark payout paid should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.status, "Paid", "Payout status must be 'Paid'");
    assert.strictEqual(res.data.data.paymentReference, "UTR-HDFC-9928172635");
  });

  test("Feature 13: GET /api/products/:productId/payout-history queries historical payouts for a piece", async () => {
    const res = await client.get(`/products/${testProductId}/payout-history`);
    assert.strictEqual(res.status, 200, "Get product payout history should return 200 OK");
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 13: GET /api/payouts/export/csv exports payout queue in CSV format", async () => {
    const res = await client.get("/payouts/export/csv");
    assert.strictEqual(res.status, 200, "Export payouts CSV should return 200 OK");
    assert.ok(
      res.headers.get("content-type")?.includes("csv") || res.rawText?.length > 0 || res.data !== null,
      "CSV output must be returned"
    );
  });
});
