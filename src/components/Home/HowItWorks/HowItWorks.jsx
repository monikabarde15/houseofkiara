import React, { useState, useEffect } from "react";

import DesktopHowItWorks from "./DesktopHowItWorks";
import MobileHowItWorks from "./MobileHowItWorks";
import {
  fetchHowItWorksData,
  defaultHowItWorksData,
} from "../../../services/howItWorksApi";

import "../../../styles/Home/HowItWorks/how-it-works.css";
import "../../../styles/Home/HowItWorks/desktop-how-it-works.css";
import "../../../styles/Home/HowItWorks/mobile-how-it-works.css";

const HowItWorks = () => {
  const [hiwData, setHiwData] = useState(() => ({
    ...defaultHowItWorksData,
    isVisible: true,
  }));

  useEffect(() => {
    let isMounted = true;
    fetchHowItWorksData().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setHiwData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (hiwData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-hiw">
      <div className="hok-hiw-desktop">
        <DesktopHowItWorks data={hiwData} />
      </div>

      <div className="hok-hiw-mobile">
        <MobileHowItWorks data={hiwData} />
      </div>
    </section>
  );
};

export default HowItWorks;
