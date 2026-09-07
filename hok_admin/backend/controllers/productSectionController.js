import Product from "../models/Product.js";

const findProduct = async (id) => {
  if (!id) return null;
  let p = await Product.findOne({ productId: id });
  if (!p) {
    p = await Product.findOne({ _id: id });
  }
  if (!p && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
    p = await Product.findById(id);
  }
  if (!p) {
    p = await Product.findOne({ $or: [{ productId: id }, { id: id }] });
  }
  return p;
};
const save = async (product, action, data) => { product.activityLog.push({ action, user: data.createdBy || data.updatedBy || "Admin", remarks: data.remarks || "" }); await product.save(); return product; };

export const getAvailabilityCalendar = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });

    const Order = (await import("../models/Order.js")).default;
    const targetProdId = String(p.productId || req.params.id || '').trim();
    const targetMongoId = String(p._id || '').trim();
    const targetProdName = String(p.name || '').trim().toLowerCase();

    // Fetch all orders from Orders database table
    const rawDbOrders = await Order.find({}).sort({ createdAt: -1 });
    const allDbOrders = rawDbOrders.map(o => (typeof o.toObject === 'function' ? o.toObject() : o));

    // Filter orders matching this product ID or product Name
    const matchedDbOrders = allDbOrders.filter(o => {
      const topProdId = String(o.productId || '').trim();
      const topProdName = String(o.productName || '').trim().toLowerCase();

      const topMatch = (topProdId && (topProdId === targetProdId || topProdId === targetMongoId || topProdId === req.params.id)) ||
                       (topProdName && targetProdName && topProdName === targetProdName);
      if (topMatch) return true;

      const items = Array.isArray(o.items) ? o.items : [];
      return items.some(item => {
        const itemProdId = String(item.productId || '').trim();
        const itemProdName = String(item.productName || '').trim().toLowerCase();
        const idMatches = Boolean(itemProdId && (itemProdId === targetProdId || itemProdId === targetMongoId || itemProdId === req.params.id));
        const nameMatches = Boolean(itemProdName && targetProdName && itemProdName === targetProdName);
        return idMatches || nameMatches;
      });
    });

    // Format DB Orders into standardized Order History entries directly from DB
    const formattedDbOrders = matchedDbOrders.map(o => {
      const firstItem = Array.isArray(o.items) && o.items.length > 0 ? o.items[0] : {};
      return {
        orderId: o.orderId || o.id,
        customerName: o.customerName || firstItem.customerName || '',
        whatsappNumber: o.customerPhone || o.whatsappNumber || firstItem.whatsappNumber || '',
        city: o.customerCity || o.city || o.address || firstItem.city || '',
        amount: Number(firstItem.amount || o.orderValue || o.grandTotal || o.amount || 0),
        deposit: Number(firstItem.deposit || o.depositHeld || o.deposit || 0),
        startDate: firstItem.rentalStartDate || o.rentalStartDate || o.startDate || '',
        endDate: firstItem.rentalEndDate || o.rentalEndDate || o.endDate || '',
        status: o.status || firstItem.status || 'Confirmed',
        depositStatus: o.depositStatus || 'Pending',
        mode: o.mode || firstItem.mode || 'Rental',
        listerSplitPercent: o.listerSplitPercent || 45
      };
    });

    // Map bookings directly from DB orders
    const updatedBookings = formattedDbOrders.map(o => ({
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
      listerSplitPercent: o.listerSplitPercent
    }));

    res.json({
      success: true,
      data: {
        blockedDates: p.blockedDates || [],
        bookingHistory: updatedBookings,
        externalBookings: updatedBookings,
        orderHistory: formattedDbOrders,
        orders: matchedDbOrders,
        cleaningBufferDays: p.cleaningBufferDays || 0
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
export const addBlockedDate = async (req, res) => { try { const p = await findProduct(req.params.id); if (!p) return res.status(404).json({ success: false, message: "Product not found" }); const { from, to, reason } = req.body; if (!from || !to || !reason || new Date(to) < new Date(from)) return res.status(422).json({ success: false, message: "Valid from date, to date and reason are required" }); if ((p.blockedDates || []).some((b) => new Date(from) <= new Date(b.to) && new Date(to) >= new Date(b.from))) return res.status(409).json({ success: false, message: "Blocked date range overlaps an existing range" }); p.blockedDates.push({ from, to, reason }); await save(p, "Blocked dates added", req.body); res.status(201).json({ success: true, data: p.blockedDates.at(-1) }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } };
export const removeBlockedDate = async (req, res) => { try { const p = await findProduct(req.params.id); if (!p) return res.status(404).json({ success: false, message: "Product not found" }); const index = Number(req.params.index); if (!Number.isInteger(index) || index < 0 || index >= p.blockedDates.length) return res.status(404).json({ success: false, message: "Blocked range not found" }); p.blockedDates.splice(index, 1); await save(p, "Blocked dates removed", req.body || {}); res.json({ success: true, data: p.blockedDates }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } };
export const getProductActivity = async (req, res) => { try { const p = await findProduct(req.params.id); if (!p) return res.status(404).json({ success: false, message: "Product not found" }); res.json({ success: true, data: p.activityLog || [] }); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };
export const getProductPayoutHistory = async (req, res) => {
  try {
    const prodIdParam = req.params.productId || req.params.id;
    const p = await findProduct(prodIdParam);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    const Payout = (await import("../models/Payout.js")).default;
    const Order = (await import("../models/Order.js")).default;

    const targetProdId = String(p.productId || p._id || prodIdParam).trim();

    // Query Payouts by productId, piece name, or productName
    let rows = await Payout.find({
      $or: [
        { productId: targetProdId },
        { productId: String(targetProdId) },
        { productName: p.name },
        { piece: p.name }
      ]
    }).sort({ createdAt: -1 });

    if (rows.length === 0) {
      rows = await Payout.find({}).sort({ createdAt: -1 });
    }

    const orders = await Order.find({});

    const defaultPrice = Number(p.rentalPrice || p.listingPrice || 8500);
    const defaultSplit = Number(p.payoutPercentage || 45);

    const formatted = rows.map((r, idx) => {
      const txVal = Number(r.transactionAmount || r.transactionValue || r.amount || defaultPrice);
      const split = Number(r.listerSplitPercent || r.payoutPercent || r.splitPercent || defaultSplit);
      const amt = Number(r.listerShare || r.payoutAmount || r.netPayout || Math.round((txVal * split) / 100));

      const matchedOrder = orders.find(o =>
        o.orderId === r.orderId ||
        o.id === r.orderId
      );

      const rawId = r.orderId || matchedOrder?.orderId || matchedOrder?.id;
      const formattedOrderId = rawId?.startsWith('HOK-ORD-')
        ? rawId
        : `HOK-ORD-${String(rawId || '').replace(/[^0-9]/g, '') || ''}`;

      const status = r.status || matchedOrder?.status || 'Pending Approval';

      return {
        id: r.payoutId || r.id,
        payoutId: r.payoutId || r.id,
        transactionLabel: `Rental #${rows.length - idx}`,
        date: r.dueDate || r.createdAt || new Date().toISOString(),
        orderId: formattedOrderId,
        listerName: r.listerName || p.listerName || '',
        type: r.mode || 'Rental',
        transactionValue: txVal,
        payoutPercent: split,
        amount: amt,
        status: status
      };
    });

    res.json({ success: true, data: formatted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateRelatedProducts = async (req, res) => { try { const p = await findProduct(req.params.id); if (!p) return res.status(404).json({ success: false, message: "Product not found" }); if (!Array.isArray(req.body.relatedProductIds)) return res.status(422).json({ success: false, message: "relatedProductIds must be an array" }); const ids = [...new Set(req.body.relatedProductIds.filter((id) => id !== p.productId))]; const count = await Product.countDocuments({ productId: { $in: ids } }); if (count !== ids.length) return res.status(422).json({ success: false, message: "One or more related products do not exist" }); p.relatedProductIds = ids; await save(p, "Related products updated", req.body); res.json({ success: true, data: ids }); } catch (e) { res.status(400).json({ success: false, message: e.message }); } };
export const updateProductLister = async (req, res) => { try { const Lister = (await import("../models/Lister.js")).default; const p = await findProduct(req.params.id); if (!p) return res.status(404).json({ success: false, message: "Product not found" }); const l = await Lister.findOne({ listerId: req.body.listerId }); if (!l) return res.status(404).json({ success: false, message: "Lister not found" }); p.listerId = l.listerId; p.listerName = l.name; if (req.body.payoutPercentage != null) { const rate = Number(req.body.payoutPercentage); if (rate < 0 || rate > 100) return res.status(422).json({ success: false, message: "Payout percentage must be between 0 and 100" }); p.payoutPercentage = rate; } await save(p, "Product lister mapping updated", req.body); res.json({ success: true, data: { listerId: p.listerId, listerName: p.listerName, payoutPercentage: p.payoutPercentage } }); } catch (e) { res.status(422).json({ success: false, message: e.message }); } };
export const addExternalBooking = async (req, res) => {
  try {
    const p = await findProduct(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: "Product not found" });
    const { customerName, startDate, endDate, status = "Confirmed", amount = 0, whatsappNumber, city, channel, listerSplitPercent, splitNote } = req.body;
    let orderId = req.body.orderId;
    if (!orderId || orderId.startsWith('EXT-')) {
      const Order = (await import("../models/Order.js")).default;
      const totalOrdersCount = await Order.countDocuments();
      orderId = `HOK-ORD-${String(totalOrdersCount + 440).padStart(3, '0')}`;
    }
    if (!customerName || !startDate || !endDate || new Date(endDate) < new Date(startDate)) {
      return res.status(422).json({ success: false, message: "Customer name and valid dates are required" });
    }

    const parseToStartOfDay = (d) => {
      if (!d) return new Date(NaN);
      if (typeof d === 'string') {
        const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
      }
      const dateObj = new Date(d);
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    };
    const addDays = (d, n) => { const copy = new Date(d); copy.setDate(copy.getDate() + n); return copy; };

    const preBufferDays = Number(p.preRentalBufferDays ?? 2);
    const postBufferDays = Number(p.postRentalBufferDays ?? 3);
    const newStart = parseToStartOfDay(startDate);
    const newEnd = parseToStartOfDay(endDate);
    const existingBookings = p.bookingHistory || [];
    const hasBookingOverlap = existingBookings.some(b => {
      const bStart = parseToStartOfDay(b.startDate || b.start);
      const bEnd = parseToStartOfDay(b.endDate || b.end);
      const bPostEnd = addDays(bEnd, postBufferDays);
      return newStart <= bPostEnd && newEnd >= bStart;
    });

    const existingBlocks = p.blockedDates || [];
    const hasBlockOverlap = existingBlocks.some(b => {
      const bStart = parseToStartOfDay(b.from);
      const bEnd = parseToStartOfDay(b.to);
      return newStart <= bEnd && newEnd >= bStart;
    });

    if (hasBookingOverlap || hasBlockOverlap) {
      return res.status(409).json({
        success: false,
        message: "Selected dates (or required buffer period) overlap with an existing rental, buffer, or block. Only available dates can be booked."
      });
    }

    const defaultPrice = Number(p.rentalPrice || p.listingPrice || 8500);
    const rentalVal = Number((amount && Number(amount) > 0) ? amount : defaultPrice);
    const splitPct = Number(listerSplitPercent || p.payoutPercentage || 45);
    const listerShare = Math.round((rentalVal * splitPct) / 100);

    const bookingEntry = { orderId, customerName, startDate, endDate, date: startDate, status, amount: rentalVal, source: channel || "External", whatsappNumber, city, listerSplitPercent: splitPct, splitNote };

    p.externalBookings = p.externalBookings || [];
    p.bookingHistory = p.bookingHistory || [];
    p.externalBookings.push(bookingEntry);
    p.bookingHistory.push(bookingEntry);
    p.timesRented = Number(p.timesRented || 0) + 1;

    // 1. Create or Update Customer record
    let customerId = `CUST-${Date.now()}`;
    try {
      const Customer = (await import("../models/Customer.js")).default;
      const phone = whatsappNumber || "";
      const email = `${(customerName || "renter").toLowerCase().trim().replace(/\s+/g, "")}@houseofkaira.com`;

      const query = [];
      if (phone) query.push({ phone });
      if (email) query.push({ email });
      if (customerName) query.push({ name: customerName });

      let cust = query.length > 0 ? await Customer.findOne({ $or: query }) : null;
      if (cust) {
        cust.totalRentals = Number(cust.totalRentals || 0) + 1;
        cust.totalSpent = Number(cust.totalSpent || 0) + rentalVal;
        await cust.save();
        customerId = cust.customerId || cust._id;
      } else {
        cust = await Customer.create({
          customerId,
          name: customerName,
          email,
          phone,
          location: city || "India",
          totalRentals: 1,
          totalSpent: rentalVal,
          securityDepositHeld: Number(p.securityDeposit || 0),
          tier: "New"
        });
      }
    } catch (custErr) {
      console.warn("Customer creation warning:", custErr);
    }

    // 2. Create Order record in database orders table
    let createdOrderRecord = null;
    try {
      const Order = (await import("../models/Order.js")).default;
      createdOrderRecord = await Order.create({
        orderId,
        customerId,
        customerName: customerName || "External Renter",
        customerPhone: whatsappNumber || "",
        customerEmail: `${(customerName || "renter").toLowerCase().replace(/\s+/g, "")}@houseofkaira.com`,
        productId: p.productId || p._id,
        productName: p.name,
        designer: p.designer || "House of Kaira",
        items: [{
          productId: p.productId || p._id,
          productName: p.name,
          designer: p.designer || "House of Kaira",
          mode: "Rental",
          size: p.sizes?.[0] || "S",
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          amount: rentalVal,
          deposit: Number(p.securityDeposit || 0),
          status: "Confirmed"
        }],
        mode: "Rental",
        amount: rentalVal,
        deposit: Number(p.securityDeposit || 0),
        discount: 0,
        grandTotal: rentalVal + Number(p.securityDeposit || 0),
        rentalStartDate: startDate,
        rentalEndDate: endDate,
        status: "Confirmed",
        address: city || "External Order"
      });
    } catch (orderErr) {
      console.warn("Order creation warning:", orderErr);
    }

    // 3. Create Payout record linked to Lister
    try {
      const Payout = (await import("../models/Payout.js")).default;
      const splitPct = Number(listerSplitPercent || p.payoutPercentage || 45);
      const listerShare = Math.round((rentalVal * splitPct) / 100);
      await Payout.create({
        payoutId: `PXT-${Date.now()}`,
        orderId,
        piece: p.name,
        productName: p.name,
        listerId: p.listerId || "LST-001",
        listerName: p.listerName || "Rohit",
        customerName: customerName,
        payoutAmount: listerShare,
        transactionValue: rentalVal,
        payoutPercent: splitPct,
        status: "Pending Approval",
        dueDate: endDate,
        splitPercent: splitPct
      });
    } catch (payoutErr) {
      console.warn("Payout creation warning:", payoutErr);
    }

    p.activityLog = p.activityLog || [];
    p.activityLog.push({
      action: `Rental #${p.bookingHistory.length} created &mdash; ${orderId} (${customerName})`,
      user: req.body.createdBy || "Admin",
      remarks: splitNote || `Lister split set at ${listerSplitPercent || 45}%`,
      createdAt: new Date()
    });

    await save(p, `External booking added for ${customerName} (${orderId})`, req.body);
    res.status(201).json({
      success: true,
      data: {
        orderId,
        bookingEntry,
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
          discount: 0,
          grandTotal: rentalVal + Number(p.securityDeposit || 0),
          rentalStartDate: startDate,
          rentalEndDate: endDate,
          status: "Confirmed",
          address: city || "External Order"
        },
        blockedDates: p.blockedDates || [],
        bookingHistory: p.bookingHistory || [],
        externalBookings: p.externalBookings || [],
        activityLog: p.activityLog || [],
        timesRented: p.timesRented || 0
      }
    });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};
