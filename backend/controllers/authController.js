import crypto from "crypto";
import { promisify } from "util";
import Admin from "../models/Admin.js";

const scrypt = promisify(crypto.scrypt);
const hashPassword = async (password, salt = crypto.randomBytes(16).toString("hex")) => ({ salt, hash: (await scrypt(password, salt, 64)).toString("hex") });

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ success: false, message: "Name, email and password (8+ characters) are required." });
    if (await Admin.exists({})) return res.status(409).json({ success: false, message: "Admin is already registered. Please login." });
    const credentials = await hashPassword(password);
    await Admin.create({ name, email, passwordHash: credentials.hash, passwordSalt: credentials.salt });
    res.status(201).json({ success: true, message: "Admin registered successfully." });
  } catch (error) { res.status(500).json({ success: false, message: "Unable to register admin.", error: error.message }); }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid email or password." });
    const credentials = await hashPassword(password, admin.passwordSalt);
    if (!crypto.timingSafeEqual(Buffer.from(credentials.hash, "hex"), Buffer.from(admin.passwordHash, "hex"))) return res.status(401).json({ success: false, message: "Invalid email or password." });
    admin.sessionToken = crypto.randomBytes(32).toString("hex");
    await admin.save();
    res.json({ success: true, data: { token: admin.sessionToken, admin: { name: admin.name, email: admin.email } } });
  } catch (error) { res.status(500).json({ success: false, message: "Unable to login.", error: error.message }); }
};

export const getAuthStatus = async (_req, res) => res.json({ success: true, data: { registered: Boolean(await Admin.exists({})) } });
