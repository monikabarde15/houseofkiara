const round = (value) => Math.round(Number(value || 0) * 100) / 100;
const dateOnly = (value) => { const d = new Date(value); d.setUTCHours(0, 0, 0, 0); return d; };

export const calculateProductLine = (product, input = {}) => {
  const productModes = (product.listingModes || []).map(m => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
  const mode = input.mode ? (input.mode.charAt(0).toUpperCase() + input.mode.slice(1).toLowerCase()) : (productModes.includes("Rental") ? "Rental" : productModes[0]);
  if (!productModes.includes(mode)) throw new Error(`${mode} mode is not enabled for ${product.name}`);
  const quantity = Math.max(1, Number(input.quantity || 1));
  let durationDays = 0; let baseAmount = 0; let extensionDays = 0;
  if (mode === "Rental") {
    if (!input.startDate || !input.endDate) throw new Error(`Rental dates are required for ${product.name}`);
    durationDays = Math.floor((dateOnly(input.endDate) - dateOnly(input.startDate)) / 86400000) + 1;
    if (durationDays < Number(product.minimumDurationDays || 4)) throw new Error(`Minimum rental duration for ${product.name} is ${product.minimumDurationDays || 4} days`);
    const includedDays = Number(product.minimumDurationDays || 4);
    extensionDays = Math.max(0, durationDays - includedDays);
    const extensionPrice = Number(product.extensionPrice || Math.ceil(Number(product.rentalPrice || 0) / includedDays));
    baseAmount = Number(product.rentalPrice || 0) + extensionDays * extensionPrice;
  } else baseAmount = Number(product.listingPrice || 0);
  if (baseAmount <= 0) throw new Error(`${mode} price is not configured for ${product.name}`);
  const itemAmount = round(baseAmount * quantity);
  const cleaningFee = mode === "Rental" ? round(Number(product.cleaningFee || 0) * quantity) : 0;
  // PDF defaults: rental GST 18%, preloved/buy GST 5%; product override is allowed.
  const taxRate = Number(product.gstRate ?? product.taxRate ?? (mode === "Rental" ? 18 : 5));
  const taxableAmount = round(itemAmount + cleaningFee);
  const tax = round(taxableAmount * taxRate / 100);
  const deposit = mode === "Rental" ? round(Number(product.securityDeposit || 0) * quantity) : 0;
  const commission = round(itemAmount * Number(product.commissionRate || 25) / 100);
  return { productId: product.productId, productName: product.name, designer: product.designer, mode, quantity, durationDays, extensionDays, amount: itemAmount, cleaningFee, taxRate, gst: tax, deposit, commission, taxableAmount, lineTotal: round(taxableAmount + tax + deposit), rentalStartDate: input.startDate, rentalEndDate: input.endDate, size: input.size };
};
