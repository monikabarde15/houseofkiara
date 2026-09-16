import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import Customer from "../models/Customer.js";

const JWT_SECRET = process.env.JWT_SECRET || "hok_super_secret_key_123";
const FAST2SMS_KEY = process.env.FAST2SMS_KEY || "";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID");

const generateToken = (id) => {
  return jwt.sign({ id, role: "customer" }, JWT_SECRET, { expiresIn: "30d" });
};

// 1. Register with Email
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const allCustomers = await Customer.find({}, 'customerId').exec();
    const existingNums = allCustomers
      .map(c => c.customerId)
      .filter(id => id && id.startsWith('CUST-'))
      .map(id => parseInt(id.replace('CUST-', ''), 10))
      .filter(n => !isNaN(n));
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
    const newCustId = `CUST-${String(maxNum + 1).padStart(5, '0')}`;

    const customer = new Customer({
      customerId: newCustId,
      name,
      email,
      phone: phone || "",
      passwordHash,
      wishlist: [],
      cart: []
    });
    
    await customer.save();

    res.status(201).json({
      success: true,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Login with Email
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });

    if (customer && customer.passwordHash && (await bcrypt.compare(password, customer.passwordHash))) {
      res.json({
        success: true,
        data: {
          _id: customer._id,
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          token: generateToken(customer._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      // Auto-create stub customer
      const allCustomers = await Customer.find({}, 'customerId').exec();
      const existingNums = allCustomers
        .map(c => c.customerId)
        .filter(id => id && id.startsWith('CUST-'))
        .map(id => parseInt(id.replace('CUST-', ''), 10))
        .filter(n => !isNaN(n));
      const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
      const newCustId = `CUST-${String(maxNum + 1).padStart(5, '0')}`;

      customer = new Customer({
        customerId: newCustId,
        name: "User",
        email: `user${Date.now()}@temp.com`,
        phone,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    customer.otp = await bcrypt.hash(otp, 10);
    customer.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 mins
    await customer.save();

    console.log(`[MOCK OTP] Sending ${otp} to ${phone}`);
    if (FAST2SMS_KEY) {
       await axios.get(`https://www.fast2sms.com/dev/bulkV2`, {
         params: {
           authorization: FAST2SMS_KEY,
           route: "v3",
           sender_id: "TXTIND",
           message: `Your House of Kaira login OTP is ${otp}. Valid for 10 minutes.`,
           language: "english",
           flash: 0,
           numbers: phone
         }
       });
    }

    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const customer = await Customer.findOne({ phone });
    if (!customer || !customer.otp) return res.status(400).json({ success: false, message: "Invalid request" });

    if (new Date() > new Date(customer.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, customer.otp);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    customer.otp = "";
    await customer.save();

    res.json({
      success: true,
      data: {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        token: generateToken(customer._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Password recovery.  The route is registered by customerAuthRoutes, so
// these exports must remain available even when the local authentication
// controller is merged with older customer-login changes.
export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const customer = await Customer.findOne({ email });
    // Do not reveal whether an account exists.
    if (!customer) {
      return res.json({ success: true, message: "If an account exists, password reset instructions have been created." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    customer.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    customer.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await customer.save();

    // Email delivery can be connected through the configured provider.  This
    // keeps the API usable locally without exposing the token in its response.
    console.log(`[PASSWORD RECOVERY] Reset link: http://localhost:3000/auth?resetToken=${token}`);
    return res.json({ success: true, message: "If an account exists, password reset instructions have been created." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to start password reset." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || req.body?.resetToken || "").trim();
    const password = String(req.body?.newPassword || req.body?.password || "");
    if (!token || password.length < 6) {
      return res.status(400).json({ success: false, message: "A valid reset token and password of at least 6 characters are required." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const customer = await Customer.findOne({ resetPasswordToken: hashedToken });
    if (!customer || !customer.resetPasswordExpiresAt || new Date() > new Date(customer.resetPasswordExpiresAt)) {
      return res.status(400).json({ success: false, message: "Password reset token is invalid or expired." });
    }

    customer.passwordHash = await bcrypt.hash(password, 10);
    customer.resetPasswordToken = "";
    customer.resetPasswordExpiresAt = null;
    await customer.save();
    return res.json({ success: true, message: "Password has been successfully updated. You can now sign in." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to reset password." });
  }
};

export const logout = async (_req, res) => {
  return res.json({ success: true, message: "Successfully logged out." });
};

// 7. Google Login
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (process.env.GOOGLE_CLIENT_ID) {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      const { email, name, sub } = payload;

      let customer = await Customer.findOne({ email });
      if (!customer) {
        const allCustomers = await Customer.find({}, 'customerId').exec();
        const existingNums = allCustomers
          .map(c => c.customerId)
          .filter(id => id && id.startsWith('CUST-'))
          .map(id => parseInt(id.replace('CUST-', ''), 10))
          .filter(n => !isNaN(n));
        const maxNum = existingNums.length > 0 ? Math.max(...existingNums) : 0;
        const newCustId = `CUST-${String(maxNum + 1).padStart(5, '0')}`;

        customer = new Customer({
          customerId: newCustId,
          name,
          email,
          googleId: sub,
        });
        await customer.save();
      }

      res.json({
        success: true,
        data: {
          _id: customer._id,
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          token: generateToken(customer._id)
        }
      });
    } else {
      res.status(400).json({ success: false, message: "Google Client ID not configured on backend" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id).select("-passwordHash -otp");
        if (!customer) return res.status(404).json({success: false, message: "Customer not found"});
        res.json({ success: true, data: customer });
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

export const toggleWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id);
        if (!customer) return res.status(404).json({success: false, message: "Customer not found"});
        
        const productId = req.params.productId;
        const index = customer.wishlist.indexOf(productId);
        
        if (index === -1) {
            customer.wishlist.push(productId);
        } else {
            customer.wishlist.splice(index, 1);
        }
        customer.wishlistCount = customer.wishlist.length;
        
        await customer.save();
        res.json({ success: true, data: customer.wishlist });
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id);
        if (!customer) return res.status(404).json({success: false, message: "Customer not found"});
        
        res.json({ success: true, data: customer.wishlist });
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
}
