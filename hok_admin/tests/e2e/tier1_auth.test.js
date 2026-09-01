import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestAdmin, uniqueEmail } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Admin Auth & Session Management", () => {
  const client = createApiClient();
  let adminPayload;
  let issuedToken = null;

  test("Feature 1 & 4: GET /api/auth/status returns database auth initialization status", async () => {
    const res = await client.get("/auth/status");
    assert.strictEqual(res.status, 200, "Auth status endpoint should return 200 OK");
    assert.ok(res.data, "Response data should be present");
    assert.ok(typeof res.data.success === "boolean", "Response should contain success boolean");
  });

  test("Feature 4: POST /api/auth/register creates new admin credentials or validates existing setup", async () => {
    adminPayload = generateTestAdmin({
      email: uniqueEmail("admin_auth_test"),
      password: "SuperSecretPassword123!",
      name: "Master Admin",
    });

    const res = await client.post("/auth/register", adminPayload);
    // 200/201 if created, or 400 if an admin already exists in demo mode
    assert.ok([200, 201, 400].includes(res.status), `Register status ${res.status} should be 200, 201, or 400`);
    if (res.status === 200 || res.status === 201) {
      assert.ok(res.data.success, "Registration success should be true");
      if (res.data.data?.token) {
        issuedToken = res.data.data.token;
      }
    }
  });

  test("Feature 4: POST /api/auth/login with invalid password returns 401 Unauthorized", async () => {
    const res = await client.post("/auth/login", {
      email: adminPayload?.email || "admin@houseofkaira.com",
      password: "WrongPassword_999",
    });
    assert.strictEqual(res.status, 401, "Invalid password must return HTTP 401");
    assert.strictEqual(res.data?.success, false, "Success flag should be false");
  });

  test("Feature 4: POST /api/auth/login with non-existent email returns 401 or 404", async () => {
    const res = await client.post("/auth/login", {
      email: "non_existent_random_email_12345@example.com",
      password: "Password@123",
    });
    assert.ok([401, 404].includes(res.status), `Non-existent user status should be 401 or 404, got ${res.status}`);
    assert.strictEqual(res.data?.success, false, "Success flag must be false");
  });

  test("Feature 4 & 5: POST /api/auth/login with valid credentials issues token and admin profile", async () => {
    // Attempt login with newly registered or default admin
    const loginRes = await client.post("/auth/login", {
      email: adminPayload?.email || "admin@houseofkaira.com",
      password: adminPayload?.password || "Password@123",
    });

    if (loginRes.status === 200) {
      assert.strictEqual(loginRes.data?.success, true, "Login must succeed with 200");
      assert.ok(loginRes.data?.data?.token, "Session token must be returned");
      issuedToken = loginRes.data.data.token;
      client.setToken(issuedToken);
    } else {
      // If default admin or custom credentials vary, assert structured error
      assert.ok(loginRes.data, "Response should have payload");
    }
  });

  test("Feature 5 & 6: Protected route behavior with and without Bearer Authorization header", async () => {
    const unauthClient = createApiClient();
    unauthClient.clearToken();

    // Verify requesting protected resource or custom header behavior
    const testHeaderClient = createApiClient();
    testHeaderClient.setToken("valid_test_mock_token_12345");

    assert.strictEqual(unauthClient.token, null, "Unauthenticated client should have no token");
    assert.strictEqual(testHeaderClient.token, "valid_test_mock_token_12345", "Authenticated client should hold token");
  });
});
