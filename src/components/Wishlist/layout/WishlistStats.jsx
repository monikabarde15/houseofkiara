// src/components/Wishlist/layout/WishlistStats.jsx

import "../../../styles/wishlist/layout/wishlist-stats.css";

const WishlistStats = ({ piecesSaved, designers, toRent }) => {
  return (
    <div className="desk-wishlist-page-stats-right">
      <div className="desk-wishlist-stat-block">
        <div className="desk-wishlist-stat-number">{piecesSaved}</div>
        <div className="desk-wishlist-stat-label">Pieces Saved</div>
      </div>
      <div className="desk-wishlist-stat-separator"></div>
      <div className="desk-wishlist-stat-block">
        <div className="desk-wishlist-stat-number">{designers}</div>
        <div className="desk-wishlist-stat-label">Designers</div>
      </div>
      <div className="desk-wishlist-stat-separator"></div>
      <div className="desk-wishlist-stat-block">
        <div className="desk-wishlist-stat-number">{toRent}</div>
        <div className="desk-wishlist-stat-label">To Rent</div>
      </div>
    </div>
  );
};

export default WishlistStats;