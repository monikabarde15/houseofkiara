/**
 * House of Kaira - Privacy Policy Formatter & Navigation Utilities
 * Implementation of Section 5.15, 6, 7 of Build Specification v2.0
 */

import React from 'react';

/**
 * Calculates real sticky offset based on current header and section bar heights.
 * Section 7.2
 */
export function getHeaderOffset() {
  let headerHeight = 0;
  const headerCandidates = [
    document.querySelector('.hok-mobile-header'),
    document.querySelector('.hok-header-desktop'),
    document.querySelector('header'),
  ];
  for (const h of headerCandidates) {
    if (h && h.offsetHeight > 0 && window.getComputedStyle(h).display !== 'none') {
      headerHeight = h.offsetHeight;
      break;
    }
  }
  if (!headerHeight) {
    headerHeight = typeof window !== 'undefined' && window.innerWidth <= 767 ? 58 : 112;
  }

  const sectionBar = document.querySelector('.privacy-section-bar');
  const barHeight = sectionBar ? sectionBar.offsetHeight : 48;
  const paddingGap = 12;

  return headerHeight + barHeight + paddingGap;
}

/**
 * Scrolls smoothly to any anchor on the page and applies arrival glow if requested.
 * Section 7.2, 5.15
 */
export function scrollToAnchor(anchor, shouldHighlight = true) {
  if (!anchor) return;
  const cleanId = anchor.replace(/^#/, '');
  const targetElement = document.getElementById(cleanId);

  if (targetElement) {
    const offset = getHeaderOffset();
    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    // Update URL hash without pushing history state (Section 6)
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${cleanId}`);
    }

    if (shouldHighlight) {
      triggerArrivalHighlight(targetElement);
    }
  }
}

/**
 * Applies the 2.6s Gold pale arrival highlight glow.
 * Section 3.6, 5.15
 */
export function triggerArrivalHighlight(element) {
  if (!element) return;
  
  element.classList.remove('privacy-arrival-highlight');
  // Trigger reflow to restart animation if already active
  void element.offsetWidth;
  element.classList.add('privacy-arrival-highlight');

  // Focus element for accessibility without scrolling (Section 9)
  if (element.tabIndex === undefined || element.tabIndex < 0) {
    element.tabIndex = -1;
  }
  element.focus({ preventScroll: true });

  setTimeout(() => {
    element.classList.remove('privacy-arrival-highlight');
  }, 2650);
}

/**
 * Copies clause or subclause link to clipboard and replaces address bar.
 * Section 6, 5.10
 */
export async function copyClauseLink(anchor, titleOrNumber, onShowToast) {
  if (!anchor) return;
  const cleanAnchor = anchor.startsWith('#') ? anchor : `#${anchor}`;
  const fullUrl = `${window.location.origin}${window.location.pathname}${cleanAnchor}`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(fullUrl);
      if (onShowToast) {
        onShowToast(`Link to clause ${titleOrNumber} copied. Paste it anywhere to share it.`);
      }
    } else {
      throw new Error('Clipboard writeText not supported');
    }
  } catch {
    if (onShowToast) {
      onShowToast(`Copy link: ${fullUrl}`);
    }
  }

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', cleanAnchor);
  }
}

/**
 * Renders inline text with clickable clause references and page links.
 * Section 5.10, 6
 */
export function renderRichText(text, onJumpClause) {
  if (!text) return text;

  // Split text by recognized patterns:
  // - clause references: (clause \d+(\.\d+)?)
  // - page names: (Terms & Conditions|Cookie Policy|Cookie settings|Contact page|National Consumer Helpline)
  const regex = /(clause\s+\d+(?:\.\d+)?|Terms & Conditions|Cookie Policy|Cookie settings|Contact page|National Consumer Helpline)/gi;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    const lower = part.toLowerCase();

    // Clause reference match (e.g. "clause 7.3", "clause 42")
    const clauseMatch = lower.match(/^clause\s+(\d+(?:\.\d+)?)$/);
    if (clauseMatch) {
      const targetRef = clauseMatch[1];
      const targetAnchor = targetRef.includes('.')
        ? `#c-given-${targetRef.split('.')[1]}` // fallback or resolved anchor
        : `#c-clause-${targetRef}`;

      return (
        <a
          key={`ref-${idx}`}
          href={targetAnchor}
          className="privacy-inline-link"
          onClick={(e) => {
            e.preventDefault();
            if (onJumpClause) {
              onJumpClause(targetRef);
            } else {
              scrollToAnchor(targetAnchor, true);
            }
          }}
        >
          {part}
        </a>
      );
    }

    if (lower === 'terms & conditions') {
      return (
        <a key={`tc-${idx}`} href="/terms" className="privacy-inline-link">
          {part}
        </a>
      );
    }

    if (lower === 'cookie policy') {
      return (
        <a key={`cookie-${idx}`} href="/cookies" className="privacy-inline-link">
          {part}
        </a>
      );
    }

    if (lower === 'cookie settings') {
      return (
        <a key={`cset-${idx}`} href="/cookies" className="privacy-inline-link">
          {part}
        </a>
      );
    }

    if (lower === 'contact page') {
      return (
        <a key={`contact-${idx}`} href="/about" className="privacy-inline-link">
          {part}
        </a>
      );
    }

    return part;
  });
}

export default {
  getHeaderOffset,
  scrollToAnchor,
  triggerArrivalHighlight,
  copyClauseLink,
  renderRichText
};
