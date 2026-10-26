import { useState, useCallback, useRef, useEffect } from "react";
import useWishlistStore from "../../../store/wishlistStore";
import useAuthStore from "../../../store/authStore";

// Helper functions
const getRelativeDate = (dateString) => {
  if (!dateString) return "Recently";
  const savedDate = new Date(dateString);
  if (isNaN(savedDate.getTime())) return "Recently";
  const now = new Date();
  const diffTime = Math.abs(now - savedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

const formatPrice = (price) => {
  if (typeof price === "number") return price.toLocaleString("en-IN");
  if (!price) return "0";
  const num = Number(String(price).replace(/[^\d]/g, ""));
  return isNaN(num) ? price : num.toLocaleString("en-IN");
};

const cleanNum = (val) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = Number(String(val).replace(/[^\d]/g, ""));
  return isNaN(num) ? 0 : num;
};

// Transform database product to wishlist card format
const transformProduct = (p) => {
  const rawModes = Array.isArray(p.listingModes)
    ? p.listingModes
    : typeof p.listingModes === "string"
      ? [p.listingModes]
      : [];
  const modesUpper = rawModes.map((m) => String(m).toUpperCase().trim());

  const isRental =
    modesUpper.some((m) => m.includes("RENT")) ||
    p.type === "rent" ||
    p.type === "rental" ||
    p.mode === "rent";

  const isPreloved =
    modesUpper.some((m) => m.includes("PRELOVED") || m.includes("RE-SELL")) ||
    p.type === "preloved" ||
    p.mode === "preloved";

  const type = isRental ? "rent" : isPreloved ? "preloved" : "new";

  const rentPrice = cleanNum(p.rentalPrice || (p.perDayRate ? p.perDayRate * 4 : 0) || p.price);
  const listingPrice = cleanNum(p.listingPrice || p.price || 0);
  const currentPrice = type === "rent" ? rentPrice : listingPrice;

  // Real retail price from database only (no fake multipliers)
  const originalPrice = cleanNum(
    p.originalRetailPrice ||
    p.originalPrice ||
    p.retailPrice ||
    p.oldPrice ||
    p.modes?.preloved?.pricing?.originalPrice ||
    p.modes?.rent?.pricing?.originalRetailPrice ||
    0
  );

  const savePercentage =
    originalPrice > currentPrice && originalPrice > 0 && currentPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : null;

  const resolvedImage =
    (Array.isArray(p.images) && p.images[0]) ||
    (Array.isArray(p.image) && p.image[0]) ||
    (typeof p.image === "string" && p.image) ||
    "";

  return {
    id: String(p.sku || p.productId || p._id || p.id),
    sku: String(p.sku || p.productId || ""),
    productId: String(p.productId || p.sku || ""),
    _id: String(p._id || ""),
    type,
    designer: (p.designer || "").toUpperCase(),
    name: p.name || p.title || "Designer Piece",
    price: formatPrice(currentPrice),
    originalPrice: formatPrice(originalPrice),
    savePercentage: savePercentage ? `${savePercentage}%` : null,
    duration: p.rentalDuration || "for 4 days",
    savedDate: getRelativeDate(p.createdAt || p.dateSaved),
    condition: p.condition || (type === "preloved" ? "Excellent condition" : null),
    unavailable: p.availability === "Unavailable" || p.isAvailable === false,
    unavailableNote: p.isAvailable === false ? "Unavailable for your selected dates" : null,
    stripTag: p.tag || null,
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["Free Size"],
    image: resolvedImage,
    originalData: p,
  };
};

export const useWishlistProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  const wishlistIds = useWishlistStore((state) => state.items);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  // Load wishlist products
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const auth = useAuthStore.getState();

      try {
        let loaded = [];

        if (auth.isAuthenticated && auth.token) {
          // Fetch authenticated customer's populated wishlist products
          const res = await fetch("/api/customer/auth/wishlist/products", {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            loaded = data.data.map(transformProduct);
          }
        }

        // If guest or some wishlisted items were not in DB response, check catalog
        const loadedIds = new Set(
          loaded.flatMap((p) => {
            const o = p.originalData || {};
            return [p.id, p.sku, p._id, p.productId, o.sku, o.productId, o._id, o.id]
              .filter(Boolean)
              .map(String);
          })
        );
        const missing = wishlistIds.filter((wid) => !loadedIds.has(String(wid)));

        if (missing.length > 0 || !auth.isAuthenticated) {
          const pRes = await fetch("/api/products").catch(() => null);
          const pData = pRes ? await pRes.json().catch(() => null) : null;
          if (pData?.success && Array.isArray(pData.data)) {
            const extra = pData.data.filter((p) => {
              const pid = String(p._id || p.productId || p.sku || p.id);
              const psku = String(p.sku || "");
              return wishlistIds.some((wid) => {
                const swid = String(wid);
                return swid === pid || (psku && swid === psku);
              });
            });
            extra.forEach((p) => {
              const transformed = transformProduct(p);
              if (!loadedIds.has(String(transformed.id))) {
                loadedIds.add(String(transformed.id));
                loaded.push(transformed);
              }
            });
          }
        }

        if (isMounted) {
          setProducts(loaded);
        }
      } catch (err) {
        console.error("Error loading wishlist products:", err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [wishlistIds]);

  const removeProduct = useCallback((productId, productData, onShowToast) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setPendingRemoval(null);
    }

    setPendingRemoval(productData);
    onShowToast?.("Removed from your wishlist", true);

    const orig = productData?.originalData || productData || {};
    const targetId =
      productData?.sku ||
      orig.sku ||
      productData?.productId ||
      orig.productId ||
      productData?.id ||
      orig.id ||
      productId;

    useWishlistStore.getState().removeFromWishlist(targetId, productData);

    const aliases = new Set();
    [
      productId,
      productData?.id,
      productData?.sku,
      productData?._id,
      productData?.productId,
      orig.sku,
      orig.productId,
      orig._id,
      orig.id,
    ]
      .filter(Boolean)
      .forEach((x) => {
        aliases.add(String(x));
      });

    const aliasList = Array.from(aliases);
    setProducts((prev) =>
      prev.filter((p) => {
        const pOrig = p.originalData || p;
        const pAliases = [
          p.id,
          p.sku,
          p._id,
          p.productId,
          pOrig.sku,
          pOrig.productId,
          pOrig._id,
          pOrig.id,
        ]
          .filter(Boolean)
          .map(String);
        return !pAliases.some((a) => aliasList.includes(a));
      })
    );

    timerRef.current = setTimeout(() => {
      setPendingRemoval(null);
      timerRef.current = null;
    }, 5000);
  }, []);

  const undoRemove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (pendingRemoval) {
      toggleWishlist(pendingRemoval.id);
      setProducts((prev) => [pendingRemoval, ...prev]);
      setPendingRemoval(null);
    }
  }, [pendingRemoval, toggleWishlist]);

  const getProductsByType = useCallback((type) => {
    if (type === "rent") return products.filter((p) => p.type === "rent");
    if (type === "preloved") return products.filter((p) => p.type === "preloved");
    if (type === "new") return products.filter((p) => p.type === "new");
    return products;
  }, [products]);

  return {
    products,
    loading,
    setProducts,
    removeProduct,
    undoRemove,
    getProductsByType,
    pendingRemoval,
  };
};