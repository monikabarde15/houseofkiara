import Product from "../models/Product.js";
import { calculateProductLine } from "../services/pricingService.js";

const money = (n) => Math.round(Number(n || 0) * 100) / 100;
const date = (v) => { const d = new Date(v); d.setUTCHours(0, 0, 0, 0); return d; };

export const calculateProductQuote = async (req, res) => {
  try {
    const product = await Product.findOne({ $or: [{ productId: req.params.id }, { _id: req.params.id }] });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    const line = calculateProductLine(product, req.query);
    res.json({ success: true, data: { ...line, rentalAmount: line.mode === "Rental" ? line.amount : 0, saleAmount: line.mode !== "Rental" ? line.amount : 0, itemAmount: line.amount, taxAmount: line.gst, securityDeposit: line.deposit, subtotal: line.taxableAmount, grandTotal: line.lineTotal, currency: "INR" } });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};
