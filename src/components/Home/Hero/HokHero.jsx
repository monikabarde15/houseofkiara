import React, { useState, useEffect } from "react";

import DesktopHero from "./DesktopHero";
import MobileHero from "./MobileHero";
import { fetchHeroData, defaultHeroData } from "../../../services/heroApi";

import "../../../styles/Home/Hero/hero.css";
import "../../../styles/Home/Hero/desktop-hero.css";
import "../../../styles/Home/Hero/mobile-hero.css";

const HokHero = () => {
  const [heroData, setHeroData] = useState(() => ({
    ...defaultHeroData,
    isVisible: true,
  }));

  useEffect(() => {
    let isMounted = true;
    fetchHeroData().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setHeroData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (heroData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-hero" data-header-theme="dark">
      <div className="hok-hero-desktop">
        <DesktopHero heroData={heroData} />
      </div>

      <div className="hok-hero-mobile">
        <MobileHero heroData={heroData} />
      </div>
    </section>
  );
};

export default HokHero;
