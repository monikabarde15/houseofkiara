import React, { useState, useEffect } from "react";

import DesktopFeaturedDesigners from "./DesktopFeaturedDesigners";
import MobileDesigners from "./MobileDesigners";
import { getDesignersSection } from "../../../services/designersApi";
import featuredDesignersData from "../../../data/home/featuredDesignersData";

import "../../../styles/Home/Designers/featured-designers.css";
import "../../../styles/Home/Designers/desktop-featured-designers.css";
import "../../../styles/Home/Designers/mobile-designers.css";

const FeaturedDesigners = () => {
  const [designersData, setDesignersData] = useState(() => ({
    isVisible: true,
    eyebrow: featuredDesignersData.eyebrow,
    heading: "Featured *Designers*",
    viewAll: {
      lbl: "View All →",
      url: "/main-page?section=designers",
    },
    header: true,
    headerMob: false,
    slideKick: "Featured Designer",
    ctaLbl: "Shop Now",
    showCount: true,
    cap: 6,
    layout: "Grid",
    layoutMob: "Carousel",
    designers: featuredDesignersData.designers.map((d) => ({
      ...d,
      piecesMobile: d.pieces,
      cta: "Shop Now",
    })),
  }));

  useEffect(() => {
    let isMounted = true;
    getDesignersSection().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setDesignersData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (designersData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-featured-designers" data-header-theme="dark">
      <div className="hok-designers-desktop">
        <DesktopFeaturedDesigners data={designersData} />
      </div>

      <div className="hok-designers-mobile">
        <MobileDesigners data={designersData} />
      </div>
    </section>
  );
};

export default FeaturedDesigners;
