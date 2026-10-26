import Payout from "../models/Payout.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Lister from "../models/Lister.js";
import Submission from "../models/Submission.js";
import { validatePayout } from "../validations/payoutValidation.js";
import mongoose from "mongoose";

const view = (p) => {
  const obj = p.toObject ? p.toObject() : p;
  const rawDate = obj.dueDate || p.dueDate;
  let dueDateStr = "";
  if (typeof rawDate === "string") {
    dueDateStr = rawDate.slice(0, 10);
  } else if (rawDate && typeof rawDate.toISOString === "function") {
    dueDateStr = rawDate.toISOString().slice(0, 10);
  }

  const listerShare = Number(
    obj.listerShare ?? obj.payoutAmount ?? obj.netPayout ?? 0,
  );
  const transactionAmount = Number(
    obj.transactionAmount ?? obj.transactionValue ?? 0,
  );
  const rawHokCommission = Number(obj.hokCommission || 0);
  const hokCommission =
    rawHokCommission > 0
      ? rawHokCommission
      : transactionAmount > listerShare
        ? transactionAmount - listerShare
        : Math.round(transactionAmount * 0.2);

  let status = obj.status || "Pending";
  if (status === "Pending Approval") status = "Pending";

  return {
    ...obj,
    id: obj.payoutId || p.payoutId || obj._id,
    payoutId: obj.payoutId || p.payoutId || obj._id,
    listerShare,
    transactionAmount,
    hokCommission,
    status,
    mode: obj.mode || "Rental",
    dueDate: dueDateStr || new Date().toISOString().slice(0, 10),
  };
};

