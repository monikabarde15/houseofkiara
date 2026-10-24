import React from "react";
import { useNavigate } from "react-router-dom";
import { navigateToProductDetail } from "../../../utils/productNavigation";
import featuredProductsData from "../../../data/home/featuredProductsData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import WishlistButton from "../../shared/WishlistButton";
import { renderHeadline } from "../../../utils/headlineParser";
import { resolveProductsFromSlots } from "../../../services/featuredApi";

const MobileFeatured = ({ data }) => {
  const navigate = useNavigate();

  const eyebrow = data?.eyebrow || featuredProductsData.eyebrow;
  const heading =
    data?.heading || featuredProductsData.title || "Featured *Pieces*";
  const viewAllText =
    data?.viewAll?.lbl || data?.viewAll?.text || "View All →";
  const viewAllHref =
    data?.viewAll?.url ||
    data?.viewAll?.link ||
    "/main-page?section=designers";

  const slots = data?.slots || data?.settings?.slots;
  const products = (Array.isArray(data?.products) && data.products.length > 0)
    ? data.products
    : resolveProductsFromSlots(slots);

  const handleFeaturedViewAll = () => {
    navigate(viewAllHref);
  };

  const handleCardClick = (product, e) => {
    if (e.target.closest(".mobile-featured-wishlist-wrapper") || e.target.closest("button")) {
      return;
    }
    navigateToProductDetail(navigate, product);
  };

  return (
    <section className="mobile-featured">
      <div className="mobile-featured-header">
        <div>
          <SectionEyebrow text={eyebrow} />

          <SectionTitle>{renderHeadline(heading, "em")}</SectionTitle>
        </div>

        <button
          className="mobile-featured-view-all"
          onClick={handleFeaturedViewAll}
        >
          {viewAllText}
        </button>
      </div>

      <div className="mobile-featured-grid">
        {products.map((product) => {
          const prodId = product.sku || product.productId || product.id || product._id;
          return (
            <article
              key={prodId}
              className="mobile-featured-card"
              onClick={(e) => handleCardClick(product, e)}
              style={{ cursor: "pointer" }}
            >
              <div className="mobile-featured-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="mobile-featured-image"
                />

                <div className="mobile-featured-badge">{product.badge}</div>

                <div className="mobile-featured-wishlist-wrapper">
                  <WishlistButton productId={prodId} product={product} />
                </div>
              </div>

            <div className="mobile-featured-content">
              <p className="mobile-featured-designer">{product.designer}</p>

              <h3 className="mobile-featured-name">{product.name}</h3>

              <div className="mobile-featured-price-block">
                <div className="mobile-featured-price-row">
                  <span className="mobile-featured-price">{product.price}</span>

                  {product.priceSuffix && (
                    <span className="mobile-featured-price-suffix">
                      {product.priceSuffix}
                    </span>
                  )}
                </div>

                {product.retailPrice && (
                  <span className="mobile-featured-retail">
                    {product.retailPrice}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
      </div>
    </section>
  );
};

export default MobileFeatured;
