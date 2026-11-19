import Enquiry from "../models/Enquiry.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Offer from "../models/Offer.js";
import { nextOrderId } from "../services/orderIdService.js";
import { syncCustomerOrderStats } from "./customerController.js";
import { pool } from "../config/db.js";

let tableEnsured = false;
async function ensureEnquiriesTable() {
  if (tableEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        _id VARCHAR(64) PRIMARY KEY,
        enquiry_id VARCHAR(255) UNIQUE NOT NULL,
        customer_id VARCHAR(255),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255),
        customer_phone VARCHAR(100),
        interested_in VARCHAR(100) DEFAULT 'Rent',
        channel VARCHAR(100) DEFAULT 'WhatsApp',
        assigned_to VARCHAR(255),
        status VARCHAR(50) DEFAULT 'New',
        linked_order_id VARCHAR(255),
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    tableEnsured = true;
  } catch (e) {
    // ignore if table creation is already handled by migrate
  }
}

async function generateEnquiryId() {
  const all = await Enquiry.find({}).catch(() => []);
  let maxNum = 0;
  for (const doc of all) {
    const m = String(doc.enquiryId || "").match(/^ENQ-(\d+)$/i);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxNum) maxNum = n;
    }
  }
  return `ENQ-${String(maxNum + 1).padStart(3, "0")}`;
}

async function generateNextOfferId() {
  const allOffers = await Offer.find({}).catch(() => []);
  let maxNum = 0;
  for (const o of allOffers) {
    const m = String(o.offerId || "").match(/^OFF-(\d+)$/i);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxNum && n < 1000000) maxNum = n;
    }
  }
  return `OFF-${String(maxNum + 1).padStart(4, "0")}`;
}

async function findEnquiryDoc(id) {
  if (!id) return null;
  const doc = await Enquiry.findOne({
    $or: [{ enquiryId: id }, { _id: id }],
  }).catch(() => null);
  return doc;
}

