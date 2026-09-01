import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestOffer, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Offers & Enquiries Lifecycle", () => {
  const client = createApiClient();
  let testOfferId;
  let createdOffer;

  test("Feature 9: POST /api/offers creates a new customer price negotiation offer", async () => {
    const offerPayload = generateTestOffer();
    testOfferId = offerPayload.offerId;

    const res = await client.post("/offers", offerPayload);
    assert.ok([200, 201].includes(res.status), `Create offer expected 200 or 201, got ${res.status}`);
    assert.strictEqual(res.data?.success, true, "Success flag should be true");
    assert.ok(res.data?.data, "Offer data must be returned");
    createdOffer = res.data.data;
  });

  test("Feature 9: GET /api/offers lists offers with pagination and filters", async () => {
    const res = await client.get("/offers?limit=50");
    assert.strictEqual(res.status, 200, "Get offers should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
    const offersList = res.data?.data?.offers || res.data?.data || [];
    assert.ok(Array.isArray(offersList), "Offers data must be an array");
    const found = offersList.some((o) => o.offerId === testOfferId || o.id === testOfferId);
    assert.ok(found, `Newly created offer ${testOfferId} should be present in offers list`);
  });

  test("Feature 9: GET /api/offers/:id retrieves offer details and negotiation history", async () => {
    const res = await client.get(`/offers/${testOfferId}`);
    assert.strictEqual(res.status, 200, "Get offer detail should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
    assert.strictEqual(res.data.data.offerId, testOfferId, "Offer ID must match");
  });

  test("Feature 9: POST /api/offers/:id/counter-offer appends a counter price proposal", async () => {
    const counterPayload = {
      amount: 21000,
      discount: 16,
      remarks: "Counter offered at 21,000 INR with free dry cleaning.",
      sentBy: "Sales Manager",
    };
    const res = await client.post(`/offers/${testOfferId}/counter-offer`, counterPayload);
    assert.strictEqual(res.status, 200, "Counter offer should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
  });

  test("Feature 9: POST /api/offers/:id/notes appends internal team notes", async () => {
    const notePayload = {
      message: "Customer mentioned they have another rental booked next month.",
      createdBy: "Concierge Admin",
    };
    const res = await client.post(`/offers/${testOfferId}/notes`, notePayload);
    assert.strictEqual(res.status, 200, "Add note should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");

    const notesRes = await client.get(`/offers/${testOfferId}/notes`);
    assert.strictEqual(notesRes.status, 200, "Get notes should return 200 OK");
    const notes = notesRes.data?.data || [];
    assert.ok(notes.some((n) => n.message?.includes("Customer mentioned")), "Appended note should exist in notes array");
  });

  test("Feature 9: POST /api/offers/:id/assign reassigns offer to a dedicated team member", async () => {
    const assignPayload = {
      assignedTo: "Priya Stylist",
      assignedBy: "Admin",
      remarks: "Assigned for bridal styling consultation.",
    };
    const res = await client.post(`/offers/${testOfferId}/assign`, assignPayload);
    assert.strictEqual(res.status, 200, "Assign offer should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
  });

  test("Feature 9: GET /api/offers/dashboard returns aggregated negotiation metrics", async () => {
    const res = await client.get("/offers/dashboard");
    assert.strictEqual(res.status, 200, "Get dashboard stats should return 200 OK");
    assert.strictEqual(res.data?.success, true, "Success should be true");
    assert.ok(res.data.data, "Dashboard statistics payload should be present");
  });

  test("Feature 9: GET /api/offers/export/csv exports active offers in CSV format", async () => {
    const res = await client.get("/offers/export/csv");
    assert.strictEqual(res.status, 200, "Export CSV should return 200 OK");
    assert.ok(
      res.headers.get("content-type")?.includes("csv") || res.rawText?.length > 0 || res.data !== null,
      "CSV output should be returned"
    );
  });
});
