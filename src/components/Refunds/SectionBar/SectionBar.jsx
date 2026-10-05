/**
 * Sticky Section Navigation Bar for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 06, 12.6, 12.10
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

export default function SectionBar({
  activeTab = "rental",
  sections = [],
  activeSectionId,
  onSelectTab,
  onSelectSection,
}) {
  const [isStuck, setIsStuck] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(70);

  const barRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);

  // Measure live header height accurately across desktop (112px) and mobile (58px)
  const updateHeaderHeight = useCallback(() => {
    const candidates = [
      document.querySelector(".hok-mobile-header"),
      document.querySelector(".hok-header-desktop"),
      document.querySelector("header"),
    ];

    for (const el of candidates) {
      if (
        el &&
        el.offsetHeight > 0 &&
        window.getComputedStyle(el).display !== "none"
      ) {
        setHeaderHeight(el.offsetHeight);
        return;
      }
    }

    // Fallback based on screen width
    if (typeof window !== "undefined" && window.innerWidth <= 767) {
      setHeaderHeight(58);
    } else {
      setHeaderHeight(112);
    }
  }, []);

  useEffect(() => {
    updateHeaderHeight();

    const desktopHeader = document.querySelector(".hok-header-desktop");
    const mobileHeader = document.querySelector(".hok-mobile-header");

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      if (desktopHeader) ro.observe(desktopHeader);
      if (mobileHeader) ro.observe(mobileHeader);
    }

    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      if (ro) ro.disconnect();
    };
  }, [updateHeaderHeight]);

  // Scroll listener for sticky state detection
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();
        // Bar is stuck when its top reaches within 1.5px of header bottom
        const stuck = rect.top <= headerHeight + 1.5;
        setIsStuck(stuck);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [headerHeight]);

  // Scroll the active section link to center horizontally on mobile / overflow
  useEffect(() => {
    if (!innerRef.current || !activeSectionId) return;
    const activeEl = innerRef.current.querySelector(
      `[data-sec-id="${activeSectionId}"]`
    );
    if (activeEl) {
      const container = innerRef.current;
      const leftOffset =
        activeEl.offsetLeft -
        container.offsetWidth / 2 +
        activeEl.offsetWidth / 2;
      container.scrollTo({ left: leftOffset, behavior: "smooth" });
    }
  }, [activeSectionId]);

  return (
    <nav
      ref={barRef}
      className={`secbar ${isStuck ? "stuck" : ""}`.trim()}
      style={{ top: `${headerHeight}px` }}
      aria-label="Policy sections"
    >
      <div className="secbar-in" ref={innerRef}>
        {/* Mini Policy Switch - Visible only once stuck */}
        <div className="sb-mode" role="group" aria-label="Choose a policy">
          <button
            type="button"
            aria-pressed={activeTab === "rental"}
            onClick={() => onSelectTab("rental")}
          >
            Rental
          </button>
          <button
            type="button"
            aria-pressed={activeTab === "preloved"}
            onClick={() => onSelectTab("preloved")}
          >
            Preloved
          </button>
        </div>

        {/* Section Links */}
        {sections.map((sec) => {
          const isActive = sec.id === activeSectionId;
          const cleanTooltip = sec.title.replace(/\*/g, "");
          return (
            <button
              key={sec.id}
              type="button"
              data-sec-id={sec.id}
              className={`sb-link ${isActive ? "on" : ""}`.trim()}
              aria-current={isActive ? "true" : undefined}
              title={cleanTooltip}
              onClick={() => onSelectSection(sec.id)}
            >
              {sec.barLabel}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
