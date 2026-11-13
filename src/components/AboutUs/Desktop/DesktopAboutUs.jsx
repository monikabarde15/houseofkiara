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

const DesktopAboutUs = ({ getVal }) => {
  return (
    <div className="au-desktop">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      {/* Section 1: Hero - Coming Soon */}
      <DesktopHero getVal={getVal} />

      {/* Section 2: The Name (KAIRA Interactive) */}
      <DesktopNameSection getVal={getVal} />

      {/* Section 3: Manifesto */}
      <DesktopManifesto getVal={getVal} />

      {/* Section 4: Philosophy */}
      <DesktopPhilosophy getVal={getVal} />

      {/* Section 5: Duality */}
      <DesktopDuality getVal={getVal} />

      {/* Section 6: Founder */}
      <DesktopFounder getVal={getVal} />

      {/* Section 7: Why We Built It (Orbit) */}
      <DesktopOrbit getVal={getVal} />

      {/* Section 8: Three Ways */}
      <DesktopThreeWays getVal={getVal} />

      {/* Section 9: Closing CTA */}
      <DesktopClosingCTA getVal={getVal} />

      {/* Section 10: Footer - coming next */}

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export default DesktopAboutUs;
