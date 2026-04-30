// src/utils/cart/gstCalculator.js

export const calculateGST = (amount, type) => {
  switch (type) {
    case "rental":
      return Math.round(amount * 0.18);

    case "preloved":
      return Math.round(amount * 0.05);

    case "new":
      // embedded GST extraction
      return Math.round((amount / 1.12) * 0.12);

    default:
      return 0;
  }
};