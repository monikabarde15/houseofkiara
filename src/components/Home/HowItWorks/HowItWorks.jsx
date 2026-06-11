import React from "react";

import DesktopHowItWorks from "./DesktopHowItWorks";
import MobileHowItWorks from "./MobileHowItWorks";

import "../../../styles/Home/HowItWorks/how-it-works.css";
import "../../../styles/Home/HowItWorks/desktop-how-it-works.css";
import "../../../styles/Home/HowItWorks/mobile-how-it-works.css";

const HowItWorks = () => {
  return (
    <section className="hok-hiw">
      <div className="hok-hiw-desktop">
        <DesktopHowItWorks />
      </div>

      <div className="hok-hiw-mobile">
        <MobileHowItWorks />
      </div>
    </section>
  );
};

export default HowItWorks;