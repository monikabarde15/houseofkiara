import React from "react";
import { useNavigate } from "react-router-dom";
import featuredDesignersData from "../../../data/home/featuredDesignersData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";

const DesktopFeaturedDesigners = () => {
  const navigate = useNavigate();

  const handleHomeDesignersClick = (designer) => {
    navigate(
      `/main-page?section=designers&designer=${designer.variant}`
    );

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

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

        <ViewAllLink text="View All →"
        href="/main-page?section=designers"
        />
      </div>

      <div className="desk-designers-grid">
        {featuredDesignersData.designers.map(
          (designer) => (
            <article
              key={designer.id}
              className="desk-designer-card"
              style={{
                backgroundImage: `url(${designer.image})`,
              }}
            >
              <div className="desk-designer-overlay" />

              <div className="desk-designer-content">
                <h3>{designer.name}</h3>

                <span className="desk-designer-count">
                  {designer.pieces}
                </span>

                <span className="desk-designer-cta"
                onClick={() => handleHomeDesignersClick(designer)}
                >
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