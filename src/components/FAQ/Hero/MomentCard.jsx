// src/components/FAQ/Hero/MomentCard.jsx
// Individual Moment Card component (B9, B10, Appendix E)
import React from "react";
import { ArchIcon } from "../common/FaqIcons";
import AppliesToDot from "../common/AppliesToDot";

export default function MomentCard({
  moment,
  isSelected,
  index,
  onSelectMoment,
}) {
  const handleClick = () => {
    onSelectMoment(moment.id);
  };

  const delayClass = `c-delay-${index + 1}`;

  return (
    <button
      type="button"
      className={`ch-card ${delayClass}`}
      data-m={moment.id}
      aria-pressed={isSelected}
      onClick={handleClick}
      style={{
        background: moment.bgGradient,
      }}
    >
      {/* Arch Drawing (Appendix E) */}
      <ArchIcon />

      {/* Applies-to tag */}
      {moment.appliesToLabel && (
        <span className="for" aria-hidden="true">
          <AppliesToDot type={moment.appliesTo} />
          <span>{moment.appliesToLabel}</span>
        </span>
      )}

      {/* Card title */}
      <span className="t">{moment.cardTitle}</span>

      {/* Answer count */}
      <span className="n">{moment.answerCount} answers</span>
    </button>
  );
}
