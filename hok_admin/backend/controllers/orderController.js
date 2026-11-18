import { nextOrderId, ORDER_ID_REGEX } from "../services/orderIdService.js";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Lister from "../models/Lister.js";
import Customer from "../models/Customer.js";
import { calculateProductLine } from "../services/pricingService.js";
import { syncCustomerOrderStats } from "./customerController.js";

export const parseAmount = (val) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

const view = (order) => {
  const obj = order.toObject ? order.toObject() : { ...order };
  delete obj._data;
  const items = Array.isArray(obj.items) ? obj.items : [];
  const firstItem = items[0] || {};
  const mode = obj.mode || firstItem.mode || "Rental";

  const itemsSum = items.reduce((sum, it) => sum + parseAmount(it.amount), 0);
  const itemsDeposit = items.reduce((sum, it) => sum + parseAmount(it.deposit), 0);

  const rawAmount =
    parseAmount(obj.grandTotal) ||
    parseAmount(obj.amount) ||
    parseAmount(obj.orderValue) ||
    parseAmount(obj.totalAmount) ||
    itemsSum ||
    0;

  const resolvedOrderValue = parseAmount(obj.orderValue) || itemsSum || rawAmount;
  const resolvedGrandTotal = parseAmount(obj.grandTotal) || rawAmount;
  const rawDeposit =
    parseAmount(obj.deposit) ||
    parseAmount(obj.depositHeld) ||
    itemsDeposit ||
    0;
  const deposit =
    rawDeposit > 0
      ? rawDeposit
      : (mode === "Rental" ? 10000 : 0);

  const productName =
    obj.productName ||
    (items.length === 1
      ? firstItem.productName || ""
      : items.length > 1
      ? `${firstItem.productName || "Product"} (+${items.length - 1} more)`
      : "");

  const designer = obj.designer || firstItem.designer || "";
  const image = obj.image || firstItem.image || "";

  const listerId = obj.listerId || firstItem.listerId || "";
  const listerName = obj.listerName || firstItem.listerName || "";

  const rentalStartDate =
    obj.rentalStartDate ||
    obj.startDate ||
    firstItem.rentalStartDate ||
    firstItem.startDate ||
    "";
  const rentalEndDate =
    obj.rentalEndDate ||
    obj.endDate ||
    firstItem.rentalEndDate ||
    firstItem.endDate ||
    "";

  const resolvedOrderId = obj.orderId || obj.id || obj._id || "";
  let fallbackOrderDate = "";
  if (
    typeof resolvedOrderId === "string" &&
    resolvedOrderId.startsWith("HOK-ORD-") &&
    /^\d{13}$/.test(resolvedOrderId.slice(8))
  ) {
    fallbackOrderDate = new Date(Number(resolvedOrderId.slice(8))).toISOString();
  }
  const orderDate =
    obj.orderDate || obj.createdAt || fallbackOrderDate || "";

  const normalizedDispatchDetails =
    obj.dispatchDetails ||
    (firstItem.dispatch &&
    (firstItem.dispatch.date ||
      firstItem.dispatch.courierPartner ||
      firstItem.dispatch.trackingNumber ||
      firstItem.dispatch.dispatchedBy)
      ? {
          dispatchedBy: firstItem.dispatch.dispatchedBy || "",
          date: firstItem.dispatch.date || obj.dispatchDate || "",
          trackingNumber: firstItem.dispatch.trackingNumber || "",
          courierPartner: firstItem.dispatch.courierPartner || "",
        }
      : undefined);

  const dispatchDate =
    normalizedDispatchDetails?.date ||
    firstItem.dispatch?.date ||
    obj.dispatchDate ||
    firstItem.dispatchDate ||
    "";

  const normalizedReturnLogistics =
    obj.returnLogistics ||
    (firstItem.returnDueDate
      ? {
          returnDate: firstItem.returnDueDate,
          returnMethod: "",
          courierPartner: "",
        }
      : undefined);

  const resolvedDepositDecision =
    obj.depositDecision || firstItem.depositDecision || undefined;

  let resolvedDepositStatus = obj.depositStatus || "";
  if (
    resolvedDepositDecision?.status &&
    ["Released", "Partial", "Partially Released", "Forfeited", "Refunded"].includes(
      resolvedDepositDecision.status,
    )
  ) {
    resolvedDepositStatus =
      resolvedDepositDecision.status === "Partial"
        ? "Partially Released"
        : resolvedDepositDecision.status;
  } else if (
    obj.paymentStatus === "Refunded" ||
    obj.refund?.status === "Processed" ||
    obj.status === "Processed"
  ) {
    resolvedDepositStatus = "Refunded";
  } else if (obj.status === "Complete") {
    resolvedDepositStatus = "Released";
  } else if (!resolvedDepositStatus) {
    resolvedDepositStatus = deposit > 0 ? "Pending" : "None";
  }

  return {
    ...obj,
    id: resolvedOrderId,
    amount: rawAmount,
    orderValue: resolvedOrderValue,
    grandTotal: resolvedGrandTotal,
    totalAmount: rawAmount,
    deposit,
    depositHeld: deposit,
    depositStatus: resolvedDepositStatus,
    ...(resolvedDepositDecision ? { depositDecision: resolvedDepositDecision } : {}),
    productName,
    designer,
    mode,
    image,
    listerId,
    listerName,
    rentalStartDate,
    rentalEndDate,
    orderDate,
    dispatchDate,
    ...(normalizedDispatchDetails ? { dispatchDetails: normalizedDispatchDetails } : {}),
    ...(normalizedReturnLogistics ? { returnLogistics: normalizedReturnLogistics } : {}),
  };
};
const byId = (id) => ({ $or: [{ orderId: id }, { _id: id }] });

