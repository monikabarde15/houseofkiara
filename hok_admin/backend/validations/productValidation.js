import Joi from "joi";

const strOrNum = Joi.alternatives()
  .try(Joi.string().allow("", null), Joi.number().allow(null))
  .allow("", null);

export const validateProduct = (data) => {
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

  const schema = Joi.object({
    // ========== BASIC ==========
    productId: Joi.string().required(),
    name: Joi.string().required().trim(),
    designer: Joi.string().allow("", null),
    subtitle: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    story: Joi.string().allow("", null),

    // ========== CATEGORY & OCCASION ==========
    category: Joi.string().allow("", null),
    occasion: Joi.string().allow("", null),

    // ========== MATERIAL & CRAFT ==========
    material: Joi.string().allow("", null),
    color: Joi.string().allow("", null),
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
    listingModes: Joi.array()
      .items(Joi.string().valid("RENTAL", "PRELOVED", "BUY NEW"))
      .default(["RENTAL"]),
    availability: Joi.string().allow("", null).default("Available Now"),
    status: Joi.string().allow("", null).default("Draft"),
    condition: Joi.string().allow("", null),
    honestDisclosure: Joi.string().allow("", null),

    // ========== RENTAL CONFIG ==========
    rentalPrice: Joi.number().min(0).allow(null, ""),
    extendedWindowPrice: Joi.number().min(0).allow(null, ""),
    perDayRate: Joi.number().min(0).allow(null, ""),
    securityDeposit: Joi.number().min(0).allow(null, ""),
    listingPrice: Joi.number().min(0).allow(null, ""),
    originalRetailPrice: Joi.number().min(0).allow(null, ""),
    resalePayoutPercentage: Joi.number().min(0).max(500).allow(null, ""),
    minimumOffer: Joi.number().min(0).allow(null, ""),
    allowMakeOffer: Joi.boolean().allow(null),
    stylistConsultationBanner: Joi.boolean().allow(null),
    commissionRate: Joi.number().min(0).max(100).allow(null, ""),
    minimumDurationDays: Joi.number().min(0).allow(null, "").default(3),
    extensionWindowDays: Joi.number().min(0).allow(null, "").default(2),
    cleaningBufferDays: Joi.number().min(0).allow(null, "").default(3),
    preRentalBufferDays: Joi.number().min(0).allow(null, "").default(2),
    postRentalBufferDays: Joi.number().min(0).allow(null, "").default(3),

    // ========== DELIVERY ==========
    deliveryTiming: Joi.string().allow("", null),

    // ========== PRICING & TAX ==========
    taxRate: Joi.number().min(0).allow(null, ""),
    gstRate: Joi.number().min(0).allow(null, ""),
    cleaningFee: Joi.number().min(0).allow(null, ""),
    extensionPrice: Joi.number().min(0).allow(null, ""),

    // ========== LISTER ==========
    listerId: Joi.string().allow("", null),
    payoutPercentage: Joi.number().min(0).max(100).allow(null, ""),
    payoutTerms: Joi.string().allow("", null),

    // ========== METRICS ==========
    rating: Joi.number().min(0).max(5).allow(null, ""),
    reviewCount: Joi.number().min(0).allow(null, "").default(0),
    timesRented: Joi.number().min(0).allow(null, "").default(0),

    // ========== MEDIA ==========
    images: Joi.array().items(Joi.string().allow("")).default([]),

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
  });

  return schema.validate(cleanData, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });
};
