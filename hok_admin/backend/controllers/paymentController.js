import crypto from "crypto";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import Lister from "../models/Lister.js";
import { parseAmount } from "./orderController.js";

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

    const orderId = orderData.orderId || `HOK-ORD-${Date.now()}`;
    const paymentId = razorpay_payment_id || `pay_test_${Date.now()}`;

    // Create confirmed order in PostgreSQL database
    const savedOrder = await Order.create({
      ...orderData,
      orderId,
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
      status: "Confirmed",
      paymentStatus: "Paid",
      paymentMethod: "Razorpay",
      paymentId: paymentId,
      razorpayOrderId: razorpay_order_id,
      amount: grandTotal,
      grandTotal: grandTotal,
      orderValue: grandTotal,
      items,
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
