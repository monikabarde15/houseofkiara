import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PRIVACY_PARTS } from '../../data/privacy/privacyRegistry.js';
import { scrollToAnchor } from '../../utils/privacy/privacyFormatter.jsx';

/**
 * House of Kaira - Privacy Policy Sticky Section Bar
 * Section 5.6 & 7.1-7.3 of Build Specification v2.0
 */
const PrivacySectionBar = ({ activePartAnchor, onSelectPart }) => {
  const [currentActive, setCurrentActive] = useState(activePartAnchor || '');
  const [headerHeight, setHeaderHeight] = useState(112);
  const [isStuck, setIsStuck] = useState(false);

  const barRef = useRef(null);
  const innerRef = useRef(null);
  const activeLinkRef = useRef(null);
  const rafRef = useRef(null);

  // 1. Live Header Height Tracking Across Desktop (.hok-header-desktop) and Mobile (.hok-mobile-header)
  const updateHeaderHeight = useCallback(() => {
    const candidates = [
      document.querySelector('.hok-mobile-header'),
      document.querySelector('.hok-header-desktop'),
      document.querySelector('header'),
    ];

    for (const el of candidates) {
      if (el && el.offsetHeight > 0 && window.getComputedStyle(el).display !== 'none') {
        setHeaderHeight(el.offsetHeight);
        return;
      }
    }

    // Fallback based on screen width
    if (typeof window !== 'undefined' && window.innerWidth <= 767) {
      setHeaderHeight(58);
    } else {
      setHeaderHeight(112);
    }
  }, []);

  useEffect(() => {
    updateHeaderHeight();

    const desktopHeader = document.querySelector('.hok-header-desktop');
    const mobileHeader = document.querySelector('.hok-mobile-header');

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      if (desktopHeader) ro.observe(desktopHeader);
      if (mobileHeader) ro.observe(mobileHeader);
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      if (ro) ro.disconnect();
    };
  }, [updateHeaderHeight]);

  // 2. Scrollspy Calculation & Stuck State (Section 7.3: 60px below jump landing position)
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!barRef.current) return;

        // Check stuck state
        const rect = barRef.current.getBoundingClientRect();
        const stuck = rect.top <= headerHeight + 1.5;
        setIsStuck(stuck);

        // Section 7.2 stopping point = headerHeight + barHeight + 12px
        const barHeight = barRef.current.offsetHeight || 48;
        const stoppingPoint = headerHeight + barHeight + 12;
        const referenceLine = stoppingPoint + 60; // 60px below stopping point

        let activeAnchor = '';
        for (let i = 0; i < PRIVACY_PARTS.length; i++) {
          const part = PRIVACY_PARTS[i];
          const cleanId = part.anchor.replace(/^#/, '');
          const el = document.getElementById(cleanId);
          if (el) {
            const elRect = el.getBoundingClientRect();
            if (elRect.top <= referenceLine) {
              activeAnchor = part.anchor;
            }
          }
        }

        setCurrentActive(activeAnchor);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [headerHeight]);

  // 3. Auto-center Active Link in Horizontal Scroll (Section 5.6 & 7.3)
  useEffect(() => {
    if (activeLinkRef.current && innerRef.current && currentActive) {
      const container = innerRef.current;
      const link = activeLinkRef.current;
      const containerWidth = container.offsetWidth;
      const linkLeft = link.offsetLeft;
      const linkWidth = link.offsetWidth;

      container.scrollTo({
        left: linkLeft - containerWidth / 2 + linkWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [currentActive]);

  const handleLinkClick = useCallback((part, e) => {
    e.preventDefault();
    setCurrentActive(part.anchor);
    if (onSelectPart) {
      onSelectPart(part);
    } else if (part.anchor) {
      scrollToAnchor(part.anchor, false); // Section 5.5: Parts are not highlighted
    }
  }, [onSelectPart]);

  return (
    <nav
      ref={barRef}
      className={`privacy-section-bar ${isStuck ? 'privacy-section-bar-stuck' : ''}`}
      style={{ top: `${headerHeight}px` }}
      aria-label="Parts of this policy"
    >
      <div className="privacy-section-bar-inner" ref={innerRef}>
        <div className="privacy-section-links-row">
          {PRIVACY_PARTS.map((part) => {
            const isActive = currentActive === part.anchor;
            return (
              <a
                key={`sec-link-${part.number}`}
                href={part.anchor}
                ref={isActive ? activeLinkRef : null}
                title={part.tooltip}
                aria-current={isActive ? 'true' : undefined}
                className={`privacy-section-link ${isActive ? 'privacy-section-link-active' : ''}`}
                onClick={(e) => handleLinkClick(part, e)}
              >
                <span className="privacy-section-link-text">{part.barLabel}</span>
                {isActive && (
                  <span className="privacy-section-active-underline" aria-hidden="true" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(PrivacySectionBar);
