import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import howItWorksData from "../../../data/home/howItWorksData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const MobileHowItWorks = () => {
  const [activeTab, setActiveTab] = useState("shop");
  const navigate = useNavigate();

  const steps =
    activeTab === "shop"
      ? howItWorksData.shopSteps
      : howItWorksData.sellSteps;

  
  const handleListYourPiece = () => {
    navigate("/list-your-piece")
  }

  return (
    <section className="mobile-hiw">
      <SectionEyebrow
        text={howItWorksData.eyebrow}
      />

      <SectionTitle>
        How House of Kaira <em>works</em>
      </SectionTitle>

      <div className="mobile-hiw-toggle">
        <button
          className={`mobile-hiw-toggle-btn ${
            activeTab === "shop"
              ? "mobile-hiw-toggle-btn-active"
              : ""
          }`}
          onClick={() => setActiveTab("shop")}
        >
          {howItWorksData.tabs.shop}
        </button>

        <button
          className={`mobile-hiw-toggle-btn ${
            activeTab === "sell"
              ? "mobile-hiw-toggle-btn-active"
              : ""
          }`}
          onClick={() => setActiveTab("sell")}
        >
          {howItWorksData.tabs.sell}
        </button>
      </div>

      <div className="mobile-hiw-steps">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.number}
              className="mobile-hiw-step"
            >
              <div className="mobile-hiw-step-number">
                {step.number}
              </div>

              <div className="mobile-hiw-step-body">
                <div className="mobile-hiw-step-icon-circle">
                  <Icon className="mobile-hiw-step-icon" />
                </div>

                <h3 className="mobile-hiw-step-title">
                  {step.title}
                </h3>

                <p className="mobile-hiw-step-description">
                  {step.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {activeTab === "sell" && (
        <article className="mobile-hiw-sell-cta">
          <h3 className="mobile-hiw-sell-title">
            The hours of <em>craftsmanship</em> on that
            piece deserve more than a dark wardrobe
            shelf.
          </h3>

          <p className="mobile-hiw-sell-body">
            Give your occasion wear another life. Let
            someone else fall in love with it — and earn
            while you do.
          </p>

          <p className="mobile-hiw-sell-quote">
            "Every piece has a story. Don't let it end
            with you."
          </p>

          <button className="mobile-hiw-sell-btn"
          onClick={handleListYourPiece}
          >
            List Your Piece →
          </button>
        </article>
      )}
    </section>
  );
};

export default MobileHowItWorks;