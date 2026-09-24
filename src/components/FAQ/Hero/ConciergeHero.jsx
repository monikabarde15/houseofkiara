// src/components/FAQ/Hero/ConciergeHero.jsx
// Band 1: Concierge Hero container (B1-B13)
import React from "react";
import GreetingHeadline from "./GreetingHeadline";
import SearchBox from "./SearchBox";
import PopularQuestions from "./PopularQuestions";
import MomentCards from "./MomentCards";
import HygienePromise from "./HygienePromise";
import AccountLink from "./AccountLink";

export default function ConciergeHero({
  selectedMomentId,
  onSelectMoment,
  onSelectQuestion,
  onShowToast,
}) {
  return (
    <section className="ch-hero" aria-label="FAQ Concierge Hero">
      <GreetingHeadline />
      <SearchBox
        onSelectQuestion={onSelectQuestion}
        onShowToast={onShowToast}
      />
      <PopularQuestions onSelectQuestion={onSelectQuestion} />
      <MomentCards
        selectedMomentId={selectedMomentId}
        onSelectMoment={onSelectMoment}
      />
      <HygienePromise onSelectQuestion={onSelectQuestion} />
      <AccountLink onSelectMoment={onSelectMoment} />
    </section>
  );
}