const customerById = async (customerId) => {
  if (!customerId) return null;
  try {
    return await Customer.findOne({
      $or: [{ customerId }, { _id: customerId }],
    });
  } catch (e) {
    return null;
  }
};

const calculateItems = async (items) => {
  if (!Array.isArray(items) || !items.length) return [];
  return Promise.all(
    items.map(async (input) => {
      if (!input) return {};
      const prodId = input.productId || input.id || input._id;
      let product = null;
      if (prodId) {
        try {
          product = await Product.findOne({
            $or: [
              { productId: prodId },
              { _id: prodId },
              { sku: prodId },
              { id: prodId },
            ],
          });
        } catch (e) {
          console.warn(`calculateItems product lookup skip for ${prodId}:`, e.message);
        }
      }

      const resolvedImage =
        input.image ||
        (Array.isArray(input.photos) && input.photos[0]) ||
        (Array.isArray(product?.images) && product.images[0]) ||
        (Array.isArray(product?.image) && product.image[0]) ||
        (typeof product?.image === "string" ? product.image : "") ||
        "";

      const resolvedName =
        (input.productName && input.productName !== "Designer Piece")
          ? input.productName
          : (input.title || product?.title || product?.name || "Designer Piece");

      const resolvedDesigner =
        (input.designer && input.designer !== "House of Kaira")
          ? input.designer
          : (product?.designer || "House of Kaira");

      const resolvedSize =
        input.size ||
        (Array.isArray(product?.sizes) && product.sizes[0]) ||
        "Free Size";

      const rawMode = input.mode || "Buy";
      const resolvedMode =
        rawMode.charAt(0).toUpperCase() + rawMode.slice(1).toLowerCase();

      let calculated = {};
      const needsCalc =
        resolvedMode !== "Rental" ||
        ((input.startDate || input.rentalStartDate) &&
          (input.endDate || input.rentalEndDate));

      if (needsCalc && product) {
        try {
          calculated = calculateProductLine(product, {
            ...input,
            startDate: input.startDate || input.rentalStartDate,
            endDate: input.endDate || input.rentalEndDate,
            mode: resolvedMode,
          });
        } catch (e) {
          console.warn(`calculateProductLine skip for ${prodId}:`, e.message);
        }
      }

      const finalAmount = parseAmount(
        input.amount !== undefined ? input.amount : (
          input.price !== undefined ? input.price : (
            calculated.amount ||
            (resolvedMode === "Rental" ? product?.rentalPrice : (product?.listingPrice || product?.price)) ||
            0
          )
        )
      );

      let resolvedListerId =
        input.listerId ||
        product?.listerId ||
        product?.lister_id ||
        product?.data?.listerId ||
        "";
      let resolvedListerName =
        input.listerName ||
        product?.listerName ||
        product?.lister_name ||
        product?.data?.listerName ||
        "";

      if (resolvedListerId && !resolvedListerName) {
        try {
          const lRec = await Lister.findOne({
            $or: [
              { listerId: resolvedListerId },
              { _id: resolvedListerId },
              { id: resolvedListerId },
            ],
          });
          if (lRec) resolvedListerName = lRec.name;
        } catch (e) {}
      }

      if (!resolvedListerId || resolvedListerId === "simran-chouhan" || !resolvedListerId.trim()) {
        resolvedListerId = "ananya-sharma";
        resolvedListerName = "Ananya Sharma";
      }
      if (!resolvedListerName || !resolvedListerName.trim()) {
        resolvedListerName =
          resolvedListerId === "ananya-sharma"
            ? "Ananya Sharma"
            : "Ananya Sharma";
      }

      const finalDeposit = parseAmount(
        input.deposit !== undefined
          ? input.deposit
          : (resolvedMode === "Rental"
              ? (product?.securityDeposit || product?.deposit || product?.data?.securityDeposit || 10000)
              : 0)
      );

      return {
        ...input,
        ...calculated,
        productId: prodId || input.productId || product?.productId || "",
        productName: resolvedName,
        designer: resolvedDesigner,
        image: resolvedImage,
        size: resolvedSize,
        mode: resolvedMode,
        amount: finalAmount,
        deposit: finalDeposit,
        depositHeld: finalDeposit,
        listerId: resolvedListerId,
        listerName: resolvedListerName,
        quantity: Math.max(1, Number(input.quantity || 1)),
        rentalStartDate: input.rentalStartDate || input.startDate || "",
        rentalEndDate: input.rentalEndDate || input.endDate || "",
      };
    }),
  );
};

