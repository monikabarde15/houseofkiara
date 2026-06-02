import { useState, useRef, useEffect } from 'react';
import MobilePageTitle from '../ui/MobilePageTitle';
import MobileWishlistToolbar from '../toolbar/MobileWishlistToolbar';
import MobileRentSection from '../sections/MobileRentSection';
import MobilePrelovedSection from '../sections/MobilePrelovedSection';
import MobileNewSection from '../sections/MobileNewSection';
import MobileToast from '../common/MobileToast';
import MobileBottomSheet from '../sheets/MobileBottomSheet';
import MobileAddToBagSheet from '../sheets/MobileAddToBagSheet';
import MobileShareSheet from '../sheets/MobileShareSheet';
import MobileEmptyState from '../common/MobileEmptyState';
import MobileRecommendations from '../sections/MobileRecommendations';
import { useMobileWishlistProducts } from '../hooks/useMobileWishlistProducts';
import '../../../../styles/wishlist/mobile/layout/mobile-wishlist-layout.css';

const MobileWishlistLayout = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [toastMessage, setToastMessage] = useState(null);
  const [toastWithUndo, setToastWithUndo] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  
  // Section 9: Add to Bag sheet state
  const [isAddToBagSheetOpen, setIsAddToBagSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  
  // Section 10: Share sheet state
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  
  const toastTimeoutRef = useRef(null);
  
  // Use the mobile products hook
  const { removeProduct, undoRemove, getProductsByMode, getCounts, pendingRemoval } = useMobileWishlistProducts();
  
  // Get current counts
  const counts = getCounts();
  const totalCount = counts.total;
  const rentCount = counts.rent;
  const prelovedCount = counts.preloved;
  const newCount = counts.new;
  const uniqueDesigners = counts.uniqueDesigners;
  const toRentCount = counts.toRent;

  // Get products for each section
  const rentProducts = getProductsByMode("rent");
  const prelovedProducts = getProductsByMode("preloved");
  const newProducts = getProductsByMode("new");

  const getActiveSectionCardsCount = () => {
    switch (activeTab) {
      case 'rent':
        return rentProducts.length;
      case 'preloved':
        return prelovedProducts.length;
      case 'new':
        return newProducts.length;
      default:
        return totalCount;
    }
  };

  // Update empty state visibility
  const updateEmptyState = () => {
    const count = getActiveSectionCardsCount();
    setShowEmptyState(count === 0);
  };

  useEffect(() => {
    updateEmptyState();
  }, [activeTab, rentProducts.length, prelovedProducts.length, newProducts.length, totalCount]);

  // Section 9: Open Add to Bag sheet
  const handleOpenAddToBagSheet = (item, mode) => {
    setSelectedItem(item);
    setSelectedMode(mode);
    setIsAddToBagSheetOpen(true);
  };

  // Section 9: Close Add to Bag sheet
  const handleCloseAddToBagSheet = () => {
    setIsAddToBagSheetOpen(false);
    setSelectedItem(null);
    setSelectedMode(null);
  };

  // Section 10: Open Share sheet
  const handleOpenShareSheet = () => {
    setIsShareSheetOpen(true);
  };

  // Section 10: Close Share sheet
  const handleCloseShareSheet = () => {
    setIsShareSheetOpen(false);
  };

  // Section 7.1: Remove sequence
  const handleRemoveCard = (item, cardElement) => {
    removeProduct(item.id, item, showToast);
    
    setTimeout(() => {
      if (cardElement && cardElement.remove) {
        cardElement.remove();
      }
      updateEmptyState();
    }, 180);
  };

  // Section 7.3: Undo action
  const handleUndo = () => {
    undoRemove();
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(null);
    setToastWithUndo(false);
    updateEmptyState();
  };

  const showToast = (message, withUndo = false, removalData = null) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setToastMessage(message);
    setToastWithUndo(withUndo);
    
    const duration = withUndo ? 4000 : 3000;
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setToastWithUndo(false);
      toastTimeoutRef.current = null;
    }, duration);
  };

  const tabCounts = {
    all: totalCount,
    rent: rentCount,
    preloved: prelovedCount,
    new: newCount
  };

  const showRentSection = (activeTab === 'all' || activeTab === 'rent') && !showEmptyState;
  const showPrelovedSection = (activeTab === 'all' || activeTab === 'preloved') && !showEmptyState;
  const showNewSection = (activeTab === 'all' || activeTab === 'new') && !showEmptyState;

  return (
    <div className="wishlist-mobile">
      <div className="wishlist-mobile__content">
        <MobilePageTitle
          savedCount={totalCount}
          designersCount={uniqueDesigners}
          toRentCount={toRentCount}
        />
        <MobileWishlistToolbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          tabCounts={tabCounts}
          onSortChange={setSortBy}
          onShare={handleOpenShareSheet}
        />
        
        {showRentSection && (
          <MobileRentSection 
            viewMode="list" 
            showToast={showToast} 
            activeTab={activeTab}
            products={rentProducts}
            onRemoveCard={handleRemoveCard}
            onOpenAddToBagSheet={handleOpenAddToBagSheet}
          />
        )}
        
        {showPrelovedSection && (
          <MobilePrelovedSection 
            viewMode="list" 
            showToast={showToast}
            products={prelovedProducts}
            onRemoveCard={handleRemoveCard}
            onOpenAddToBagSheet={handleOpenAddToBagSheet}
          />
        )}
        
        {showNewSection && (
          <MobileNewSection 
            viewMode="list" 
            showToast={showToast}
            products={newProducts}
            onRemoveCard={handleRemoveCard}
            onOpenAddToBagSheet={handleOpenAddToBagSheet}
          />
        )}
        
        <MobileEmptyState 
          isVisible={showEmptyState}
          onBrowseClick={() => showToast('Opening collection...')}
        />
      </div>
      
      <MobileBottomSheet 
        isOpen={isAddToBagSheetOpen}
        onClose={handleCloseAddToBagSheet}
        mode={selectedMode}
      >
        <MobileAddToBagSheet 
          item={selectedItem}
          mode={selectedMode}
          showToast={showToast}
          onClose={handleCloseAddToBagSheet}
        />
      </MobileBottomSheet>
      
      <MobileShareSheet 
        isOpen={isShareSheetOpen}
        onClose={handleCloseShareSheet}
        showToast={showToast}
      />

      <MobileRecommendations showToast={showToast} />
      
      {toastMessage && (
        <MobileToast 
          message={toastMessage} 
          withUndo={toastWithUndo} 
          onUndo={handleUndo}
          onClose={() => {
            if (toastTimeoutRef.current) {
              clearTimeout(toastTimeoutRef.current);
              toastTimeoutRef.current = null;
            }
            setToastMessage(null);
            setToastWithUndo(false);
          }}
        />
      )}
    </div>
  );
};

export default MobileWishlistLayout;