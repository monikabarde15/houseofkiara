import express from "express";
import { getOrders, getOrder, createOrder, updateOrder, addOrderLog } from "../controllers/orderController.js";
import { transitionOrder, updateOrderItem, updateDispatch, updateReturnCondition, decideDeposit, getInvoice, saveOrderEvidence } from "../controllers/orderWorkflowController.js";
const router = express.Router();
router.get("/orders", getOrders); router.post("/orders", createOrder); router.get("/orders/:id", getOrder); router.put("/orders/:id", updateOrder); router.post("/orders/:id/logs", addOrderLog); router.patch("/orders/:id/status", transitionOrder); router.patch("/orders/:id/items/:index", updateOrderItem); router.patch("/orders/:id/items/:index/dispatch", updateDispatch); router.patch("/orders/:id/items/:index/return", updateReturnCondition); router.patch("/orders/:id/items/:index/evidence", saveOrderEvidence); router.patch("/orders/:id/items/:index/deposit", decideDeposit); router.get("/orders/:id/invoice", getInvoice);
export default router;
