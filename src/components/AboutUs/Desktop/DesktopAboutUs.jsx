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

const DesktopAboutUs = ({ getVal, isSectionHidden }) => {
  const hide = (id) => (isSectionHidden ? isSectionHidden(id) : false);
  return (
    <div className="au-desktop">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      {/* Section 1: Hero - Coming Soon */}
      {!hide("hero") && <DesktopHero getVal={getVal} />}

      {/* Section 2: The Name (KAIRA Interactive) */}
      {!hide("name") && <DesktopNameSection getVal={getVal} />}

      {/* Section 3: Manifesto */}
      {!hide("manifesto") && <DesktopManifesto getVal={getVal} />}

      {/* Section 4: Philosophy */}
      {!hide("philosophy") && <DesktopPhilosophy getVal={getVal} />}

      {/* Section 5: Duality */}
      {!hide("duality") && <DesktopDuality getVal={getVal} />}

      {/* Section 6: Founder */}
      {!hide("founder") && <DesktopFounder getVal={getVal} />}

      {/* Section 7: Why We Built It (Orbit) */}
      {!hide("orbit") && <DesktopOrbit getVal={getVal} />}

      {/* Section 8: Three Ways */}
      {!hide("three-ways") && <DesktopThreeWays getVal={getVal} />}

      {/* Section 9: Closing CTA */}
      {!hide("closing") && <DesktopClosingCTA getVal={getVal} />}

      {/* Section 10: Footer - coming next */}

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export default DesktopAboutUs;
