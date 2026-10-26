// controllers/bookingController.js

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import Customer from "../models/Customer.js";
import Lister from "../models/Lister.js";
import { nextCustomerId } from "../services/customerIdService.js";
import { validateBookingDates } from "../validations/bookingValidation.js";

const dateOnly = (v) => {
  const d = new Date(v);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const overlaps = (a, b, c, d) =>
  dateOnly(a) <= dateOnly(d) && dateOnly(b) >= dateOnly(c);

// ✅ NEW: Check product availability (for route /:id/availability)
export const checkProductAvailability = async (req, res) => {
  try {
    const { startDate, endDate, mode, excludeOrderId } = req.query;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(422).json({
        success: false,
        available: false,
        message: "startDate and endDate are required",
      });
    }

    const product = await Product.findOne({
      $or: [{ productId: req.params.id }, { _id: req.params.id }],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        available: false,
        message: "Product not found",
      });
    }

    // Check if product is live
    if (product.status !== "Live") {
      return res.status(409).json({
        success: false,
        available: false,
        reason: "PRODUCT_NOT_LIVE",
        message: "This product is not live",
      });
    }

    // Check availability
    if (product.availability !== "Available Now") {
      return res.status(409).json({
        success: false,
        available: false,
        reason: "PRODUCT_UNAVAILABLE",
        message: `Product is currently ${product.availability}`,
      });
    }

    // Check listing modes
    const listingModes = product.listingModes || ["RENTAL"];
    if (mode && !listingModes.includes(mode)) {
      return res.status(409).json({
        success: false,
        available: false,
        reason: "MODE_UNAVAILABLE",
        message: `${mode} mode is not available for this product`,
      });
    }

    // Check minimum duration
    const duration =
      Math.floor((dateOnly(endDate) - dateOnly(startDate)) / 86400000) + 1;
    const minDuration = product.minimumDurationDays || 3;

    if (mode === "RENTAL" && duration < minDuration) {
      return res.status(409).json({
        success: false,
        available: false,
        reason: "MINIMUM_DURATION",
        message: `Minimum rental duration is ${minDuration} days`,
      });
    }

    // Check buffer days
    const buffer = Number(product.cleaningBufferDays || 0);
    const requestedStart = dateOnly(startDate);
    const requestedEnd = dateOnly(endDate);

    const occupiedStart = new Date(requestedStart);
    occupiedStart.setUTCDate(occupiedStart.getUTCDate() - buffer);

    const occupiedEnd = new Date(requestedEnd);
    occupiedEnd.setUTCDate(occupiedEnd.getUTCDate() + buffer);

    // Check blocked dates
    const blockedDates = product.blockedDates || [];
    const blocked = blockedDates.find((range) =>
      overlaps(occupiedStart, occupiedEnd, range.from, range.to),
    );

    if (blocked) {
      return res.status(409).json({
        success: false,
        available: false,
        reason: "BLOCKED_DATE",
        message: `Product is blocked during the requested dates (${blocked.reason})`,
      });
    }

    // Check booking conflicts (both bookingHistory and externalBookings)
    const allBookings = [
      ...(product.bookingHistory || []),
      ...(product.externalBookings || []),
    ];

    const booking = allBookings.find(
      (item) =>
        item.orderId !== excludeOrderId &&
        item.startDate &&
        item.endDate &&
        overlaps(occupiedStart, occupiedEnd, item.startDate, item.endDate) &&
        !["Cancelled", "Rejected"].includes(item.status),
    );

    if (booking) {
      return res.status(409).json({
        success: false,
        available: false,
        reason: "DATE_CONFLICT",
        message: "Product is already booked for the requested dates",
      });
    }

    // All checks passed - product is available
    res.json({
      success: true,
      available: true,
      data: {
        productId: product.productId,
        startDate,
        endDate,
        durationDays: duration,
        cleaningBufferDays: buffer,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      available: false,
      message: e.message,
    });
  }
};

