import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import { calculateProductLine } from "../services/pricingService.js";
import { syncCustomerOrderStats } from "./customerController.js";

const view = (order) => ({ ...order.toObject(), id: order.orderId });
const byId = (id) => ({ $or: [{ orderId: id }, { _id: id }] });

const customerById = async (customerId) => {
  if (!customerId) return null;
  try {
    return await Customer.findOne({ $or: [{ customerId }, { _id: customerId }] });
  } catch (e) {
    return null;
  }
};

const calculateItems = async (items) => {
  if (!Array.isArray(items) || !items.length) return [];
  return Promise.all(items.map(async (input) => {
    if (!input) return {};
    if (!input.productId) return input;
    // Only recalculate pricing if rental dates are provided or mode is not Rental
    const needsCalc = (input.mode && input.mode !== 'Rental') || (input.startDate && input.endDate);
    if (!needsCalc) return input; // Return as-is to preserve existing pricing
    try {
      const product = await Product.findOne({ $or: [{ productId: input.productId }, { _id: input.productId }] });
      if (!product) return input;
      return calculateProductLine(product, input);
    } catch (e) {
      console.warn(`calculateItems skip for ${input.productId}:`, e.message);
      return input;
    }
  }));
};

const totalsFor = (items, discount = 0) => {
  const orderValue = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const gst = items.reduce((sum, item) => sum + Number(item.gst || 0), 0);
  const depositHeld = items.reduce((sum, item) => sum + Number(item.deposit || 0), 0);
  const cleaningFee = items.reduce((sum, item) => sum + Number(item.cleaningFee || 0), 0);
  return { orderValue, gst, depositHeld, grandTotal: Math.round((orderValue + gst + depositHeld + cleaningFee - Math.max(0, Number(discount || 0))) * 100) / 100 };
};

export const getOrders = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.mode) query.mode = req.query.mode;
    if (req.query.customerId) query.customerId = req.query.customerId;
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders.map(view) });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne(byId(req.params.id));
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: view(order) });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

export const createOrder = async (req, res) => {
  try {
    const customer = await customerById(req.body.customerId);
    const items = await calculateItems(req.body.items);
    const order = await Order.create({
      ...req.body,
      orderId: req.body.orderId || `HOK-ORD-${Date.now()}`,
      customerId: customer?.customerId || req.body.customerId,
      customerName: customer?.name || req.body.customerName,
      customerEmail: customer?.email || req.body.customerEmail,
      customerPhone: customer?.phone || req.body.customerPhone,
      customerCity: customer?.location || req.body.customerCity,
      items,
      ...totalsFor(items, req.body.discount),
      logs: [{ message: "Order placed", type: "Order", user: req.body.createdBy || "Admin" }],
    });
    if (customer) await syncCustomerOrderStats([customer]);
    res.status(201).json({ success: true, data: view(order), related: { customerId: customer?.customerId, productIds: items.map((item) => item.productId) } });
  } catch (error) { res.status(422).json({ success: false, message: error.message }); }
};

export const updateOrder = async (req, res) => {
  try {
    const existing = await Order.findOne(byId(req.params.id));
    if (!existing) return res.status(404).json({ success: false, message: "Order not found" });
    const custId = req.body.customerId || existing.customerId;
    const customer = custId ? await customerById(custId) : null;
    const items = req.body.items ? await calculateItems(req.body.items) : existing.items;

    const updateData = {
      ...req.body,
      items,
      ...(req.body.items ? totalsFor(items, req.body.discount ?? existing.discount) : {})
    };

    if (customer) {
      updateData.customerId = customer.customerId;
      updateData.customerName = req.body.customerName || customer.name || existing.customerName;
      updateData.customerEmail = req.body.customerEmail || customer.email || existing.customerEmail;
      updateData.customerPhone = req.body.customerPhone || customer.phone || existing.customerPhone;
      updateData.customerCity = req.body.customerCity || customer.location || existing.customerCity;
    }

    const order = await Order.findOneAndUpdate(byId(req.params.id), { $set: updateData }, { new: true });
    if (customer) {
      syncCustomerOrderStats([customer]).catch(() => {});
    }
    res.json({ success: true, data: view(order) });
  } catch (error) {
    console.error("updateOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addOrderLog = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(byId(req.params.id), { $push: { logs: { message: req.body.message, type: req.body.type || "Internal Note", user: req.body.user || "Admin" } } }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: view(order) });
  } catch (error) { res.status(422).json({ success: false, message: error.message }); }
};
