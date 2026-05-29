// src/components/Wishlist/layout/WishlistLayout.jsx

import { useState } from "react";
import WishlistHeader from "./WishlistHeader";
import WishlistToolbar from "./WishlistToolbar";
import RentWishlistSection from "../sections/RentWishlistSection";
import PrelovedWishlistSection from "../sections/PrelovedWishlistSection";
import NewWishlistSection from "../sections/NewWishlistSection";
import "../../../styles/wishlist/layout/wishlist-layout.css";
import WishlistRecommendations from "../sections/WishlistRecommendations";

const WishlistLayout = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  // Add state for general toast
  const [showGeneralToast, setShowGeneralToast] = useState(false);
  const [generalToastMessage, setGeneralToastMessage] = useState("");

const showGeneralToastMessage = (message) => {
  setGeneralToastMessage(message);
  setShowGeneralToast(true);
  setTimeout(() => setShowGeneralToast(false), 3000);
};

  const tabCounts = {
    all: 11,
    rent: 7,
    preloved: 3,
    new: 1
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  const handleShareClick = () => {
    // TODO: Open Share Wishlist Modal (Section 12)
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
        <WishlistHeader />
        
        <WishlistToolbar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabCounts={tabCounts}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onShareClick={handleShareClick}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showGeneralToastMessage={showGeneralToastMessage}
        />
        
        {/* Rent Section - contains its own header + notice + cards */}
        {showRentSection && <RentWishlistSection viewMode={viewMode} showGeneralToastMessage={showGeneralToastMessage} />}
        
        {/* Preloved Section */}
        {showPrelovedSection && <PrelovedWishlistSection viewMode={viewMode} />}
        
        {/* New Section */}
        {showNewSection && <NewWishlistSection viewMode={viewMode} />}

      </div>
        <WishlistRecommendations onShowToast={showGeneralToastMessage} />
    </div>
  );
};

export default WishlistLayout;