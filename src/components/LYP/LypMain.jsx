import React from "react";

// Components
import LypBreadcrumb from "./Breadcrumb/LypBreadcrumb";
import LypHero from "./Hero/LypHero";
import WizardLayout from "./Wizard/WizardLayout";

// CSS 
import "../../styles/LYP/lypMain.css";

const LypMain = () => {
  return (
    <div className="lyp-main">

      {/* Breadcrumb */}
      <LypBreadcrumb />

      {/* Hero */}
      <LypHero />

      {/* Wizard */}
      <WizardLayout/>

      {/* Promises */}
      {/* HowItWorks */}
      {/* Calculator */}

    </div>
  );
};

export default LypMain;