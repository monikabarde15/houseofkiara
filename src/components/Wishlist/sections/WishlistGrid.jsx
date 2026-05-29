// src/components/Wishlist/sections/WishlistGrid.jsx

import { useState, useRef, useCallback } from "react";
import UndoToast from "../toast/UndoToast";
import WishlistToast from "../toast/WishlistToast";
import "../../../styles/wishlist/sections/wishlist-grid.css";
import WishlistGridCard from "../cards/WishlistGridCard";
import WishlistListCard from "../cards/WishlistListCard";
import EmptyWishlistState from "./EmptyWishlistState";
import AddToBagModal from "../modal/AddToBagModal";

// Move allProducts OUTSIDE the component to avoid closure issues
const ALL_PRODUCTS = [
  // RENT — 7 ITEMS
  { id: 1, type: "rent", designer: "SABYASACHI", name: "Crimson Zardozi Bridal Lehenga", price: "8,500", originalPrice: "1,85,000", savePercentage: "95%", duration: "for 4 days", savedDate: "2 days ago" },
  { id: 2, type: "rent", designer: "MANISH MALHOTRA", name: "Ivory Sequin Sharara Set", price: "5,200", originalPrice: "98,000", savePercentage: "94%", duration: "for 3 days", savedDate: "5 days ago" },
  { id: 3, type: "rent", designer: "TARUN TAHILIANI", name: "Rose Embroidered Anarkali Gown", price: "4,800", originalPrice: "82,000", savePercentage: "93%", duration: "4 Day Rental", unavailable: true, unavailableNote: "Unavailable for your selected dates", savedDate: "1 week ago" },
  { id: 4, type: "rent", designer: "ANITA DONGRE", name: "Sage & Gold Floral Lehenga", price: "6,400", originalPrice: "1,12,000", savePercentage: "94%", duration: "for 4 days", savedDate: "3 days ago" },
  { id: 5, type: "rent", designer: "RAHUL MISHRA", name: "Handwoven Silk Saree", price: "7,200", originalPrice: "1,46,000", savePercentage: "95%", duration: "for 5 days", savedDate: "Yesterday" },
  { id: 6, type: "rent", designer: "SUNEET VARMA", name: "Velvet Bandhini Jacket Set", price: "5,900", originalPrice: "96,000", savePercentage: "93%", duration: "for 3 days", savedDate: "4 days ago" },
  { id: 7, type: "rent", designer: "JJ VALAYA", name: "Embroidered Cape Set", price: "6,800", originalPrice: "1,28,000", savePercentage: "95%", duration: "for 4 days", savedDate: "Today" },

  // PRELOVED — 3 ITEMS
  { id: 8, type: "preloved", designer: "RITU KUMAR", name: "Pre-loved Banarasi Lehenga", condition: "Pristine condition", price: "32,000", originalPrice: "78,000", savePercentage: "59%", savedDate: "2 weeks ago" },
  { id: 9, type: "preloved", designer: "RAW MANGO", name: "Pre-loved Floral Anarkali", condition: "Excellent condition", price: "28,000", originalPrice: "62,000", stripTag: "Offer Pending", savePercentage: "55%", savedDate: "5 days ago" },
  { id: 10, type: "preloved", designer: "GLOBAL DESI", name: "Pre-loved Sharara Suit", condition: "Good condition", price: "25,000", originalPrice: "48,000", savePercentage: "48%", savedDate: "1 week ago" },

  // NEW — 1 ITEM
  { id: 11, type: "new", designer: "RAW MANGO", name: "New Arrival Lehenga", price: "1,20,000", stripTag: "New Arrival", savedDate: "Today" },
];

