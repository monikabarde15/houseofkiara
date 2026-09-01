import express from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerAddress,
  addCustomerOccasion,
  addCustomerCommLog
} from "../controllers/customerController.js";

const router = express.Router();

router.get("/customers", getCustomers);
router.post("/customers", createCustomer);
router.get("/customers/:id", getCustomer);
router.put("/customers/:id", updateCustomer);
router.patch("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

router.post("/customers/:id/addresses", addCustomerAddress);
router.post("/customers/:id/occasions", addCustomerOccasion);
router.post("/customers/:id/communication-log", addCustomerCommLog);

export default router;
