import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import "../../../styles/Profile/cards/WishlistCard.css";

const WishlistCard = ({ piece, onAddToBag, onViewProduct, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(piece.id);
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    
    // Check if modal is needed or direct add
    const needsSize = piece.sizes && piece.sizes.length > 1;
    const needsColor = piece.colors && piece.colors.length > 1;
    const isRental = piece.mode === 'Rental';
    
    const needsModal = needsSize || needsColor || isRental;
    
    if (needsModal) {
      onAddToBag(piece);
    } else {
      // Direct add - only one size, no colors, not rental
      console.log("Direct add to bag:", piece);
      // Show toast notification
    }
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    onViewProduct(piece.id);
  };

  return (
    <div 
      className="profile-wc"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="profile-wc-thumb">
        <svg className="profile-wc-placeholder" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1" opacity="0.22" />
        </svg>
        
        <button className="profile-wc-heart" onClick={handleRemove}>
          <Heart size={12} fill="#B85C38" stroke="#B85C38" strokeWidth={1.5} />
        </button>
        
        {isHovered && (
          <div className="profile-wc-cta-overlay">
            <button className="profile-wc-cta-add" onClick={handleAddToBag}>
              Add to Bag
            </button>
            <button className="profile-wc-cta-view" onClick={handleViewProduct}>
              View Product
            </button>
          </div>
        )}
      </div>
      
      <div className="profile-wc-name">{piece.name}</div>
      <div className="profile-wc-price">₹{piece.price.toLocaleString()}</div>
      <div className="profile-wc-mode">{piece.mode}</div>
    </div>
  );
};

export default WishlistCard;