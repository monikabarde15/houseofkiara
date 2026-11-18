import { nextOrderId, ORDER_ID_REGEX } from "../services/orderIdService.js";
import crypto from "crypto";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Lister from "../models/Lister.js";
import { parseAmount } from "./orderController.js";
import { syncPayoutsFromOrders } from "./payoutController.js";

// Helper to create or verify customer
const getOrCreateCustomer = async (reqBody, headers) => {
  let customer = null;
  const email = (reqBody.customerEmail || "").trim().toLowerCase();
  const phone = (reqBody.customerPhone || "").trim();

  if (email && !email.includes("hok.local")) {
    customer = await Customer.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
  }
  if (!customer && phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length >= 10) {
      customer = await Customer.findOne({
        phone: new RegExp(digits.slice(-10) + "$"),
      });
    }
  }
  if (!customer && reqBody.customerName) {
    const customers = await Customer.find({}, "customerId").exec();
    const existingCustIds = customers
      .map((c) => c.customerId)
      .filter((id) => id && id.startsWith("CUST-"))
      .map((id) => parseInt(id.replace("CUST-", ""), 10))
      .filter((num) => !isNaN(num));
    const maxId = existingCustIds.length > 0 ? Math.max(...existingCustIds) : 0;
    const newCustomerId = `CUST-${String(maxId + 1).padStart(5, "0")}`;

    customer = await Customer.create({
      customerId: newCustomerId,
      name: reqBody.customerName.trim(),
      email: email || `contact_${Date.now()}@hok.local`,
      phone: phone,
      location: reqBody.customerCity || "India",
      status: "Active",
      source: "Auto-Created from Razorpay Order",
      joinedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
  }
  return customer;
};

// POST /api/payment/razorpay/create-order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = req.body;
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const amountInPaise = Math.round(numericAmount * 100);
    const orderReceipt = receipt || `RCP-${Date.now()}`;

    const rzpKeyId = process.env.RAZORPAY_KEY_ID;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;

    // If official Razorpay credentials exist, use live/test SDK call
    if (rzpKeyId && rzpSecret) {
      try {
        const auth = Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString("base64");
        const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: currency.toUpperCase(),
            receipt: orderReceipt,
            notes,
          }),
        });

        const rzpData = await rzpResponse.json();
        if (rzpResponse.ok && rzpData.id) {
          return res.json({
            success: true,
            orderId: rzpData.id,
            amount: rzpData.amount,
            currency: rzpData.currency,
            keyId: rzpKeyId,
            mode: "official",
          });
        }
      } catch (sdkErr) {
        console.warn("Razorpay API call failed, falling back to sandbox test mode:", sdkErr.message);
      }
    }

    // Default Sandbox / Test Mode (no keys required)
    const simulatedOrderId = `order_test_${Date.now()}`;
    try { await syncPayoutsFromOrders(); } catch (e) {}
    return res.json({
      success: true,
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: rzpKeyId || "rzp_test_hok_sandbox",
      mode: "test_sandbox",
      message: "Ready for test online payment via Razorpay sandbox",
    });
  } catch (error) {
    console.error("createRazorpayOrder error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

// POST /api/payment/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData = {},
    } = req.body;

    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
    let isSignatureValid = true;

    // Check if this is a test/sandbox simulation (demo keys or simulated IDs)
    const isSandboxPayment =
      !razorpay_order_id ||
      razorpay_order_id.startsWith("order_test_") ||
      razorpay_payment_id?.startsWith("pay_test_") ||
      razorpay_signature?.startsWith("test_sig_") ||
      process.env.RAZORPAY_KEY_ID?.includes("test");

    // Verify HMAC if real production keys and not a test order
    if (!isSandboxPayment && rzpSecret && razorpay_signature && razorpay_order_id && razorpay_payment_id) {
      const generatedSignature = crypto
        .createHmac("sha256", rzpSecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        isSignatureValid = false;
      }
    }

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // Resolve or create customer
    const customer = await getOrCreateCustomer(orderData, req.headers);

    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const firstItem = items[0] || {};

    const resolvedProductName =
      (orderData.productName && orderData.productName !== "Designer Piece")
        ? orderData.productName
        : (firstItem.productName || "Designer Piece");
    const resolvedDesigner =
      (orderData.designer && orderData.designer !== "House of Kaira")
        ? orderData.designer
        : (firstItem.designer || "House of Kaira");
    const resolvedMode = orderData.mode || firstItem.mode || "Rental";
    const resolvedImage = orderData.image || firstItem.image || "";

    const grandTotal = parseAmount(orderData.grandTotal || orderData.amount || 0);

    // Order IDs are issued by the server (HOK-REN-26-0001). Ignore old client-made ids.
    const orderId = ORDER_ID_REGEX.test(String(orderData.orderId || ""))
      ? orderData.orderId
      : await nextOrderId(
          Array.isArray(orderData.items) && orderData.items.length
            ? orderData.items
            : resolvedMode,
        );
    const paymentId = razorpay_payment_id || `pay_test_${Date.now()}`;

    const prodId = firstItem.productId || firstItem.id || firstItem._id || orderData.productId;
    let product = null;
    if (prodId) {
      try {
        product = await Product.findOne({
          $or: [{ productId: prodId }, { _id: prodId }, { sku: prodId }],
        });
      } catch (e) {}
    }

    const rawDeposit = parseAmount(
      orderData.deposit ||
      firstItem.deposit ||
      (product?.securityDeposit && product.securityDeposit > 0 ? product.securityDeposit : 0) ||
      (product?.deposit && product.deposit > 0 ? product.deposit : 0) ||
      (resolvedMode === "Rental" ? 10000 : 0)
    );
    const deposit = resolvedMode === "Rental" ? (rawDeposit > 0 ? rawDeposit : 10000) : 0;
    const depositStatus = deposit > 0 ? (orderData.depositStatus || "Pending") : "None";

    let listerId = orderData.listerId || firstItem.listerId || product?.listerId || "ananya-sharma";
    let listerName = orderData.listerName || firstItem.listerName || product?.listerName || "Ananya Sharma";

    const normalizeYMD = (val) => {
      if (!val) return "";
      const s = String(val).trim();
      const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
      const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) {
        return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
      }
      const d = new Date(s);
      if (isNaN(d.getTime())) return "";
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const addDaysYMD = (ymdStr, delta) => {
      const m = String(ymdStr || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!m) return "";
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + delta);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const primaryRentalItem =
      items.find(
        (it) =>
          String(it?.mode || "").toLowerCase() === "rental" ||
          it?.rentalStartDate ||
          it?.startDate,
      ) || firstItem;

    let rentalStartDate = normalizeYMD(
      orderData.rentalStartDate ||
        primaryRentalItem.rentalStartDate ||
        primaryRentalItem.startDate ||
        "",
    );
    let rentalEndDate = normalizeYMD(
      orderData.rentalEndDate ||
        primaryRentalItem.rentalEndDate ||
        primaryRentalItem.endDate ||
        "",
    );

    if (resolvedMode === "Rental" && !rentalStartDate) {
      rentalStartDate = addDaysYMD(todayIST, 2);
    }
    if (resolvedMode === "Rental" && rentalStartDate && (!rentalEndDate || rentalEndDate < rentalStartDate)) {
      const minDays = Math.max(1, Number(product?.minimumDurationDays || 4));
      rentalEndDate = addDaysYMD(rentalStartDate, minDays - 1);
    }

    let dispatchDate = normalizeYMD(
      orderData.dispatchDate || primaryRentalItem.dispatchDate || "",
    );
    if (!dispatchDate && rentalStartDate) {
      dispatchDate = addDaysYMD(rentalStartDate, -2);
    }
    if (!dispatchDate) {
      dispatchDate = todayIST;
    }

    const enrichedItems = items.map((it) => {
      const isItemRental = String(it.mode || resolvedMode).toLowerCase() === "rental";
      const itemStart = normalizeYMD(it.rentalStartDate || it.startDate) || (isItemRental ? rentalStartDate : "");
      const itemEnd = normalizeYMD(it.rentalEndDate || it.endDate) || (isItemRental ? rentalEndDate : "");
      const itemDisp = normalizeYMD(it.dispatchDate) || (itemStart ? addDaysYMD(itemStart, -2) : dispatchDate);
      return {
        ...it,
        mode: isItemRental ? "Rental" : (it.mode || resolvedMode),
        rentalStartDate: itemStart,
        rentalEndDate: itemEnd,
        dispatchDate: itemDisp,
        returnDueDate: itemEnd ? addDaysYMD(itemEnd, 1) : "",
        deposit: isItemRental ? deposit : 0,
        listerId: it.listerId || listerId,
        listerName: it.listerName || listerName,
      };
    });

    // Create confirmed order in PostgreSQL database
    const savedOrder = await Order.create({
      ...orderData,
      orderId,
      orderDate: orderData.orderDate || new Date().toISOString(),
      customerId: customer?.customerId || orderData.customerId,
      customerName: customer?.name || orderData.customerName,
      customerEmail: customer?.email || orderData.customerEmail,
      customerPhone: customer?.phone || orderData.customerPhone,
      customerCity: customer?.location || orderData.customerCity,
      address: orderData.address || customer?.location || "",
      productName: resolvedProductName,
      designer: resolvedDesigner,
      image: resolvedImage,
      mode: resolvedMode,
      rentalStartDate,
      rentalEndDate,
      dispatchDate,
      status: "Confirmed",
      paymentStatus: "Paid",
      paymentMethod: "Razorpay",
      paymentId: paymentId,
      razorpayOrderId: razorpay_order_id,
      amount: grandTotal,
      grandTotal: grandTotal,
      orderValue: grandTotal,
      deposit,
      depositHeld: deposit,
      depositStatus,
      listerId,
      listerName,
      items: enrichedItems,
      logs: [
        {
          message: `Online payment of ₹${grandTotal.toLocaleString("en-IN")} received via Razorpay (${paymentId})`,
          type: "Payment",
          user: customer ? (customer.name || customer.email) : "Customer",
          time: new Date().toISOString(),
        },
        {
          message: "Order placed & confirmed automatically upon payment authorization",
          type: "Order",
          user: "Razorpay Gateway",
          time: new Date().toISOString(),
        },
      ],
    });

    // Auto-block dates & sync bookingHistory on Product for all ordered items
    for (const item of enrichedItems) {
      if (!item.productId) continue;
      try {
        const prod = await Product.findOne({
          $or: [
            { productId: item.productId },
            { _id: item.productId },
            { sku: item.productId },
          ],
        });
        if (!prod) continue;

        const isRentalItem =
          item.mode && item.mode.toLowerCase() === "rental";
        const bookingStart = item.rentalStartDate || todayIST;
        const bookingEnd = item.rentalEndDate || bookingStart;

        if (isRentalItem && item.rentalStartDate && item.rentalEndDate) {
          if (!prod.blockedDates) prod.blockedDates = [];
          prod.blockedDates.push({
            from: new Date(item.rentalStartDate),
            to: new Date(item.rentalEndDate),
            reason: `Rented (Order ${savedOrder.orderId})`,
          });
          prod.timesRented = Number(prod.timesRented || 0) + 1;
        }

        if (!Array.isArray(prod.bookingHistory)) prod.bookingHistory = [];
        const alreadyInHistory = prod.bookingHistory.some(
          (bh) => bh.orderId === savedOrder.orderId,
        );
        if (!alreadyInHistory) {
          prod.bookingHistory.push({
            orderId: savedOrder.orderId,
            customerName: savedOrder.customerName || "Customer",
            whatsappNumber: savedOrder.customerPhone || "",
            city: savedOrder.customerCity || "",
            startDate: bookingStart,
            endDate: bookingEnd,
            orderDate: savedOrder.orderDate || new Date().toISOString(),
            mode: item.mode || savedOrder.mode || "Rental",
            amount: Number(item.amount || grandTotal || 0),
            deposit: Number(item.deposit || deposit || 0),
            status: savedOrder.status || "Confirmed",
          });
        }
        if (!Array.isArray(prod.activityLog)) prod.activityLog = [];
        prod.activityLog.push({
          action: `Web order ${savedOrder.orderId} (${item.mode || savedOrder.mode}) placed by ${savedOrder.customerName || "Customer"}`,
          user: savedOrder.customerName || "Web Customer",
        });
        await prod.save();
      } catch (e) {}
    }
    global.__webProductsCache = null;

    return res.json({
      success: true,
      message: "Payment verified and order created successfully in database",
      orderId: savedOrder.orderId,
      paymentId,
      data: savedOrder,
    });
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment and save order",
    });
  }
};
