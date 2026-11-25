import Product from "../models/Product.js";
import Designer from "../models/Designer.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import {
  COLOR_FAMILIES,
  familyHex,
  findPaletteByName,
  normalizeHex,
  resolveFamily,
} from "../utils/colorPalette.js";

const DEFAULT_FALLBACK_WEB_IMAGE =
  "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875344/houseofkaira/products/grid-1.jpg";

const isLiveStatus = (status) =>
  String(status || "").trim().toLowerCase() === "live";

const normalizeWebImages = (imgs, fallback = [DEFAULT_FALLBACK_WEB_IMAGE]) => {
  if (!imgs || !Array.isArray(imgs) || imgs.length === 0) {
    return fallback;
  }
  return imgs
    .filter((img) => typeof img === "string" && img.trim() !== "")
    .map((img) => {
      const trimmed = img.trim();
      if (trimmed.startsWith("/uploads/")) {
        const filename = trimmed.replace("/uploads/", "");
        return `https://res.cloudinary.com/dv7jcu8ss/image/upload/houseofkaira/products/${filename}`;
      }
      return trimmed;
    });
};

const computeListingFlags = (product) => {
  const rawModes = Array.isArray(product?.listingModes)
    ? product.listingModes
    : typeof product?.listingModes === "string"
      ? [product.listingModes]
      : [];
  const modesUpper = rawModes.map((m) => String(m).toUpperCase().trim()).filter(Boolean);
  const preloved = modesUpper.some(
    (m) => m.includes("PRELOVED") || m.includes("RE-SELL"),
  );
  const isNew = modesUpper.some(
    (m) => m.includes("BUY") || m.includes("NEW"),
  );
  const rent =
    modesUpper.some((m) => m.includes("RENT")) ||
    Boolean(product?.rentalPrice) ||
    (!preloved && !isNew);
  return { modesUpper, rent, preloved, isNew };
};
// Comprehensive detection helpers
const recognizedColorsList = [
  "red",
  "pink",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "maroon",
  "gold",
  "ivory",
  "black",
  "white",
];

const colorSynonymsMap = {
  crimson: "red",
  gulabi: "pink",
  rose: "pink",
  emerald: "green",
  ivory: "ivory",
  charcoal: "black",
  wine: "maroon",
  midnight: "blue",
  golden: "gold",
  champagne: "gold",
  blush: "pink",
  rajputana: "red",
  saffron: "orange",
  mustard: "yellow",
  ruby: "red",
  navy: "blue",
  royal: "blue",
  silver: "white",
};

const menKeywordsList = [
  "sherwani",
  "sherwanis",
  "bandhgala",
  "bandhgalas",
  "kurta",
  "tuxedo",
  "groom",
  "men",
  "mens",
  "nehru",
  "achkan",
];

const womenKeywordsList = [
  "lehenga",
  "lehengas",
  "saree",
  "sarees",
  "sari",
  "saris",
  "anarkali",
  "anarkalis",
  "sharara",
  "shararas",
  "gharara",
  "gown",
  "gowns",
  "salwar",
  "kurti",
  "dupatta",
  "blouse",
  "choli",
  "bridal",
  "bride",
  "women",
  "womens",
];

