// src/components/FAQ/Hero/MomentCards.jsx
// 6 Moment Cards Row (B8, B9, B13)
import React from "react";
import MomentCard from "./MomentCard";
import { FAQ_MOMENTS } from "../../../data/faq/faqRegistry";

export default function MomentCards({ selectedMomentId, onSelectMoment }) {
  // Only display the 6 visible cards (filter out the hidden account-only moment)
  const visibleMoments = FAQ_MOMENTS.filter((m) => !m.isAccountOnly);

  return (
    <div className="ch-cards-section">
      <p className="ch-lede enter e4">Or choose where you are</p>
      <div
        className="ch-cards enter"
        role="region"
        aria-label="Where you are"
      >
        {visibleMoments.map((moment, index) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            index={index}
            isSelected={selectedMomentId === moment.id}
            onSelectMoment={onSelectMoment}
          />
        ))}
      </div>
    </div>
  );
}
