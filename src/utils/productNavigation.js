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

  // ── Rental availability: live bookings + manual blocks (+ overdue pieces) ──
  const preBuf = Number(raw.preRentalBufferDays ?? 2);
  const postBuf = Number(raw.postRentalBufferDays ?? 3);
  const ymdOf = (v) => {
    if (!v) return "";
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const shiftYmd = (ymd, n) => {
    const d = new Date(`${ymd}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const rawRanges = [
    ...(Array.isArray(raw.blockedDates) ? raw.blockedDates : []),
    ...(Array.isArray(raw.overdueBlockedDates) ? raw.overdueBlockedDates : []),
  ]
    .map((r) => ({ from: ymdOf(r.from), to: ymdOf(r.to), reason: r.reason || "Booked" }))
    .filter((r) => r.from && r.to);
  const blockedRanges = rawRanges.map((r) => ({
    from: shiftYmd(r.from, -preBuf),
    to: shiftYmd(r.to, postBuf),
    reason: r.reason,
  }));
  const unavailableDates = (() => {
    const set = new Set();
    blockedRanges.forEach((r) => {
      let d = r.from;
      let guard = 0;
      while (d <= r.to && guard++ < 400) {
        set.add(d);
        d = shiftYmd(d, 1);
      }
    });
    return [...set];
  })();
  const rentAvailability = {
    unavailableDates,
    blockedRanges,
    preRentalBufferDays: preBuf,
  };
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
  const extendedPrice =
    parsePrice(raw.extendedWindowPrice) ||
    parsePrice(raw.modes?.rent?.pricing?.windows?.[1]?.price) ||
    Math.round((rentPrice / 4) * 7);
  const minRentalDays =
    Number(raw.minimumDurationDays) >= 1
      ? Math.floor(Number(raw.minimumDurationDays))
      : Number(raw.modes?.rent?.pricing?.minDays) >= 1
        ? Math.floor(Number(raw.modes.rent.pricing.minDays))
        : 3;

  const rawCategory =
    raw.category !== undefined && raw.category !== null
      ? String(raw.category).trim()
      : "";
  const rawSubtitle =
    raw.subtitle !== undefined && raw.subtitle !== null
      ? String(raw.subtitle).trim()
      : raw.subTitle !== undefined &&
          raw.subTitle !== null &&
          String(raw.subTitle).trim() !== rawCategory
        ? String(raw.subTitle).trim()
        : "";

  const normalizedColors = (Array.isArray(raw.colors) ? raw.colors : [])
    .map((c, idx) => {
      if (!c || typeof c !== "object") return null;
      const name = String(c.name || "").trim();
      const hex = String(c.hex || c.code || "").trim();
      const family = String(c.family || "").trim();
      if (!name && !hex) return null;
      if (
        name === "Standard" &&
        hex === "#000000" &&
        !family &&
        !raw.color &&
        !raw.colorFamily
      ) {
        return null;
      }
      return {
        ...c,
        name: name || family || hex,
        hex: hex || "",
        code: hex || "",
        family,
        primary: c.primary !== undefined ? Boolean(c.primary) : idx === 0,
        images:
          Array.isArray(c.images) && c.images.length > 0
            ? c.images
            : raw.images || [],
      };
    })
    .filter(Boolean);

  const derivedFamilies = Array.from(
    new Set(normalizedColors.map((c) => c.family).filter(Boolean)),
  ).join(", ");
  const resolvedColorFamily =
    String(raw.colorFamily || raw.details?.colorFamily || "").trim() ||
    derivedFamilies;

  const rawConditionObj =
    raw.condition && typeof raw.condition === "object" ? raw.condition : null;
  const rawConditionLabel = rawConditionObj
    ? String(rawConditionObj.label || rawConditionObj.grade || "").trim()
    : String(raw.condition || "").trim();
  const normalizedCondition = {
    grade: rawConditionLabel.toLowerCase(),
    label: rawConditionLabel,
  };

  const normalizedWeight =
    raw.weight !== undefined && raw.weight !== null
      ? String(raw.weight).trim()
      : "";
  const normalizedHeight =
    raw.bestSuitedForHeight !== undefined && raw.bestSuitedForHeight !== null
      ? String(raw.bestSuitedForHeight).trim()
      : "";
  const normalizedCare = (
    Array.isArray(raw.care)
      ? raw.care
      : typeof raw.care === "string"
        ? raw.care.split(/\r?\n|;/)
        : []
  )
    .map((item) => String(item || "").trim())
    .filter((item) => item && item.toLowerCase() !== "none");
  const normalizedTags = (
    Array.isArray(raw.tags)
      ? raw.tags
      : typeof raw.tags === "string"
        ? raw.tags.split(",")
        : []
  )
    .map((t) => String(t || "").trim())
    .filter((t) => t && t.toLowerCase() !== "none");
  const rawSizeSource = Array.isArray(raw.sizes)
    ? raw.sizes
    : Array.isArray(raw.modes?.rent?.sizes)
      ? raw.modes.rent.sizes
      : raw.sizes
        ? [raw.sizes]
        : [];
  const normalizedSizes = rawSizeSource
    .map((s) => (typeof s === "object" ? s?.size || s?.label : s))
    .map((s) => String(s || "").trim())
    .filter((s) => s && s.toLowerCase() !== "none");

  const resolvedRating = Number(raw.rating) || 0;
  const resolvedReviewCount = Number(raw.reviewCount ?? raw.reviews) || 0;
  const resolvedTimesRented =
    Number(raw.timesRented ?? raw.rentInfo?.rentedCount) || 0;
  const rawSkuOnly = String(raw.details?.sku || raw.sku || "").trim();

  return {
    ...raw,
    id: raw._id || raw.id,
    _id: raw._id || raw.id,
    productId: raw.productId || raw.sku || raw._id || raw.id,
    sku: raw.sku || raw.productId,
    title: raw.name || raw.title || "",
    name: raw.name || raw.title || "",
    subtitle: rawSubtitle,
    subTitle: rawSubtitle,
    category: rawCategory,
    designer: raw.designer || "",
    description: raw.description || "",
    price: rentPrice || listPrice,
    rentalPrice: rentPrice,
    extendedWindowPrice: extendedPrice,
    perDayRate: perDay,
    minimumDurationDays: minRentalDays,
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
    sizes: normalizedSizes,
    availableSizes: normalizedSizes,
    colors: normalizedColors,
    colorFamily: resolvedColorFamily,
    details: {
      designer: raw.details?.designer || raw.designer || "",
      category: raw.details?.category || rawCategory,
      fabric: raw.details?.fabric || raw.material || raw.fabric || "",
      color: raw.details?.color || raw.color || "",
      colorFamily: resolvedColorFamily,
      craft: raw.details?.craft || raw.craft || "",
      technique:
        raw.details?.technique || raw.technique || raw.craftTechnique || "",
      embellishments: raw.details?.embellishments || raw.embellishments || "",
      thread:
        raw.details?.thread ||
        raw.threadYarnDetail ||
        raw.threadWork ||
        raw.thread ||
        "",
      includes: raw.details?.includes || raw.setIncludes || raw.includes || "",
      occasion: raw.details?.occasion || raw.occasion || "",
      origin: raw.details?.origin || raw.origin || "",
      weight: raw.details?.weight || normalizedWeight,
      delivery:
        raw.details?.delivery ||
        raw.deliveryTiming ||
        raw.delivery ||
        raw.deliveryTime ||
        "",
      sku: rawSkuOnly,
      condition: normalizedCondition.label,
    },
    fabric: raw.material || raw.fabric || "",
    craft: raw.craft || "",
    technique: raw.technique || raw.craftTechnique || "",
    craftTechnique: raw.technique || raw.craftTechnique || "",
    embellishments: raw.embellishments || "",
    threadYarnDetail: raw.threadYarnDetail || raw.threadWork || "",
    includes: raw.setIncludes || raw.includes || "",
    weight: normalizedWeight,
    deliveryTiming: raw.deliveryTiming || raw.delivery || raw.deliveryTime || "",
    deliveryTime: raw.deliveryTiming || raw.delivery || raw.deliveryTime || "",
    delivery: raw.deliveryTiming || raw.delivery || raw.deliveryTime || "",
    story: raw.story || raw.craftStory || "",
    craftStory: raw.story || raw.craftStory || "",
    disclosure: raw.honestDisclosure || raw.disclosure || "",
    honestDisclosure: raw.honestDisclosure || raw.disclosure || "",
    sizeNote: raw.sizeNote || raw.sizeGuide || "",
    sizeGuide: raw.sizeGuide || raw.sizeNote || "",
    measurements:
      raw.measurements && typeof raw.measurements === "object"
        ? raw.measurements
        : {},
    measurementsCm:
      raw.measurementsCm && typeof raw.measurementsCm === "object"
        ? raw.measurementsCm
        : {},
    bestSuitedForHeight: normalizedHeight,
    condition: normalizedCondition,
    careByFabric: raw.careByFabric || "",
    care: normalizedCare,
    tags: normalizedTags,
    rating: resolvedRating,
    reviewCount: resolvedReviewCount,
    reviews: resolvedReviewCount,
    timesRented: resolvedTimesRented,
    rentInfo: { rentedCount: resolvedTimesRented },
    packaging: Array.isArray(raw.packaging) ? raw.packaging : (raw.packaging ? [raw.packaging] : []),
    shipping: Array.isArray(raw.shipping) ? raw.shipping : [],
    modes: {
      rent: {
        enabled: true,
        availability: rentAvailability,
        pricing: {
          pricePerDay: perDay,
          minDays: minRentalDays,
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
              price: extendedPrice,
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
        minDays: minRentalDays,
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
            price: extendedPrice,
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
