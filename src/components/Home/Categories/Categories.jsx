import React from "react";

import DesktopCategories from "./DesktopCategories";
import MobileCategories from "./MobileCategories";

import "../../../styles/Home/Categories/categories.css";
import "../../../styles/Home/Categories/desktop-categories.css";
import "../../../styles/Home/Categories/mobile-categories.css";

const Categories = () => {
  return (
    <section className="hok-categories">
      <div className="hok-categories-desktop">
        <DesktopCategories />
      </div>

      <div className="hok-categories-mobile">
        <MobileCategories />
      </div>
    </section>
  );
};

export default Categories;