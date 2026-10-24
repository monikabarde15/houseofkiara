// src\utils\cart\calculateTotals.js
import { calculateGST } from "./gstCalculator";
import { applyPromoDiscount } from "./applyPromo";

const cleanPrice = (price) => {
  if (!price) return 0;
  return Number(String(price).replace(/[^\d]/g, ""));
};

export const calculateTotals = (
  cartItems,
  activePromo,
  deliveryType = "standard",
) => {
  let subtotal = 0;

  const itemsGrouped = {
    rental: [],
    preloved: [],
    new: [],
  };

  cartItems.forEach((item) => {
    let { product, booking } = item;
    let type = (item.type === "rent" || item.type === "rental") ? "rental" : item.type;

    let basePrice = 0;
    let days = 0;

    // RENTAL
    if (type === "rental") {
      const getRentalDays = (booking) => {
        if (booking?.rentalWindowDays) return booking.rentalWindowDays;
        if (booking?.windowDays) return booking.windowDays;

        // ✅ derive from dates (REAL FIX)
        if (booking?.deliveryDate && booking?.returnDate) {
          const start = new Date(booking.deliveryDate);
          const end = new Date(booking.returnDate);

          const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

          // Add +1 to include both start and end dates in the count
          const totalDays = diff + 1;
          return totalDays > 0 ? totalDays : 4;
        }

        return 4;
      };

      days = getRentalDays(booking);

      const rentalPrice = cleanPrice(product?.rentalPrice) || (days === 4 ? cleanPrice(item.price) : 0);
      const perDay =
        (rentalPrice > 0 ? Math.round(rentalPrice / 4) : 0) ||
        product?.rent?.pricing?.pricePerDay ||
        product?.modes?.rent?.pricing?.pricePerDay ||
        product?.perDayRate ||
        (cleanPrice(item.price) && days ? Math.round(cleanPrice(item.price) / (booking?.rentalWindowDays || days || 4)) : 0) ||
        0;

      if ((days === 4 || booking?.rentalWindowDays === 4) && rentalPrice > 0) {
        basePrice = rentalPrice;
      } else if (days > 0 && perDay > 0) {
        basePrice = days * perDay;
      } else if (cleanPrice(item.price) > 0) {
        basePrice = cleanPrice(item.price);
      } else if (rentalPrice > 0) {
        basePrice = rentalPrice;
      }
    }

    // PRELOVED
    if (type === "preloved") {
      basePrice =
        cleanPrice(item.price) ||
        cleanPrice(product?.prelovedPrice) ||
        cleanPrice(product?.preloved?.pricing?.price) ||
        cleanPrice(product?.modes?.preloved?.pricing?.price) ||
        0;
    }

    // NEW
    if (type === "new" || type === "buy-new") {
      basePrice =
        cleanPrice(item.price) ||
        cleanPrice(product?.listingPrice) ||
        cleanPrice(product?.buyPrice) ||
        cleanPrice(product?.modes?.buyNew?.pricing?.price) ||
        cleanPrice(product?.retailPrice) ||
        0;
      type = "new"; // normalize for itemsGrouped
    }

    if (basePrice <= 0) return;

    subtotal += Number(basePrice);

    itemsGrouped[type].push({
      id: item.id,
      type,
      productName: product?.title || product?.name,
      basePrice,
      size: booking?.size || product?.size,
      startDate: booking?.deliveryDate,
      endDate: booking?.returnDate,
      windowDays:
        type === "rental"
          ? days
          : booking?.rentalWindowDays || booking?.windowDays,
    });
  });

  // PROMO
  const discount = activePromo
    ? Math.min(applyPromoDiscount(subtotal, activePromo), subtotal)
    : 0;

  // Effective discount ratio so customer pays GST only on the net amount paid
  const effectiveRatio = subtotal > 0 && discount > 0 ? (subtotal - discount) / subtotal : 1;

  // GST
  let rentalGST = 0;
  let prelovedGST = 0;
  let newGST = 0;

  itemsGrouped.rental.forEach((item) => {
    const netAmount = Math.round(item.basePrice * effectiveRatio);
    rentalGST += calculateGST(netAmount, "rental");
  });

  itemsGrouped.preloved.forEach((item) => {
    const netAmount = Math.round(item.basePrice * effectiveRatio);
    prelovedGST += calculateGST(netAmount, "preloved");
  });

  itemsGrouped.new.forEach((item) => {
    const netAmount = Math.round(item.basePrice * effectiveRatio);
    newGST += calculateGST(netAmount, "new");
  });

  /* DELIVERY */
  const deliveryCharge = deliveryType === "express" ? 299 : 0;

  /* DELIVERY GST */
  const deliveryGST =
    deliveryCharge > 0 ? Math.round(deliveryCharge * 0.18) : 0;

  const totalGST = rentalGST + prelovedGST + newGST + deliveryGST;

  const grandTotal = Math.max(
    0,
    subtotal -
      discount +
      rentalGST +
      prelovedGST +
      newGST +
      deliveryCharge +
      deliveryGST,
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
    deliveryCharge,
    deliveryGST,
  };
};
