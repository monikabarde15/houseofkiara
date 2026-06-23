import React from "react";
import "../../../styles/aboutus/desktop/about-us-desktop.css";

// Components
import DesktopHero from "./DesktopHero";
import DesktopNameSection from "./DesktopNameSection";
import DesktopManifesto from "./DesktopManifesto";
import DesktopPhilosophy from "./DesktopPhilosophy";
import DesktopDuality from "./DesktopDuality";
import DesktopFounder from "./DesktopFounder";
import DesktopOrbit from "./DesktopOrbit";
import DesktopThreeWays from "./DesktopThreeWays";
import DesktopClosingCTA from "./DesktopClosingCTA";
import Toast from "../shared/Toast";
import ScrollProgressBar from "../shared/ScrollProgressBar";

const DesktopAboutUs = () => {
  return (
    <div className="au-desktop">

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      {/* Section 1: Hero - Coming Soon */}
      <DesktopHero />
      
      {/* Section 2: The Name (KAIRA Interactive) */}
      <DesktopNameSection />
      
      {/* Section 3: Manifesto */}
      <DesktopManifesto />
      
      {/* Section 4: Philosophy */}
      <DesktopPhilosophy />
      
      {/* Section 5: Duality */}
      <DesktopDuality />
      
      {/* Section 6: Founder */}
      <DesktopFounder />
      
      {/* Section 7: Why We Built It (Orbit) */}
      <DesktopOrbit />
      
      {/* Section 8: Three Ways */}
      <DesktopThreeWays />
      
      {/* Section 9: Closing CTA */}
      <DesktopClosingCTA />
      
      {/* Section 10: Footer - coming next */}

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export default DesktopAboutUs;