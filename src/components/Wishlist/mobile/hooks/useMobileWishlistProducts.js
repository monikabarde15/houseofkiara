import { useState, useCallback, useRef, useEffect } from "react";
import useWishlistStore from "../../../../store/wishlistStore";
import useAuthStore from "../../../../store/authStore";

const cleanNum = (val) => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = Number(String(val).replace(/[^\d]/g, ""));
  return isNaN(num) ? 0 : num;
};

const formatPrice = (price) => {
  if (typeof price === "number") return price.toLocaleString("en-IN");
  if (!price) return "0";
  const num = Number(String(price).replace(/[^\d]/g, ""));
  return isNaN(num) ? price : num.toLocaleString("en-IN");
};

// Transform database product to mobile wishlist card format
const transformMobileProduct = (p) => {
  const isRental = p.listingModes ? p.listingModes.includes("RENTAL") : p.type === "rent" || p.type === "rental" || p.mode === "rent";
  const isPreloved = p.listingModes ? p.listingModes.includes("PRELOVED") : p.type === "preloved" || p.mode === "preloved";
  const mode = isRental ? "rent" : isPreloved ? "preloved" : "new";

  const rentPrice = cleanNum(p.rentalPrice || (p.perDayRate ? p.perDayRate * 4 : 0) || p.price);
  const listingPrice = cleanNum(p.listingPrice || p.price || 0);
  const originalPrice = cleanNum(p.originalRetailPrice || p.oldPrice || (mode === "rent" ? rentPrice * 10 : listingPrice * 1.5));
  const currentPrice = mode === "rent" ? rentPrice : listingPrice;

  const savePercentage =
    originalPrice > currentPrice && originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : null;

  const resolvedImage =
    (Array.isArray(p.images) && p.images[0]) ||
    (Array.isArray(p.image) && p.image[0]) ||
    (typeof p.image === "string" && p.image) ||
    "";

  return {
    id: String(p._id || p.productId || p.id),
    mode,
    type: mode,
    designer: (p.designer || "").toUpperCase(),
    name: p.name || p.title || "Designer Piece",
    price: currentPrice,
    formattedPrice: formatPrice(currentPrice),
    originalPrice: originalPrice,
    formattedOriginalPrice: formatPrice(originalPrice),
    savePercentage: savePercentage,
    rentalDuration: p.rentalDuration || "4 days",
    condition: p.condition || (mode === "preloved" ? "Excellent condition" : null),
    isAvailable: p.availability !== "Unavailable" && p.isAvailable !== false,
    tag: p.tag || null,
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ["Free Size"],
    image: resolvedImage,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (resolvedImage ? [resolvedImage] : []),
    originalData: p,
  };
};

export const useMobileWishlistProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  const wishlistIds = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const auth = useAuthStore.getState();

      try {
        if (auth.isAuthenticated && auth.token) {
          const res = await fetch("/api/customer/auth/wishlist/products", {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && isMounted) {
            setAllProducts(data.data.map(transformMobileProduct));
            setLoading(false);
            return;
          }
        }

        const pRes = await fetch("/api/products");
        const pData = await pRes.json();
        if (pData.success && Array.isArray(pData.data) && isMounted) {
          const matching = pData.data.filter((p) => {
            const pid = String(p._id || p.productId || p.id);
            return wishlistIds.some((wid) => String(wid) === pid);
          });
          setAllProducts(matching.map(transformMobileProduct));
        } else if (isMounted) {
          setAllProducts([]);
        }
      } catch (err) {
        console.error("Error loading mobile wishlist products:", err);
        if (isMounted) setAllProducts([]);
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

    toggleWishlist(productId);

    setAllProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));
    
    timerRef.current = setTimeout(() => {
      setPendingRemoval(null);
      timerRef.current = null;
    }, 5000);
  }, [toggleWishlist]);

  const undoRemove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (pendingRemoval) {
      toggleWishlist(pendingRemoval.id);
      setAllProducts((prev) => [pendingRemoval, ...prev]);
      setPendingRemoval(null);
    }
  }, [pendingRemoval, toggleWishlist]);

  const getProductsByMode = useCallback((mode) => {
    if (mode === "rent") return allProducts.filter((p) => p.mode === "rent");
    if (mode === "preloved") return allProducts.filter((p) => p.mode === "preloved");
    if (mode === "new") return allProducts.filter((p) => p.mode === "new");
    return allProducts;
  }, [allProducts]);

  const getCounts = useCallback(() => {
    const rent = allProducts.filter((p) => p.mode === "rent").length;
    const preloved = allProducts.filter((p) => p.mode === "preloved").length;
    const newCount = allProducts.filter((p) => p.mode === "new").length;
    const total = allProducts.length;
    const uniqueDesigners = new Set(allProducts.map((p) => p.designer).filter(Boolean)).size;
    
    return { total, rent, preloved, new: newCount, uniqueDesigners, toRent: rent };
  }, [allProducts]);

  return {
    allProducts,
    loading,
    removeProduct,
    undoRemove,
    getProductsByMode,
    getCounts,
    pendingRemoval,
  };
};