/**
 * House of Kaira: Shipping & Delivery Policy Page Root
 * Front end build specification v2 (hok_shipping_policy_v3)
 */

import React, { useState, useEffect, useCallback } from "react";
import { SHIPPING_PAGE_CONFIG } from "../data/shipping/shippingSettings";
import { SHIPPING_SECTIONS } from "../data/shipping/shippingRegistry";
import {
  scrollToTarget,
  triggerJumpHighlight,
  getHeaderHeight,
  getSectionBarHeight
} from "../utils/shipping/shippingScroll";

import ShippingBreadcrumb from "../components/shipping/ShippingBreadcrumb";
import ShippingHero from "../components/shipping/ShippingHero";
import ShippingRentalWindowCard from "../components/shipping/ShippingRentalWindowCard";
import ShippingSectionBar, {
  SHIPPING_SECTION_BAR_ITEMS
} from "../components/shipping/ShippingSectionBar";
import ShippingIntro from "../components/shipping/ShippingIntro";
import ShippingWaysWeDeliver from "../components/shipping/ShippingWaysWeDeliver";
import ShippingSectionsList from "../components/shipping/ShippingSectionsList";
import ShippingRelatedPolicies from "../components/shipping/ShippingRelatedPolicies";
import ShippingClosingBand from "../components/shipping/ShippingClosingBand";
import ShippingPrintDocument from "../components/shipping/ShippingPrintDocument";
import FloatingWhatsApp from "../components/FAQ/common/FloatingWhatsApp";

// Styles
import "../styles/shipping/shipping-variables.css";
import "../styles/shipping/shipping-chrome.css";
import "../styles/shipping/shipping-hero.css";
import "../styles/shipping/shipping-rental-window.css";
import "../styles/shipping/shipping-section-bar.css";
import "../styles/shipping/shipping-intro.css";
import "../styles/shipping/shipping-ways.css";
import "../styles/shipping/shipping-sections.css";
import "../styles/shipping/shipping-related.css";
import "../styles/shipping/shipping-closing.css";
import "../styles/shipping/shipping-print.css";

export default function ShippingPolicyPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("opts");
  const [openQuestionIds, setOpenQuestionIds] = useState(() => new Set());

  useEffect(() => {
    document.title = SHIPPING_PAGE_CONFIG.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = SHIPPING_PAGE_CONFIG.meta_description;
  }, []);

  // Dynamically measure header height and update --hdr
  useEffect(() => {
    const updateHeaderHeight = () => {
      const desktopHeader = document.querySelector(".hok-header-desktop");
      const mobileHeader = document.querySelector(".hok-mobile-only");
      let h = 114;
      if (window.innerWidth <= 767 && mobileHeader) {
        h = mobileHeader.offsetHeight || 61;
      } else if (desktopHeader) {
        h = desktopHeader.offsetHeight || 114;
      }
      document.documentElement.style.setProperty("--hdr", `${h}px`);
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2200);
  }, []);

  const handleToggleQuestion = useCallback((id) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `#${id}`);
        }
      }
      return next;
    });
  }, []);

  const handleSelectQuestion = useCallback((target) => {
    if (!target) return;
    const cleanId = target.replace(/^#/, "");

    const isQuestion = SHIPPING_SECTIONS.some((sec) =>
      sec.questions.some((q) => q.id === cleanId)
    );

    if (isQuestion) {
      setOpenQuestionIds((prev) => new Set(prev).add(cleanId));
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${cleanId}`);
      }
    }

    setTimeout(() => {
      const el =
        document.getElementById(cleanId) ||
        document.querySelector(`[data-anchor="${cleanId}"]`);
      if (el) {
        scrollToTarget(cleanId);
        triggerJumpHighlight(el);
      }
    }, 50);
  }, []);

  const handleSelectSection = useCallback((sectionId) => {
    if (!sectionId) return;
    setActiveSectionId(sectionId);
    scrollToTarget(sectionId);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  }, []);

  // Hash deep-linking on initial mount and hashchange (Section 5.8)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const cleanId = hash.replace(/^#/, "");
      handleSelectQuestion(cleanId);
    };

    // Slight delay to ensure DOM is ready
    const timer = setTimeout(handleHash, 200);
    window.addEventListener("hashchange", handleHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
    };
  }, [handleSelectQuestion]);

  // Scroll spy (Section 5.7)
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = getHeaderHeight();
      const barHeight = getSectionBarHeight();
      const triggerLine = headerHeight + barHeight + 12 + 60;

      const sectionIds = SHIPPING_SECTION_BAR_ITEMS.map((item) => item.id);
      let currentActive = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            currentActive = id;
          }
        }
      }

      if (currentActive && currentActive !== activeSectionId) {
        setActiveSectionId(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSectionId]);

  return (
    <div className="sh-page" id="shipping-policy-page">
      <main id="sh-main">
        <ShippingBreadcrumb />
        <ShippingHero
          onSelectQuestion={handleSelectQuestion}
          onShowToast={showToast}
        />
        <ShippingRentalWindowCard onSelectQuestion={handleSelectQuestion} />

        <div className="sh-wrap">
          <ShippingSectionBar
            activeSectionId={activeSectionId}
            onSelectSection={handleSelectSection}
          />
          <div className="dp-body">
            <ShippingIntro />
            <ShippingWaysWeDeliver onSelectQuestion={handleSelectQuestion} />
            <ShippingSectionsList
              openQuestionIds={openQuestionIds}
              onToggleQuestion={handleToggleQuestion}
              onSelectQuestion={handleSelectQuestion}
              onShowToast={showToast}
            />
          </div>
        </div>

        <ShippingRelatedPolicies />
        <ShippingClosingBand onShowToast={showToast} />
      </main>

      <FloatingWhatsApp onShowToast={showToast} />
      <ShippingPrintDocument />

      <div
        className={`sh-toast ${isToastVisible ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </div>
  );
}
