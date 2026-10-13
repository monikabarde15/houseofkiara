// src/components/pricing/PricingSectionBar.jsx
// Sticky Section Bar with Pinned Side Switch (D6) matching Pages 17-19 & 35 of hok_pricing_fees_v4

import React, { useRef, useEffect, useState, useCallback } from "react";
import { PRICING_SECTION_BAR_ITEMS } from "../../data/pricing/pricingRegistry";

function PricingSectionBar({ activeSide, activeSectionId, onSideChange, onSelectSection }) {
  const scrollRef = useRef(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const links = PRICING_SECTION_BAR_ITEMS[activeSide] || [];

  // Update edge fades based on scroll position
  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const canScrollLeft = el.scrollLeft > 4;
    const canScrollRight = el.scrollLeft < el.scrollWidth + (-el.clientWidth) + (-4);

    setFadeLeft(canScrollLeft);
    setFadeRight(canScrollRight);
  }, []);

  // Center the active link within the visible area
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !activeSectionId) return;

    const activeEl = container.querySelector(`.sb-link[data-id="${activeSectionId}"]`);
    if (!activeEl) return;

    const containerWidth = container.clientWidth;
    const activeLeft = activeEl.offsetLeft;
    const activeWidth = activeEl.offsetWidth;

    // Offset account for pinned switch on narrower screens
    const switchEl = container.querySelector(".sb-side");
    const switchWidth = switchEl ? switchEl.offsetWidth + 16 : 0;

    const targetScroll = activeLeft + (-switchWidth) + (-((containerWidth + (-switchWidth) + (-activeWidth)) / 2));

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });

    updateFades();
  }, [activeSectionId, activeSide, updateFades]);

  // Mount and resize listeners
  useEffect(() => {
    updateFades();
    const handleResize = () => updateFades();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateFades, activeSide]);

  return (
    <nav
      className={`secbar ${fadeLeft ? "fade-l" : ""} ${fadeRight ? "fade-r" : ""}`}
      aria-label="Section navigation"
    >
      <div
        ref={scrollRef}
        className="secbar-in"
        onScroll={updateFades}
      >
        {/* Pinned Side Switch */}
        <div className="sb-side" role="group" aria-label="Perspective switch">
          <button
            type="button"
            className="sb-sw"
            aria-pressed={activeSide === "pay"}
            title="What you pay"
            onClick={() => onSideChange("pay")}
          >
            You pay
          </button>
          <button
            type="button"
            className="sb-sw"
            aria-pressed={activeSide === "earn"}
            title="What you earn"
            onClick={() => onSideChange("earn")}
          >
            You earn
          </button>
        </div>

        {/* Section Links */}
        {links.map((item) => {
          const isActive = activeSectionId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-id={item.id}
              className={`sb-link ${isActive ? "on" : ""}`}
              aria-current={isActive ? "true" : undefined}
              title={item.tooltip}
              onClick={() => onSelectSection(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default React.memo(PricingSectionBar);
