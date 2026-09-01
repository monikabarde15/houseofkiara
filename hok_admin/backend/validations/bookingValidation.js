import Joi from "joi";

export const validateBookingDates = (data) => Joi.object({
  startDate: Joi.date().iso().required(), endDate: Joi.date().iso().required(), mode: Joi.string().valid("Rental", "Preloved", "Buy").default("Rental"), excludeOrderId: Joi.string().allow("", null)
}).custom((value, helpers) => {
  const start = new Date(value.startDate); const end = new Date(value.endDate); const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (start < today) return helpers.error("any.custom", { message: "Booking start date cannot be in the past" });
  if (end < start) return helpers.error("any.custom", { message: "End date must be on or after start date" });
  return value;
}).messages({ "any.custom": "{{#message}}" }).validate(data, { abortEarly: false });
