import Joi from "joi";

/**
 * ============================================================================
 * HOUSE OF KAIRA — OFFICIAL SECURITY & INPUT VALIDATION GUARD
 * ============================================================================
 * Protects all Storefront (Web) and Admin Portal API endpoints against:
 * 1. Mass Assignment / Arbitrary Unnecessary Data Injection (Strict Whitelisting)
 * 2. Prototype Pollution (__proto__, constructor, prototype)
 * 3. NoSQL / JSONB Operator Injection ($where, $gt, $ne, $regex, $set, etc.)
 * 4. Cross-Site Scripting (XSS) & Malicious Script/HTML Payloads
 * 5. Oversized / Deeply Nested DoS Payloads & Null-Byte Injection
 */

const FORBIDDEN_KEYS = new Set([
  "__proto__",
  "constructor",
  "prototype",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
]);

const DANGEROUS_OPERATORS = new Set([
  "$where",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$ne",
  "$in",
  "$nin",
  "$regex",
  "$options",
  "$or",
  "$and",
  "$not",
  "$nor",
  "$set",
  "$unset",
  "$push",
  "$pull",
  "$pop",
  "$rename",
  "$inc",
  "$mul",
  "$elemMatch",
  "$expr",
  "$function",
  "$accumulator",
]);

const XSS_PATTERNS = [
  /<\s*script\b[^>]*>/i,
  /<\s*\/\s*script\s*>/i,
  /\bjavascript\s*:/i,
  /\bvbscript\s*:/i,
  /\bdata\s*:\s*text\/html/i,
  /\bon(?:error|load|click|mouseover|focus|blur|submit|change|keyup|keydown|toggle|animationstart|transitionend)\s*=/i,
  /<\s*(?:iframe|object|embed|applet|meta|base|form)\b[^>]*>/i,
  /<\s*svg\b[^>]*\bon\w+\s*=/i,
  /\beval\s*\(/i,
  /\bdocument\s*\.\s*cookie\b/i,
];

const MAX_DEPTH = 10;
const MAX_KEYS_PER_OBJECT = 200;
const MAX_ARRAY_LENGTH = 1000;
const MAX_STRING_LENGTH = 100000;

/**
 * Recursively inspects and sanitizes an input value.
 * Throws a descriptive error if malicious content, prototype pollution,
 * operator injection, or structural abuse is detected.
 */
export const inspectAndSanitizeInput = (value, path = "root", depth = 0) => {
  if (depth > MAX_DEPTH) {
    throw new Error(`Security Validation Error: Payload nesting depth exceeds maximum allowed limit at "${path}".`);
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    if (value.length > MAX_STRING_LENGTH) {
      throw new Error(`Security Validation Error: String length at "${path}" exceeds maximum allowed limit.`);
    }
    // Strip null bytes
    const cleaned = value.replace(/\0/g, "");
    for (const pattern of XSS_PATTERNS) {
      if (pattern.test(cleaned)) {
        throw new Error(`Security Validation Error: Malicious or unsafe script content detected at "${path}".`);
      }
    }
    return cleaned;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Security Validation Error: Invalid numeric value at "${path}".`);
    }
    return value;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_LENGTH) {
      throw new Error(`Security Validation Error: Array length at "${path}" exceeds maximum allowed limit (${MAX_ARRAY_LENGTH}).`);
    }
    return value.map((item, idx) => inspectAndSanitizeInput(item, `${path}[${idx}]`, depth + 1));
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length > MAX_KEYS_PER_OBJECT) {
      throw new Error(`Security Validation Error: Object at "${path}" contains too many fields (${keys.length} > ${MAX_KEYS_PER_OBJECT}).`);
    }

    const sanitizedObj = {};
    for (const key of keys) {
      const trimmedKey = key.trim();
      if (trimmedKey === "_data" || trimmedKey === "_model" || trimmedKey === "_isNew") {
        continue;
      }
      if (FORBIDDEN_KEYS.has(trimmedKey) || FORBIDDEN_KEYS.has(key)) {
        throw new Error(`Security Validation Error: Forbidden prototype key "${key}" detected at "${path}".`);
      }
      if (trimmedKey.startsWith("$") || DANGEROUS_OPERATORS.has(trimmedKey)) {
        throw new Error(`Security Validation Error: Query operator injection "${key}" is not permitted in request payload at "${path}".`);
      }
      if (trimmedKey.includes("\0")) {
        throw new Error(`Security Validation Error: Invalid field name at "${path}".`);
      }
      sanitizedObj[key] = inspectAndSanitizeInput(value[key], `${path}.${key}`, depth + 1);
    }
    return sanitizedObj;
  }

  return value;
};

/**
 * ============================================================================
 * OFFICIAL ROUTE WHITELIST SCHEMAS (Storefront Web + Admin Portal)
 * ============================================================================
 * Every write endpoint (POST / PUT / PATCH) has a strict allowlist of fields.
 * Any extra / unnecessary fields injected by an attacker are stripped out
 * before reaching the controller or database!
 */

const ORDER_ITEM_ALLOWED_KEYS = [
  "id",
  "_id",
  "cartItemId",
  "active",
  "source",
  "productId",
  "productName",
  "title",
  "name",
  "designer",
  "listerId",
  "lister_id",
  "listerName",
  "lister_name",
  "mode",
  "type",
  "size",
  "color",
  "quantity",
  "price",
  "totalPrice",
  "rentalPrice",
  "amount",
  "deposit",
  "securityDeposit",
  "gst",
  "cleaningFee",
  "rentalStartDate",
  "rentalEndDate",
  "startDate",
  "endDate",
  "dispatchDate",
  "returnDueDate",
  "image",
  "images",
  "photos",
  "status",
  "rentalDates",
  "booking",
  "product",
  "preDispatch",
  "dispatch",
  "returnCondition",
  "depositDecision",
];

const ORDER_ALLOWED_KEYS = [
  "orderId",
  "customerId",
  "customerName",
  "customerEmail",
  "customerPhone",
  "whatsappNumber",
  "customerCity",
  "city",
  "customerState",
  "gstin",
  "address",
  "items",
  "mode",
  "paymentMethod",
  "paymentStatus",
  "paymentId",
  "razorpayOrderId",
  "status",
  "orderValue",
  "priceBeforePromo",
  "offerId",
  "promoCode",
  "promoDiscount",
  "discount",
  "deposit",
  "depositHeld",
  "depositStatus",
  "grandTotal",
  "totalAmount",
  "amount",
  "gst",
  "cleaningFee",
  "listerPayout",
  "listerSplitPercent",
  "payoutStatus",
  "productId",
  "productName",
  "designer",
  "image",
  "listerId",
  "listerName",
  "rentalStartDate",
  "rentalEndDate",
  "startDate",
  "endDate",
  "dispatchDate",
  "invoiceNo",
  "invoiceDate",
  "internalNotes",
  "createdBy",
  "totals",
  "activePromo",
];

const PRODUCT_ALLOWED_KEYS = [
  "productId",
  "sku",
  "name",
  "title",
  "designer",
  "subtitle",
  "description",
  "story",
  "gender",
  "category",
  "occasion",
  "material",
  "color",
  "colors",
  "craft",
  "technique",
  "embellishments",
  "threadYarnDetail",
  "threadWork",
  "setIncludes",
  "origin",
  "sizes",
  "sizeGuide",
  "measurements",
  "measurementsCm",
  "bestSuitedForHeight",
  "weight",
  "listingModes",
  "availability",
  "status",
  "condition",
  "honestDisclosure",
  "rentalPrice",
  "price",
  "extendedWindowPrice",
  "perDayRate",
  "securityDeposit",
  "deposit",
  "listingPrice",
  "originalRetailPrice",
  "resalePayoutPercentage",
  "minimumOffer",
  "allowMakeOffer",
  "stylistConsultationBanner",
  "commissionRate",
  "minimumDurationDays",
  "extensionWindowDays",
  "cleaningBufferDays",
  "preRentalBufferDays",
  "postRentalBufferDays",
  "deliveryTiming",
  "care",
  "packaging",
  "shipping",
  "taxRate",
  "gstRate",
  "cleaningFee",
  "extensionPrice",
  "listerId",
  "lister_id",
  "listerID",
  "listerName",
  "payoutPercentage",
  "payoutTerms",
  "rating",
  "reviewCount",
  "timesRented",
  "images",
  "image",
  "video",
  "seoTitle",
  "seoDescription",
  "urlSlug",
  "tags",
  "relatedProductIds",
  "blockedDates",
  "bookingHistory",
  "externalBookings",
  "activityLog",
  "isPinnedToAteliers",
  "ateliersOrder",
  "user",
  "remarks",
  "createdBy",
  "updatedBy",
];

const CUSTOMER_ALLOWED_KEYS = [
  "customerId",
  "id",
  "name",
  "firstName",
  "lastName",
  "email",
  "password",
  "newPassword",
  "confirmPassword",
  "token",
  "resetToken",
  "verificationToken",
  "otp",
  "googleId",
  "phone",
  "mobile",
  "location",
  "city",
  "state",
  "pin",
  "address",
  "line1",
  "line2",
  "label",
  "recipientName",
  "isDefault",
  "gstin",
  "instagram",
  "birthDate",
  "referrer",
  "status",
  "source",
  "flagReason",
  "internalNotes",
  "preferences",
  "preferredSize",
  "preferredOccasions",
  "preferredSilhouettes",
  "newsletter",
  "whatsappNotifications",
  "marketingOptIn",
  "termsAccepted",
  "marketingAccepted",
  "addresses",
  "occasions",
  "occasion",
  "date",
  "communicationLog",
  "message",
  "channel",
  "joinedDate",
  "ordersCount",
  "totalSpent",
  "wishlistCount",
  "lastOrderDate",
  "wishlist",
  "cart",
];

const SUBMISSION_PUBLIC_CREATE_ALLOWED_KEYS = [
  "listerId",
  "listerID",
  "lister_id",
  "listerName",
  "full_name",
  "listerPhone",
  "phone",
  "mobile",
  "listerEmail",
  "email",
  "city",
  "customerId",
  "customer_id",
  "piece",
  "piece_name",
  "designer",
  "category",
  "piece_type",
  "channel",
  "intent",
  "outcome",
  "askRent",
  "askSell",
  "condition",
  "selfGrade",
  "conditionClaim",
  "timesWorn",
  "times_worn",
  "yearOfPurchase",
  "year_purchased",
  "originalPrice",
  "original_price",
  "colour",
  "colour_family",
  "color",
  "size",
  "photos",
  "videos",
  "media",
  "notes",
  "pickupAddress",
  "bankDetails",
  "terms",
];

const SUBMISSION_ADMIN_UPDATE_ALLOWED_KEYS = [
  ...SUBMISSION_PUBLIC_CREATE_ALLOWED_KEYS,
  "subid",
  "queueRow",
  "submitted",
  "submittedAt",
  "sku",
  "status",
  "decision",
  "moreInfo",
  "history",
  "assignedTo",
  "infoRequired",
  "deadline",
  "requestedBy",
  "comment",
  "message",
  "replyText",
  "expectation",
  "worksheet",
  "authenticity",
  "pricing",
];

const LISTER_ALLOWED_KEYS = [
  "listerId",
  "id",
  "name",
  "initials",
  "email",
  "phone",
  "city",
  "location",
  "status",
  "statusReason",
  "source",
  "referral",
  "insta",
  "joined",
  "verified",
  "address",
  "pin",
  "pickup",
  "pickupPrefs",
  "bank",
  "bankDetails",
  "accountHolder",
  "accountNumber",
  "ifsc",
  "bankName",
  "payoutPercentages",
  "gstReg",
  "gstin",
  "pan",
  "panVerified",
  "terms",
  "notes",
  "internalNotes",
  "channel",
  "text",
  "color",
  "pieceId",
  "reason",
  "scheduledDate",
  "returnedDate",
  "declinedDate",
  "declinedReason",
];

const DESIGNER_ALLOWED_KEYS = [
  "designerId",
  "id",
  "name",
  "slug",
  "bio",
  "shortBio",
  "type",
  "status",
  "joinedAt",
  "joinedDate",
  "isNewToHOK",
  "inNewToHok",
  "isFeatured",
  "featured",
  "featuredOrder",
  "featuredRank",
  "sortOrder",
  "livePieces",
  "totalPieces",
  "counterfeitRiskTier",
  "riskTier",
  "authenticationChecklist",
  "checklist",
  "websiteUrl",
  "brandWebsite",
  "instagramHandle",
  "brandInstagram",
  "commercialTerms",
  "suppliesFreshStockBuyNow",
  "isBuyNewPartner",
  "commissionRateBuyNow",
  "commissionPercent",
  "paymentTerms",
  "brandFulfilmentPolicy",
  "fulfilmentReturnsPolicy",
  "accountManagerName",
  "contactEmail",
  "contactPhone",
  "internalNotes",
  "orderedIds",
];

const OFFER_ALLOWED_KEYS = [
  "offerId",
  "enquiryId",
  "productId",
  "productName",
  "productImage",
  "designer",
  "pieces",
  "pieceId",
  "alsoPieceId",
  "category",
  "customerId",
  "customerName",
  "customerEmail",
  "customerPhone",
  "customerCity",
  "customerState",
  "address",
  "mode",
  "size",
  "rentalStartDate",
  "rentalEndDate",
  "createOrder",
  "paymentMethod",
  "channel",
  "linkedOrderId",
  "promoCode",
  "quantity",
  "currency",
  "originalAmount",
  "offeredAmount",
  "discount",
  "finalAmount",
  "status",
  "negotiationStatus",
  "assignedTo",
  "assignedBy",
  "expiresAt",
  "expiryDate",
  "notes",
  "message",
  "amount",
  "sentBy",
  "user",
  "remarks",
  "ids",
  "offerIds",
];

const PAYOUT_ALLOWED_KEYS = [
  "payoutId",
  "productId",
  "customerId",
  "offerId",
  "promoCode",
  "listerId",
  "listerName",
  "orderId",
  "productName",
  "mode",
  "transactionAmount",
  "payoutPercentage",
  "listerShare",
  "hokCommission",
  "taxDeduction",
  "netPayout",
  "dueDate",
  "status",
  "paidAt",
  "paidBy",
  "paymentReference",
  "reference",
  "ref",
  "notes",
];

const PROMO_ALLOWED_KEYS = [
  "code",
  "type",
  "value",
  "maxDiscount",
  "minOrder",
  "modes",
  "scope",
  "stacksWith",
  "audience",
  "customerIds",
  "firstOrderOnly",
  "usesTotalCap",
  "usesPerCustomer",
  "validFrom",
  "validUntil",
  "status",
  "visibility",
  "publicDesc",
  "reason",
  "notes",
  "createdBy",
  "updatedBy",
  "by",
  "createdOn",
  "history",
  "attnSnooze",
  "supersedes",
  "supersededBy",
  "redemptions",
  "orderValue",
  "discountFunded",
];

const TASK_ALLOWED_KEYS = [
  "title",
  "date",
  "time",
  "type",
  "status",
  "assignee",
  "orderId",
  "description",
];

const CATEGORY_ALLOWED_KEYS = [
  "categoryId",
  "name",
  "slug",
  "image",
  "description",
  "hex",
  "family",
];

const MESSAGE_ALLOWED_KEYS = [
  "messageId",
  "name",
  "wordingCount",
  "isYours",
  "trigger",
  "subject",
  "audience",
  "class",
  "channels",
  "status",
  "lastEdited",
  "editor",
  "sentCount",
  "wordings",
  "channel",
  "to",
  "body",
];

const CONSENT_ALLOWED_KEYS = [
  "v",
  "functional",
  "personalisation",
  "analytics",
  "marketing",
  "how",
];

const ADMIN_AUTH_ALLOWED_KEYS = [
  "name",
  "email",
  "password",
  "token",
];

/**
 * Helper to filter an object to only allowed keys.
 */
const pickAllowedKeys = (obj, allowedKeysSet) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  const filtered = {};
  for (const key of Object.keys(obj)) {
    if (allowedKeysSet.has(key)) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
};

const orderAllowedSet = new Set(ORDER_ALLOWED_KEYS);
const orderItemAllowedSet = new Set(ORDER_ITEM_ALLOWED_KEYS);
const productAllowedSet = new Set(PRODUCT_ALLOWED_KEYS);
const customerAllowedSet = new Set(CUSTOMER_ALLOWED_KEYS);
const submissionPublicSet = new Set(SUBMISSION_PUBLIC_CREATE_ALLOWED_KEYS);
const submissionAdminSet = new Set(SUBMISSION_ADMIN_UPDATE_ALLOWED_KEYS);
const listerAllowedSet = new Set(LISTER_ALLOWED_KEYS);
const designerAllowedSet = new Set(DESIGNER_ALLOWED_KEYS);
const offerAllowedSet = new Set(OFFER_ALLOWED_KEYS);
const payoutAllowedSet = new Set(PAYOUT_ALLOWED_KEYS);
const promoAllowedSet = new Set(PROMO_ALLOWED_KEYS);
const taskAllowedSet = new Set(TASK_ALLOWED_KEYS);
const categoryAllowedSet = new Set(CATEGORY_ALLOWED_KEYS);
const messageAllowedSet = new Set(MESSAGE_ALLOWED_KEYS);
const consentAllowedSet = new Set(CONSENT_ALLOWED_KEYS);
const adminAuthAllowedSet = new Set(ADMIN_AUTH_ALLOWED_KEYS);

const sanitizeOrderPayload = (body) => {
  const cleaned = pickAllowedKeys(body, orderAllowedSet);
  if (Array.isArray(cleaned.items)) {
    cleaned.items = cleaned.items.map((item) =>
      pickAllowedKeys(item, orderItemAllowedSet)
    );
  }
  return cleaned;
};

/**
 * Route-aware payload whitelister: strips any unknown/unnecessary fields from req.body
 * based on the target API route and HTTP method.
 */
export const applyRouteWhitelist = (req) => {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return;
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) return;

  const url = req.originalUrl.split("?")[0].replace(/^\/api/, "");

  // 1. Admin Auth (/auth/*)
  if (url.startsWith("/auth/")) {
    req.body = pickAllowedKeys(req.body, adminAuthAllowedSet);
    return;
  }

  // 2. Customer Auth & Profile (/customer/* or /customers/*)
  if (url.startsWith("/customer/auth/orders/place")) {
    req.body = sanitizeOrderPayload(req.body);
    return;
  }
  if (url.startsWith("/customer/") || url.startsWith("/customers")) {
    req.body = pickAllowedKeys(req.body, customerAllowedSet);
    if (Array.isArray(req.body.cart)) {
      req.body.cart = req.body.cart.slice(0, 100).map((item) =>
        pickAllowedKeys(item, orderItemAllowedSet)
      );
    }
    return;
  }

  // 3. Payment & Razorpay (/payment/*)
  if (url.startsWith("/payment/razorpay/create-order")) {
    req.body = pickAllowedKeys(
      req.body,
      new Set(["amount", "currency", "receipt", "notes"])
    );
    return;
  }
  if (url.startsWith("/payment/razorpay/verify")) {
    req.body = pickAllowedKeys(
      req.body,
      new Set([
        "razorpay_order_id",
        "razorpay_payment_id",
        "razorpay_signature",
        "orderData",
      ])
    );
    if (req.body.orderData && typeof req.body.orderData === "object") {
      req.body.orderData = sanitizeOrderPayload(req.body.orderData);
    }
    return;
  }

  // 4. Orders (/orders*)
  if (url.startsWith("/orders")) {
    if (url.endsWith("/logs")) {
      req.body = pickAllowedKeys(req.body, new Set(["message", "type", "user"]));
      return;
    }
    if (url.endsWith("/status")) {
      req.body = pickAllowedKeys(req.body, new Set(["status"]));
      return;
    }
    if (url.includes("/items/")) {
      req.body = pickAllowedKeys(
        req.body,
        new Set([
          ...ORDER_ITEM_ALLOWED_KEYS,
          "date",
          "courierPartner",
          "trackingNumber",
          "deliveryAddress",
          "documented",
          "documentedBy",
          "receivedDate",
          "dueDate",
          "grade",
          "assessedBy",
          "notes",
          "videoUrl",
          "totalDeposit",
          "deductedAmount",
          "releasedAmount",
          "reason",
          "releaseNote",
          "stage",
        ])
      );
      return;
    }
    req.body = sanitizeOrderPayload(req.body);
    return;
  }

  // 5. Products (/products*)
  if (url.startsWith("/products")) {
    if (
      url.endsWith("/reserve") ||
      url.endsWith("/bookings") ||
      url.endsWith("/external-booking") ||
      url.endsWith("/external-bookings")
    ) {
      req.body = pickAllowedKeys(
        req.body,
        new Set([
          "orderId",
          "customerId",
          "customerName",
          "customerEmail",
          "customerPhone",
          "whatsappNumber",
          "city",
          "channel",
          "startDate",
          "endDate",
          "date",
          "mode",
          "amount",
          "deposit",
          "depositStatus",
          "status",
          "source",
          "listerSplitPercent",
          "splitNote",
          "promoCode",
          "offerId",
          "excludeOrderId",
          "remarks",
          "createdBy",
          "updatedBy",
        ])
      );
      return;
    }
    if (url.includes("/blocked-dates")) {
      req.body = pickAllowedKeys(
        req.body,
        new Set(["from", "to", "reason", "depositStatus", "remarks", "createdBy", "updatedBy"])
      );
      return;
    }
    req.body = pickAllowedKeys(req.body, productAllowedSet);
    return;
  }

  // 6. Submissions / LYP (/submissions* or /lister-submissions*)
  if (url.startsWith("/submissions") || url.startsWith("/lister-submissions")) {
    if (method === "POST" && (url === "/submissions" || url === "/lister-submissions")) {
      // Public LYP submission creation: strictly strip admin-only decision/status fields
      req.body = pickAllowedKeys(req.body, submissionPublicSet);
      return;
    }
    req.body = pickAllowedKeys(req.body, submissionAdminSet);
    return;
  }

  // 7. Listers (/listers*)
  if (url.startsWith("/listers")) {
    req.body = pickAllowedKeys(req.body, listerAllowedSet);
    return;
  }

  // 8. Designers (/designers*)
  if (url.startsWith("/designers")) {
    req.body = pickAllowedKeys(req.body, designerAllowedSet);
    return;
  }

  // 9. Offers & Enquiries (/offers*, /enquiries*)
  if (url.startsWith("/enquiries")) {
    req.body = pickAllowedKeys(
      req.body,
      new Set([
        "enquiryId",
        "customerId",
        "isOnFile",
        "customerName",
        "customerEmail",
        "email",
        "customerPhone",
        "phone",
        "customerCity",
        "city",
        "channel",
        "source",
        "interestedIn",
        "assignedTo",
        "pieces",
        "pieceId",
        "alsoPieceId",
        "addPieceId",
        "removePieceKey",
        "eventDate",
        "holdStartDate",
        "holdEndDate",
        "followUpDate",
        "whatSheAsked",
        "note",
        "status",
        "linkedOrderId",
        "linkedOfferId",
        "author",
        "updatedBy",
        "target",
        "productId",
        "startDate",
        "endDate",
        "amount",
        "offeredAmount",
        "piece",
      ]),
    );
    return;
  }
  if (url.startsWith("/offers")) {
    req.body = pickAllowedKeys(req.body, offerAllowedSet);
    return;
  }

  // 10. Payouts (/payouts*)
  if (url.startsWith("/payouts")) {
    req.body = pickAllowedKeys(req.body, payoutAllowedSet);
    return;
  }

  // 11. Promotions (/promotions*)
  if (url.startsWith("/promotions")) {
    req.body = pickAllowedKeys(req.body, promoAllowedSet);
    return;
  }

  // 12. Tasks (/tasks*)
  if (url.startsWith("/tasks")) {
    req.body = pickAllowedKeys(req.body, taskAllowedSet);
    return;
  }

  // 13. Categories (/categories*)
  if (url.startsWith("/categories")) {
    req.body = pickAllowedKeys(req.body, categoryAllowedSet);
    return;
  }

  // 14. Messages (/messages*)
  if (url.startsWith("/messages")) {
    req.body = pickAllowedKeys(req.body, messageAllowedSet);
    return;
  }

  // 15. Cookie Consent (/consent)
  if (url.startsWith("/consent")) {
    req.body = pickAllowedKeys(req.body, consentAllowedSet);
    return;
  }

  // 16. Site Settings (/site-settings*)
  if (url.startsWith("/site-settings")) {
    req.body = pickAllowedKeys(
      req.body,
      new Set([
        "key",
        "siteName",
        "tagline",
        "supportEmail",
        "whatsappNumber",
        "instagramHandle",
        "announcementBar",
        "header",
        "footer",
        "mobileBar",
      ])
    );
    return;
  }
};

/**
 * Express Middleware: Official Validation & Sanitization Guard
 */
export const officialValidationGuard = (req, res, next) => {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = inspectAndSanitizeInput(req.body, "body", 0);
      applyRouteWhitelist(req);
    }
    if (req.query && typeof req.query === "object") {
      const sanitizedQuery = inspectAndSanitizeInput(req.query, "query", 0);
      Object.keys(req.query).forEach((k) => {
        req.query[k] = sanitizedQuery[k];
      });
    }
    if (req.params && typeof req.params === "object") {
      const sanitizedParams = inspectAndSanitizeInput(req.params, "params", 0);
      Object.keys(req.params).forEach((k) => {
        req.params[k] = sanitizedParams[k];
      });
    }
    return next();
  } catch (err) {
    console.warn(`[Security Validation Blocked] ${req.method} ${req.originalUrl}: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid or unsafe request payload blocked by validation guard.",
    });
  }
};

export default officialValidationGuard;

