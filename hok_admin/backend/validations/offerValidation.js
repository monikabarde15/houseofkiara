import Joi from "joi";

export const validateOffer = (data) => {
  const schema = Joi.object({
    offerId: Joi.string().allow("", null),

    enquiryId: Joi.string().allow("", null),

    productId: Joi.string().allow("", null),

    productName: Joi.string().required(),

    productImage: Joi.string().allow("", null),

    category: Joi.string().allow("", null),

    customerId: Joi.string().allow("", null),

    customerName: Joi.string().required(),

    customerEmail: Joi.string().allow("", null).empty(""),

    customerPhone: Joi.string().allow("", null),

    promoCode: Joi.string().allow("", null),

    customerCity: Joi.string().allow("", null),

    customerState: Joi.string().allow("", null),

    address: Joi.string().allow("", null),

    mode: Joi.string().valid("Rental", "Preloved", "Buy").allow("", null),

    size: Joi.string().allow("", null),

    rentalStartDate: Joi.string().allow("", null),

    rentalEndDate: Joi.string().allow("", null),

    createOrder: Joi.boolean().default(false),

    paymentMethod: Joi.string().allow("", null),

    quantity: Joi.number().integer().min(1).max(100).default(1),

    originalAmount: Joi.number().min(0).precision(2).default(0),

    offeredAmount: Joi.number().min(0).precision(2).default(0),

    finalAmount: Joi.number().min(0).precision(2).default(0),

    discount: Joi.number().min(0).precision(2).default(0),

    currency: Joi.string().default("INR"),

    assignedTo: Joi.string().allow("", null),

    expiresAt: Joi.date().allow(null),

    notes: Joi.string().allow("", null),

    channel: Joi.string().allow("", null),
  });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};