const normalizeYMD = (raw) => {
  if (!raw) return "";
  const s = String(raw).trim();
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const addDaysYMD = (ymdStr, deltaDays) => {
  const m = String(ymdStr || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + deltaDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const formatCustomerPayload = (doc) => {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  return {
    ...obj,
    id: obj.customerId || String(obj._id || ""),
  };
};

/**
 * Finds an existing Customer by ID / email / 10-digit phone, or creates a new Customer
 * in the customers table so every enquiry customer appears immediately in Admin -> Customers.
 */
async function ensureCustomerForEnquiry({
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  customerCity,
  channel,
  enquiryId,
  initialMessage,
}) {
  const cleanName = String(customerName || "").trim();
  const cleanEmail = String(customerEmail || "").trim().toLowerCase();
  const cleanPhone = String(customerPhone || "").trim();
  const cleanCity = String(customerCity || "").trim();
  const phoneDigits = cleanPhone.replace(/\D/g, "").slice(-10);

  let customer = null;

  if (customerId) {
    customer = await Customer.findOne({
      $or: [{ customerId }, { _id: customerId }],
    }).catch(() => null);
  }

  if (
    !customer &&
    cleanEmail &&
    !cleanEmail.includes("@hok.local") &&
    !cleanEmail.includes("@houseofkaira.com")
  ) {
    customer = await Customer.findOne({ email: cleanEmail }).catch(() => null);
  }

  if (!customer && phoneDigits.length >= 10) {
    const allCusts = await Customer.find({}).catch(() => []);
    customer =
      allCusts.find((c) => {
        const d = String(c.phone || "")
          .replace(/\D/g, "")
          .slice(-10);
        return d === phoneDigits;
      }) || null;
  }

  if (customer) {
    let dirty = false;
    if (!customer.phone && cleanPhone) {
      customer.phone = cleanPhone;
      dirty = true;
    }
    if ((!customer.location || customer.location === "India") && cleanCity) {
      customer.location = cleanCity;
      dirty = true;
    }
    if (enquiryId && initialMessage) {
      const logArr = Array.isArray(customer.communicationLog)
        ? [...customer.communicationLog]
        : [];
      const tag = `[${enquiryId}]`;
      if (!logArr.some((l) => String(l.message || "").includes(tag))) {
        logArr.push({
          id: `comm_${Date.now()}`,
          message: `${tag} ${initialMessage}`,
          channel: channel || "WhatsApp",
          timestamp: new Date().toLocaleString("en-IN"),
        });
        customer.communicationLog = logArr;
        dirty = true;
      }
    }
    if (dirty) {
      await customer.save().catch(() => {});
    }
    return { customer, wasExisting: true };
  }

  if (!cleanName) return { customer: null, wasExisting: false };

  const allCustDocs = await Customer.find({}, "customerId").catch(() => []);
  const nums = (allCustDocs || [])
    .map((c) =>
      parseInt(String(c.customerId || "").replace(/^CUST-/i, ""), 10),
    )
    .filter((n) => !isNaN(n));
  const nextCustId = `CUST-${String(
    (nums.length ? Math.max(...nums) : 0) + 1,
  ).padStart(5, "0")}`;

  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts[0] || cleanName;
  const lastName = nameParts.slice(1).join(" ");

  const commLog = [];
  if (enquiryId) {
    commLog.push({
      id: `comm_${Date.now()}`,
      message: `[${enquiryId}] Enquiry logged via ${channel || "WhatsApp"}${
        initialMessage ? `: ${initialMessage}` : ""
      }`,
      channel: channel || "WhatsApp",
      timestamp: new Date().toLocaleString("en-IN"),
    });
  }

  customer = await Customer.create({
    customerId: nextCustId,
    name: cleanName,
    firstName,
    lastName,
    email: cleanEmail || `enquiry_${Date.now()}@houseofkaira.com`,
    phone: cleanPhone,
    location: cleanCity || "India",
    address: cleanCity || "",
    status: "Active",
    source: `Enquiry - ${channel || "WhatsApp"}`,
    communicationLog: commLog,
  });

  return { customer, wasExisting: false };
}

async function resolvePieceFromProduct(rawPiece, allProducts = null) {
  if (!rawPiece) return null;
  const pid =
    typeof rawPiece === "string"
      ? rawPiece
      : rawPiece.productId || rawPiece.id || rawPiece._id || "";
  const pName =
    typeof rawPiece === "object" ? rawPiece.productName || rawPiece.name : "";

  let prod = null;
  if (Array.isArray(allProducts)) {
    prod = allProducts.find(
      (p) =>
        (pid &&
          (String(p.productId) === String(pid) ||
            String(p._id) === String(pid) ||
            String(p.id) === String(pid))) ||
        (pName && String(p.name || p.title) === String(pName)),
    );
  } else if (pid || pName) {
    const conds = [];
    if (pid) conds.push({ productId: pid }, { _id: pid });
    if (pName) conds.push({ name: pName });
    prod = await Product.findOne({ $or: conds }).catch(() => null);
  }

  if (prod) {
    return {
      productId: prod.productId || String(prod._id),
      sku: prod.sku || "",
      productName: prod.name || prod.title || pName || "Piece",
      designer: prod.designer || "",
      image:
        (Array.isArray(prod.images) && prod.images[0]) ||
        (typeof prod.image === "string" ? prod.image : "") ||
        "",
      rentalPrice: Number(prod.rentalPrice || 0),
      perDayRate: Number(prod.perDayRate || 0),
      securityDeposit: Number(prod.securityDeposit || 0),
      listingPrice: Number(prod.listingPrice || prod.price || 0),
      minimumDurationDays: Number(prod.minimumDurationDays || 3),
    };
  }

  if (typeof rawPiece === "object" && (rawPiece.productName || rawPiece.name)) {
    return {
      productId: pid || "",
      productName: rawPiece.productName || rawPiece.name,
      designer: rawPiece.designer || "",
      image: rawPiece.image || "",
      rentalPrice: Number(rawPiece.rentalPrice || 0),
      perDayRate: Number(rawPiece.perDayRate || 0),
      securityDeposit: Number(rawPiece.securityDeposit || 0),
      listingPrice: Number(rawPiece.listingPrice || 0),
    };
  }

  // Fallback: resolve piece metadata from existing Orders (e.g. if product was archived/removed after order)
  if (pid || pName) {
    const ordersList = await Order.find({}).catch(() => []);
    for (const ord of ordersList) {
      const items =
        Array.isArray(ord.items) && ord.items.length > 0 ? ord.items : [ord];
      for (const it of items) {
        const itPid = String(it.productId || ord.productId || "");
        const itName = String(it.productName || ord.productName || "");
        const matched =
          (pid &&
            (itPid === String(pid) ||
              itName.toLowerCase() === String(pid).toLowerCase())) ||
          (pName && itName.toLowerCase() === String(pName).toLowerCase());
        if (matched && itName) {
          const isRent = String(it.mode || ord.mode || "Rental")
            .toLowerCase()
            .includes("rent");
          const amt = Number(it.amount || ord.amount || ord.grandTotal || 0);
          return {
            productId: itPid || itName,
            productName: itName,
            designer: it.designer || ord.designer || "",
            image: it.image || ord.image || "",
            rentalPrice: isRent ? amt : 0,
            perDayRate: 0,
            securityDeposit: Number(it.deposit || ord.deposit || 0),
            listingPrice: !isRent ? amt : 0,
          };
        }
      }
    }
  }

  return null;
}

function isPlaceholderEmail(email) {
  const e = String(email || "").trim().toLowerCase();
  return (
    !e ||
    e.includes("@houseofkaira.com") ||
    e.includes("@hok.local") ||
    e.includes("@temp.com")
  );
}

function doesOrderBelongToEnquiryCustomer(ord, enq) {
  if (!ord || !enq) return false;

  const enqCid = String(enq.customerId || "").trim();
  const ordCid = String(ord.customerId || "").trim();
  if (enqCid && ordCid && enqCid === ordCid) {
    return true;
  }

  const enqEmail = isPlaceholderEmail(enq.customerEmail)
    ? ""
    : String(enq.customerEmail || "").trim().toLowerCase();
  const ordEmail = isPlaceholderEmail(ord.customerEmail)
    ? ""
    : String(ord.customerEmail || "").trim().toLowerCase();
  if (enqEmail && ordEmail && enqEmail === ordEmail) {
    return true;
  }

  const enqPhone = String(enq.customerPhone || "")
    .replace(/\D/g, "")
    .slice(-10);
  const ordPhone = String(ord.customerPhone || "")
    .replace(/\D/g, "")
    .slice(-10);
  if (enqPhone.length >= 10 && ordPhone.length >= 10 && enqPhone === ordPhone) {
    return true;
  }

  const hasConflict =
    (enqCid && ordCid && enqCid !== ordCid) ||
    (enqEmail && ordEmail && enqEmail !== ordEmail) ||
    (enqPhone.length >= 10 && ordPhone.length >= 10 && enqPhone !== ordPhone);
  if (!hasConflict && !enqEmail && enqPhone.length < 10) {
    const enqName = String(enq.customerName || "").trim().toLowerCase();
    const ordName = String(ord.customerName || "").trim().toLowerCase();
    if (enqName && ordName && enqName === ordName) {
      return true;
    }
  }

  return false;
}

const isPrelovedOrderMode = (rawMode, oid) => {
  const m = String(rawMode || "").trim().toLowerCase();
  if (
    m === "preloved" ||
    m === "re-sell" ||
    m === "resell" ||
    m === "buy preloved"
  ) {
    return true;
  }
  if (!m && String(oid || "").toUpperCase().startsWith("HOK-PRL-")) {
    return true;
  }
  return false;
};

/**
 * Validates that requested pieces are actually available for the enquiry's
 * selected mode and dates (blocks Already Booked, Dry-Cleaning Buffer, Sold Out, Out of Stock,
 * manual blockedDates, and conflicting On-Hold enquiries).
 */
async function validatePiecesAvailabilityForEnquiry({
  pieces,
  interestedIn,
  eventDate,
  holdStartDate,
  holdEndDate,
  customerContext,
  excludeEnquiryId = "",
  allProducts = null,
}) {
  if (!Array.isArray(pieces) || pieces.length === 0) {
    return { valid: true };
  }

  const productsList = Array.isArray(allProducts)
    ? allProducts
    : await Product.find({}).catch(() => []);
  const activeOrders = await Order.find({}).catch(() => []);

  const evDate = normalizeYMD(eventDate);
  let hStart = normalizeYMD(holdStartDate);
  let hEnd = normalizeYMD(holdEndDate);
  if (interestedIn === "Rent") {
    if (!hStart && evDate) hStart = addDaysYMD(evDate, -1);
    if (!hEnd && evDate) hEnd = addDaysYMD(evDate, 1);
    if (hStart && !hEnd) hEnd = hStart;
    if (hStart && hEnd && hEnd < hStart) {
      return {
        valid: false,
        message: "Hold end date cannot be earlier than hold start date.",
      };
    }
  }

  for (const pieceRef of pieces) {
    const pid = String(pieceRef?.productId || "");
    const pName = String(pieceRef?.productName || "Selected piece");
    const prodDoc =
      productsList.find(
        (p) =>
          (pid &&
            (String(p.productId) === pid ||
              String(p._id) === pid ||
              String(p.id) === pid)) ||
          (pName && String(p.name || p.title) === pName),
      ) || null;

    const displayTitle = prodDoc?.name || pName;
    const prodStatus = String(prodDoc?.status || "").toLowerCase();
    const prodAvail = String(prodDoc?.availability || "").toLowerCase();

    if (interestedIn === "Buy preloved" || interestedIn === "Buy new") {
      if (prodStatus === "out of stock" || prodAvail === "out of stock") {
        return {
          valid: false,
          message: `${displayTitle} is currently Out of Stock and cannot be added.`,
        };
      }

      if (interestedIn === "Buy preloved") {
        if (prodStatus === "sold") {
          return {
            valid: false,
            message: `${displayTitle} is already Sold Out and cannot be added for another customer.`,
          };
        }

        const soldOrd = activeOrders.find((ord) => {
          const st = String(ord.status || "").toLowerCase();
          if (st === "cancelled" || st === "rejected") return false;
          if (doesOrderBelongToEnquiryCustomer(ord, customerContext)) {
            return false;
          }
          const oid = ord.orderId || ord._id;
          const items = Array.isArray(ord.items) ? ord.items : [];
          if (items.length > 0) {
            return items.some((it) => {
              if (!isPrelovedOrderMode(it.mode || ord.mode, oid)) return false;
              const matchId = pid && it.productId && String(it.productId) === pid;
              const matchName =
                displayTitle &&
                it.productName &&
                String(it.productName) === displayTitle;
              return Boolean(matchId || matchName);
            });
          }
          if (!isPrelovedOrderMode(ord.mode, oid)) return false;
          const matchId = pid && ord.productId && String(ord.productId) === pid;
          const matchName =
            displayTitle &&
            ord.productName &&
            String(ord.productName) === displayTitle;
          return Boolean(matchId || matchName);
        });

        if (soldOrd) {
          return {
            valid: false,
            message: `${displayTitle} is already Sold Out (${
              soldOrd.orderId || soldOrd._id
            }) and cannot be added for another customer.`,
          };
        }
      }
      continue;
    }

    if (interestedIn === "Rent" && hStart && hEnd) {
      const cleanBuf = Number(
        prodDoc?.postRentalBufferDays ?? prodDoc?.cleaningBufferDays ?? 3,
      );

      for (const ord of activeOrders) {
        const st = String(ord.status || "").toLowerCase();
        if (st === "cancelled" || st === "rejected") continue;
        if (doesOrderBelongToEnquiryCustomer(ord, customerContext)) continue;

        const ordItems =
          Array.isArray(ord.items) && ord.items.length > 0 ? ord.items : [ord];

        for (const it of ordItems) {
          const itPid = String(it.productId || ord.productId || "");
          const itName = String(it.productName || ord.productName || "");
          const samePiece =
            (pid && itPid && pid === itPid) ||
            (displayTitle && itName && displayTitle === itName);
          if (!samePiece) continue;

          const rStart = normalizeYMD(
            it.rentalStartDate || ord.rentalStartDate || ord.startDate,
          );
          const rEnd = normalizeYMD(
            it.rentalEndDate || ord.rentalEndDate || ord.endDate,
          );
          if (!rStart || !rEnd) continue;

          if (hStart <= rEnd && hEnd >= rStart) {
            const freeAfterClean = addDaysYMD(rEnd, cleanBuf + 1);
            return {
              valid: false,
              message: `${displayTitle} is already booked for ${rStart} to ${rEnd} (Order ${
                ord.orderId || ord._id
              }). Next available date after dry cleaning: ${freeAfterClean}.`,
            };
          }

          const cleanEnd = addDaysYMD(rEnd, cleanBuf);
          if (hStart > rEnd && hStart <= cleanEnd) {
            const freeAfterClean = addDaysYMD(cleanEnd, 1);
            return {
              valid: false,
              message: `${displayTitle} is in dry-cleaning turnaround until ${cleanEnd} after Order ${
                ord.orderId || ord._id
              }. Available from ${freeAfterClean} onwards.`,
            };
          }
        }
      }

      // Check active On-Hold enquiries from other customers on overlapping dates
      const onHoldEnquiries = await Enquiry.find({ status: "On Hold" }).catch(
        () => [],
      );
      for (const otherEnq of onHoldEnquiries) {
        if (
          excludeEnquiryId &&
          (String(otherEnq.enquiryId) === String(excludeEnquiryId) ||
            String(otherEnq._id) === String(excludeEnquiryId))
        ) {
          continue;
        }
        const sameCust =
          customerContext?.customerName &&
          otherEnq.customerName &&
          String(otherEnq.customerName).trim().toLowerCase() ===
            String(customerContext.customerName).trim().toLowerCase();
        if (sameCust) continue;

        const oStart = normalizeYMD(
          otherEnq.holdStartDate || otherEnq.eventDate,
        );
        const oEnd = normalizeYMD(
          otherEnq.holdEndDate || otherEnq.holdStartDate || otherEnq.eventDate,
        );
        if (!oStart || !oEnd) continue;

        const hasSamePiece = (
          Array.isArray(otherEnq.pieces) ? otherEnq.pieces : []
        ).some(
          (op) =>
            (pid && op.productId && String(op.productId) === pid) ||
            (displayTitle &&
              op.productName &&
              String(op.productName) === displayTitle),
        );
        if (hasSamePiece && hStart <= oEnd && hEnd >= oStart) {
          return {
            valid: false,
            message: `${displayTitle} is currently On Hold for another enquiry (${otherEnq.enquiryId}) from ${oStart} to ${oEnd}.`,
          };
        }
      }
    }
  }

  return { valid: true };
}

export const getEnquiries = async (req, res) => {
  try {
    await ensureEnquiriesTable();
    const [list, allProducts, allOrders] = await Promise.all([
      Enquiry.find({}).sort({ createdAt: -1 }),
      Product.find({}).catch(() => []),
      Order.find({}).catch(() => []),
    ]);

    const enriched = [];
    for (const doc of list) {
      // Backfill Customer record for any previously logged enquiry missing customerId
      if (!doc.customerId && doc.customerName) {
        try {
          const { customer } = await ensureCustomerForEnquiry({
            customerId: "",
            customerName: doc.customerName,
            customerEmail: doc.customerEmail,
            customerPhone: doc.customerPhone,
            customerCity: doc.customerCity,
            channel: doc.channel,
            enquiryId: doc.enquiryId,
            initialMessage: doc.whatSheAsked,
          });
          if (customer) {
            doc.customerId = customer.customerId || String(customer._id);
            await doc.save().catch(() => {});
          }
        } catch (e) {}
      }

      // Clean up any mistakenly linked order belonging to a different customer,
      // and heal status = "Converted" whenever a valid linkedOrderId / linkedOfferId exists
      if (doc.linkedOrderId) {
        const linkedOrd = allOrders.find(
          (o) =>
            String(o.orderId || o._id) === String(doc.linkedOrderId),
        );
        const ordSt = String(linkedOrd?.status || "").toLowerCase();
        if (linkedOrd && !doesOrderBelongToEnquiryCustomer(linkedOrd, doc)) {
          doc.linkedOrderId = "";
          if (doc.status === "Converted" && !doc.linkedOfferId) {
            doc.status = "In Conversation";
          }
          await doc.save().catch(() => {});
        } else if (
          (!linkedOrd || (ordSt !== "cancelled" && ordSt !== "rejected")) &&
          doc.status !== "Converted"
        ) {
          doc.status = "Converted";
          await doc.save().catch(() => {});
        }
      } else if (doc.linkedOfferId && doc.status !== "Converted") {
        doc.status = "Converted";
        await doc.save().catch(() => {});
      }

      const obj =
        typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
      if (Array.isArray(obj.pieces) && obj.pieces.length > 0) {
        const nextPieces = [];
        for (const p of obj.pieces) {
          const rp = await resolvePieceFromProduct(p, allProducts);
          if (rp) nextPieces.push(rp);
        }
        obj.pieces = nextPieces;
      }
      enriched.push(obj);
    }

    return res.json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch enquiries",
    });
  }
};

export const createEnquiry = async (req, res) => {
  try {
    await ensureEnquiriesTable();
    const body = req.body || {};
    const customerName = String(body.customerName || "").trim();
    if (!customerName) {
      return res
        .status(400)
        .json({ success: false, message: "Customer name is required." });
    }

    const enquiryId = await generateEnquiryId();
    const allProducts = await Product.find({}).catch(() => []);

    const piecesInput = Array.isArray(body.pieces) ? [...body.pieces] : [];
    if (body.pieceId) piecesInput.push(body.pieceId);
    if (body.alsoPieceId && body.alsoPieceId !== body.pieceId) {
      piecesInput.push(body.alsoPieceId);
    }

    const resolvedPieces = [];
    const seenIds = new Set();
    for (const item of piecesInput) {
      const rp = await resolvePieceFromProduct(item, allProducts);
      if (rp) {
        const key = rp.productId || rp.productName;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          resolvedPieces.push(rp);
        }
      }
    }

    const cleanEmail = String(body.customerEmail || body.email || "")
      .trim()
      .toLowerCase();
    const cleanPhone = String(body.customerPhone || body.phone || "").trim();
    const cleanCity = String(body.customerCity || body.city || "").trim();
    const channel = body.channel || body.source || "WhatsApp";
    const assignedTo = body.assignedTo || "Soumya";
    const whatSheAsked = String(body.whatSheAsked || body.note || "").trim();
    const interestedIn = body.interestedIn || "Rent";

    const evDate = normalizeYMD(body.eventDate);
    let hStart = normalizeYMD(body.holdStartDate);
    let hEnd = normalizeYMD(body.holdEndDate);
    if (interestedIn === "Rent" && evDate && !hStart && !hEnd) {
      hStart = addDaysYMD(evDate, -1);
      hEnd = addDaysYMD(evDate, 1);
    }

    // Strict availability & clash validation before saving to DB
    const availabilityCheck = await validatePiecesAvailabilityForEnquiry({
      pieces: resolvedPieces,
      interestedIn,
      eventDate: evDate,
      holdStartDate: hStart,
      holdEndDate: hEnd,
      customerContext: {
        customerId: body.customerId || "",
        customerName,
        customerEmail: cleanEmail,
        customerPhone: cleanPhone,
      },
      allProducts,
    });
    if (!availabilityCheck.valid) {
      return res.status(409).json({
        success: false,
        message: availabilityCheck.message,
      });
    }

    // Auto-create Customer in DB if new, or attach existing Customer
    const { customer, wasExisting } = await ensureCustomerForEnquiry({
      customerId: body.customerId || "",
      customerName,
      customerEmail: cleanEmail,
      customerPhone: cleanPhone,
      customerCity: cleanCity,
      channel,
      enquiryId,
      initialMessage: whatSheAsked,
    });

    const resolvedCustomerId = customer
      ? customer.customerId || String(customer._id)
      : body.customerId || "";

    const initialLogs = [];
    if (whatSheAsked) {
      initialLogs.push({
        message: whatSheAsked,
        author: assignedTo,
        createdAt: new Date(),
      });
    } else {
      initialLogs.push({
        message: `Enquiry logged via ${channel}${
          resolvedPieces.length > 0
            ? ` about ${resolvedPieces.map((p) => p.productName).join(" & ")}`
            : ""
        }.`,
        author: assignedTo,
        createdAt: new Date(),
      });
    }

    const created = await Enquiry.create({
      enquiryId,
      customerId: resolvedCustomerId,
      isOnFile: Boolean(body.customerId || wasExisting),
      customerName: customer?.name || customerName,
      customerEmail:
        cleanEmail ||
        (customer?.email && !customer.email.includes("@houseofkaira.com")
          ? customer.email
          : ""),
      customerPhone: cleanPhone || customer?.phone || "",
      customerCity: cleanCity || customer?.location || "",
      channel,
      interestedIn,
      assignedTo,
      pieces: resolvedPieces,
      eventDate: evDate,
      holdStartDate: hStart,
      holdEndDate: hEnd,
      followUpDate: normalizeYMD(body.followUpDate),
      whatSheAsked,
      status: body.status || "New",
      linkedOrderId: body.linkedOrderId || "",
      conversationLog: initialLogs,
    });

    return res.status(201).json({
      success: true,
      data: created,
      customer: formatCustomerPayload(customer),
      isNewCustomer: Boolean(customer && !wasExisting),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to log enquiry",
    });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    await ensureEnquiriesTable();
    const doc = await findEnquiryDoc(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    }

    const body = req.body || {};
    const prevStatus = doc.status;
    const prevAssigned = doc.assignedTo;
    const prevInterest = doc.interestedIn;
    const prevHoldStart = doc.holdStartDate;
    const prevHoldEnd = doc.holdEndDate;
    const prevEventDate = doc.eventDate;

    const author = body.author || body.updatedBy || doc.assignedTo || "Soumya";
    const logs = Array.isArray(doc.conversationLog)
      ? [...doc.conversationLog]
      : [];

    if (body.interestedIn !== undefined && body.interestedIn !== prevInterest) {
      doc.interestedIn = body.interestedIn;
      logs.push({
        message: `Interested In changed from ${prevInterest} to ${body.interestedIn}.`,
        author,
        createdAt: new Date(),
      });
    }

    if (body.assignedTo !== undefined && body.assignedTo !== prevAssigned) {
      doc.assignedTo = body.assignedTo;
      logs.push({
        message: `Assigned to ${body.assignedTo}.`,
        author,
        createdAt: new Date(),
      });
    }

    const datesTouched =
      body.eventDate !== undefined ||
      body.holdStartDate !== undefined ||
      body.holdEndDate !== undefined;
    if (body.eventDate !== undefined) {
      doc.eventDate = normalizeYMD(body.eventDate);
    }
    if (body.holdStartDate !== undefined) {
      doc.holdStartDate = normalizeYMD(body.holdStartDate);
    }
    if (body.holdEndDate !== undefined) {
      doc.holdEndDate = normalizeYMD(body.holdEndDate);
    }
    if (
      datesTouched &&
      (doc.eventDate !== prevEventDate ||
        doc.holdStartDate !== prevHoldStart ||
        doc.holdEndDate !== prevHoldEnd) &&
      !body.note
    ) {
      const desc =
        doc.holdStartDate && doc.holdEndDate
          ? `${doc.holdStartDate} to ${doc.holdEndDate}`
          : doc.eventDate || "cleared";
      logs.push({
        message: `Dates updated: ${desc}.`,
        author,
        createdAt: new Date(),
      });
    }

    if (body.followUpDate !== undefined) {
      doc.followUpDate = normalizeYMD(body.followUpDate);
    }
    if (body.customerName !== undefined) doc.customerName = body.customerName;
    if (body.customerEmail !== undefined) doc.customerEmail = body.customerEmail;
    if (body.customerPhone !== undefined) doc.customerPhone = body.customerPhone;
    if (body.customerCity !== undefined) doc.customerCity = body.customerCity;
    if (body.channel !== undefined) doc.channel = body.channel;

    if (Array.isArray(body.pieces)) {
      const allProducts = await Product.find({}).catch(() => []);
      const nextPieces = [];
      const seen = new Set();
      for (const p of body.pieces) {
        const rp = await resolvePieceFromProduct(p, allProducts);
        if (rp) {
          const k = rp.productId || rp.productName;
          if (!seen.has(k)) {
            seen.add(k);
            nextPieces.push(rp);
          }
        }
      }
      doc.pieces = nextPieces;
    }

    if (body.addPieceId) {
      const rp = await resolvePieceFromProduct(body.addPieceId);
      if (rp) {
        const current = Array.isArray(doc.pieces) ? [...doc.pieces] : [];
        const exists = current.some(
          (x) =>
            (rp.productId && String(x.productId) === String(rp.productId)) ||
            String(x.productName) === String(rp.productName),
        );
        if (!exists) {
          current.push(rp);
          doc.pieces = current;
          logs.push({
            message: `Added piece to enquiry: ${rp.productName}.`,
            author,
            createdAt: new Date(),
          });
        }
      }
    }

    if (body.removePieceKey) {
      const key = String(body.removePieceKey);
      const existingList = Array.isArray(doc.pieces) ? doc.pieces : [];
      const removed = existingList.find(
        (x) => String(x.productId || x.productName) === key,
      );
      doc.pieces = existingList.filter(
        (x) => String(x.productId || x.productName) !== key,
      );
      if (removed) {
        logs.push({
          message: `Removed piece from enquiry: ${removed.productName}.`,
          author,
          createdAt: new Date(),
        });
      }
    }

    if (body.linkedOrderId !== undefined) {
      const nextLinkedId = String(body.linkedOrderId || "").trim();
      const prevLinkedId = String(doc.linkedOrderId || "").trim();

      if (!nextLinkedId) {
        doc.linkedOrderId = "";
        if (doc.status === "Converted" && !doc.linkedOfferId) {
          doc.status = "In Conversation";
        }
        if (prevLinkedId) {
          logs.push({
            message: `Unlinked order ${prevLinkedId}.`,
            author,
            createdAt: new Date(),
          });
        }
      } else {
        const linkedOrd = await Order.findOne({
          $or: [{ orderId: nextLinkedId }, { _id: nextLinkedId }],
        }).catch(() => null);

        if (!linkedOrd) {
          return res.status(404).json({
            success: false,
            message: `Order ${nextLinkedId} not found.`,
          });
        }

        const ordStatus = String(linkedOrd.status || "").toLowerCase();
        if (ordStatus === "cancelled" || ordStatus === "rejected") {
          return res.status(400).json({
            success: false,
            message: `Order ${nextLinkedId} is ${linkedOrd.status} and cannot be linked.`,
          });
        }

        if (!doesOrderBelongToEnquiryCustomer(linkedOrd, doc)) {
          return res.status(400).json({
            success: false,
            message: `Order ${nextLinkedId} belongs to another customer (${
              linkedOrd.customerName || "Unknown"
            }). Only orders placed by ${doc.customerName} can be linked.`,
          });
        }

        doc.linkedOrderId = linkedOrd.orderId || nextLinkedId;
        doc.status = "Converted";
        doc.isOnFile = true;
        if (!doc.firstReplyAt) doc.firstReplyAt = new Date();
        if (linkedOrd.customerId && !doc.customerId) {
          doc.customerId = linkedOrd.customerId;
        }
        if (prevLinkedId !== doc.linkedOrderId) {
          logs.push({
            message: `Linked to customer's website order ${doc.linkedOrderId}.`,
            author,
            createdAt: new Date(),
          });
        }
      }
    }

    if (body.status !== undefined && body.status !== prevStatus) {
      if (
        (doc.linkedOrderId || doc.linkedOfferId) &&
        body.status !== "Converted"
      ) {
        return res.status(400).json({
          success: false,
          message: `This enquiry is already converted (${
            doc.linkedOrderId || doc.linkedOfferId
          }). Unlink the order first if you want to mark it ${body.status}.`,
        });
      }
      doc.status = body.status;
      if (prevStatus === "New" && body.status !== "New" && !doc.firstReplyAt) {
        doc.firstReplyAt = new Date();
      }
      if (!body.linkedOrderId && !body.note) {
        logs.push({
          message: `Status changed from ${prevStatus} to ${body.status}.`,
          author,
          createdAt: new Date(),
        });
      }
    }

    if (body.note && String(body.note).trim()) {
      logs.push({
        message: String(body.note).trim(),
        author,
        createdAt: new Date(),
      });
      if (!doc.firstReplyAt) {
        doc.firstReplyAt = new Date();
      }
      if (doc.status === "New" && body.status === undefined) {
        doc.status = "In Conversation";
      }
    }

    // Validate piece/date availability whenever pieces, dates, mode, or On Hold status is updated
    const shouldValidateClash =
      datesTouched ||
      Boolean(body.addPieceId) ||
      Array.isArray(body.pieces) ||
      body.interestedIn !== undefined ||
      body.status === "On Hold";

    if (shouldValidateClash && doc.status !== "Closed") {
      const checkRes = await validatePiecesAvailabilityForEnquiry({
        pieces: Array.isArray(doc.pieces) ? doc.pieces : [],
        interestedIn: doc.interestedIn,
        eventDate: doc.eventDate,
        holdStartDate: doc.holdStartDate,
        holdEndDate: doc.holdEndDate,
        customerContext: {
          customerId: doc.customerId || "",
          customerName: doc.customerName,
          customerEmail: doc.customerEmail,
          customerPhone: doc.customerPhone,
        },
        excludeEnquiryId: doc.enquiryId,
      });
      if (!checkRes.valid) {
        return res.status(409).json({
          success: false,
          message: checkRes.message,
        });
      }
    }

    doc.conversationLog = logs;
    await doc.save();

    return res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update enquiry",
    });
  }
};