export const detectProductGender = (product) => {
  if (!product) return "Women";
  // Priority 1: Explicit database field (when admin provides it now or in future)
  if (product.gender && typeof product.gender === "string" && product.gender.trim()) {
    const g = product.gender.trim().toLowerCase();
    if (["men", "man", "male"].includes(g)) return "Men";
    if (["women", "woman", "female"].includes(g)) return "Women";
    if (["unisex", "other", "all"].includes(g)) return "Unisex";
  }

  // Priority 2: Text cues from name, category, subtitle, description
  const words = [
    product.name,
    product.category,
    product.subtitle,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .split(/[^a-z]+/);

  if (words.some((w) => menKeywordsList.includes(w))) return "Men";
  if (words.some((w) => womenKeywordsList.includes(w))) return "Women";

  // Priority 3: Image URLs & image filenames
  const images = Array.isArray(product.images)
    ? product.images
    : typeof product.image === "string"
    ? [product.image]
    : [];

  const imageString = images.join(" ").toLowerCase();
  if (
    imageString.includes("sherwani") ||
    imageString.includes("bandhgala") ||
    imageString.includes("men") ||
    imageString.includes("groom")
  ) {
    return "Men";
  }

  return "Women";
};

export const detectProductColors = (product) => {
  if (!product) return ["gold"];
  const found = new Set();

  const words = [
    product.color,
    product.name,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .split(/[^a-z]+/);

  words.forEach((w) => {
    if (recognizedColorsList.includes(w)) found.add(w);
    if (colorSynonymsMap[w]) found.add(colorSynonymsMap[w]);
  });

  // Check images for color cues if still empty
  if (found.size === 0) {
    const images = Array.isArray(product.images)
      ? product.images
      : typeof product.image === "string"
      ? [product.image]
      : [];
    const imgWords = images.join(" ").toLowerCase().split(/[^a-z]+/);
    imgWords.forEach((w) => {
      if (recognizedColorsList.includes(w)) found.add(w);
    });
  }

  if (found.size === 0) {
    found.add("gold");
  }

  return Array.from(found);
};

/**
 * Structured colour info for a product.
 * - Uses admin-picked `colors` [{name, hex, family}] (first = primary) when present
 * - Falls back to text detection for older products
 */
export const getProductColorInfo = (product) => {
  const explicitFamilyRaw = String(product?.colorFamily || "").trim();
  const explicitColorText = String(product?.color || "").trim();
  const list = Array.isArray(product?.colors)
    ? product.colors.filter((c) => c && String(c.name || "").trim())
    : [];

  const appendExplicitColorName = (namesList) => {
    if (
      explicitColorText &&
      !namesList.includes(explicitColorText.toLowerCase())
    ) {
      namesList.push(explicitColorText.toLowerCase());
    }
    return namesList;
  };

  // Priority 1: Multi-select structured colours picked in Admin (`product.colors`)
  if (list.length > 0) {
    const entries = list.map((c) => {
      const name = String(c.name).trim();
      const hex = normalizeHex(c.hex) || findPaletteByName(name)?.hex || "";
      const family = String(c.family || "").trim() || resolveFamily(name, hex);
      return { name, hex, family };
    });
    const families = Array.from(
      new Set(entries.map((e) => e.family.toLowerCase()).filter(Boolean)),
    );
    const names = appendExplicitColorName(
      Array.from(new Set(entries.map((e) => e.name.toLowerCase()))),
    );
    return {
      entries,
      families,
      names,
      primaryFamily: (entries[0].family || "").toLowerCase(),
    };
  }

  // Priority 2: Explicit comma-separated or single `product.colorFamily` fallback
  if (explicitFamilyRaw) {
    const familyTokens = explicitFamilyRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const entries = [];
    const seen = new Set();

    familyTokens.forEach((rawFam) => {
      const matchedFamilyObj = COLOR_FAMILIES.find(
        (f) => f.name.toLowerCase() === rawFam.toLowerCase(),
      );
      const canonicalFamily = matchedFamilyObj?.name || rawFam;
      const key = canonicalFamily.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);

      const primaryName =
        entries.length === 0 && explicitColorText
          ? explicitColorText
          : canonicalFamily;
      const primaryHex =
        findPaletteByName(primaryName)?.hex ||
        familyHex(canonicalFamily) ||
        matchedFamilyObj?.hex ||
        "";

      entries.push({ name: primaryName, hex: primaryHex, family: canonicalFamily });
    });

    const families = Array.from(
      new Set(entries.map((e) => e.family.toLowerCase()).filter(Boolean)),
    );
    const names = appendExplicitColorName(
      Array.from(new Set(entries.map((e) => e.name.toLowerCase()))),
    );
    return {
      entries,
      families,
      names,
      primaryFamily: (entries[0]?.family || "").toLowerCase(),
    };
  }

  // Strict: only colours picked in admin count. No guessing from name/description/images.
  return {
    entries: [],
    families: [],
    names: [],
    primaryFamily: "",
  };
};

export const detectProductSizes = (product) => {
  if (!product) return ["Free"];
  const sizes = new Set();
  const rawSizes = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === "string"
    ? product.sizes.split(/[,/ ]+/)
    : [];

  const sizeMap = {
    "36": "XS",
    "38": "S",
    "40": "M",
    "42": "L",
    "44": "XL",
    "46": "XXL",
  };

  rawSizes.forEach((raw) => {
    if (!raw) return;
    const s = String(raw).trim().toUpperCase();
    sizes.add(s);
    if (sizeMap[s]) {
      sizes.add(sizeMap[s]);
    }
  });

  if (sizes.size === 0) {
    sizes.add("Free");
  }

  return Array.from(sizes);
};

export const getWebProducts = async (req, res) => {
  try {
    const {
      section,
      mode,
      category,
      designer,
      occasion,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
    } = req.query;
    const query = { status: { $in: ["Live", "Out of Stock", "Out Of Stock"] } };

    const buildArrayRegex = (values) => {
      const regexParts = values.map(
        (val) =>
          `([^a-zA-Z]${val}[^a-zA-Z]|(^${val}[^a-zA-Z])|([^a-zA-Z]${val}$)|^${val}$)`,
      );
      return { $regex: new RegExp(regexParts.join("|"), "i") };
    };

    // Shop By (rent, preloved, new)
    const activeType = section || mode;
    if (activeType) {
      if (activeType === "rent")
        query.listingModes = buildArrayRegex(["RENTAL"]);
      if (activeType === "preloved")
        query.listingModes = buildArrayRegex(["PRELOVED", "RE-SELL"]);
      if (activeType === "new")
        query.listingModes = buildArrayRegex(["BUY NEW"]);
    }
    if (category) {
      const normCat = category.toLowerCase().replace(/s$/, "");
      query.category = { $regex: new RegExp(normCat, "i") };
    }
    if (designer) query.designer = { $regex: new RegExp(designer, "i") };
    if (occasion) query.occasion = { $regex: new RegExp(occasion, "i") };

    if (minPrice || maxPrice) {
      query.listingPrice = {};
      if (minPrice) query.listingPrice.$gte = Number(minPrice);
      if (maxPrice) query.listingPrice.$lte = Number(maxPrice);
    }

    // In-memory cache for default web products queries to make storefront load instantly
    const isDefaultQuery =
      !section &&
      !mode &&
      !category &&
      !designer &&
      !occasion &&
      !gender &&
      !size &&
      !color &&
      !minPrice &&
      !maxPrice;
    if (
      isDefaultQuery &&
      global.__webProductsCache &&
      Date.now() - global.__webProductsCacheTime < 30000
    ) {
      return res.status(200).json({
        success: true,
        data: global.__webProductsCache,
      });
    }

    // Fetch only officially valid products for the frontend
    const findQuery = Product.find(query).sort({ createdAt: -1 });
    const products = await findQuery;

    let formattedProducts = products.map((product) => {
      const { rent, preloved, isNew } = computeListingFlags(product);

      const type = preloved
        ? "preloved"
        : rent
          ? "rent"
          : isNew
            ? "new"
            : "rent";

      const formatPrice = (price) => {
        if (!price || Number(price) === 0) return null;
        return Number(price).toLocaleString("en-IN");
      };

      const primaryId = product.productId || product._id.toString();

      const colorInfo = getProductColorInfo(product);

      return {
        id: primaryId,
        productId: primaryId,
        _id: product._id.toString(),
        status: product.status || "Live",
        name: product.name || "Untitled Product",
        designer: product.designer || "Unknown Designer",
        image: normalizeWebImages(product.images),
        rent: rent,
        preloved: preloved,
        isNew: isNew,
        rentPrice: formatPrice(product.rentalPrice),
        buyPrice: formatPrice(product.listingPrice),
        originalPrice: formatPrice(product.originalRetailPrice),
        gender: detectProductGender(product),
        category: product.category || "Uncategorized",
        occasion: product.occasion || "",
        size: detectProductSizes(product),
        color: colorInfo.families,
        colorNames: colorInfo.names,
        primaryColorFamily: colorInfo.primaryFamily,
        colorSwatches: colorInfo.entries,
        video: product.video || null,
        type: type,
        popularity: product.timesRented || 0,
        createdAtTimestamp: new Date(product.createdAt || Date.now()).getTime(),
      };
    });

    // Apply post-detection filters for gender, color, and size
    if (gender) {
      const gNorm = gender.trim().toLowerCase();
      formattedProducts = formattedProducts.filter(
        (p) => p.gender && p.gender.toLowerCase() === gNorm,
      );
    }

    if (color) {
      // Accepts a family ("red") or a shade name ("light pink"); comma = any of
      const wanted = String(color)
        .split(",")
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean);
      formattedProducts = formattedProducts.filter((p) =>
        wanted.some(
          (w) =>
            (Array.isArray(p.color) && p.color.includes(w)) ||
            (Array.isArray(p.colorNames) &&
              p.colorNames.some((n) => n === w || n.includes(w))),
        ),
      );
    }

    if (size) {
      const sNorm = size.trim().toUpperCase();
      formattedProducts = formattedProducts.filter(
        (p) => Array.isArray(p.size) && p.size.includes(sNorm),
      );
    }

    if (isDefaultQuery) {
      global.__webProductsCache = formattedProducts;
      global.__webProductsCacheTime = Date.now();
    }

    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching web products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products for the web",
    });
  }
};

