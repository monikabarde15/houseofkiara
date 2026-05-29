// src/components/Wishlist/sections/EmptyWishlistState.jsx
// Section 10: Empty State

import "../../../styles/wishlist/sections/empty-wishlist-state.css";

const EmptyWishlistState = () => {
  return (
    <div className="desk-wishlist-empty-state">
      {/* Ring Icon - 60×60px circle with heart SVG inside */}
      <div className="desk-wishlist-empty-ring">
        <svg 
          className="desk-wishlist-empty-heart"
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
            stroke="currentColor" 
            strokeWidth="1.3" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Eyebrow Text */}
      <div className="desk-wishlist-empty-eyebrow">
        Nothing saved here yet
      </div>
      
      {/* Title with italic "edit" */}
      <h2 className="desk-wishlist-empty-title">
        Your <span className="desk-wishlist-empty-title-italic">edit</span> awaits
      </h2>
      
      {/* Subtitle */}
      <p className="desk-wishlist-empty-subtitle">
        Browse the collection and tap on any piece to save it here.
      </p>
      
      {/* CTA Button */}
      <button className="desk-wishlist-empty-cta">
        Browse the Collection
      </button>
    </div>
  );
};

export default EmptyWishlistState;