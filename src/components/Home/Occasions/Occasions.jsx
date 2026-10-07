import React, { useState, useEffect } from "react";
import DesktopOccasions from "./DesktopOccasions";
import MobileOccasions from "./MobileOccasions";
import { getOccasionsSection } from "../../../services/occasionsApi";
import defaultOccasionsData from "../../../data/home/occasionsData";

import "../../../styles/Home/Occasions/occasions.css";
import "../../../styles/Home/Occasions/desktop-occasions.css";
import "../../../styles/Home/Occasions/mobile-occasions.css";

const Occasions = () => {
  const [occasionsData, setOccasionsData] = useState(() => ({
    isVisible: false, // Default is false per spec until enabled in CMS
    eyebrow: defaultOccasionsData.eyebrow,
    heading: defaultOccasionsData.title,
    viewAll: defaultOccasionsData.viewAll,
    layout: defaultOccasionsData.layout,
    ctaLbl: defaultOccasionsData.ctaLbl,
    showCount: defaultOccasionsData.showCount,
    items: defaultOccasionsData.items,
  }));

  useEffect(() => {
    let isMounted = true;
    getOccasionsSection().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setOccasionsData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible === true,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (occasionsData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-occasions" data-header-theme="dark">
      <div className="hok-occasions-desktop">
        <DesktopOccasions data={occasionsData} />
      </div>

      <div className="hok-occasions-mobile">
        <MobileOccasions data={occasionsData} />
      </div>
    </section>
  );
};

export default Occasions;
