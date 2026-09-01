import React from "react";
import "../../../styles/aboutus/mobile/about-us-mobile.css";

// Components
import MobileHero from "./MobileHero";
import MobileNameSection from "./MobileNameSection";
import MobileManifesto from "./MobileManifesto";
import MobilePhilosophy from "./MobilePhilosophy";
import MobileDuality from "./MobileDuality";
import MobileFounder from "./MobileFounder";
import MobileOrbit from "./MobileOrbit";
import MobileThreeWays from "./MobileThreeWays";
import MobileClosingCTA from "./MobileClosingCTA";
import Toast from "../shared/Toast";
import ScrollProgressBar from "../shared/ScrollProgressBar";

const MobileAboutUs = () => {
  return (
    <div className="mob-about-us">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      
      {/* Section 1: Hero - Coming Soon */}
      <MobileHero />
      
      {/* Section 2: The Name (KAIRA Interactive) */}
      <MobileNameSection />
      
      {/* Section 3: Manifesto */}
      <MobileManifesto />
      
      {/* Section 4: Philosophy */}
      <MobilePhilosophy />
      
      {/* Section 5: Duality */}
      <MobileDuality />
      
      {/* Section 6: Founder */}
      <MobileFounder />
      
      {/* Section 7: Why We Built It (Orbit) */}
      <MobileOrbit />
      
      {/* Section 8: Three Ways */}
      <MobileThreeWays />
      
      {/* Section 9: Closing CTA */}
      <MobileClosingCTA />
      

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export default MobileAboutUs;