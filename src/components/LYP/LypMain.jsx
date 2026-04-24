// src\components\LYP\LypMain.jsx
import React from "react";

// Components
import LypBreadcrumb from "./Breadcrumb/LypBreadcrumb";
import LypHero from "./Hero/LypHero";
import WizardLayout from "./Wizard/WizardLayout";

// CSS 
import "../../styles/LYP/lypMain.css";
import LypPromises from "./Promises/LypPromises";
import LypHowItWorks from "./HowItWorks/LypHowItWorks";
import LypCalculator from "./Calculator/LypCalculator";

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

      <LypPromises/>
      
      {/* HowItWorks */}

      <LypHowItWorks/>

      {/* Calculator */}
      <LypCalculator/>

    </div>
  );
};

export default LypMain;