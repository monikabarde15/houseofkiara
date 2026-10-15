export const applyPromoDiscount = (subtotal, promo) => {
  if (!promo) return 0;
  if (promo.minOrder && subtotal < promo.minOrder) return 0;

  let discount = 0;

  if (promo.type === "percent") {
    discount = (subtotal * promo.value) / 100;
  }

  if (promo.type === "flat") {
    discount = promo.value;
  }

  if (promo.maxDiscount && promo.maxDiscount > 0) {
    discount = Math.min(discount, promo.maxDiscount);
  }

  // Prevent negative total
  return Math.min(discount, subtotal);
};
