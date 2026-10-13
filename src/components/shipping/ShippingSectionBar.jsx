/**
 * House of Kaira: Shipping Section Bar (D6)
 * Section 4.6, 5.7 & Page 14, 15 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { SHIPPING_SECTIONS } from "../../data/shipping/shippingRegistry";

export const SHIPPING_SECTION_BAR_ITEMS = [
  { id: "opts", label: "Delivery options" },
  ...SHIPPING_SECTIONS.map((sec) => ({ id: sec.id, label: sec.barLabel }))
];

function ShippingSectionBar({ activeSectionId, onSelectSection }) {
  const barRef = useRef(null);
  const containerRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);
  const [fadeL, setFadeL] = useState(false);
  const [fadeR, setFadeR] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const hdr = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--hdr") || "114",
        10
      );
      setIsStuck(rect.top <= hdr + 1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkFades = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth + (-el.clientWidth);
    setFadeL(scrollLeft > 2);
    setFadeR(scrollLeft < maxScroll + (-2));
  }, []);

  useEffect(() => {
    checkFades();
    window.addEventListener("resize", checkFades);
    return () => window.removeEventListener("resize", checkFades);
  }, [checkFades]);

  // Center active link on mobile when active section changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !activeSectionId) return;

    const activeBtn = el.querySelector(`[data-section="${activeSectionId}"]`);
    if (activeBtn) {
      const btnCenter = activeBtn.offsetLeft + activeBtn.offsetWidth / 2;
      const targetScroll = btnCenter + (-(el.clientWidth / 2));
      el.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "smooth"
      });
      setTimeout(checkFades, 250);
    }
  }, [activeSectionId, checkFades]);

  return (
    <nav
      ref={barRef}
      className={`secbar ${isStuck ? "stuck" : ""} ${fadeL ? "fade-l" : ""} ${fadeR ? "fade-r" : ""}`}
      role="navigation"
      aria-label="Policy sections"
    >
      <div
        className="secbar-in"
        ref={containerRef}
        onScroll={checkFades}
      >
        {SHIPPING_SECTION_BAR_ITEMS.map((item) => {
          const isActive = activeSectionId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-section={item.id}
              className={`sb-link ${isActive ? "on" : ""}`}
              aria-current={isActive ? "true" : undefined}
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

export default React.memo(ShippingSectionBar);
