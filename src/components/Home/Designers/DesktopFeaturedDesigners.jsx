import React from "react";

import featuredDesignersData from "../../../data/home/featuredDesignersData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";

const DesktopFeaturedDesigners = () => {
  return (
    <section className="desk-featured-designers">
      <div className="desk-featured-designers-header">
        <div>
          <SectionEyebrow
            text={featuredDesignersData.eyebrow}
          />

          <SectionTitle>
            Featured <em>Designers</em>
          </SectionTitle>
        </div>

        <ViewAllLink text="View All →" />
      </div>

      <div className="desk-designers-grid">
        {featuredDesignersData.designers.map(
          (designer) => (
            <article
              key={designer.id}
              className={`desk-designer-card desk-designer-${designer.variant}`}
            >
              <div className="desk-designer-overlay" />

              <div className="desk-designer-content">
                <h3>{designer.name}</h3>

                <span className="desk-designer-count">
                  {designer.pieces}
                </span>

                <span className="desk-designer-cta">
                  Shop Now
                </span>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
};

export default DesktopFeaturedDesigners;