import React, { useState, useEffect } from "react";

import DesktopCategories from "./DesktopCategories";
import MobileCategories from "./MobileCategories";
import { getCategorySection } from "../../../services/categoryApi";
import defaultCategoriesData from "../../../data/home/categoriesData";

import "../../../styles/Home/Categories/categories.css";
import "../../../styles/Home/Categories/desktop-categories.css";
import "../../../styles/Home/Categories/mobile-categories.css";

const Categories = () => {
  const [categoryData, setCategoryData] = useState(() => ({
    isVisible: true,
    eyebrow: defaultCategoriesData.eyebrow,
    heading: defaultCategoriesData.title,
    viewAll: {
      text: "View All →",
      link: "/main-page?section=new&category",
    },
    ctaLbl: "Shop Now",
    rowOne: defaultCategoriesData.rowOne,
    rowTwo: defaultCategoriesData.rowTwo,
    slides: [...defaultCategoriesData.rowOne, ...defaultCategoriesData.rowTwo],
  }));

  useEffect(() => {
    let isMounted = true;
    getCategorySection().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setCategoryData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (categoryData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-categories" data-header-theme="dark">
      <div className="hok-categories-desktop">
        <DesktopCategories data={categoryData} />
      </div>

      <div className="hok-categories-mobile">
        <MobileCategories data={categoryData} />
      </div>
    </section>
  );
};

export default Categories;
