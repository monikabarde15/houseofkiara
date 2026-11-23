import React from "react";
import "../../../styles/howitworks/layout/how-it-works-layout.css";

// Desktop Components
import HeroSection from "../HeroSection";
import ChapterNav from "../ChapterNav";
import ShoppingJourney from "../ShoppingJourney";
import ModeCards from "../ModeCards";
import DividerBand from "../DividerBand";
import ListAndEarn from "../ListAndEarn";
import PoliciesSection from "../PoliciesSection";
import FAQSection from "../FAQSection";
import ClosingCTA from "../ClosingCTA";

const HowItWorksLayout = ({ activeSection, getVal, isSectionHidden }) => {
  const hide = (id) => (isSectionHidden ? isSectionHidden(id) : false);
  return (
    <div className="how-it-works-layout">
      {!hide("hero") && <HeroSection getVal={getVal} />}
      <ChapterNav activeSection={activeSection} />
      {!hide("shopping_journey") && <ShoppingJourney getVal={getVal} />}
      {!hide("modes") && <ModeCards getVal={getVal} />}
      {!hide("divider") && <DividerBand getVal={getVal} />}
      {!hide("list_and_earn") && <ListAndEarn getVal={getVal} />}
      {!hide("policies") && <PoliciesSection getVal={getVal} />}
      {!hide("faq") && <FAQSection getVal={getVal} />}
      {!hide("closing") && <ClosingCTA getVal={getVal} />}
    </div>
  );
};

export default HowItWorksLayout;
