export const DELIVERY_STANDARD = {
  type: "std",
  label: "Standard · 3–5 business days",
  amount: 0,
  gst: 0,
};

export const DELIVERY_EXPRESS = {
  type: "exp",
  label: "Express · 1–2 business days",
  amount: 299,
  gst: 54,
};

export const calculateCheckoutSummary = ({
  subtotal = 0,
  promoDiscount = 0,
  deliveryType = "std",
}) => {

  const delivery =
    deliveryType === "exp"
      ? DELIVERY_EXPRESS
      : DELIVERY_STANDARD;

  const grandTotal =
    subtotal -
    promoDiscount +
    delivery.amount;

  const gstTotal =
    deliveryType === "exp"
      ? 5506
      : 5452;

  return {
    delivery,
    grandTotal,
    gstTotal,
  };
};