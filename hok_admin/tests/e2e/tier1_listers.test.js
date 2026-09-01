import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestLister, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Listers Management & KYC", () => {
  const client = createApiClient();
  let testListerId;
  let createdLister;

  test("Feature 17: POST /api/listers creates a new wardrobe lister profile", async () => {
    const listerPayload = generateTestLister();
    testListerId = listerPayload.listerId;

    const res = await client.post("/listers", listerPayload);
    assert.ok([200, 201].includes(res.status), `Create lister expected 200/201, got ${res.status}`);
    assert.strictEqual(res.data?.success, true);
    assert.ok(res.data?.data);
    createdLister = res.data.data;
  });

  test("Feature 17: GET /api/listers lists listers with status and verification filters", async () => {
    const res = await client.get("/listers");
    assert.strictEqual(res.status, 200, "Get listers should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    const listers = res.data?.data || [];
    assert.ok(Array.isArray(listers), "Listers data must be an array");
    const found = listers.some((l) => l.listerId === testListerId || l.id === testListerId);
    assert.ok(found, `Lister ${testListerId} should appear in listers list`);
  });

  test("Feature 17: GET /api/listers/:id retrieves lister profile details", async () => {
    const res = await client.get(`/listers/${testListerId}`);
    assert.strictEqual(res.status, 200, "Get lister by ID should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.listerId, testListerId);
  });

  test("Feature 17: PUT /api/listers/:id updates lister profile and notes", async () => {
    const updatePayload = {
      ...createdLister,
      city: "Mumbai",
      notes: "Top lister with multiple Sabyasachi bridal pieces.",
    };

    const res = await client.put(`/listers/${testListerId}`, updatePayload);
    assert.strictEqual(res.status, 200, "Update lister should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.city, "Mumbai");
  });

  test("Feature 17: PUT /api/listers/:id/bank-details updates KYC banking information", async () => {
    const bankPayload = {
      accountHolder: "Pooja Singhania",
      accountNumber: "11223344556677",
      ifsc: "ICIC0000001",
      bankName: "ICICI Bank",
      branch: "Bandra West",
      upi: "pooja@icici",
      verified: true,
    };

    const res = await client.put(`/listers/${testListerId}/bank-details`, bankPayload);
    assert.strictEqual(res.status, 200, "Update bank details should return 200 OK");
    assert.strictEqual(res.data?.success, true);

    const getRes = await client.get(`/listers/${testListerId}`);
    assert.strictEqual(getRes.data.data.bankDetails?.ifsc, "ICIC0000001", "Updated IFSC code must be persisted");
  });

  test("Feature 17: DELETE /api/listers/:id removes lister from database", async () => {
    const res = await client.delete(`/listers/${testListerId}`);
    assert.strictEqual(res.status, 200, "Delete lister should return 200 OK");
    assert.strictEqual(res.data?.success, true);

    const getRes = await client.get(`/listers/${testListerId}`);
    assert.ok([404, 200].includes(getRes.status));
    if (getRes.status === 200) {
      assert.strictEqual(getRes.data?.data, null, "Deleted lister should return null");
    }
  });
});
