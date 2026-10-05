import Product from "../models/Product.js";
import mongoose from "mongoose";
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
    if (category) query.category = category;
    if (designer) query.designer = designer;
    if (occasion) query.occasion = occasion;
    // if (gender) {
    //   const genderRegex = new RegExp(`^${gender}$`, "i");
    //   if (gender.toLowerCase() === 'men') {
    //     query.$or = [
    //       { gender: genderRegex },
    //       { gender: { $in: [null, ""] }, category: "Sherwanis" }
    //     ];
    //   } else if (gender.toLowerCase() === 'women') {
    //     query.$or = [
    //       { gender: genderRegex },
    //       { gender: { $in: [null, ""] }, category: { $ne: "Sherwanis" } }
    //     ];
    //   } else {
    //     query.gender = genderRegex;
    //   }
    // }

    // if (size) query.sizes = { $regex: new RegExp(`[^a-zA-Z]${size}[^a-zA-Z]|(^${size}[^a-zA-Z])|([^a-zA-Z]${size}$)|^${size}$`, "i") };
    // if (color) query.color = { $regex: new RegExp(color, "i") }; // handle substring since it could be comma-separated string in DB

    if (minPrice || maxPrice) {
      query.listingPrice = {};
      if (minPrice) query.listingPrice.$gte = Number(minPrice);
      if (maxPrice) query.listingPrice.$lte = Number(maxPrice);
    }

    // Fetch only officially valid products for the frontend
    const findQuery = Product.find(query).sort({ createdAt: -1 });
    const products = await findQuery;

    const formattedProducts = products.map((product) => {
      const modes = product.listingModes || [];
      const rent = modes.includes("RENTAL");
      const preloved = modes.includes("PRELOVED") || modes.includes("RE-SELL");
      const isNew = modes.includes("BUY NEW");

      const type = preloved
        ? "preloved"
        : rent
          ? "rent"
          : isNew
            ? "new"
            : "new";

      const formatPrice = (price) => {
        if (!price || Number(price) === 0) return null;
        return Number(price).toLocaleString("en-IN");
      };

      const defaultGender =
        product.category && product.category.toLowerCase().includes("sherwani")
          ? "Men"
          : "Women";

      return {
        id: new Date(product.createdAt || Date.now()).getTime(), // Use timestamp for correct newest sorting
        _id: product._id.toString(), // Keep original id just in case
        name: product.name || "Untitled Product",
        designer: product.designer || "Unknown Designer",
        image:
          product.images && product.images.length > 0
            ? product.images
            : ["https://placehold.co/600x800?text=No+Image"],
        rent: rent,
        preloved: preloved,
        isNew: isNew,
        rentPrice: formatPrice(product.rentalPrice),
        buyPrice: formatPrice(product.listingPrice),
        originalPrice: formatPrice(product.originalRetailPrice),
        gender: product.gender || defaultGender,
        category: product.category || "Uncategorized",
        occasion: product.occasion || "Festive",
        size: product.sizes
          ? product.sizes.map((s) => s.trim().toUpperCase())
          : [],
        color: product.color
          ? String(product.color)
              .split(",")
              .map((c) => c.trim())
          : [],
        video: product.video || null,
        type: type,
        popularity: product.timesRented || 0,
      };
    });

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
    const products = await Product.find(query);

    const occasions = new Set();
    const sizes = new Set();
    const colors = new Set();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach((product) => {
      if (product.occasion) {
        // Assume occasion might be comma separated or single
        product.occasion.split(",").forEach((o) => occasions.add(o.trim()));
      }

      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach((s) => sizes.add(s.trim().toUpperCase()));
      }

      if (product.color) {
        product.color.split(",").forEach((c) => colors.add(c.trim()));
      }

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
      images: product.images || [],
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
