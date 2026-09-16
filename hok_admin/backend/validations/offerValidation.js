import Joi from "joi";

export const validateOffer = (data) => {

    const schema = Joi.object({

        enquiryId: Joi.string().allow("", null),

        productId: Joi.string().allow("", null),

        productName: Joi.string().required(),

        productImage: Joi.string().allow("", null),

        category: Joi.string().allow("", null),

        customerName: Joi.string().required(),

        customerEmail: Joi.string()
            .allow("", null)
            .empty(""),

        customerPhone: Joi.string().allow("", null),

        customerCity: Joi.string().allow("", null),

        customerState: Joi.string().allow("", null),

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

    return schema.custom((value, helpers) => {
        // Only validate amounts when both originalAmount and offeredAmount are non-zero
        if (value.offeredAmount > 0 && value.originalAmount > 0 && value.offeredAmount > value.originalAmount)
            return helpers.error("any.custom", { message: "Offered amount cannot exceed original amount" });
        if (value.discount > 0 && value.originalAmount > 0 && value.discount > value.originalAmount)
            return helpers.error("any.custom", { message: "Discount cannot exceed original amount" });
        if (value.finalAmount > 0 && value.originalAmount > 0 && value.finalAmount > value.originalAmount)
            return helpers.error("any.custom", { message: "Final amount cannot exceed original amount" });
        return value;
    }).messages({ "any.custom": "{{#message}}" }).validate(data, { abortEarly: false, stripUnknown: true });

};
