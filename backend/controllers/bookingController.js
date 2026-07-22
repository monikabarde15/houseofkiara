import Product from "../models/Product.js";
import { validateBookingDates } from "../validations/bookingValidation.js";

const dateOnly = (v) => { const d = new Date(v); d.setUTCHours(0, 0, 0, 0); return d; };
const overlaps = (a, b, c, d) => dateOnly(a) <= dateOnly(d) && dateOnly(b) >= dateOnly(c);

export const reserveProduct = async (req, res) => {
  const { error, value } = validateBookingDates(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details.map((d) => d.message).join("; ") });
  try {
    const product = await Product.findOne({ $or: [{ productId: req.params.id }, { _id: req.params.id }] });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.status !== "Live" || product.availability !== "Available Now") return res.status(409).json({ success: false, message: "Product is not currently bookable" });
    if (!product.listingModes.includes(value.mode)) return res.status(409).json({ success: false, message: "Selected listing mode is unavailable" });
    const days = Math.floor((dateOnly(value.endDate) - dateOnly(value.startDate)) / 86400000) + 1;
    if (value.mode === "Rental" && days < product.minimumDurationDays) return res.status(409).json({ success: false, message: `Minimum rental duration is ${product.minimumDurationDays} days` });
    const buffer = Number(product.cleaningBufferDays || 0); const start = dateOnly(value.startDate); const end = dateOnly(value.endDate); const occupiedStart = new Date(start); occupiedStart.setUTCDate(start.getUTCDate() - buffer); const occupiedEnd = new Date(end); occupiedEnd.setUTCDate(end.getUTCDate() + buffer);
    const allBookings = [...(product.bookingHistory || []), ...(product.externalBookings || [])];
    if ((product.blockedDates || []).some((b) => overlaps(occupiedStart, occupiedEnd, b.from, b.to))) return res.status(409).json({ success: false, message: "Requested dates are blocked" });
    if (allBookings.some((b) => b.startDate && b.endDate && b.orderId !== value.excludeOrderId && !["Cancelled", "Rejected"].includes(b.status) && overlaps(occupiedStart, occupiedEnd, b.startDate, b.endDate))) return res.status(409).json({ success: false, message: "Requested dates are already booked" });
    const booking = { orderId: req.body.orderId || `RES-${Date.now()}`, customerName: req.body.customerName || "", date: value.startDate, startDate: value.startDate, endDate: value.endDate, amount: Number(req.body.amount || 0), deposit: Number(req.body.deposit || 0), mode: value.mode, status: "Reserved", source: "Admin" };
    const locked = await Product.findOneAndUpdate({ _id: product._id, status: "Live", availability: "Available Now", bookingHistory: { $not: { $elemMatch: { startDate: { $lte: occupiedEnd.toISOString() }, endDate: { $gte: occupiedStart.toISOString() }, status: { $nin: ["Cancelled", "Rejected"] } } } }, externalBookings: { $not: { $elemMatch: { startDate: { $lte: occupiedEnd.toISOString() }, endDate: { $gte: occupiedStart.toISOString() }, status: { $nin: ["Cancelled", "Rejected"] } } } } }, { $push: { bookingHistory: booking, activityLog: { action: "Booking reserved", user: req.body.createdBy || "Admin", remarks: `${value.startDate} to ${value.endDate}` } } }, { new: true });
    if (!locked) return res.status(409).json({ success: false, message: "Product was booked by another request; please choose different dates" });
    res.status(201).json({ success: true, data: { productId: locked.productId, booking, durationDays: days, cleaningBufferDays: buffer } });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
};
