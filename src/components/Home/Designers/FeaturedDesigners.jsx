import React from "react";

import DesktopFeaturedDesigners from "./DesktopFeaturedDesigners";
import MobileDesigners from "./MobileDesigners";

import "../../../styles/Home/Designers/featured-designers.css";
import "../../../styles/Home/Designers/desktop-featured-designers.css";
import "../../../styles/Home/Designers/mobile-designers.css";

const FeaturedDesigners = () => {
  return (
    <section className="hok-featured-designers">
      <div className="hok-designers-desktop">
        <DesktopFeaturedDesigners />
      </div>

      <div className="hok-designers-mobile">
        <MobileDesigners />
      </div>
    </section>
  );
};

export default FeaturedDesigners;