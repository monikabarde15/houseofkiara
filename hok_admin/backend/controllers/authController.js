import crypto from "crypto";
import { promisify } from "util";
import Admin from "../models/Admin.js";

const scrypt = promisify(crypto.scrypt);
const hashPassword = async (password, salt = crypto.randomBytes(16).toString("hex")) => ({
  salt,
  hash: (await scrypt(password, salt, 64)).toString("hex"),
});

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password (8+ characters) are required.",
      });
    }

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email is already registered.",
      });
    }

    const credentials = await hashPassword(password);
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const admin = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: credentials.hash,
      passwordSalt: credentials.salt,
      sessionToken,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      data: {
        token: sessionToken,
        admin: { name: admin.name, email: admin.email },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to register admin.",
      error: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const credentials = await hashPassword(password, admin.passwordSalt);
    const submittedHash = Buffer.from(String(credentials.hash || ""), "hex");
    const storedHash = Buffer.from(String(admin.passwordHash || ""), "hex");
    if (
      submittedHash.length === 0 ||
      storedHash.length === 0 ||
      submittedHash.length !== storedHash.length ||
      !crypto.timingSafeEqual(submittedHash, storedHash)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    admin.sessionToken = sessionToken;
    await admin.save();

    return res.json({
      success: true,
      message: "Login successful.",
      data: {
        token: sessionToken,
        admin: { name: admin.name, email: admin.email },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to login.",
      error: error.message,
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.body?.token) {
      token = req.body.token;
    }

    if (token) {
      const admin = await Admin.findOne({ sessionToken: token });
      if (admin) {
        admin.sessionToken = null;
        await admin.save();
      }
    }

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to logout.",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    return res.json({
      success: true,
      data: {
        admin: { name: req.admin.name, email: req.admin.email },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admin profile.",
      error: error.message,
    });
  }
};

export const getAuthStatus = async (_req, res) => {
  try {
    const hasAdmin = Boolean(await Admin.exists({}));
    return res.json({
      success: true,
      data: {
        registered: hasAdmin,
        initialized: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to check auth status.",
      error: error.message,
    });
  }
};

export const getAdmins = async (_req, res) => {
  try {
    const admins = await Admin.find({}, { name: 1, email: 1 });
    return res.json({
      success: true,
      data: admins.map(a => ({ id: a._id, name: a.name, email: a.email })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch admins.",
      error: error.message,
    });
  }
};
