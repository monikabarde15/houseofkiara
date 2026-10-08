import React from "react";
import { useNavigate } from "react-router-dom";
import featuredDesignersData from "../../../data/home/featuredDesignersData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";
import { renderHeadline } from "../../../utils/headlineParser";

const DesktopFeaturedDesigners = ({ data }) => {
  const navigate = useNavigate();

  const eyebrow = data?.eyebrow || featuredDesignersData.eyebrow;
  const heading = data?.heading || "Featured *Designers*";
  const viewAllText = data?.viewAll?.lbl || data?.viewAll?.text || "View All →";
  const viewAllHref =
    data?.viewAll?.url ||
    data?.viewAll?.link ||
    "/main-page?section=designers";
  const showHeader = data?.header !== false;
  const designers = data?.designers || featuredDesignersData.designers;
  const ctaLbl = data?.ctaLbl || "Shop Now";

  const handleHomeDesignersClick = (designer) => {
    navigate(`/main-page?section=designers&designer=${designer.variant}`);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <section className="desk-featured-designers">
      {showHeader && (
        <div className="desk-featured-designers-header">
          <div>
            <SectionEyebrow text={eyebrow} />

            <SectionTitle>{renderHeadline(heading, "em")}</SectionTitle>
          </div>

          <ViewAllLink text={viewAllText} href={viewAllHref} />
        </div>
      )}

      <div className="desk-designers-grid">
        {designers.map((designer) => (
          <article key={designer.id} className="desk-designer-card">
            <img
              src={designer.image}
              alt={designer.name}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
            <div className="desk-designer-overlay" />

            <div className="desk-designer-content">
              <h3>{designer.name}</h3>

              {designer.pieces ? (
                <span className="desk-designer-count">{designer.pieces}</span>
              ) : null}

              <span
                className="desk-designer-cta"
                onClick={() => handleHomeDesignersClick(designer)}
              >
                {designer.cta || ctaLbl}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DesktopFeaturedDesigners;
