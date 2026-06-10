import React from "react";

import DesktopFeatured from "./DesktopFeatured";

import "../../../styles/Home/Featured/featured.css";
import "../../../styles/Home/Featured/desktop-featured.css";

const Featured = () => {
  return (
    <section className="hok-featured">
      <DesktopFeatured />
    </section>
  );
};

export default Featured;