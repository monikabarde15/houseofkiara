import React from "react";
import "../../../styles/maincategorypage/mobile/mobile-control-bar.css";

const MobileControlBar = ({ onFilterClick, sortBy, onSortChange }) => {
  return (
    <div className="mob-control-bar">
      
      {/* Filter Button - Left */}
      <button 
        className="mob-control-bar__filter-btn"
        onClick={onFilterClick}
      >
        <svg 
          className="mob-control-bar__filter-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="20" y2="12" />
          <line x1="12" y1="18" x2="20" y2="18" />
        </svg>
        <span>Filter</span>
      </button>

      {/* Sort Dropdown - Right */}
      <div className="mob-control-bar__sort-wrapper">
        <select 
          className="mob-control-bar__sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

    </div>
  );
};

export default MobileControlBar;