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
      wishlistIds.some(
        (id) =>
          String(id) === String(p._id) ||
          String(id) === String(p.id) ||
          String(id) === String(p.productId)
      )
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
      if (!mode || mode === "all") return allProducts;
      if (mode === "rent")
        return allProducts.filter(
          (p) =>
            p.type === "rent" ||
            Boolean(p.originalData?.rent) ||
            p.condition === "Rental" ||
            (!p.originalData?.preloved && !p.originalData?.isNew && p.type !== "preloved" && p.type !== "new")
        );
      if (mode === "preloved")
        return allProducts.filter(
          (p) =>
            p.type === "preloved" ||
            Boolean(p.originalData?.preloved) ||
            p.condition === "Preloved"
        );
      if (mode === "new")
        return allProducts.filter(
          (p) =>
            p.type === "new" ||
            Boolean(p.originalData?.isNew) ||
            p.condition === "New"
        );
      return allProducts;
    },
    [allProducts],
  );

  const getCounts = useCallback(() => {
    const rent = allProducts.filter(
      (p) =>
        p.type === "rent" ||
        Boolean(p.originalData?.rent) ||
        p.condition === "Rental" ||
        (!p.originalData?.preloved && !p.originalData?.isNew && p.type !== "preloved" && p.type !== "new")
    ).length;
    const preloved = allProducts.filter(
      (p) =>
        p.type === "preloved" ||
        Boolean(p.originalData?.preloved) ||
        p.condition === "Preloved"
    ).length;
    const newCount = allProducts.filter(
      (p) =>
        p.type === "new" ||
        Boolean(p.originalData?.isNew) ||
        p.condition === "New"
    ).length;
    const total = allProducts.length;
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
