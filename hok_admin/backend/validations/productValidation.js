import Joi from "joi";

export const validateProduct = (data) => {
  // ✅ FIX: Validate karne se pehle extra fields hata do
  const cleanData = { ...data };
  const forbiddenFields = ['id', '_id', '__v', 'createdAt', 'updatedAt', 'listerName', 'listingModels', 'listingMode'];
  forbiddenFields.forEach(field => {
    delete cleanData[field];
  });

  const schema = Joi.object({
    // ========== BASIC ==========
    productId: Joi.string().required(),
    name: Joi.string().required().trim(),
    designer: Joi.string().allow('', null),
    subtitle: Joi.string().allow('', null), // NEW
    description: Joi.string().allow('', null),
    story: Joi.string().allow('', null),
    
    // ========== CATEGORY ==========
    category: Joi.string().allow('', null),
    occasion: Joi.string().allow('', null),
    
    // ========== MATERIAL & CRAFT ==========
    material: Joi.string().allow('', null),
    color: Joi.string().allow('', null),
    craft: Joi.string().allow('', null),
    technique: Joi.string().allow('', null),
    embellishments: Joi.string().allow('', null),
    threadYarnDetail: Joi.string().allow('', null), // NEW
    threadWork: Joi.string().allow('', null),
    
    // ========== SET & ORIGIN ==========
    setIncludes: Joi.string().allow('', null),
    origin: Joi.string().allow('', null),
    
    // ========== SIZE & MEASUREMENTS ==========
    sizes: Joi.array().items(Joi.string()).default([]),
    sizeGuide: Joi.string().allow('', null),
    measurements: Joi.object({
      bust: Joi.string().allow('', null),
      waist: Joi.string().allow('', null),
      hips: Joi.string().allow('', null),
      length: Joi.string().allow('', null)
    }).default({}),
    measurementsCm: Joi.object({ // NEW
      bust: Joi.string().allow('', null),
      waist: Joi.string().allow('', null),
      hips: Joi.string().allow('', null),
      length: Joi.string().allow('', null)
    }).default({}),
    bestSuitedForHeight: Joi.string().allow('', null), // NEW
    weight: Joi.string().allow('', null),
    
    // ========== LISTING ==========
    listingModes: Joi.array().items(Joi.string().valid('RENTAL', 'PRELOVED', 'BUY NEW')).default(['RENTAL']),
    availability: Joi.string().default('Available Now'),
    status: Joi.string().allow('', null).default('Draft'),
    condition: Joi.string().valid('Excellent', 'Very Good', 'Good', 'Fair').allow('', null),
    honestDisclosure: Joi.string().allow('', null), // NEW
    
    // ========== RENTAL CONFIG ==========
    rentalPrice: Joi.number().min(0).allow(null),
    extendedWindowPrice: Joi.number().min(0).allow(null, ''),
    perDayRate: Joi.number().min(0).allow(null, ''),
    securityDeposit: Joi.number().min(0).allow(null),
    listingPrice: Joi.number().min(0).allow(null),
    originalRetailPrice: Joi.number().min(0).allow(null, ''),
    resalePayoutPercentage: Joi.number().min(0).max(500).allow(null, ''),
    minimumOffer: Joi.number().min(0).allow(null, ''),
    allowMakeOffer: Joi.boolean().allow(null),
    stylistConsultationBanner: Joi.boolean().allow(null),
    commissionRate: Joi.number().min(0).max(100).allow(null),
    minimumDurationDays: Joi.number().min(1).default(3),
    extensionWindowDays: Joi.number().min(0).default(2),
    cleaningBufferDays: Joi.number().min(0).default(3),
    preRentalBufferDays: Joi.number().min(0).default(2), // NEW
    postRentalBufferDays: Joi.number().min(0).default(3), // NEW
    
    // ========== DELIVERY ==========
    deliveryTiming: Joi.string().allow('', null),
    
    // ========== PRICING & TAX ==========
    taxRate: Joi.number().min(0).allow(null, ''),
    gstRate: Joi.number().min(0).allow(null, ''),
    cleaningFee: Joi.number().min(0).allow(null, ''),
    extensionPrice: Joi.number().min(0).allow(null, ''),
    
    // ========== LISTER ==========
    listerId: Joi.string().allow('', null),
    payoutPercentage: Joi.number().min(0).max(100).allow(null, ''),
    payoutTerms: Joi.string().allow('', null),
    
    // ========== METRICS ==========
    rating: Joi.number().min(0).max(5).allow(null),
    reviewCount: Joi.number().min(0).default(0),
    timesRented: Joi.number().min(0).default(0),
    
    // ========== MEDIA ==========
    images: Joi.array().items(Joi.string()).default([]),
    
    // ========== SEO ==========
    seoTitle: Joi.string().allow('', null),
    seoDescription: Joi.string().allow('', null),
    urlSlug: Joi.string().allow('', null),
    
    // ========== TAGS & RELATED ==========
    tags: Joi.array().items(Joi.string()).default([]),
    relatedProductIds: Joi.array().items(Joi.string()).default([]),
    
    // ========== BOOKINGS & BLOCKS ==========
    blockedDates: Joi.array().items(
      Joi.object({
        from: Joi.string(),
        to: Joi.string(),
        depositStatus: Joi.string().allow('', null) // NEW
      })
    ).default([]),
    externalBookings: Joi.array().default([]),
    
    // ========== SKU ==========
    sku: Joi.string().allow('', null),
    
    // ========== ACTIVITY LOG ==========
    activityLog: Joi.array().items(
      Joi.object({
        action: Joi.string(),
        user: Joi.string().allow('', null),
        createdAt: Joi.date(),
        remarks: Joi.string().allow('', null)
      })
    ).default([])
  });

  // ✅ FIX: cleanData ko validate karo and strip unknown fields safely
  return schema.validate(cleanData, { abortEarly: false, allowUnknown: true, stripUnknown: false });
};