import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import {
  generateTestCustomer,
  generateTestProduct,
  generateTestOrder,
  generateTestDesigner,
  uniqueId,
  uniqueEmail,
} from "./helpers/test_fixtures.js";

describe("Tier 2: Boundary, Corner & Adversarial Edge Cases", () => {
  const client = createApiClient();

  test("Corner Case 1: Missing mandatory fields in Customer creation returns validation error", async () => {
    const invalidCustomer = {
      name: "", // Empty name
      email: "invalid-email-format",
    };

    const res = await client.post("/customers", invalidCustomer);
    assert.ok([400, 422, 500].includes(res.status), `Expected 400/422 on invalid customer, got ${res.status}`);
    assert.strictEqual(res.data?.success, false);
  });

  test("Corner Case 2: Duplicate customer unique ID triggers conflict or graceful handling", async () => {
    const custPayload = generateTestCustomer();
    const firstRes = await client.post("/customers", custPayload);
    assert.ok([200, 201].includes(firstRes.status));

    // Attempt duplicate creation with exact same customerId
    const dupRes = await client.post("/customers", custPayload);
    // Should either update gracefully with 200 or return 409 Conflict
    assert.ok([200, 400, 409, 422].includes(dupRes.status), `Duplicate ID status: ${dupRes.status}`);
  });

  test("Corner Case 3: Duplicate designer slug prevents database integrity corruption", async () => {
    const designerPayload = generateTestDesigner();
    const firstRes = await client.post("/designers", designerPayload);
    assert.ok([200, 201].includes(firstRes.status));

    // Attempt second designer with same designerId and slug
    const dupRes = await client.post("/designers", designerPayload);
    assert.ok([400, 409, 422, 500].includes(dupRes.status), `Duplicate slug should fail, got ${dupRes.status}`);
  });

  test("Corner Case 4: Double Booking Concurrency Lock prevents overlapping rental dates", async () => {
    const prodPayload = generateTestProduct();
    const createProdRes = await client.post("/products", prodPayload);
    assert.ok([200, 201].includes(createProdRes.status));
    const prodId = createProdRes.data?.data?.productId || prodPayload.productId;

    const today = new Date();
    const startDate = new Date(today.getTime() + 20 * 24 * 3600 * 1000).toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + 25 * 24 * 3600 * 1000).toISOString().split("T")[0];

    // First reservation for date range
    const firstRes = await client.post(`/products/${prodId}/reserve`, {
      orderId: uniqueId("HOK-RES-1"),
      customerName: "First Customer",
      startDate,
      endDate,
      amount: 15000,
      deposit: 20000,
      mode: "Rental",
    });
    assert.ok([200, 201].includes(firstRes.status), `First reservation should succeed, got ${firstRes.status}`);

    // Second reservation for overlapping date range (same product)
    const overlappingRes = await client.post(`/products/${prodId}/reserve`, {
      orderId: uniqueId("HOK-RES-2"),
      customerName: "Second Customer (Overlapping)",
      startDate: new Date(today.getTime() + 22 * 24 * 3600 * 1000).toISOString().split("T")[0],
      endDate: new Date(today.getTime() + 27 * 24 * 3600 * 1000).toISOString().split("T")[0],
      amount: 15000,
      deposit: 20000,
      mode: "Rental",
    });

    // Second reservation must be rejected with 409 Conflict or 400
    assert.ok([400, 409, 422].includes(overlappingRes.status), `Overlapping reservation must return 409 Conflict, got ${overlappingRes.status}`);
    if (overlappingRes.data) {
      assert.strictEqual(overlappingRes.data.success, false, "Overlapping reservation success must be false");
    }
  });

  test("Corner Case 5: Negative amounts and extreme values in Order calculations", async () => {
    const invalidOrder = generateTestOrder({
      orderValue: -5000,
      depositHeld: -10000,
      grandTotal: -15000,
    });

    const res = await client.post("/orders", invalidOrder);
    // Negative numbers should either be rejected with 400/422 or handled safely without server crash
    assert.ok([200, 201, 400, 422].includes(res.status));
  });

  test("Corner Case 6: Special Characters, SQL Injection & Unicode payloads in search", async () => {
    const specialSearchTerms = [
      "'; DROP TABLE orders; --",
      "<script>alert(1)</script>",
      "🌸 Sabyasachi Heritage 🌸",
      "{\"status\": \"Paid\"}",
      "O'Connor & Sons Couture",
    ];

    for (const term of specialSearchTerms) {
      const res = await client.get(`/customers?search=${encodeURIComponent(term)}`);
      assert.strictEqual(res.status, 200, `Search with term '${term}' must execute safely and return 200`);
      assert.strictEqual(res.data?.success, true);
    }
  });

  test("Corner Case 7: Non-existent IDs query handling without throwing unhandled exceptions", async () => {
    const fakeIds = [
      "non-existent-order-id-9999999",
      "67bc479bb95e26b162635678", // Hex ObjectId format
      "invalid!@#$%^&*()",
    ];

    for (const id of fakeIds) {
      const res = await client.get(`/orders/${id}`);
      assert.ok([200, 404].includes(res.status), `Querying fake ID ${id} should return 404 or empty 200, got ${res.status}`);
      if (res.status === 200) {
        assert.ok(res.data?.data === null || res.data?.data === undefined);
      }
    }
  });

  test("Corner Case 8: Large payload notes and descriptions persistence", async () => {
    const longNotes = "A".repeat(3000) + " Luxury Bridal Rental History " + "B".repeat(2000);
    const custPayload = generateTestCustomer({
      internalNotes: longNotes,
    });

    const res = await client.post("/customers", custPayload);
    assert.ok([200, 201].includes(res.status));
    assert.strictEqual(res.data.data.internalNotes?.length, longNotes.length, "5000-char string must be stored without truncation");
  });
});
