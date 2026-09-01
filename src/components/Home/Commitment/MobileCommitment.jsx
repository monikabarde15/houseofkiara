import React from "react";

import commitmentData from "../../../data/home/commitmentData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const MobileCommitment = () => {
  return (
    <section className="mobile-commitment">
      <SectionEyebrow
        text={commitmentData.eyebrow}
      />

      <SectionTitle>
        {commitmentData.title.normal}{" "}
        <em>{commitmentData.title.accent}</em>
      </SectionTitle>

      <p className="mobile-commitment-description">
        {commitmentData.description}
      </p>

      <div className="mobile-commitment-pills">
        {commitmentData.servicePills.map((pill) => (
          <div
            key={pill}
            className="mobile-commitment-pill"
          >
            <span className="mobile-commitment-pill-dot" />
            {pill}
          </div>
        ))}
      </div>

      <div className="mobile-commitment-cards">
        {commitmentData.valueCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.id}
              className="mobile-commitment-card"
            >
              <div className="mobile-commitment-icon-circle">
                <Icon />
              </div>

              <h3 className="mobile-commitment-card-title">
                {card.headline}
              </h3>

              <p className="mobile-commitment-card-body">
                {card.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MobileCommitment;