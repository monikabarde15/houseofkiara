import { useState, useEffect, useRef } from "react";
import WishlistHeader from "./WishlistHeader";
import WishlistToolbar from "./WishlistToolbar";
import RentWishlistSection from "../sections/RentWishlistSection";
import PrelovedWishlistSection from "../sections/PrelovedWishlistSection";
import NewWishlistSection from "../sections/NewWishlistSection";
import WishlistRecommendations from "../sections/WishlistRecommendations";
import AddToBagModal from "../modal/AddToBagModal";
import { useWishlistProducts } from "../hooks/useWishlistProducts";
import "../../../styles/wishlist/layout/wishlist-layout.css";

const WishlistLayout = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showGeneralToast, setShowGeneralToast] = useState(false);
  const [generalToastMessage, setGeneralToastMessage] = useState("");
  const [toastWithUndo, setToastWithUndo] = useState(false);
  
  // Add to Bag Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);
  
  // Use the wishlist products hook
  const { getProductsByType, removeProduct, undoRemove, pendingRemoval } = useWishlistProducts();

  const toastTimeoutRef = useRef(null);

  // Get counts from actual products
  const allProducts = getProductsByType();
  const rentProducts = getProductsByType("rent");
  const prelovedProducts = getProductsByType("preloved");
  const newProducts = getProductsByType("new");
  
  const totalPieces = allProducts.length;
  const rentCount = rentProducts.length;
  const prelovedCount = prelovedProducts.length;
  const newCount = newProducts.length;
  
  // Get unique designers count
  const uniqueDesigners = new Set(allProducts.map(p => p.designer)).size;
  const toRentCount = rentCount;

  // Open Add to Bag Modal
  const handleOpenModal = (product, type) => {
    setSelectedProduct(product);
    setSelectedProductType(type);
    setIsModalOpen(true);
  };

  // Close Add to Bag Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedProductType(null);
  };

  const showGeneralToastMessage = (message, withUndo = false) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setGeneralToastMessage(message);
    setToastWithUndo(withUndo);
    setShowGeneralToast(true);
    const duration = withUndo ? 4000 : 3000;
    toastTimeoutRef.current = setTimeout(() => {
      setShowGeneralToast(false);
      setToastWithUndo(false);
      toastTimeoutRef.current = null;
    }, duration);
  };

  const handleRemoveCard = (productId, productData) => {
    removeProduct(productId, productData, showGeneralToastMessage);
  };

  const handleUndo = () => {
    undoRemove();
    setShowGeneralToast(false);
    setToastWithUndo(false);
  };

  const tabCounts = {
    all: totalPieces,
    rent: rentCount,
    preloved: prelovedCount,
    new: newCount
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const showRentSection = activeTab === 'all' || activeTab === 'rent';
  const showPrelovedSection = activeTab === 'all' || activeTab === 'preloved';
  const showNewSection = activeTab === 'all' || activeTab === 'new';

  return (
    <div className="desk-wishlist-layout">
      <div className="desk-wishlist-container">
        <WishlistHeader 
          piecesSaved={totalPieces}
          designers={uniqueDesigners}
          toRent={toRentCount}
        />

        <WishlistToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabCounts={tabCounts}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onShareClick={() => showGeneralToastMessage('Share wishlist')}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showGeneralToastMessage={showGeneralToastMessage}
        />

        {showRentSection && (
          <RentWishlistSection 
            viewMode={viewMode} 
            showGeneralToastMessage={showGeneralToastMessage}
            onRemoveCard={handleRemoveCard}
            onOpenModal={handleOpenModal}
            pieceCount={rentCount}
            products={rentProducts}
          />
        )}

        {showPrelovedSection && (
          <PrelovedWishlistSection 
            viewMode={viewMode}
            onRemoveCard={handleRemoveCard}
            onOpenModal={handleOpenModal}
            pieceCount={prelovedCount}
            products={prelovedProducts}
          />
        )}

        {showNewSection && (
          <NewWishlistSection 
            viewMode={viewMode}
            onRemoveCard={handleRemoveCard}
            onOpenModal={handleOpenModal}
            pieceCount={newCount}
            products={newProducts}
          />
        )}
      </div>
      
      <WishlistRecommendations onShowToast={showGeneralToastMessage} />

      <AddToBagModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        type={selectedProductType}
        onShowToast={showGeneralToastMessage}
      />

      {showGeneralToast && (
        <div className={`desk-wishlist-toast ${toastWithUndo ? 'with-undo' : ''}`}>
          <span>{generalToastMessage}</span>
          {toastWithUndo && (
            <button className="desk-wishlist-toast-undo" onClick={handleUndo}>UNDO</button>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistLayout;