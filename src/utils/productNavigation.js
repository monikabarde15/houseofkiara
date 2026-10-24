/**
 * Determines the category-specific route based on product listing modes
 * Supported categories / modes:
 * - Rental + Preloved: /rentalandpreloved/:id
 * - Rental + Buy New: /rentalandbuy/:id
 * - Only Rental: /onlyrental/:id
 * - Preloved: /preloved/:id
 * - Buy New: /buynew/:id
 */
export const getProductDetailRoute = (product) => {
  if (!product) return { path: "/products", targetId: "" };

  const raw = product.originalData || product.rawProduct || product;
  const listingModes = (
    raw.listingModes ||
    (Array.isArray(product.listingModes) ? product.listingModes : [])
  ).map((m) => String(m).toUpperCase());

  const badge = String(product.badge || product.type || raw.type || product.mode || raw.mode || "").toUpperCase();

  const rent =
    listingModes.some((m) => m.includes("RENT")) ||
    raw.rent === true ||
    badge.includes("RENT");

  const preloved =
    listingModes.some((m) => m.includes("PRELOVED") || m.includes("RE-SELL")) ||
    raw.preloved === true ||
    badge.includes("PRELOVED");

  const isNew =
    listingModes.some((m) => m.includes("NEW") || m.includes("BUY")) ||
    raw.isNew === true ||
    badge.includes("NEW") ||
    badge.includes("BUY");

  const targetId = raw._id || product._id || raw.id || raw.sku || product.sku || product.id || "1";

  if (rent && preloved) {
    return { path: `/rentalandpreloved/${targetId}`, targetId };
  } else if (rent && isNew) {
    return { path: `/rentalandbuy/${targetId}`, targetId };
  } else if (rent) {
    return { path: `/onlyrental/${targetId}`, targetId };
  } else if (preloved) {
    return { path: `/preloved/${targetId}`, targetId };
  } else if (isNew) {
    return { path: `/buynew/${targetId}`, targetId };
  } else {
    if (raw.rentalPrice || product.rentalPrice) {
      return { path: `/onlyrental/${targetId}`, targetId };
    }
    if (raw.listingPrice || product.listingPrice) {
      return { path: `/buynew/${targetId}`, targetId };
    }
    return { path: `/onlyrental/${targetId}`, targetId };
  }
};

export const parsePrice = (val) => {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Normalizes raw API or database product data into standard product detail format
 * ensuring price, retail price, windows, and modes are non-zero and dynamic.
 */
export const formatProductDetail = (p) => {
  if (!p) return null;
  const raw = p.originalData || p.rawProduct || p;
  const rentPrice =
    parsePrice(raw.rentalPrice) ||
    parsePrice(raw.rentPrice) ||
    parsePrice(raw.price) ||
    parsePrice(raw.listingPrice) ||
    parsePrice(raw.buyPrice) ||
    0;
  const listPrice =
    parsePrice(raw.listingPrice) ||
    parsePrice(raw.buyPrice) ||
    parsePrice(raw.price) ||
    parsePrice(raw.rentalPrice) ||
    parsePrice(raw.rentPrice) ||
    0;
  const retailPrice =
    parsePrice(raw.originalRetailPrice) ||
    parsePrice(raw.originalPrice) ||
    parsePrice(raw.retailPrice) ||
    parsePrice(raw.modes?.preloved?.pricing?.originalPrice) ||
    parsePrice(raw.modes?.rent?.pricing?.originalRetailPrice) ||
    parsePrice(raw.modes?.rent?.pricing?.retailPrice) ||
    (listPrice > 0 ? listPrice * 2.5 : rentPrice * 10) ||
    0;
  const perDay =
    parsePrice(raw.perDayRate) || (rentPrice > 0 ? Math.round(rentPrice / 4) : 0);

  return {
    ...raw,
    id: raw._id || raw.id,
    _id: raw._id || raw.id,
    productId: raw.productId || raw.sku || raw._id || raw.id,
    sku: raw.sku || raw.productId,
    title: raw.name || raw.title || "",
    name: raw.name || raw.title || "",
    subTitle: raw.category || raw.subTitle || "",
    category: raw.category || raw.subTitle || "",
    designer: raw.designer || "",
    description: raw.description || "",
    price: rentPrice || listPrice,
    rentalPrice: rentPrice,
    listingPrice: listPrice,
    originalRetailPrice: retailPrice,
    retailPrice: retailPrice,
    images:
      Array.isArray(raw.images) && raw.images.length > 0
        ? raw.images
        : raw.image
        ? Array.isArray(raw.image)
          ? raw.image
          : [raw.image]
        : [],
    sizes: Array.isArray(raw.sizes)
      ? raw.sizes.map((s) => (typeof s === "object" ? s.size || s.label : s))
      : raw.sizes
      ? [raw.sizes]
      : [],
    availableSizes: Array.isArray(raw.sizes)
      ? raw.sizes.map((s) => (typeof s === "object" ? s.size || s.label : s))
      : [],
    details: {
      fabric: raw.details?.fabric || raw.material || raw.fabric || "",
      technique: raw.details?.technique || raw.technique || raw.craftTechnique || raw.craft || raw.embellishments || "",
      includes: raw.details?.includes || raw.setIncludes || raw.includes || "",
      delivery: raw.details?.delivery || raw.deliveryTiming || raw.delivery || raw.deliveryTime || "",
      color: raw.details?.color || raw.color || "",
      thread: raw.details?.thread || raw.threadWork || raw.threadYarnDetail || raw.thread || "",
      occasion: raw.details?.occasion || raw.occasion || "",
      origin: raw.details?.origin || raw.origin || "",
    },
    fabric: raw.material || raw.fabric || "",
    craft: raw.craft || raw.technique || raw.embellishments || "",
    craftTechnique: raw.technique || raw.craft || raw.embellishments || "",
    includes: raw.setIncludes || raw.includes || "",
    deliveryTime: raw.deliveryTiming || raw.delivery || raw.deliveryTime || "",
    delivery: raw.deliveryTiming || raw.delivery || raw.deliveryTime || "",
    story: raw.story || raw.craftStory || raw.description || "",
    craftStory: raw.story || raw.craftStory || raw.description || "",
    disclosure: raw.honestDisclosure || raw.disclosure || "",
    honestDisclosure: raw.honestDisclosure || raw.disclosure || "",
    sizeNote: raw.sizeNote || raw.sizeGuide || (raw.bestSuitedForHeight ? `Best suited for height: ${raw.bestSuitedForHeight}` : ""),
    sizeGuide: raw.sizeGuide || raw.sizeNote || "",
    measurements: raw.measurements || null,
    condition: typeof raw.condition === "object" ? raw.condition : { grade: String(raw.condition || "pristine").toLowerCase() },
    care: Array.isArray(raw.care) ? raw.care : (raw.care ? [raw.care] : []),
    packaging: Array.isArray(raw.packaging) ? raw.packaging : (raw.packaging ? [raw.packaging] : []),
    shipping: Array.isArray(raw.shipping) ? raw.shipping : [],
    modes: {
      rent: {
        enabled: true,
        pricing: {
          pricePerDay: perDay,
          minDays: raw.minimumDurationDays || 3,
          windows: [
            {
              id: "standard",
              label: "Standard Window",
              price: rentPrice,
              days: 4,
              tag: "most popular",
            },
            {
              id: "extended",
              label: "Extended Window",
              price: Math.round((rentPrice / 4) * 7),
              days: 7,
              tag: "destination weddings",
            },
          ],
        },
        deposit: {
          amount: raw.securityDeposit || Math.round(rentPrice * 1.5) || 0,
          returnDays: 5,
        },
      },
      preloved: {
        enabled: true,
        pricing: {
          price: listPrice,
          originalPrice: retailPrice,
        },
      },
      buy: {
        enabled: true,
        pricing: {
          price: listPrice,
          originalPrice: retailPrice,
        },
      },
    },
    preloved: {
      enabled: true,
      pricing: {
        price: listPrice,
        originalPrice: retailPrice,
      },
    },
    rent: {
      pricing: {
        pricePerDay: perDay,
        minDays: raw.minimumDurationDays || 3,
        windows: [
          {
            id: "standard",
            label: "Standard Window",
            price: rentPrice,
            days: 4,
            tag: "most popular",
          },
          {
            id: "extended",
            label: "Extended Window",
            price: Math.round((rentPrice / 4) * 7),
            days: 7,
            tag: "destination weddings",
          },
        ],
      },
      deposit: {
        amount: raw.securityDeposit || Math.round(rentPrice * 1.5) || 0,
        returnDays: 5,
      },
    },
  };
};

export const makeProductDetail = formatProductDetail;

/**
 * Navigates to the appropriate category detail page with full product state
 */
export const navigateToProductDetail = (navigate, product) => {
  if (!navigate || !product) return;

  const raw = product.originalData || product.rawProduct || product;
  const { path } = getProductDetailRoute(product);

  let productData = formatProductDetail(raw);

  navigate(path, { state: { product: productData } });
};
