import Joi from "joi";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePhoneString = (rawPhone, helpers) => {
  if (!rawPhone || !rawPhone.trim()) return true;
  const digits = rawPhone.replace(/\D/g, "");
  let normalized = digits;
  if (digits.length === 12 && digits.startsWith("91")) {
    normalized = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    normalized = digits.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return helpers.error("any.custom", {
      message: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9",
    });
  }
  return true;
};

export const validateProfileUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(255).allow("", null),
    firstName: Joi.string().trim().max(100).allow("", null),
    lastName: Joi.string().trim().max(100).allow("", null),
    email: Joi.string()
      .trim()
      .pattern(emailRegex)
      .allow("", null)
      .messages({
        "string.pattern.base": "Please enter a valid email address",
      }),
    phone: Joi.string().trim().allow("", null),
    mobile: Joi.string().trim().allow("", null),
    city: Joi.string().trim().max(100).allow("", null),
    location: Joi.string().trim().max(100).allow("", null),
    address: Joi.string().trim().max(500).allow("", null),
    preferences: Joi.object({
      newsletter: Joi.boolean(),
      whatsappNotifications: Joi.boolean(),
      marketingOptIn: Joi.boolean(),
      preferredSize: Joi.string().allow("", null),
      preferredOccasions: Joi.string().allow("", null),
      preferredSilhouettes: Joi.string().allow("", null),
    }).unknown(true).allow(null),
  })
    .custom((value, helpers) => {
      const rawPhone = value.phone || value.mobile;
      if (rawPhone && rawPhone.trim()) {
        const phoneValidation = validatePhoneString(rawPhone, helpers);
        if (phoneValidation !== true) return phoneValidation;
      }
      return value;
    })
    .messages({ "any.custom": "{{#message}}" });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateAddressInput = (data) => {
  const schema = Joi.object({
    label: Joi.string().trim().max(50).default("Home"),
    recipientName: Joi.string().trim().max(100).allow("", null),
    line1: Joi.string().trim().max(255).allow("", null),
    line2: Joi.string().trim().max(255).allow("", null),
    city: Joi.string().trim().max(100).allow("", null),
    state: Joi.string().trim().max(100).allow("", null),
    pin: Joi.string().trim().allow("", null),
    mobile: Joi.string().trim().allow("", null),
    phone: Joi.string().trim().allow("", null),
    address: Joi.string().trim().allow("", null),
    isDefault: Joi.boolean().default(false),
  });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};
