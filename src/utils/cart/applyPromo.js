export const applyPromoDiscount = (subtotal, promo) => {
  if (!promo || !subtotal) return 0;
  const numericSubtotal = Number(subtotal) || 0;
  if (promo.minOrder && numericSubtotal < Number(promo.minOrder)) return 0;

  let discount = 0;
  const promoType = String(promo.type || "").toLowerCase();

  if (promoType === "percent" || promoType === "percentage") {
    discount = (numericSubtotal * Number(promo.value || 0)) / 100;
  } else if (promoType === "flat") {
    discount = Number(promo.value || 0);
  }

  if (promo.maxDiscount && Number(promo.maxDiscount) > 0) {
    discount = Math.min(discount, Number(promo.maxDiscount));
  }

  // Prevent negative total
  return Math.min(Math.round(discount), numericSubtotal);
};
