/**
 * House of Kaira - Deposit Policy Sticky Section Bar (D5)
 * Section 5 (D5) & 6.5 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DEPOSIT_SECTIONS } from '../../data/deposit/depositRegistry.js';

const DepositSectionBar = ({ activeSectionId, onSelectSection }) => {
  const [currentActive, setCurrentActive] = useState(activeSectionId || DEPOSIT_SECTIONS[0]?.id);
  const [headerHeight, setHeaderHeight] = useState(112);
  const [fadeClass, setFadeClass] = useState('');
  const [isStuck, setIsStuck] = useState(false);

  const barRef = useRef(null);
  const innerRef = useRef(null);
  const activeLinkRef = useRef(null);
  const rafRef = useRef(null);

  // 1. Live Header Height Tracking
  const updateHeaderHeight = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 767;

    if (isMobile) {
      const mobHeader = document.querySelector('.hok-mobile-header');
      if (mobHeader && mobHeader.offsetHeight > 0 && window.getComputedStyle(mobHeader).display !== 'none') {
        setHeaderHeight(mobHeader.offsetHeight);
        return;
      }
      setHeaderHeight(58);
    } else {
      const deskHeader =
        document.querySelector('.hok-header-desktop') ||
        document.querySelector('.hok-desktop-header') ||
        document.querySelector('header');
      if (deskHeader && deskHeader.offsetHeight > 0 && window.getComputedStyle(deskHeader).display !== 'none') {
        setHeaderHeight(deskHeader.offsetHeight);
        return;
      }
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

  // 2. Horizontal Overflow Edge Fades Detection (Section 6.5)
  const updateOverflowFades = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;

    const hasOverflow = el.scrollWidth > el.clientWidth + 2;
    if (!hasOverflow) {
      setFadeClass('');
      return;
    }

    const canScrollLeft = el.scrollLeft > 6;
    const canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 6);

    if (canScrollLeft && canScrollRight) {
      setFadeClass('fade-l fade-r');
    } else if (canScrollLeft) {
      setFadeClass('fade-l');
    } else if (canScrollRight) {
      setFadeClass('fade-r');
    } else {
      setFadeClass('');
    }
  }, []);

  useEffect(() => {
    updateOverflowFades();
    window.addEventListener('resize', updateOverflowFades);
    return () => window.removeEventListener('resize', updateOverflowFades);
  }, [updateOverflowFades]);

  // 3. ScrollSpy Detection (Section 6.5: 72px below bottom of section bar)
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!barRef.current) return;

        const barRect = barRef.current.getBoundingClientRect();
        const stuck = barRect.top <= headerHeight + 1.5;
        setIsStuck(stuck);

        // Section bar bottom + 72px per Section 6.5
        const referenceLine = barRect.bottom + 72;

        let activeId = DEPOSIT_SECTIONS[0]?.id;
        for (let i = 0; i < DEPOSIT_SECTIONS.length; i++) {
          const section = DEPOSIT_SECTIONS[i];
          const secEl = document.getElementById(section.id);
          if (secEl) {
            const secRect = secEl.getBoundingClientRect();
            if (secRect.top <= referenceLine) {
              activeId = section.id;
            }
          }
        }

        if (activeId) {
          setCurrentActive(activeId);
        }
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [headerHeight]);

  // 4. Auto-center Active Link in Horizontal Scroll (Section 6.5)
  useEffect(() => {
    if (activeLinkRef.current && innerRef.current) {
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

  const handleLinkClick = (section) => {
    setCurrentActive(section.id);
    if (onSelectSection) {
      onSelectSection(section.id);
    }
  };

  return (
    <nav
      ref={barRef}
      className={`secbar ${fadeClass} ${isStuck ? 'stuck' : ''}`.trim()}
      style={{ top: `${headerHeight}px` }}
      aria-label="Policy sections"
    >
      <div
        ref={innerRef}
        className="secbar-in"
        onScroll={updateOverflowFades}
      >
        {DEPOSIT_SECTIONS.map((section) => {
          const isActive = currentActive === section.id;
          return (
            <button
              key={section.id}
              ref={isActive ? activeLinkRef : null}
              type="button"
              className={`sb-link ${isActive ? 'on' : ''}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => handleLinkClick(section)}
            >
              {section.barLabel}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default React.memo(DepositSectionBar);
