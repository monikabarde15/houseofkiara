import Joi from "joi";

const money = Joi.number().min(0).precision(2);
const schema = Joi.object({
  productId: Joi.string().trim().allow("", null), listerId: Joi.string().trim().allow("", null), listerName: Joi.string().trim().allow("", null), name: Joi.string().trim().min(3).max(180).required(),
  designer: Joi.string().trim().min(2).max(120).required(), description: Joi.string().trim().max(5000).allow("", null),
  category: Joi.string().trim().required(), occasion: Joi.string().trim().max(200).allow("", null),
  material: Joi.string().trim().max(120).allow("", null), embellishments: Joi.string().trim().max(500).allow("", null),
  sizes: Joi.array().items(Joi.string().trim().max(20)).default([]),
  listingModes: Joi.array().items(Joi.string().valid("Rental", "Preloved", "Buy")).min(1).required(),
  condition: Joi.string().trim().required(), availability: Joi.string().valid("Available Now", "Rented", "Blocked", "Restocking").required(),
  status: Joi.string().valid("Live", "Archived", "Review").required(), rentalPrice: money.default(0), securityDeposit: money.default(0), listingPrice: money.default(0),
  commissionRate: Joi.number().min(0).max(100).precision(2).default(25), minimumDurationDays: Joi.number().integer().min(1).max(365).default(4),
  extensionWindowDays: Joi.number().integer().min(0).max(365).default(2), cleaningBufferDays: Joi.number().integer().min(0).max(90).default(2),
  images: Joi.array().items(Joi.string().trim().max(2000)).default([]), seoTitle: Joi.string().max(180).allow("", null), seoDescription: Joi.string().max(500).allow("", null), urlSlug: Joi.string().max(180).allow("", null),
  blockedDates: Joi.array().items(Joi.object({ from: Joi.date().required(), to: Joi.date().min(Joi.ref("from")).required(), reason: Joi.string().trim().max(250).required() })).default([]),
  bookingHistory: Joi.array().items(Joi.object({ orderId: Joi.string().required(), customerName: Joi.string().required(), date: Joi.date().required(), startDate: Joi.date().allow(null), endDate: Joi.date().min(Joi.ref("startDate")).allow(null), amount: money.required(), status: Joi.string().required() })).default([])
}).unknown(true).custom((value, helpers) => {
  const modes = value.listingModes || [];
  if (modes.includes("Rental") && value.rentalPrice <= 0) return helpers.error("any.custom", { message: "Rental price must be greater than zero for Rental listings" });
  if ((modes.includes("Buy") || modes.includes("Preloved")) && value.listingPrice <= 0) return helpers.error("any.custom", { message: "Listing price must be greater than zero for Buy/Preloved listings" });
  if (value.cleaningBufferDays >= value.minimumDurationDays) return helpers.error("any.custom", { message: "Cleaning buffer must be less than minimum rental duration" });
  return value;
}).messages({ "any.custom": "{{#message}}" });

export const validateProduct = (data) => schema.validate(data, { abortEarly: false, stripUnknown: true });
