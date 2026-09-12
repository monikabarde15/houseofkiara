import mongoose from "mongoose";
import Customer from "../models/Customer.js";
import { validateCustomerInput } from "../validations/customerValidation.js";
import { generateNextCustomerId } from "../utils/idGenerator.js";

const formatCustomerResponse = (doc) => {
  const obj = doc.toObject();
  return {
    ...obj,
    id: obj.customerId || obj._id.toString()
  };
};

// GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const { search, status, source } = req.query || {};
    const query = {};

    if (status && status !== "All Statuses") {
      query.status = status;
    }

    if (source && source !== "All Sources") {
      query.source = source;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { location: regex },
        { customerId: regex }
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: customers.length,
      data: customers.map(formatCustomerResponse)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/customers/:id
export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({
      $or: [{ customerId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, data: formatCustomerResponse(customer) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { isValid, errors } = validateCustomerInput(req.body, false);
    if (!isValid) {
      return res.status(422).json({ success: false, message: errors.join(", "), errors });
    }

    const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
    const customerId = req.body.customerId || req.body.id || (await generateNextCustomerId());

    const existing = await Customer.findOne({
      $or: [
        { customerId },
        { email: email || "nomatch@hok.local" }
      ]
    });

    let customerDoc;
    if (existing) {
      if (req.body.name) existing.name = req.body.name.trim();
      if (email) existing.email = email;
      if (req.body.phone !== undefined) existing.phone = req.body.phone;
      if (req.body.location !== undefined) existing.location = req.body.location;
      if (req.body.address !== undefined) existing.address = req.body.address;
      if (req.body.gstin !== undefined) existing.gstin = req.body.gstin;
      if (req.body.instagram !== undefined) existing.instagram = req.body.instagram;
      if (req.body.birthDate !== undefined) existing.birthDate = req.body.birthDate;
      if (req.body.referrer !== undefined) existing.referrer = req.body.referrer;
      if (req.body.status) existing.status = req.body.status;
      if (req.body.source) existing.source = req.body.source;
      if (req.body.preferences) existing.preferences = { ...existing.preferences, ...req.body.preferences };
      if (Array.isArray(req.body.addresses)) existing.addresses = req.body.addresses;
      if (Array.isArray(req.body.occasions)) existing.occasions = req.body.occasions;
      if (req.body.internalNotes !== undefined) existing.internalNotes = req.body.internalNotes;

      customerDoc = await existing.save();
    } else {
      customerDoc = await Customer.create({
        customerId,
        name: req.body.name.trim(),
        email: email || `contact_${Date.now()}@hok.local`,
        phone: req.body.phone ? req.body.phone.trim() : "",
        location: req.body.location ? req.body.location.trim() : "India",
        address: req.body.address ? req.body.address.trim() : "",
        gstin: req.body.gstin ? req.body.gstin.trim() : "",
        instagram: req.body.instagram ? req.body.instagram.trim() : "",
        birthDate: req.body.birthDate ? req.body.birthDate.trim() : "",
        referrer: req.body.referrer ? req.body.referrer.trim() : "",
        status: req.body.status || "Active",
        source: req.body.source || "Manual - WA",
        flagReason: req.body.flagReason || "",
        internalNotes: req.body.internalNotes || "",
        preferences: {
          preferredSize: req.body.preferences?.preferredSize || req.body.preferredSize || "",
          preferredOccasions: req.body.preferences?.preferredOccasions || req.body.preferredOccasions || "",
          preferredSilhouettes: req.body.preferences?.preferredSilhouettes || req.body.preferredSilhouettes || "",
          newsletter: req.body.preferences?.newsletter ?? req.body.newsletter ?? false,
          whatsappNotifications: req.body.preferences?.whatsappNotifications ?? req.body.whatsappNotifications ?? false,
          marketingOptIn: req.body.preferences?.marketingOptIn ?? req.body.marketingOptIn ?? false
        },
        addresses: Array.isArray(req.body.addresses) ? req.body.addresses : [],
        occasions: Array.isArray(req.body.occasions) ? req.body.occasions : [],
        communicationLog: Array.isArray(req.body.communicationLog) ? req.body.communicationLog : [],
        joinedDate: req.body.joinedDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        ordersCount: req.body.ordersCount || 0,
        totalSpent: req.body.totalSpent || 0,
        wishlistCount: req.body.wishlistCount || 0,
        lastOrderDate: req.body.lastOrderDate || "—"
      });
    }

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: formatCustomerResponse(customerDoc)
    });
  } catch (error) {
    res.status(422).json({ success: false, message: error.message });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validateCustomerInput(req.body, true);
    if (!isValid) {
      return res.status(422).json({ success: false, message: errors.join(", "), errors });
    }

    let updatedCustomer = await Customer.findOneAndUpdate(
      { $or: [{ customerId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return createCustomer(req, res);
    }

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: formatCustomerResponse(updatedCustomer)
    });
  } catch (error) {
    res.status(422).json({ success: false, message: error.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findOneAndDelete({
      $or: [{ customerId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/customers/:id/addresses
export const addCustomerAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, address, isDefault } = req.body;

    if (!address || !address.trim()) {
      return res.status(422).json({ success: false, message: "Address text is required" });
    }

    const customer = await Customer.findOne({
      $or: [{ customerId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const newAddress = {
      id: `addr_${Date.now()}`,
      label: label ? label.trim() : "Home",
      address: address.trim(),
      isDefault: isDefault || customer.addresses.length === 0
    };

    customer.addresses.push(newAddress);
    await customer.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: formatCustomerResponse(customer)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/customers/:id/occasions
export const addCustomerOccasion = async (req, res) => {
  try {
    const { id } = req.params;
    const { occasion, date } = req.body;

    if (!occasion || !occasion.trim()) {
      return res.status(422).json({ success: false, message: "Occasion name is required" });
    }

    const customer = await Customer.findOne({
      $or: [{ customerId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const newOccasion = {
      id: `occ_${Date.now()}`,
      occasion: occasion.trim(),
      date: date || ""
    };

    customer.occasions.push(newOccasion);
    await customer.save();

    res.status(201).json({
      success: true,
      message: "Occasion added successfully",
      data: formatCustomerResponse(customer)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/customers/:id/communication-log
export const addCustomerCommLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, channel } = req.body;

    if (!message || !message.trim()) {
      return res.status(422).json({ success: false, message: "Log message is required" });
    }

    const customer = await Customer.findOne({
      $or: [{ customerId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const newLog = {
      id: `comm_${Date.now()}`,
      message: message.trim(),
      channel: channel || "WhatsApp",
      timestamp: new Date().toLocaleString("en-IN")
    };

    customer.communicationLog.unshift(newLog);
    await customer.save();

    res.status(201).json({
      success: true,
      message: "Communication logged successfully",
      data: formatCustomerResponse(customer)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
