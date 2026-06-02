import { useState, useCallback, useRef } from "react";
import { wishlistItems } from "../../data/wishlistData";

export const useMobileWishlistProducts = () => {
  const [allProducts, setAllProducts] = useState(() => {
    return [
      ...wishlistItems.rent.map(item => ({ ...item, mode: "rent" })),
      ...wishlistItems.preloved.map(item => ({ ...item, mode: "preloved" })),
      ...wishlistItems.new.map(item => ({ ...item, mode: "new" }))
    ];
  });

  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  const removeProduct = useCallback((productId, productData, onShowToast) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setPendingRemoval(null);
    }

    setPendingRemoval(productData);
    
    onShowToast?.('Removed from your wishlist', true);

    setAllProducts(prev => prev.filter(p => p.id !== productId));
    
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
      const originalProducts = [
        ...wishlistItems.rent.map(item => ({ ...item, mode: "rent" })),
        ...wishlistItems.preloved.map(item => ({ ...item, mode: "preloved" })),
        ...wishlistItems.new.map(item => ({ ...item, mode: "new" }))
      ];
      const originalIndex = originalProducts.findIndex(p => p.id === pendingRemoval.id);
      
      setAllProducts(prev => {
        const newProducts = [...prev];
        if (originalIndex >= 0 && originalIndex <= newProducts.length) {
          newProducts.splice(originalIndex, 0, pendingRemoval);
        } else {
          newProducts.push(pendingRemoval);
        }
        return newProducts;
      });
      setPendingRemoval(null);
    }
  }, [pendingRemoval]);

  const getProductsByMode = useCallback((mode) => {
    if (mode === "rent") return allProducts.filter(p => p.mode === "rent");
    if (mode === "preloved") return allProducts.filter(p => p.mode === "preloved");
    if (mode === "new") return allProducts.filter(p => p.mode === "new");
    return allProducts;
  }, [allProducts]);

  const getCounts = useCallback(() => {
    const rent = allProducts.filter(p => p.mode === "rent").length;
    const preloved = allProducts.filter(p => p.mode === "preloved").length;
    const newCount = allProducts.filter(p => p.mode === "new").length;
    const total = allProducts.length;
    const uniqueDesigners = new Set(allProducts.map(p => p.designer)).size;
    
    return { total, rent, preloved, new: newCount, uniqueDesigners, toRent: rent };
  }, [allProducts]);

  return {
    allProducts,
    removeProduct,
    undoRemove,
    getProductsByMode,
    getCounts,
    pendingRemoval
  };
};