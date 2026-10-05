/**
 * House of Kaira - Cookie Banner Inline SVG Icons
 * Section 4.4 of Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 * All icons are inline SVG, stroked in the current text colour with no fill.
 */

import React from 'react';

/**
 * 1. Close (×), card: 12 by 12px, centered in a 34 by 34px button, stroke 1.5px
 */
export const CloseCardIcon = ({ className = '', size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M1 1l10 10M11 1L1 11" />
  </svg>
);

/**
 * 2. Back arrow: 12 by 8px, stroke 1.4px
 */
export const BackArrowIcon = ({ className = '', width = 12, height = 8 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 12 8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 1L1 4l3 3M1 4h10" />
  </svg>
);

/**
 * 3. Chevron, "What this includes": 9 by 9px, gold deep, turns 180° when open, stroke 1.5px
 */
export const ChevronIncludesIcon = ({ isOpen = false, className = '', size = 9 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 10 10"
    fill="none"
    stroke="var(--cb-gold-deep, #9C7C45)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)'
    }}
    className={className}
  >
    <path d="M1 3l4 4 4-4" />
  </svg>
);

/**
 * 4. Tick, saved note: 16 by 16px, gold, stroke 1.4px
 */
export const SavedNoteTickIcon = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="var(--cb-gold, #C9A96E)"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="8" r="7.2" />
    <path d="M5 8.2l2 2 4-4.2" />
  </svg>
);

/**
 * 5. Close (×), saved note: 10 by 10px, centered in a 28 by 28px button, stroke 1.5px
 */
export const SavedNoteCloseIcon = ({ className = '', size = 10 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 10 10"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M1 1l8 8M9 1L1 9" />
  </svg>
);

export default {
  CloseCardIcon,
  BackArrowIcon,
  ChevronIncludesIcon,
  SavedNoteTickIcon,
  SavedNoteCloseIcon
};