export const syncPayoutsFromOrders = async () => {
  try {
    const orders = await Order.find({});
    for (const ord of orders) {
      const orderId = ord.orderId || ord.id;
      if (!orderId) continue;

      const itemsArr =
        Array.isArray(ord.items) && ord.items.length > 0 ? ord.items : [ord];

      for (let idx = 0; idx < itemsArr.length; idx++) {
        const item = itemsArr[idx];
        const prodId = item.productId || ord.productId || "";
        const productName = item.productName || ord.productName || "Designer Piece";
        const totalOrderGross =
          itemsArr.reduce((s, it) => s + Number(it.amount || 0), 0) ||
          Number(ord.orderValue || 1);
        const totalDiscount = Number(ord.discount || ord.promoDiscount || 0);
        const itemGross = Number(
          item.amount ||
            (itemsArr.length === 1 ? ord.orderValue || ord.grandTotal : 0) ||
            10000,
        );
        const itemDiscount =
          totalOrderGross > 0
            ? Math.round((itemGross / totalOrderGross) * totalDiscount)
            : 0;
        const transactionAmount = Math.max(0, itemGross - itemDiscount);

        let listerId = item.listerId || ord.listerId || "";
        let listerName = item.listerName || ord.listerName || "";

        let prod = null;
        if (prodId) {
          try {
            prod = await Product.findOne({
              $or: [{ productId: prodId }, { _id: prodId }, { sku: prodId }],
            });
            if (prod) {
              if (!listerId) listerId = prod.listerId || prod.lister_id || "";
              if (!listerName) listerName = prod.listerName || prod.lister_name || "";
            }
          } catch (e) {}
        }

        if (listerId) {
          try {
            const listerRec = await Lister.findOne({
              $or: [
                { listerId },
                { id: listerId },
                { listerId: listerId.toLowerCase().replace(/\s+/g, "-") },
                {
                  name: new RegExp(
                    `^${listerId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                    "i",
                  ),
                },
              ],
            });
            if (listerRec) {
              listerName = listerRec.name;
              listerId = listerRec.listerId || listerRec.id;
            }
          } catch (e) {}
        }

        if (!listerId) {
          listerId = "simran-chouhan";
          listerName = "Simran Chouhan";
        }
        if (!listerName) {
          listerName =
            listerId === "ananya-sharma" ? "Ananya Sharma" : "Simran Chouhan";
        }

        const payoutPercentage = prod?.payoutPercentage || 80;
        const listerShare = Math.round(
          transactionAmount * (payoutPercentage / 100),
        );
        const hokCommission = Math.max(0, transactionAmount - listerShare);
        const isPaid =
          ord.payoutStatus === "Paid" || ord.status === "Complete";
        const cleanOrderId = String(orderId).replace(/[^a-zA-Z0-9]/g, "");
        const payoutId =
          itemsArr.length > 1
            ? `PAY-${cleanOrderId}-${idx + 1}`
            : `PAY-${cleanOrderId}`;

        // Standard payout lookup
        const existing = await Payout.findOne({
          orderId,
          mode: { $ne: "Damage Comp." },
          $or: [
            { payoutId },
            { productId: prodId || "PRD-101" },
          ],
        });

        if (!existing) {
          await Payout.create({
            payoutId,
            orderId,
            productId: prodId || "PRD-101",
            customerId: ord.customerId || "",
            offerId: ord.offerId || "",
            promoCode: ord.promoCode || "",
            listerId,
            listerName,
            productName,
            mode: item.mode || ord.mode || "Rental",
            transactionAmount,
            payoutPercentage,
            listerShare,
            hokCommission,
            taxDeduction: 0,
            netPayout: listerShare,
            dueDate:
              item.rentalEndDate || ord.rentalEndDate
                ? new Date(item.rentalEndDate || ord.rentalEndDate)
                : new Date(Date.now() + 7 * 86400000),
            status: isPaid ? "Paid" : "Pending",
          });
        } else {
          existing.transactionAmount = transactionAmount;
          existing.payoutPercentage = payoutPercentage;
          existing.listerShare = listerShare;
          existing.netPayout = listerShare;
          existing.hokCommission = hokCommission;
          if (listerId) existing.listerId = listerId;
          if (listerName) existing.listerName = listerName;
          await existing.save();
        }
      }

      // Check if order has damage fine / deposit deduction
      const fineAmt = itemsArr.reduce(
        (sum, i) => sum + Number(i.depositDecision?.deductedAmount || 0),
        0,
      ) || Number(ord.depositDecision?.deductedAmount || 0);

      if (fineAmt > 0) {
        const existingDmg = await Payout.findOne({
          orderId,
          mode: "Damage Comp.",
        });
        if (!existingDmg) {
          const listerComp = Math.round(fineAmt * 0.8);
          const hokComp = Math.round(fineAmt * 0.2);
          const defaultListerId = ord.listerId || itemsArr[0]?.listerId || "simran-chouhan";
          const defaultListerName = ord.listerName || itemsArr[0]?.listerName || "Simran Chouhan";

          await Payout.create({
            payoutId: `PAY-DMG-${String(orderId).replace(/[^a-zA-Z0-9]/g, "")}`,
            orderId,
            productId: itemsArr[0]?.productId || ord.productId || "PRD-101",
            customerId: ord.customerId || "",
            listerId: defaultListerId,
            listerName: defaultListerName,
            productName: itemsArr[0]?.productName || ord.productName || "Garment",
            mode: "Damage Comp.",
            transactionAmount: fineAmt,
            payoutPercentage: 80,
            listerShare: listerComp,
            hokCommission: hokComp,
            netPayout: listerComp,
            dueDate: new Date(),
            status: "Pending",
          });
        }
      }
    }
  } catch (e) {
    console.error("syncPayoutsFromOrders error:", e);
  }
};

export const getPayouts = async (req, res) => {
  try {
    await syncPayoutsFromOrders();
    const query = {};

    const productId = req.params.productId || req.query.productId;

    if (productId) {
      if (mongoose.Types.ObjectId.isValid(productId)) {
        query.productId = new mongoose.Types.ObjectId(productId);
      } else {
        query.productId = productId;
      }
    }

    if (
      req.query.status &&
      ["Pending", "Paid", "Failed", "Reversed"].includes(req.query.status)
    ) {
      query.status = req.query.status;
    }
    if (req.query.listerId) query.listerId = req.query.listerId;

    if (req.query.from || req.query.to) {
      query.dueDate = {};
      if (req.query.from) query.dueDate.$gte = new Date(req.query.from);
      if (req.query.to) query.dueDate.$lte = new Date(req.query.to);
    }

    const payouts = await Payout.find(query)
      .sort({ dueDate: 1, createdAt: -1 })
      .exec();
    const mappedPayouts = payouts.map(view);

    // Attach the assigned admin from the LYP submission
    const enrichedPayouts = await Promise.all(
      mappedPayouts.map(async (p) => {
        try {
          const sub = await Submission.findOne({
            listerId: p.listerId,
            piece: p.productName,
          });
          return {
            ...p,
            submissionAssignedTo: sub
              ? sub.assignedTo || "Unassigned"
              : "Master Admin",
          };
        } catch (e) {
          return { ...p, submissionAssignedTo: "Master Admin" };
        }
      }),
    );

    const pendingTotal = enrichedPayouts
      .filter((p) => p.status === "Pending")
      .reduce((sum, p) => sum + Number(p.listerShare || 0), 0);
    const paidTotal = enrichedPayouts
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + Number(p.listerShare || 0), 0);
    const hokCommission = enrichedPayouts.reduce(
      (sum, p) => sum + Number(p.hokCommission || 0),
      0,
    );

    res.json({
      success: true,
      data: enrichedPayouts,
      summary: { pending: pendingTotal, paid: paidTotal, hokCommission },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const exportPayouts = async (req, res) => {
  try {
    const rows = await Payout.find({}).sort({ dueDate: -1 });
    const headers = [
      "payoutId",
      "listerId",
      "listerName",
      "orderId",
      "productName",
      "mode",
      "transactionAmount",
      "listerShare",
      "hokCommission",
      "taxDeduction",
      "netPayout",
      "status",
      "dueDate",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((p) =>
        headers.map((h) => JSON.stringify(p[h] ?? "")).join(","),
      ),
    ].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=payouts.csv");
    res.send(csv);
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updatePayoutStatus = async (req, res) => {
  try {
    if (!["Failed", "Reversed", "Pending"].includes(req.body.status))
      return res
        .status(422)
        .json({ success: false, message: "Invalid payout status" });

    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }];
    // FIX: Prevent cast error by checking if param is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    const p = await Payout.findOneAndUpdate(
      { $or: queryConditions },
      {
        status: req.body.status,
        notes: req.body.notes,
        updatedBy: req.body.updatedBy || "Admin",
      },
      { new: true },
    );
    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Payout not found" });
    res.json({ success: true, data: view(p) });
  } catch (e) {
    res.status(422).json({ success: false, message: e.message });
  }
};

export const getPayoutById = async (req, res) => {
  try {
    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }];
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    const p = await Payout.findOne({ $or: queryConditions });
    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Payout not found" });
    res.json({ success: true, data: view(p) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const createPayout = async (req, res) => {
  try {
    const { error, value } = validatePayout(req.body);
    if (error)
      return res
        .status(422)
        .json({
          success: false,
          message: error.details.map((d) => d.message).join("; "),
        });
    const p = await Payout.create({
      ...value,
      payoutId: value.payoutId || `PAY-${Date.now()}`,
    });
    res.status(201).json({ success: true, data: view(p) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const markPayoutPaid = async (req, res) => {
  try {
    const taxDeduction = Math.max(0, Number(req.body.taxDeduction || 0));

    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }, { status: "Pending" }];
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    // FIX: Removed the buggy netPayout math from the $set object
    const p = await Payout.findOneAndUpdate(
      { $or: queryConditions },
      {
        status: "Paid",
        paidAt: new Date(),
        paidBy: req.body.paidBy || "Admin",
        paymentReference: req.body.paymentReference,
        taxDeduction,
        notes: req.body.notes,
      },
      { new: true },
    );

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Pending payout not found" });

    // FIX: Calculate netPayout after retrieving the correct document
    p.netPayout = Math.max(0, Number(p.listerShare || 0) - taxDeduction);
    await p.save();

    res.json({ success: true, data: view(p) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updatePayout = async (req, res) => {
  try {
    const idParam = req.params.id;
    const queryConditions = [{ payoutId: idParam }];
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: idParam });
    }

    const {
      listerShare,
      hokCommission,
      payoutPercentage,
      submissionAssignedTo,
      notes,
      transactionAmount,
    } = req.body;
    const updateData = {};
    if (listerShare !== undefined) updateData.listerShare = listerShare;
    if (hokCommission !== undefined) updateData.hokCommission = hokCommission;
    if (payoutPercentage !== undefined)
      updateData.payoutPercentage = payoutPercentage;
    if (submissionAssignedTo !== undefined)
      updateData.submissionAssignedTo = submissionAssignedTo;
    if (notes !== undefined) updateData.notes = notes;
    if (transactionAmount !== undefined)
      updateData.transactionAmount = transactionAmount;

    const p = await Payout.findOneAndUpdate(
      { $or: queryConditions },
      { $set: updateData },
      { new: true },
    );

    if (!p)
      return res
        .status(404)
        .json({ success: false, message: "Payout not found" });
    res.json({ success: true, data: view(p) });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
