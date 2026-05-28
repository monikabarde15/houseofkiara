// src/components/Wishlist/layout/WishlistSectionHeader.jsx

import "../../../styles/wishlist/layout/wishlist-section-header.css";

const WishlistSectionHeader = ({ mode, pieceCount, dotColor }) => {
  // Format piece count text: "7 pieces" / "3 pieces" / "1 piece"
  const pieceCountText = pieceCount === 1 ? '1 piece' : `${pieceCount} pieces`;

  return (
    <div className="desk-wishlist-section-header">
      <div 
        className="desk-wishlist-section-dot" 
        style={{ backgroundColor: dotColor }}
      ></div>
      <span className="desk-wishlist-section-mode-label">{mode}</span>
      <span className="desk-wishlist-section-piece-count">{pieceCountText}</span>
    </div>
  );
};

export default WishlistSectionHeader;