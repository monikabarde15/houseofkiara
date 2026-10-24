import React from "react";
import { useNavigate } from "react-router-dom";
import { navigateToProductDetail } from "../../utils/productNavigation";
import ProductBadge from "./ProductBadge";
import WishlistButton from "./WishlistButton";
import "../../styles/shared/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest(".hok-product-wishlist-wrapper") || e.target.closest("button")) {
      return;
    }
    navigateToProductDetail(navigate, product);
  };

  return (
    <article
      className="hok-product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
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
          <WishlistButton
            productId={product.sku || product.productId || product.id || product._id}
            product={product}
          />
        </div>
      </div>

      <div className="hok-product-content">
        <p className="hok-product-designer">{product.designer}</p>

        <h3 className="hok-product-name">{product.name}</h3>

        <div className="hok-product-price-row">
          <span className="hok-product-price">{product.price}</span>

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
