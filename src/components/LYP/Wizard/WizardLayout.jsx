import React, { useState } from "react";
import "../../../styles/LYP/wizard/wizardLayout.css";

import Step1 from "./FormPanels/Step1";
import Step2 from "./FormPanels/Step2";
import Step3 from "./FormPanels/Step3";
import Step4 from "./FormPanels/Step4";
import SuccessPanel from "./SuccessPanel";

// SIDEBAR

import Timeline from "./Sidebar/Timeline";
import CommissionCard from "./Sidebar/CommissionCard";
import Testimonial from "./Sidebar/Testimonial";
import FAQ from "./Sidebar/FAQ";

const WizardLayout = ({ step, setStep, submitted, setSubmitted }) => {

  
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    email: "",
    mobile: "",
    piece_type: "",
    designer: "",
    color: "",
    size: "",
    original_price: "",
    condition: "",
    outcome: ""
  });

  const [photos, setPhotos] = useState([]);
  


  const steps = [
    { id: 1, label: "Your Details" },
    { id: 2, label: "About the Piece" },
    { id: 3, label: "Photos" },
    { id: 4, label: "Review & Submit" },
  ];

  const goToStep = (targetStep) => {
    if (targetStep === step) return;       // no-op
    if (targetStep > step) return;         // locked → block

    setStep(targetStep);                   // allow backward
  };


 

  return (
    <section id="progWrap" className={`lyp-wizard ${submitted ? "submitted" : ""}`}>

      {/* ================= GRID ================= */}
      <div className="lyp-wizard__grid">

        {/* LEFT */}
        <div className="lyp-wizard__left">

          {/* ================= STEP TABS ================= */}
          <div className="lyp-wizard-header">

            <div className="lyp-wizard-tabs">
              {steps.map((s) => {
                const isActive = !submitted && step === s.id;
                const isDone = submitted || step > s.id;
                const isLocked = !submitted && step < s.id;

                return (
                  <div
                    key={s.id}
                    className={`lyp-tab-item 
                  ${isActive ? "active" : ""} 
                  ${isDone ? "done" : ""} 
                  ${isLocked ? "locked" : ""}
                `}

                    onClick={() => goToStep(s.id)} // Go back on step click
                  >
                    <div className="lyp-tab-left">
                      <div className="lyp-tab-circle">
                        {isDone ? "✓" : s.id}
                      </div>

                      <div className="lyp-tab-text">
                        <div className="lyp-tab-step">STEP {s.id}</div>
                        <div className="lyp-tab-label">{s.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lyp-tab-line">
              <div
                className="lyp-tab-line-fill"
                style={{
                  width: `${submitted
                    ? 100
                    : ((step - 1) / (steps.length - 1)) * 100}%`
                }}
              />
            </div>

          </div>

          {/* PANEL */}
          <div className="lyp-wizard__panel">

            {!submitted ? (
              <>
                {step === 1 && (
                  <Step1
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => setStep(2)}
                  />
                )}

                {step === 2 && (
                  <Step2
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}

                {step === 3 && (
                  <Step3
                    photos={photos}
                    setPhotos={setPhotos}
                    onNext={() => setStep(4)}
                    onBack={() => setStep(2)}
                  />
                )}

                {step === 4 && (
                  <Step4
                    formData={formData}
                    photos={photos}
                    setStep={setStep}
                    onBack={() => setStep(3)}
                    setSubmitted={setSubmitted}
                  />
                )}
              </>
            ) : (
              <SuccessPanel />
            )}

          </div>
        </div>

        {/* RIGHT SIDEBAR*/}
        <div className="lyp-wizard__right">
          <div className="lyp-sidebar">

            

              {/* Block 1 — Timeline */}
              <Timeline submitted={submitted} />

              {/* Block 2 — Commission */}
              <CommissionCard />

              {/* Block 3 — Testimonial */}
              <Testimonial />

              {/* Block 4 — FAQ */}
              <FAQ />
            </div>

          
        </div>

      </div>

    </section>
  );
};

export default WizardLayout;