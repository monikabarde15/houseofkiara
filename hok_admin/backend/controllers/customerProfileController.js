import crypto from "crypto";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Submission from "../models/Submission.js";
import Lister from "../models/Lister.js";
import {
  validateProfileUpdate,
  validateAddressInput,
} from "../validations/customerProfileValidation.js";

const normalizePhone = (rawPhone) => {
  if (!rawPhone) return "";
  let digits = String(rawPhone).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

const sanitizeCustomer = (customer) => {
  const obj =
    typeof customer.toObject === "function"
      ? customer.toObject()
      : { ...customer };
  delete obj.passwordHash;
  delete obj.otp;
  delete obj.otpExpiresAt;
  delete obj.otpAttempts;
  delete obj.phoneVerified;
  delete obj.phoneVerifiedAt;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpiresAt;
  return obj;
};

// GET /api/customer/profile (or /api/customer/auth/me)
export const getProfile = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found.",
      });
    }

    return res.json({
      success: true,
      data: sanitizeCustomer(customer),
    });
  } catch (error) {
    console.error("GetProfile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve profile.",
    });
  }
};

// PUT /api/customer/profile
export const updateProfile = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { error, value } = validateProfileUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found.",
      });
    }

    // Check duplicate email if changing email
    if (value.email && value.email.toLowerCase().trim() !== customer.email) {
      const normalizedEmail = value.email.toLowerCase().trim();
      const existingEmail = await Customer.findOne({
        email: normalizedEmail,
        _id: { $ne: customer._id },
      });
      if (existingEmail && existingEmail.passwordHash) {
        return res.status(409).json({
          success: false,
          message: "Email address is already in use by another account.",
        });
      }
      customer.email = normalizedEmail;
    }

    // Check duplicate phone if changing phone
    const rawPhone = value.phone || value.mobile;
    if (rawPhone) {
      const normalizedPhone = normalizePhone(rawPhone);
      if (normalizedPhone && normalizedPhone !== customer.phone) {
        const existingPhone = await Customer.findOne({
          phone: normalizedPhone,
          _id: { $ne: customer._id },
        });
        if (existingPhone && existingPhone.passwordHash) {
          return res.status(409).json({
            success: false,
            message: "Mobile number is already in use by another account.",
          });
        }
        customer.phone = normalizedPhone;
      }
    }

    // Name resolution
    if (value.firstName !== undefined)
      customer.firstName = (value.firstName || "").trim();
    if (value.lastName !== undefined)
      customer.lastName = (value.lastName || "").trim();

    if (value.name && value.name.trim()) {
      customer.name = value.name.trim();
      if (!customer.firstName && !customer.lastName) {
        const parts = customer.name.split(" ");
        customer.firstName = parts[0] || "";
        customer.lastName = parts.slice(1).join(" ") || "";
      }
    } else {
      customer.name =
        [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
        customer.name ||
        "Customer";
    }

    // Location / City
    if (value.city !== undefined || value.location !== undefined) {
      const loc = (value.city || value.location || "").trim();
      customer.location = loc;
    }

    if (value.address !== undefined) {
      customer.address = (value.address || "").trim();
    }

    // Preferences
    if (value.preferences) {
      customer.preferences = {
        ...(customer.preferences || {}),
        ...value.preferences,
      };
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: sanitizeCustomer(customer),
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile.",
    });
  }
};

// POST /api/customer/profile/request-password-reset (or /api/customer/profile/change-password)
export const requestPasswordReset = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    customer.resetPasswordToken = hashedToken;
    customer.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await customer.save();

    const host = req.get("host") || "localhost:3000";
    const origin = req.get("origin") || `http://${host}`;
    const resetLink = `${origin}/auth?resetToken=${resetToken}`;

    console.log(
      `\n================== [PROFILE CHANGE PASSWORD REQUEST] ==================`,
    );
    console.log(`👤 Customer Name  : ${customer.name}`);
    console.log(`📧 Customer Email : ${customer.email}`);
    console.log(`🔑 Reset Token    : ${resetToken}`);
    console.log(`🔗 Reset Link     : ${resetLink}`);
    console.log(
      `========================================================================\n`,
    );

    return res.json({
      success: true,
      message: `A password reset link has been sent to ${customer.email}.`,
      data: {
        email: customer.email,
        resetToken:
          process.env.NODE_ENV === "production" ? undefined : resetToken,
      },
    });
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process password reset request.",
    });
  }
};

