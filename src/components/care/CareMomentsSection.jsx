/**
 * House of Kaira - Care Policy "Your piece, moment by moment" (Component C7)
 * Sections 5.7, 6.2, 7.5, 9 of Build Specification 2.0
 */

import React, { useRef, useEffect } from "react";
import CareNotesList from "./CareNotesList";
import { MOMENT_TABS } from "../../data/care/careRegistry";

export default function CareMomentsSection({
  activeMomentTab,
  onMomentTabChange,
  renderQuestions
}) {
  const scrollContainerRef = useRef(null);
  const tabRefs = useRef({});

  const currentMoment = MOMENT_TABS.find((m) => m.id === activeMomentTab) || MOMENT_TABS[0];

  // Auto-scroll selected tab to center on mobile (Section 6.2)
  useEffect(() => {
    const activeEl = tabRefs.current[activeMomentTab];
    if (activeEl && scrollContainerRef.current) {
      const isMobile = window.innerWidth <= 760;
      if (isMobile) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    }
  }, [activeMomentTab]);

  // Arrow key navigation with wrapping (Section 6.2 & 9)
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % MOMENT_TABS.length;
      const nextTab = MOMENT_TABS[nextIndex];
      onMomentTabChange(nextTab.id);
      tabRefs.current[nextTab.id]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + MOMENT_TABS.length) % MOMENT_TABS.length;
      const prevTab = MOMENT_TABS[prevIndex];
      onMomentTabChange(prevTab.id);
      tabRefs.current[prevTab.id]?.focus();
    }
  };

  // Helper to render gold italic in heading
  const renderMomentHeading = (tab) => {
    switch (tab.id) {
      case "arrives":
        return <>When your piece <em>arrives</em></>;
      case "ready":
        return <>Getting <em>ready</em></>;
      case "celebration":
        return <>At the <em>celebration</em></>;
      case "after":
        return <>After the <em>celebration</em></>;
      case "sending":
        return <>Sending it <em>back</em></>;
      default:
        return tab.heading;
    }
  };

  return (
    <section className="mod" id="mod-moments" aria-labelledby="moments-title">
      <div className="mod-hd">
        <h2 id="moments-title">
          Your piece, <em>moment by moment</em>
        </h2>
        <p>
          From the day it arrives to the day it travels home, here is how to keep it at its most beautiful.
        </p>
      </div>

      <div className="mo-scroll" ref={scrollContainerRef}>
        <ol className="mo-rail" role="tablist" aria-label="Moments">
          {MOMENT_TABS.map((tab, idx) => {
            const isSelected = tab.id === activeMomentTab;
            return (
              <li key={tab.id} role="presentation">
                <button
                  ref={(el) => (tabRefs.current[tab.id] = el)}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  className="mo-tab"
                  onClick={() => onMomentTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                >
                  <div className="mo-n" aria-hidden="true">
                    {tab.num}
                  </div>
                  <span className="mo-l">{tab.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div
        className="mo-panel swap"
        key={currentMoment.id}
        role="tabpanel"
        id={`panel-${currentMoment.id}`}
        aria-labelledby={`tab-${currentMoment.id}`}
      >
        {/* Left Column: Heading, subtitle, and Care Notes */}
        <div className="mo-notes">
          <h3>{renderMomentHeading(currentMoment)}</h3>
          <p>{currentMoment.subheading}</p>
          <CareNotesList notes={currentMoment.notes} />
        </div>

        {/* Right Column: Questions at this moment */}
        <div className="mo-qs">
          <h4 className="q-lbl">Questions at this moment</h4>
          {renderQuestions && renderQuestions(currentMoment.questionIds)}
        </div>
      </div>
    </section>
  );
}
