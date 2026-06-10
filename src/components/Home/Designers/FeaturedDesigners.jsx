import React from "react";

import DesktopFeaturedDesigners from "./DesktopFeaturedDesigners";

import "../../../styles/Home/Designers/featured-designers.css";
import "../../../styles/Home/Designers/desktop-featured-designers.css";

const FeaturedDesigners = () => {
  return (
    <section className="hok-featured-designers">
      <DesktopFeaturedDesigners />
    </section>
  );
};

export default FeaturedDesigners;