import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  addOrderLog,
} from "../controllers/orderController.js";
import {
  transitionOrder,
  updateOrderItem,
  updateDispatch,
  updateReturnCondition,
  decideDeposit,
  getInvoice,
  saveOrderEvidence,
} from "../controllers/orderWorkflowController.js";
import {
  enforceSectionIfAdmin,
  enforceDecisionWhenIfAdmin,
} from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/orders", enforceSectionIfAdmin("orders", "View"), getOrders);
router.post("/orders", enforceSectionIfAdmin("orders", "Edit"), createOrder);
router.get("/orders/:id", enforceSectionIfAdmin("orders", "View"), getOrder);
router.put(
  "/orders/:id",
  enforceSectionIfAdmin("orders", "Edit"),
  enforceDecisionWhenIfAdmin(
    "cancel_paid_order",
    (req) => String(req.body?.status || "") === "Cancelled",
  ),
  updateOrder,
);
router.post("/orders/:id/logs", enforceSectionIfAdmin("orders", "Edit"), addOrderLog);
router.patch(
  "/orders/:id/status",
  enforceSectionIfAdmin("orders", "Edit"),
  enforceDecisionWhenIfAdmin(
    "cancel_paid_order",
    (req) => String(req.body?.status || "") === "Cancelled",
  ),
  transitionOrder,
);
router.patch("/orders/:id/items/:index", enforceSectionIfAdmin("orders", "Edit"), updateOrderItem);
router.patch("/orders/:id/items/:index/dispatch", enforceSectionIfAdmin("dispatch", "Edit"), updateDispatch);
router.patch("/orders/:id/items/:index/return", enforceSectionIfAdmin("returns", "Edit"), updateReturnCondition);
router.patch("/orders/:id/items/:index/evidence", enforceSectionIfAdmin("returns", "Edit"), saveOrderEvidence);
router.patch(
  "/orders/:id/items/:index/deposit",
  enforceSectionIfAdmin("returns", "Edit"),
  enforceDecisionWhenIfAdmin(
    "refund_deposit_in_full",
    (req) => Number(req.body?.deductedAmount || 0) <= 0,
  ),
  enforceDecisionWhenIfAdmin(
    "decide_deductions_late_fees_waivers",
    (req) => Number(req.body?.deductedAmount || 0) > 0,
  ),
  decideDeposit,
);
router.get("/orders/:id/invoice", enforceSectionIfAdmin("orders", "View"), getInvoice);
export default router;
