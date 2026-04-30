import { calculateGST } from "./gstCalculator";
import { applyPromoDiscount } from "./applyPromo";

const cleanPrice = (price) => {
  if (!price) return 0;
  return Number(String(price).replace(/[^\d]/g, ""));
};

export const calculateTotals = (cartItems, activePromo) => {
  let subtotal = 0;

  const itemsGrouped = {
    rental: [],
    preloved: [],
    new: [],
  };

  cartItems.forEach((item) => {
    const { product, booking, type } = item;

    let basePrice = 0;

    // RENTAL
    if (type === "rental") {
      const getRentalDays = (booking) => {
        if (booking?.rentalWindowDays) return booking.rentalWindowDays;
        if (booking?.windowDays) return booking.windowDays;

        // ✅ derive from dates (REAL FIX)
        if (booking?.deliveryDate && booking?.returnDate) {
          const start = new Date(booking.deliveryDate);
          const end = new Date(booking.returnDate);

          const diff = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
          );

          return diff > 0 ? diff : 0;
        }

        return 0;
      };

      const days = getRentalDays(booking);

      const perDay = product?.rent?.pricing?.pricePerDay || 0;

      basePrice = days * perDay;
    }

    // PRELOVED
    if (type === "preloved") {
      basePrice = cleanPrice(product?.price);
    }

    // NEW
    if (type === "new") {
      basePrice = cleanPrice(product?.price);
    }

    if (basePrice <= 0) return;

    subtotal += Number(basePrice);

    itemsGrouped[type].push({
      id: item.id,
      type,
      productName: product?.title,
      basePrice,
      size: booking?.size || product?.size,
      startDate: booking?.deliveryDate,
      endDate: booking?.returnDate,
      windowDays:
        booking?.rentalWindowDays ||
        booking?.windowDays,
    });
  });

  // PROMO
  const discount = activePromo
    ? Math.min(applyPromoDiscount(subtotal, activePromo), subtotal)
    : 0;

  // GST
  let rentalGST = 0;
  let prelovedGST = 0;
  let newGST = 0;

  itemsGrouped.rental.forEach((item) => {
    rentalGST += calculateGST(item.basePrice, "rental");
  });

  itemsGrouped.preloved.forEach((item) => {
    prelovedGST += calculateGST(item.basePrice, "preloved");
  });

  itemsGrouped.new.forEach((item) => {
    newGST += calculateGST(item.basePrice, "new");
  });

  const totalGST = rentalGST + prelovedGST + newGST;

  const grandTotal = Math.max(
    0,
    subtotal - discount + rentalGST + prelovedGST
  );

  return {
    subtotal,
    discount,
    rentalGST,
    prelovedGST,
    newGST,
    totalGST,
    grandTotal,
    hasRental: itemsGrouped.rental.length > 0,
    itemsGrouped,
  };
};