import { useState, useCallback, useRef, useEffect } from "react";
import useWishlistStore from "../../../store/wishlistStore";

export const useWishlistProducts = () => {
  const { items: wishlistIds, toggleWishlist } = useWishlistStore();
  const [allWebProducts, setAllWebProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const timerRef = useRef(null);

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/web-products');
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

  // Update displayed products when wishlistIds or allWebProducts changes
  useEffect(() => {
    const wishedProducts = allWebProducts.filter(p => wishlistIds.includes(p._id || p.id));
    
    const formatted = wishedProducts.map(item => {
      const priceStr = item.buyPrice || item.rentPrice || '0';
      const origPriceStr = item.originalPrice || '0';
      let savePerc = null;
      
      if (item.originalPrice) {
        const orig = parseInt(origPriceStr.toString().replace(/,/g, ""));
        const curr = parseInt(priceStr.toString().replace(/,/g, ""));
        if (orig > curr && orig > 0) {
          savePerc = Math.round(((orig - curr) / orig) * 100) + '%';
        }
      }

      return {
        id: item._id || item.id,
        type: item.type,
        designer: (item.designer || '').toUpperCase(),
        name: item.name,
        price: priceStr,
        originalPrice: item.originalPrice,
        savePercentage: savePerc,
        duration: item.rent ? "for 4 days" : null,
        savedDate: "Recently",
        condition: item.preloved ? "Preloved" : (item.isNew ? "New" : "Rental"),
        unavailable: false,
        unavailableNote: null,
        stripTag: item.isNew ? "NEW ARRIVAL" : null,
        sizes: item.size,
        image: Array.isArray(item.image) ? item.image[0] : (item.images?.[0] || item.image),
        originalData: item
      };
    });
    
    setProducts(formatted);
  }, [wishlistIds, allWebProducts]);

  const removeProduct = useCallback((productId, productData, onShowToast) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setPendingRemoval(null);
    }

    setPendingRemoval(productData);
    onShowToast?.('Removed from your wishlist', true);

    setTimeout(() => {
      toggleWishlist(productId);
      
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
      setPendingRemoval(null);
    }
  }, [pendingRemoval, toggleWishlist]);

  const getProductsByType = useCallback((type) => {
    if (!type) return products;
    if (type === "rent") return products.filter(p => p.originalData?.rent);
    if (type === "preloved") return products.filter(p => p.originalData?.preloved);
    if (type === "new") return products.filter(p => p.originalData?.isNew);
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