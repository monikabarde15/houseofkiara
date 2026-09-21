import express from "express";

// 1. Customer Storefront Routers
import customerAuthRouter from "./customerAuthRoutes.js";
import customerProfileRouter from "./customerProfileRoutes.js";

// 2. Admin Portal & Core Routers
import authRouter from "./authRoutes.js";
import customerRouter from "./customerRoutes.js";
import productRouter from "./productRoutes.js";
import offerRouter from "./offerRoutes.js";
import orderRouter from "./orderRoutes.js";
import listerRouter from "./listerRoutes.js";
import designerRouter from "./designerRoutes.js";
import payoutRouter from "./payoutRoutes.js";
import uploadRouter from "./uploadRoutes.js";
import messageRouter from "./messageRoutes.js";
import taskRouter from "./taskRoutes.js";
import submissionRouter from "./submissionRoutes.js";
import promotionRouter from "./promotionRoutes.js";
import notificationRouter from "./notificationRoutes.js";
import siteSettingsRouter from "./siteSettingsRoutes.js";

const router = express.Router();

/**
 * =======================================================
 * CUSTOMER STOREFRONT APIS
 * =======================================================
 */
// Customer Authentication (/api/customer/auth/*)
router.use("/customer/auth", customerAuthRouter);

// Customer Profile & Self-service (/api/customer/profile/*, /api/customer/profile, /api/customer/addresses)
router.use("/customer/profile", customerProfileRouter);
router.use("/customer", customerProfileRouter);

/**
 * =======================================================
 * ADMIN PORTAL & SHARED APIS
 * =======================================================
 */
// Scoped Administrative Endpoints
router.use("/site-settings", siteSettingsRouter);
router.use("/listers", listerRouter);
router.use("/designers", designerRouter);
router.use("/tasks", taskRouter);
router.use("/submissions", submissionRouter);
router.use("/promotions", promotionRouter);
router.use("/notifications", notificationRouter);

// Root /api endpoints (Products, Orders, Offers, Payouts, Admin Auth, Messages, Customers, Upload)
router.use(productRouter);
router.use(offerRouter);
router.use(authRouter);
router.use(payoutRouter);
router.use(orderRouter);
router.use(uploadRouter);
router.use(messageRouter);
router.use(customerRouter);

export default router;