export const getFiltersData = async (req, res) => {
  try {
    if (
      global.__webFiltersCache &&
      Date.now() - (global.__webFiltersCacheTime || 0) < 20000
    ) {
      return res.status(200).json({
        success: true,
        data: global.__webFiltersCache,
      });
    }
    const query = { status: { $in: ["Live", "Out of Stock", "Out Of Stock"] } };
    const [products, adminDesigners, adminCategories] = await Promise.all([
      Product.find(query),
      Designer.find({ status: { $ne: "Inactive" } }).sort({ isFeatured: -1, sortOrder: 1, name: 1 }),
      Category.find({}).sort({ sortOrder: 1, name: 1 }),
    ]);

    const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    // Template definitions matching Mohan's UI
    const genderTemplates = [
      ["Women", 0],
      ["Men", 0],
      ["Unisex", 0],
    ];

    // Categories: from Admin Category collection if exists, else fallback
    const categoryTemplates =
      adminCategories && adminCategories.length > 0
        ? adminCategories.map((c) => [c.name, 0])
        : [
            ["Bridal Lehengas", 0],
            ["Party Lehengas", 0],
            ["Anarkalis", 0],
            ["Sarees", 0],
            ["Sherwanis", 0],
            ["Indo-Western", 0],
            ["Salwar Suits", 0],
          ];

    const occasionTemplates = [
      ["Wedding", 0],
      ["Mehendi", 0],
      ["Sangeet", 0],
      ["Reception", 0],
      ["Haldi", 0],
      ["Festive", 0],
    ];

    // Designers: strictly from Admin Designers collection (never inject hardcoded designers)
    let designerTemplates = [];
    if (adminDesigners && adminDesigners.length > 0) {
      designerTemplates = adminDesigners
        .filter((d) => d && d.name && String(d.name).trim() !== "" && d.status !== "Suspended")
        .map((d) => [d.name, 0]);
    }

    const genderCounts = { Women: 0, Men: 0, Unisex: 0 };
    const catCounts = {};
    categoryTemplates.forEach(([name]) => {
      catCounts[name] = 0;
    });

    const occCounts = {};

    const desCounts = {};
    designerTemplates.forEach(([name]) => {
      desCounts[name] = 0;
    });

    let minPrice = Infinity;
    let maxPrice = 0;
    const occasions = new Set();
    const sizes = new Set();
    const colors = new Set();
    const familyShades = {};

    products.forEach((product) => {
      // 1. Gender calculation using robust detection
      const gen = detectProductGender(product);
      if (gen === "Men") genderCounts.Men++;
      else if (gen === "Unisex") genderCounts.Unisex++;
      else genderCounts.Women++;

      // 2. Category calculation (supports single or comma-separated multiple categories)
      const rawCats = String(product.category || "")
        .split(",")
        .map((s) => s.toLowerCase().replace(/s$/, "").trim())
        .filter(Boolean);
      categoryTemplates.forEach(([name]) => {
        const cn = name.toLowerCase().replace(/s$/, "").trim();
        const match = rawCats.some((c) => {
          if (cn === "bridal lehenga") return c.includes("bridal");
          if (cn === "lehenga") {
            return c === "lehenga" || (c.includes("lehenga") && !c.includes("bridal"));
          }
          if (cn === "sherwani") return c.includes("sherwani");
          return c === cn || c.includes(cn) || cn.includes(c);
        });
        if (match) {
          catCounts[name] = (catCounts[name] || 0) + 1;
        }
      });

      // 3. Occasion calculation — strictly from actual product.occasion in DB
      if (product.occasion && String(product.occasion).trim()) {
        const seenInProduct = new Set();
        String(product.occasion)
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)
          .forEach((rawOcc) => {
            const formattedOcc =
              rawOcc.charAt(0).toUpperCase() + rawOcc.slice(1);
            const occKey = formattedOcc.toLowerCase();
            if (!seenInProduct.has(occKey)) {
              seenInProduct.add(occKey);
              const existingKey =
                Object.keys(occCounts).find(
                  (k) => k.toLowerCase() === occKey,
                ) || formattedOcc;
              occCounts[existingKey] = (occCounts[existingKey] || 0) + 1;
              occasions.add(existingKey);
            }
          });
      }

      // 4. Designer calculation
      const d = norm(product.designer);
      let matchedAny = false;
      designerTemplates.forEach(([name]) => {
        if (name !== "Other Designers") {
          const dn = norm(name);
          if (d.includes(dn) || dn.includes(d)) {
            desCounts[name] = (desCounts[name] || 0) + 1;
            matchedAny = true;
          }
        }
      });
      if (!matchedAny && desCounts["Other Designers"] !== undefined) {
        desCounts["Other Designers"] = (desCounts["Other Designers"] || 0) + 1;
      }

      // 5. Sizes & Colors
      const pSizes = detectProductSizes(product);
      pSizes.forEach((s) => sizes.add(s));

      const pColors = getProductColorInfo(product);
      // Only PRIMARY colour families become filter circles (deduplicated)
      if (pColors.primaryFamily) {
        colors.add(pColors.primaryFamily);
        // Remember the exact admin shade name(s) behind each circle for the tooltip
        const shade = pColors.entries[0]?.name;
        if (shade) {
          if (!familyShades[pColors.primaryFamily]) familyShades[pColors.primaryFamily] = new Set();
          familyShades[pColors.primaryFamily].add(shade);
        }
      }

      const price = Number(product.listingPrice) || 0;
      if (price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });

    if (minPrice === Infinity) minPrice = 0;

    const filterPayload = {
        gender: genderTemplates.map(([name]) => [name, genderCounts[name] || 0]),
        category: categoryTemplates.map(([name]) => [name, catCounts[name] || 0]),
        occasion: Object.entries(occCounts)
          .filter(([, count]) => count > 0)
          .sort((a, b) => b[1] - a[1]),
        designer: designerTemplates.map(([name]) => [name, desCounts[name] || 0]),
        occasions: Array.from(occasions).filter(Boolean),
        sizes: Array.from(sizes).filter(Boolean),
        colors: Array.from(colors).filter(Boolean),
        // One circle per colour family, in a stable palette order
        colorSwatches: COLOR_FAMILIES.filter((f) =>
          colors.has(f.name.toLowerCase()),
        ).map((f) => {
          const key = f.name.toLowerCase();
          const shades = Array.from(familyShades[key] || []).sort();
          return {
            name: key,
            label: shades.length ? shades.join(", ") : f.name,
            shades,
            hex: f.hex,
          };
        }),
        budget: {
          min: minPrice,
          max: maxPrice,
        },
    };
    global.__webFiltersCache = filterPayload;
    global.__webFiltersCacheTime = Date.now();
    res.status(200).json({
      success: true,
      data: filterPayload,
    });
  } catch (error) {
    console.error("Error fetching filters data:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching filters data",
    });
  }
};

