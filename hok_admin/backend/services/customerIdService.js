import Customer from "../models/Customer.js";

// The database is the source of truth for sequential customer identifiers.
export const nextCustomerId = async () => {
  const customers = await Customer.find({}, "customerId").exec();
  const highestId = customers.reduce((highest, customer) => {
    const match = String(customer.customerId || "").match(/^CUST-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `CUST-${String(highestId + 1).padStart(5, "0")}`;
};