const totalsFor = (items, discount = 0, currentDepositStatus) => {
  const orderValue = items.reduce(
    (sum, item) => sum + parseAmount(item.amount),
    0,
  );
  const gst = items.reduce((sum, item) => sum + parseAmount(item.gst), 0);
  const depositHeld = items.reduce(
    (sum, item) => sum + parseAmount(item.deposit),
    0,
  );
  const cleaningFee = items.reduce(
    (sum, item) => sum + parseAmount(item.cleaningFee),
    0,
  );
  const calculatedGrand = Math.round(
    (orderValue +
      gst +
      depositHeld +
      cleaningFee -
      Math.max(0, parseAmount(discount))) *
      100,
  ) / 100;
  return {
    orderValue,
    gst,
    deposit: depositHeld,
    depositHeld,
    depositStatus: (currentDepositStatus || (depositHeld > 0 ? "Pending" : "None")),
    amount: calculatedGrand || orderValue,
    grandTotal: calculatedGrand,
  };
};

export const getOrders = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.mode) query.mode = req.query.mode;
    if (req.query.customerId) query.customerId = req.query.customerId;
    const orders = await Order.find(query).sort({ createdAt: -1 });

    const custMap = new Map();
    try {
      const customers = await Customer.find({});
      customers.forEach((c) => {
        if (c.customerId) custMap.set(c.customerId, c);
        if (c._id) custMap.set(String(c._id), c);
      });
    } catch (e) {
      // non-blocking
    }

    const data = orders.map((o) => {
      const v = view(o);
      const cust = custMap.get(v.customerId);
      if (cust) {
        if (cust.name && cust.name !== "User") v.customerName = cust.name;
        if (
          cust.email &&
          !cust.email.includes("temp.com") &&
          !cust.email.includes("hok.local")
        ) {
          v.customerEmail = cust.email;
        }
        if (cust.phone) v.customerPhone = cust.phone;
      }
      return v;
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne(byId(req.params.id));
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    const v = view(order);
    if (v.customerId) {
      try {
        const cust = await customerById(v.customerId);
        if (cust) {
          if (cust.name && cust.name !== "User") v.customerName = cust.name;
          if (
            cust.email &&
            !cust.email.includes("temp.com") &&
            !cust.email.includes("hok.local")
          ) {
            v.customerEmail = cust.email;
          }
          if (cust.phone) v.customerPhone = cust.phone;
        }
      } catch (e) {}
    }
    res.json({ success: true, data: v });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    let customer = await customerById(req.body.customerId);

    // If Authorization header was sent, decode customer
    if (!customer && req.headers?.authorization) {
      try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "hok_super_secret_key_123");
        if (decoded?.id) {
          customer = await Customer.findById(decoded.id);
        }
      } catch (e) {}
    }

    const email = req.body.customerEmail
      ? req.body.customerEmail.trim().toLowerCase()
      : "";
    const phone = req.body.customerPhone ? req.body.customerPhone.trim() : "";

    if (!customer && email && !email.includes("hok.local")) {
      customer = await Customer.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });
    }
    if (!customer && phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length >= 10) {
        const pMatches = await Customer.find({
          phone: new RegExp(digits.slice(-10) + "$"),
        });
        customer = pMatches.find((c) => c.email && !c.email.includes("temp.com") && c.name !== "User") || pMatches[0];
      }
    }

    // Auto-create customer if missing
    if (!customer && req.body.customerName) {

      if (!customer) {
        const customers = await Customer.find({}, "customerId").exec();
        const existingCustIds = customers
          .map((c) => c.customerId)
          .filter((id) => id && id.startsWith("CUST-"))
          .map((id) => parseInt(id.replace("CUST-", ""), 10))
          .filter((num) => !isNaN(num));
        const maxId =
          existingCustIds.length > 0 ? Math.max(...existingCustIds) : 0;
        const newCustomerId = `CUST-${String(maxId + 1).padStart(5, "0")}`;

        customer = await Customer.create({
          customerId: newCustomerId,
          name: req.body.customerName.trim(),
          email: email || `contact_${Date.now()}@hok.local`,
          phone: phone,
          location: req.body.customerCity || "India",
          status: "Active",
          source: "Auto-Created from Order",
          joinedDate: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        });
      }
    }

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
    const todayISTStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const items = await calculateItems(req.body.items);
    const firstItem = items[0] || {};
    const primaryRentalItem =
      items.find(
        (it) =>
          String(it?.mode || "").toLowerCase() === "rental" ||
          it?.rentalStartDate ||
          it?.startDate,
      ) || firstItem;

    const resolvedMode =
      req.body.mode ||
      (items.some((it) => String(it?.mode || "").toLowerCase() === "rental")
        ? "Rental"
        : firstItem.mode || "Rental");

    let rentalStart = normalizeYMD(
      req.body.rentalStartDate ||
        primaryRentalItem.rentalStartDate ||
        primaryRentalItem.startDate ||
        "",
    );
    let rentalEnd = normalizeYMD(
      req.body.rentalEndDate ||
        primaryRentalItem.rentalEndDate ||
        primaryRentalItem.endDate ||
        "",
    );
    if (resolvedMode === "Rental" && !rentalStart) {
      rentalStart = addDaysYMD(todayISTStr, 2);
    }
    if (resolvedMode === "Rental" && rentalStart && (!rentalEnd || rentalEnd < rentalStart)) {
      rentalEnd = addDaysYMD(rentalStart, 3);
    }

    let dispatchDate = normalizeYMD(
      req.body.dispatchDate || primaryRentalItem.dispatchDate || "",
    );
    if (!dispatchDate && rentalStart) {
      dispatchDate = addDaysYMD(rentalStart, -2);
    } else if (!dispatchDate) {
      dispatchDate = todayISTStr;
    }

    for (const it of items) {
      if (String(it.mode || resolvedMode).toLowerCase() === "rental") {
        it.mode = "Rental";
        it.rentalStartDate = normalizeYMD(it.rentalStartDate || it.startDate) || rentalStart;
        it.rentalEndDate = normalizeYMD(it.rentalEndDate || it.endDate) || rentalEnd;
        it.dispatchDate = normalizeYMD(it.dispatchDate) || addDaysYMD(it.rentalStartDate, -2) || dispatchDate;
        if (!it.returnDueDate && it.rentalEndDate) {
          it.returnDueDate = addDaysYMD(it.rentalEndDate, 1);
        }
      }
    }

    const resolvedProductName =
      (req.body.productName && req.body.productName !== "Designer Piece")
        ? req.body.productName
        : (firstItem.productName || "Designer Piece");
    const resolvedDesigner =
      (req.body.designer && req.body.designer !== "House of Kaira")
        ? req.body.designer
        : (firstItem.designer || "House of Kaira");
    const resolvedImage = req.body.image || firstItem.image || "";

    const order = await Order.create({
      ...req.body,
      orderId: ORDER_ID_REGEX.test(String(req.body.orderId || ""))
        ? req.body.orderId
        : await nextOrderId(items.length ? items : resolvedMode),
      customerId: customer?.customerId || req.body.customerId,
      customerName: customer?.name || req.body.customerName,
      customerEmail: customer?.email || req.body.customerEmail,
      customerPhone: customer?.phone || req.body.customerPhone,
      customerCity: customer?.location || req.body.customerCity,
      address: req.body.address || customer?.location || "",
      productName: resolvedProductName,
      designer: resolvedDesigner,
      image: resolvedImage,
      mode: resolvedMode,
      listerId: req.body.listerId || firstItem.listerId || "simran-chouhan",
      listerName: req.body.listerName || firstItem.listerName || "Simran Chouhan",
      rentalStartDate: rentalStart,
      rentalEndDate: rentalEnd,
      dispatchDate: dispatchDate,
      items,
      discount: parseAmount(req.body.discount || req.body.promoDiscount || 0),
      promoCode: req.body.promoCode || "",
      ...totalsFor(items, req.body.discount || req.body.promoDiscount || 0),
      ...(req.body.grandTotal ? { grandTotal: parseAmount(req.body.grandTotal), amount: parseAmount(req.body.grandTotal) } : {}),
      payoutStatus: req.body.payoutStatus || "Pending Approval",
      logs: [
        {
          message: "Order placed",
          type: "Order",
          user: customer ? (customer.name || customer.email) : (req.body.createdBy || "Customer"),
        },
      ],
    });

    // Auto-block dates and sync bookingHistory on Product for all items
    const todayIST = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    for (const item of items) {
      if (!item.productId) continue;
      const product = await Product.findOne({
        $or: [
          { productId: item.productId },
          { _id: item.productId },
          { sku: item.productId },
        ],
      });
      if (!product) continue;

      const isRentalItem =
        item.mode && item.mode.toLowerCase() === "rental";
      const bookingStart = item.rentalStartDate || todayIST;
      const bookingEnd = item.rentalEndDate || bookingStart;

      if (isRentalItem && item.rentalStartDate && item.rentalEndDate) {
        if (!product.blockedDates) product.blockedDates = [];
        product.blockedDates.push({
          from: new Date(item.rentalStartDate),
          to: new Date(item.rentalEndDate),
          reason: `Rented (Order ${order.orderId})`,
        });
        product.timesRented = Number(product.timesRented || 0) + 1;
      }

      if (!Array.isArray(product.bookingHistory)) product.bookingHistory = [];
      const alreadyRecorded = product.bookingHistory.some(
        (bh) => bh.orderId === order.orderId,
      );
      if (!alreadyRecorded) {
        product.bookingHistory.push({
          orderId: order.orderId,
          customerName: order.customerName || "Customer",
          whatsappNumber: order.customerPhone || "",
          city: order.customerCity || "",
          startDate: bookingStart,
          endDate: bookingEnd,
          orderDate: order.orderDate || new Date().toISOString(),
          mode: item.mode || order.mode || "Rental",
          amount: Number(item.amount || order.grandTotal || 0),
          deposit: Number(item.deposit || order.deposit || 0),
          status: order.status || "Confirmed",
        });
      }
      if (!Array.isArray(product.activityLog)) product.activityLog = [];
      product.activityLog.push({
        action: `Order ${order.orderId} (${item.mode || order.mode}) booked by ${order.customerName || "Customer"}`,
        user: order.customerName || "Web Customer",
      });
      await product.save();
    }
    global.__webProductsCache = null;

    if (customer) await syncCustomerOrderStats([customer]);
    try {
      const { syncPayoutsFromOrders } = await import("./payoutController.js");
      if (syncPayoutsFromOrders) await syncPayoutsFromOrders();
    } catch (e) {}

    res
      .status(201)
      .json({
        success: true,
        data: view(order),
        related: {
          customerId: customer?.customerId,
          productIds: items.map((item) => item.productId),
        },
      });
  } catch (error) {
    res.status(422).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const existing = await Order.findOne(byId(req.params.id));
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    const custId = req.body.customerId || existing.customerId;
    const customer = custId ? await customerById(custId) : null;
    const rawItems = req.body.items
      ? await calculateItems(req.body.items)
      : existing.items;

    let incomingDispatchDetails =
      req.body.dispatchDetails !== undefined
        ? req.body.dispatchDetails
        : existing.dispatchDetails;

    // Ensure clean uppercase AWB (e.g. DHL12345 / DEL98765 / DEL55231987IN) when dispatched/shipped
    const targetStatus = req.body.status || existing.status || "";
    const isOutStatus = ["Dispatched", "Shipped", "Delivered", "Returned", "Complete", "Partially Returned"].includes(
      targetStatus,
    );
    if (incomingDispatchDetails || isOutStatus) {
      const baseDisp = incomingDispatchDetails
        ? incomingDispatchDetails.toObject
          ? incomingDispatchDetails.toObject()
          : { ...incomingDispatchDetails }
        : {};
      const cPartner = baseDisp.courierPartner || "Delhivery";
      let tNum = String(baseDisp.trackingNumber || "")
        .trim()
        .toUpperCase()
        .replace(/[\s\-_]+/g, "");
      if (!tNum && ["Dispatched", "Shipped"].includes(targetStatus)) {
        tNum = cPartner.toLowerCase().includes("dhl")
          ? `DHL${Math.floor(10000 + Math.random() * 90000)}`
          : `DEL${Math.floor(10000000 + Math.random() * 90000000)}IN`;
      }
      incomingDispatchDetails = {
        ...baseDisp,
        courierPartner: cPartner,
        trackingNumber: tNum,
      };
    }
    const incomingReturnLogistics =
      req.body.returnLogistics !== undefined
        ? req.body.returnLogistics
        : existing.returnLogistics;
    const resolvedDispatchDate =
      incomingDispatchDetails?.date ||
      req.body.dispatchDate ||
      existing.dispatchDetails?.date ||
      existing.dispatchDate ||
      "";

    const syncedItems = Array.isArray(rawItems)
      ? rawItems.map((it) => {
          const baseItem = it?.toObject ? it.toObject() : { ...it };
          const updatedDispatch = incomingDispatchDetails
            ? {
                ...(baseItem.dispatch || {}),
                dispatchedBy:
                  incomingDispatchDetails.dispatchedBy ??
                  baseItem.dispatch?.dispatchedBy ??
                  "",
                date:
                  incomingDispatchDetails.date ||
                  resolvedDispatchDate ||
                  baseItem.dispatch?.date ||
                  "",
                trackingNumber:
                  incomingDispatchDetails.trackingNumber ??
                  baseItem.dispatch?.trackingNumber ??
                  "",
                courierPartner:
                  incomingDispatchDetails.courierPartner ??
                  baseItem.dispatch?.courierPartner ??
                  "",
                status:
                  req.body.status === "Dispatched" ||
                  req.body.status === "Shipped"
                    ? req.body.status
                    : baseItem.dispatch?.status || "Scheduled",
              }
            : baseItem.dispatch;

          return {
            ...baseItem,
            ...(resolvedDispatchDate ? { dispatchDate: resolvedDispatchDate } : {}),
            ...(updatedDispatch ? { dispatch: updatedDispatch } : {}),
            ...(incomingReturnLogistics?.returnDate
              ? { returnDueDate: incomingReturnLogistics.returnDate }
              : {}),
          };
        })
      : rawItems;

    const incomingDepositDecision = req.body.depositDecision;
    let derivedDecisionStatus = "";
    if (
      incomingDepositDecision?.status &&
      ["Released", "Partial", "Partially Released", "Forfeited", "Refunded"].includes(
        incomingDepositDecision.status,
      )
    ) {
      derivedDecisionStatus =
        incomingDepositDecision.status === "Partial"
          ? "Partially Released"
          : incomingDepositDecision.status;
    }

    const targetDepositStatus =
      derivedDecisionStatus || req.body.depositStatus || existing.depositStatus;
    const calcTotals =
      req.body.recalculateTotals && req.body.items
        ? totalsFor(syncedItems, req.body.discount ?? existing.discount, targetDepositStatus)
        : {};
    if (targetDepositStatus) {
      calcTotals.depositStatus = targetDepositStatus;
    }
    if (incomingDepositDecision && Array.isArray(syncedItems) && syncedItems.length > 0) {
      syncedItems[0] = {
        ...syncedItems[0],
        depositDecision: {
          ...(syncedItems[0].depositDecision || {}),
          ...incomingDepositDecision,
        },
      };
    }

    const preservedGrandTotal =
      parseAmount(req.body.grandTotal) ||
      parseAmount(existing.grandTotal) ||
      parseAmount(req.body.amount) ||
      parseAmount(existing.amount);

    const cleanBody = { ...req.body };
    delete cleanBody._data;

    const updateData = {
      ...cleanBody,
      items: syncedItems,
      ...calcTotals,
      ...(preservedGrandTotal > 0
        ? {
            grandTotal: preservedGrandTotal,
            amount: preservedGrandTotal,
          }
        : {}),
      ...(resolvedDispatchDate ? { dispatchDate: resolvedDispatchDate } : {}),
      ...(incomingDispatchDetails !== undefined
        ? { dispatchDetails: incomingDispatchDetails }
        : {}),
      ...(incomingReturnLogistics !== undefined
        ? { returnLogistics: incomingReturnLogistics }
        : {}),
    };

    if (customer) {
      updateData.customerId = customer.customerId;
      updateData.customerName =
        req.body.customerName || customer.name || existing.customerName;
      updateData.customerEmail =
        req.body.customerEmail || customer.email || existing.customerEmail;
      updateData.customerPhone =
        req.body.customerPhone || customer.phone || existing.customerPhone;
      updateData.customerCity =
        req.body.customerCity || customer.location || existing.customerCity;
    }

    const order = await Order.findOneAndUpdate(
      byId(req.params.id),
      { $set: updateData },
      { new: true },
    );

    // If order status became Returned, Complete, or Cancelled -> unblock dates
    if (["Returned", "Complete", "Cancelled"].includes(order.status)) {
      for (const item of order.items || []) {
        if (!item.productId || item.mode?.toLowerCase() !== "rental") continue;
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
      }
    }

    if (customer) {
      syncCustomerOrderStats([customer]).catch(() => {});
    }
    res.json({ success: true, data: view(order) });
  } catch (error) {
    console.error("updateOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addOrderLog = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      byId(req.params.id),
      {
        $push: {
          logs: {
            message: req.body.message,
            type: req.body.type || "Internal Note",
            user: req.body.user || "Admin",
          },
        },
      },
      { new: true },
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, data: view(order) });
  } catch (error) {
    res.status(422).json({ success: false, message: error.message });
  }
};
