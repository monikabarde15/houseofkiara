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

const HowItWorksLayout = ({ activeSection, getVal }) => {
  return (
    <div className="how-it-works-layout">
      <HeroSection getVal={getVal} />
      <ChapterNav activeSection={activeSection} />
      <ShoppingJourney getVal={getVal} />
      <ModeCards getVal={getVal} />
      <DividerBand getVal={getVal} />
      <ListAndEarn getVal={getVal} />
      <PoliciesSection getVal={getVal} />
      <FAQSection getVal={getVal} />
      <ClosingCTA getVal={getVal} />
    </div>
  );
};

export default HowItWorksLayout;
