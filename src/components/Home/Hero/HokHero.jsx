import React from "react";

import DesktopHero from "./DesktopHero";
import MobileHero from "./MobileHero";

import "../../../styles/Home/Hero/hero.css";
import "../../../styles/Home/Hero/desktop-hero.css";
import "../../../styles/Home/Hero/mobile-hero.css";

const HokHero = () => {
  return (
    <section
      className="hok-hero"
      data-header-theme="dark"
    >
      <div className="hok-hero-desktop">
        <DesktopHero />
      </div>

      <div className="hok-hero-mobile">
        <MobileHero />
      </div>
    </section>
  );
};

export default HokHero;