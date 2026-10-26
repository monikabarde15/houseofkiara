// src/components/MainCategory/utils/filterHelpers.js

export const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const normCat = (s) => (s || "").toLowerCase().replace(/s$/, "").trim();

export const getPriceNumber = (price) => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    return parseInt(price.replace(/,/g, ""), 10) || 0;
  }
  return 0;
};

export const matchCategory = (prodCat, filterCat) => {
  if (!prodCat || !filterCat) return false;
  const p = normCat(prodCat);
  const f = normCat(filterCat);
  
  if (f === "bridal lehenga") {
    return p.includes("bridal");
  }
  if (f === "lehenga") {
    return p === "lehenga" || (p.includes("lehenga") && !p.includes("bridal"));
  }
  if (f === "sherwani") {
    return p.includes("sherwani");
  }
  return p === f || p.includes(f) || f.includes(p);
};

export const matchGender = (prodGender, filterGender) => {
  if (!prodGender || !filterGender) return false;
  return prodGender.toLowerCase().trim() === filterGender.toLowerCase().trim();
};

export const matchDesigner = (prodDesigner, filterDesigner) => {
  if (!prodDesigner || !filterDesigner) return false;
  const normD = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");
  if (filterDesigner === "Other Designers") {
    return normD(prodDesigner) !== normD("Neha Tomar");
  }
  return normD(prodDesigner) === normD(filterDesigner) || normD(prodDesigner).includes(normD(filterDesigner));
};

export const matchOccasion = (prodOccasion, filterOccasion) => {
  if (!prodOccasion || !filterOccasion) return false;
  return prodOccasion.toLowerCase().includes(filterOccasion.toLowerCase().trim());
};

export const matchColor = (productColors, filterColor) => {
  if (!productColors || !filterColor) return false;
  const itemColors = Array.isArray(productColors)
    ? productColors.map((c) => String(c).toLowerCase().trim())
    : [String(productColors).toLowerCase().trim()];
  const fColor = filterColor.toLowerCase().trim();
  return itemColors.some((c) => c === fColor || c.includes(fColor) || fColor.includes(c));
};

export const matchBudget = (item, budget, isRent, isBuy) => {
  if (!budget || (budget.min <= 0 && budget.max === Infinity)) return true;

  const rentP = getPriceNumber(item.rentPrice);
  const buyP = getPriceNumber(item.buyPrice);

  if (isRent && !isBuy) {
    const p = rentP || buyP;
    return p >= budget.min && p <= budget.max;
  }
  if (isBuy && !isRent) {
    const p = buyP || rentP;
    return p >= budget.min && p <= budget.max;
  }

  // If both or neither, match if either price is in the budget range
  const matchRent = rentP > 0 && rentP >= budget.min && rentP <= budget.max;
  const matchBuy = buyP > 0 && buyP >= budget.min && buyP <= budget.max;
  return matchRent || matchBuy;
};
