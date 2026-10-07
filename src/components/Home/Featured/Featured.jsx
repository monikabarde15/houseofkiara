import React, { useState, useEffect } from "react";

import DesktopFeatured from "./DesktopFeatured";
import MobileFeatured from "./MobileFeatured";
import {
  fetchFeaturedData,
  defaultFeaturedData,
} from "../../../services/featuredApi";

import "../../../styles/Home/Featured/featured.css";
import "../../../styles/Home/Featured/desktop-featured.css";
import "../../../styles/Home/Featured/mobile-featured.css";

const Featured = () => {
  const [featuredData, setFeaturedData] = useState(() => ({
    ...defaultFeaturedData,
    isVisible: true,
  }));

  useEffect(() => {
    let isMounted = true;
    fetchFeaturedData().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setFeaturedData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (featuredData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-featured">
      <div className="hok-featured-desktop">
        <DesktopFeatured data={featuredData} />
      </div>

      <div className="hok-featured-mobile">
        <MobileFeatured data={featuredData} />
      </div>
    </section>
  );
};

export default Featured;
