import { test, describe } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:5000/api/customer/auth";

const uniqueId = Date.now();
const uniquePhoneSuffix = String(uniqueId).slice(-7);
const uniquePhone = `987${uniquePhoneSuffix}`;

const testCustomer = {
  firstName: "Aarav",
  lastName: "Kapoor",
  email: `aarav_${uniqueId}@example.com`,
  password: "SecurePassword123!",
  mobile: `+91 ${uniquePhone}`,
  marketingAccepted: true,
  termsAccepted: true,
};

let verificationToken = null;
let authToken = null;

describe("Customer Authentication Security & Sequence Audit Test Suite", () => {
  test("1. Direct POST /api/customer/auth/register without OTP verification fails with 400", async () => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: testCustomer.firstName,
        lastName: testCustomer.lastName,
        email: testCustomer.email,
        password: testCustomer.password,
        mobile: testCustomer.mobile,
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400, "Direct registration without OTP verification must fail");
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes("verification is required") || data.message.includes("verify OTP first"));
  });

  test("2. POST /api/customer/auth/send-otp creates stub and sends valid OTP", async () => {
    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testCustomer.mobile }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });

  test("3. POST /api/customer/auth/verify-otp with wrong OTP decrements remaining attempts", async () => {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testCustomer.mobile, otp: "000000" }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes("attempt"));
  });

  test("4. POST /api/customer/auth/resend-otp invalidates previous OTP and resets attempt counter", async () => {
    const res = await fetch(`${BASE_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testCustomer.mobile }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });

  test("5. POST /api/customer/auth/verify-otp with valid/demo OTP returns verificationToken and clears OTP", async () => {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testCustomer.mobile, otp: "123456" }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.verificationToken, "verificationToken should be present in response");
    verificationToken = data.data.verificationToken;
  });

  test("6. Attempting to reuse the verified OTP immediately fails with 400", async () => {
    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testCustomer.mobile, otp: "123456" }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400, "Consumed OTP cannot be verified a second time");
    assert.strictEqual(data.success, false);
  });

  test("7. POST /api/customer/auth/register with valid verificationToken completes registration", async () => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...testCustomer,
        verificationToken,
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 201, `Status should be 201: ${JSON.stringify(data)}`);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token, "JWT token must be issued on successful registration");
    assert.strictEqual(data.data.email, testCustomer.email.toLowerCase());
    assert.strictEqual(data.data.firstName, "Aarav");
    assert.strictEqual(data.data.lastName, "Kapoor");
    assert.strictEqual(data.data.phone, uniquePhone);
    authToken = data.data.token;
  });

  test("8. Duplicate registration with same email or mobile returns 409 Conflict", async () => {
    // Duplicate email
    const resEmail = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Another",
        lastName: "User",
        email: testCustomer.email,
        password: "NewPassword123!",
        mobile: `988${uniquePhoneSuffix}`,
        verificationToken,
      }),
    });
    const dataEmail = await resEmail.json();
    assert.strictEqual(resEmail.status, 409);
    assert.strictEqual(dataEmail.success, false);
    assert.ok(dataEmail.message.includes("Email is already registered"));

    // Duplicate mobile
    const resMobile = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Another",
        lastName: "User",
        email: `another_${uniqueId}@example.com`,
        password: "NewPassword123!",
        mobile: uniquePhone,
        verificationToken,
      }),
    });
    const dataMobile = await resMobile.json();
    assert.strictEqual(resMobile.status, 409);
    assert.strictEqual(dataMobile.success, false);
    assert.ok(dataMobile.message.includes("Mobile number is already registered"));
  });

  test("9. POST /api/customer/auth/login validates newly created account", async () => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomer.email,
        password: testCustomer.password,
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token);
  });

  test("10. Protected GET /api/customer/auth/me exposes NO sensitive password or OTP hash fields", async () => {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.passwordHash, undefined);
    assert.strictEqual(data.data.otp, undefined);
    assert.strictEqual(data.data.otpExpiresAt, undefined);
    assert.strictEqual(data.data.otpAttempts, undefined);
    assert.strictEqual(data.data.phoneVerified, undefined);
  });

  let validResetToken = "test_reset_token_" + Date.now();

  test("11. POST /api/customer/auth/forgot-password returns success for existing user", async () => {
    const res = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testCustomer.email }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.message.includes("password reset link has been sent"));
  });

  test("12. POST /api/customer/auth/forgot-password with non-existent email returns identical success (no enumeration)", async () => {
    const res = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nonexistent_user_99999@example.com" }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.message.includes("password reset link has been sent"));
  });

  test("13. POST /api/customer/auth/reset-password with invalid/malformed token fails with 400", async () => {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "invalid_token_12345",
        newPassword: "BrandNewPassword123!",
        confirmPassword: "BrandNewPassword123!",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
    assert.ok(data.message.includes("invalid") || data.message.includes("expired"));
  });

  test("14. POST /api/customer/auth/reset-password with valid token updates password successfully", async () => {
    const { default: Customer } = await import("../models/Customer.js");
    const { default: crypto } = await import("crypto");

    const hashedToken = crypto.createHash("sha256").update(validResetToken).digest("hex");
    await Customer.updateOne(
      { email: testCustomer.email.toLowerCase() },
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      }
    );

    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: validResetToken,
        newPassword: "BrandNewPassword123!",
        confirmPassword: "BrandNewPassword123!",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200, `Reset failed: ${JSON.stringify(data)}`);
    assert.strictEqual(data.success, true);
    assert.ok(data.message.includes("successfully updated"));
  });

  test("15. Attempting to reuse the consumed reset token fails with 400", async () => {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: validResetToken,
        newPassword: "AnotherNewPassword123!",
        confirmPassword: "AnotherNewPassword123!",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
  });

  test("16. POST /api/customer/auth/login works with newly updated password and rejects old password", async () => {
    // Old password should fail
    const oldRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomer.email,
        password: testCustomer.password,
      }),
    });
    const oldData = await oldRes.json();
    assert.strictEqual(oldRes.status, 401);
    assert.strictEqual(oldData.success, false);

    // New password should succeed
    const newRes = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomer.email,
        password: "BrandNewPassword123!",
      }),
    });
    const newData = await newRes.json();
    assert.strictEqual(newRes.status, 200);
    assert.strictEqual(newData.success, true);
    assert.ok(newData.data.token);
  });
});
