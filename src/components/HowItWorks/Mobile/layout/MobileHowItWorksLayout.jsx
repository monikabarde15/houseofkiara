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

const MobileHowItWorksLayout = ({ activeSection, getVal, isSectionHidden }) => {
  const hide = (id) => (isSectionHidden ? isSectionHidden(id) : false);
  return (
    <div className="hok-hiw-mobile-layout">
      {!hide("hero") && <MobileHeroSection getVal={getVal} />}
      <MobileChapterNav activeSection={activeSection} />
      {!hide("shopping_journey") && <MobileShoppingJourney getVal={getVal} />}
      {!hide("modes") && <MobileModeCards getVal={getVal} />}
      {!hide("divider") && <MobileDividerBand getVal={getVal} />}
      {!hide("list_and_earn") && <MobileListAndEarn getVal={getVal} />}
      {!hide("policies") && <MobilePoliciesSection getVal={getVal} />}
      {!hide("faq") && <MobileFAQSection getVal={getVal} />}
      {!hide("closing") && <MobileClosingCTA getVal={getVal} />}
    </div>
  );
};

export default MobileHowItWorksLayout;
