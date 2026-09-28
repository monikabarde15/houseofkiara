import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_CLAUSES } from '../../data/terms/termsRegistry.js';
import { TERMS_SETTINGS } from '../../data/terms/termsSettings.js';

// Build a map of clause numbers to their anchors
const CLAUSE_ANCHOR_MAP = {};
ALL_CLAUSES.forEach(c => {
  CLAUSE_ANCHOR_MAP[c.number] = c.anchor;
});

/**
 * Smoothly scrolls to a target clause or element anchor with header & sticky bar offset.
 * Section 6.1 of Build Specification v3.0: Target top sits 12px below sticky section bar.
 * Also applies the 3-second highlight pulse.
 * @param {string} anchorId - Anchor string with or without '#'.
 */
export function scrollToClause(anchorId) {
  if (!anchorId) return;
  const cleanId = anchorId.replace(/^#/, '');
  const el = document.getElementById(cleanId);
  if (el) {
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
      headerHeight = window.innerWidth <= 767 ? 58 : 112;
    }

    const sectionBar = document.querySelector('.terms-section-bar');
    const barHeight = sectionBar ? sectionBar.offsetHeight : 50;

    // Spec Section 6.1: headerHeight + barHeight + 12px
    const totalOffset = headerHeight + barHeight + 12;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Apply target highlight animation
    el.classList.remove('terms-clause-targeted');
    void el.offsetWidth; // Trigger reflow
    el.classList.add('terms-clause-targeted');
    setTimeout(() => {
      el.classList.remove('terms-clause-targeted');
    }, 3200);

    // Update browser URL hash without jump
    window.history.pushState(null, '', `#${cleanId}`);
  }
}

/**
 * Parses raw text containing clause references, policy links, contact details,
 * and renders formatted React nodes with interactive links.
 * 
 * @param {string} text - Raw subclause or paragraph text.
 * @param {Function} [onLinkClick] - Optional callback when internal anchor is clicked.
 * @returns {React.ReactNode}
 */
export function formatTermsText(text, onLinkClick) {
  if (!text) return null;

  // Patterns to match in order of specificity:
  // 1. "clauses X to Y" (e.g., "clauses 18 to 28")
  // 2. "clause X.Y" or "clause X" (e.g., "clause 20.4", "clause 26")
  // 3. Known policy names ("Refund & Cancellation Policy", "Privacy Policy", etc.)
  // 4. Contact/Gov items ("hello@houseofkaira.com", "+91 93401 39300", "consumerhelpline.gov.in", "e-jagriti.gov.in")

  const combinedRegex = /(clauses\s+\d+\s+to\s+\d+|clause\s+\d+(?:\.\d+)?|Refund\s+&\s+Cancellation\s+Policy|Deposit\s+Policy|Care,\s+Cleaning\s+&\s+Damage\s+Policy|Shipping\s+&\s+Delivery\s+Policy|Privacy\s+Policy|Cookie\s+Policy|Help\s+&\s+FAQs|hello@houseofkaira\.com|\+91\s*93401\s*39300|\+91\s*88000\s*01915|1915|consumerhelpline\.gov\.in|e-jagriti\.gov\.in|www\.houseofkaira\.com)/gi;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchedText = match[0];
    const matchStart = match.index;

    // Push preceding normal text
    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    const key = `format-elem-${matchStart}`;
    const lower = matchedText.toLowerCase();

    // 1. Range of clauses: "clauses X to Y"
    const rangeMatch = lower.match(/clauses\s+(\d+)\s+to\s+(\d+)/);
    if (rangeMatch) {
      const startNum = parseInt(rangeMatch[1], 10);
      const targetAnchor = CLAUSE_ANCHOR_MAP[startNum] || `#c-${startNum}`;
      parts.push(
        <a
          key={key}
          href={targetAnchor}
          className="terms-inline-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToClause(targetAnchor);
            if (onLinkClick) onLinkClick(targetAnchor);
          }}
        >
          {matchedText}
        </a>
      );
      lastIndex = combinedRegex.lastIndex;
      continue;
    }

    // 2. Single clause / subclause: "clause X" or "clause X.Y"
    const singleMatch = lower.match(/clause\s+(\d+)(?:\.(\d+))?/);
    if (singleMatch) {
      const cNum = parseInt(singleMatch[1], 10);
      const targetAnchor = CLAUSE_ANCHOR_MAP[cNum] || `#c-${cNum}`;
      parts.push(
        <a
          key={key}
          href={targetAnchor}
          className="terms-inline-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToClause(targetAnchor);
            if (onLinkClick) onLinkClick(targetAnchor);
          }}
        >
          {matchedText}
        </a>
      );
      lastIndex = combinedRegex.lastIndex;
      continue;
    }

    // 3. Policy Links
    if (lower.includes('refund & cancellation policy')) {
      parts.push(
        <Link key={key} to="/refunds" className="terms-inline-link">
          {matchedText}
        </Link>
      );
    } else if (lower.includes('privacy policy')) {
      parts.push(
        <Link key={key} to="/privacy-policy" className="terms-inline-link">
          {matchedText}
        </Link>
      );
    } else if (lower.includes('help & faqs')) {
      parts.push(
        <Link key={key} to="/faqs" className="terms-inline-link">
          {matchedText}
        </Link>
      );
    } else if (
      lower.includes('deposit policy') ||
      lower.includes('care, cleaning & damage policy') ||
      lower.includes('shipping & delivery policy') ||
      lower.includes('cookie policy')
    ) {
      parts.push(
        <a
          key={key}
          href="#p-policies"
          className="terms-inline-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToClause('#p-policies');
            if (onLinkClick) onLinkClick('#p-policies');
          }}
        >
          {matchedText}
        </a>
      );
    }
    // 4. Contact & Government Links
    else if (lower.includes('hello@houseofkaira.com')) {
      parts.push(
        <a key={key} href="mailto:hello@houseofkaira.com" className="terms-inline-link">
          {matchedText}
        </a>
      );
    } else if (lower.includes('+91 93401 39300')) {
      parts.push(
        <a
          key={key}
          href={`https://wa.me/${TERMS_SETTINGS.support_whatsapp_raw}`}
          target="_blank"
          rel="noopener noreferrer"
          className="terms-inline-link"
        >
          {matchedText}
        </a>
      );
    } else if (lower.includes('1915')) {
      parts.push(
        <a key={key} href="tel:1915" className="terms-inline-link">
          {matchedText}
        </a>
      );
    } else if (lower.includes('+91 88000 01915')) {
      parts.push(
        <a
          key={key}
          href="https://wa.me/918800001915"
          target="_blank"
          rel="noopener noreferrer"
          className="terms-inline-link"
        >
          {matchedText}
        </a>
      );
    } else if (lower.includes('consumerhelpline.gov.in')) {
      parts.push(
        <a
          key={key}
          href="https://consumerhelpline.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="terms-inline-link"
        >
          {matchedText}
        </a>
      );
    } else if (lower.includes('e-jagriti.gov.in')) {
      parts.push(
        <a
          key={key}
          href="https://e-jagriti.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="terms-inline-link"
        >
          {matchedText}
        </a>
      );
    } else if (lower.includes('www.houseofkaira.com')) {
      parts.push(
        <a key={key} href="https://www.houseofkaira.com" className="terms-inline-link">
          {matchedText}
        </a>
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = combinedRegex.lastIndex;
  }

  // Push remainder
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * TermsText Component for direct JSX rendering.
 */
export const FormattedTermsText = ({ text, onLinkClick }) => {
  return <>{formatTermsText(text, onLinkClick)}</>;
};

export default FormattedTermsText;
