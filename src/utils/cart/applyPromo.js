// src\utils\cart\applyPromo.js
export const applyPromoDiscount = (subtotal, promo) => {
  if (!promo) return 0;

  let discount = 0;

  if (promo.type === "percent") {
    discount = (subtotal * promo.value) / 100;
  }

  if (promo.type === "flat") {
    discount = promo.value;
  }

  // Prevent negative total
  return Math.min(discount, subtotal);
};