// ✅ NEW: Get product calendar data
export const getProductCalendar = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ productId: req.params.id }, { _id: req.params.id }],
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const Order = (await import("../models/Order.js")).default;
    const targetProdId = String(
      product.productId || product._id || req.params.id,
    ).trim();
    const targetProdName = String(product.name || "")
      .trim()
      .toLowerCase();

    const allDbOrders = await Order.find({}).sort({ createdAt: -1 });

    const matchedDbOrders = allDbOrders.filter((o) => {
      const topProdId = String(o.productId || "").trim();
      const topProdName = String(o.productName || "")
        .trim()
        .toLowerCase();

      if (
        topProdId === targetProdId ||
        (topProdName && topProdName === targetProdName)
      )
        return true;
      if (Array.isArray(o.items)) {
        return o.items.some((item) => {
          const itemProdId = String(item.productId || "").trim();
          const itemProdName = String(item.productName || "")
            .trim()
            .toLowerCase();
          return (
            itemProdId === targetProdId ||
            (itemProdName && itemProdName === targetProdName)
          );
        });
      }
      return false;
    });

    const formattedDbOrders = (
      matchedDbOrders.length > 0 ? matchedDbOrders : allDbOrders
    ).map((o) => {
      const firstItem =
        Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : {};
      return {
        orderId: o.orderId || o.id,
        customerName: o.customerName || firstItem.customerName || "",
        whatsappNumber: o.customerPhone || "",
        city: o.customerCity || o.address || "",
        amount: Number(
          o.orderValue || o.grandTotal || o.amount || firstItem.amount || 0,
        ),
        deposit: Number(o.depositHeld || firstItem.deposit || 0),
        startDate: o.rentalStartDate || firstItem.rentalStartDate || "",
        endDate: o.rentalEndDate || firstItem.rentalEndDate || "",
        status: o.status || "Confirmed",
        depositStatus: o.depositStatus || "Pending",
        mode: o.mode || "Rental",
        listerSplitPercent: 45,
      };
    });

    const bookings = (product.bookingHistory || []).map((b) => {
      const match = formattedDbOrders.find(
        (o) =>
          o.orderId === b.orderId ||
          (b.customerName &&
            o.customerName &&
            b.customerName.toLowerCase() === o.customerName.toLowerCase()),
      );

      return {
        ...b,
        orderId: match ? match.orderId : b.orderId,
        customerName: match ? match.customerName : b.customerName,
        status: match ? match.status : b.status,
      };
    });

    const finalOrderHistory =
      formattedDbOrders.length > 0 ? formattedDbOrders : bookings;

    res.json({
      success: true,
      data: {
        blockedDates: product.blockedDates || [],
        bookingHistory: bookings,
        externalBookings: bookings,
        orderHistory: finalOrderHistory,
        orders: matchedDbOrders,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ NEW: Add external booking
export const addExternalBooking = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ productId: req.params.id }, { _id: req.params.id }],
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const {
      customerName,
      startDate,
      endDate,
      amount,
      whatsappNumber,
      city,
      channel,
      listerSplitPercent,
      splitNote,
    } = req.body;

    // Validate dates
    if (!startDate || !endDate || !customerName) {
      return res.status(422).json({
        success: false,
        message: "startDate, endDate and customerName are required",
      });
    }

    // Check availability first
    const buffer = Number(product.cleaningBufferDays || 0);
    const requestedStart = dateOnly(startDate);
    const requestedEnd = dateOnly(endDate);

    const occupiedStart = new Date(requestedStart);
    occupiedStart.setUTCDate(occupiedStart.getUTCDate() - buffer);

    const occupiedEnd = new Date(requestedEnd);
    occupiedEnd.setUTCDate(occupiedEnd.getUTCDate() + buffer);

    const allBookings = [
      ...(product.bookingHistory || []),
      ...(product.externalBookings || []),
    ];

    const bookingConflict = allBookings.find(
      (item) =>
        item.startDate &&
        item.endDate &&
        overlaps(occupiedStart, occupiedEnd, item.startDate, item.endDate) &&
        !["Cancelled", "Rejected"].includes(item.status),
    );

    if (bookingConflict) {
      return res.status(409).json({
        success: false,
        message: "Product is already booked for the requested dates",
      });
    }

    // Create external booking entry
    const externalBooking = {
      orderId: `EXT-${Date.now()}`,
      customerName,
      startDate,
      endDate,
      amount: amount || 0,
      deposit: 0,
      mode: "RENTAL",
      status: "Confirmed",
      source: "External",
      whatsappNumber: whatsappNumber || "",
      city: city || "",
      channel: channel || "WhatsApp",
      listerSplitPercent: listerSplitPercent || 45,
      splitNote: splitNote || "",
      depositStatus: "Pending",
    };

    // Add to booking history
    if (!product.bookingHistory) {
      product.bookingHistory = [];
    }
    product.bookingHistory.push(externalBooking);

    // Also add to external bookings
    if (!product.externalBookings) {
      product.externalBookings = [];
    }
    product.externalBookings.push(externalBooking);

    // Add to blocked dates
    if (!product.blockedDates) {
      product.blockedDates = [];
    }
    product.blockedDates.push({
      from: startDate,
      to: endDate,
      reason: `External booking - ${customerName}`,
    });

    // Add activity log
    if (!product.activityLog) {
      product.activityLog = [];
    }
    product.activityLog.push({
      action: "External booking added",
      user: req.body.user || "Admin",
      remarks: `${customerName} - ${startDate} to ${endDate}`,
    });

    await product.save();

    // Create or Update Customer record in DB
    let customerId = "";
    try {
      const phone = whatsappNumber || "";
      const email = `${(customerName || "renter").toLowerCase().trim().replace(/\s+/g, "")}@houseofkaira.com`;

      const query = [];
      if (phone) query.push({ phone });
      if (email) query.push({ email });
      if (customerName) query.push({ name: customerName });

      let cust =
        query.length > 0 ? await Customer.findOne({ $or: query }) : null;
      if (cust) {
        cust.totalRentals = Number(cust.totalRentals || 0) + 1;
        cust.totalSpent =
          Number(cust.totalSpent || 0) +
          Number(amount || product.rentalPrice || 0);
        await cust.save();
        customerId = cust.customerId || cust._id;
      } else {
        customerId = await nextCustomerId();
        cust = await Customer.create({
          customerId,
          name: customerName,
          email,
          phone,
          location: city || "India",
          totalRentals: 1,
          totalSpent: Number(amount || product.rentalPrice || 0),
          securityDepositHeld: Number(product.securityDeposit || 0),
          tier: "New",
        });
      }
    } catch (custErr) {
      console.warn("Customer creation warning in bookingController:", custErr);
    }

    // Resolve Lister Info
    let resolvedListerId = product.listerId || product.lister_id || "";
    let resolvedListerName = product.listerName || product.lister_name || "";
    if (resolvedListerId && !resolvedListerName) {
      try {
        const lRec = await Lister.findOne({
          $or: [{ listerId: resolvedListerId }, { _id: resolvedListerId }],
        });
        if (lRec) resolvedListerName = lRec.name;
      } catch (e) {}
    }
    if (!resolvedListerId) {
      resolvedListerId = "simran-chouhan";
      resolvedListerName = "Simran Chouhan";
    }
    if (!resolvedListerName) {
      resolvedListerName =
        resolvedListerId === "ananya-sharma" ? "Ananya Sharma" : "Simran Chouhan";
    }

    // ✅ FLOW INTEGRATION: Create Order record for Rental Calendar & Dispatch Schedule
    const extOrderId = `HOK-ORD-${Date.now()}`;
    const totalAmount = Number(amount || product.rentalPrice || 0);
    const depositAmount = Number(product.securityDeposit || 0);
    const listerSplit = Number(
      listerSplitPercent || product.payoutPercentage || 80,
    );
    const listerPayoutAmount = Math.round((totalAmount * listerSplit) / 100);
    const hokCommissionAmount = Math.max(0, totalAmount - listerPayoutAmount);

    try {
      await Order.create({
        orderId: extOrderId,
        customerId,
        customerName,
        customerPhone: whatsappNumber || "",
        customerCity: city || "",
        listerId: resolvedListerId,
        listerName: resolvedListerName,
        productName: product.name,
        designer: product.designer || "House of Kaira",
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        items: [
          {
            productId: product.productId,
            productName: product.name,
            designer: product.designer || "",
            mode: "Rental",
            size: product.sizes?.[0] || "S",
            rentalStartDate: startDate,
            rentalEndDate: endDate,
            amount: totalAmount,
            deposit: depositAmount,
            listerId: resolvedListerId,
            listerName: resolvedListerName,
            status: "Confirmed",
          },
        ],
        mode: "Rental",
        status: "Confirmed",
        orderValue: totalAmount,
        depositHeld: depositAmount,
        depositStatus: depositAmount > 0 ? "Pending" : "None",
        grandTotal: totalAmount,
        amount: totalAmount,
        listerPayout: listerPayoutAmount,
        payoutStatus: "Pending Approval",
      });
    } catch (orderErr) {
      console.warn("Order creation warning:", orderErr.message);
    }

    // ✅ FLOW INTEGRATION: Create Payout record for Lister Payouts
    try {
      const cleanOrdId = String(extOrderId).replace(/[^a-zA-Z0-9]/g, "");
      await Payout.create({
        payoutId: `PAY-${cleanOrdId}`,
        listerId: resolvedListerId,
        listerName: resolvedListerName,
        orderId: extOrderId,
        productId: product.productId,
        productName: product.name,
        mode: "Rental",
        transactionAmount: totalAmount,
        payoutPercentage: listerSplit,
        listerShare: listerPayoutAmount,
        hokCommission: hokCommissionAmount,
        taxDeduction: 0,
        netPayout: listerPayoutAmount,
        status: "Pending",
        dueDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 86400000),
      });
    } catch (payoutErr) {
      console.warn("Payout creation warning:", payoutErr.message);
    }

    res.json({
      success: true,
      data: externalBooking,
      message: "External booking added successfully",
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ EXISTING: Reserve product
export const reserveProduct = async (req, res) => {
  const { error, value } = validateBookingDates(req.body);
  if (error)
    return res.status(422).json({
      success: false,
      message: error.details.map((d) => d.message).join("; "),
    });

  try {
    const product = await Product.findOne({
      $or: [{ productId: req.params.id }, { _id: req.params.id }],
    });

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // Allow external bookings for admin on any product status
    const days =
      Math.floor(
        (dateOnly(value.endDate) - dateOnly(value.startDate)) / 86400000,
      ) + 1;

    const buffer = Number(product.cleaningBufferDays || 0);
    const start = dateOnly(value.startDate);
    const end = dateOnly(value.endDate);
    const occupiedStart = new Date(start);
    occupiedStart.setUTCDate(start.getUTCDate() - buffer);
    const occupiedEnd = new Date(end);
    occupiedEnd.setUTCDate(end.getUTCDate() + buffer);

    const orderId =
      req.body.orderId || `HOK-ORD-${Date.now().toString().slice(-4)}`;
    const rentalAmount = Number(req.body.amount || product.rentalPrice || 0);

    const booking = {
      orderId,
      customerName: req.body.customerName || "External Renter",
      date: value.startDate,
      startDate: value.startDate,
      endDate: value.endDate,
      amount: rentalAmount,
      deposit: Number(req.body.deposit || product.securityDeposit || 0),
      mode: value.mode || "Rental",
      status: "Confirmed",
      source: req.body.channel || "WhatsApp/Instagram",
    };

    // 1. Resolve/create a real customer before creating its order.
    try {
      const phone = req.body.whatsappNumber || "";
      const email = req.body.customerEmail || "";
      let customer = req.body.customerId
        ? await Customer.findOne({ customerId: req.body.customerId })
        : null;
      if (!customer && phone) customer = await Customer.findOne({ phone });
      if (!customer && email) customer = await Customer.findOne({ email });
      if (!customer) {
        customer = await Customer.create({
          customerId: await nextCustomerId(),
          name: req.body.customerName || "External Renter",
          email: email || `guest_${Date.now()}@houseofkaira.com`,
          phone,
          location: req.body.city || "India",
        });
      }

      let resolvedListerId = product.listerId || product.lister_id || "";
      let resolvedListerName = product.listerName || product.lister_name || "";
      if (resolvedListerId && !resolvedListerName) {
        try {
          const lRec = await Lister.findOne({
            $or: [{ listerId: resolvedListerId }, { _id: resolvedListerId }],
          });
          if (lRec) resolvedListerName = lRec.name;
        } catch (e) {}
      }
      if (!resolvedListerId) {
        resolvedListerId = "simran-chouhan";
        resolvedListerName = "Simran Chouhan";
      }
      if (!resolvedListerName) {
        resolvedListerName =
          resolvedListerId === "ananya-sharma"
            ? "Ananya Sharma"
            : "Simran Chouhan";
      }

      await Order.create({
        orderId,
        customerId: customer.customerId,
        customerName: customer.name,
        customerPhone: customer.phone || phone,
        customerEmail: customer.email,
        productId: product.productId || product._id,
        productName: product.name,
        designer: product.designer || "House of Kaira",
        listerId: resolvedListerId,
        listerName: resolvedListerName,
        items: [
          {
            productId: product.productId || product._id,
            productName: product.name,
            designer: product.designer || "House of Kaira",
            listerId: resolvedListerId,
            listerName: resolvedListerName,
            mode: "Rental",
            size: product.sizes?.[0] || "S",
            rentalStartDate: value.startDate,
            rentalEndDate: value.endDate,
            amount: rentalAmount,
            deposit: Number(req.body.deposit || product.securityDeposit || 0),
            status: "Confirmed",
          },
        ],
        mode: "Rental",
        amount: rentalAmount,
        orderValue: rentalAmount,
        deposit: Number(req.body.deposit || product.securityDeposit || 0),
        discount: 0,
        grandTotal:
          rentalAmount +
          Number(req.body.deposit || product.securityDeposit || 0),
        rentalStartDate: value.startDate,
        rentalEndDate: value.endDate,
        status: "Confirmed",
        payoutStatus: "Pending Approval",
        address: req.body.city || "External Order",
      });
    } catch (orderErr) {
      console.warn("Order creation error during external booking:", orderErr);
    }

    // 2. Create real Payout document for Lister
    try {
      const splitPct = Number(
        req.body.listerSplitPercent || product.payoutPercentage || 80,
      );
      const listerShare = Math.round((rentalAmount * splitPct) / 100);
      const cleanOrderId = String(orderId).replace(/[^a-zA-Z0-9]/g, "");

      let resolvedListerId = product.listerId || product.lister_id || "simran-chouhan";
      let resolvedListerName = product.listerName || product.lister_name || "Simran Chouhan";

      await Payout.create({
        payoutId: `PAY-${cleanOrderId}`,
        orderId,
        productId: product.productId || product._id,
        productName: product.name,
        piece: product.name,
        listerId: resolvedListerId,
        listerName: resolvedListerName,
        mode: "Rental",
        transactionAmount: rentalAmount,
        transactionValue: rentalAmount,
        payoutPercentage: splitPct,
        payoutPercent: splitPct,
        listerShare,
        payoutAmount: listerShare,
        hokCommission: Math.max(0, rentalAmount - listerShare),
        taxDeduction: 0,
        netPayout: listerShare,
        status: "Pending",
        dueDate: value.endDate
          ? new Date(value.endDate)
          : new Date(Date.now() + 7 * 86400000),
        splitPercent: splitPct,
      });
    } catch (payoutErr) {
      console.warn("Payout creation error during external booking:", payoutErr);
    }

    // 3. Update Product document (bookingHistory, externalBookings, activityLog, timesRented)
    const updatedHistory = [...(product.bookingHistory || []), booking];
    const updatedExternal = [...(product.externalBookings || []), booking];
    const updatedActivity = [
      ...(product.activityLog || []),
      {
        action: "External Booking Created",
        user: req.body.createdBy || "Admin",
        remarks: `Order ${orderId} reserved for ${req.body.customerName || "Customer"} (${value.startDate} to ${value.endDate})`,
      },
    ];

    const locked = await Product.findByIdAndUpdate(
      product._id,
      {
        $set: {
          bookingHistory: updatedHistory,
          externalBookings: updatedExternal,
          activityLog: updatedActivity,
          timesRented: Number(product.timesRented || 0) + 1,
        },
      },
      { new: true },
    );

    if (!locked) {
      return res.status(409).json({
        success: false,
        message:
          "Product was booked by another request; please choose different dates",
      });
    }

    res.status(201).json({
      success: true,
      data: {
        productId: locked.productId,
        booking,
        durationDays: days,
        cleaningBufferDays: buffer,
      },
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getProductActivity = async (req, res) => {
  try {
    const productId = req.params.id;

    // ✅ Product ko dhoondho
    const product = await Product.findOne(productFilter(productId));

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // ✅ Activity log return karo (Agar activityLog empty hai toh empty array)
    res.json({ success: true, data: product.activityLog || [] });
  } catch (error) {
    console.error("Error fetching product activity:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