// GET /api/customer/addresses
export const getAddresses = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.json({
      success: true,
      data: customer.addresses || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch addresses.",
    });
  }
};

// POST /api/customer/addresses
export const addAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { error, value } = validateAddressInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses = customer.addresses || [];
    const isDefault = value.isDefault || customer.addresses.length === 0;

    if (isDefault) {
      customer.addresses = customer.addresses.map((a) => {
        const item = typeof a.toObject === "function" ? a.toObject() : a;
        return { ...item, isDefault: false };
      });
    }

    const fullAddress = [
      value.line1,
      value.line2,
      value.city,
      value.state,
      value.pin,
    ]
      .filter(Boolean)
      .join(", ");

    const newAddress = {
      id: `addr_${Date.now()}`,
      label: value.label || "Home",
      recipientName: value.recipientName || customer.name || "",
      line1: value.line1 || value.address || "",
      line2: value.line2 || "",
      city: value.city || customer.location || "",
      state: value.state || "",
      pin: value.pin || "",
      mobile: value.mobile || value.phone || customer.phone || "",
      address: fullAddress,
      isDefault,
    };

    customer.addresses.push(newAddress);
    if (isDefault || !customer.location || customer.location === "India") {
      customer.location = fullAddress || value.city || customer.location;
    }
    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: customer.addresses,
    });
  } catch (error) {
    console.error("AddAddress Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add address.",
    });
  }
};

// PUT /api/customer/addresses/:addressId
export const updateAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { addressId } = req.params;
    const { error, value } = validateAddressInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses = customer.addresses || [];
    const index = customer.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (value.isDefault) {
      customer.addresses = customer.addresses.map((a) => {
        const item = typeof a.toObject === "function" ? a.toObject() : a;
        return { ...item, isDefault: false };
      });
    }

    const existingAddr =
      typeof customer.addresses[index].toObject === "function"
        ? customer.addresses[index].toObject()
        : customer.addresses[index];
    const mergedLine1 =
      value.line1 !== undefined ? value.line1 : existingAddr.line1;
    const mergedLine2 =
      value.line2 !== undefined ? value.line2 : existingAddr.line2;
    const mergedCity =
      value.city !== undefined ? value.city : existingAddr.city;
    const mergedState =
      value.state !== undefined ? value.state : existingAddr.state;
    const mergedPin = value.pin !== undefined ? value.pin : existingAddr.pin;

    const fullAddress = [
      mergedLine1,
      mergedLine2,
      mergedCity,
      mergedState,
      mergedPin,
    ]
      .filter(Boolean)
      .join(", ");

    customer.addresses[index] = {
      ...existingAddr,
      ...value,
      id: addressId,
      address: fullAddress || existingAddr.address,
    };

    if (customer.addresses[index].isDefault) {
      customer.location = fullAddress || customer.location;
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Address updated successfully.",
      data: customer.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update address.",
    });
  }
};

// DELETE /api/customer/addresses/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { addressId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses = (customer.addresses || []).filter(
      (a) => a.id !== addressId,
    );
    if (
      customer.addresses.length > 0 &&
      !customer.addresses.some((a) => a.isDefault)
    ) {
      customer.addresses[0].isDefault = true;
    }

    const defaultAddr = customer.addresses.find((a) => a.isDefault);
    if (defaultAddr) {
      const addrObj =
        typeof defaultAddr.toObject === "function"
          ? defaultAddr.toObject()
          : defaultAddr;
      customer.location =
        addrObj.address ||
        [addrObj.line1, addrObj.line2, addrObj.city, addrObj.state, addrObj.pin]
          .filter(Boolean)
          .join(", ");
    } else {
      customer.location = "";
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Address deleted successfully.",
      data: customer.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete address.",
    });
  }
};

