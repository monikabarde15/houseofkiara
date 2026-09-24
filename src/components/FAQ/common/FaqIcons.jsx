// src/components/FAQ/common/FaqIcons.jsx
// Exact SVG geometry from Appendix E of the HOK Help & FAQs Specification (Spec v3)
import React from "react";

// Moment card arch (B9)
export const ArchIcon = ({ className = "" }) => (
  <svg className={`arch ${className}`} viewBox="0 0 80 112" aria-hidden="true">
    <path d="M5 111V47C5 23 21 7 40 2c19 5 35 21 35 45v64" />
    <path className="in" d="M15 111V51c0-17 11-30 25-35 14 5 25 18 25 35v60" />
    <path d="M40 2v9" />
    <path className="in" d="M28 111V70c0-7 5-12 12-15 7 3 12 8 12 15v41" />
  </svg>
);

// Hygiene promise icon (B11) - Hanger with sparkles
export const HygieneIcon = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 7a2.5 2.5 0 1 1 2.5 2.5c-1.4 0-2.5 1-2.5 2.3v1.4" />
    <path d="M16 13.2 4.2 21.6c-1 .7-.5 2.2.7 2.2h22.2c1.2 0 1.7-1.5.7-2.2L16 13.2z" />
    <path d="M24.5 4.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" />
    <path d="M7.5 9l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z" />
  </svg>
);

// Search magnifier (B4)
export const SearchMagnifierIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m16.5 16.5 4 4" />
  </svg>
);

// Question row chevron (D2)
export const ChevronIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

// Copy link chain (D6)
export const ChainIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// Email icon (F3)
export const EmailIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="1" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

// Your order icon (F3)
export const YourOrderIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 10h18M7 15h4" />
    <rect x="2" y="5" width="20" height="14" rx="1" />
  </svg>
);

// WhatsApp glyph (A9, A11, F3)
export const WhatsAppGlyphIcon = ({ className = "", fill = "currentColor" }) => (
  <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
