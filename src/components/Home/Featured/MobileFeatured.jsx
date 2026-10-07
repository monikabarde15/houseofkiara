import React from "react";
import { useNavigate } from "react-router-dom";
import featuredProductsData from "../../../data/home/featuredProductsData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { Heart } from "lucide-react";
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
  const products = resolveProductsFromSlots(slots);

  const handleFeaturedViewAll = () => {
    navigate(viewAllHref);
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
        {products.map((product) => (
          <article key={product.id || product.sku} className="mobile-featured-card">
            <div className="mobile-featured-image-wrapper">
              <img
                src={product.image}
                alt={product.name}
                className="mobile-featured-image"
              />

              <div className="mobile-featured-badge">{product.badge}</div>

              <button className="mobile-featured-wishlist">
                <Heart size={12} />
              </button>
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
        ))}
      </div>
    </section>
  );
};

export default MobileFeatured;