// PATCH /api/customer/addresses/:addressId/default
export const setDefaultAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { addressId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    let found = false;
    let selectedAddr = null;
    customer.addresses = (customer.addresses || []).map((a) => {
      const item = typeof a.toObject === "function" ? a.toObject() : a;
      const matches = item.id === addressId;
      if (matches) {
        found = true;
        selectedAddr = item;
      }
      return { ...item, isDefault: matches };
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (selectedAddr) {
      customer.location =
        selectedAddr.address ||
        [
          selectedAddr.line1,
          selectedAddr.line2,
          selectedAddr.city,
          selectedAddr.state,
          selectedAddr.pin,
        ]
          .filter(Boolean)
          .join(", ");
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Default address updated.",
      data: customer.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to set default address.",
    });
  }
};

// GET /api/customer/profile/dashboard
export const getProfileDashboard = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found.",
      });
    }

    const cId = customer.customerId;
    const cEmail = customer.email;
    const cPhone = customer.phone;

    // 1. Fetch Orders (Rentals & Purchases)
    const orderQueries = [];
    if (cId) orderQueries.push({ customerId: cId });
    if (customer._id) {
      orderQueries.push({ customerId: String(customer._id) });
      orderQueries.push({ customerId: customer._id });
    }
    if (cEmail) {
      orderQueries.push({ customerEmail: { $regex: new RegExp(`^${cEmail.trim()}$`, "i") } });
    }
    if (cPhone) {
      const digits = String(cPhone).replace(/\D/g, "");
      if (digits.length >= 10) {
        orderQueries.push({ customerPhone: new RegExp(digits.slice(-10) + "$") });
      } else {
        orderQueries.push({ customerPhone: cPhone });
      }
    }

    let orders = [];
    if (orderQueries.length > 0) {
      try {
        orders = await Order.find({ $or: orderQueries }).sort({ createdAt: -1 });
      } catch (err) {
        console.error("Dashboard order query error:", err);
      }
    }

    // Look up products to enrich missing titles/designers/images
    const prodLookup = new Map();
    const productIdsToFetch = new Set();
    (orders || []).forEach((o) => {
      (o.items || []).forEach((it) => {
        if (it && it.productId) productIdsToFetch.add(String(it.productId));
      });
    });

    if (productIdsToFetch.size > 0) {
      try {
        const idList = Array.from(productIdsToFetch);
        const prods = await Product.find({
          $or: [
            { _id: { $in: idList } },
            { productId: { $in: idList } },
            { id: { $in: idList } },
          ],
        });
        prods.forEach((p) => {
          if (p._id) prodLookup.set(String(p._id), p);
          if (p.productId) prodLookup.set(String(p.productId), p);
          if (p.id) prodLookup.set(String(p.id), p);
        });
      } catch (e) {
        console.error("Dashboard product lookup error:", e);
      }
    }

    const rentals = [];
    const purchases = [];

    (orders || []).forEach((order) => {
      const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
      const hasRentalItem = items.some(
        (item) => String(item.mode || "").toLowerCase() === "rental"
      );
      const isRentalOrder =
        String(order.mode || "").toLowerCase() === "rental" || hasRentalItem;

      if (isRentalOrder) {
        const item =
          items.find((i) => String(i.mode || "").toLowerCase() === "rental") ||
          items[0] ||
          {};
        const matchedProd = item.productId ? prodLookup.get(String(item.productId)) : null;
        const resolvedName = (item.productName && item.productName !== "Designer Piece")
          ? item.productName
          : (matchedProd?.title || matchedProd?.name || order.productName || "Designer Piece");
        const resolvedDesigner = (item.designer && item.designer !== "House of Kaira")
          ? item.designer
          : (matchedProd?.designer || order.designer || "House of Kaira");
        const resolvedImage =
          item.image ||
          (Array.isArray(item.photos) && item.photos[0]) ||
          (Array.isArray(matchedProd?.images) && matchedProd.images[0]) ||
          matchedProd?.image ||
          order.image ||
          "";

        const startDate = item.rentalStartDate || order.rentalStartDate || "";
        const endDate = item.rentalEndDate || order.rentalEndDate || "";
        const dates =
          startDate && endDate
            ? `${startDate}–${endDate}`
            : order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Upcoming";

        let depositStatus = null;
        if (
          order.depositStatus === "Released" ||
          order.depositStatus === "Partially Released"
        ) {
          depositStatus = "refunded";
        } else if (order.depositHeld > 0 || order.depositStatus === "Pending") {
          depositStatus = "pending";
        }

        const size = item.size || order.size || "M";
        const fee = Number(order.grandTotal || order.orderValue || item.amount || 0);

        rentals.push({
          id: order.orderId || String(order._id),
          piece: resolvedName,
          designer: resolvedDesigner,
          status: order.status || item.status || "Confirmed",
          dates,
          size,
          fee,
          depositStatus,
          depositAmount: order.depositHeld || item.deposit || 0,
          image: resolvedImage,
          address: order.address || "",
          createdAt: order.createdAt,
        });
      } else {
        const item = items[0] || {};
        const matchedProd = item.productId ? prodLookup.get(String(item.productId)) : null;
        const resolvedName = (item.productName && item.productName !== "Designer Piece")
          ? item.productName
          : (matchedProd?.title || matchedProd?.name || order.productName || "Designer Piece");
        const resolvedDesigner = (item.designer && item.designer !== "House of Kaira")
          ? item.designer
          : (matchedProd?.designer || order.designer || "House of Kaira");
        const resolvedImage =
          item.image ||
          (Array.isArray(item.photos) && item.photos[0]) ||
          (Array.isArray(matchedProd?.images) && matchedProd.images[0]) ||
          matchedProd?.image ||
          order.image ||
          "";

        const type = item.mode || order.mode || "Buy";
        const typeDetail = `${type} - ${resolvedDesigner}`;
        const orderedOn = new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const dateStr =
          order.status === "Delivered"
            ? `Delivered ${new Date(
                order.updatedAt || order.createdAt
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`
            : `Ordered ${orderedOn}`;

        const amount = Number(order.grandTotal || order.orderValue || item.amount || 0);
        const size = item.size || order.size || "M";

        purchases.push({
          id: order.orderId || String(order._id),
          piece: resolvedName,
          designer: resolvedDesigner,
          type,
          typeDetail,
          status: order.status || "Confirmed",
          amount,
          total: amount,
          size,
          orderedOn,
          date: dateStr,
          image: resolvedImage,
          address: order.address || "",
          createdAt: order.createdAt,
        });
      }
    });

    // 2. Fetch Wishlist Products
    const wishlistIds = Array.isArray(customer.wishlist)
      ? customer.wishlist.filter(Boolean).map(String)
      : [];
    let savedPieces = [];
    if (wishlistIds.length > 0) {
      try {
        const products = await Product.find({
          $or: [
            { _id: { $in: wishlistIds } },
            { productId: { $in: wishlistIds } },
            { sku: { $in: wishlistIds } },
            { id: { $in: wishlistIds } },
          ],
        });

        savedPieces = (products || []).map((p) => {
          const modesUpper = Array.isArray(p.listingModes)
            ? p.listingModes.map((m) => String(m).toUpperCase())
            : [];
          const isRental = modesUpper.some((m) => m === "RENTAL" || m === "RENT");
          const isPreloved = modesUpper.some((m) => m === "PRELOVED" || m === "PRE-LOVED");
          const mode = isRental ? "Rental" : isPreloved ? "Preloved" : "Buy New";
          const price = Number(
            p.rentalPrice || p.listingPrice || p.originalRetailPrice || p.price || 0
          );

          const resolvedImage =
            (Array.isArray(p.images) && p.images[0]) ||
            (Array.isArray(p.image) && p.image[0]) ||
            (typeof p.image === "string" && p.image) ||
            "";

          const pId = String(p._id);
          return {
            _id: pId,
            id: pId,
            productId: p.productId || p.sku || pId,
            sku: p.sku || p.productId,
            name: p.name,
            designer: p.designer || "",
            mode,
            price,
            sizes:
              Array.isArray(p.sizes) && p.sizes.length > 0
                ? p.sizes
                : ["Free Size"],
            colors: p.color ? [p.color] : [],
            image: resolvedImage,
            listingModes: p.listingModes || [mode.toUpperCase()],
            rentalPrice: p.rentalPrice,
            listingPrice: p.listingPrice,
            originalRetailPrice: p.originalRetailPrice || p.retailPrice,
            category: p.category || p.subTitle || "",
            originalData: p,
          };
        });
      } catch (err) {
        console.error("Dashboard wishlist query error:", err);
      }
    }

    // 3. Fetch Listed Pieces
    const listerQueries = [];
    if (cId) listerQueries.push({ listerId: cId });
    if (cEmail) listerQueries.push({ listerId: cEmail });
    if (cPhone) listerQueries.push({ listerId: cPhone });

    let listedPieces = [];
    if (listerQueries.length > 0) {
      try {
        const listedProducts = await Product.find({ $or: listerQueries }).sort({
          createdAt: -1,
        });
        listedPieces = (listedProducts || []).map((p) => {
          const isRental = p.listingModes?.includes("RENTAL");
          const isResale =
            p.listingModes?.includes("BUY") ||
            p.listingModes?.includes("PRELOVED");
          const mode =
            isRental && isResale ? "Dual" : isResale ? "Resale" : "Rental";

          const rentalPrice = Number(p.rentalPrice || 0);
          const resalePrice = Number(
            p.listingPrice || p.originalRetailPrice || 0
          );
          const price = mode === "Resale" ? resalePrice : rentalPrice;
          const priceLabel = mode === "Resale" ? "Resale price" : "Rental price";
          const priceSuffix = mode === "Resale" ? "" : " / booking";

          return {
            id: String(p._id),
            productId: p.productId,
            name: p.name,
            designer: p.designer || "",
            mode,
            totalEarned: Number(p.totalEarned || 0),
            timesRented: p.timesRented > 0 ? p.timesRented : null,
            nextPayout: p.nextPayout || null,
            imageGradient: "linear-gradient(160deg, #2C2018, #1A1210)",
            status:
              p.status === "Live" || p.status === "Active"
                ? "active"
                : p.status?.toLowerCase() || "draft",
            listedSince: p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })
              : "Recent",
            size: (Array.isArray(p.sizes) && p.sizes[0]) || "Free Size",
            priceLabel,
            price,
            priceSuffix,
            rentalPrice,
            rentalPriceSuffix: " / booking",
            resalePrice,
            resalePriceSuffix: "",
            image: (Array.isArray(p.images) && p.images[0]) || "",
          };
        });
      } catch (err) {
        console.error("Dashboard listed query error:", err);
      }
    }

    // 4. Fetch Submissions (search comprehensively by phone, email, customerId, and linked lister accounts)
    let submissions = [];
    try {
      const phoneDigits = normalizePhone(cPhone);
      const emailRegex = cEmail ? new RegExp(`^${cEmail.trim()}$`, "i") : null;

      const subQueries = [];
      if (cId) {
        subQueries.push({ customerId: cId });
        subQueries.push({ customer_id: cId });
        subQueries.push({ listerId: cId });
      }
      if (customer._id) {
        subQueries.push({ customerId: String(customer._id) });
        subQueries.push({ customer_id: String(customer._id) });
      }
      if (emailRegex) {
        subQueries.push({ email: emailRegex });
        subQueries.push({ listerEmail: emailRegex });
      }
      if (phoneDigits && phoneDigits.length >= 10) {
        const phoneRegex = new RegExp(phoneDigits.slice(-10) + "$");
        subQueries.push({ phone: phoneRegex });
        subQueries.push({ listerPhone: phoneRegex });
        subQueries.push({ mobile: phoneRegex });
      }

      // Also match any Lister accounts belonging to this customer
      const listerConditions = [];
      if (emailRegex) listerConditions.push({ email: emailRegex });
      if (phoneDigits && phoneDigits.length >= 10) {
        listerConditions.push({ phone: new RegExp(phoneDigits.slice(-10) + "$") });
      }
      if (cId) listerConditions.push({ listerId: cId });
      if (customer.name) {
        const nameSlug = customer.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        listerConditions.push({ listerId: new RegExp(nameSlug, "i") });
      }

      if (listerConditions.length > 0) {
        const matchedListers = await Lister.find({ $or: listerConditions });
        for (const ml of matchedListers) {
          if (ml.listerId) {
            subQueries.push({ listerId: ml.listerId });
            subQueries.push({ listerID: ml.listerId });
            subQueries.push({ lister_id: ml.listerId });
          }
        }
      }

      if (subQueries.length > 0) {
        const rawSubs = await Submission.find({ $or: subQueries }).sort({
          createdAt: -1,
        });

        // Deduplicate submissions by subid / _id
        const seenSubs = new Set();
        const subs = [];
        for (const s of rawSubs) {
          const key = s.subid || String(s._id);
          if (!seenSubs.has(key)) {
            seenSubs.add(key);
            subs.push(s);
          }
        }

        submissions = subs.map((sub) => {
          let status = "Under Review";
          if (sub.decision && typeof sub.decision === "object") {
            status = sub.decision.status || sub.decision.what || "Under Review";
          } else if (sub.status) {
            status = sub.status;
          }
          if (status === "Pending" || status === "New" || status === "In Review") {
            status = "Under Review";
          }

          const firstImage =
            sub.media && sub.media.length > 0
              ? sub.media[0]?.url || sub.media[0]
              : "";

          return {
            id: sub.subid || String(sub._id),
            name: sub.piece || "Submission",
            designer: sub.designer || "Designer Atelier",
            status,
            submittedDate:
              sub.submitted ||
              (sub.createdAt
                ? new Date(sub.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent"),
            preferredOutcome: sub.intent || "Rent & Resale",
            image: firstImage,
            images: (sub.media || []).map((m) => m.url || m),
            imageGradient: "linear-gradient(160deg, #F0E8D8, #E0CDA8)",
            pieceType: sub.category || sub.pieceType || "Piece",
            colourFamily: sub.colour || sub.color || "Multi",
            size: sub.size || "Standard",
            condition: sub.conditionClaim || sub.condition || "Excellent",
            timesWorn: sub.timesWorn || (sub.worn ? `${sub.worn} times` : "1-2 times"),
            originalPrice: sub.originalPrice
              ? String(sub.originalPrice).replace(/[^0-9]/g, "")
              : "",
            photosSubmitted: sub.photos
              ? `${sub.photos} photos`
              : sub.media?.length
                ? `${sub.media.length} photos`
                : "Photos submitted",
            pickupCity: sub.pickupCity || sub.city || "",
          };
        });
      }
    } catch (err) {
      console.error("Dashboard submission query error:", err);
    }

    // 5. Active Rental Alert
    const activeRental = rentals.find((r) =>
      ["Dispatched", "Confirmed", "Shipped", "Delivered", "Return Due"].includes(
        r.status
      )
    );

    const activeRentalCount = rentals.filter((r) =>
      ["Dispatched", "Confirmed", "Shipped", "Delivered", "Return Due"].includes(
        r.status
      )
    ).length;

    const addresses = customer.addresses || [];

    return res.json({
      success: true,
      data: {
        customer: sanitizeCustomer(customer),
        rentals,
        purchases,
        savedPieces,
        listedPieces,
        submissions,
        addresses,
        counts: {
          rentals: rentals.length,
          purchases: purchases.length,
          savedPieces: savedPieces.length,
          listedPieces: listedPieces.length,
          submissions: submissions.length,
          addresses: addresses.length,
          activeRentals: activeRentalCount,
        },
        activeRentalAlert: activeRental
          ? {
              id: activeRental.id,
              title: `Active Rental - ${activeRental.status}`,
              subtitle: `${activeRental.piece} · ${activeRental.designer} · ${
                activeRental.dates
              }${
                activeRental.depositAmount
                  ? ` · Deposit ₹${activeRental.depositAmount.toLocaleString()} ${
                      activeRental.depositStatus || "pending refund"
                    }`
                  : ""
              }`,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("GetProfileDashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching profile dashboard.",
      error: error.message,
    });
  }
};

// GET /api/customer/profile/submissions
export const getProfileSubmissions = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found.",
      });
    }

    const cId = customer.customerId;
    const cEmail = customer.email;
    const cPhone = customer.phone;

    const phoneDigits = normalizePhone(cPhone);
    const emailRegex = cEmail ? new RegExp(`^${cEmail.trim()}$`, "i") : null;

    const subQueries = [];
    if (cId) {
      subQueries.push({ customerId: cId });
      subQueries.push({ customer_id: cId });
      subQueries.push({ listerId: cId });
    }
    if (customer._id) {
      subQueries.push({ customerId: String(customer._id) });
      subQueries.push({ customer_id: String(customer._id) });
    }
    if (emailRegex) {
      subQueries.push({ email: emailRegex });
      subQueries.push({ listerEmail: emailRegex });
    }
    if (phoneDigits && phoneDigits.length >= 10) {
      const phoneRegex = new RegExp(phoneDigits.slice(-10) + "$");
      subQueries.push({ phone: phoneRegex });
      subQueries.push({ listerPhone: phoneRegex });
      subQueries.push({ mobile: phoneRegex });
    }

    const listerConditions = [];
    if (emailRegex) listerConditions.push({ email: emailRegex });
    if (phoneDigits && phoneDigits.length >= 10) {
      listerConditions.push({ phone: new RegExp(phoneDigits.slice(-10) + "$") });
    }
    if (cId) listerConditions.push({ listerId: cId });
    if (customer.name) {
      const nameSlug = customer.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      listerConditions.push({ listerId: new RegExp(nameSlug, "i") });
    }

    if (listerConditions.length > 0) {
      const matchedListers = await Lister.find({ $or: listerConditions });
      for (const ml of matchedListers) {
        if (ml.listerId) {
          subQueries.push({ listerId: ml.listerId });
          subQueries.push({ listerID: ml.listerId });
          subQueries.push({ lister_id: ml.listerId });
        }
      }
    }

    let submissions = [];
    if (subQueries.length > 0) {
      const rawSubs = await Submission.find({ $or: subQueries }).sort({
        createdAt: -1,
      });

      const seenSubs = new Set();
      const subs = [];
      for (const s of rawSubs) {
        const key = s.subid || String(s._id);
        if (!seenSubs.has(key)) {
          seenSubs.add(key);
          subs.push(s);
        }
      }

      submissions = subs.map((sub) => {
        let status = "Under Review";
        if (sub.decision && typeof sub.decision === "object") {
          status = sub.decision.status || sub.decision.what || "Under Review";
        } else if (sub.status) {
          status = sub.status;
        }
        if (status === "Pending" || status === "New" || status === "In Review") {
          status = "Under Review";
        }

        const firstImage =
          sub.media && sub.media.length > 0
            ? sub.media[0]?.url || sub.media[0]
            : "";

        return {
          id: sub.subid || String(sub._id),
          name: sub.piece || "Submission",
          designer: sub.designer || "Designer Atelier",
          status,
          submittedDate:
            sub.submitted ||
            (sub.createdAt
              ? new Date(sub.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Recent"),
          preferredOutcome: sub.intent || "Rent & Resale",
          image: firstImage,
          images: (sub.media || []).map((m) => m.url || m),
          imageGradient: "linear-gradient(160deg, #F0E8D8, #E0CDA8)",
          pieceType: sub.category || sub.pieceType || "Piece",
          colourFamily: sub.colour || sub.color || "Multi",
          size: sub.size || "Standard",
          condition: sub.conditionClaim || sub.condition || "Excellent",
          timesWorn: sub.timesWorn || (sub.worn ? `${sub.worn} times` : "1-2 times"),
          originalPrice: sub.originalPrice
            ? String(sub.originalPrice).replace(/[^0-9]/g, "")
            : "",
          photosSubmitted: sub.photos
            ? `${sub.photos} photos`
            : sub.media?.length
              ? `${sub.media.length} photos`
              : "Photos submitted",
          pickupCity: sub.pickupCity || sub.city || "",
        };
      });
    }

    return res.json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("GetProfileSubmissions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching customer submissions.",
      error: error.message,
    });
  }
};

