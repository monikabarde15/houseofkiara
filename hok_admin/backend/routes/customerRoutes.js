import express from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerAddress,
  addCustomerOccasion,
  addCustomerCommLog,
} from "../controllers/customerController.js";
import { enforceSectionIfAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/customers", enforceSectionIfAdmin("customers", "View"), getCustomers);
router.post("/customers", enforceSectionIfAdmin("customers", "Edit"), createCustomer);
router.get("/customers/:id", enforceSectionIfAdmin("customers", "View"), getCustomer);
router.put("/customers/:id", enforceSectionIfAdmin("customers", "Edit"), updateCustomer);
router.patch("/customers/:id", enforceSectionIfAdmin("customers", "Edit"), updateCustomer);
router.delete("/customers/:id", enforceSectionIfAdmin("customers", "Edit"), deleteCustomer);

router.post("/customers/:id/addresses", enforceSectionIfAdmin("customers", "Edit"), addCustomerAddress);
router.post("/customers/:id/occasions", enforceSectionIfAdmin("customers", "Edit"), addCustomerOccasion);
router.post("/customers/:id/communication-log", enforceSectionIfAdmin("customers", "Edit"), addCustomerCommLog);

export default router;
