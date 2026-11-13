import React from "react";
import "../../../../styles/howitworks/layout/mobile-how-it-works-layout.css";

// Mobile Components
import MobileHeroSection from "../MobileHeroSection";
import MobileChapterNav from "../MobileChapterNav";
import MobileShoppingJourney from "../MobileShoppingJourney";
import MobileModeCards from "../MobileModeCards";
import MobileDividerBand from "../MobileDividerBand";
import MobileListAndEarn from "../MobileListAndEarn";
import MobilePoliciesSection from "../MobilePoliciesSection";
import MobileFAQSection from "../MobileFAQSection";
import MobileClosingCTA from "../MobileClosingCTA";

const MobileHowItWorksLayout = ({ activeSection, getVal }) => {
  return (
    <div className="hok-hiw-mobile-layout">
      <MobileHeroSection getVal={getVal} />
      <MobileChapterNav activeSection={activeSection} />
      <MobileShoppingJourney getVal={getVal} />
      <MobileModeCards getVal={getVal} />
      <MobileDividerBand getVal={getVal} />
      <MobileListAndEarn getVal={getVal} />
      <MobilePoliciesSection getVal={getVal} />
      <MobileFAQSection getVal={getVal} />
      <MobileClosingCTA getVal={getVal} />
    </div>
  );
};

export default MobileHowItWorksLayout;
