import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TERMS_PARTS } from '../../data/terms/termsRegistry.js';
import { scrollToClause } from '../../utils/terms/termsFormatter.jsx';

/**
 * Terms & Conditions Sticky Section Bar
 * Section 5.5 & 6.2 of Build Specification v3.0
 */
const TermsSectionBar = ({ activePartAnchor, onSelectPart }) => {
  const [currentActive, setCurrentActive] = useState(activePartAnchor || '');
  const [headerHeight, setHeaderHeight] = useState(72);
  const [isStuck, setIsStuck] = useState(false);

  const barRef = useRef(null);
  const innerRef = useRef(null);
  const activeLinkRef = useRef(null);
  const rafRef = useRef(null);

  // Measure live header height accurately across desktop and mobile
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

  // Section 6.2: Active Part tracking with reference line (60px below stopping point)
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!barRef.current) return;

        // Check stuck state
        const rect = barRef.current.getBoundingClientRect();
        const stuck = rect.top <= headerHeight + 1.5;
        setIsStuck(stuck);

        // Section 6.1 stopping point = headerHeight + barHeight + 12
        const barHeight = barRef.current.offsetHeight || 50;
        const stoppingPoint = headerHeight + barHeight + 12;
        const referenceLine = stoppingPoint + 60; // 60px below stopping point

        let activeAnchor = '';
        // Find the last Part whose top edge has scrolled above the reference line
        for (let i = 0; i < TERMS_PARTS.length; i++) {
          const part = TERMS_PARTS[i];
          const el = document.querySelector(part.anchor);
          if (el) {
            const elRect = el.getBoundingClientRect();
            // If the element's top is above or at reference line
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

  // Auto horizontal scroll to center active link on mobile/overflow
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

  const handleLinkClick = (part, e) => {
    e.preventDefault();
    setCurrentActive(part.anchor);
    if (onSelectPart) {
      onSelectPart(part);
    } else {
      scrollToClause(part.anchor);
    }
  };

  return (
    <nav
      className={`terms-section-bar ${isStuck ? 'terms-section-bar-stuck' : ''}`}
      style={{ top: `${headerHeight}px` }}
      aria-label="Parts of these terms"
      ref={barRef}
    >
      <div className="terms-section-bar-inner" ref={innerRef}>
        <div className="terms-section-links-row">
          {TERMS_PARTS.map((part) => {
            const isActive = currentActive === part.anchor;
            const rangeStr = part.startClause === part.endClause
              ? `clause ${part.startClause}`
              : `clauses ${part.startClause} to ${part.endClause}`;
            const tooltipTitle = `${part.title}, ${rangeStr}`;

            return (
              <a
                key={`bar-${part.partNumber}`}
                href={part.anchor}
                ref={isActive ? activeLinkRef : null}
                className={`terms-section-link ${isActive ? 'terms-section-link-active' : ''}`}
                onClick={(e) => handleLinkClick(part, e)}
                title={tooltipTitle}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="terms-section-link-text">{part.barLabel}</span>
                {isActive && <span className="terms-section-active-underline" aria-hidden="true" />}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(TermsSectionBar);
