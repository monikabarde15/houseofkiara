// src/components/Wishlist/layout/WishlistHeader.jsx


import WishlistStats from "./WishlistStats";
import "../../../styles/wishlist/layout/wishlist-header.css";

const WishlistHeader = () => {
  // TODO: Replace with actual data from wishlist store/context
  
  const piecesSaved = 11;
  const designers = 9;
  const toRent = 7;

  return (
    <div className="desk-wishlist-page-title-section">
      {/* Section 4.1: Left - Title */}
      <div className="desk-wishlist-page-title-left">
        <h1 className="desk-wishlist-page-h1">
          <span className="desk-wishlist-page-h1-normal">My </span>
          <span className="desk-wishlist-page-h1-italic">Wishlist</span>
        </h1>
        <p className="desk-wishlist-page-subtitle">
          Every piece you've set aside — waiting for the right occasion.
        </p>
      </div>

      {/* Section 4.2: Right - Stats */}
      <WishlistStats 
        piecesSaved={piecesSaved}
        designers={designers}
        toRent={toRent}
      />
    </div>
  );
};

export default WishlistHeader;