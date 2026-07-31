// controllers/bookingController.js

import Product from "../models/Product.js";
import { validateBookingDates } from "../validations/bookingValidation.js";

const dateOnly = (v) => { 
  const d = new Date(v); 
  d.setUTCHours(0, 0, 0, 0); 
  return d; 
};

const overlaps = (a, b, c, d) => 
  dateOnly(a) <= dateOnly(d) && dateOnly(b) >= dateOnly(c);

// ✅ NEW: Check product availability (for route /:id/availability)
export const checkProductAvailability = async (req, res) => {
  try {
    const { startDate, endDate, mode, excludeOrderId } = req.query;
    
    // Validate input
    if (!startDate || !endDate) {
      return res.status(422).json({ 
        success: false, 
        available: false, 
        message: "startDate and endDate are required" 
      });
    }

    const product = await Product.findOne({ 
      $or: [{ productId: req.params.id }, { _id: req.params.id }] 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        available: false, 
        message: "Product not found" 
      });
    }

    // Check if product is live
    if (product.status !== "Live") {
      return res.status(409).json({ 
        success: false, 
        available: false, 
        reason: "PRODUCT_NOT_LIVE", 
        message: "This product is not live" 
      });
    }

    // Check availability
    if (product.availability !== "Available Now") {
      return res.status(409).json({ 
        success: false, 
        available: false, 
        reason: "PRODUCT_UNAVAILABLE", 
        message: `Product is currently ${product.availability}` 
      });
    }

    // Check listing modes
    const listingModes = product.listingModes || ["RENTAL"];
    if (mode && !listingModes.includes(mode)) {
      return res.status(409).json({ 
        success: false, 
        available: false, 
        reason: "MODE_UNAVAILABLE", 
        message: `${mode} mode is not available for this product` 
      });
    }

    // Check minimum duration
    const duration = Math.floor((dateOnly(endDate) - dateOnly(startDate)) / 86400000) + 1;
    const minDuration = product.minimumDurationDays || 3;
    
    if (mode === "RENTAL" && duration < minDuration) {
      return res.status(409).json({ 
        success: false, 
        available: false, 
        reason: "MINIMUM_DURATION", 
        message: `Minimum rental duration is ${minDuration} days` 
      });
    }

    // Check buffer days
    const buffer = Number(product.cleaningBufferDays || 0);
    const requestedStart = dateOnly(startDate);
    const requestedEnd = dateOnly(endDate);
    
    const occupiedStart = new Date(requestedStart);
    occupiedStart.setUTCDate(occupiedStart.getUTCDate() - buffer);
    
    const occupiedEnd = new Date(requestedEnd);
    occupiedEnd.setUTCDate(occupiedEnd.getUTCDate() + buffer);

    // Check blocked dates
    const blockedDates = product.blockedDates || [];
    const blocked = blockedDates.find((range) => 
      overlaps(occupiedStart, occupiedEnd, range.from, range.to)
    );
    
    if (blocked) {
      return res.status(409).json({ 
        success: false, 
        available: false, 
        reason: "BLOCKED_DATE", 
        message: `Product is blocked during the requested dates (${blocked.reason})` 
      });
    }

    // Check booking conflicts (both bookingHistory and externalBookings)
    const allBookings = [
      ...(product.bookingHistory || []), 
      ...(product.externalBookings || [])
    ];
    
    const booking = allBookings.find(
      (item) => 
        item.orderId !== excludeOrderId && 
        item.startDate && 
        item.endDate && 
        overlaps(occupiedStart, occupiedEnd, item.startDate, item.endDate) && 
        !["Cancelled", "Rejected"].includes(item.status)
    );
    
    if (booking) {
      return res.status(409).json({ 
        success: false, 
        available: false, 
        reason: "DATE_CONFLICT", 
        message: "Product is already booked for the requested dates" 
      });
    }

    // All checks passed - product is available
    res.json({ 
      success: true, 
      available: true, 
      data: { 
        productId: product.productId, 
        startDate, 
        endDate, 
        durationDays: duration, 
        cleaningBufferDays: buffer 
      } 
    });

  } catch (e) {
    res.status(500).json({ 
      success: false, 
      available: false, 
      message: e.message 
    });
  }
};

