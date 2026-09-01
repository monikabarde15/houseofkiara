import React from 'react';
import '../../../styles/howitworks/layout/how-it-works-layout.css';

// Desktop Components
import HeroSection from '../HeroSection';
import ChapterNav from '../ChapterNav';
import ShoppingJourney from '../ShoppingJourney';
import ModeCards from '../ModeCards';
import DividerBand from '../DividerBand';
import ListAndEarn from '../ListAndEarn';
import PoliciesSection from '../PoliciesSection';
import FAQSection from '../FAQSection';
import ClosingCTA from '../ClosingCTA';

const HowItWorksLayout = ({ activeSection }) => {
  return (
    <div className="how-it-works-layout">
      <HeroSection />
      <ChapterNav activeSection={activeSection} />
      <ShoppingJourney />
      <ModeCards />
      <DividerBand />
      <ListAndEarn />
      <PoliciesSection />
      <FAQSection />
      <ClosingCTA />
    </div>
  );
};

export default HowItWorksLayout;