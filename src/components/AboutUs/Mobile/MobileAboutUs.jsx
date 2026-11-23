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

const MobileAboutUs = ({ getVal, isSectionHidden }) => {
  const hide = (id) => (isSectionHidden ? isSectionHidden(id) : false);
  return (
    <div className="mob-about-us">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Section 1: Hero - Coming Soon */}
      {!hide("hero") && <MobileHero getVal={getVal} />}

      {/* Section 2: The Name (KAIRA Interactive) */}
      {!hide("name") && <MobileNameSection getVal={getVal} />}

      {/* Section 3: Manifesto */}
      {!hide("manifesto") && <MobileManifesto getVal={getVal} />}

      {/* Section 4: Philosophy */}
      {!hide("philosophy") && <MobilePhilosophy getVal={getVal} />}

      {/* Section 5: Duality */}
      {!hide("duality") && <MobileDuality getVal={getVal} />}

      {/* Section 6: Founder */}
      {!hide("founder") && <MobileFounder getVal={getVal} />}

      {/* Section 7: Why We Built It (Orbit) */}
      {!hide("orbit") && <MobileOrbit getVal={getVal} />}

      {/* Section 8: Three Ways */}
      {!hide("three-ways") && <MobileThreeWays getVal={getVal} />}

      {/* Section 9: Closing CTA */}
      {!hide("closing") && <MobileClosingCTA getVal={getVal} />}

      {/* Toast Notification */}
      <Toast />
    </div>
  );
};

export default MobileAboutUs;