// ✅ NEW: Get product calendar data
export const getProductCalendar = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      $or: [{ productId: req.params.id }, { _id: req.params.id }] 
    });
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ 
      success: true, 
      data: {
        blockedDates: product.blockedDates || [],
        bookingHistory: product.bookingHistory || [],
        externalBookings: product.externalBookings || []
      }
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ NEW: Add external booking
export const addExternalBooking = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      $or: [{ productId: req.params.id }, { _id: req.params.id }] 
    });
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { 
      customerName, 
      startDate, 
      endDate, 
      amount, 
      whatsappNumber, 
      city, 
      channel, 
      listerSplitPercent, 
      splitNote 
    } = req.body;

    // Validate dates
    if (!startDate || !endDate || !customerName) {
      return res.status(422).json({ 
        success: false, 
        message: "startDate, endDate and customerName are required" 
      });
    }

    // Check availability first
    const buffer = Number(product.cleaningBufferDays || 0);
    const requestedStart = dateOnly(startDate);
    const requestedEnd = dateOnly(endDate);
    
    const occupiedStart = new Date(requestedStart);
    occupiedStart.setUTCDate(occupiedStart.getUTCDate() - buffer);
    
    const occupiedEnd = new Date(requestedEnd);
    occupiedEnd.setUTCDate(occupiedEnd.getUTCDate() + buffer);

    const allBookings = [
      ...(product.bookingHistory || []), 
      ...(product.externalBookings || [])
    ];
    
    const bookingConflict = allBookings.find(
      (item) => 
        item.startDate && 
        item.endDate && 
        overlaps(occupiedStart, occupiedEnd, item.startDate, item.endDate) && 
        !["Cancelled", "Rejected"].includes(item.status)
    );
    
    if (bookingConflict) {
      return res.status(409).json({ 
        success: false, 
        message: "Product is already booked for the requested dates" 
      });
    }

    // Create external booking entry
    const externalBooking = {
      orderId: `EXT-${Date.now()}`,
      customerName,
      startDate,
      endDate,
      amount: amount || 0,
      deposit: 0,
      mode: "RENTAL",
      status: "Confirmed",
      source: "External",
      whatsappNumber: whatsappNumber || "",
      city: city || "",
      channel: channel || "WhatsApp",
      listerSplitPercent: listerSplitPercent || 45,
      splitNote: splitNote || "",
      depositStatus: "Pending"
    };

    // Add to booking history
    if (!product.bookingHistory) {
      product.bookingHistory = [];
    }
    product.bookingHistory.push(externalBooking);
    
    // Also add to external bookings
    if (!product.externalBookings) {
      product.externalBookings = [];
    }
    product.externalBookings.push(externalBooking);

    // Add to blocked dates
    if (!product.blockedDates) {
      product.blockedDates = [];
    }
    product.blockedDates.push({
      from: startDate,
      to: endDate,
      reason: `External booking - ${customerName}`
    });

    // Add activity log
    if (!product.activityLog) {
      product.activityLog = [];
    }
    product.activityLog.push({
      action: "External booking added",
      user: req.body.user || "Admin",
      remarks: `${customerName} - ${startDate} to ${endDate}`
    });

    await product.save();

    res.json({ 
      success: true, 
      data: externalBooking,
      message: "External booking added successfully" 
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ✅ EXISTING: Reserve product
export const reserveProduct = async (req, res) => {
  const { error, value } = validateBookingDates(req.body);
  if (error) return res.status(422).json({ 
    success: false, 
    message: error.details.map((d) => d.message).join("; ") 
  });
  
  try {
    const product = await Product.findOne({ 
      $or: [{ productId: req.params.id }, { _id: req.params.id }] 
    });
    
    if (!product) return res.status(404).json({ 
      success: false, 
      message: "Product not found" 
    });
    
    if (product.status !== "Live" || product.availability !== "Available Now") {
      return res.status(409).json({ 
        success: false, 
        message: "Product is not currently bookable" 
      });
    }
    
    if (!product.listingModes.includes(value.mode)) {
      return res.status(409).json({ 
        success: false, 
        message: "Selected listing mode is unavailable" 
      });
    }
    
    const days = Math.floor((dateOnly(value.endDate) - dateOnly(value.startDate)) / 86400000) + 1;
    if (value.mode === "Rental" && days < product.minimumDurationDays) {
      return res.status(409).json({ 
        success: false, 
        message: `Minimum rental duration is ${product.minimumDurationDays} days` 
      });
    }
    
    const buffer = Number(product.cleaningBufferDays || 0);
    const start = dateOnly(value.startDate);
    const end = dateOnly(value.endDate);
    const occupiedStart = new Date(start);
    occupiedStart.setUTCDate(start.getUTCDate() - buffer);
    const occupiedEnd = new Date(end);
    occupiedEnd.setUTCDate(end.getUTCDate() + buffer);
    
    const allBookings = [...(product.bookingHistory || []), ...(product.externalBookings || [])];
    
    if ((product.blockedDates || []).some((b) => overlaps(occupiedStart, occupiedEnd, b.from, b.to))) {
      return res.status(409).json({ 
        success: false, 
        message: "Requested dates are blocked" 
      });
    }
    
    if (allBookings.some((b) => b.startDate && b.endDate && b.orderId !== value.excludeOrderId && !["Cancelled", "Rejected"].includes(b.status) && overlaps(occupiedStart, occupiedEnd, b.startDate, b.endDate))) {
      return res.status(409).json({ 
        success: false, 
        message: "Requested dates are already booked" 
      });
    }
    
    const booking = { 
      orderId: req.body.orderId || `RES-${Date.now()}`, 
      customerName: req.body.customerName || "", 
      date: value.startDate, 
      startDate: value.startDate, 
      endDate: value.endDate, 
      amount: Number(req.body.amount || 0), 
      deposit: Number(req.body.deposit || 0), 
      mode: value.mode, 
      status: "Reserved", 
      source: "Admin" 
    };
    
    const locked = await Product.findOneAndUpdate(
      { 
        _id: product._id, 
        status: "Live", 
        availability: "Available Now",
        bookingHistory: { 
          $not: { 
            $elemMatch: { 
              startDate: { $lte: occupiedEnd.toISOString() }, 
              endDate: { $gte: occupiedStart.toISOString() }, 
              status: { $nin: ["Cancelled", "Rejected"] } 
            } 
          } 
        },
        externalBookings: { 
          $not: { 
            $elemMatch: { 
              startDate: { $lte: occupiedEnd.toISOString() }, 
              endDate: { $gte: occupiedStart.toISOString() }, 
              status: { $nin: ["Cancelled", "Rejected"] } 
            } 
          } 
        }
      }, 
      { 
        $push: { 
          bookingHistory: booking, 
          activityLog: { 
            action: "Booking reserved", 
            user: req.body.createdBy || "Admin", 
            remarks: `${value.startDate} to ${value.endDate}` 
          } 
        } 
      }, 
      { new: true }
    );
    
    if (!locked) {
      return res.status(409).json({ 
        success: false, 
        message: "Product was booked by another request; please choose different dates" 
      });
    }
    
    res.status(201).json({ 
      success: true, 
      data: { 
        productId: locked.productId, 
        booking, 
        durationDays: days, 
        cleaningBufferDays: buffer 
      } 
    });
    
  } catch (e) { 
    res.status(400).json({ success: false, message: e.message }); 
  }
};

export const getProductActivity = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // ✅ Product ko dhoondho
    const product = await Product.findOne(productFilter(productId));
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Activity log return karo (Agar activityLog empty hai toh empty array)
    res.json({ success: true, data: product.activityLog || [] });
    
  } catch (error) {
    console.error('Error fetching product activity:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};