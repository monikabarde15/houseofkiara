import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestOrder, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Orders & Workflow Lifecycle", () => {
  const client = createApiClient();
  let createdOrder;
  let testOrderId;

  test("Feature 8: POST /api/orders creates a new order in PostgreSQL JSONB", async () => {
    const orderPayload = generateTestOrder();
    testOrderId = orderPayload.orderId;

    const res = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(res.status), `Expected 200 or 201 on create order, got ${res.status}`);
    assert.strictEqual(res.data?.success, true, "Response success should be true");
    assert.ok(res.data?.data, "Created order data should be returned");
    assert.strictEqual(res.data.data.orderId, testOrderId, "Order ID should match created payload");
    createdOrder = res.data.data;
  });

  test("Feature 8: GET /api/orders lists all orders from the database", async () => {
    const res = await client.get("/orders");
    assert.strictEqual(res.status, 200, "Get orders should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
    assert.ok(Array.isArray(res.data?.data), "Data should be an array of orders");
    const found = res.data.data.some((o) => o.orderId === testOrderId || o.id === testOrderId);
    assert.ok(found, `Newly created order ${testOrderId} should be present in orders list`);
  });

  test("Feature 8: GET /api/orders/:id retrieves order details by orderId", async () => {
    const res = await client.get(`/orders/${testOrderId}`);
    assert.strictEqual(res.status, 200, "Get order detail should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
    assert.strictEqual(res.data.data.orderId, testOrderId, "Order ID should match");
    assert.ok(res.data.data.items?.length > 0, "Order items array should not be empty");
  });

  test("Feature 8: PATCH /api/orders/:id/status transitions workflow state and logs audit trail", async () => {
    const res = await client.patch(`/orders/${testOrderId}/status`, {
      status: "Packed",
      user: "Dispatch Team",
      remarks: "Garment steam-cleaned and placed into garment bag.",
    });
    assert.strictEqual(res.status, 200, "Status transition should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success flag should be true");
    assert.strictEqual(res.data.data.status, "Packed", "Status should be updated to Packed");
  });

  test("Feature 8: POST /api/orders/:id/logs appends internal operational logs", async () => {
    const logPayload = {
      message: "Customer called requesting delivery before 2 PM.",
      type: "Customer Note",
      user: "Operations Admin",
    };
    const res = await client.post(`/orders/${testOrderId}/logs`, logPayload);
    assert.strictEqual(res.status, 200, "Adding log should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success flag should be true");
    
    // Verify log persisted by fetching detail
    const detailRes = await client.get(`/orders/${testOrderId}`);
    assert.ok(detailRes.data.data.logs?.some((l) => l.message === logPayload.message), "Log message must be persisted in database");
  });

  test("Feature 8: PATCH /api/orders/:id/items/:index/dispatch updates item logistics details", async () => {
    const dispatchPayload = {
      dispatchedBy: "Ramesh Logistics",
      courierPartner: "Delhivery",
      trackingNumber: "DELH-88291039",
      date: new Date().toISOString().split("T")[0],
    };
    const res = await client.patch(`/orders/${testOrderId}/items/0/dispatch`, dispatchPayload);
    assert.strictEqual(res.status, 200, "Updating item dispatch should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
  });

  test("Feature 8: PATCH /api/orders/:id/items/:index/return updates return QC inspection grade", async () => {
    const returnPayload = {
      receivedDate: new Date().toISOString().split("T")[0],
      receivedBy: "Kavita QC",
      grade: "A",
      notes: "Garment inspected, zero tears or stains, all sequins intact.",
    };
    const res = await client.patch(`/orders/${testOrderId}/items/0/return`, returnPayload);
    assert.strictEqual(res.status, 200, "Updating return condition should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
  });

  test("Feature 8: GET /api/orders/:id/invoice generates printable invoice data", async () => {
    const res = await client.get(`/orders/${testOrderId}/invoice`);
    assert.strictEqual(res.status, 200, "Get invoice should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
    assert.ok(res.data.data, "Invoice data object should be returned");
  });
});
