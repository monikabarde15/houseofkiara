import React from "react";
import "../../../styles/maincategorypage/mobile/mobile-continue-browsing.css";

const MobileContinueBrowsing = ({ onClick, isLoading = false, hasMore = true }) => {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="mob-continue-browsing__wrap">
      <button 
        className="mob-continue-browsing__btn"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Continue browsing"}
      </button>
    </div>
  );
};

export default MobileContinueBrowsing;