const WishlistGrid = ({ viewMode, type }) => {
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [showGeneralToast, setShowGeneralToast] = useState(false);
  const [generalToastMessage, setGeneralToastMessage] = useState("");
  const [pendingRemovalId, setPendingRemovalId] = useState(null);
  const [pendingRemovalData, setPendingRemovalData] = useState(null);
  const [restoredCardId, setRestoredCardId] = useState(null);
  const timerRef = useRef(null);
  const gridContainerRef = useRef(null);

  // Add state for modal
  const [modalProduct, setModalProduct] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle opening modal
  const handleOpenModal = (product, type) => {
    setModalProduct(product);
    setModalType(type);
    setIsModalOpen(true);
  };

  // Handle add to bag success
  const handleAddToBag = (cartItem) => {
    // Show general toast
    showGeneralToastMessage(`${cartItem.name} added to your bag`);
  };

  /* ====================================================== */
  /* SECTION 9.1 & 9.2: REMOVE CARD FUNCTION */
  /* ====================================================== */
  const handleCardRemove = useCallback((productId, productData) => {
    // Section 9.5: If there's an active undo window, first card is permanently discarded
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setPendingRemovalId(null);
      setPendingRemovalData(null);
    }

    setPendingRemovalId(productId);
    setPendingRemovalData(productData);
    setShowUndoToast(true);

    setTimeout(() => {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }, 600);

    timerRef.current = setTimeout(() => {
      setPendingRemovalId(null);
      setPendingRemovalData(null);
      setShowUndoToast(false);
      timerRef.current = null;
    }, 5000);
  }, []);

  /* ====================================================== */
  /* SECTION 9.4: UNDO BEHAVIOUR */
  /* ====================================================== */
  const handleUndo = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (pendingRemovalData) {
      const originalIndex = ALL_PRODUCTS.findIndex(p => p.id === pendingRemovalData.id);
      
      setProducts(prev => {
        const newProducts = [...prev];
        newProducts.splice(originalIndex, 0, pendingRemovalData);
        return newProducts;
      });
      
      setRestoredCardId(pendingRemovalData.id);
      
      setTimeout(() => {
        setRestoredCardId(null);
      }, 300);
    }

    setShowUndoToast(false);
    setPendingRemovalId(null);
    setPendingRemovalData(null);
  }, [pendingRemovalData]);

  /* ====================================================== */
  /* SECTION 9.6: GENERAL TOAST */
  /* ====================================================== */
  const showGeneralToastMessage = useCallback((message) => {
    setGeneralToastMessage(message);
    setShowGeneralToast(true);
    setTimeout(() => {
      setShowGeneralToast(false);
    }, 3000);
  }, []);

  /* ====================================================== */
  /* FILTER PRODUCTS */
  /* ====================================================== */
  const filteredProducts = products.filter((product) => product.type === type);

  // Show empty state when no cards
  if (filteredProducts.length === 0) {
    return <EmptyWishlistState />;
  }

  return (
    <>
      <div ref={gridContainerRef} className={`desk-wishlist-grid-${viewMode}`}>
        {filteredProducts.map((product, index) => {
          const isRestored = restoredCardId === product.id;
          
          if (viewMode === "grid") {
            return (
              <WishlistGridCard
                key={product.id}
                product={product}
                type={type}
                index={index}
                onRemove={handleCardRemove}
                onShowToast={() => setShowUndoToast(true)}
                 onShowGeneralToast={showGeneralToastMessage}
                onOpenModal={handleOpenModal}
                isRestored={isRestored}
              />
            );
          }
          return (
            <WishlistListCard
              key={product.id}
              product={product}
              type={type}
              index={index}
              onRemove={handleCardRemove}
              onShowToast={() => setShowUndoToast(true)}
              onShowGeneralToast={showGeneralToastMessage}
              onOpenModal={handleOpenModal}
              isRestored={isRestored}
            />
          );
        })}
      </div>

      {/* Add to Bag Modal */}
    <AddToBagModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      product={modalProduct}
      type={modalType}
      onAddToBag={handleAddToBag}
      onShowToast={showGeneralToastMessage}
    />
      
      {/* Section 9.3: Undo Toast */}
      {showUndoToast && (
        <UndoToast
          onUndo={handleUndo}
          onClose={() => setShowUndoToast(false)}
        />
      )}
      
      {/* Section 9.6: General Toast */}
      {showGeneralToast && (
        <WishlistToast
          message={generalToastMessage}
          onClose={() => setShowGeneralToast(false)}
        />
      )}
    </>
  );
};

export default WishlistGrid;