import React from "react";

import ProductBadge from "./ProductBadge";
import WishlistButton from "./WishlistButton";

import "../../styles/shared/ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <article className="hok-product-card">
      <div className="hok-product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="hok-product-image"
        />

        <div className="hok-product-badge-wrapper">
          <ProductBadge type={product.badge} />
        </div>

        <div className="hok-product-wishlist-wrapper">
          <WishlistButton />
        </div>
      </div>

      <div className="hok-product-content">
        <p className="hok-product-designer">
          {product.designer}
        </p>

        <h3 className="hok-product-name">
          {product.name}
        </h3>

        <div className="hok-product-price-row">
          <span className="hok-product-price">
            {product.price}
          </span>

          {product.priceSuffix && (
            <span className="hok-product-price-suffix">
              {product.priceSuffix}
            </span>
          )}

          {product.retailPrice && (
            <span className="hok-product-retail-price">
              {product.retailPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;