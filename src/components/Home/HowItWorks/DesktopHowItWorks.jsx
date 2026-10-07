import React, { useState, useEffect } from "react";

import howItWorksData from "../../../data/home/howItWorksData";
import HowStepCard from "./HowStepCard";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import HowSellCtaCard from "./HowSellCtaCard";
import { renderHeadline } from "../../../utils/headlineParser";
import { resolveHowItWorksIcon } from "../../../utils/howItWorksIcons";

const DesktopHowItWorks = ({ data }) => {
  const initialOpen = data?.open ? data.open.toLowerCase() : "shop";
  const [activeTab, setActiveTab] = useState(initialOpen);

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

  const sellCard = data?.sellCard || howItWorksData.sellCta;

  return (
    <section className="desk-how-it-works">
      <div className="desk-how-header">
        <div className="desk-how-header-left">
          <SectionEyebrow text={eyebrow} />

          <SectionTitle>{renderHeadline(heading, "em")}</SectionTitle>
        </div>

        <div className="desk-how-toggle">
          <button
            type="button"
            className={`desk-how-toggle-btn ${
              activeTab === "shop" ? "active" : ""
            }`}
            onClick={() => setActiveTab("shop")}
          >
            {tabA}
          </button>

          <button
            type="button"
            className={`desk-how-toggle-btn ${
              activeTab === "sell" ? "active" : ""
            }`}
            onClick={() => setActiveTab("sell")}
          >
            {tabB}
          </button>
        </div>
      </div>

      {activeTab === "shop" ? (
        <div className="desk-how-grid desk-how-grid-shop">
          {shopSteps.map((step) => (
            <HowStepCard
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      ) : (
        <div className="desk-how-grid desk-how-grid-sell">
          {sellSteps.map((step) => (
            <HowStepCard
              key={step.number}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}

          {sellCard?.on !== false && <HowSellCtaCard data={sellCard} />}
        </div>
      )}
    </section>
  );
};

export default DesktopHowItWorks;
