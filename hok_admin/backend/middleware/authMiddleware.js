import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Customer from "../models/Customer.js";

const JWT_SECRET = process.env.JWT_SECRET || "hok_super_secret_key_123";

export const requireCustomerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required (Bearer format).",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session has expired. Please sign in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token.",
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Malformed authorization token.",
      });
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer account not found or session expired.",
      });
    }

    if (customer.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently suspended. Please contact support.",
      });
    }

    req.user = customer;
    req.customer = customer;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
      error: error.message,
    });
  }
};

export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required (Bearer format).",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    const admin = await Admin.findOne({ sessionToken: token });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session token.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
      error: error.message,
    });
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required (Bearer format).",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing.",
      });
    }

    // Try Admin session token lookup first
    const admin = await Admin.findOne({ sessionToken: token });
    if (admin) {
      req.admin = admin;
      return next();
    }

    // Fallback: Try JWT verification for Customer
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) {
        const customer = await Customer.findById(decoded.id);
        if (customer) {
          if (customer.status === "Suspended") {
            return res.status(403).json({
              success: false,
              message: "Account is suspended.",
            });
          }
          req.user = customer;
          req.customer = customer;
          return next();
        }
      }
    } catch (_) {}

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
      error: error.message,
    });
  }
};

export default requireAuth;
