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
  const isRental = p.listingModes ? p.listingModes.includes("RENTAL") : p.type === "rent" || p.type === "rental";
  const isPreloved = p.listingModes ? p.listingModes.includes("PRELOVED") : p.type === "preloved";
  const type = isRental ? "rent" : isPreloved ? "preloved" : "new";

  const rentPrice = cleanNum(p.rentalPrice || (p.perDayRate ? p.perDayRate * 4 : 0) || p.price);
  const listingPrice = cleanNum(p.listingPrice || p.price || 0);
  const originalPrice = cleanNum(p.originalRetailPrice || p.oldPrice || (type === "rent" ? rentPrice * 10 : listingPrice * 1.5));
  const currentPrice = type === "rent" ? rentPrice : listingPrice;

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
        if (auth.isAuthenticated && auth.token) {
          // Fetch authenticated customer's populated wishlist products
          const res = await fetch("/api/customer/auth/wishlist/products", {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && isMounted) {
            setProducts(data.data.map(transformProduct));
            setLoading(false);
            return;
          }
        }

        // Fallback / guest mode: load catalogue products and filter by wishlistIds
        const pRes = await fetch("/api/products");
        const pData = await pRes.json();
        if (pData.success && Array.isArray(pData.data) && isMounted) {
          const matching = pData.data.filter((p) => {
            const pid = String(p._id || p.productId || p.id);
            return wishlistIds.some((wid) => String(wid) === pid);
          });
          setProducts(matching.map(transformProduct));
        } else if (isMounted) {
          setProducts([]);
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

    // Call store toggle to sync with backend DB
    toggleWishlist(productId);

    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));
      timerRef.current = setTimeout(() => {
        setPendingRemoval(null);
        timerRef.current = null;
      }, 5000);
    }, 600);
  }, [toggleWishlist]);

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