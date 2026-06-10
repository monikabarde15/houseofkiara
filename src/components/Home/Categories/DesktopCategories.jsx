import React from "react";

import categoriesData from "../../../data/home/categoriesData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ViewAllLink from "../../shared/ViewAllLink";

const CategoryTile = ({
  category,
  isLarge = false,
}) => {
  return (
    <article
      className={`desk-category-tile desk-category-${category.variant}`}
    >
      <div className="desk-category-overlay" />

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
          <SectionEyebrow
            text={categoriesData.eyebrow}
          />

          <SectionTitle>
            Shop by <em>Category</em>
          </SectionTitle>
        </div>

        <ViewAllLink text="View All →" />
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