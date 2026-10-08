import React from "react";
import { useNavigate } from "react-router-dom";

import commitmentData from "../../../data/home/commitmentData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";
import { resolveCommitmentIcon } from "../../../utils/commitmentIcons";

const MobileCommitment = ({ data }) => {
  const navigate = useNavigate();

  const eyebrow = data?.eyebrow || commitmentData.eyebrow;
  const heading = data?.heading || `${commitmentData.title.normal} *${commitmentData.title.accent}*`;
  const body = data?.bodyMob || data?.body || commitmentData.description;

  const rawPills = data?.pills && data.pills.length > 0
    ? data.pills
    : commitmentData.servicePills.map((pill, idx) => ({
        id: `pill-${idx + 1}`,
        l: pill,
        u: "",
        on: true,
      }));

  const pills = rawPills.filter((p) => p && p.on !== false);

  const rawCards = data?.cards && data.cards.length > 0
    ? data.cards
    : commitmentData.valueCards.map((c) => ({
        id: c.id,
        ico: c.icon,
        mob: true,
        h: c.headline,
        d: c.body,
      }));

  // Mobile/App filter: show cards marked for mobile (mob !== false)
  const mobileCards = rawCards.filter((c) => c.mob !== false);
  const cards = mobileCards.length > 0 ? mobileCards : rawCards;

  const handlePillClick = (pill) => {
    if (pill.u && pill.u.trim()) {
      navigate(pill.u.trim());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="mobile-commitment">
      <SectionEyebrow text={eyebrow} />

      <SectionTitle>
        {renderHeadline(heading, "em")}
      </SectionTitle>

      <p className="mobile-commitment-description">
        {body}
      </p>

      <div className="mobile-commitment-pills">
        {pills.map((pill) => (
          <div
            key={pill.id || pill.l}
            className="mobile-commitment-pill"
            onClick={() => handlePillClick(pill)}
            style={{ cursor: pill.u ? "pointer" : "default" }}
          >
            <span className="mobile-commitment-pill-dot" />
            {pill.l}
          </div>
        ))}
      </div>

      <div className="mobile-commitment-cards">
        {cards.map((card) => {
          const Icon = resolveCommitmentIcon(card.ico || card.icon);

          return (
            <article key={card.id} className="mobile-commitment-card">
              <div className="mobile-commitment-icon-circle">
                <Icon />
              </div>

              <h3 className="mobile-commitment-card-title">{card.h || card.headline}</h3>

              <p className="mobile-commitment-card-body">{card.d || card.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MobileCommitment;
