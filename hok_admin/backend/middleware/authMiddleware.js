import Admin from "../models/Admin.js";

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

export default requireAuth;
