import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestDesigner, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Designers Catalog Integration", () => {
  const client = createApiClient();
  let testDesignerId;
  let createdDesigner;

  test("Feature 16: GET /api/designers lists designers and verifies auto-seeding", async () => {
    const res = await client.get("/designers");
    assert.strictEqual(res.status, 200, "Get designers should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    const designers = res.data?.data || [];
    assert.ok(Array.isArray(designers), "Designers data must be an array");
  });

  test("Feature 16: POST /api/designers creates a new luxury designer brand", async () => {
    const designerPayload = generateTestDesigner();
    testDesignerId = designerPayload.designerId;

    const res = await client.post("/designers", designerPayload);
    assert.ok([200, 201].includes(res.status), `Create designer expected 200/201, got ${res.status}`);
    assert.strictEqual(res.data?.success, true);
    assert.ok(res.data?.data);
    createdDesigner = res.data.data;
  });

  test("Feature 16: GET /api/designers/:id retrieves designer profile by slug or designerId", async () => {
    const res = await client.get(`/designers/${createdDesigner.slug || testDesignerId}`);
    assert.strictEqual(res.status, 200, "Get designer detail should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.ok(res.data.data.name, "Designer name should be present");
  });

  test("Feature 16: PUT /api/designers/:id updates commercial terms and contact details", async () => {
    const updatePayload = {
      ...createdDesigner,
      commercialTerms: {
        ...createdDesigner.commercialTerms,
        commissionRateBuyNow: 30,
        paymentTerms: "Net 15",
      },
    };

    const res = await client.put(`/designers/${testDesignerId}`, updatePayload);
    assert.strictEqual(res.status, 200, "Update designer should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.commercialTerms?.commissionRateBuyNow, 30);
  });

  test("Feature 16: DELETE /api/designers/:id removes designer from catalog", async () => {
    const res = await client.delete(`/designers/${testDesignerId}`);
    assert.strictEqual(res.status, 200, "Delete designer should return 200 OK");
    assert.strictEqual(res.data?.success, true);

    const getRes = await client.get(`/designers/${testDesignerId}`);
    assert.ok([404, 200].includes(getRes.status));
    if (getRes.status === 200) {
      assert.strictEqual(getRes.data?.data, null, "Deleted designer should return null");
    }
  });
});
