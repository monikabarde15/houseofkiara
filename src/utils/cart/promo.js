// src\utils\cart\promo.js
export const PROMO_CODES = {
  KAIRA10: {
    type: "percent",
    value: 10,
    label: "10% off your order",
    appliesTo: "subtotal"
  },
  KAIRA500: {
    type: "flat",
    value: 500,
    label: "₹500 off your order",
    appliesTo: "subtotal"
  },
  NEWUSER: {
    type: "percent",
    value: 15,
    label: "15% off — welcome gift",
    appliesTo: "subtotal"
  }
};