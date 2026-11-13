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

const MobileAboutUs = ({ getVal }) => {
  return (
    <div className="mob-about-us">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Section 1: Hero - Coming Soon */}
      <MobileHero getVal={getVal} />

      {/* Section 2: The Name (KAIRA Interactive) */}
      <MobileNameSection getVal={getVal} />

      {/* Section 3: Manifesto */}
      <MobileManifesto getVal={getVal} />

      {/* Section 4: Philosophy */}
      <MobilePhilosophy getVal={getVal} />

      {/* Section 5: Duality */}
      <MobileDuality getVal={getVal} />

      {/* Section 6: Founder */}
      <MobileFounder getVal={getVal} />

      {/* Section 7: Why We Built It (Orbit) */}
      <MobileOrbit getVal={getVal} />

      {/* Section 8: Three Ways */}
      <MobileThreeWays getVal={getVal} />

      {/* Section 9: Closing CTA */}
      <MobileClosingCTA getVal={getVal} />

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export default MobileAboutUs;
