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
import { wishlistItems, wishlistStats } from '../../data/wishlistData';
import '../../../../styles/wishlist/mobile/layout/mobile-wishlist-layout.css';
import MobileRecommendations from '../sections/MobileRecommendations';

const MobileWishlistLayout = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [toastMessage, setToastMessage] = useState(null);
  const [toastWithUndo, setToastWithUndo] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [removedCardRef, setRemovedCardRef] = useState(null);
  const [removedCardParent, setRemovedCardParent] = useState(null);
  const [removedCardNextSibling, setRemovedCardNextSibling] = useState(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  
  // Section 9: Add to Bag sheet state
  const [isAddToBagSheetOpen, setIsAddToBagSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  
  // Section 10: Share sheet state
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  
  const toastTimeoutRef = useRef(null);

  // Get counts based on active tab
  const getRentCardsCount = () => document.querySelectorAll('.wishlist-mobile-rent-section .wishlist-mobile-card').length;
  const getPrelovedCardsCount = () => document.querySelectorAll('.wishlist-mobile-preloved-section .wishlist-mobile-card').length;
  const getNewCardsCount = () => document.querySelectorAll('.wishlist-mobile-new-section .wishlist-mobile-card').length;
  const getAllCardsCount = () => document.querySelectorAll('.wishlist-mobile-card').length;

  const getActiveSectionCardsCount = () => {
    switch (activeTab) {
      case 'rent':
        return getRentCardsCount();
      case 'preloved':
        return getPrelovedCardsCount();
      case 'new':
        return getNewCardsCount();
      default:
        return getAllCardsCount();
    }
  };

  // Update empty state visibility
  const updateEmptyState = () => {
    const count = getActiveSectionCardsCount();
    setShowEmptyState(count === 0);
  };

  // Check empty state on tab change and initial load
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      updateEmptyState();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

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
  const removeCard = (item, cardElement) => {
    const parent = cardElement.parentElement;
    const nextSibling = cardElement.nextSibling;
    setRemovedCardRef(cardElement);
    setRemovedCardParent(parent);
    setRemovedCardNextSibling(nextSibling);
    
    setTimeout(() => {
      if (cardElement && cardElement.remove) {
        cardElement.remove();
      }
      
      updateAllCounts();
      showToast('Removed from your wishlist', true, item);
      
      // Update empty state after removal
      updateEmptyState();
    }, 180);
  };

  // Section 7.3: Undo action
  const handleUndo = () => {
    if (removedCardRef && removedCardParent) {
      if (removedCardNextSibling) {
        removedCardParent.insertBefore(removedCardRef, removedCardNextSibling);
      } else {
        removedCardParent.appendChild(removedCardRef);
      }
      
      updateAllCounts();
      
      setRemovedCardRef(null);
      setRemovedCardParent(null);
      setRemovedCardNextSibling(null);
      setPendingRemoval(null);
      
      // Update empty state after undo
      updateEmptyState();
    }
    
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
    setToastMessage(null);
    setToastWithUndo(false);
  };

  // Section 17: Live count update logic
  const updateAllCounts = () => {
    const allCards = document.querySelectorAll('.wishlist-mobile-card');
    const rentCards = document.querySelectorAll('.wishlist-mobile-card[data-mode="rent"]');
    const prelovedCards = document.querySelectorAll('.wishlist-mobile-card[data-mode="preloved"]');
    const newCards = document.querySelectorAll('.wishlist-mobile-card[data-mode="new"]');
    
    const totalCount = allCards.length;
    const rentCount = rentCards.length;
    const prelovedCount = prelovedCards.length;
    const newCount = newCards.length;
    
    const designers = new Set();
    allCards.forEach(card => {
      const designer = card.getAttribute('data-designer');
      if (designer) designers.add(designer);
    });
    const uniqueDesigners = designers.size;
    
    const savedNumber = document.querySelector('.wishlist-mobile-stats-row__stat:first-child .wishlist-mobile-stats-row__number');
    const designersNumber = document.querySelector('.wishlist-mobile-stats-row__stat:nth-child(3) .wishlist-mobile-stats-row__number');
    const toRentNumber = document.querySelector('.wishlist-mobile-stats-row__stat:last-child .wishlist-mobile-stats-row__number');
    
    if (savedNumber) savedNumber.textContent = totalCount;
    if (designersNumber) designersNumber.textContent = uniqueDesigners;
    if (toRentNumber) toRentNumber.textContent = rentCount;
    
    const allBadge = document.querySelector('.wishlist-mobile-tab-strip__tab:first-child .wishlist-mobile-tab-strip__badge');
    const rentBadge = document.querySelector('.wishlist-mobile-tab-strip__tab:nth-child(2) .wishlist-mobile-tab-strip__badge');
    const prelovedBadge = document.querySelector('.wishlist-mobile-tab-strip__tab:nth-child(3) .wishlist-mobile-tab-strip__badge');
    const newBadge = document.querySelector('.wishlist-mobile-tab-strip__tab:last-child .wishlist-mobile-tab-strip__badge');
    
    if (allBadge) allBadge.textContent = totalCount;
    if (rentBadge) rentBadge.textContent = rentCount;
    if (prelovedBadge) prelovedBadge.textContent = prelovedCount;
    if (newBadge) newBadge.textContent = newCount;
    
    const rentSectionCount = document.querySelector('.wishlist-mobile-rent-section .wishlist-mobile-section-header__count');
    const prelovedSectionCount = document.querySelector('.wishlist-mobile-preloved-section .wishlist-mobile-section-header__count');
    const newSectionCount = document.querySelector('.wishlist-mobile-new-section .wishlist-mobile-section-header__count');
    
    if (rentSectionCount) rentSectionCount.textContent = rentCount === 1 ? '1 piece' : `${rentCount} pieces`;
    if (prelovedSectionCount) prelovedSectionCount.textContent = prelovedCount === 1 ? '1 piece' : `${prelovedCount} pieces`;
    if (newSectionCount) newSectionCount.textContent = newCount === 1 ? '1 piece' : `${newCount} pieces`;
    
    const headerBadge = document.querySelector('.wishlist-mobile-header__badge');
    if (headerBadge) headerBadge.textContent = totalCount;
  };
  
  const showToast = (message, withUndo = false, removalData = null) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setToastMessage(message);
    setToastWithUndo(withUndo);
    setPendingRemoval(removalData);
    
    const duration = withUndo ? 4000 : 3000;
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setToastWithUndo(false);
      setPendingRemoval(null);
      toastTimeoutRef.current = null;
    }, duration);
  };

  const totalCount = wishlistStats.totalPieces;
  const rentCount = wishlistItems.rent.length;
  const prelovedCount = wishlistItems.preloved.length;
  const newCount = wishlistItems.new.length;
  const uniqueDesigners = wishlistStats.totalDesigners;
  const toRentCount = wishlistStats.toRent;

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
            onRemoveCard={removeCard}
            onOpenAddToBagSheet={handleOpenAddToBagSheet}
          />
        )}
        
        {showPrelovedSection && (
          <MobilePrelovedSection 
            viewMode="list" 
            showToast={showToast}
            onRemoveCard={removeCard}
            onOpenAddToBagSheet={handleOpenAddToBagSheet}
          />
        )}
        
        {showNewSection && (
          <MobileNewSection 
            viewMode="list" 
            showToast={showToast}
            onRemoveCard={removeCard}
            onOpenAddToBagSheet={handleOpenAddToBagSheet}
          />
        )}
        
        {/* Section 11: Empty State - Always render, visibility controlled by isVisible prop */}
        <MobileEmptyState 
          isVisible={showEmptyState}
          onBrowseClick={() => showToast('Opening collection...')}
        />
      </div>
      
      {/* Section 9: Add to Bag Bottom Sheet */}
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
      
      {/* Section 10: Share Wishlist Bottom Sheet */}
      <MobileShareSheet 
        isOpen={isShareSheetOpen}
        onClose={handleCloseShareSheet}
        showToast={showToast}
      />

      {/* Section 12: Recommendations */}
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
            setPendingRemoval(null);
          }}
        />
      )}
    </div>
  );
};

export default MobileWishlistLayout;