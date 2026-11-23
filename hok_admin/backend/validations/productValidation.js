import Joi from "joi";

const strOrNum = Joi.alternatives()
  .try(Joi.string().allow("", null), Joi.number().allow(null))
  .allow("", null);

const NUMERIC_FIELDS = [
  "rentalPrice",
  "extendedWindowPrice",
  "perDayRate",
  "securityDeposit",
  "listingPrice",
  "originalRetailPrice",
  "resalePayoutPercentage",
  "minimumOffer",
  "commissionRate",
  "minimumDurationDays",
  "extensionWindowDays",
  "cleaningBufferDays",
  "preRentalBufferDays",
  "postRentalBufferDays",
  "taxRate",
  "gstRate",
  "cleaningFee",
  "extensionPrice",
  "payoutPercentage",
  "rating",
  "reviewCount",
  "timesRented",
];

export const validateProduct = (data, { strict = true } = {}) => {
  const cleanData = { ...data };
  const forbiddenFields = [
    "id",
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "listerName",
    "listingModels",
    "listingMode",
    "orderHistory",
    "overdueBlockedDates",
  ];
  forbiddenFields.forEach((field) => {
    delete cleanData[field];
  });

  NUMERIC_FIELDS.forEach((field) => {
    if (cleanData[field] === "") {
      cleanData[field] = null;
    }
  });

  if (Array.isArray(cleanData.listingModes)) {
    cleanData.listingModes = Array.from(
      new Set(
        cleanData.listingModes
          .map((m) => String(m || "").trim().toUpperCase())
          .filter(Boolean),
      ),
    );
  }

  if (Array.isArray(cleanData.images)) {
    cleanData.images = cleanData.images
      .map((img) => (typeof img === "string" ? img.trim() : ""))
      .filter(Boolean);
  }

  const schema = Joi.object({
    // ========== BASIC ==========
    productId: Joi.string().required(),
    name: Joi.string().trim().min(3).required().messages({
      "string.empty": "Product Title is required.",
      "string.min": "Product Title must be at least 3 characters.",
      "any.required": "Product Title is required.",
    }),
    designer: Joi.string().allow("", null),
    subtitle: Joi.string().allow("", null),
    description: strict
      ? Joi.string().trim().min(1).required().messages({
          "string.empty": "Full Description is required.",
          "any.required": "Full Description is required.",
        })
      : Joi.string().allow("", null),
    story: Joi.string().allow("", null),

    // ========== CATEGORY & OCCASION ==========
    category: Joi.string().allow("", null),
    occasion: Joi.string().allow("", null),

    // ========== MATERIAL & CRAFT ==========
    material: Joi.string().allow("", null),
    color: Joi.string().allow("", null),
    colorFamily: Joi.string().allow("", null),
    // Structured colours: first entry = primary colour
    colors: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().allow("", null),
          hex: Joi.string().allow("", null),
          family: Joi.string().allow("", null),
        }).unknown(true),
      )
      .default([]),
    craft: Joi.string().allow("", null),
    technique: Joi.string().allow("", null),
    embellishments: Joi.string().allow("", null),
    threadYarnDetail: Joi.string().allow("", null),
    threadWork: Joi.string().allow("", null),

    // ========== SET & ORIGIN ==========
    setIncludes: Joi.string().allow("", null),
    origin: Joi.string().allow("", null),

    // ========== SIZE & MEASUREMENTS ==========
    sizes: Joi.array().items(Joi.string().allow("")).default([]),
    sizeGuide: Joi.string().allow("", null),
    measurements: Joi.object({
      bust: strOrNum,
      waist: strOrNum,
      hips: strOrNum,
      length: strOrNum,
    })
      .unknown(true)
      .default({}),
    measurementsCm: Joi.object({
      bust: strOrNum,
      waist: strOrNum,
      hips: strOrNum,
      length: strOrNum,
    })
      .unknown(true)
      .default({}),
    bestSuitedForHeight: strOrNum,
    weight: strOrNum,

    // ========== LISTING ==========
    listingModes: strict
      ? Joi.array()
          .items(Joi.string().valid("RENTAL", "PRELOVED", "BUY NEW"))
          .min(1)
          .required()
          .messages({
            "array.min":
              "Select at least one Listing Mode (RENTAL, PRELOVED, or BUY NEW).",
            "any.required": "Listing Mode(s) is required.",
          })
      : Joi.array()
          .items(Joi.string().valid("RENTAL", "PRELOVED", "BUY NEW"))
          .default([]),
    availability: Joi.string().allow("", null).default("Available Now"),
    status: Joi.string().allow("", null).default("Draft"),
    condition: Joi.string().allow("", null),
    honestDisclosure: Joi.string().allow("", null),

    // ========== RENTAL CONFIG ==========
    rentalPrice: Joi.number().min(0).allow(null),
    extendedWindowPrice: Joi.number().min(0).allow(null),
    perDayRate: Joi.number().min(0).allow(null),
    securityDeposit: Joi.number().min(0).allow(null),
    listingPrice: Joi.number().min(0).allow(null),
    originalRetailPrice: Joi.number().min(0).allow(null),
    resalePayoutPercentage: Joi.number().min(0).max(100).allow(null),
    minimumOffer: Joi.number().min(0).allow(null),
    allowMakeOffer: Joi.boolean().allow(null),
    stylistConsultationBanner: Joi.boolean().allow(null),
    commissionRate: Joi.number().min(0).max(100).allow(null),
    minimumDurationDays: Joi.number().min(1).allow(null),
    extensionWindowDays: Joi.number().min(0).allow(null),
    cleaningBufferDays: Joi.number().min(0).allow(null),
    preRentalBufferDays: Joi.number().min(0).allow(null),
    postRentalBufferDays: Joi.number().min(0).allow(null),

    // ========== DELIVERY ==========
    deliveryTiming: Joi.string().allow("", null),

    // ========== PRICING & TAX ==========
    taxRate: Joi.number().min(0).max(100).allow(null),
    gstRate: Joi.number().min(0).max(100).allow(null),
    cleaningFee: Joi.number().min(0).allow(null),
    extensionPrice: Joi.number().min(0).allow(null),

    // ========== LISTER ==========
    listerId: Joi.string().allow("", null),
    payoutPercentage: Joi.number().min(0).max(100).allow(null),
    payoutTerms: Joi.string().allow("", null),

    // ========== METRICS ==========
    rating: Joi.number().min(0).max(5).allow(null),
    reviewCount: Joi.number().min(0).allow(null).default(0),
    timesRented: Joi.number().min(0).allow(null).default(0),

    // ========== MEDIA ==========
    images: strict
      ? Joi.array()
          .items(Joi.string().trim().min(1))
          .min(1)
          .required()
          .messages({
            "array.min": "At least 1 product image is required.",
            "any.required": "At least 1 product image is required.",
          })
      : Joi.array().items(Joi.string().allow("")).default([]),

    // ========== SEO ==========
    seoTitle: Joi.string().allow("", null),
    seoDescription: Joi.string().allow("", null),
    urlSlug: Joi.string().allow("", null),

    // ========== TAGS & RELATED ==========
    tags: Joi.array().items(Joi.string().allow("")).default([]),
    relatedProductIds: Joi.array().items(Joi.string().allow("")).default([]),

    // ========== BOOKINGS & BLOCKS ==========
    blockedDates: Joi.array()
      .items(
        Joi.object({
          from: Joi.alternatives().try(Joi.string(), Joi.date()).allow("", null),
          to: Joi.alternatives().try(Joi.string(), Joi.date()).allow("", null),
          reason: Joi.string().allow("", null),
          depositStatus: Joi.string().allow("", null),
        }).unknown(true),
      )
      .default([]),
    externalBookings: Joi.array().default([]),

    // ========== SKU ==========
    sku: Joi.string().allow("", null),

    // ========== ACTIVITY LOG ==========
    activityLog: Joi.array()
      .items(
        Joi.object({
          action: Joi.string().allow("", null),
          user: Joi.string().allow("", null),
          createdAt: Joi.alternatives().try(Joi.date(), Joi.string()).allow("", null),
          remarks: Joi.string().allow("", null),
        }).unknown(true),
      )
      .default([]),

    // ========== CURATION & ADDITIONAL SCHEMA FIELDS ==========
    gender: Joi.string().allow("", null),
    careByFabric: Joi.string().allow("", null),
    care: Joi.alternatives()
      .try(Joi.array().items(Joi.string().allow("")), Joi.string().allow("", null))
      .default([]),
    packaging: Joi.alternatives()
      .try(Joi.array().items(Joi.string().allow("")), Joi.string().allow("", null))
      .default([]),
    shipping: Joi.alternatives()
      .try(
        Joi.array().items(
          Joi.object({
            method: Joi.string().allow("", null),
            time: Joi.string().allow("", null),
            cost: strOrNum,
          }).unknown(true),
        ),
        Joi.string().allow("", null),
      )
      .default([]),
    video: Joi.string().allow("", null),
    bookingHistory: Joi.array().default([]),
    isPinnedToAteliers: Joi.boolean().default(false),
    ateliersOrder: Joi.number().allow(null).default(null),
  }).custom((obj, helpers) => {
    if (!strict) return obj;
    const modes = (Array.isArray(obj.listingModes) ? obj.listingModes : []).map(
      (m) => String(m || "").trim().toUpperCase(),
    );

    if (modes.includes("RENTAL")) {
      if (!(Number(obj.rentalPrice) > 0)) {
        return helpers.message(
          "Standard Rental Price (4 Days) must be greater than 0 for Rental listings.",
        );
      }
      if (!(Number(obj.perDayRate) > 0)) {
        return helpers.message(
          "Per-Day Rate must be greater than 0 for Rental listings.",
        );
      }
    }

    if (modes.includes("PRELOVED") || modes.includes("BUY NEW")) {
      if (!(Number(obj.listingPrice) > 0)) {
        return helpers.message(
          "Listing price must be greater than 0 for Preloved / Buy New listings.",
        );
      }
    }

    if (
      modes.includes("PRELOVED") &&
      obj.minimumOffer !== null &&
      obj.minimumOffer !== undefined &&
      Number(obj.listingPrice) > 0 &&
      Number(obj.minimumOffer) > Number(obj.listingPrice)
    ) {
      return helpers.message(
        "Minimum Offer cannot exceed the Listed Resale Price.",
      );
    }

    return obj;
  });

  return schema.validate(cleanData, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
};
