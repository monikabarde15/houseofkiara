import React from "react";
import { useNavigate } from "react-router-dom";
import featuredProductsData from "../../../data/home/featuredProductsData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

import { Heart } from "lucide-react";

const MobileFeatured = () => {

  const navigate = useNavigate();

  const handleFeaturedViewAll=()=>{
    navigate("/main-page?section=designers")
  }
  return (
    <section className="mobile-featured">
      <div className="mobile-featured-header">
        <div>
          <SectionEyebrow
            text={featuredProductsData.eyebrow}
          />

          <SectionTitle>
            Featured <em>Pieces</em>
          </SectionTitle>
        </div>

        <button className="mobile-featured-view-all"
          onClick={handleFeaturedViewAll}
        >
          View All →
        </button>
      </div>

      <div className="mobile-featured-grid">
        {featuredProductsData.products.map((product) => (
          <article
            key={product.id}
            className="mobile-featured-card"
          >
            <div className="mobile-featured-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="mobile-featured-image"
              />

              <div className="mobile-featured-badge">
                {product.badge}
              </div>

              <button className="mobile-featured-wishlist">
                <Heart size={12} />
              </button>
            </div>

            <div className="mobile-featured-content">
              <p className="mobile-featured-designer">
                {product.designer}
              </p>

              <h3 className="mobile-featured-name">
                {product.name}
              </h3>

              <div className="mobile-featured-price-block">
                <div className="mobile-featured-price-row">
                  <span className="mobile-featured-price">
                    {product.price}
                  </span>

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
        ))}
      </div>
    </section>
  );
};

export default MobileFeatured;