import crypto from "crypto";
import Customer from "../models/Customer.js";
import {
  validateProfileUpdate,
  validateAddressInput,
} from "../validations/customerProfileValidation.js";

const normalizePhone = (rawPhone) => {
  if (!rawPhone) return "";
  let digits = String(rawPhone).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

const sanitizeCustomer = (customer) => {
  const obj = typeof customer.toObject === "function" ? customer.toObject() : { ...customer };
  delete obj.passwordHash;
  delete obj.otp;
  delete obj.otpExpiresAt;
  delete obj.otpAttempts;
  delete obj.phoneVerified;
  delete obj.phoneVerifiedAt;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpiresAt;
  return obj;
};

// GET /api/customer/profile (or /api/customer/auth/me)
export const getProfile = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found.",
      });
    }

    return res.json({
      success: true,
      data: sanitizeCustomer(customer),
    });
  } catch (error) {
    console.error("GetProfile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve profile.",
    });
  }
};

// PUT /api/customer/profile
export const updateProfile = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { error, value } = validateProfileUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found.",
      });
    }

    // Check duplicate email if changing email
    if (value.email && value.email.toLowerCase().trim() !== customer.email) {
      const normalizedEmail = value.email.toLowerCase().trim();
      const existingEmail = await Customer.findOne({
        email: normalizedEmail,
        _id: { $ne: customer._id },
      });
      if (existingEmail && existingEmail.passwordHash) {
        return res.status(409).json({
          success: false,
          message: "Email address is already in use by another account.",
        });
      }
      customer.email = normalizedEmail;
    }

    // Check duplicate phone if changing phone
    const rawPhone = value.phone || value.mobile;
    if (rawPhone) {
      const normalizedPhone = normalizePhone(rawPhone);
      if (normalizedPhone && normalizedPhone !== customer.phone) {
        const existingPhone = await Customer.findOne({
          phone: normalizedPhone,
          _id: { $ne: customer._id },
        });
        if (existingPhone && existingPhone.passwordHash) {
          return res.status(409).json({
            success: false,
            message: "Mobile number is already in use by another account.",
          });
        }
        customer.phone = normalizedPhone;
      }
    }

    // Name resolution
    if (value.firstName !== undefined) customer.firstName = (value.firstName || "").trim();
    if (value.lastName !== undefined) customer.lastName = (value.lastName || "").trim();

    if (value.name && value.name.trim()) {
      customer.name = value.name.trim();
      if (!customer.firstName && !customer.lastName) {
        const parts = customer.name.split(" ");
        customer.firstName = parts[0] || "";
        customer.lastName = parts.slice(1).join(" ") || "";
      }
    } else {
      customer.name = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.name || "Customer";
    }

    // Location / City
    if (value.city !== undefined || value.location !== undefined) {
      const loc = (value.city || value.location || "").trim();
      customer.location = loc;
    }

    if (value.address !== undefined) {
      customer.address = (value.address || "").trim();
    }

    // Preferences
    if (value.preferences) {
      customer.preferences = {
        ...(customer.preferences || {}),
        ...value.preferences,
      };
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: sanitizeCustomer(customer),
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile.",
    });
  }
};

// POST /api/customer/profile/request-password-reset (or /api/customer/profile/change-password)
export const requestPasswordReset = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    customer.resetPasswordToken = hashedToken;
    customer.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await customer.save();

    const host = req.get("host") || "localhost:3000";
    const origin = req.get("origin") || `http://${host}`;
    const resetLink = `${origin}/auth?resetToken=${resetToken}`;

    console.log(`\n================== [PROFILE CHANGE PASSWORD REQUEST] ==================`);
    console.log(`👤 Customer Name  : ${customer.name}`);
    console.log(`📧 Customer Email : ${customer.email}`);
    console.log(`🔑 Reset Token    : ${resetToken}`);
    console.log(`🔗 Reset Link     : ${resetLink}`);
    console.log(`========================================================================\n`);

    return res.json({
      success: true,
      message: `A password reset link has been sent to ${customer.email}.`,
      data: {
        email: customer.email,
        resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken,
      },
    });
  } catch (error) {
    console.error("Request Password Reset Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process password reset request.",
    });
  }
};

// GET /api/customer/addresses
export const getAddresses = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.json({
      success: true,
      data: customer.addresses || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch addresses.",
    });
  }
};

