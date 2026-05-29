// src/components/Wishlist/layout/WishlistToolbar.jsx

import "../../../styles/wishlist/layout/wishlist-toolbar.css";
import { useState } from "react";
import ShareWishlistModal from "../modal/ShareWishlistModal";
const WishlistToolbar = ({
  activeTab,
  onTabChange,
  tabCounts,
  sortBy,
  onSortChange,
  onShareClick,
  viewMode,
  onViewModeChange,
  showGeneralToastMessage,
}) => {
  const tabs = [
    { id: "all", label: "All", count: tabCounts?.all || 0 },
    { id: "rent", label: "Rent", count: tabCounts?.rent || 0 },
    { id: "preloved", label: "Buy Preloved", count: tabCounts?.preloved || 0 },
    { id: "new", label: "Buy New", count: tabCounts?.new || 0 },
  ];

  const sortOptions = [
    { value: "newest", label: "Date saved: Newest" },
    { value: "oldest", label: "Date saved: Oldest" },
    { value: "priceLowHigh", label: "Price: Low to High" },
    { value: "priceHighLow", label: "Price: High to Low" },
    { value: "designerAZ", label: "Designer A–Z" },
  ];

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Update handleShareClick
  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  

  return (

    <>
    <div className="desk-wishlist-toolbar">

      {/* LEFT */}
      <div className="desk-wishlist-tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`desk-wishlist-tab-button ${
              activeTab === tab.id
                ? "desk-wishlist-tab-active"
                : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="desk-wishlist-tab-label">
              {tab.label}
            </span>

            <span
              className={`desk-wishlist-tab-count ${
                activeTab === tab.id
                  ? "desk-wishlist-tab-count-active"
                  : ""
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div className="desk-wishlist-toolbar-right">

        {/* SORT */}
        <div className="desk-wishlist-sort-wrapper">

          <label className="desk-wishlist-sort-label">
            SORT
          </label>

          <div className="desk-wishlist-custom-select-wrapper">

            <select
              className="desk-wishlist-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <div className="desk-wishlist-select-chevron" />

          </div>
        </div>

        {/* SHARE */}
        <button
          className="desk-wishlist-share-button"
          onClick={handleShareClick}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="3"
              cy="6.5"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <circle
              cx="9.5"
              cy="3"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <circle
              cx="9.5"
              cy="10"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <line
              x1="4.5"
              y1="7.5"
              x2="8"
              y2="9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <line
              x1="4.5"
              y1="5.5"
              x2="8"
              y2="4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          SHARE
        </button>

        {/* VIEW TOGGLE */}
        <div className="desk-wishlist-view-toggle">

          <button
            className={`desk-wishlist-view-toggle-btn ${
              viewMode === "grid"
                ? "desk-wishlist-view-toggle-active"
                : ""
            }`}
            onClick={() => onViewModeChange("grid")}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="4"
                height="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <rect
                x="7.5"
                y="0.5"
                width="4"
                height="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <rect
                x="0.5"
                y="7.5"
                width="4"
                height="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <rect
                x="7.5"
                y="7.5"
                width="4"
                height="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>

          <button
            className={`desk-wishlist-view-toggle-btn ${
              viewMode === "list"
                ? "desk-wishlist-view-toggle-active"
                : ""
            }`}
            onClick={() => onViewModeChange("list")}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="0.5"
                y1="2"
                x2="11.5"
                y2="2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <line
                x1="0.5"
                y1="6"
                x2="11.5"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <line
                x1="0.5"
                y1="10"
                x2="11.5"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

        </div>
      </div>
    </div>

  {
    isShareModalOpen && (
      <ShareWishlistModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShowToast={showGeneralToastMessage}
      />
    )
  }

    </>
  );
};

export default WishlistToolbar;