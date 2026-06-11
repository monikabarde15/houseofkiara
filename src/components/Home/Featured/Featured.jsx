import React from "react";

import DesktopFeatured from "./DesktopFeatured";
import MobileFeatured from "./MobileFeatured";

import "../../../styles/Home/Featured/featured.css";
import "../../../styles/Home/Featured/desktop-featured.css";
import "../../../styles/Home/Featured/mobile-featured.css";

const Featured = () => {
  return (
    <section className="hok-featured">
      <div className="hok-featured-desktop">
        <DesktopFeatured />
      </div>

      <div className="hok-featured-mobile">
        <MobileFeatured />
      </div>
    </section>
  );
};

export default Featured;