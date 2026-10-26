import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import "../../../styles/Profile/cards/WishlistCard.css";

const WishlistCard = ({ piece, onAddToBag, onViewProduct, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(piece.id, piece);
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    onAddToBag?.(piece);
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    onViewProduct?.(piece.id, piece);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    onViewProduct?.(piece.id, piece);
  };

  return (
    <div 
      className="profile-wc"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="profile-wc-thumb">
        {piece.image ? (
          <img
            src={piece.image}
            alt={piece.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg className="profile-wc-placeholder" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1" opacity="0.22" />
          </svg>
        )}
        
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
      <div className="profile-wc-price">₹{Number(piece.price || 0).toLocaleString()}</div>
      <div className="profile-wc-mode">{piece.mode}</div>
    </div>
  );
};

export default WishlistCard;