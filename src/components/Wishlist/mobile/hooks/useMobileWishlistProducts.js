import { useState, useCallback, useRef, useEffect } from "react";
import useWishlistStore from "../../../../store/wishlistStore";

export const useMobileWishlistProducts = () => {
  const { items: wishlistIds, toggleWishlist } = useWishlistStore();
  const [allWebProducts, setAllWebProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/web-products");
        const data = await response.json();
        if (data.success) {
          setAllWebProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching web products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const wishedProducts = allWebProducts.filter((p) =>
      wishlistIds.includes(p._id || p.id),
    );

    const formatted = wishedProducts.map((item) => {
      const priceStr = item.buyPrice || item.rentPrice || "0";
      const origPriceStr = item.originalPrice || "0";
      let savePerc = null;

      if (item.originalPrice) {
        const orig = parseInt(origPriceStr.toString().replace(/,/g, ""));
        const curr = parseInt(priceStr.toString().replace(/,/g, ""));
        if (orig > curr && orig > 0) {
          savePerc = Math.round(((orig - curr) / orig) * 100) + "%";
        }
      }

      return {
        id: item._id || item.id,
        designer: (item.designer || "").toUpperCase(),
        name: item.name,
        price: priceStr,
        originalPrice: item.originalPrice,
        savePercentage: savePerc,
        duration: item.rent ? "for 4 days" : null,
        savedDate: "Recently",
        condition: item.preloved ? "Preloved" : item.isNew ? "New" : "Rental",
        unavailable: false,
        unavailableNote: null,
        stripTag: item.isNew ? "NEW ARRIVAL" : null,
        sizes: item.size,
        image: item.image,
        images: item.images,
        isAvailable: true,
        originalData: item,
      };
    });

    setAllProducts(formatted);
  }, [wishlistIds, allWebProducts]);

  const removeProduct = useCallback(
    (productId, productData, onShowToast) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setPendingRemoval(null);
      }

      setPendingRemoval(productData);
      onShowToast?.("Removed from your wishlist", true);

      setTimeout(() => {
        toggleWishlist(productId);

        timerRef.current = setTimeout(() => {
          setPendingRemoval(null);
          timerRef.current = null;
        }, 5000);
      }, 600);
    },
    [toggleWishlist],
  );

  const undoRemove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (pendingRemoval) {
      toggleWishlist(pendingRemoval.id);
      setPendingRemoval(null);
    }
  }, [pendingRemoval, toggleWishlist]);

  const getProductsByMode = useCallback(
    (mode) => {
      if (mode === "rent")
        return allProducts.filter((p) => p.originalData?.rent);
      if (mode === "preloved")
        return allProducts.filter((p) => p.originalData?.preloved);
      if (mode === "new")
        return allProducts.filter((p) => p.originalData?.isNew);
      return allProducts;
    },
    [allProducts],
  );

  const getCounts = useCallback(() => {
    const rent = allProducts.filter((p) => p.originalData?.rent).length;
    const preloved = allProducts.filter((p) => p.originalData?.preloved).length;
    const newCount = allProducts.filter((p) => p.originalData?.isNew).length;
    const total = allProducts.length; // Actually total unique pieces
    const uniqueDesigners = new Set(allProducts.map((p) => p.designer)).size;

    return {
      total,
      rent,
      preloved,
      new: newCount,
      uniqueDesigners,
      toRent: rent,
    };
  }, [allProducts]);

  return {
    allProducts,
    removeProduct,
    undoRemove,
    getProductsByMode,
    getCounts,
    pendingRemoval,
  };
};
