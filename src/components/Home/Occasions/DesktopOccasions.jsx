import React from "react";
import { useNavigate } from "react-router-dom";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";
import { renderHeadline } from "../../../utils/headlineParser";

const OccasionTile = ({ occasion, ctaLbl, showCount }) => {
  const navigate = useNavigate();

  const handleOccasionClick = () => {
    navigate(`/main-page?section=occasions&occasion=${encodeURIComponent(occasion.slug || occasion.name)}`);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <article
      className={`desk-occasion-tile desk-occasion-${occasion.id}`}
      onClick={handleOccasionClick}
    >
      <div className="desk-occasion-image-wrapper">
        <img
          src={occasion.image}
          alt={occasion.alt || occasion.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        />
        <div className="desk-occasion-overlay" />
      </div>

      <div className="desk-occasion-content">
        {occasion.eyebrow && (
          <span className="desk-occasion-eyebrow">{occasion.eyebrow}</span>
        )}
        <h3 className="desk-occasion-title">{occasion.name}</h3>
        {showCount && occasion.count && (
          <span className="desk-occasion-count">{occasion.count}</span>
        )}
        <span className="desk-occasion-cta">
          {ctaLbl || "Shop the Edit"} →
        </span>
      </div>
    </article>
  );
};

const DesktopOccasions = ({ data }) => {
  const eyebrow = data?.eyebrow || "Dressed for the Day";
  const heading = data?.heading || "Shop by *Occasion*";
  const viewAllText = data?.viewAll?.lbl || data?.viewAll?.text || "All Occasions →";
  const viewAllHref = data?.viewAll?.url || data?.viewAll?.link || "/main-page?section=occasions";
  const layout = data?.layout || "Even grid";
  const ctaLbl = data?.ctaLbl || "Shop the Edit";
  const showCount = data?.showCount !== false;
  const items = data?.items || [];

  const gridClass = layout === "Mosaic" ? "mosaic-grid" : "even-grid";

  return (
    <section className="desk-occasions">
      <div className="desk-occasions-header">
        <div className="desk-occasions-header-left">
          <SectionEyebrow text={eyebrow} />
          <SectionTitle>
            {renderHeadline(heading, "em")}
          </SectionTitle>
        </div>
        <ViewAllLink text={viewAllText} href={viewAllHref} />
      </div>

      <div className={`desk-occasions-grid ${gridClass}`}>
        {items.map((occasion) => (
          <OccasionTile
            key={occasion.id}
            occasion={occasion}
            ctaLbl={ctaLbl}
            showCount={showCount}
          />
        ))}
      </div>
    </section>
  );
};

export default DesktopOccasions;
