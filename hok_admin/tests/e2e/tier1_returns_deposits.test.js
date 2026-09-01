import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestOrder, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Returns & Deposits Settlement", () => {
  const client = createApiClient();
  let returnOrder;

  test("Feature 12: Set up an active order in Delivered/Shipped status due for return", async () => {
    const today = new Date();
    const returnDateStr = today.toISOString().split("T")[0];

    const orderPayload = generateTestOrder({
      orderId: uniqueId("HOK-RET-ORD"),
      status: "Delivered",
      depositHeld: 25000,
      depositStatus: "Pending",
      items: [
        {
          productId: uniqueId("HOK-PRD-RET"),
          productName: "Heritage Banarasi Brocade Saree",
          designer: "Anita Dongre",
          mode: "Rental",
          size: "Free Size",
          rentalStartDate: new Date(today.getTime() - 4 * 24 * 3600 * 1000).toISOString().split("T")[0],
          rentalEndDate: returnDateStr,
          dispatchDate: new Date(today.getTime() - 5 * 24 * 3600 * 1000).toISOString().split("T")[0],
          returnDueDate: returnDateStr,
          amount: 12000,
          deposit: 25000,
          gst: 2160,
          quantity: 1,
          status: "Delivered",
          returnCondition: {
            grade: "Pending Inspection",
            notes: "",
          },
          depositDecision: {
            status: "Pending",
            totalDeposit: 25000,
            releasedAmount: 0,
            deductedAmount: 0,
          },
        },
      ],
    });

    const res = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(res.status), "Order creation should succeed");
    assert.strictEqual(res.data?.success, true);
    returnOrder = res.data.data;
  });

  test("Feature 12: Query orders due for return from live database", async () => {
    const res = await client.get("/orders");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data?.success, true);
    const orders = res.data?.data || [];

    const returnsDue = orders.filter((o) =>
      ["Shipped", "Delivered", "Return Due", "Return Sent"].includes(o.status)
    );
    assert.ok(Array.isArray(returnsDue), "Returns due should be an array");
    assert.ok(returnsDue.some((o) => o.orderId === returnOrder.orderId), "Our return order should appear in returns list");
  });

  test("Feature 12: PATCH /api/orders/:id/items/:index/return records return QC assessment and grading", async () => {
    const qcPayload = {
      receivedDate: new Date().toISOString().split("T")[0],
      receivedBy: "Senior QC Inspector",
      grade: "A",
      notes: "Flawless condition, verified under UV light. No stains or missing tassels.",
    };

    const res = await client.patch(`/orders/${returnOrder.orderId}/items/0/return`, qcPayload);
    assert.strictEqual(res.status, 200, "QC grading update should return 200 OK");
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 12: PATCH /api/orders/:id/items/:index/evidence attaches pre-return photo/video documentation", async () => {
    const evidencePayload = {
      stage: "return",
      photos: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
      ],
      videoUrl: "https://example.com/videos/qc-return-inspection.mp4",
    };

    const res = await client.patch(`/orders/${returnOrder.orderId}/items/0/evidence`, evidencePayload);
    assert.strictEqual(res.status, 200, "Saving evidence should return 200 OK");
    assert.strictEqual(res.data?.success, true);
  });

  test("Feature 12: PATCH /api/orders/:id/items/:index/deposit records deposit refund decision", async () => {
    const depositPayload = {
      status: "Released",
      totalDeposit: 25000,
      releasedAmount: 25000,
      deductedAmount: 0,
      reason: "Full deposit refund approved due to pristine grade A return.",
      releaseNote: "Processed via original payment method.",
    };

    const res = await client.patch(`/orders/${returnOrder.orderId}/items/0/deposit`, depositPayload);
    assert.strictEqual(res.status, 200, "Deposit release should return 200 OK");
    assert.strictEqual(res.data?.success, true);

    // Verify order detail reflects deposit decision
    const detailRes = await client.get(`/orders/${returnOrder.orderId}`);
    assert.strictEqual(detailRes.status, 200);
    const item = detailRes.data.data.items[0];
    assert.ok(
      item.depositDecision?.status === "Released" ||
      item.depositDecision?.releasedAmount === 25000,
      "Deposit decision must persist in database"
    );
  });

  test("Feature 12: Transition order to Returned and Complete workflow state", async () => {
    const res = await client.patch(`/orders/${returnOrder.orderId}/status`, {
      status: "Returned",
      user: "QC Admin",
      remarks: "Order returned and inspected successfully.",
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.status, "Returned");
  });
});
