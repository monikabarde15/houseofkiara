// src/components/FAQ/Moment/MomentSection.jsx
// Band 2: Open Moment container (C1-C6)
import React from "react";
import MomentHeader from "./MomentHeader";
import CareNote from "./CareNote";
import RentalDateCalculator from "./RentalDateCalculator";

export default function MomentSection({
  moment,
  activeSectionId,
  onSelectSection,
  onSelectQuestion,
  children,
}) {
  if (!moment) return null;

  // Care note condition (Section C4):
  // Shown only in "While I'm wearing it" (wear) and "Wear & damage" section of "Sending it back" (back)
  const showCareNote =
    moment.id === "wear" ||
    (moment.id === "back" && activeSectionId === "wear-damage");

  // Dated rental strip condition (Section C5):
  // Shown only in the "Rental dates" section of "Before I book" (before)
  const showRentalCalculator =
    moment.id === "before" && activeSectionId === "rental-dates";

  return (
    <section
      id="moment-section"
      className="mo"
      aria-label={`${moment.title} details`}
    >
      <MomentHeader
        moment={moment}
        activeSectionId={activeSectionId}
        onSelectSection={onSelectSection}
      />

      {/* Care Note (C4) */}
      {showCareNote && <CareNote onSelectQuestion={onSelectQuestion} />}

      {/* Dated Rental Strip & Calculator (C5, C6) */}
      {showRentalCalculator && <RentalDateCalculator />}

      {/* Questions & Reading Pane slot */}
      {children}
    </section>
  );
}
