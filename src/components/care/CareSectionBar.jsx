/**
 * House of Kaira - Care Policy Sticky Section Bar (Component C6)
 * Sections 5.6, 6.6, 7.4, 9 of Build Specification 2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { SECTION_BAR_LINKS } from "../../data/care/careRegistry";

export default function CareSectionBar({ activeSection, onSectionClick }) {
  const [isStuck, setIsStuck] = useState(false);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  const barRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const buttonRefs = useRef({});

  // Update edge fade masks based on scroll position
  const updateFades = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth;
    if (!canScroll) {
      setFadeLeft(false);
      setFadeRight(false);
      return;
    }
    setFadeLeft(el.scrollLeft > 5);
    setFadeRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  // Scroll active button into view on mobile
  useEffect(() => {
    const activeBtn = buttonRefs.current[activeSection];
    if (activeBtn && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isMobile = window.innerWidth <= 760;
      if (isMobile) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    }
    updateFades();
  }, [activeSection]);

  // Track sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const headerOffset = window.innerWidth <= 760 ? 58 : 114;
      setIsStuck(rect.top <= headerOffset + 2);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateFades);
    updateFades();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateFades);
    };
  }, []);

  const fadeClass = `${fadeLeft ? "fade-l" : ""} ${fadeRight ? "fade-r" : ""}`.trim();

  return (
    <nav
      className={`secbar ${isStuck ? "stuck" : ""} ${fadeClass}`}
      ref={barRef}
      aria-label="Page sections"
    >
      <div
        className="secbar-in"
        ref={scrollContainerRef}
        onScroll={updateFades}
      >
        {SECTION_BAR_LINKS.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <button
              key={link.id}
              ref={(el) => (buttonRefs.current[link.id] = el)}
              type="button"
              className={`sb-link ${isActive ? "on" : ""}`}
              onClick={() => onSectionClick(link.id)}
              aria-current={isActive ? "true" : undefined}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
