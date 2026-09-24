// src/components/FAQ/Moment/SectionChips.jsx
// Section chips pill row (C3) per Section C3
import React from "react";

export default function SectionChips({
  sections,
  activeSectionId,
  onSelectSection,
}) {
  return (
    <nav className="mo-chips" aria-label="Narrow this moment">
      {sections.map((sec) => {
        const isActive = sec.id === activeSectionId;
        return (
          <button
            key={sec.id}
            type="button"
            className="mo-chip"
            aria-pressed={isActive}
            onClick={() => onSelectSection(sec.id)}
          >
            <span>{sec.title}</span>
            <b>{sec.count || (sec.questions ? sec.questions.length : 0)}</b>
          </button>
        );
      })}
    </nav>
  );
}
