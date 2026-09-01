import { useState, useCallback, useRef } from "react";
import { wishlistItems } from "../data/wishlistData";

// Helper functions
const getRelativeDate = (dateString) => {
  if (!dateString) return "Recently";
  const savedDate = new Date(dateString);
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
  return price?.toLocaleString('en-IN') || price;
};

// Transform wishlistItems to card format
const transformProducts = () => {
  const allProducts = [];
  
  // Transform rent items
  wishlistItems.rent.forEach(item => {
    allProducts.push({
      id: item.id,
      type: item.mode,
      designer: item.designer.toUpperCase(),
      name: item.name,
      price: formatPrice(item.price),
      originalPrice: formatPrice(item.originalPrice),
      savePercentage: `${item.savePercentage}%`,
      duration: item.rentalDuration || "for 4 days",
      savedDate: getRelativeDate(item.dateSaved),
      condition: item.condition,
      unavailable: item.isAvailable === false,
      unavailableNote: item.isAvailable === false ? "Unavailable for your selected dates" : null,
      stripTag: item.tag,
      sizes: item.sizes,
      originalData: item
    });
  });
  
  // Transform preloved items
  wishlistItems.preloved.forEach(item => {
    allProducts.push({
      id: item.id,
      type: item.mode,
      designer: item.designer.toUpperCase(),
      name: item.name,
      price: formatPrice(item.price),
      originalPrice: formatPrice(item.originalPrice),
      savePercentage: `${item.savePercentage}%`,
      duration: null,
      savedDate: getRelativeDate(item.dateSaved),
      condition: item.condition,
      unavailable: item.isAvailable === false,
      unavailableNote: null,
      stripTag: null,
      sizes: item.sizes,
      originalData: item
    });
  });
  
  // Transform new items
  wishlistItems.new.forEach(item => {
    allProducts.push({
      id: item.id,
      type: item.mode,
      designer: item.designer.toUpperCase(),
      name: item.name,
      price: formatPrice(item.price),
      originalPrice: formatPrice(item.originalPrice),
      savePercentage: null,
      duration: null,
      savedDate: getRelativeDate(item.dateSaved),
      condition: null,
      unavailable: false,
      unavailableNote: null,
      stripTag: null,
      sizes: item.sizes,
      originalData: item
    });
  });
  
  return allProducts;
};

export const useWishlistProducts = () => {
  const [products, setProducts] = useState(transformProducts());
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  const removeProduct = useCallback((productId, productData, onShowToast) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setPendingRemoval(null);
    }

    setPendingRemoval(productData);
    
    // Show undo toast
    onShowToast?.('Removed from your wishlist', true);

    setTimeout(() => {
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      timerRef.current = setTimeout(() => {
        setPendingRemoval(null);
        timerRef.current = null;
      }, 5000);
    }, 600);
  }, []);

  const undoRemove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (pendingRemoval) {
      const originalIndex = transformProducts().findIndex(p => p.id === pendingRemoval.id);
      setProducts(prev => {
        const newProducts = [...prev];
        newProducts.splice(originalIndex, 0, pendingRemoval);
        return newProducts;
      });
      setPendingRemoval(null);
    }
  }, [pendingRemoval]);

  const getProductsByType = useCallback((type) => {
    if (type === "rent") return products.filter(p => p.type === "rent");
    if (type === "preloved") return products.filter(p => p.type === "preloved");
    if (type === "new") return products.filter(p => p.type === "new");
    return products;
  }, [products]);

  return {
    products,
    setProducts,
    removeProduct,
    undoRemove,
    getProductsByType,
    pendingRemoval
  };
};