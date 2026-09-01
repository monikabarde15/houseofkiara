import React from "react";
import { useNavigate } from "react-router-dom";
import categoriesData from "../../../data/home/categoriesData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";

const CategoryTile = ({ category, isLarge = false }) => {

  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/main-page?section=new&category=${category.variant}`);

    setTimeout(()=>{
      window.scrollTo({
        top:0,
        behavior:"smooth",
      });
    },0);
  };

  return (
    <article
      className={`desk-category-tile desk-category-${category.variant}`}
      onClick={handleCategoryClick}
    >
      {/* Image Wrapper - handles the scale on hover */}
      <div 
        className="desk-category-image-wrapper"
        style={{
          backgroundImage: `
            linear-gradient(
              to top,
              rgba(0, 0, 0, 0.78) 0%,
              rgba(0, 0, 0, 0.2) 60%,
              transparent 100%
            ),
            url(${category.desktopImage})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for gradient (if needed) */}
        <div className="desk-category-overlay" />
      </div>
      
      <div className="desk-category-content">
        <h3
          className={
            isLarge
              ? "desk-category-title-large"
              : "desk-category-title-small"
          }
        >
          {category.name}
        </h3>
        <span className="desk-category-cta">
          {category.cta}
        </span>
      </div>
    </article>
  );
};

const DesktopCategories = () => {
  return (
    <section className="desk-categories">
      <div className="desk-categories-header">
        <div className="desk-categories-header-left">
          <SectionEyebrow text={categoriesData.eyebrow} />
          <SectionTitle>
            Shop by <em>Category</em>
          </SectionTitle>
        </div>
        <ViewAllLink 
        text="View All →"
        href="/main-page?section=new&category"
        />
      </div>

      <div className="desk-categories-grid">
        <div className="desk-categories-row-one">
          {categoriesData.rowOne.map((category) => (
            <CategoryTile
              key={category.id}
              category={category}
              isLarge
            />
          ))}
        </div>

        <div className="desk-categories-row-two">
          {categoriesData.rowTwo.map((category) => (
            <CategoryTile
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DesktopCategories;