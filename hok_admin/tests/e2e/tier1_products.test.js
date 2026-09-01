import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestProduct, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Products Catalogue & Booking Engine", () => {
  const client = createApiClient();
  let testProductId;
  let createdProduct;

  test("Feature 15: POST /api/products creates a new luxury piece in the catalogue", async () => {
    const productPayload = generateTestProduct();
    testProductId = productPayload.productId;

    const res = await client.post("/products", productPayload);
    assert.ok([200, 201].includes(res.status), `Create product expected 200/201, got ${res.status}`);
    assert.strictEqual(res.data?.success, true);
    assert.ok(res.data?.data);
    assert.strictEqual(res.data.data.productId, testProductId);
    createdProduct = res.data.data;
  });

  test("Feature 15: GET /api/products lists products with category and status filters", async () => {
    const res = await client.get("/products?category=Lehengas");
    assert.strictEqual(res.status, 200, "Get products should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    const products = res.data?.data || [];
    assert.ok(Array.isArray(products), "Products data must be an array");
    const found = products.some((p) => p.productId === testProductId || p.id === testProductId);
    assert.ok(found, `Created product ${testProductId} must appear in listing`);
  });

  test("Feature 15: GET /api/products/:id retrieves product specification", async () => {
    const res = await client.get(`/products/${testProductId}`);
    assert.strictEqual(res.status, 200, "Get product by ID should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.productId, testProductId);
    assert.strictEqual(res.data.data.rentalPrice, 15000);
  });

  test("Feature 15: PUT /api/products/:id updates pricing, deposit and metadata", async () => {
    const updatePayload = {
      ...createdProduct,
      rentalPrice: 17500,
      securityDeposit: 22000,
      description: "Updated luxury raw silk bridal lehenga with handcrafted zardozi.",
    };

    const res = await client.put(`/products/${testProductId}`, updatePayload);
    assert.strictEqual(res.status, 200, "Update product should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.rentalPrice, 17500);
  });

  test("Feature 15: GET /api/products/:id/availability verifies date range check with buffer days", async () => {
    const today = new Date();
    const startDate = new Date(today.getTime() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0];

    const res = await client.get(`/products/${testProductId}/availability?startDate=${startDate}&endDate=${endDate}&mode=Rental`);
    assert.strictEqual(res.status, 200, "Check availability should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    assert.strictEqual(res.data.data.available, true, "Unbooked date range should be available");
  });

  test("Feature 15: POST /api/products/:id/reserve reserves product dates atomically", async () => {
    const today = new Date();
    const startDate = new Date(today.getTime() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0];

    const reservePayload = {
      orderId: uniqueId("HOK-RES-ORD"),
      customerName: "Pooja Hegde",
      startDate,
      endDate,
      amount: 17500,
      deposit: 22000,
      mode: "Rental",
    };

    const res = await client.post(`/products/${testProductId}/reserve`, reservePayload);
    assert.ok([200, 201].includes(res.status), `Reserve product expected 200/201, got ${res.status}`);
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 15: PATCH /api/products/:id/measurements updates garment sizing dimensions", async () => {
    const measurementsPayload = {
      measurements: {
        bust: 38,
        waist: 30,
        hips: 40,
        length: 43,
      },
    };

    const res = await client.patch(`/products/${testProductId}/measurements`, measurementsPayload);
    assert.strictEqual(res.status, 200, "Update measurements should return 200 OK");
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 15: PATCH /api/products/:id/archive and /restore toggles catalog availability", async () => {
    const archiveRes = await client.patch(`/products/${testProductId}/archive`, { user: "Admin" });
    assert.strictEqual(archiveRes.status, 200, "Archive product should return 200 OK");
    assert.strictEqual(archiveRes.data?.success, true);

    const restoreRes = await client.patch(`/products/${testProductId}/restore`, { user: "Admin" });
    assert.strictEqual(restoreRes.status, 200, "Restore product should return 200 OK");
    assert.strictEqual(restoreRes.data?.success, true);
  });
});
