import React, { useState } from "react";

import howItWorksData from "../../../data/home/howItWorksData";
import HowStepCard from "./HowStepCard";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import HowSellCtaCard from "./HowSellCtaCard";

const DesktopHowItWorks = () => {
    const [activeTab, setActiveTab] = useState("shop");

    return (
        <section className="desk-how-it-works">
            <div className="desk-how-header">
                <div className="desk-how-header-left">
                    <SectionEyebrow text={howItWorksData.eyebrow} />

                    <SectionTitle>
                        How House of Kaira <em>works</em>
                    </SectionTitle>
                </div>

                <div className="desk-how-toggle">
                    <button
                        type="button"
                        className={`desk-how-toggle-btn ${activeTab === "shop" ? "active" : ""
                            }`}
                        onClick={() => setActiveTab("shop")}
                    >
                        {howItWorksData.tabs.shop}
                    </button>

                    <button
                        type="button"
                        className={`desk-how-toggle-btn ${activeTab === "sell" ? "active" : ""
                            }`}
                        onClick={() => setActiveTab("sell")}
                    >
                        {howItWorksData.tabs.sell}
                    </button>
                </div>
            </div>

            {activeTab === "shop" ? (
                <div className="desk-how-grid desk-how-grid-shop">
                    {howItWorksData.shopSteps.map((step) => (
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
                    {howItWorksData.sellSteps.map((step) => (
                        <HowStepCard
                            key={step.number}
                            number={step.number}
                            icon={step.icon}
                            title={step.title}
                            description={step.description}
                        />
                    ))}

                        <HowSellCtaCard
                            data={howItWorksData.sellCta}
                        />
                </div>
            )}
        </section>
    );
};

export default DesktopHowItWorks;