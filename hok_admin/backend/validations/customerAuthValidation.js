import Joi from "joi";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpRegex = /^\d{6}$/;

const validatePhoneString = (rawPhone, helpers, isRequired = false) => {
  if (!rawPhone || !rawPhone.trim()) {
    if (isRequired) {
      return helpers.error("any.custom", {
        message: "Please enter a valid 10-digit mobile number",
      });
    }
    return true;
  }
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

export const validateCustomerRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().max(255).allow("", null),
    firstName: Joi.string().trim().max(100).allow("", null),
    lastName: Joi.string().trim().max(100).allow("", null),
    email: Joi.string()
      .trim()
      .pattern(emailRegex)
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.pattern.base": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "any.required": "Password is required",
      }),
    phone: Joi.string().trim().allow("", null),
    mobile: Joi.string().trim().allow("", null),
    verificationToken: Joi.string().trim().allow("", null),
    otp: Joi.string().trim().allow("", null),
    termsAccepted: Joi.boolean().allow(null),
    marketingAccepted: Joi.boolean().allow(null),
    marketingOptIn: Joi.boolean().allow(null),
  })
    .custom((value, helpers) => {
      const hasFullName = Boolean(value.name && value.name.trim());
      const hasFirstOrLast = Boolean(
        (value.firstName && value.firstName.trim()) ||
        (value.lastName && value.lastName.trim())
      );
      if (!hasFullName && !hasFirstOrLast) {
        return helpers.error("any.custom", {
          message: "First name or Full name is required",
        });
      }
      const rawPhone = value.phone || value.mobile;
      if (rawPhone && rawPhone.trim()) {
        const phoneValidation = validatePhoneString(rawPhone, helpers, false);
        if (phoneValidation !== true) return phoneValidation;
      }
      return value;
    })
    .messages({ "any.custom": "{{#message}}" });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateCustomerLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .pattern(emailRegex)
      .required()
      .messages({
        "string.empty": "Please enter your email address",
        "string.pattern.base": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
  });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateSendOtp = (data) => {
  const schema = Joi.object({
    phone: Joi.string().trim().allow("", null),
    mobile: Joi.string().trim().allow("", null),
  })
    .custom((value, helpers) => {
      const rawPhone = value.phone || value.mobile;
      return validatePhoneString(rawPhone, helpers, true) === true ? value : validatePhoneString(rawPhone, helpers, true);
    })
    .messages({ "any.custom": "{{#message}}" });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateVerifyOtp = (data) => {
  const schema = Joi.object({
    phone: Joi.string().trim().allow("", null),
    mobile: Joi.string().trim().allow("", null),
    otp: Joi.string()
      .trim()
      .pattern(otpRegex)
      .required()
      .messages({
        "string.empty": "OTP is required",
        "string.pattern.base": "OTP must be a 6-digit code",
        "any.required": "OTP is required",
      }),
  })
    .custom((value, helpers) => {
      const rawPhone = value.phone || value.mobile;
      return validatePhoneString(rawPhone, helpers, true) === true ? value : validatePhoneString(rawPhone, helpers, true);
    })
    .messages({ "any.custom": "{{#message}}" });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateForgotPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .trim()
      .pattern(emailRegex)
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.pattern.base": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
  });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};

export const validateResetPassword = (data) => {
  const schema = Joi.object({
    token: Joi.string().trim().allow("", null),
    resetToken: Joi.string().trim().allow("", null),
    newPassword: Joi.string().min(8).allow("", null),
    password: Joi.string().min(8).allow("", null),
    confirmPassword: Joi.string().allow("", null),
  })
    .custom((value, helpers) => {
      const effectiveToken = value.token || value.resetToken;
      if (!effectiveToken || !effectiveToken.trim()) {
        return helpers.error("any.custom", {
          message: "Reset token is required",
        });
      }
      const effectivePassword = value.newPassword || value.password;
      if (!effectivePassword || effectivePassword.length < 8) {
        return helpers.error("any.custom", {
          message: "Password must be at least 8 characters",
        });
      }
      if (value.confirmPassword && value.confirmPassword !== effectivePassword) {
        return helpers.error("any.custom", {
          message: "Passwords do not match",
        });
      }
      return value;
    })
    .messages({ "any.custom": "{{#message}}" });

  return schema.validate(data, { abortEarly: false, stripUnknown: true });
};
