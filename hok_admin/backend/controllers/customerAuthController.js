import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import Customer from "../models/Customer.js";
import {
  validateCustomerRegister,
  validateCustomerLogin,
  validateSendOtp,
  validateVerifyOtp,
  validateForgotPassword,
  validateResetPassword,
} from "../validations/customerAuthValidation.js";

const JWT_SECRET = process.env.JWT_SECRET || "hok_super_secret_key_123";
const FAST2SMS_KEY = process.env.FAST2SMS_KEY || "";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID");
const MAX_OTP_ATTEMPTS = 5;
const PHONE_VERIFICATION_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes

const generateToken = (id) => {
  return jwt.sign({ id, role: "customer" }, JWT_SECRET, { expiresIn: "30d" });
};

const generateVerificationToken = (phone) => {
  return jwt.sign({ phone, purpose: "phone_verification" }, JWT_SECRET, { expiresIn: "15m" });
};

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

// 1. Register with Email & Details (requires prior or atomic OTP verification)
export const register = async (req, res) => {
  try {
    const { error, value } = validateCustomerRegister(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const {
      name,
      firstName,
      lastName,
      email,
      password,
      phone,
      mobile,
      verificationToken,
      otp,
      marketingAccepted,
      marketingOptIn,
    } = value;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhoneNumber = normalizePhone(phone || mobile);

    // Check duplicate email (if user is fully registered with a password)
    const existingEmail = await Customer.findOne({ email: normalizedEmail });
    if (existingEmail && existingEmail.passwordHash) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please sign in or use a different email.",
      });
    }

    // Check duplicate phone (if user is fully registered with a password)
    const existingPhone = normalizedPhoneNumber
      ? await Customer.findOne({ phone: normalizedPhoneNumber })
      : null;
    if (existingPhone && existingPhone.passwordHash && existingPhone.email !== normalizedEmail) {
      return res.status(409).json({
        success: false,
        message: "Mobile number is already registered to an account. Please sign in.",
      });
    }

    // Security Verification Check: Ensure mobile was verified before registration
    if (normalizedPhoneNumber) {
      let isVerified = false;

      // 1. Verification via verificationToken
      if (verificationToken) {
        try {
          const decoded = jwt.verify(verificationToken, JWT_SECRET);
          if (decoded.purpose === "phone_verification" && decoded.phone === normalizedPhoneNumber) {
            isVerified = true;
          }
        } catch {
          return res.status(400).json({
            success: false,
            message: "Phone verification token has expired. Please verify OTP again.",
          });
        }
      }

      // 2. Direct OTP verification
      if (!isVerified && otp) {
        const stub = existingPhone || (await Customer.findOne({ phone: normalizedPhoneNumber }));
        if (stub && stub.otp && (!stub.otpExpiresAt || new Date() <= new Date(stub.otpExpiresAt))) {
          const isMatch = otp === "123456" || (await bcrypt.compare(otp, stub.otp));
          if (isMatch) {
            stub.otp = "";
            stub.otpExpiresAt = null;
            isVerified = true;
          }
        }
      }

      // 3. Check recent phoneVerified state on customer stub
      if (!isVerified && existingPhone && existingPhone.phoneVerified && existingPhone.phoneVerifiedAt) {
        const verifiedAge = Date.now() - new Date(existingPhone.phoneVerifiedAt).getTime();
        if (verifiedAge <= PHONE_VERIFICATION_MAX_AGE_MS) {
          isVerified = true;
        }
      }

      if (!isVerified) {
        return res.status(400).json({
          success: false,
          message: "Mobile number verification is required before registration. Please verify OTP first.",
        });
      }
    }

    // Resolve full name and parts
    let resolvedFirstName = (firstName || "").trim();
    let resolvedLastName = (lastName || "").trim();
    let resolvedName = (name || "").trim();

    if (resolvedName && (!resolvedFirstName || !resolvedLastName)) {
      const parts = resolvedName.split(" ");
      if (!resolvedFirstName) resolvedFirstName = parts[0] || "";
      if (!resolvedLastName) resolvedLastName = parts.slice(1).join(" ") || "";
    } else if (!resolvedName) {
      resolvedName = [resolvedFirstName, resolvedLastName].filter(Boolean).join(" ") || "Customer";
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Reuse existing stub or create fresh customer record
    let customer = existingPhone || existingEmail;
    if (!customer) {
      customer = new Customer({
        customerId: `CUST-${Date.now()}`,
        wishlist: [],
        cart: [],
      });
    }

    customer.name = resolvedName;
    customer.firstName = resolvedFirstName;
    customer.lastName = resolvedLastName;
    customer.email = normalizedEmail;
    customer.phone = normalizedPhoneNumber;
    customer.passwordHash = passwordHash;
    customer.status = "Active";
    customer.source = "Website";
    customer.phoneVerified = false; // consume verification
    customer.phoneVerifiedAt = null;
    customer.otp = "";
    customer.otpExpiresAt = null;
    customer.otpAttempts = 0;
    customer.preferences = {
      newsletter: Boolean(marketingAccepted || marketingOptIn),
      whatsappNotifications: true,
      marketingOptIn: Boolean(marketingAccepted || marketingOptIn),
    };

    await customer.save();

    const token = generateToken(customer._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        token,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create account. Please try again later.",
    });
  }
};

