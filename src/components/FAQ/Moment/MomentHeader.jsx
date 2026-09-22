// src/components/FAQ/Moment/MomentHeader.jsx
// Moment Header (C2) per Section C2 & Appendix B
import React from "react";
import SectionChips from "./SectionChips";

export default function MomentHeader({
  moment,
  activeSectionId,
  onSelectSection,
}) {
  if (!moment) return null;

  // Render title with the specific word(s) in italic gold
  const renderTitle = () => {
    if (!moment.italicWord) return moment.title;
    const parts = moment.title.split(moment.italicWord);
    if (parts.length < 2) return moment.title;

    return (
      <>
        {parts[0]}
        <em>{moment.italicWord}</em>
        {parts.slice(1).join(moment.italicWord)}
      </>
    );
  };

  return (
    <div className="mo-hd">
      <div className="mo-title-block">
        <span className="mo-k">{moment.kicker}</span>
        <h2 className="mo-h2">{renderTitle()}</h2>
        <p className="mo-sub">{moment.subline}</p>
      </div>

      {/* Section chips on the right when moment has multiple sections (C3) */}
      {moment.sections && moment.sections.length > 1 && (
        <SectionChips
          sections={moment.sections}
          activeSectionId={activeSectionId}
          onSelectSection={onSelectSection}
        />
      )}
    </div>
  );
}
