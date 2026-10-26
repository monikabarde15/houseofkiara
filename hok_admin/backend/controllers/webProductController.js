import Product from "../models/Product.js";
import Designer from "../models/Designer.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
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
      const rawModes = Array.isArray(product.listingModes)
        ? product.listingModes
        : typeof product.listingModes === "string"
          ? [product.listingModes]
          : [];
      const modesUpper = rawModes.map((m) => String(m).toUpperCase().trim());

      const preloved = modesUpper.some(
        (m) => m.includes("PRELOVED") || m.includes("RE-SELL"),
      );
      const isNew = modesUpper.some(
        (m) => m.includes("BUY") || m.includes("NEW"),
      );
      const rent =
        modesUpper.some((m) => m.includes("RENT")) ||
        Boolean(product.rentalPrice) ||
        (!preloved && !isNew);

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

      const normalizeImages = (imgs) => {
        if (!imgs || !Array.isArray(imgs) || imgs.length === 0) {
          return [
            "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1791875344/houseofkaira/products/grid-1.jpg",
          ];
        }
        return imgs.map((img) => {
          if (typeof img === "string" && img.startsWith("/uploads/")) {
            const filename = img.replace("/uploads/", "");
            return `https://res.cloudinary.com/dv7jcu8ss/image/upload/houseofkaira/products/${filename}`;
          }
          return img;
        });
      };

      return {
        id: primaryId,
        productId: primaryId,
        _id: product._id.toString(),
        name: product.name || "Untitled Product",
        designer: product.designer || "Unknown Designer",
        image: normalizeImages(product.images),
        rent: rent,
        preloved: preloved,
        isNew: isNew,
        rentPrice: formatPrice(product.rentalPrice),
        buyPrice: formatPrice(product.listingPrice),
        originalPrice: formatPrice(product.originalRetailPrice),
        gender: detectProductGender(product),
        category: product.category || "Uncategorized",
        occasion: product.occasion || "Festive",
        size: detectProductSizes(product),
        color: detectProductColors(product),
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
      const cNorm = color.trim().toLowerCase();
      formattedProducts = formattedProducts.filter(
        (p) => Array.isArray(p.color) && p.color.includes(cNorm),
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

    // Designers: REAL designers from Admin collection!
    let designerTemplates = [];
    if (adminDesigners && adminDesigners.length > 0) {
      designerTemplates = adminDesigners.map((d) => [d.name, 0]);
      // Check if there are live products with designers not in adminDesigners
      const adminNamesSet = new Set(adminDesigners.map((d) => norm(d.name)));
      const hasOther = products.some((p) => p.designer && !adminNamesSet.has(norm(p.designer)));
      if (hasOther) {
        designerTemplates.push(["Other Designers", 0]);
      }
    } else {
      designerTemplates = [
        ["Sabyasachi", 0],
        ["Manish Malhotra", 0],
        ["Tarun Tahiliani", 0],
        ["Anita Dongre", 0],
        ["Ritu Kumar", 0],
        ["Rahul Mishra", 0],
        ["Other Designers", 0],
      ];
    }

    const genderCounts = { Women: 0, Men: 0, Unisex: 0 };
    const catCounts = {};
    categoryTemplates.forEach(([name]) => {
      catCounts[name] = 0;
    });

    const occCounts = {
      Wedding: 0,
      Mehendi: 0,
      Sangeet: 0,
      Reception: 0,
      Haldi: 0,
      Festive: 0,
    };

    const desCounts = {};
    designerTemplates.forEach(([name]) => {
      desCounts[name] = 0;
    });

    let minPrice = Infinity;
    let maxPrice = 0;
    const occasions = new Set();
    const sizes = new Set();
    const colors = new Set();

    products.forEach((product) => {
      // 1. Gender calculation using robust detection
      const gen = detectProductGender(product);
      if (gen === "Men") genderCounts.Men++;
      else if (gen === "Unisex") genderCounts.Unisex++;
      else genderCounts.Women++;

      // 2. Category calculation
      const c = (product.category || "").toLowerCase().replace(/s$/, "").trim();
      categoryTemplates.forEach(([name]) => {
        const cn = name.toLowerCase().replace(/s$/, "").trim();
        let match = false;
        if (cn === "bridal lehenga") {
          match = c.includes("bridal");
        } else if (cn === "lehenga") {
          match = c === "lehenga" || (c.includes("lehenga") && !c.includes("bridal"));
        } else if (cn === "sherwani") {
          match = c.includes("sherwani");
        } else {
          match = c === cn || c.includes(cn) || cn.includes(c);
        }
        if (match) {
          catCounts[name] = (catCounts[name] || 0) + 1;
        }
      });

      // 3. Occasion calculation
      if (product.occasion) {
        const occStr = product.occasion.toLowerCase();
        product.occasion.split(",").forEach((o) => occasions.add(o.trim()));
        if (occStr.includes("wedding")) occCounts["Wedding"]++;
        if (occStr.includes("mehendi")) occCounts["Mehendi"]++;
        if (occStr.includes("sangeet")) occCounts["Sangeet"]++;
        if (occStr.includes("reception")) occCounts["Reception"]++;
        if (occStr.includes("haldi")) occCounts["Haldi"]++;
        if (occStr.includes("festive")) occCounts["Festive"]++;
      } else {
        occCounts["Festive"]++;
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

      const pColors = detectProductColors(product);
      pColors.forEach((col) => colors.add(col));

      const price = Number(product.listingPrice) || 0;
      if (price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
    });

    if (minPrice === Infinity) minPrice = 0;

    res.status(200).json({
      success: true,
      data: {
        gender: genderTemplates.map(([name]) => [name, genderCounts[name] || 0]),
        category: categoryTemplates.map(([name]) => [name, catCounts[name] || 0]),
        occasion: occasionTemplates.map(([name]) => [name, occCounts[name] || 0]),
        designer: designerTemplates.map(([name]) => [name, desCounts[name] || 0]),
        occasions: Array.from(occasions).filter(Boolean),
        sizes: Array.from(sizes).filter(Boolean),
        colors: Array.from(colors).filter(Boolean),
        budget: {
          min: minPrice,
          max: maxPrice,
        },
      },
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

    // Fetch related products
    let relatedProducts = [];
    if (product.relatedProductIds && product.relatedProductIds.length > 0) {
      // Filter out invalid ObjectIds to prevent Mongoose cast errors
      const validIds = product.relatedProductIds.filter(
        (id) => id && id.length === 24,
      );

      const queryOr = [{ productId: { $in: product.relatedProductIds } }];
      if (validIds.length > 0) {
        queryOr.push({ _id: { $in: validIds } });
      }

      const relProds = await Product.find({ $or: queryOr }).lean();
      relatedProducts = relProds.map((p) => ({
        id: p.productId || p._id.toString(),
        name: p.name,
        designer: p.designer || "Unknown",
        image: p.images?.[0] || "",
        rentalPrice: p.rentalPrice || p.perDayRate || 0,
        retailPrice: p.originalRetailPrice || 0,
        modes: p.listingModes || [],
      }));
    }

    // Build colors array
    let colors = [];
    if (product.color) {
      colors = product.color.split(",").map((c) => ({
        code: c.trim(),
        name: c.trim(),
        images: product.images || [],
      }));
    } else {
      // fallback color so the UI doesn't crash if it expects an array
      colors = [
        { code: "#000000", name: "Standard", images: product.images || [] },
      ];
    }

    const sizes = product.sizes
      ? product.sizes.map((s) => ({
          label: s.trim().toUpperCase(),
          available: true,
        }))
      : [];

    const formattedProduct = {
      id: product.productId || product._id.toString(),
      _id: product._id.toString(),
      designer: product.designer || "Unknown Designer",
      title: product.name,
      subTitle: product.subtitle || product.category || "",
      description: product.description || product.story || "",
      craft: product.craft || product.material || "",
      disclosure: product.honestDisclosure || "",
      condition: {
        grade: product.condition
          ? product.condition.toLowerCase()
          : "excellent",
      },
      originalRetailPrice: product.originalRetailPrice || 0,
      retailPrice: product.originalRetailPrice || 0,
      originalPrice: product.originalRetailPrice || 0,
      rentalPrice: product.rentalPrice || 0,
      listingPrice: product.listingPrice || 0,
      price: product.rentalPrice || product.listingPrice || 0,
      images: (product.images || []).map((img) =>
        typeof img === "string" && img.startsWith("/uploads/")
          ? `https://res.cloudinary.com/dv7jcu8ss/image/upload/houseofkaira/products/${img.replace("/uploads/", "")}`
          : img
      ),
      video: product.video || null,
      colors: colors,
      sizeTable: sizes,
      details: {
        fabric: product.material || "",
        technique: product.technique || "",
        includes: product.setIncludes || "",
        delivery: product.deliveryTiming || "",
        color: product.color || "",
        thread: product.threadYarnDetail || product.threadWork || "",
        occasion: product.occasion || "",
        origin: product.origin || "",
      },
      rating: product.rating || 5,
      reviews: product.reviewCount || 12,
      rentInfo: { rentedCount: product.timesRented || 45 },
      care: product.care || [],
      shipping: product.shipping || [],
      relatedProducts: relatedProducts,
      modes: {
        rent: {
          enabled: rent,
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
            pricePerDay: product.rentalPrice ? Math.round(product.rentalPrice / 4) : (product.perDayRate || 2500),
            minDays: 3,
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
