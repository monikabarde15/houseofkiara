import React from "react";
import MobileProductCard from "./MobileProductCard";
import "../../../styles/maincategorypage/mobile/mobile-product-grid.css";

const MobileProductGrid = ({ products, onWishlistToggle }) => {
  if (!products || products.length === 0) {
    return (
      <div className="mob-product-grid__empty">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="mob-product-grid">
      {products.map((product) => (
        <MobileProductCard 
          key={product.id} 
          item={product}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
};

export default MobileProductGrid;