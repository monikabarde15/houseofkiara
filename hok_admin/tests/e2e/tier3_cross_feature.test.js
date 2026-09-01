import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import {
  generateTestCustomer,
  generateTestProduct,
  generateTestOrder,
  generateTestOffer,
  generateTestLister,
  generateTestPayout,
  uniqueId,
  uniqueEmail,
} from "./helpers/test_fixtures.js";

describe("Tier 3: Cross-Feature Interactions & Multi-Domain Workflows", () => {
  const client = createApiClient();

  test("Flow 1: Order Status Progression -> Lister Commission & Payout Settlement", async () => {
    // 1. Onboard Lister
    const listerPayload = generateTestLister({
      listerId: uniqueId("LST-CF"),
      payoutPercentages: { rental: 80, buy: 70 },
    });
    const listerRes = await client.post("/listers", listerPayload);
    assert.ok([200, 201].includes(listerRes.status));

    // 2. Create Order with Lister's item
    const orderPayload = generateTestOrder({
      orderId: uniqueId("HOK-ORD-CF1"),
      orderValue: 20000,
      depositHeld: 15000,
      listerPayout: 16000, // 80% of 20,000
      status: "Confirmed",
    });
    const orderRes = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(orderRes.status));

    // 3. Step through workflow: Confirmed -> Dispatched -> Delivered -> Returned
    await client.patch(`/orders/${orderPayload.orderId}/status`, { status: "Dispatched", user: "Logistics" });
    await client.patch(`/orders/${orderPayload.orderId}/status`, { status: "Delivered", user: "Courier" });
    await client.patch(`/orders/${orderPayload.orderId}/status`, { status: "Returned", user: "QC Team" });

    // 4. Create / Verify Payout Record
    const payoutPayload = generateTestPayout({
      orderId: orderPayload.orderId,
      listerId: listerPayload.listerId,
      transactionAmount: 20000,
      payoutPercentage: 80,
      listerShare: 16000,
      hokCommission: 4000,
      netPayout: 14400, // 16,000 - 10% TDS (1,600)
    });
    const payoutRes = await client.post("/payouts", payoutPayload);
    assert.ok([200, 201].includes(payoutRes.status));
    assert.strictEqual(payoutRes.data.data.netPayout, 14400);

    // 5. Settle Payout
    const settleRes = await client.patch(`/payouts/${payoutPayload.payoutId}/paid`, {
      paidBy: "Finance",
      paymentReference: "UTR-CROSS-FLOW-001",
    });
    assert.strictEqual(settleRes.status, 200);
    assert.strictEqual(settleRes.data.data.status, "Paid");
  });

  test("Flow 2: Product Booking -> Calendar Occupancy & Availability Lock", async () => {
    // 1. Create Product
    const prodPayload = generateTestProduct({
      productId: uniqueId("HOK-PRD-CF2"),
      minimumDurationDays: 3,
    });
    const prodRes = await client.post("/products", prodPayload);
    assert.ok([200, 201].includes(prodRes.status));

    const today = new Date();
    const startDate = new Date(today.getTime() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0];
    const endDate = new Date(today.getTime() + 34 * 24 * 3600 * 1000).toISOString().split("T")[0];

    // 2. Check initial availability (should be available)
    const availBefore = await client.get(`/products/${prodPayload.productId}/availability?startDate=${startDate}&endDate=${endDate}&mode=Rental`);
    assert.strictEqual(availBefore.status, 200);
    assert.strictEqual(availBefore.data.data.available, true);

    // 3. Book Product for dates
    const bookRes = await client.post(`/products/${prodPayload.productId}/reserve`, {
      orderId: uniqueId("HOK-ORD-LOCK"),
      customerName: "Ritu Kumar",
      startDate,
      endDate,
      amount: 15000,
      deposit: 20000,
      mode: "Rental",
    });
    assert.ok([200, 201].includes(bookRes.status));

    // 4. Verify calendar / booking reflection
    const calendarRes = await client.get(`/products/${prodPayload.productId}/calendar`);
    assert.strictEqual(calendarRes.status, 200);
  });

  test("Flow 3: Offer Negotiation -> Order Creation -> Customer History Linkage", async () => {
    // 1. Create Customer
    const customerPayload = generateTestCustomer({
      customerId: uniqueId("HOK-CUST-CF3"),
      name: "Meera Rajput",
      email: uniqueEmail("meera_rajput"),
    });
    const custRes = await client.post("/customers", customerPayload);
    assert.ok([200, 201].includes(custRes.status));

    // 2. Create Offer from Customer
    const offerPayload = generateTestOffer({
      offerId: uniqueId("OFF-CF3"),
      customerName: customerPayload.name,
      customerEmail: customerPayload.email,
      originalAmount: 30000,
      offeredAmount: 22000,
    });
    const offerRes = await client.post("/offers", offerPayload);
    assert.ok([200, 201].includes(offerRes.status));

    // 3. Accept Offer
    const acceptRes = await client.patch(`/offers/${offerPayload.offerId}/status`, {
      status: "Accepted",
      remarks: "Offer approved at 22,000 INR.",
    });
    assert.strictEqual(acceptRes.status, 200);

    // 4. Generate Order from Accepted Offer
    const orderPayload = generateTestOrder({
      orderId: uniqueId("HOK-ORD-FROM-OFFER"),
      customerId: customerPayload.customerId,
      customerName: customerPayload.name,
      customerEmail: customerPayload.email,
      orderValue: 22000,
      grandTotal: 45960,
    });
    const orderRes = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(orderRes.status));

    // 5. Append communication log to customer profile
    const commRes = await client.post(`/customers/${customerPayload.customerId}/communication-log`, {
      message: `Offer ${offerPayload.offerId} accepted and converted to Order ${orderPayload.orderId}.`,
      channel: "System",
    });
    assert.strictEqual(commRes.status, 200);
  });

  test("Flow 4: Return QC Grading -> Partial Deposit Deduction Decision", async () => {
    const orderPayload = generateTestOrder({
      orderId: uniqueId("HOK-ORD-QC-DED"),
      depositHeld: 20000,
      depositStatus: "Pending",
      items: [
        {
          productId: uniqueId("HOK-PRD-QC"),
          productName: "Silk Brocade Sherwani",
          designer: "Tarun Tahiliani",
          mode: "Rental",
          size: "40",
          amount: 18000,
          deposit: 20000,
          gst: 3240,
          quantity: 1,
          status: "Delivered",
        },
      ],
    });
    const orderRes = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(orderRes.status));

    // QC reports minor embroidery fraying (Grade B)
    const qcRes = await client.patch(`/orders/${orderPayload.orderId}/items/0/return`, {
      receivedDate: new Date().toISOString().split("T")[0],
      receivedBy: "Senior QC Lead",
      grade: "B",
      notes: "Minor embroidery snag on right cuff. Requires master artisan retouching.",
    });
    assert.strictEqual(qcRes.status, 200);

    // Record Partial Deposit Decision: 4,000 INR deduction for repair, 16,000 INR refund
    const depositRes = await client.patch(`/orders/${orderPayload.orderId}/items/0/deposit`, {
      status: "Partial",
      totalDeposit: 20000,
      deductedAmount: 4000,
      releasedAmount: 16000,
      reason: "Artisanal embroidery repair deduction.",
    });
    assert.strictEqual(depositRes.status, 200);

    // Verify persisted state
    const detailRes = await client.get(`/orders/${orderPayload.orderId}`);
    assert.strictEqual(detailRes.status, 200);
    const item = detailRes.data.data.items[0];
    assert.strictEqual(item.depositDecision?.deductedAmount, 4000);
    assert.strictEqual(item.depositDecision?.releasedAmount, 16000);
  });
});
