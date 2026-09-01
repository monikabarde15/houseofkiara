import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestCustomer, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Customers CRUD & Subdocuments", () => {
  const client = createApiClient();
  let testCustomerId;
  let createdCustomer;

  test("Feature 14: POST /api/customers creates a new customer profile", async () => {
    const customerPayload = generateTestCustomer();
    testCustomerId = customerPayload.customerId;

    const res = await client.post("/customers", customerPayload);
    assert.ok([200, 201].includes(res.status), `Create customer expected 200/201, got ${res.status}`);
    assert.strictEqual(res.data?.success, true);
    assert.ok(res.data?.data);
    assert.strictEqual(res.data.data.customerId, testCustomerId);
    createdCustomer = res.data.data;
  });

  test("Feature 14: GET /api/customers lists customers and supports multi-field search", async () => {
    const res = await client.get(`/customers?search=${encodeURIComponent(createdCustomer.name)}`);
    assert.strictEqual(res.status, 200, "Get customers should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    const customers = res.data?.data || [];
    assert.ok(Array.isArray(customers), "Customers data must be an array");
    const found = customers.some((c) => c.customerId === testCustomerId || c.id === testCustomerId);
    assert.ok(found, `Customer ${testCustomerId} should be returned in search results`);
  });

  test("Feature 14: GET /api/customers/:id retrieves customer profile by customerId", async () => {
    const res = await client.get(`/customers/${testCustomerId}`);
    assert.strictEqual(res.status, 200, "Get customer detail should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.customerId, testCustomerId);
    assert.strictEqual(res.data.data.email, createdCustomer.email);
  });

  test("Feature 14: PUT /api/customers/:id updates customer profile fields", async () => {
    const updatePayload = {
      ...createdCustomer,
      location: "New Delhi, Delhi",
      internalNotes: "VIP customer - prefers high-end couture lehengas.",
    };

    const res = await client.put(`/customers/${testCustomerId}`, updatePayload);
    assert.strictEqual(res.status, 200, "Update customer should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.location, "New Delhi, Delhi");
  });

  test("Feature 14: POST /api/customers/:id/addresses appends delivery address to subdocument array", async () => {
    const addressPayload = {
      id: uniqueId("ADDR"),
      label: "Studio Address",
      address: "Studio 12, Fashion Street, Hauz Khas Village, New Delhi 110016",
      isDefault: false,
    };

    const res = await client.post(`/customers/${testCustomerId}/addresses`, addressPayload);
    assert.strictEqual(res.status, 200, "Add address should return 200 OK");
    assert.strictEqual(res.data?.success, true);

    const detailRes = await client.get(`/customers/${testCustomerId}`);
    const addresses = detailRes.data.data.addresses || [];
    assert.ok(addresses.some((a) => a.label === "Studio Address"), "Appended address must exist in customer addresses");
  });

  test("Feature 14: POST /api/customers/:id/occasions appends special occasion", async () => {
    const occasionPayload = {
      id: uniqueId("OCC"),
      occasion: "Friend's Sangeet Ceremony",
      date: "2026-12-15",
    };

    const res = await client.post(`/customers/${testCustomerId}/occasions`, occasionPayload);
    assert.strictEqual(res.status, 200, "Add occasion should return 200 OK");
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 14: POST /api/customers/:id/communication-log records interaction entry", async () => {
    const commPayload = {
      message: "Sent sizing guide and color palette via WhatsApp.",
      channel: "WhatsApp",
    };

    const res = await client.post(`/customers/${testCustomerId}/communication-log`, commPayload);
    assert.strictEqual(res.status, 200, "Add comm log should return 200 OK");
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 14: DELETE /api/customers/:id deletes customer record", async () => {
    const res = await client.delete(`/customers/${testCustomerId}`);
    assert.strictEqual(res.status, 200, "Delete customer should return 200 OK");
    assert.strictEqual(res.data?.success, true);

    // Verify deletion
    const getRes = await client.get(`/customers/${testCustomerId}`);
    assert.ok([404, 200].includes(getRes.status));
    if (getRes.status === 200) {
      assert.strictEqual(getRes.data?.data, null, "Deleted customer data should be null");
    }
  });
});
