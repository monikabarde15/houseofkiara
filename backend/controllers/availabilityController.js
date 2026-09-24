import Product from "../models/Product.js";
import { validateBookingDates } from "../validations/bookingValidation.js";

const day = (value) => { const d = new Date(value); d.setUTCHours(0, 0, 0, 0); return d; };
const overlaps = (aStart, aEnd, bStart, bEnd) => day(aStart) <= day(bEnd) && day(aEnd) >= day(bStart);

export const checkProductAvailability = async (req, res) => {
  try {
    const { error, value } = validateBookingDates(req.query);
    if (error) return res.status(422).json({ success: false, available: false, message: error.details.map((d) => d.message).join("; ") });
    const product = await Product.findOne({ $or: [{ productId: req.params.id }, { _id: req.params.id }] });
    if (!product) return res.status(404).json({ success: false, available: false, message: "Product not found" });
    if (product.status !== "Live") return res.status(409).json({ success: false, available: false, reason: "PRODUCT_NOT_LIVE", message: "This product is not live" });
    if (product.availability !== "Available Now") return res.status(409).json({ success: false, available: false, reason: "PRODUCT_UNAVAILABLE", message: `Product is currently ${product.availability}` });
    if (!product.listingModes.includes(value.mode)) return res.status(409).json({ success: false, available: false, reason: "MODE_UNAVAILABLE", message: `${value.mode} mode is not available for this product` });
    const duration = Math.floor((day(value.endDate) - day(value.startDate)) / 86400000) + 1;
    if (value.mode === "Rental" && duration < product.minimumDurationDays) return res.status(409).json({ success: false, available: false, reason: "MINIMUM_DURATION", message: `Minimum rental duration is ${product.minimumDurationDays} days` });
    const requestedStart = day(value.startDate); const requestedEnd = day(value.endDate); const buffer = Number(product.cleaningBufferDays || 0);
    const occupiedStart = new Date(requestedStart); occupiedStart.setUTCDate(occupiedStart.getUTCDate() - buffer);
    const occupiedEnd = new Date(requestedEnd); occupiedEnd.setUTCDate(occupiedEnd.getUTCDate() + buffer);
    const blocked = (product.blockedDates || []).find((range) => overlaps(occupiedStart, occupiedEnd, range.from, range.to));
    if (blocked) return res.status(409).json({ success: false, available: false, reason: "BLOCKED_DATE", message: `Product is blocked during the requested dates (${blocked.reason})` });
    const booking = (product.bookingHistory || []).find((item) => item.orderId !== value.excludeOrderId && item.startDate && item.endDate && overlaps(occupiedStart, occupiedEnd, item.startDate, item.endDate) && !["Cancelled", "Rejected"].includes(item.status));
    if (booking) return res.status(409).json({ success: false, available: false, reason: "DATE_CONFLICT", message: "Product is already booked for the requested dates" });
    res.json({ success: true, available: true, data: { productId: product.productId, startDate: value.startDate, endDate: value.endDate, durationDays: duration, cleaningBufferDays: buffer } });
  } catch (e) { res.status(500).json({ success: false, available: false, message: e.message }); }
};
