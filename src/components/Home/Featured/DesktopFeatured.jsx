import React from "react";

import featuredProductsData from "../../../data/home/featuredProductsData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ProductCard from "../../shared/ProductCard";
import ViewAllLink from "../../shared/ViewAllLink";
import { renderHeadline } from "../../../utils/headlineParser";
import { resolveProductsFromSlots } from "../../../services/featuredApi";

const DesktopFeatured = ({ data }) => {
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

  return (
    <section className="desk-featured">
      <div className="desk-featured-header">
        <div className="desk-featured-header-left">
          <SectionEyebrow text={eyebrow} />

          <SectionTitle>{renderHeadline(heading, "em")}</SectionTitle>
        </div>

        <ViewAllLink text={viewAllText} href={viewAllHref} />
      </div>

      <div className="desk-featured-grid">
        {products.map((product) => (
          <ProductCard key={product.id || product.sku} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DesktopFeatured;
