import React from "react";
import { useNavigate } from "react-router-dom";

import commitmentData from "../../../data/home/commitmentData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";
import { resolveCommitmentIcon } from "../../../utils/commitmentIcons";

const DesktopCommitment = ({ data }) => {
  const navigate = useNavigate();

  const eyebrow = data?.eyebrow || commitmentData.eyebrow;
  const heading = data?.heading || `${commitmentData.title.normal} *${commitmentData.title.accent}*`;
  const body = data?.body || commitmentData.description;

  const rawPills = data?.pills && data.pills.length > 0
    ? data.pills
    : commitmentData.servicePills.map((pill, idx) => ({
        id: `pill-${idx + 1}`,
        l: pill,
        u: "",
        on: true,
      }));

  const pills = rawPills.filter((p) => p && p.on !== false);

  const cards = data?.cards && data.cards.length > 0
    ? data.cards
    : commitmentData.valueCards.map((c) => ({
        id: c.id,
        ico: c.icon,
        h: c.headline,
        d: c.body,
      }));

  const handlePillClick = (pill) => {
    if (pill.u && pill.u.trim()) {
      navigate(pill.u.trim());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="desk-commitment">
      <div className="desk-commitment-layout">
        {/* LEFT SIDE */}
        <div className="desk-commitment-content">
          <SectionEyebrow text={eyebrow} />

          <SectionTitle>
            {renderHeadline(heading, "em")}
          </SectionTitle>

          <p className="desk-commitment-description">
            {body}
          </p>

          <div className="desk-commitment-pills">
            {pills.map((pill) => (
              <div
                key={pill.id || pill.l}
                className="desk-commitment-pill"
                onClick={() => handlePillClick(pill)}
                style={{ cursor: pill.u ? "pointer" : "default" }}
              >
                <span className="desk-commitment-pill-dot" />
                {pill.l}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="desk-commitment-grid">
          {cards.map((card) => {
            const Icon = resolveCommitmentIcon(card.ico || card.icon);

            return (
              <article key={card.id} className="desk-commitment-card">
                <div className="desk-commitment-icon-circle">
                  <Icon />
                </div>

                <h3 className="desk-commitment-card-title">{card.h || card.headline}</h3>

                <p className="desk-commitment-card-body">{card.d || card.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DesktopCommitment;
