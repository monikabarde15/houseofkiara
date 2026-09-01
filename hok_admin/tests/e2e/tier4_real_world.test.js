import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import {
  generateTestCustomer,
  generateTestDesigner,
  generateTestLister,
  generateTestProduct,
  generateTestOrder,
  generateTestPayout,
  uniqueId,
  uniqueEmail,
} from "./helpers/test_fixtures.js";

describe("Tier 4: Real-World Application Workload Scenarios", () => {
  const client = createApiClient();

  test("Scenario 1: End-to-End Luxury Bridal Lehenga Rental Lifecycle", async () => {
    // 1. Customer Registration with Wedding Occasion
    const customerPayload = generateTestCustomer({
      customerId: uniqueId("HOK-BRIDE"),
      name: "Radhika Merchant-Kapoor",
      email: uniqueEmail("radhika_bride"),
      phone: "+91 98200 99887",
      occasions: [
        {
          id: uniqueId("OCC-WED"),
          occasion: "Udaipur Palace Wedding",
          date: "2026-11-28",
        },
      ],
    });
    const custRes = await client.post("/customers", customerPayload);
    assert.ok([200, 201].includes(custRes.status));

    // 2. Designer & Live Bridal Product Setup
    const designerPayload = generateTestDesigner({
      designerId: "sabyasachi-couture",
      name: "Sabyasachi Couture",
    });
    await client.post("/designers", designerPayload);

    const productPayload = generateTestProduct({
      productId: uniqueId("HOK-PRD-BRIDAL"),
      name: "Royal Heritage Crimson Velvet Zardozi Lehenga",
      designer: "Sabyasachi Couture",
      rentalPrice: 35000,
      securityDeposit: 50000,
      cleaningFee: 2500,
      gstRate: 18,
    });
    const prodRes = await client.post("/products", productPayload);
    assert.ok([200, 201].includes(prodRes.status));

    // 3. Order Placement & Financial Calculation
    const rentalDays = 4;
    const rentalAmount = 35000;
    const depositAmount = 50000;
    const gstAmount = Math.round(rentalAmount * 0.18); // 6,300
    const grandTotal = rentalAmount + depositAmount + gstAmount; // 91,300

    const orderPayload = generateTestOrder({
      orderId: uniqueId("HOK-ORD-WEDDING"),
      customerId: customerPayload.customerId,
      customerName: customerPayload.name,
      customerEmail: customerPayload.email,
      orderValue: rentalAmount,
      depositHeld: depositAmount,
      grandTotal: grandTotal,
      gst: gstAmount,
      listerPayout: 28000, // 80% of 35k
      items: [
        {
          productId: productPayload.productId,
          productName: productPayload.name,
          designer: productPayload.designer,
          mode: "Rental",
          size: "M",
          amount: rentalAmount,
          deposit: depositAmount,
          gst: gstAmount,
          quantity: 1,
          status: "Confirmed",
        },
      ],
    });
    const orderRes = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(orderRes.status));
    assert.strictEqual(orderRes.data.data.grandTotal, 91300);

    // 4. Pre-dispatch QC Evidence & Courier Dispatch
    await client.patch(`/orders/${orderPayload.orderId}/items/0/evidence`, {
      stage: "pre-dispatch",
      photos: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b"],
      videoUrl: "https://example.com/qc/pre-dispatch-check.mp4",
    });

    await client.patch(`/orders/${orderPayload.orderId}/items/0/dispatch`, {
      dispatchedBy: "VIP Logistics Lead",
      courierPartner: "BlueDart Secure Cargo",
      trackingNumber: "BD-VIP-BRIDAL-001",
      date: new Date().toISOString().split("T")[0],
    });

    await client.patch(`/orders/${orderPayload.orderId}/status`, { status: "Shipped" });
    await client.patch(`/orders/${orderPayload.orderId}/status`, { status: "Delivered" });

    // 5. Return Arrival, Flawless QC Grade A & Deposit Release
    await client.patch(`/orders/${orderPayload.orderId}/items/0/return`, {
      receivedDate: new Date().toISOString().split("T")[0],
      receivedBy: "Lead Quality Auditor",
      grade: "A",
      notes: "Royal lehenga returned in pristine condition. Zero thread breaks or stains.",
    });

    await client.patch(`/orders/${orderPayload.orderId}/items/0/deposit`, {
      status: "Released",
      totalDeposit: depositAmount,
      releasedAmount: depositAmount,
      deductedAmount: 0,
      reason: "Pristine Grade A return approved for 100% deposit release.",
    });

    await client.patch(`/orders/${orderPayload.orderId}/status`, { status: "Complete" });

    // 6. Lister Payout Generation & Settlement
    const payoutPayload = generateTestPayout({
      orderId: orderPayload.orderId,
      productId: productPayload.productId,
      transactionAmount: rentalAmount,
      listerShare: 28000,
      hokCommission: 7000,
      taxDeduction: 2800, // 10% TDS
      netPayout: 25200,
    });
    const payoutRes = await client.post("/payouts", payoutPayload);
    assert.ok([200, 201].includes(payoutRes.status));

    const settleRes = await client.patch(`/payouts/${payoutPayload.payoutId}/paid`, {
      paidBy: "Finance Controller",
      paymentReference: "UTR-HDFC-WED-SETTLE-8899",
    });
    assert.strictEqual(settleRes.status, 200);
    assert.strictEqual(settleRes.data.data.status, "Paid");
  });

  test("Scenario 2: Lister Wardrobe Monetization & Intake to Settlement Flow", async () => {
    // 1. Lister Registration with Bank Account & PAN
    const listerPayload = generateTestLister({
      listerId: uniqueId("LST-MONETIZE"),
      name: "Kareena Kapoor-Khan",
      email: uniqueEmail("kareena_lister"),
      bankDetails: {
        accountHolder: "Kareena Kapoor-Khan",
        accountNumber: "50100223344556",
        ifsc: "HDFC0000060",
        bankName: "HDFC Bank",
        branch: "Bandra Fort",
        upi: "kareena@hdfcbank",
        verified: true,
      },
    });
    const listerRes = await client.post("/listers", listerPayload);
    assert.ok([200, 201].includes(listerRes.status));

    // 2. Add Wardrobe Piece linked to Lister
    const piecePayload = generateTestProduct({
      productId: uniqueId("HOK-PRD-LISTER"),
      name: "Ivory Chikankari Designer Anarkali",
      designer: "Abu Jani Sandeep Khosla",
      listerId: listerPayload.listerId,
      listerName: listerPayload.name,
      rentalPrice: 22000,
      securityDeposit: 30000,
      payoutPercentage: 80,
    });
    const pieceRes = await client.post("/products", piecePayload);
    assert.ok([200, 201].includes(pieceRes.status));

    // 3. Verify Lister's pieces and payout history query
    const payoutsRes = await client.get(`/payouts?listerId=${listerPayload.listerId}`);
    assert.strictEqual(payoutsRes.status, 200);
  });
});
