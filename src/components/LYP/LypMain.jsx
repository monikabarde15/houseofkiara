import React from "react";

// Components
import LypBreadcrumb from "./Breadcrumb/LypBreadcrumb";
import LypHero from "../LYP/hero/LypHero";
import WizardLayout from "./Wizard/WizardLayout";

// CSS 
import "../../styles/LYP/lypMain.css";
import LypPromises from "./Promises/LypPromises";
import LypHowItWorks from "./HowItWorks/LypHowItWorks";
import LypCalculator from "./Calculator/LypCalculator";

const LypMain = () => {

  const [step, setStep] = React.useState(1);
  const [submitted, setSubmitted] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 960);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lyp-main">

      <LypBreadcrumb />
      {(!isMobile || (isMobile && step === 1 && !submitted)) && (
        <LypHero />
      )}

      <WizardLayout
        step={step}
        setStep={setStep}
        submitted={submitted}
        setSubmitted={setSubmitted}
      />

      {(!isMobile || (isMobile && step === 1 && !submitted)) && (
        <>
          <LypPromises />
          <LypHowItWorks />
          <LypCalculator />
        </>
      )}

    </div>
  );
};

export default LypMain;