export const getWebProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { productId: id };
    }

    const product = await Product.findOne(query);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const modes = product.listingModes || [];
    const rent = modes.includes("RENTAL");
    const preloved = modes.includes("PRELOVED") || modes.includes("RE-SELL");
    const buy = modes.includes("BUY NEW");

    // Fetch related products (strictly Live-only, excluding self, preserving configured order)
    const configuredRelatedIds = Array.isArray(product.relatedProductIds)
      ? product.relatedProductIds
          .map((relId) => String(relId || "").trim())
          .filter(Boolean)
      : [];
    const hasCuratedRelated = configuredRelatedIds.length > 0;
    let relatedProducts = [];
    if (hasCuratedRelated) {
      const validIds = configuredRelatedIds.filter(
        (relId) => /^[0-9a-fA-F]{24}$/.test(relId),
      );

      const queryOr = [{ productId: { $in: configuredRelatedIds } }];
      if (validIds.length > 0) {
        queryOr.push({ _id: { $in: validIds } });
      }

      const relProds = await Product.find({ $or: queryOr }).lean();
      const liveRelProds = relProds.filter(
        (rp) =>
          isLiveStatus(rp?.status) &&
          rp.productId !== product.productId &&
          String(rp._id) !== String(product._id),
      );

      const seenRelKeys = new Set();
      const orderedLiveRelProds = [];
      for (const reqId of configuredRelatedIds) {
        const match = liveRelProds.find(
          (rp) => rp.productId === reqId || String(rp._id) === reqId,
        );
        if (!match) continue;
        const canonical = match.productId || String(match._id);
        if (seenRelKeys.has(canonical)) continue;
        seenRelKeys.add(canonical);
        orderedLiveRelProds.push(match);
      }

      relatedProducts = orderedLiveRelProds.map((rp) => {
        const {
          modesUpper: rpModes,
          rent: rpRent,
          preloved: rpPreloved,
          isNew: rpNew,
        } = computeListingFlags(rp);
        const rpImages = normalizeWebImages(rp.images, []);
        const rpPrimaryId = rp.productId || String(rp._id);
        return {
          id: rpPrimaryId,
          _id: String(rp._id),
          productId: rpPrimaryId,
          name: rp.name || "Untitled Product",
          designer: rp.designer || "House of Kaira",
          status: rp.status || "Live",
          image: rpImages[0] || "",
          images: rpImages,
          listingModes: rpModes,
          modes: rpModes,
          rent: rpRent,
          preloved: rpPreloved,
          isNew: rpNew,
          badges: [
            rpRent ? "RENT" : null,
            rpPreloved ? "PRELOVED" : null,
            rpNew ? "NEW" : null,
          ].filter(Boolean),
          rentPrice: rp.rentalPrice || rp.perDayRate || 0,
          rentalPrice: rp.rentalPrice || rp.perDayRate || 0,
          buyPrice: rp.listingPrice || 0,
          retailPrice: rp.originalRetailPrice || 0,
          originalPrice: rp.originalRetailPrice || 0,
        };
      });
    }

    // Build colors array (real hex codes from admin colour picker when available)
    let colors = [];
    const colorInfo = getProductColorInfo(product);
    if (colorInfo.entries.length > 0) {
      colors = colorInfo.entries.map((c, i) => ({
        code: c.hex || familyHex(c.family) || "#000000",
        hex: c.hex || familyHex(c.family) || "",
        name: c.name,
        family: c.family,
        primary: i === 0,
        images: product.images || [],
      }));
    } else if (product.color) {
      colors = product.color
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c, i) => ({
          code: findPaletteByName(c)?.hex || "",
          hex: findPaletteByName(c)?.hex || "",
          name: c,
          primary: i === 0,
          images: product.images || [],
        }));
    }

    const cleanSizes = Array.isArray(product.sizes)
      ? product.sizes.map((s) => String(s || "").trim()).filter(Boolean)
      : typeof product.sizes === "string" && product.sizes.trim()
        ? product.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const sizePills = cleanSizes.map((s) => ({
      label: s.toUpperCase(),
      available: true,
    }));

    const minRentalDays =
      Number(product.minimumDurationDays) >= 1
        ? Math.floor(Number(product.minimumDurationDays))
        : 3;
    const resolvedPerDay =
      Number(product.perDayRate) > 0
        ? Number(product.perDayRate)
        : product.rentalPrice
          ? Math.round(product.rentalPrice / 4)
          : 2500;
    const resolvedColorFamily =
      String(product.colorFamily || "").trim() ||
      Array.from(
        new Set(colorInfo.entries.map((e) => e.family).filter(Boolean)),
      ).join(", ");
    const resolvedCondition = String(product.condition || "").trim();
    const resolvedRating = Number(product.rating) || 0;
    const resolvedReviewCount = Number(product.reviewCount) || 0;
    const resolvedTimesRented = Number(product.timesRented) || 0;

    const formattedProduct = {
      id: product.productId || product._id.toString(),
      productId: product.productId || product._id.toString(),
      _id: product._id.toString(),
      designer: product.designer || "",
      title: product.name,
      name: product.name,
      subtitle: product.subtitle || "",
      subTitle: product.subtitle || "",
      category: product.category || "",
      occasion: product.occasion || "",
      description: product.description || "",
      story: product.story || "",
      material: product.material || "",
      fabric: product.material || "",
      color: product.color || "",
      craft: product.craft || "",
      technique: product.technique || "",
      embellishments: product.embellishments || "",
      threadYarnDetail: product.threadYarnDetail || product.threadWork || "",
      setIncludes: product.setIncludes || "",
      origin: product.origin || "",
      weight: product.weight || "",
      deliveryTiming: product.deliveryTiming || "",
      sizes: cleanSizes,
      measurements: product.measurements || {},
      measurementsCm: product.measurementsCm || {},
      bestSuitedForHeight: product.bestSuitedForHeight || "",
      sizeGuide: product.sizeGuide || "",
      disclosure: product.honestDisclosure || "",
      honestDisclosure: product.honestDisclosure || "",
      condition: {
        grade: resolvedCondition ? resolvedCondition.toLowerCase() : "",
        label: resolvedCondition,
      },
      originalRetailPrice: product.originalRetailPrice || 0,
      retailPrice: product.originalRetailPrice || 0,
      originalPrice: product.originalRetailPrice || 0,
      rentalPrice: product.rentalPrice || 0,
      perDayRate: resolvedPerDay,
      minimumDurationDays: minRentalDays,
      listingPrice: product.listingPrice || 0,
      price: product.rentalPrice || product.listingPrice || 0,
      images: (product.images || []).map((img) =>
        typeof img === "string" && img.startsWith("/uploads/")
          ? `https://res.cloudinary.com/dv7jcu8ss/image/upload/houseofkaira/products/${img.replace("/uploads/", "")}`
          : img
      ),
      video: product.video || null,
      colors: colors,
      colorFamily: resolvedColorFamily,
      sizeTable: [],
      details: {
        designer: product.designer || "",
        category: product.category || "",
        fabric: product.material || "",
        color: product.color || "",
        colorFamily: resolvedColorFamily,
        craft: product.craft || "",
        technique: product.technique || "",
        embellishments: product.embellishments || "",
        thread: product.threadYarnDetail || product.threadWork || "",
        includes: product.setIncludes || "",
        occasion: product.occasion || "",
        origin: product.origin || "",
        weight: product.weight || "",
        delivery: product.deliveryTiming || "",
        sku: product.sku || "",
        condition: resolvedCondition,
      },
      sku: product.sku || "",
      tags: Array.isArray(product.tags) ? product.tags.filter(Boolean) : [],
      rating: resolvedRating,
      reviewCount: resolvedReviewCount,
      reviews: resolvedReviewCount,
      timesRented: resolvedTimesRented,
      rentInfo: { rentedCount: resolvedTimesRented },
      careByFabric: product.careByFabric || "",
      care: Array.isArray(product.care) ? product.care.filter(Boolean) : [],
      packaging: Array.isArray(product.packaging) ? product.packaging : [],
      shipping: product.shipping || [],
      relatedProducts: relatedProducts,
      hasCuratedRelated: hasCuratedRelated,
      modes: {
        rent: {
          enabled: rent,
          sizes: sizePills,
          availability: {
            unavailableDates: [],
            blockedRanges: [
              ...(product.blockedDates || []).map((bd) => ({
                from: bd.from,
                to: bd.to,
                reason: bd.reason,
              })),
              ...(product.bookingHistory || []).map((b) => ({
                from: b.startDate,
                to: b.endDate,
                reason: "booked",
              })),
              ...(product.externalBookings || []).map((b) => ({
                from: b.startDate,
                to: b.endDate,
                reason: "external_booked",
              })),
            ],
          },
          pricing: {
            pricePerDay: resolvedPerDay,
            minDays: minRentalDays,
            originalRetailPrice: product.originalRetailPrice || 0,
            retailPrice: product.originalRetailPrice || 0,
            windows: [
              {
                id: "standard",
                label: product.standardWindowLabel || "Standard Window",
                price: product.rentalPrice || (product.perDayRate ? product.perDayRate * 4 : 5000),
                days: 4,
                tag: product.standardWindowTag || "most popular",
              },
              {
                id: "extended",
                label: product.extendedWindowLabel || "Extended Window",
                price: product.extendedWindowPrice && product.extendedWindowPrice !== product.rentalPrice
                  ? product.extendedWindowPrice
                  : product.rentalPrice
                  ? Math.round((product.rentalPrice / 4) * 7)
                  : (product.perDayRate ? product.perDayRate * 7 : 8500),
                days: 7,
                tag: product.extendedWindowTag || "destination weddings",
              },
            ],
          },
          deposit: {
            amount: product.securityDeposit || 5000,
            refundable: true,
            returnDays: 5,
          },
        },
        preloved: {
          enabled: preloved,
          pricing: {
            price: product.listingPrice || 0,
            originalPrice: product.originalRetailPrice || 0,
          },
          condition: {
            label: product.condition || "Excellent Condition",
            rating: 4.5,
          },
          allowOffer: product.allowOffer === true || product.allowOffer === "true",
          minOffer: product.minOffer || null,
          maxOffer: product.maxOffer || null,
        },
        buy: {
          enabled: buy,
          pricing: {
            price: product.listingPrice || 0,
            discountPrice: 0,
          },
        },
      },
    };

    res.status(200).json({
      success: true,
      data: formattedProduct,
    });
  } catch (error) {
    console.error("Error fetching web product details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details",
    });
  }
};