export const convertEnquiryToBooking = async (req, res) => {
  try {
    await ensureEnquiriesTable();
    const doc = await findEnquiryDoc(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    }

    const body = req.body || {};
    const author = body.author || doc.assignedTo || "Soumya";

    const rawPieces =
      Array.isArray(doc.pieces) && doc.pieces.length > 0
        ? doc.pieces
        : body.piece
          ? [body.piece]
          : body.productId
            ? [{ productId: body.productId }]
            : [];

    if (rawPieces.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please add at least one piece under 'Pieces Asked About' before converting.",
      });
    }

    // Ensure Customer exists in DB (auto-creates if not on file yet)
    const { customer } = await ensureCustomerForEnquiry({
      customerId: doc.customerId || "",
      customerName: doc.customerName,
      customerEmail: doc.customerEmail,
      customerPhone: doc.customerPhone,
      customerCity: doc.customerCity,
      channel: doc.channel,
      enquiryId: doc.enquiryId,
      initialMessage: doc.whatSheAsked,
    });

    const allProducts = await Product.find({}).catch(() => []);
    const findProdDoc = (pieceRef) =>
      allProducts.find(
        (p) =>
          (pieceRef?.productId &&
            (String(p.productId) === String(pieceRef.productId) ||
              String(p._id) === String(pieceRef.productId) ||
              String(p.id) === String(pieceRef.productId))) ||
          (pieceRef?.productName &&
            String(p.name || p.title) === String(pieceRef.productName)),
      ) || null;

    const firstPiece = rawPieces[0];
    const firstProd = findProdDoc(firstPiece);

    // ---------------------------------------------------------
    // Branch 1: Convert to Offer ("Buy preloved" -> Offer)
    // ---------------------------------------------------------
    if (body.target === "offer") {
      if (doc.linkedOfferId) {
        const existingOffer = await Offer.findOne({
          offerId: doc.linkedOfferId,
        }).catch(() => null);
        if (existingOffer) {
          return res.json({
            success: true,
            data: doc,
            offer: existingOffer,
            customer: formatCustomerPayload(customer),
          });
        }
      }

      const offerId = await generateNextOfferId();
      const offerPieces = rawPieces.map((piece) => {
        const pDoc = findProdDoc(piece);
        return {
          productId:
            pDoc?.productId || String(pDoc?._id || piece?.productId || ""),
          productName: pDoc?.name || piece?.productName || "Preloved Piece",
          designer: pDoc?.designer || piece?.designer || "House of Kaira",
          image:
            (Array.isArray(pDoc?.images) && pDoc.images[0]) ||
            piece?.image ||
            "",
          listingPrice: Number(
            pDoc?.listingPrice ||
              pDoc?.price ||
              piece?.listingPrice ||
              piece?.rentalPrice ||
              0,
          ),
          rentalPrice: Number(pDoc?.rentalPrice || piece?.rentalPrice || 0),
        };
      });
      const listedAmt =
        offerPieces.reduce((sum, p) => sum + Number(p.listingPrice || 0), 0) ||
        Number(
          firstProd?.listingPrice ||
            firstProd?.price ||
            firstPiece?.listingPrice ||
            0,
        );
      const offeredAmt = Number(body.offeredAmount || listedAmt || 0);
      const discount =
        listedAmt > offeredAmt && offeredAmt > 0 ? listedAmt - offeredAmt : 0;

      const createdOffer = await Offer.create({
        offerId,
        enquiryId: doc.enquiryId,
        productId:
          firstProd?.productId ||
          String(firstProd?._id || firstPiece?.productId || ""),
        productName:
          firstProd?.name || firstPiece?.productName || "Preloved Piece",
        productImage:
          (Array.isArray(firstProd?.images) && firstProd.images[0]) ||
          firstPiece?.image ||
          "",
        designer: firstProd?.designer || firstPiece?.designer || "",
        pieces: offerPieces,
        quantity: Math.max(1, offerPieces.length),
        category: firstProd?.category || "",
        customerId: customer?.customerId || doc.customerId || "",
        customerName: doc.customerName,
        customerEmail: doc.customerEmail || customer?.email || "",
        customerPhone: doc.customerPhone || customer?.phone || "",
        customerCity: doc.customerCity || customer?.location || "",
        address: doc.customerCity || customer?.location || "",
        mode: "Preloved",
        channel: doc.channel || "WhatsApp",
        originalAmount: listedAmt,
        offeredAmount: offeredAmt,
        discount,
        finalAmount: offeredAmt || listedAmt,
        status: "Pending",
        negotiationStatus: "In Progress",
        assignedTo: doc.assignedTo || author,
        notes: [
          {
            message: `Converted from Enquiry ${doc.enquiryId}${
              doc.whatSheAsked ? `: ${doc.whatSheAsked}` : ""
            }`,
            createdBy: author,
            createdAt: new Date(),
          },
        ],
        timeline: [
          {
            action: "Converted from Enquiry",
            remarks: `Created from Enquiry ${doc.enquiryId} at ₹${(
              offeredAmt || listedAmt
            ).toLocaleString("en-IN")}.`,
            user: author,
            createdAt: new Date(),
          },
        ],
      });

      doc.linkedOfferId = createdOffer.offerId;
      doc.customerId = customer?.customerId || doc.customerId;
      doc.isOnFile = true;
      doc.status = "Converted";
      if (!doc.firstReplyAt) doc.firstReplyAt = new Date();
      doc.conversationLog = [
        ...(Array.isArray(doc.conversationLog) ? doc.conversationLog : []),
        {
          message: `Converted to Offer ${createdOffer.offerId} (₹${(
            offeredAmt || listedAmt
          ).toLocaleString("en-IN")}).`,
          author,
          createdAt: new Date(),
        },
      ];
      await doc.save();

      return res.json({
        success: true,
        data: doc,
        offer: createdOffer,
        customer: formatCustomerPayload(customer),
      });
    }

    // ---------------------------------------------------------
    // Branch 2: Convert directly to Confirmed Booking / Order
    // ---------------------------------------------------------
    if (doc.linkedOrderId) {
      const existingOrder = await Order.findOne({
        $or: [{ orderId: doc.linkedOrderId }, { _id: doc.linkedOrderId }],
      }).catch(() => null);
      if (existingOrder) {
        return res.json({
          success: true,
          data: doc,
          order: existingOrder,
          customer: formatCustomerPayload(customer),
          alreadyConverted: true,
        });
      }
    }

    const mode =
      doc.interestedIn === "Buy preloved"
        ? "Preloved"
        : doc.interestedIn === "Buy new"
          ? "Buy"
          : "Rental";

    const evDate = normalizeYMD(doc.eventDate);
    let startDate = normalizeYMD(body.startDate || doc.holdStartDate);
    let endDate = normalizeYMD(body.endDate || doc.holdEndDate);

    if (mode === "Rental") {
      if (!startDate && evDate) {
        startDate = addDaysYMD(evDate, -1);
      }
      if (!endDate && evDate) {
        endDate = addDaysYMD(evDate, 1);
      }
      if (startDate && !endDate) {
        endDate = addDaysYMD(startDate, 2);
      }
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message:
            "Please set Event Date or Dates to Hold before converting to a rental booking.",
        });
      }
    }

    // Live conflict check across all active orders, cleaning buffers, Sold Out & On Hold enquiries
    const convertCheck = await validatePiecesAvailabilityForEnquiry({
      pieces: rawPieces,
      interestedIn: doc.interestedIn,
      eventDate: evDate,
      holdStartDate: startDate,
      holdEndDate: endDate,
      customerContext: {
        customerId: customer?.customerId || doc.customerId || "",
        customerName: customer?.name || doc.customerName,
        customerEmail: doc.customerEmail || customer?.email || "",
        customerPhone: doc.customerPhone || customer?.phone || "",
      },
      excludeEnquiryId: doc.enquiryId,
      allProducts,
    });
    if (!convertCheck.valid) {
      return res.status(409).json({
        success: false,
        message: convertCheck.message,
      });
    }

    // Build full items array for 1 or multiple enquiry pieces
    const rentalDays =
      mode === "Rental" && startDate && endDate
        ? Math.max(
            1,
            Math.round(
              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                86400000,
            ) + 1,
          )
        : 0;

    let totalAmount = 0;
    let totalDeposit = 0;
    let totalListerPayout = 0;
    const orderItems = [];
    const touchedProducts = [];

    for (const pieceRef of rawPieces) {
      const prodDoc = findProdDoc(pieceRef);
      const pid =
        prodDoc?.productId ||
        String(prodDoc?._id || pieceRef?.productId || "");
      const pName = prodDoc?.name || pieceRef?.productName || "Designer Piece";
      const pDesigner =
        prodDoc?.designer || pieceRef?.designer || "House of Kaira";
      const pImg =
        (Array.isArray(prodDoc?.images) && prodDoc.images[0]) ||
        pieceRef?.image ||
        "";
      const listerId = prodDoc?.listerId || "";
      const listerName = prodDoc?.listerName || "";
      const splitPct = Number(
        mode === "Rental"
          ? prodDoc?.payoutPercentage ?? prodDoc?.commissionRate ?? 70
          : prodDoc?.resalePayoutPercentage ?? prodDoc?.payoutPercentage ?? 75,
      );

      let lineAmt = 0;
      let lineDep = 0;
      if (mode === "Rental") {
        const baseRent = Number(
          prodDoc?.rentalPrice || pieceRef?.rentalPrice || 0,
        );
        const minDays = Math.max(
          1,
          Number(prodDoc?.minimumDurationDays || pieceRef?.minimumDurationDays || 3),
        );
        const perDay = Number(
          prodDoc?.perDayRate || pieceRef?.perDayRate || 0,
        );
        if (rentalDays <= minDays && baseRent > 0) {
          lineAmt = baseRent;
        } else if (baseRent > 0 && perDay > 0 && rentalDays > minDays) {
          lineAmt = baseRent + (rentalDays - minDays) * perDay;
        } else if (perDay > 0) {
          lineAmt = rentalDays * perDay;
        } else {
          lineAmt = baseRent;
        }
        lineDep = Number(
          prodDoc?.securityDeposit || pieceRef?.securityDeposit || 0,
        );
      } else {
        lineAmt = Number(
          prodDoc?.listingPrice || prodDoc?.price || pieceRef?.listingPrice || 0,
        );
      }

      if (rawPieces.length === 1 && Number(body.amount || 0) > 0) {
        lineAmt = Number(body.amount);
      }

      const lineListerShare = listerId
        ? Math.round((lineAmt * splitPct) / 100)
        : 0;

      totalAmount += lineAmt;
      totalDeposit += lineDep;
      totalListerPayout += lineListerShare;

      orderItems.push({
        productId: pid,
        productName: pName,
        designer: pDesigner,
        image: pImg,
        listerId,
        listerName,
        listerSplitPercent: splitPct,
        listerPayout: lineListerShare,
        mode,
        size: (Array.isArray(prodDoc?.sizes) && prodDoc.sizes[0]) || "M",
        quantity: 1,
        rentalStartDate: mode === "Rental" ? startDate : "",
        rentalEndDate: mode === "Rental" ? endDate : "",
        dispatchDate:
          mode === "Rental" && startDate ? addDaysYMD(startDate, -2) : "",
        returnDueDate: mode === "Rental" ? endDate : "",
        amount: lineAmt,
        deposit: lineDep,
        status: "Confirmed",
      });

      if (prodDoc) {
        touchedProducts.push({ prodDoc, lineAmt });
      }
    }

    const orderId = await nextOrderId(mode);
    const primaryItem = orderItems[0];
    const summaryProductName =
      orderItems.length > 1
        ? `${primaryItem.productName} (+${orderItems.length - 1} more)`
        : primaryItem.productName;
    const dispatchDate =
      mode === "Rental" && startDate
        ? addDaysYMD(startDate, -2)
        : new Date().toISOString().slice(0, 10);

    const createdOrder = await Order.create({
      orderId,
      orderDate: new Date().toISOString(),
      customerId: customer?.customerId || doc.customerId || "",
      customerName: customer?.name || doc.customerName,
      customerEmail:
        doc.customerEmail ||
        (customer?.email && !customer.email.includes("@houseofkaira.com")
          ? customer.email
          : ""),
      customerPhone: doc.customerPhone || customer?.phone || "",
      customerCity: doc.customerCity || customer?.location || "",
      address: doc.customerCity || customer?.location || "India",
      productId: primaryItem.productId,
      productName: summaryProductName,
      designer: primaryItem.designer,
      image: primaryItem.image,
      listerId: primaryItem.listerId || "",
      listerName: primaryItem.listerName || "",
      listerSplitPercent: primaryItem.listerSplitPercent,
      listerPayout: totalListerPayout,
      payoutStatus: totalListerPayout > 0 ? "Pending" : "N/A",
      mode,
      status: "Confirmed",
      paymentMethod: "Offline / Enquiry",
      paymentStatus: "Confirmed",
      source: doc.channel || "Enquiry",
      channel: doc.channel || "Enquiry",
      rentalStartDate: mode === "Rental" ? startDate : "",
      rentalEndDate: mode === "Rental" ? endDate : "",
      dispatchDate,
      amount: totalAmount,
      orderValue: totalAmount,
      grandTotal: totalAmount,
      deposit: totalDeposit,
      depositHeld: totalDeposit,
      depositStatus: totalDeposit > 0 ? "Pending" : "None",
      items: orderItems,
      logs: [
        {
          date: new Date().toISOString(),
          message: `Converted directly from Enquiry ${doc.enquiryId} (${doc.channel})`,
          type: "Order",
          user: author,
        },
      ],
    });

    // Sync Product blockedDates & bookingHistory for every piece in the order
    for (const { prodDoc, lineAmt } of touchedProducts) {
      if (mode === "Rental" && startDate && endDate) {
        if (!Array.isArray(prodDoc.blockedDates)) prodDoc.blockedDates = [];
        prodDoc.blockedDates.push({
          from: new Date(startDate),
          to: new Date(endDate),
          reason: `Rented (Order ${createdOrder.orderId})`,
        });
        prodDoc.timesRented = Number(prodDoc.timesRented || 0) + 1;
      } else if (mode === "Preloved") {
        prodDoc.status = "Sold";
        prodDoc.availability = "Out of Stock";
      }
      if (!Array.isArray(prodDoc.bookingHistory)) prodDoc.bookingHistory = [];
      prodDoc.bookingHistory.push({
        orderId: createdOrder.orderId,
        customerName: customer?.name || doc.customerName,
        date:
          mode === "Rental"
            ? `${startDate} to ${endDate}`
            : new Date().toISOString().slice(0, 10),
        amount: lineAmt,
        status: "Confirmed",
      });
      await prodDoc.save().catch(() => {});
    }

    // Update Customer ledger stats (ordersCount, totalSpent, totalRentals, lastOrderDate)
    if (customer) {
      await syncCustomerOrderStats([customer]).catch(() => {});
    }

    doc.linkedOrderId = createdOrder.orderId;
    doc.customerId = customer?.customerId || doc.customerId;
    doc.isOnFile = true;
    doc.status = "Converted";
    if (!doc.firstReplyAt) doc.firstReplyAt = new Date();
    doc.conversationLog = [
      ...(Array.isArray(doc.conversationLog) ? doc.conversationLog : []),
      {
        message: `Converted to ${
          mode === "Rental" ? "booking" : "order"
        } ${createdOrder.orderId} (${orderItems
          .map((it) => it.productName)
          .join(", ")}).`,
        author,
        createdAt: new Date(),
      },
    ];
    await doc.save();

    const plainOrder =
      typeof createdOrder.toObject === "function"
        ? createdOrder.toObject()
        : { ...createdOrder };

    return res.json({
      success: true,
      data: doc,
      order: {
        ...plainOrder,
        id: createdOrder.orderId,
      },
      customer: formatCustomerPayload(customer),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to convert enquiry",
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    await ensureEnquiriesTable();
    const doc = await findEnquiryDoc(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    }
    await Enquiry.deleteOne({ _id: doc._id });
    return res.json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Delete failed" });
  }
};
