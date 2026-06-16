import React from 'react';
import '../../../../styles/howitworks/layout/mobile-how-it-works-layout.css';

// Mobile Components
import MobileHeroSection from '../MobileHeroSection';
import MobileChapterNav from '../MobileChapterNav';
import MobileShoppingJourney from '../MobileShoppingJourney';
import MobileModeCards from '../MobileModeCards';
import MobileDividerBand from '../MobileDividerBand';
import MobileListAndEarn from '../MobileListAndEarn';
import MobilePoliciesSection from '../MobilePoliciesSection';
import MobileFAQSection from '../MobileFAQSection';
import MobileClosingCTA from '../MobileClosingCTA';

const MobileHowItWorksLayout = ({ activeSection }) => {
  return (
    <div className="hok-hiw-mobile-layout">
      <MobileHeroSection />
      <MobileChapterNav activeSection={activeSection} />
      <MobileShoppingJourney />
      <MobileModeCards />
      <MobileDividerBand />
      <MobileListAndEarn />
      <MobilePoliciesSection />
      <MobileFAQSection />
      <MobileClosingCTA />
    </div>
  );
};

export default MobileHowItWorksLayout;