/**
 * House of Kaira - Seller Section Bar Component (Component C5)
 * Section 5.5 & Appendix A of Build Specification 1.0
 */

import React, { useRef, useEffect } from "react";
import { SELLER_CHAPTERS } from "../../data/seller/sellerRegistry";

export default function SellerSectionBar({ activeChapterId = "ways", onSelectChapter }) {
  const barInnerRef = useRef(null);
  const activeTabRef = useRef(null);

  // Auto-scroll active tab into view horizontally on smaller viewports
  useEffect(() => {
    if (activeTabRef.current && barInnerRef.current) {
      const tabEl = activeTabRef.current;
      const barEl = barInnerRef.current;
      const tabLeft = tabEl.offsetLeft;
      const tabWidth = tabEl.offsetWidth;
      const barScroll = barEl.scrollLeft;
      const barWidth = barEl.clientWidth;

      if (tabLeft < barScroll || tabLeft + tabWidth > barScroll + barWidth) {
        barEl.scrollTo({
          left: tabLeft - barWidth / 2 + tabWidth / 2,
          behavior: "smooth"
        });
      }
    }
  }, [activeChapterId]);

  return (
    <nav className="sg-bar" aria-label="Guidelines Chapters Navigation">
      <div className="sg-bar-inner" ref={barInnerRef}>
        {SELLER_CHAPTERS.map((ch) => {
          const isActive = ch.id === activeChapterId;

          return (
            <button
              key={ch.id}
              type="button"
              className={`sg-bar-tab ${isActive ? "on" : ""}`}
              onClick={() => onSelectChapter && onSelectChapter(ch.id)}
              ref={isActive ? activeTabRef : null}
              aria-current={isActive ? "true" : undefined}
            >
              {ch.barLabel}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
