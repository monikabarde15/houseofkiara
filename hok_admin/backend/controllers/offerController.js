import { Parser } from "json2csv";
import Offer from "../models/Offer.js";
import Customer from "../models/Customer.js";
import PromoCode from "../models/PromoCode.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Lister from "../models/Lister.js";
import { validateOffer } from "../validations/offerValidation.js";
import { syncCustomerOrderStats } from "./customerController.js";

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

const addDaysYMD = (ymdStr, deltaDays) => {
  const m = String(ymdStr || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + deltaDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const findOfferDoc = async (id) => {
  if (!id) return null;
  let doc = await Offer.findById(id).catch(() => null);
  if (!doc) {
    doc = await Offer.findOne({ offerId: id }).catch(() => null);
  }
  return doc;
};

const createOrderForAcceptedOffer = async (offer, existingCustomer = null, overrides = {}) => {
  let product = null;
  if (offer.productId) {
    product = await Product.findOne({
      $or: [
        { productId: offer.productId },
        { _id: offer.productId },
        { sku: offer.productId },
        { id: offer.productId },
      ],
    }).catch(() => null);
  }
  if (!product && offer.productName) {
    product = await Product.findOne({ name: offer.productName }).catch(() => null);
  }

  let customer = existingCustomer;
  if (!customer && offer.customerId) {
    customer = await Customer.findOne({
      $or: [{ customerId: offer.customerId }, { _id: offer.customerId }],
    }).catch(() => null);
  }
  if (!customer && offer.customerEmail) {
    customer = await Customer.findOne({
      email: offer.customerEmail.trim().toLowerCase(),
    }).catch(() => null);
  }
  if (!customer && offer.customerPhone) {
    customer = await Customer.findOne({
      phone: offer.customerPhone.trim(),
    }).catch(() => null);
  }
  if (!customer && offer.customerName) {
    const customers = await Customer.find({}, "customerId").exec();
    const existingCustIds = (customers || [])
      .map((c) => c.customerId)
      .filter((id) => id && id.startsWith("CUST-"))
      .map((id) => parseInt(id.replace("CUST-", ""), 10))
      .filter((num) => !isNaN(num));
    const maxId = existingCustIds.length > 0 ? Math.max(...existingCustIds) : 0;
    const assignedCustomerId = `CUST-${String(maxId + 1).padStart(5, "0")}`;
    customer = await Customer.create({
      customerId: assignedCustomerId,
      name: offer.customerName.trim(),
      email: offer.customerEmail || `customer_${Date.now()}@houseofkaira.com`,
      phone: offer.customerPhone || "",
      location: overrides.address || offer.customerCity || "India",
      status: "Active",
      source: `Offline Order - ${offer.channel || "Admin"}`,
    });
  }

  const todayIST = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const rawStart = normalizeYMD(overrides.rentalStartDate || offer.rentalStartDate);
  const rawEnd = normalizeYMD(overrides.rentalEndDate || offer.rentalEndDate);

  const productModes = Array.isArray(product?.listingModes)
    ? product.listingModes.map((m) => String(m).toLowerCase())
    : [];
  const defaultProductMode =
    productModes.includes("rental") || (!productModes.includes("buy") && Number(product?.rentalPrice || 0) > 0)
      ? "Rental"
      : "Buy";

  const resolvedMode =
    overrides.mode ||
    offer.mode ||
    (rawStart ? "Rental" : defaultProductMode);

  let rentalStartDate = "";
  let rentalEndDate = "";
  let dispatchDate = todayIST;

  if (resolvedMode === "Rental") {
    rentalStartDate = rawStart || addDaysYMD(todayIST, 2);
    const minDays = Math.max(1, Number(product?.minimumDurationDays || 4));
    rentalEndDate =
      rawEnd && rawEnd >= rentalStartDate
        ? rawEnd
        : addDaysYMD(rentalStartDate, minDays - 1);
    dispatchDate = addDaysYMD(rentalStartDate, -2) || todayIST;
  }

  const agreedAmount = Number(
    overrides.amount ||
      offer.finalAmount ||
      offer.offeredAmount ||
      offer.originalAmount ||
      (resolvedMode === "Rental"
        ? product?.rentalPrice
        : product?.listingPrice || product?.originalRetailPrice) ||
      0,
  );
  const deposit =
    resolvedMode === "Rental"
      ? Number(product?.securityDeposit || product?.deposit || 10000)
      : 0;
  const discountVal = Number(offer.discount || 0);
  const grandTotal = agreedAmount + deposit;

  let listerId = product?.listerId || product?.lister_id || "";
  let listerName = product?.listerName || product?.lister_name || "";
  if (listerId && !listerName) {
    const lRec = await Lister.findOne({
      $or: [{ listerId }, { _id: listerId }, { id: listerId }],
    }).catch(() => null);
    if (lRec) listerName = lRec.name;
  }
  if (!listerId) {
    listerId = "ananya-sharma";
    listerName = "Ananya Sharma";
  }
  if (!listerName) listerName = "Ananya Sharma";

  const resolvedImage =
    offer.productImage ||
    (Array.isArray(product?.images) && product.images[0]) ||
    (typeof product?.image === "string" ? product.image : "") ||
    "";
  const resolvedDesigner = product?.designer || "House of Kaira";
  const resolvedSize =
    overrides.size ||
    offer.size ||
    (Array.isArray(product?.sizes) && product.sizes[0]) ||
    "Free Size";
  const resolvedProdId =
    product?.productId || product?._id?.toString() || offer.productId || "";
  const resolvedAddress =
    overrides.address ||
    offer.address ||
    offer.customerCity ||
    customer?.location ||
    "India";

  const orderId = `HOK-ORD-${Date.now()}`;
  const createdOrder = await Order.create({
    orderId,
    orderDate: new Date().toISOString(),
    customerId: customer?.customerId || offer.customerId || "",
    customerName: customer?.name || offer.customerName,
    customerEmail: customer?.email || offer.customerEmail || "",
    customerPhone: customer?.phone || offer.customerPhone || "",
    customerCity: offer.customerCity || customer?.location || "",
    customerState: offer.customerState || "",
    address: resolvedAddress,
    productId: resolvedProdId,
    productName: product?.name || offer.productName,
    designer: resolvedDesigner,
    image: resolvedImage,
    mode: resolvedMode,
    listerId,
    listerName,
    rentalStartDate,
    rentalEndDate,
    dispatchDate,
    paymentMethod: overrides.paymentMethod || `Offline (${offer.channel || "Admin"})`,
    status: "Confirmed",
    orderValue: agreedAmount,
    amount: grandTotal,
    grandTotal,
    priceBeforePromo: Number(offer.originalAmount || agreedAmount),
    discount: discountVal,
    offerId: offer.offerId,
    deposit,
    depositHeld: deposit,
    depositStatus: deposit > 0 ? "Pending" : "None",
    payoutStatus: "Pending Approval",
    items: [
      {
        productId: resolvedProdId,
        productName: product?.name || offer.productName,
        designer: resolvedDesigner,
        image: resolvedImage,
        mode: resolvedMode,
        size: resolvedSize,
        rentalStartDate,
        rentalEndDate,
        dispatchDate,
        returnDueDate: rentalEndDate ? addDaysYMD(rentalEndDate, 1) : "",
        amount: agreedAmount,
        deposit,
        listerId,
        listerName,
        quantity: Number(offer.quantity || 1),
        status: "Confirmed",
      },
    ],
    logs: [
      {
        message: `Order created from Offer/Enquiry ${offer.offerId} (${offer.channel || "Admin"})`,
        type: "Order",
        user: offer.assignedTo || "Admin",
      },
    ],
  });

  if (product) {
    if (resolvedMode === "Rental" && rentalStartDate && rentalEndDate) {
      if (!Array.isArray(product.blockedDates)) product.blockedDates = [];
      product.blockedDates.push({
        from: new Date(rentalStartDate),
        to: new Date(rentalEndDate),
        reason: `Rented (Order ${orderId})`,
      });
      product.timesRented = Number(product.timesRented || 0) + 1;
    }

    const bookingRecord = {
      orderId,
      customerName: createdOrder.customerName || "Customer",
      whatsappNumber: createdOrder.customerPhone || "",
      city: createdOrder.customerCity || "",
      startDate: rentalStartDate || todayIST,
      endDate: rentalEndDate || rentalStartDate || todayIST,
      orderDate: createdOrder.orderDate || new Date().toISOString(),
      mode: resolvedMode,
      amount: agreedAmount,
      deposit,
      status: "Confirmed",
      source: offer.channel || "Admin Offer",
    };

    if (!Array.isArray(product.bookingHistory)) product.bookingHistory = [];
    product.bookingHistory.push(bookingRecord);

    if (resolvedMode === "Rental") {
      if (!Array.isArray(product.externalBookings)) product.externalBookings = [];
      product.externalBookings.push(bookingRecord);
    }

    if (!Array.isArray(product.activityLog)) product.activityLog = [];
    product.activityLog.push({
      action: `Order ${orderId} (${resolvedMode}) created from Offer ${offer.offerId} for ${createdOrder.customerName}`,
      user: offer.assignedTo || "Admin",
    });

    await product.save().catch(() => {});
    global.__webProductsCache = null;
  }

  if (customer) {
    await syncCustomerOrderStats([customer]).catch(() => {});
  }
  try {
    const { syncPayoutsFromOrders } = await import("./payoutController.js");
    if (syncPayoutsFromOrders) await syncPayoutsFromOrders();
  } catch (e) {}

  return { order: createdOrder, customer };
};

// ===============================
// Create Offer
// POST /api/offers
// ===============================
export const createOffer = async (req, res) => {
  try {
    // Validate Request
    const { error } = validateOffer(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const {
      enquiryId,
      productId,
      productName,
      category,
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      customerState,
      quantity,
      originalAmount,
      offeredAmount,
      discount,
      currency,
      assignedTo,
      expiresAt,
      notes,
      customerId: providedCustomerId,
      promoCode: customPromoCode,
    } = req.body;

    const cleanEmail = customerEmail ? customerEmail.trim().toLowerCase() : "";
    const cleanPhone = customerPhone ? customerPhone.trim() : "";
    const cleanName = (customerName || "").trim();

    // 1. Find existing customer or auto-create new customer
    let customer = null;
    if (providedCustomerId) {
      customer = await Customer.findOne({
        $or: [{ customerId: providedCustomerId }, { _id: providedCustomerId }],
      });
    }
    if (!customer && cleanEmail) {
      customer = await Customer.findOne({ email: cleanEmail });
    }
    if (!customer && cleanPhone) {
      customer = await Customer.findOne({ phone: cleanPhone });
    }
    if (!customer && cleanName) {
      customer = await Customer.findOne({ name: cleanName });
    }

    let assignedCustomerId = customer ? customer.customerId : null;

    if (!customer && cleanName) {
      try {
        const customers = await Customer.find({}, "customerId").exec();
        const existingCustIds = (customers || [])
          .map((c) => c.customerId)
          .filter((id) => id && id.startsWith("CUST-"))
          .map((id) => parseInt(id.replace("CUST-", ""), 10))
          .filter((num) => !isNaN(num));
        const maxId = existingCustIds.length > 0 ? Math.max(...existingCustIds) : 0;
        assignedCustomerId = `CUST-${String(maxId + 1).padStart(5, "0")}`;

        customer = await Customer.create({
          customerId: assignedCustomerId,
          name: cleanName,
          email: cleanEmail || `customer_${Date.now()}@houseofkaira.com`,
          phone: cleanPhone || "",
          location: customerCity || "India",
          status: "Active",
          source: `Offline Offer - ${req.body.channel || "Phone"}`,
        });
      } catch (custErr) {
        console.error("Auto customer create note:", custErr.message);
      }
    } else if (customer && !assignedCustomerId) {
      assignedCustomerId = customer.customerId;
    }

    // 2. Calculate discount (Promo Code only created if explicitly passed)
    const origAmt = Number(originalAmount) || 0;
    const offAmt = Number(offeredAmount) || 0;
    const calculatedDiscount =
      origAmt > offAmt && offAmt > 0
        ? origAmt - offAmt
        : Number(discount) || 0;

    let finalPromoCode = customPromoCode ? customPromoCode.trim().toUpperCase() : null;

    if (finalPromoCode && calculatedDiscount > 0) {
      try {
        const today = new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const existingPromo = await PromoCode.findOne({ code: finalPromoCode });
        if (!existingPromo) {
          await PromoCode.create({
            code: finalPromoCode,
            type: "flat",
            value: calculatedDiscount,
            reason: `Negotiated offer for ${cleanName} on ${productName}`,
            publicDesc: `Special Offer: ₹${calculatedDiscount.toLocaleString("en-IN")} OFF on ${productName}`,
            scope: {
              skus: productId ? [productId] : [],
              productNames: productName ? [productName] : [],
              categories: category ? [category] : [],
              designerIds: [],
            },
            customerIds: [assignedCustomerId, cleanEmail, cleanPhone].filter(Boolean),
            status: "Active",
            audience: "private",
            createdBy: assignedTo || "Admin",
            createdOn: today,
            history: [
              {
                e: `Offer code created for ${cleanName}`,
                t: `${today} - ${assignedTo || "Admin"}`,
              },
            ],
          });
        }
      } catch (promoErr) {
        console.error("Auto promo code creation note:", promoErr.message);
      }
    }

    // Generate Unique Offer ID
    const offerId = req.body.offerId || `OFF-${Date.now()}`;
    const normalizedMode = req.body.mode || (req.body.rentalStartDate ? "Rental" : "Rental");
    const normalizedStart = normalizeYMD(req.body.rentalStartDate);
    const normalizedEnd = normalizeYMD(req.body.rentalEndDate);
    const shouldCreateOrder = Boolean(req.body.createOrder);

    const offer = await Offer.create({
      offerId,
      enquiryId,
      productId,
      productName,
      category,
      customerId: assignedCustomerId,
      customerName: cleanName,
      customerEmail: cleanEmail || customer?.email || "",
      customerPhone: cleanPhone || customer?.phone || "",
      customerCity,
      customerState,
      address: req.body.address || customerCity || "",
      mode: normalizedMode,
      size: req.body.size || "",
      rentalStartDate: normalizedStart,
      rentalEndDate: normalizedEnd,
      quantity,
      originalAmount: origAmt,
      offeredAmount: offAmt,
      finalAmount: offAmt || origAmt,
      discount: calculatedDiscount,
      promoCode: finalPromoCode,
      currency: currency || "INR",
      assignedTo,
      expiresAt,
      channel: req.body.channel || "Website",

      status: shouldCreateOrder ? "Accepted" : offAmt ? "Pending" : "Enquiry",
      negotiationStatus: shouldCreateOrder ? "Completed" : "Not Started",

      notes: notes
        ? [
            {
              message: notes,
              createdBy: "Admin",
              createdAt: new Date(),
            },
          ]
        : [],

      timeline: [
        {
          action: "Offer Created",
          remarks: shouldCreateOrder
            ? "Offer logged & accepted directly by Admin."
            : "Offer created successfully.",
          user: assignedTo || "Admin",
          createdAt: new Date(),
        },
      ],
    });

    let createdOrder = null;
    if (shouldCreateOrder) {
      const orderResult = await createOrderForAcceptedOffer(offer, customer, {
        mode: normalizedMode,
        rentalStartDate: normalizedStart,
        rentalEndDate: normalizedEnd,
        address: req.body.address,
        size: req.body.size,
        paymentMethod: req.body.paymentMethod,
        amount: offAmt || origAmt,
      });
      createdOrder = orderResult.order;
      if (orderResult.customer && !customer) customer = orderResult.customer;

      offer.linkedOrderId = createdOrder.orderId;
      offer.rentalStartDate = createdOrder.rentalStartDate || normalizedStart;
      offer.rentalEndDate = createdOrder.rentalEndDate || normalizedEnd;
      offer.mode = createdOrder.mode || normalizedMode;
      offer.customerId = customer?.customerId || assignedCustomerId;
      offer.timeline.push({
        action: "Converted to Order",
        remarks: `Confirmed Order ${createdOrder.orderId} created (${offer.mode}${offer.rentalStartDate ? `: ${offer.rentalStartDate} to ${offer.rentalEndDate}` : ""}).`,
        user: assignedTo || "Admin",
        createdAt: new Date(),
      });
      await offer.save();
    }

    return res.status(201).json({
      success: true,
      message: createdOrder
        ? `Offer saved & Order ${createdOrder.orderId} created successfully.`
        : "Offer created successfully.",
      data: {
        ...(offer.toObject ? offer.toObject() : offer),
        promoCode: finalPromoCode,
        customerId: offer.customerId || assignedCustomerId,
        linkedOrderId: offer.linkedOrderId || undefined,
      },
      order: createdOrder
        ? createdOrder.toObject
          ? createdOrder.toObject()
          : createdOrder
        : null,
      customer: customer ? (customer.toObject ? customer.toObject() : customer) : null,
      promoCode: finalPromoCode,
    });
  } catch (err) {
    console.error("Create Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Get All Offers
// GET /api/offers
// =======================================

export const getOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      customer,
      sortBy = "createdAt",
      order = "desc",
    } = req.query || {};

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        { offerId: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerEmail: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ];
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    // Customer Filter
    if (customer) {
      filter.customerName = {
        $regex: customer,
        $options: "i",
      };
    }

    let total = 0;
    try {
      total = await Offer.countDocuments(filter);
    } catch (e) {
      total = 0;
    }

    const offers = await Offer.find(filter)
      .sort({
        [sortBy]: order === "asc" ? 1 : -1,
      })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Offers fetched successfully.",

      pagination: {
        currentPage: Number(page),
        perPage: Number(limit),
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
      },

      data: offers,
    });
  } catch (err) {
    console.error("Get Offers Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Get Single Offer
// GET /api/offers/:id
// =======================================

export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer fetched successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Get Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Update Offer
// PUT /api/offers/:id
// =======================================

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    // Validate Request
    const { error } = validateOffer(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Update Fields
    offer.enquiryId = req.body.enquiryId ?? offer.enquiryId;
    offer.productId = req.body.productId ?? offer.productId;
    offer.productName = req.body.productName ?? offer.productName;
    offer.category = req.body.category ?? offer.category;

    offer.customerName = req.body.customerName ?? offer.customerName;
    offer.customerEmail = req.body.customerEmail ?? offer.customerEmail;
    offer.customerPhone = req.body.customerPhone ?? offer.customerPhone;
    offer.customerCity = req.body.customerCity ?? offer.customerCity;
    offer.customerState = req.body.customerState ?? offer.customerState;

    offer.channel = req.body.channel ?? offer.channel;

    offer.quantity = req.body.quantity ?? offer.quantity;

    offer.originalAmount = req.body.originalAmount ?? offer.originalAmount;

    offer.offeredAmount = req.body.offeredAmount ?? offer.offeredAmount;

    offer.discount = req.body.discount ?? offer.discount;

    offer.finalAmount = req.body.finalAmount ?? offer.finalAmount;

    offer.currency = req.body.currency ?? offer.currency;

    offer.assignedTo = req.body.assignedTo ?? offer.assignedTo;

    offer.expiresAt = req.body.expiresAt ?? offer.expiresAt;

    offer.updatedAt = new Date();

    // Timeline
    offer.timeline.push({
      action: "Offer Updated",
      remarks: "Offer details updated successfully.",
      user: "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Update Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Delete Offer (Soft Delete)
// DELETE /api/offers/:id
// =======================================

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Already Deleted
    if (offer.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Offer already deleted.",
      });
    }

    // Soft Delete
    offer.isDeleted = true;
    offer.updatedAt = new Date();

    // Timeline Entry
    offer.timeline.push({
      action: "Offer Deleted",
      remarks: "Offer deleted successfully.",
      user: "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully.",
    });
  } catch (err) {
    console.error("Delete Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Permanent Delete Offer
// DELETE /api/offers/:id/permanent
// =======================================

export const permanentDeleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    await Offer.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Offer permanently deleted successfully.",
    });
  } catch (err) {
    console.error("Permanent Delete Offer Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Update Offer Status
// PATCH /api/offers/:id/status
// =======================================

export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, updatedBy } = req.body;

    // Allowed Status
    const allowedStatus = [
      "Enquiry",
      "Pending",
      "Accepted",
      "Rejected",
      "Counter Offered",
      "Expired",
      "Assigned",
      "Completed",
    ];

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status.",
      });
    }

    const offer = await findOfferDoc(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const oldStatus = offer.status;

    offer.status = status;
    offer.updatedAt = new Date();
    if (req.body.mode) offer.mode = req.body.mode;
    if (req.body.rentalStartDate) {
      offer.rentalStartDate = normalizeYMD(req.body.rentalStartDate);
    }
    if (req.body.rentalEndDate) {
      offer.rentalEndDate = normalizeYMD(req.body.rentalEndDate);
    }
    if (req.body.address) offer.address = req.body.address;
    if (req.body.amount !== undefined && Number(req.body.amount) > 0) {
      offer.offeredAmount = Number(req.body.amount);
      offer.finalAmount = Number(req.body.amount);
    }

    // Timeline Entry
    offer.timeline.push({
      action: "Status Updated",
      remarks: remarks || `Offer status changed from ${oldStatus} to ${status}`,
      user: updatedBy || "Admin",
      createdAt: new Date(),
    });

    let createdOrder = null;
    if (status === "Accepted" && !offer.linkedOrderId && req.body.createOrder !== false) {
      const orderResult = await createOrderForAcceptedOffer(offer, null, {
        mode: req.body.mode || offer.mode,
        rentalStartDate: req.body.rentalStartDate || offer.rentalStartDate,
        rentalEndDate: req.body.rentalEndDate || offer.rentalEndDate,
        address: req.body.address || offer.address,
        size: req.body.size || offer.size,
        paymentMethod: req.body.paymentMethod,
        amount: req.body.amount,
      });
      createdOrder = orderResult.order;
      offer.linkedOrderId = createdOrder.orderId;
      offer.mode = createdOrder.mode || offer.mode;
      offer.rentalStartDate = createdOrder.rentalStartDate || offer.rentalStartDate;
      offer.rentalEndDate = createdOrder.rentalEndDate || offer.rentalEndDate;
      if (orderResult.customer?.customerId && !offer.customerId) {
        offer.customerId = orderResult.customer.customerId;
      }
      offer.negotiationStatus = "Completed";
      offer.timeline.push({
        action: "Converted to Order",
        remarks: `Confirmed Order ${createdOrder.orderId} created (${offer.mode}${offer.rentalStartDate ? `: ${offer.rentalStartDate} to ${offer.rentalEndDate}` : ""}).`,
        user: updatedBy || "Admin",
        createdAt: new Date(),
      });
    }

    await offer.save();

    return res.status(200).json({
      success: true,
      message: createdOrder
        ? `Offer accepted & Order ${createdOrder.orderId} created.`
        : "Offer status updated successfully.",
      data: offer,
      order: createdOrder
        ? createdOrder.toObject
          ? createdOrder.toObject()
          : createdOrder
        : null,
    });
  } catch (err) {
    console.error("Update Status Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Send Counter Offer
// POST /api/offers/:id/counter-offer
// =======================================

export const sendCounterOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const { amount, discount, remarks, expiryDate, sentBy } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Counter offer amount is required.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    // Counter Offer Object
    const counterOffer = {
      amount,
      discount: discount || 0,
      message: remarks || "",
      sentBy: sentBy || "Admin",
      sentAt: new Date(),
      expiryDate: expiryDate || null,
    };

    // Save Counter Offer
    offer.counterOffers.push(counterOffer);

    // Update Offer Amount
    offer.offeredAmount = amount;
    offer.finalAmount = amount;
    offer.discount = discount || 0;

    // Update Status
    offer.status = "Counter Offered";

    // Timeline
    offer.timeline.push({
      action: "Counter Offer Sent",
      remarks: remarks || `Counter Offer ₹${amount} has been sent.`,
      user: sentBy || "Admin",
      createdAt: new Date(),
    });

    offer.updatedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Counter offer sent successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Counter Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Assign Offer
// POST /api/offers/:id/assign
// =======================================

export const assignOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const { assignedTo, assignedBy, remarks } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned user is required.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    offer.assignedTo = assignedTo;
    offer.assignedBy = assignedBy || "Admin";
    offer.assignedAt = new Date();

    offer.status = "Assigned";

    // Assignment History
    if (!offer.assignmentHistory) {
      offer.assignmentHistory = [];
    }

    offer.assignmentHistory.push({
      assignedTo,
      assignedBy: assignedBy || "Admin",
      assignedAt: new Date(),
      remarks: remarks || "",
    });

    // Timeline
    offer.timeline.push({
      action: "Offer Assigned",
      remarks: remarks || `Offer assigned to ${assignedTo}`,
      user: assignedBy || "Admin",
      createdAt: new Date(),
    });

    offer.updatedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer assigned successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Assign Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Add Offer Note
// POST /api/offers/:id/notes
// =======================================

export const addOfferNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, createdBy } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Note message is required.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const note = {
      message,
      createdBy: createdBy || "Admin",
      createdAt: new Date(),
    };

    offer.notes.push(note);

    offer.timeline.push({
      action: "Note Added",
      remarks: message,
      user: createdBy || "Admin",
      createdAt: new Date(),
    });

    offer.updatedAt = new Date();

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Note added successfully.",
      data: note,
    });
  } catch (err) {
    console.error("Add Note Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Get Offer Notes
// GET /api/offers/:id/notes
// =======================================

export const getOfferNotes = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select("offerId customerName notes");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer notes fetched successfully.",
      totalNotes: offer.notes.length,
      data: offer.notes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      ),
    });
  } catch (err) {
    console.error("Get Offer Notes Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Get Offer Timeline
// GET /api/offers/:id/timeline
// =======================================

export const getOfferTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName timeline",
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const timeline = offer.timeline.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return res.status(200).json({
      success: true,
      message: "Offer timeline fetched successfully.",
      totalActivities: timeline.length,
      data: timeline,
    });
  } catch (err) {
    console.error("Get Timeline Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Get Assignment History
// GET /api/offers/:id/assignment-history
// =======================================

export const getAssignmentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName assignmentHistory",
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const history = offer.assignmentHistory.sort(
      (a, b) => new Date(b.assignedAt) - new Date(a.assignedAt),
    );

    return res.status(200).json({
      success: true,
      message: "Assignment history fetched successfully.",
      totalAssignments: history.length,
      data: history,
    });
  } catch (err) {
    console.error("Assignment History Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Get Counter Offer History
// GET /api/offers/:id/counter-offers
// =======================================

export const getCounterOfferHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id).select(
      "offerId customerName productName counterOffers",
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const history = [...offer.counterOffers].sort(
      (a, b) => new Date(b.sentAt) - new Date(a.sentAt),
    );

    return res.status(200).json({
      success: true,
      message: "Counter offer history fetched successfully.",
      totalCounterOffers: history.length,
      data: history,
    });
  } catch (err) {
    console.error("Counter Offer History Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Restore Offer
// PATCH /api/offers/:id/restore
// =======================================

export const restoreOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    if (!offer.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Offer is already active.",
      });
    }

    offer.isDeleted = false;
    offer.deletedAt = null;
    offer.deletedBy = null;
    offer.updatedAt = new Date();

    offer.timeline.push({
      action: "Offer Restored",
      remarks: "Offer restored successfully.",
      user: "Admin",
      createdAt: new Date(),
    });

    await offer.save();

    return res.status(200).json({
      success: true,
      message: "Offer restored successfully.",
      data: offer,
    });
  } catch (err) {
    console.error("Restore Offer Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Get Deleted Offers (Trash)
// GET /api/offers/trash
// =======================================

export const getDeletedOffers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "deletedAt",
      order = "desc",
    } = req.query;

    const filter = {
      isDeleted: true,
    };

    // Search
    if (search) {
      filter.$or = [
        {
          offerId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerEmail: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerPhone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Offer.countDocuments(filter);

    const offers = await Offer.find(filter)
      .sort({
        [sortBy]: order === "asc" ? 1 : -1,
      })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Deleted offers fetched successfully.",

      pagination: {
        currentPage: Number(page),
        perPage: Number(limit),
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
      },

      data: offers,
    });
  } catch (err) {
    console.error("Trash API Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Bulk Delete Offers
// DELETE /api/offers/bulk-delete
// =======================================

export const bulkDeleteOffers = async (req, res) => {
  try {
    const { offerIds, deletedBy } = req.body;

    if (!offerIds || !Array.isArray(offerIds)) {
      return res.status(400).json({
        success: false,
        message: "offerIds array is required.",
      });
    }

    if (offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one offer.",
      });
    }

    const result = await Offer.updateMany(
      {
        _id: { $in: offerIds },
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedBy: deletedBy || "Admin",
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    // Add Timeline Entry
    const offers = await Offer.find({
      _id: { $in: offerIds },
    });

    for (const offer of offers) {
      offer.timeline.push({
        action: "Bulk Deleted",
        remarks: "Offer deleted using bulk action.",
        user: deletedBy || "Admin",
        createdAt: new Date(),
      });

      await offer.save();
    }

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} offers deleted successfully.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Bulk Delete Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Dashboard Summary
// GET /api/offers/dashboard
// =======================================

export const getOfferDashboard = async (req, res) => {
  try {
    const [
      totalOffers,
      pendingOffers,
      acceptedOffers,
      rejectedOffers,
      counterOffers,
      assignedOffers,
      completedOffers,
      expiredOffers,
      deletedOffers,
      activeOffers,
    ] = await Promise.all([
      Offer.countDocuments({
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Pending",
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Accepted",
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Rejected",
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Counter Offered",
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Assigned",
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Completed",
        isDeleted: false,
      }),

      Offer.countDocuments({
        status: "Expired",
        isDeleted: false,
      }),

      Offer.countDocuments({
        isDeleted: true,
      }),

      Offer.countDocuments({
        isActive: true,
        isDeleted: false,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully.",

      data: {
        totalOffers,

        activeOffers,

        pendingOffers,

        acceptedOffers,

        rejectedOffers,

        counterOffers,

        assignedOffers,

        completedOffers,

        expiredOffers,

        deletedOffers,
      },
    });
  } catch (err) {
    console.error("Dashboard Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Get Recent Offers
// GET /api/offers/recent
// =======================================

export const getRecentOffers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const offers = await Offer.find({
      isDeleted: false,
    })
      .select(
        "offerId customerName customerEmail customerPhone productName offeredAmount status assignedTo createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "Recent offers fetched successfully.",
      total: offers.length,
      data: offers,
    });
  } catch (err) {
    console.error("Recent Offers Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Offer Statistics
// GET /api/offers/statistics
// =======================================

export const getOfferStatistics = async (req, res) => {
  try {
    // Monthly Statistics
    const monthlyStatistics = await Offer.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },

          totalOffers: {
            $sum: 1,
          },

          totalRevenue: {
            $sum: "$finalAmount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Status Statistics
    const statusStatistics = await Offer.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$status",
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    // Overall Revenue
    const revenue = await Offer.aggregate([
      {
        $match: {
          isDeleted: false,
          status: "Accepted",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$finalAmount",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Offer statistics fetched successfully.",

      data: {
        monthlyStatistics,
        statusStatistics,
        totalRevenue: revenue.length ? revenue[0].revenue : 0,
      },
    });
  } catch (err) {
    console.error("Statistics Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Duplicate Offer
// POST /api/offers/:id/duplicate
// =======================================

export const duplicateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Offer ID.",
      });
    }

    const existingOffer = await Offer.findById(id);

    if (!existingOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    const newOffer = existingOffer.toObject();

    delete newOffer._id;

    newOffer.offerId = `OFF-${Date.now()}`;

    newOffer.status = "Pending";

    newOffer.negotiationStatus = "Not Started";

    newOffer.counterOffers = [];

    newOffer.notes = [];

    newOffer.assignmentHistory = [];

    newOffer.timeline = [
      {
        action: "Offer Duplicated",
        remarks: `Copied from ${existingOffer.offerId}`,
        user: "Admin",
        createdAt: new Date(),
      },
    ];

    newOffer.createdAt = new Date();

    newOffer.updatedAt = new Date();

    newOffer.isDeleted = false;

    newOffer.deletedAt = null;

    newOffer.deletedBy = null;

    const duplicatedOffer = await Offer.create(newOffer);

    return res.status(201).json({
      success: true,
      message: "Offer duplicated successfully.",
      data: duplicatedOffer,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Bulk Restore Offers
// PATCH /api/offers/bulk-restore
// =======================================

export const bulkRestoreOffers = async (req, res) => {
  try {
    const { offerIds, restoredBy } = req.body;

    if (!offerIds || !Array.isArray(offerIds)) {
      return res.status(400).json({
        success: false,
        message: "offerIds array is required.",
      });
    }

    if (offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one offer.",
      });
    }

    const result = await Offer.updateMany(
      {
        _id: { $in: offerIds },
        isDeleted: true,
      },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          deletedBy: null,
          updatedAt: new Date(),
        },
      },
    );

    const offers = await Offer.find({
      _id: { $in: offerIds },
    });

    for (const offer of offers) {
      offer.timeline.push({
        action: "Bulk Restore",
        remarks: "Offer restored using bulk action.",
        user: restoredBy || "Admin",
        createdAt: new Date(),
      });

      await offer.save();
    }

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} offers restored successfully.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Bulk Restore Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
// =======================================
// Bulk Permanent Delete Offers
// DELETE /api/offers/bulk-permanent-delete
// =======================================

export const bulkPermanentDeleteOffers = async (req, res) => {
  try {
    const { offerIds } = req.body;

    if (!offerIds || !Array.isArray(offerIds)) {
      return res.status(400).json({
        success: false,
        message: "offerIds array is required.",
      });
    }

    if (offerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one offer.",
      });
    }

    const result = await Offer.deleteMany({
      _id: {
        $in: offerIds,
      },
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} offers permanently deleted.`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Bulk Permanent Delete Error :", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Export CSV
// GET /api/offers/export/csv
// =======================================

export const exportOffersCSV = async (req, res) => {
  try {
    const offers = await Offer.find({
      isDeleted: false,
    }).lean();

    if (!offers.length) {
      return res.status(404).json({
        success: false,
        message: "No offers found.",
      });
    }

    const fields = [
      "offerId",
      "customerName",
      "customerEmail",
      "customerPhone",
      "productName",
      "category",
      "originalAmount",
      "offeredAmount",
      "finalAmount",
      "discount",
      "status",
      "assignedTo",
      "createdAt",
    ];

    const parser = new Parser({ fields });

    const csv = parser.parse(offers);

    res.header("Content-Type", "text/csv");

    res.attachment("offers.csv");

    return res.send(csv);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
