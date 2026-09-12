import Customer from "../models/Customer.js";

/**
 * Generates the next sequential customer ID in the format: CUST-00001, CUST-00002, etc.
 * @returns {Promise<string>} e.g. "CUST-00001"
 */
export const generateNextCustomerId = async () => {
  try {
    const customers = await Customer.find({});
    let maxSeq = 0;

    for (const c of customers) {
      const id = c.customerId || "";
      const match = id.match(/^CUST-(\d{5})$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }

    let nextSeq = maxSeq + 1;
    let candidateId = `CUST-${String(nextSeq).padStart(5, "0")}`;

    // Ensure uniqueness
    while (await Customer.findOne({ customerId: candidateId })) {
      nextSeq += 1;
      candidateId = `CUST-${String(nextSeq).padStart(5, "0")}`;
    }

    return candidateId;
  } catch (err) {
    console.error("Error generating sequential customerId:", err);
    return `CUST-00001`;
  }
};