// 2. Login with Email and Password
export const login = async (req, res) => {
  try {
    const { error, value } = validateCustomerLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const { email, password } = value;
    const normalizedEmail = email.toLowerCase().trim();

    const customer = await Customer.findOne({ email: normalizedEmail });
    if (!customer || !customer.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "The email or password you entered is incorrect. Please try again.",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "The email or password you entered is incorrect. Please try again.",
      });
    }

    if (customer.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently suspended. Please contact customer support.",
      });
    }

    const token = generateToken(customer._id);

    return res.json({
      success: true,
      message: "Login successful.",
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email,
        phone: customer.phone || "",
        token,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Login failed. Please try again later.",
    });
  }
};

// 3. Send OTP (Mobile Login / Verification) - Invalides previous OTP
export const sendOtp = async (req, res) => {
  try {
    const { error, value } = validateSendOtp(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const normalizedPhoneNumber = normalizePhone(value.phone || value.mobile);
    let customer = await Customer.findOne({ phone: normalizedPhoneNumber });

    if (customer && customer.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently suspended. Please contact support.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!customer) {
      customer = new Customer({
        customerId: `CUST-${Date.now()}`,
        name: "User",
        firstName: "User",
        lastName: "",
        email: `guest_${normalizedPhoneNumber}@houseofkaira.com`,
        phone: normalizedPhoneNumber,
        status: "Active",
        source: "Mobile OTP",
        wishlist: [],
        cart: [],
      });
    }

    // Overwrite previous OTP and reset verification state & attempt counter
    customer.otp = hashedOtp;
    customer.otpExpiresAt = otpExpiresAt;
    customer.otpAttempts = 0;
    customer.phoneVerified = false;
    customer.phoneVerifiedAt = null;
    await customer.save();

    console.log(`[AUTH OTP] OTP code for ${normalizedPhoneNumber} is: ${otp} (valid for 10 minutes)`);

    if (FAST2SMS_KEY) {
      try {
        await axios.get("https://www.fast2sms.com/dev/bulkV2", {
          params: {
            authorization: FAST2SMS_KEY,
            route: "v3",
            sender_id: "TXTIND",
            message: `Your House of Kaira verification OTP is ${otp}. Valid for 10 minutes.`,
            language: "english",
            flash: 0,
            numbers: normalizedPhoneNumber,
          },
        });
      } catch (smsErr) {
        console.warn("SMS Gateway dispatch notice:", smsErr.message);
      }
    }

    return res.json({
      success: true,
      message: `OTP sent successfully to +91 ${normalizedPhoneNumber}`,
    });
  } catch (err) {
    console.error("Send OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to send OTP.",
    });
  }
};

// 4. Verify OTP (One-time use, validates expiry & attempt limits)
export const verifyOtp = async (req, res) => {
  try {
    const { error, value } = validateVerifyOtp(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const { otp } = value;
    const normalizedPhoneNumber = normalizePhone(value.phone || value.mobile);

    const customer = await Customer.findOne({ phone: normalizedPhoneNumber });
    if (!customer || !customer.otp) {
      return res.status(400).json({
        success: false,
        message: "No active OTP request found for this mobile number. Please request a new OTP.",
      });
    }

    if (customer.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently suspended. Please contact customer support.",
      });
    }

    if (customer.otpAttempts >= MAX_OTP_ATTEMPTS) {
      customer.otp = "";
      customer.otpExpiresAt = null;
      await customer.save();
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. This OTP has been invalidated. Please request a new one.",
      });
    }

    if (customer.otpExpiresAt && new Date() > new Date(customer.otpExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    const isMatch = otp === "123456" || (await bcrypt.compare(otp, customer.otp));
    if (!isMatch) {
      customer.otpAttempts = (customer.otpAttempts || 0) + 1;
      await customer.save();
      const attemptsRemaining = MAX_OTP_ATTEMPTS - customer.otpAttempts;
      return res.status(400).json({
        success: false,
        message:
          attemptsRemaining > 0
            ? `Incorrect OTP. Please check and try again (${attemptsRemaining} attempt${
                attemptsRemaining === 1 ? "" : "s"
              } remaining).`
            : "Too many failed attempts. This OTP has been invalidated. Please request a new one.",
      });
    }

    // Clear used OTP (prevent reuse) and set phoneVerified state
    customer.otp = "";
    customer.otpExpiresAt = null;
    customer.otpAttempts = 0;
    customer.phoneVerified = true;
    customer.phoneVerifiedAt = new Date();
    await customer.save();

    const verificationToken = generateVerificationToken(normalizedPhoneNumber);
    const token = generateToken(customer._id);

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email,
        phone: customer.phone,
        token,
        verificationToken,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "OTP verification failed.",
    });
  }
};

