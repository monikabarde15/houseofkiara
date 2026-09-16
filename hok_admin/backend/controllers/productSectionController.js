import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Lister from "../models/Lister.js";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import Offer from "../models/Offer.js";
import PromoCode from "../models/PromoCode.js";
import mongoose from "mongoose";
import { syncCustomerOrderStats } from "./customerController.js";

const findProduct = async (id) => {
  if (!id) return null;
  let p = await Product.findOne({ productId: id });
  if (!p) p = await Product.findOne({ _id: id });
  if (!p && typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)) {
    p = await Product.findById(id);
  }
  if (!p) p = await Product.findOne({ $or: [{ productId: id }, { id: id }] });
  return p;
};

const save = async (product, action, data) => {
  product.activityLog.push({
    action,
    user: data.createdBy || data.updatedBy || "Admin",
    remarks: data.remarks || "",
  });
  await product.save();
  return product;
};

export const getAvailabilityCalendar = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });

    const targetProdId = String(p.productId || req.params.id || "").trim();
    const targetMongoId = String(p._id || "").trim();
    const targetProdName = String(p.name || "").trim().toLowerCase();

    const rawDbOrders = await Order.find({}).sort({ createdAt: -1 });
    const allDbOrders = rawDbOrders.map((o) => (typeof o.toObject === "function" ? o.toObject() : o));

    const matchedDbOrders = allDbOrders.filter((o) => {
      const topProdId = String(o.productId || "").trim();
      const topProdName = String(o.productName || "").trim().toLowerCase();
      const topMatch =
        (topProdId && (topProdId === targetProdId || topProdId === targetMongoId || topProdId === req.params.id)) ||
        (topProdName && targetProdName && topProdName === targetProdName);
      if (topMatch) return true;
      const items = Array.isArray(o.items) ? o.items : [];
      return items.some((item) => {
        const itemProdId = String(item.productId || "").trim();
        const itemProdName = String(item.productName || "").trim().toLowerCase();
        const idMatches = itemProdId && (itemProdId === targetProdId || itemProdId === targetMongoId || itemProdId === req.params.id);
        const nameMatches = itemProdName && targetProdName && itemProdName === targetProdName;
        return idMatches || nameMatches;
      });
    });

    const formattedDbOrders = matchedDbOrders.map((o) => {
      const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : {};
      return {
        orderId: o.orderId || o.id,
        customerName: o.customerName || firstItem.customerName || "",
        whatsappNumber: o.customerPhone || o.whatsappNumber || firstItem.whatsappNumber || "",
        city: o.customerCity || o.city || o.address || firstItem.city || "",
        amount: Number(firstItem.amount || o.orderValue || o.grandTotal || o.amount || 0),
        deposit: Number(firstItem.deposit || o.depositHeld || o.deposit || 0),
        startDate: firstItem.rentalStartDate || o.rentalStartDate || o.startDate || "",
        endDate: firstItem.rentalEndDate || o.rentalEndDate || o.endDate || "",
        status: o.status || firstItem.status || "Confirmed",
        depositStatus: o.depositStatus || "Pending",
        mode: o.mode || firstItem.mode || "Rental",
        listerSplitPercent: o.listerSplitPercent || 45,
      };
    });

    const updatedBookings = formattedDbOrders.map((o) => ({
      orderId: o.orderId,
      customerName: o.customerName,
      startDate: o.startDate,
      endDate: o.endDate,
      amount: o.amount,
      mode: o.mode,
      status: o.status,
      city: o.city,
      whatsappNumber: o.whatsappNumber,
      depositStatus: o.depositStatus,
      listerSplitPercent: o.listerSplitPercent,
    }));

    res.json({
      success: true,
      data: {
        blockedDates: p.blockedDates || [],
        bookingHistory: updatedBookings,
        externalBookings: updatedBookings,
        orderHistory: formattedDbOrders,
        orders: matchedDbOrders,
        cleaningBufferDays: p.cleaningBufferDays || 0,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const addBlockedDate = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    const { from, to, reason } = req.body;
    if (!from || !to || !reason || new Date(to) < new Date(from))
      return res.status(422).json({ success: false, message: "Valid from date, to date and reason are required" });
    if ((p.blockedDates || []).some((b) => new Date(from) <= new Date(b.to) && new Date(to) >= new Date(b.from)))
      return res.status(409).json({ success: false, message: "Blocked date range overlaps an existing range" });
    p.blockedDates.push({ from, to, reason });
    await save(p, "Blocked dates added", req.body);
    res.status(201).json({ success: true, data: p.blockedDates.at(-1) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const removeBlockedDate = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    const index = Number(req.params.index);
    if (!Number.isInteger(index) || index < 0 || index >= p.blockedDates.length)
      return res.status(404).json({ success: false, message: "Blocked range not found" });
    p.blockedDates.splice(index, 1);
    await save(p, "Blocked dates removed", req.body || {});
    res.json({ success: true, data: p.blockedDates });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getProductActivity = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, data: p.activityLog || [] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getProductPayoutHistory = async (req, res) => {
  try {
    const prodIdParam = req.params.productId || req.params.id;
    const p = await findProduct(prodIdParam);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });

    const targetProdId = String(p.productId || p._id || prodIdParam).trim();

    let rows = await Payout.find({
      $or: [
        { productId: targetProdId },
        { productId: String(targetProdId) },
        { productName: p.name },
        { piece: p.name },
      ],
    }).sort({ createdAt: -1 });

    if (rows.length === 0) rows = await Payout.find({}).sort({ createdAt: -1 });

    const orders = await Order.find({});

    const defaultPrice = Number(p.rentalPrice || p.listingPrice || 8500);
    const defaultSplit = Number(p.payoutPercentage || 45);

    const formatted = rows.map((r, idx) => {
      const txVal = Number(r.transactionAmount || r.transactionValue || r.amount || defaultPrice);
      const split = Number(r.listerSplitPercent || r.payoutPercent || r.splitPercent || defaultSplit);
      const amt = Number(r.listerShare || r.payoutAmount || r.netPayout || Math.round((txVal * split) / 100));

      const matchedOrder = orders.find((o) => o.orderId === r.orderId || o.id === r.orderId);

      const rawId = r.orderId || matchedOrder?.orderId || matchedOrder?.id;
      const formattedOrderId = rawId?.startsWith("HOK-ORD-")
        ? rawId
        : `HOK-ORD-${String(rawId || "").replace(/[^0-9]/g, "") || ""}`;

      const status = r.status || matchedOrder?.status || "Pending Approval";

      return {
        id: r.payoutId || r.id,
        payoutId: r.payoutId || r.id,
        transactionLabel: `Rental #${rows.length - idx}`,
        date: r.dueDate || r.createdAt || new Date().toISOString(),
        orderId: formattedOrderId,
        listerName: r.listerName || p.listerName || "",
        type: r.mode || "Rental",
        transactionValue: txVal,
        payoutPercent: split,
        amount: amt,
        status,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateRelatedProducts = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    if (!Array.isArray(req.body.relatedProductIds))
      return res.status(422).json({ success: false, message: "relatedProductIds must be an array" });
    const ids = [...new Set(req.body.relatedProductIds.filter((id) => id !== p.productId))];
    const count = await Product.countDocuments({ productId: { $in: ids } });
    if (count !== ids.length)
      return res.status(422).json({ success: false, message: "One or more related products do not exist" });
    p.relatedProductIds = ids;
    await save(p, "Related products updated", req.body);
    res.json({ success: true, data: ids });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateProductLister = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    const l = await Lister.findOne({ listerId: req.body.listerId });
    if (!l) return res.status(404).json({ success: false, message: "Lister not found" });
    p.listerId = l.listerId;
    p.listerName = l.name;
    if (req.body.payoutPercentage != null) {
      const rate = Number(req.body.payoutPercentage);
      if (rate < 0 || rate > 100) return res.status(422).json({ success: false, message: "Payout percentage must be between 0 and 100" });
      p.payoutPercentage = rate;
    }
    await save(p, "Product lister mapping updated", req.body);
    res.json({ success: true, data: { listerId: p.listerId, listerName: p.listerName, payoutPercentage: p.payoutPercentage } });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const addExternalBooking = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });

    const { customerName, startDate, endDate, status = "Confirmed", amount = 0, whatsappNumber, city, channel, listerSplitPercent, splitNote } = req.body;
    let orderId = req.body.orderId;
    if (!orderId || orderId.startsWith("EXT-")) {
      const totalOrdersCount = await Order.countDocuments();
      orderId = `HOK-ORD-${String(totalOrdersCount + 440).padStart(3, "0")}`;
    }
    if (!customerName || !startDate || !endDate || new Date(endDate) < new Date(startDate)) {
      return res.status(422).json({ success: false, message: "Customer name and valid dates are required" });
    }

    const parseToStartOfDay = (d) => {
      if (!d) return new Date(NaN);
      if (typeof d === "string") {
        const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
      }
      const dateObj = new Date(d);
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    };
    const addDays = (d, n) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + n);
      return copy;
    };

    const preBufferDays = Number(p.preRentalBufferDays ?? 2);
    const postBufferDays = Number(p.postRentalBufferDays ?? 3);
    const newStart = parseToStartOfDay(startDate);
    const newEnd = parseToStartOfDay(endDate);
    const existingBookings = p.bookingHistory || [];

    const hasBookingOverlap = existingBookings.some((b) => {
      const bStart = parseToStartOfDay(b.startDate || b.start);
      const bEnd = parseToStartOfDay(b.endDate || b.end);
      const bPostEnd = addDays(bEnd, postBufferDays);
      return newStart <= bPostEnd && newEnd >= bStart;
    });

    const existingBlocks = p.blockedDates || [];
    const hasBlockOverlap = existingBlocks.some((b) => {
      const bStart = parseToStartOfDay(b.from);
      const bEnd = parseToStartOfDay(b.to);
      return newStart <= bEnd && newEnd >= bStart;
    });

    if (hasBookingOverlap || hasBlockOverlap) {
      return res.status(409).json({
        success: false,
        message: "Selected dates (or required buffer period) overlap with an existing rental, buffer, or block. Only available dates can be booked.",
      });
    }

    let selectedOffer = null;
    const selectedOfferId = String(req.body.offerId || "").trim();
    if (selectedOfferId) {
      selectedOffer = await Offer.findOne({ offerId: selectedOfferId });
      if (!selectedOffer) selectedOffer = await Offer.findOne({ _id: selectedOfferId });
      if (!selectedOffer) {
        return res.status(422).json({ success: false, message: "The selected offer could not be found." });
      }

    }

    let selectedPromo = null;
    const selectedPromoCode = String(req.body.promoCode || "").trim().toUpperCase();
    if (selectedPromoCode) {
      selectedPromo = await PromoCode.findOne({ code: selectedPromoCode });
      if (!selectedPromo || selectedPromo.status !== "Active") {
        return res.status(422).json({ success: false, message: "The selected promo code is not active." });
      }
    }

    const defaultPrice = Number(p.rentalPrice || p.listingPrice || 8500);
    const offerAmount = Number(selectedOffer?.finalAmount || selectedOffer?.offeredAmount || 0);
    const priceBeforePromo = selectedOffer && offerAmount > 0
      ? offerAmount
      : defaultPrice;
    const splitPct = Number(listerSplitPercent || p.payoutPercentage || 45);

    const bookingEntry = {
      orderId,
      customerName,
      startDate,
      endDate,
      date: startDate,
      status,
      amount: priceBeforePromo,
      source: channel || "External",
      whatsappNumber,
      city,
      listerSplitPercent: splitPct,
      splitNote,
    };

    // Customer handling
    let cust = null;
    let customerId = "";
    const selectedOfferEmail = String(selectedOffer?.customerEmail || "").trim().toLowerCase();
    const selectedOfferCustomerId = String(selectedOffer?.customerId || "").trim();

    if (req.body.customerId) {
      cust = await Customer.findOne({ customerId: req.body.customerId });
      if (!cust) cust = await Customer.findOne({ _id: req.body.customerId });
    }

    // An accepted enquiry is an explicit customer source.  Prefer its stored
    // customer ID and email over generating a placeholder address.
    if (!cust && selectedOfferCustomerId) {
      cust = await Customer.findOne({ customerId: selectedOfferCustomerId });
      if (!cust) cust = await Customer.findOne({ _id: selectedOfferCustomerId });
    }
    if (!cust && selectedOfferEmail) {
      cust = await Customer.findOne({ email: selectedOfferEmail });
    }

    const phone = String(whatsappNumber || "").trim();
    const name = String(customerName || "").trim();

    if (!cust && phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone) {
        const allCustomers = await Customer.find({});
        cust = allCustomers.find((c) => {
          const cPhone = (c.phone || "").replace(/\D/g, "");
          return cPhone && (cPhone === cleanPhone || cPhone.endsWith(cleanPhone) || cleanPhone.endsWith(cPhone));
        });
      }
    }

    if (!cust && name) {
      cust = await Customer.findOne({ name: new RegExp("^" + name + "$", "i") });
    }

    if (cust) {
// Update customer statistics is now handled by syncCustomerOrderStats. Skipping manual increments.
      // The following updates are removed to avoid double counting.
      // cust.totalRentals = Number(cust.totalRentals || 0) + 1;
      // cust.ordersCount = Number(cust.ordersCount || 0) + 1;
      // cust.totalSpent = Number(cust.totalSpent || 0) + rentalVal;
      // cust.securityDepositHeld = Number(cust.securityDepositHeld || 0) + Number(p.securityDeposit || 0);
      // cust.lastOrderDate = startDate || new Date().toISOString().slice(0, 10);
      // await cust.save();
      // customerId = cust.customerId || cust._id?.toString() || "";
      // Instead, we ensure the order document references the correct customerId.
      customerId = cust.customerId || cust._id?.toString() || "";
      if (selectedOfferEmail && /_\d+@houseofkaira\.com$/i.test(String(cust.email || ""))) {
        cust.email = selectedOfferEmail;
        await cust.save();
      }
    } else {
      const allCustomers = await Customer.find({}, "customerId").exec();
      const existingNums = allCustomers
        .map((c) => c.customerId)
        .filter((id) => id && id.startsWith("CUST-"))
        .map((id) => parseInt(id.replace("CUST-", ""), 10))
        .filter((n) => !isNaN(n));
      const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
      customerId = `CUST-${String(maxNum + 1).padStart(5, "0")}`;
      const generatedEmail = `${name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "") || "renter"}_${maxNum + 1}@houseofkaira.com`;
      const safeEmail = selectedOfferEmail || generatedEmail;
      cust = await Customer.create({
        customerId,
        name: name || "External Renter",
        email: safeEmail,
        phone,
        location: city || "India",
        // The order has not been created yet.  These aggregates are updated
        // from that order by syncCustomerOrderStats below, after all offer and
        // promo calculations are complete.
        totalRentals: 0,
        ordersCount: 0,
        totalSpent: 0,
        securityDepositHeld: 0,
        tier: "New",
        status: "Active",
        source: channel || "Manual - WA",
        lastOrderDate: startDate || new Date().toISOString().slice(0, 10),
      });
    }

    bookingEntry.customerId = customerId;

    let promoDiscount = 0;
    if (selectedPromo) {
      const today = new Date().toISOString().slice(0, 10);
      const validFrom = String(selectedPromo.validFrom || "").slice(0, 10);
      const validUntil = String(selectedPromo.validUntil || "").slice(0, 10);
      if ((validFrom && today < validFrom) || (validUntil && today > validUntil)) {
        return res.status(422).json({ success: false, message: "This promo code is outside its validity period." });
      }
      if (Number(selectedPromo.minOrder || 0) > priceBeforePromo) {
        return res.status(422).json({ success: false, message: `This promo requires a minimum order of ₹${Number(selectedPromo.minOrder).toLocaleString("en-IN")}.` });
      }
      if (selectedPromo.audience === "private" && !(selectedPromo.customerIds || []).includes(customerId)) {
        return res.status(422).json({ success: false, message: "This promo code is not available for the selected customer." });
      }
      const previousOrders = await Order.find({ customerId });
      if (selectedPromo.firstOrderOnly && previousOrders.length > 0) {
        return res.status(422).json({ success: false, message: "This promo code is valid only for a customer's first order." });
      }
      const allPromoOrders = await Order.find({ promoCode: selectedPromo.code });
      if (selectedPromo.usesTotalCap != null && allPromoOrders.length >= Number(selectedPromo.usesTotalCap)) {
        return res.status(422).json({ success: false, message: "This promo code has reached its usage limit." });
      }
      const customerPromoOrders = allPromoOrders.filter((order) => String(order.customerId || "") === String(customerId));
      if (selectedPromo.usesPerCustomer != null && customerPromoOrders.length >= Number(selectedPromo.usesPerCustomer)) {
        return res.status(422).json({ success: false, message: "This customer has already used this promo code the allowed number of times." });
      }

      const promoType = String(selectedPromo.type || "").toLowerCase();
      if (promoType === "percent" || promoType === "percentage") {
        promoDiscount = (priceBeforePromo * Number(selectedPromo.value || 0)) / 100;
      } else if (promoType === "flat" || promoType === "fixed") {
        promoDiscount = Number(selectedPromo.value || 0);
      }
      if (selectedPromo.maxDiscount != null) promoDiscount = Math.min(promoDiscount, Number(selectedPromo.maxDiscount));
      promoDiscount = Math.max(0, Math.min(Math.round(promoDiscount), priceBeforePromo));
    }

    const rentalVal = Math.max(0, priceBeforePromo - promoDiscount);
    const listerShare = Math.round((rentalVal * splitPct) / 100);
    bookingEntry.amount = rentalVal;
    bookingEntry.offerId = selectedOffer?.offerId || "";
    bookingEntry.promoCode = selectedPromo?.code || "";
    bookingEntry.discount = promoDiscount;

    // A booking made from an offer always belongs to the final customer. This
    // keeps the offer visible in that customer's Offers tab for both existing
    // and newly-created customers.
    if (selectedOffer) {
      selectedOffer.customerId = customerId;
      selectedOffer.customerName = cust?.name || customerName;
      selectedOffer.customerEmail = cust?.email || "";
      selectedOffer.customerPhone = cust?.phone || whatsappNumber || "";
      selectedOffer.status = "Accepted";
      selectedOffer.linkedOrderId = orderId;
      selectedOffer.timeline = selectedOffer.timeline || [];
      selectedOffer.timeline.push({
        action: "Offer applied to booking",
        remarks: `Linked to ${customerId} and order ${orderId}`,
        user: req.body.createdBy || "Admin",
        createdAt: new Date(),
      });
      await selectedOffer.save();
    }

    p.externalBookings = p.externalBookings || [];
    p.bookingHistory = p.bookingHistory || [];
    p.externalBookings.push(bookingEntry);
    p.bookingHistory.push(bookingEntry);
    p.timesRented = Number(p.timesRented || 0) + 1;

    await Order.create({
      orderId,
      customerId,
      customerName: cust?.name || customerName || "External Renter",
      customerPhone: cust?.phone || whatsappNumber || "",
      customerEmail: cust?.email || `${(customerName || "renter").toLowerCase().replace(/\s+/g, "")}@houseofkaira.com`,
      productId: p.productId || p._id,
      productName: p.name,
      designer: p.designer || "House of Kaira",
      items: [
        {
          productId: p.productId || p._id,
          productName: p.name,
          designer: p.designer || "House of Kaira",
          mode: "Rental",
          size: p.sizes?.[0] || "S",
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          amount: rentalVal,
          deposit: Number(p.securityDeposit || 0),
          status: "Confirmed",
        },
      ],
      mode: "Rental",
      amount: rentalVal,
      orderValue: rentalVal,
      priceBeforePromo,
      offerId: selectedOffer?.offerId || "",
      promoCode: selectedPromo?.code || "",
      promoDiscount,
      discount: promoDiscount,
      deposit: Number(p.securityDeposit || 0),
      depositHeld: Number(p.securityDeposit || 0),
      depositStatus: "Pending",
      grandTotal: rentalVal + Number(p.securityDeposit || 0),
      rentalStartDate: startDate,
      rentalEndDate: endDate,
      status: "Confirmed",
      address: city || cust?.location || "External Order",
    });
    // Ensure customer stats are up‑to‑date after creating the order
    if (cust) {
      await syncCustomerOrderStats([cust]);
    }

    await Payout.create({
      payoutId: `PXT-${Date.now()}`,
      orderId,
      piece: p.name,
      productName: p.name,
      listerId: p.listerId || "LST-001",
      listerName: p.listerName || "Rohit",
      customerName,
      payoutAmount: listerShare,
      transactionValue: rentalVal,
      payoutPercent: splitPct,
      status: "Pending Approval",
      dueDate: endDate,
      splitPercent: splitPct,
    });

    p.activityLog = p.activityLog || [];
    p.activityLog.push({
      action: `Rental #${p.bookingHistory.length} created — ${orderId} (${customerName})`,
      user: req.body.createdBy || "Admin",
      remarks: splitNote || `Lister split set at ${listerSplitPercent || 45}%`,
      createdAt: new Date(),
    });

    await save(p, `External booking added for ${customerName} (${orderId})`, req.body);

    const formattedCust = cust ? { ...(typeof cust.toObject === "function" ? cust.toObject() : cust), id: cust.customerId || cust._id?.toString() } : null;

    res.status(201).json({
      success: true,
      data: {
        orderId,
        bookingEntry,
        customer: formattedCust,
        order: {
          id: orderId,
          orderNumber: orderId,
          customerId,
          customerName: customerName || "External Renter",
          customerPhone: whatsappNumber || "",
          customerEmail: `${(customerName || "renter").toLowerCase().replace(/\s+/g, "")}@houseofkaira.com`,
          productId: p.productId || p._id,
          productName: p.name,
          designer: p.designer || "House of Kaira",
          mode: "Rental",
          amount: rentalVal,
          deposit: Number(p.securityDeposit || 0),
          discount: promoDiscount,
          offerId: selectedOffer?.offerId || "",
          promoCode: selectedPromo?.code || "",
          grandTotal: rentalVal + Number(p.securityDeposit || 0),
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          status: "Confirmed",
          address: city || "External Order",
        },
        blockedDates: p.blockedDates || [],
        bookingHistory: p.bookingHistory || [],
        externalBookings: p.externalBookings || [],
        activityLog: p.activityLog || [],
        timesRented: p.timesRented || 0,
      },
    });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};
