import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import howItWorksData from "../../../data/home/howItWorksData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";
import { resolveHowItWorksIcon } from "../../../utils/howItWorksIcons";

const MobileHowItWorks = ({ data }) => {
  const initialOpen = data?.open ? data.open.toLowerCase() : "shop";
  const [activeTab, setActiveTab] = useState(initialOpen);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.open) {
      setActiveTab(data.open.toLowerCase());
    }
  }, [data?.open]);

  const eyebrow = data?.eyebrow || howItWorksData.eyebrow;
  const heading =
    data?.heading || howItWorksData.title || "How House of Kaira *works*";
  const tabA = data?.tabA || data?.tabs?.shop || howItWorksData.tabs.shop;
  const tabB = data?.tabB || data?.tabs?.sell || howItWorksData.tabs.sell;

  const shopSteps =
    data?.shop && Array.isArray(data.shop) && data.shop.length > 0
      ? data.shop.map((step, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          icon: resolveHowItWorksIcon(step.ico),
          title: step.t,
          description: step.d,
        }))
      : howItWorksData.shopSteps;

  const sellSteps =
    data?.sell && Array.isArray(data.sell) && data.sell.length > 0
      ? data.sell.map((step, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          icon: resolveHowItWorksIcon(step.ico),
          title: step.t,
          description: step.d,
        }))
      : howItWorksData.sellSteps;

  const steps = activeTab === "shop" ? shopSteps : sellSteps;

  const sellCard = data?.sellCard || howItWorksData.sellCta;
  const headText =
    sellCard?.head ||
    sellCard?.text ||
    "The hours of *craftsmanship* on that piece deserve more than a dark wardrobe shelf.";
  const bodyText =
    sellCard?.body ||
    "Give your occasion wear another life. Let someone else fall in love with it — and earn while you do.";
  const quoteText =
    sellCard?.quote || '"Every piece has a story. Don\'t let it end with you."';
  const ctaLabel =
    sellCard?.cta?.lbl ||
    (sellCard?.buttonText ? `${sellCard.buttonText} →` : "List Your Piece →");
  const ctaUrl = sellCard?.cta?.url || "/list-your-piece";

  const handleListYourPiece = () => {
    navigate(ctaUrl);
  };

  return (
    <section className="mobile-hiw">
      <SectionEyebrow text={eyebrow} />

      <SectionTitle>{renderHeadline(heading, "em")}</SectionTitle>

      <div className="mobile-hiw-toggle">
        <button
          className={`mobile-hiw-toggle-btn ${
            activeTab === "shop" ? "mobile-hiw-toggle-btn-active" : ""
          }`}
          onClick={() => setActiveTab("shop")}
        >
          {tabA}
        </button>

        <button
          className={`mobile-hiw-toggle-btn ${
            activeTab === "sell" ? "mobile-hiw-toggle-btn-active" : ""
          }`}
          onClick={() => setActiveTab("sell")}
        >
          {tabB}
        </button>
      </div>

      <div className="mobile-hiw-steps">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article key={step.number} className="mobile-hiw-step">
              <div className="mobile-hiw-step-number">{step.number}</div>

              <div className="mobile-hiw-step-body">
                <div className="mobile-hiw-step-icon-circle">
                  <Icon className="mobile-hiw-step-icon" />
                </div>

                <h3 className="mobile-hiw-step-title">{step.title}</h3>

                <p className="mobile-hiw-step-description">
                  {step.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {activeTab === "sell" && sellCard?.on !== false && (
        <article className="mobile-hiw-sell-cta">
          <h3 className="mobile-hiw-sell-title">
            {renderHeadline(headText, "em")}
          </h3>

          <p className="mobile-hiw-sell-body">{bodyText}</p>

          <p className="mobile-hiw-sell-quote">{quoteText}</p>

          <button className="mobile-hiw-sell-btn" onClick={handleListYourPiece}>
            {ctaLabel}
          </button>
        </article>
      )}
    </section>
  );
};

export default MobileHowItWorks;
