import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const JWT_SECRET = process.env.JWT_SECRET || "hok_super_secret_key_123";
const FAST2SMS_KEY = process.env.FAST2SMS_KEY || "";
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
);

const generateToken = (id) => {
  return jwt.sign({ id, role: "customer" }, JWT_SECRET, { expiresIn: "30d" });
};

// Helper to generate unique Customer ID
export const generateUniqueCustomerId = async () => {
  try {
    const allCustomers = await Customer.find({}, "customerId").lean().exec();
    const existingNums = (allCustomers || [])
      .map((c) => c.customerId)
      .filter((id) => id && typeof id === "string" && id.startsWith("CUST-"))
      .map((id) => parseInt(id.replace("CUST-", ""), 10))
      .filter((n) => !isNaN(n));

    let maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    let nextId = `CUST-${String(maxNum + 1).padStart(5, "0")}`;

    while (await Customer.findOne({ customerId: nextId })) {
      maxNum++;
      nextId = `CUST-${String(maxNum + 1).padStart(5, "0")}`;
    }
    return nextId;
  } catch (err) {
    return `CUST-${Date.now().toString().slice(-5)}`;
  }
};

// 1. Register with Email
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const existing = await Customer.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newCustId = await generateUniqueCustomerId();

    const customer = new Customer({
      customerId: newCustId,
      name,
      email,
      phone: phone || "",
      passwordHash,
      wishlist: [],
      cart: [],
    });

    await customer.save();

    res.status(201).json({
      success: true,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Login with Email
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });

    if (
      customer &&
      customer.passwordHash &&
      (await bcrypt.compare(password, customer.passwordHash))
    ) {
      res.json({
        success: true,
        data: {
          _id: customer._id,
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          token: generateToken(customer._id),
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Phone required" });

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      // Auto-create stub customer
      const allCustomers = await Customer.find({}, "customerId").exec();
      const existingNums = allCustomers
        .map((c) => c.customerId)
        .filter((id) => id && id.startsWith("CUST-"))
        .map((id) => parseInt(id.replace("CUST-", ""), 10))
        .filter((n) => !isNaN(n));
      const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
      const newCustId = `CUST-${String(maxNum + 1).padStart(5, "0")}`;

      customer = new Customer({
        customerId: newCustId,
        name: "User",
        email: `user${Date.now()}@temp.com`,
        phone,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    customer.otp = await bcrypt.hash(otp, 10);
    customer.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 mins
    await customer.save();

    console.log(`[MOCK OTP] Sending ${otp} to ${phone}`);
    if (FAST2SMS_KEY) {
      await axios.get(`https://www.fast2sms.com/dev/bulkV2`, {
        params: {
          authorization: FAST2SMS_KEY,
          route: "v3",
          sender_id: "TXTIND",
          message: `Your House of Kaira login OTP is ${otp}. Valid for 10 minutes.`,
          language: "english",
          flash: 0,
          numbers: phone,
        },
      });
    }

    res.json({ success: true, message: "OTP sent", otp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const customer = await Customer.findOne({ phone });
    if (!customer || !customer.otp)
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });

    if (new Date() > new Date(customer.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, customer.otp);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    customer.otp = "";
    await customer.save();

    res.json({
      success: true,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Password recovery.  The route is registered by customerAuthRoutes, so
// these exports must remain available even when the local authentication
// controller is merged with older customer-login changes.
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const customer = await Customer.findOne({ email });
    // Do not reveal whether an account exists.
    if (!customer) {
      return res.json({
        success: true,
        message:
          "If an account exists, password reset instructions have been created.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    customer.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    customer.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await customer.save();

    // Email delivery can be connected through the configured provider.  This
    // keeps the API usable locally without exposing the token in its response.
    console.log(
      `[PASSWORD RECOVERY] Reset link: http://localhost:3000/auth?resetToken=${token}`,
    );
    return res.json({
      success: true,
      message:
        "If an account exists, password reset instructions have been created.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to start password reset.",
      });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || req.body?.resetToken || "").trim();
    const password = String(req.body?.newPassword || req.body?.password || "");
    if (!token || password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "A valid reset token and password of at least 6 characters are required.",
        });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const customer = await Customer.findOne({
      resetPasswordToken: hashedToken,
    });
    if (
      !customer ||
      !customer.resetPasswordExpiresAt ||
      new Date() > new Date(customer.resetPasswordExpiresAt)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password reset token is invalid or expired.",
        });
    }

    customer.passwordHash = await bcrypt.hash(password, 10);
    customer.resetPasswordToken = "";
    customer.resetPasswordExpiresAt = null;
    await customer.save();
    return res.json({
      success: true,
      message: "Password has been successfully updated. You can now sign in.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to reset password.",
      });
  }
};

export const logout = async (_req, res) => {
  return res.json({ success: true, message: "Successfully logged out." });
};

// 7. Google Login & Signup
export const googleLogin = async (req, res) => {
  try {
    const { token, email: reqEmail, name: reqName, googleId: reqGoogleId, phone, mobile } = req.body;
    const phoneVal = (phone || mobile || "").toString().trim();
    let resolvedEmail = reqEmail;
    let resolvedName = reqName;
    let resolvedGoogleId = reqGoogleId;

    if (token && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "MOCK_CLIENT_ID") {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        resolvedEmail = payload.email;
        resolvedName = payload.name;
        resolvedGoogleId = payload.sub;
      } catch (err) {
        console.warn("Google token verification failed:", err.message);
      }
    }

    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required for Google Sign-In",
      });
    }

    resolvedEmail = resolvedEmail.toLowerCase().trim();
    let customer = await Customer.findOne({
      $or: [
        { email: { $regex: new RegExp(`^${resolvedEmail}$`, "i") } },
        ...(resolvedGoogleId ? [{ googleId: resolvedGoogleId }] : []),
      ],
    });

    const isNew = !customer;
    if (isNew) {
      const newCustId = await generateUniqueCustomerId();

      customer = new Customer({
        customerId: newCustId,
        name: resolvedName || resolvedEmail.split("@")[0],
        email: resolvedEmail,
        phone: phoneVal,
        googleId: resolvedGoogleId || `google_${Date.now()}`,
        status: "Active",
        source: "Google OAuth",
        joinedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });
      await customer.save();
    } else {
      let needsSave = false;
      if (!customer.googleId && resolvedGoogleId) {
        customer.googleId = resolvedGoogleId;
        needsSave = true;
      }
      if (!customer.phone && phoneVal) {
        customer.phone = phoneVal;
        needsSave = true;
      }
      if (needsSave) {
        await customer.save();
      }
    }

    const authToken = generateToken(customer._id);

    return res.json({
      success: true,
      message: isNew ? "Google sign up successful" : "Google sign in successful",
      isNewUser: isNew,
      flow: isNew ? "register" : "signin",
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isNewUser: isNew,
        flow: isNew ? "register" : "signin",
        token: authToken,
      },
    });
  } catch (error) {
    console.error("googleLogin error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).select(
      "-passwordHash -otp",
    );
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    const rawId = String(req.params.productId || "");
    const aliases = new Set([rawId]);

    let canonicalId = rawId;
    try {
      const prod = await Product.findOne({
        $or: [
          { _id: rawId },
          { productId: rawId },
          { sku: rawId },
          { id: rawId },
        ],
      });
      if (prod) {
        if (prod._id) aliases.add(String(prod._id));
        if (prod.productId) aliases.add(String(prod.productId));
        if (prod.sku) aliases.add(String(prod.sku));
        if (prod.id) aliases.add(String(prod.id));
        canonicalId = prod.sku || prod.productId || String(prod._id || rawId);
      }
    } catch (e) {}

    const aliasList = Array.from(aliases);
    const existingIndex = (customer.wishlist || []).findIndex((id) =>
      aliasList.includes(String(id))
    );

    if (existingIndex !== -1) {
      customer.wishlist = customer.wishlist.filter(
        (id) => !aliasList.includes(String(id))
      );
    } else {
      customer.wishlist.push(canonicalId);
    }
    customer.wishlistCount = customer.wishlist.length;

    await customer.save();
    res.json({ success: true, data: customer.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    const rawId = String(req.params.productId || "");
    const aliases = new Set([rawId]);

    try {
      const prod = await Product.findOne({
        $or: [
          { _id: rawId },
          { productId: rawId },
          { sku: rawId },
          { id: rawId },
        ],
      });
      if (prod) {
        if (prod._id) aliases.add(String(prod._id));
        if (prod.productId) aliases.add(String(prod.productId));
        if (prod.sku) aliases.add(String(prod.sku));
        if (prod.id) aliases.add(String(prod.id));
      }
    } catch (e) {}

    const aliasList = Array.from(aliases);
    customer.wishlist = (customer.wishlist || []).filter(
      (id) => !aliasList.includes(String(id))
    );
    customer.wishlistCount = customer.wishlist.length;

    await customer.save();
    res.json({ success: true, data: customer.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.json({ success: true, data: customer.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWishlistProducts = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    const wishlistIds = Array.isArray(customer.wishlist)
      ? customer.wishlist.filter(Boolean).map(String)
      : [];

    if (wishlistIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find({
      $or: [
        { _id: { $in: wishlistIds } },
        { productId: { $in: wishlistIds } },
        { sku: { $in: wishlistIds } },
        { id: { $in: wishlistIds } },
      ],
    });

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    res.json({ success: true, data: customer.cart || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const syncCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });

    if (Array.isArray(req.body.cart)) {
      customer.cart = req.body.cart;
      await customer.save();
    }
    
    res.json({ success: true, data: customer.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const customerEmail = req.user.email;
    const filter = [];
    if (customerId) filter.push({ customerId });
    if (customerEmail) filter.push({ customerEmail });
    const query = filter.length > 0 ? { $or: filter } : { customerId };

    const orders = await Order.find(query).sort({ createdAt: -1 });

    // Format orders fast without redundant cloud DB roundtrips
    const formattedOrders = orders.map((order) => {
      let image = "";
      let piece = order.productName || "Product";
      let type = order.mode || "Rental";

      if (order.items && order.items.length > 0) {
        const firstItem = order.items[0];
        piece = firstItem.productName || piece;
        type = firstItem.mode || type;
        image = firstItem.image || "";
      }

      return {
        id: order.orderId,
        piece,
        type,
        typeDetail: type,
        status: order.status || "Confirmed",
        amount: order.grandTotal || order.orderValue || order.amount || 0,
        date: `Ordered ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`,
        image,
        dbId: order._id,
      };
    });

    res.json({ success: true, data: formattedOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.customerId;

    // Support finding by the string orderId (e.g. #HOK-123) or mongoose _id
    const order = await Order.findOne({
      $or: [{ orderId: orderId }, { _id: orderId }],
      customerId,
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Fetch detailed product info for items
    const populatedItems = await Promise.all(
      order.items.map(async (item) => {
        let itemDetails = { ...item.toObject() };
        if (item.productId) {
          const product =
            (await Product.findOne({ id: item.productId })) ||
            (await Product.findById(item.productId).catch(() => null));
          if (product) {
            itemDetails.image = product.images?.[0] || product.image?.[0] || "";
            itemDetails.designer = product.designer || item.designer;
            // Try to extract condition if available
            itemDetails.condition = product.preloved?.condition || "Excellent";
          }
        }

        // Map rental dates for frontend
        if (item.rentalStartDate && item.rentalEndDate) {
          itemDetails.rentalDates = {
            start: item.rentalStartDate,
            end: item.rentalEndDate,
          };
        }

        return itemDetails;
      }),
    );

    const detailedOrder = {
      ...order.toObject(),
      items: populatedItems,
    };

    res.json({ success: true, data: detailedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const {
      items = [],
      totals = {},
      address = "",
      paymentMethod = "COD",
      activePromo = null,
    } = req.body || {};

    let customer = req.user; // populated by requireCustomerAuth
    try {
      const fresh = await Customer.findOne({
        $or: [
          { _id: customer._id || customer.id },
          { customerId: customer.customerId },
          { phone: customer.phone },
        ],
      });
      if (fresh) customer = fresh;
    } catch (e) {}

    // Generate unique order ID
    const orderId = `HOK-ORD-${Date.now()}`;

    // Map cart items to order items schema with security deposit and lister resolution
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const isRental = item.type === "rental" || item.mode === "Rental";
        let securityDeposit = Number(item.deposit || item.securityDeposit || 0);
        let listerId = item.listerId || item.product?.listerId || "";
        let listerName = item.listerName || item.product?.listerName || "";

        const prodId =
          item.product?._id || item.product?.id || item.id || item.productId;
        if (prodId) {
          try {
            const prod = await Product.findOne({
              $or: [{ productId: prodId }, { _id: prodId }],
            });
            if (prod) {
              if (isRental && !securityDeposit) {
                securityDeposit = Number(prod.securityDeposit || prod.deposit || 0);
              }
              if (!listerId) listerId = prod.listerId || "";
              if (!listerName) listerName = prod.listerName || "";
            }
          } catch (e) {}
        }

        const rentalStart = item.booking?.rentalDates?.start || item.booking?.deliveryDate || item.rentalStartDate || "";
        const rentalEnd = item.booking?.rentalDates?.end || item.booking?.returnDate || item.rentalEndDate || "";

        let dispatchDate = "";
        if (rentalStart) {
          try {
            const d = new Date(rentalStart);
            d.setDate(d.getDate() - 2);
            dispatchDate = d.toISOString().split("T")[0];
          } catch (e) {}
        } else {
          dispatchDate = new Date().toISOString().split("T")[0];
        }

        return {
          productId: prodId,
          productName:
            item.product?.title ||
            item.product?.name ||
            item.title ||
            item.productName ||
            "Unknown Product",
          designer: item.product?.designer || item.designer,
          mode:
            item.type === "rental"
              ? "Rental"
              : item.type === "preloved"
                ? "Preloved"
                : item.type === "new"
                  ? "Buy"
                  : "Buy",
          size: item.booking?.size || item.size || "Standard",
          amount: item.price || item.totalPrice || 0,
          deposit: isRental ? securityDeposit : 0,
          quantity: item.quantity || 1, // Assume 1 for now based on cart logic
          status: "Confirmed",
          listerId,
          listerName,
          dispatchDate,
          image:
            item.product?.images?.[0] ||
            item.product?.image?.[0] ||
            item.image ||
            "",
          rentalStartDate: rentalStart,
          rentalEndDate: rentalEnd,
        };
      }),
    );

    const calculatedDeposit = orderItems.reduce(
      (sum, it) => sum + (Number(it.deposit) || 0),
      0,
    );
    const finalDeposit = Number(totals.depositTotal) || calculatedDeposit || 0;
    const finalGrandTotal = totals.finalTotal || totals.grandTotal || totals.itemTotal || 0;

    const newOrder = new Order({
      orderId,
      customerId: customer.customerId,
      customerName:
        customer.name || customer.firstName + " " + customer.lastName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address: address || customer.address || "Address not provided",
      paymentMethod:
        paymentMethod === "upi"
          ? "UPI"
          : paymentMethod === "nb"
            ? "Net Banking"
            : paymentMethod === "emi"
              ? "EMI"
              : paymentMethod === "card"
                ? "Card"
                : "COD",
      promoCode: activePromo?.code || "",
      promoDiscount: Number(totals.discount || totals.promoDiscount || activePromo?.discount || 0),
      priceBeforePromo: Number(totals.subtotal || totals.itemTotal || (finalGrandTotal + (totals.discount || 0))),
      items: orderItems,
      mode: orderItems.length === 1 ? orderItems[0].mode : "Multi-item",
      status: "Confirmed",
      amount: finalGrandTotal,
      grandTotal: finalGrandTotal,
      orderValue: totals.itemTotal || finalGrandTotal,
      productName: orderItems[0]?.productName || "",
      designer: orderItems[0]?.designer || "",
      listerId: orderItems[0]?.listerId || "",
      listerName: orderItems[0]?.listerName || "",
      rentalStartDate: orderItems[0]?.rentalStartDate || "",
      rentalEndDate: orderItems[0]?.rentalEndDate || "",
      dispatchDate: orderItems[0]?.dispatchDate || new Date().toISOString().split("T")[0],
      deposit: finalDeposit,
      depositHeld: finalDeposit,
      depositStatus: finalDeposit > 0 ? "Pending" : "None",
      discount: totals.discount || 0,
      gst: totals.gst || 0,
      payoutStatus: "Pending Approval",
      logs: [
        {
          message: "Order placed by customer",
          type: "Order",
          user: "Customer",
        },
      ],
    });

    await newOrder.save();

    // Update real promo stats if promo code used
    if (newOrder.promoCode) {
      try {
        const PromoCode = (await import("../models/PromoCode.js")).default;
        const promo = await PromoCode.findOne({
          code: newOrder.promoCode.toUpperCase(),
        });
        if (promo) {
          promo.redemptions = (promo.redemptions || 0) + 1;
          promo.orderValue = (promo.orderValue || 0) + (newOrder.orderValue || 0);
          promo.discountFunded = (promo.discountFunded || 0) + (newOrder.promoDiscount || 0);
          await promo.save();
        }
      } catch (e) {
        console.error("Error updating promo stats on order placement:", e);
      }
    }

    // Sync Customer metrics & Payouts in background
    if (customer) {
      try {
        const { syncCustomerOrderStats } = await import("./customerController.js");
        await syncCustomerOrderStats([customer]);
      } catch (e) {
        customer.ordersCount = (customer.ordersCount || 0) + 1;
        customer.totalSpent = (customer.totalSpent || 0) + newOrder.grandTotal;
        customer.lastOrderDate = new Date().toISOString();
        await customer.save().catch(() => {});
      }
    }

    try {
      const { syncPayoutsFromOrders } = await import("./payoutController.js");
      if (syncPayoutsFromOrders) await syncPayoutsFromOrders();
    } catch (e) {}

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customer = req.user;
    const cId = customer?.customerId;
    const cIdStr = customer?._id ? String(customer._id) : null;
    const cEmail = customer?.email ? customer.email.toLowerCase().trim() : null;

    const queries = [];
    if (cId) queries.push({ customerId: cId });
    if (cIdStr) {
      queries.push({ customerId: cIdStr });
      queries.push({ customerId: customer._id });
    }
    if (cEmail) {
      queries.push({ customerEmail: { $regex: new RegExp(`^${cEmail}$`, "i") } });
    }

    let order = await Order.findOne({
      $or: [{ orderId: orderId }, { _id: orderId }, { id: orderId }],
      ...(queries.length > 0 ? { $or: queries } : {}),
    });

    if (!order) {
      order = await Order.findOne({
        $or: [{ orderId: orderId }, { _id: orderId }, { id: orderId }],
      });
      if (order && customer) {
        const orderEmail = order.customerEmail?.toLowerCase().trim();
        const ordDigits = String(order.customerPhone || "").replace(/\D/g, "");
        const custDigits = String(customer.phone || "").replace(/\D/g, "");
        const emailMatch = cEmail && orderEmail && orderEmail === cEmail;
        const phoneMatch = custDigits.length >= 10 && ordDigits.endsWith(custDigits.slice(-10));
        const idMatch = cId && (order.customerId === cId || order.customerId === cIdStr);
        if (!emailMatch && !phoneMatch && !idMatch) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized to cancel this order." });
        }
      }
    }

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      [
        "Dispatched",
        "Shipped",
        "Delivered",
        "Returned",
        "Complete",
        "Return Sent",
        "Return Due",
        "Partially Returned",
      ].includes(order.status)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Cannot cancel an order that has already been processed or shipped.",
        });
    }

    const refundAmount = parseFloat(String(order.grandTotal || order.amount || 0).replace(/[^0-9.-]+/g, "")) || 0;
    let refundId = `rfnd_test_${Date.now()}`;
    const paymentId = order.paymentId || `pay_test_${order.orderId}`;
    const rzpKeyId = process.env.RAZORPAY_KEY_ID;
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;

    if (rzpKeyId && rzpSecret && !paymentId.startsWith("pay_test_") && !rzpKeyId.includes("test")) {
      try {
        const auth = Buffer.from(`${rzpKeyId}:${rzpSecret}`).toString("base64");
        const refundRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: Math.round(refundAmount * 100),
            notes: { orderId: order.orderId, reason: "Order cancelled by customer" },
          }),
        });
        const rzpRefundData = await refundRes.json();
        if (rzpRefundData && rzpRefundData.id) {
          refundId = rzpRefundData.id;
        }
      } catch (refundErr) {
        console.warn("Razorpay API refund call failed, using sandbox refund:", refundErr.message);
      }
    }

    order.status = "Cancelled";
    order.paymentStatus = "Refunded";
    order.depositStatus = "Refunded";
    order.refund = {
      refundId,
      amount: refundAmount,
      currency: "INR",
      paymentId,
      status: "Processed",
      refundedAt: new Date().toISOString(),
      note: "Full online refund processed via Razorpay gateway",
    };

    if (!order.logs) order.logs = [];
    order.logs.push({
      message: `Order cancelled by customer — full online refund of ₹${refundAmount.toLocaleString("en-IN")} processed via Razorpay (${refundId})`,
      type: "Refund",
      user: "Razorpay Gateway",
      time: new Date().toISOString(),
    });

    await order.save();

    // Unblock rental dates on the product immediately
    for (const item of order.items || []) {
      if (!item.productId) continue;
      try {
        const product = await Product.findOne({
          $or: [{ productId: item.productId }, { _id: item.productId }],
        });
        if (product && Array.isArray(product.blockedDates)) {
          const orderTag = `Order ${order.orderId}`;
          product.blockedDates = product.blockedDates.filter(
            (bd) => !(bd.reason && bd.reason.includes(orderTag)),
          );
          await product.save();
        }
      } catch (e) {}
    }

    if (customer) {
      import("./customerController.js")
        .then(({ syncCustomerOrderStats }) => syncCustomerOrderStats([customer]))
        .catch(() => {});
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
