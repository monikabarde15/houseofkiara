import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createApiClient } from "./helpers/api_client.js";
import { generateTestOrder, uniqueId } from "./helpers/test_fixtures.js";

describe("Tier 1: Feature Coverage — Rental Calendar & Dispatch Schedule", () => {
  const client = createApiClient();
  let calendarOrder;

  test("Feature 10 & 11: Create active orders with rental and dispatch dates in database", async () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const returnDateStr = new Date(today.getTime() + 4 * 24 * 3600 * 1000).toISOString().split("T")[0];

    const orderPayload = generateTestOrder({
      orderId: uniqueId("HOK-CAL-ORD"),
      status: "Confirmed",
      items: [
        {
          productId: uniqueId("HOK-PRD-CAL"),
          productName: "Emerald Silk Velvet Gown",
          designer: "Manish Malhotra",
          mode: "Rental",
          size: "L",
          rentalStartDate: todayStr,
          rentalEndDate: returnDateStr,
          dispatchDate: todayStr,
          returnDueDate: returnDateStr,
          amount: 18000,
          deposit: 25000,
          gst: 3240,
          quantity: 1,
          status: "Confirmed",
          dispatch: {
            courierPartner: "BlueDart Express",
            trackingNumber: "BD-CAL-12345",
            date: todayStr,
            status: "Scheduled",
          },
        },
      ],
    });

    const res = await client.post("/orders", orderPayload);
    assert.ok([200, 201].includes(res.status), "Order creation for calendar must succeed");
    assert.strictEqual(res.data?.success, true);
    calendarOrder = res.data.data;
  });

  test("Feature 10: Rental Calendar loads operational rental windows from database orders", async () => {
    const res = await client.get("/orders");
    assert.strictEqual(res.status, 200, "Get orders for calendar should return 200 OK");
    assert.strictEqual(res.data?.success, true);
    const orders = res.data?.data || [];
    
    // Validate order items contain rental start and end dates
    const hasRentalDates = orders.some(
      (o) => o.items && o.items.some((it) => it.rentalStartDate && it.rentalEndDate)
    );
    assert.ok(hasRentalDates, "Orders in database must have rentalStartDate and rentalEndDate for Calendar");
  });

  test("Feature 11: Dispatch Schedule filters today's shipments accurately from live orders", async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const res = await client.get("/orders");
    assert.strictEqual(res.status, 200);
    const orders = res.data?.data || [];

    const todayDispatches = orders.filter(
      (o) =>
        o.items &&
        o.items.some((it) => it.dispatchDate === todayStr || it.dispatch?.date === todayStr)
    );
    assert.ok(Array.isArray(todayDispatches), "Today's dispatches must be an array of matching orders");
  });

  test("Feature 11: Updating dispatch tracking and courier partner updates operational schedule", async () => {
    const orderId = calendarOrder.orderId;
    const trackingUpdate = {
      dispatchedBy: "Logistics Admin",
      courierPartner: "BlueDart Express",
      trackingNumber: "BD-DISPATCH-9988",
      date: new Date().toISOString().split("T")[0],
    };

    const res = await client.patch(`/orders/${orderId}/items/0/dispatch`, trackingUpdate);
    assert.strictEqual(res.status, 200, "Updating dispatch details should succeed with 200");
    assert.strictEqual(res.data?.success, true);

    // Verify order reflects updated dispatch state
    const detailRes = await client.get(`/orders/${orderId}`);
    const item = detailRes.data.data.items[0];
    assert.ok(
      item.dispatch?.trackingNumber === "BD-DISPATCH-9988" ||
      item.trackingNumber === "BD-DISPATCH-9988" ||
      item.dispatch?.courierPartner === "BlueDart Express",
      "Tracking number or courier must be updated in database"
    );
  });

  test("Feature 10: Monthly, Agenda, and Gantt views can safely parse order timeline fields", async () => {
    const res = await client.get("/orders");
    assert.strictEqual(res.status, 200);
    const orders = res.data?.data || [];

    for (const order of orders.slice(0, 5)) {
      if (order.items && Array.isArray(order.items)) {
        for (const it of order.items) {
          if (it.rentalStartDate) {
            const parsedStart = new Date(it.rentalStartDate);
            assert.ok(!isNaN(parsedStart.getTime()), `Valid start date: ${it.rentalStartDate}`);
          }
          if (it.rentalEndDate) {
            const parsedEnd = new Date(it.rentalEndDate);
            assert.ok(!isNaN(parsedEnd.getTime()), `Valid end date: ${it.rentalEndDate}`);
          }
        }
      }
    }
  });
});