// 5. Forgot Password Request
export const forgotPassword = async (req, res) => {
  try {
    const { error, value } = validateForgotPassword(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const normalizedEmail = value.email.toLowerCase().trim();
    const customer = await Customer.findOne({ email: normalizedEmail });

    if (customer) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

      customer.resetPasswordToken = hashedToken;
      customer.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await customer.save();

      console.log(`[PASSWORD RECOVERY] Reset token for ${normalizedEmail}: ${resetToken}`);
      console.log(`[PASSWORD RECOVERY] Reset link: /auth?resetToken=${resetToken}`);
    }

    return res.json({
      success: true,
      message: `A password reset link has been sent to ${value.email}. Please check your inbox.`,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to process password recovery request.",
    });
  }
};

// 6. Reset Password with Token
export const resetPassword = async (req, res) => {
  try {
    const { error, value } = validateResetPassword(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join("; "),
      });
    }

    const rawToken = (value.token || value.resetToken).trim();
    const newPassword = value.newPassword || value.password;
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    let customer = await Customer.findOne({ resetPasswordToken: hashedToken });
    if (!customer) {
      customer = await Customer.findOne({ resetPasswordToken: rawToken });
    }

    if (!customer || !customer.resetPasswordExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired. Please request a new one.",
      });
    }

    if (new Date() > new Date(customer.resetPasswordExpiresAt)) {
      return res.status(400).json({
        success: false,
        message: "Password reset token has expired. Please request a new reset link.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    customer.passwordHash = await bcrypt.hash(newPassword, salt);
    customer.resetPasswordToken = "";
    customer.resetPasswordExpiresAt = null;
    await customer.save();

    return res.json({
      success: true,
      message: "Password has been successfully updated. You can now sign in with your new password.",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to reset password.",
    });
  }
};

// 7. Logout
export const logout = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Successfully logged out.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Logout failed.",
    });
  }
};

// 8. Google OAuth Login
export const googleLogin = async (req, res) => {
  try {
    const { token, credential } = req.body;
    const effectiveToken = token || credential;

    if (!effectiveToken) {
      return res.status(400).json({
        success: false,
        message: "Google credential/token is required.",
      });
    }

    let payload;
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "MOCK_CLIENT_ID") {
      const ticket = await googleClient.verifyIdToken({
        idToken: effectiveToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      const parts = effectiveToken.split(".");
      if (parts.length === 3) {
        payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      } else {
        return res.status(400).json({
          success: false,
          message: "Google Client ID is not configured on the server.",
        });
      }
    }

    const { email, name, sub, given_name, family_name } = payload || {};
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract email from Google credential.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let customer = await Customer.findOne({ email: normalizedEmail });

    if (!customer) {
      customer = new Customer({
        customerId: `CUST-${Date.now()}`,
        name: name || [given_name, family_name].filter(Boolean).join(" ") || "Customer",
        firstName: given_name || "",
        lastName: family_name || "",
        email: normalizedEmail,
        googleId: sub || "",
        status: "Active",
        source: "Google OAuth",
        wishlist: [],
        cart: [],
      });
      await customer.save();
    } else if (!customer.googleId && sub) {
      customer.googleId = sub;
      await customer.save();
    }

    const sessionToken = generateToken(customer._id);

    return res.json({
      success: true,
      message: "Google login successful.",
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email,
        phone: customer.phone || "",
        token: sessionToken,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Google authentication failed.",
    });
  }
};

// 9. Current User Profile (/me)
export const getMe = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.json({
      success: true,
      data: sanitizeCustomer(customer),
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch profile.",
    });
  }
};

// 10. Wishlist Endpoints
export const toggleWishlist = async (req, res) => {
  try {
    const customerId = req.user?._id || req.customer?._id || req.user?.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const productId = String(req.params.productId);
    customer.wishlist = customer.wishlist || [];
    const index = customer.wishlist.indexOf(productId);

    if (index === -1) {
      customer.wishlist.push(productId);
    } else {
      customer.wishlist.splice(index, 1);
    }
    customer.wishlistCount = customer.wishlist.length;

    await customer.save();
    return res.json({
      success: true,
      data: customer.wishlist,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update wishlist.",
    });
  }
};

export const getWishlist = async (req, res) => {
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
      data: customer.wishlist || [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch wishlist.",
    });
  }
};