// POST /api/customer/addresses
export const addAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { error, value } = validateAddressInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses = customer.addresses || [];
    const isDefault = value.isDefault || customer.addresses.length === 0;

    if (isDefault) {
      customer.addresses = customer.addresses.map((a) => {
        const item = typeof a.toObject === "function" ? a.toObject() : a;
        return { ...item, isDefault: false };
      });
    }

    const fullAddress = [value.line1, value.line2, value.city, value.state, value.pin].filter(Boolean).join(", ");

    const newAddress = {
      id: `addr_${Date.now()}`,
      label: value.label || "Home",
      recipientName: value.recipientName || customer.name || "",
      line1: value.line1 || value.address || "",
      line2: value.line2 || "",
      city: value.city || customer.location || "",
      state: value.state || "",
      pin: value.pin || "",
      mobile: value.mobile || value.phone || customer.phone || "",
      address: fullAddress,
      isDefault,
    };

    customer.addresses.push(newAddress);
    if (isDefault || !customer.location || customer.location === "India") {
      customer.location = fullAddress || value.city || customer.location;
    }
    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: customer.addresses,
    });
  } catch (error) {
    console.error("AddAddress Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add address.",
    });
  }
};

// PUT /api/customer/addresses/:addressId
export const updateAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { addressId } = req.params;
    const { error, value } = validateAddressInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses = customer.addresses || [];
    const index = customer.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (value.isDefault) {
      customer.addresses = customer.addresses.map((a) => {
        const item = typeof a.toObject === "function" ? a.toObject() : a;
        return { ...item, isDefault: false };
      });
    }

    const existingAddr = typeof customer.addresses[index].toObject === "function" ? customer.addresses[index].toObject() : customer.addresses[index];
    const mergedLine1 = value.line1 !== undefined ? value.line1 : existingAddr.line1;
    const mergedLine2 = value.line2 !== undefined ? value.line2 : existingAddr.line2;
    const mergedCity = value.city !== undefined ? value.city : existingAddr.city;
    const mergedState = value.state !== undefined ? value.state : existingAddr.state;
    const mergedPin = value.pin !== undefined ? value.pin : existingAddr.pin;

    const fullAddress = [mergedLine1, mergedLine2, mergedCity, mergedState, mergedPin].filter(Boolean).join(", ");

    customer.addresses[index] = {
      ...existingAddr,
      ...value,
      id: addressId,
      address: fullAddress || existingAddr.address,
    };

    if (customer.addresses[index].isDefault) {
      customer.location = fullAddress || customer.location;
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Address updated successfully.",
      data: customer.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update address.",
    });
  }
};

// DELETE /api/customer/addresses/:addressId
export const deleteAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { addressId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses = (customer.addresses || []).filter((a) => a.id !== addressId);
    if (customer.addresses.length > 0 && !customer.addresses.some((a) => a.isDefault)) {
      customer.addresses[0].isDefault = true;
    }

    const defaultAddr = customer.addresses.find((a) => a.isDefault);
    if (defaultAddr) {
      const addrObj = typeof defaultAddr.toObject === "function" ? defaultAddr.toObject() : defaultAddr;
      customer.location = addrObj.address || [addrObj.line1, addrObj.line2, addrObj.city, addrObj.state, addrObj.pin].filter(Boolean).join(", ");
    } else {
      customer.location = "";
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Address deleted successfully.",
      data: customer.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete address.",
    });
  }
};

// PATCH /api/customer/addresses/:addressId/default
export const setDefaultAddress = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const { addressId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    let found = false;
    let selectedAddr = null;
    customer.addresses = (customer.addresses || []).map((a) => {
      const item = typeof a.toObject === "function" ? a.toObject() : a;
      const matches = item.id === addressId;
      if (matches) {
        found = true;
        selectedAddr = item;
      }
      return { ...item, isDefault: matches };
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    if (selectedAddr) {
      customer.location = selectedAddr.address || [selectedAddr.line1, selectedAddr.line2, selectedAddr.city, selectedAddr.state, selectedAddr.pin].filter(Boolean).join(", ");
    }

    await customer.save();

    return res.json({
      success: true,
      message: "Default address updated.",
      data: customer.addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to set default address.",
    });
  }
};
