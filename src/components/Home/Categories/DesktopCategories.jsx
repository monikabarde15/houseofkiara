import React from "react";
import { useNavigate } from "react-router-dom";
import categoriesData from "../../../data/home/categoriesData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";
import { renderHeadline } from "../../../utils/headlineParser";

const CategoryTile = ({ category, isLarge = false }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/main-page?section=new&category=${category.variant}`);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <article
      className={`desk-category-tile desk-category-${category.variant}`}
      onClick={handleCategoryClick}
    >
      {/* Image Wrapper - handles the scale on hover */}
      <div className="desk-category-image-wrapper">
        <img
          src={category.desktopImage}
          alt={category.name}
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
        {/* Overlay for gradient (if needed) */}
        <div className="desk-category-overlay" />
      </div>

      <div className="desk-category-content">
        <h3
          className={
            isLarge ? "desk-category-title-large" : "desk-category-title-small"
          }
        >
          {category.name}
        </h3>
        <span className="desk-category-cta">{category.cta}</span>
      </div>
    </article>
  );
};

const DesktopCategories = ({ data }) => {
  const categories = data || categoriesData;
  const eyebrow = categories.eyebrow || categoriesData.eyebrow;
  const heading = categories.heading || categoriesData.title || "Shop by *Category*";
  const viewAllText = categories.viewAll?.text || categories.viewAll?.lbl || "View All →";
  const viewAllHref = categories.viewAll?.link || categories.viewAll?.url || "/main-page?section=new&category";
  const rowOne = categories.rowOne && categories.rowOne.length > 0 ? categories.rowOne : categoriesData.rowOne;
  const rowTwo = categories.rowTwo && categories.rowTwo.length > 0 ? categories.rowTwo : categoriesData.rowTwo;

  return (
    <section className="desk-categories">
      <div className="desk-categories-header">
        <div className="desk-categories-header-left">
          <SectionEyebrow text={eyebrow} />
          <SectionTitle>
            {renderHeadline(heading, "em")}
          </SectionTitle>
        </div>
        <ViewAllLink text={viewAllText} href={viewAllHref} />
      </div>

      <div className="desk-categories-grid">
        <div className="desk-categories-row-one">
          {rowOne.map((category) => (
            <CategoryTile key={category.id} category={category} isLarge />
          ))}
        </div>

        <div className="desk-categories-row-two">
          {rowTwo.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesktopCategories;
