import React from "react";

import commitmentData from "../../../data/home/commitmentData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const DesktopCommitment = () => {
  return (
    <section className="desk-commitment">
      <div className="desk-commitment-layout">
        {/* LEFT SIDE */}
        <div className="desk-commitment-content">
          <SectionEyebrow
            text={commitmentData.eyebrow}
          />

          <SectionTitle>
            {commitmentData.title.normal}{" "}
            <em>{commitmentData.title.accent}</em>
          </SectionTitle>

          <p className="desk-commitment-description">
            {commitmentData.description}
          </p>

          <div className="desk-commitment-pills">
            {commitmentData.servicePills.map((pill) => (
              <div
                key={pill}
                className="desk-commitment-pill"
              >
                <span className="desk-commitment-pill-dot" />
                {pill}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="desk-commitment-grid">
          {commitmentData.valueCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                className="desk-commitment-card"
              >
                <div className="desk-commitment-icon-circle">
                  <Icon />
                </div>

                <h3 className="desk-commitment-card-title">
                  {card.headline}
                </h3>

                <p className="desk-commitment-card-body">
                  {card.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DesktopCommitment;