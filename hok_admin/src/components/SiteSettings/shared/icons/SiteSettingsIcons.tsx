import React from 'react';
import './SiteSettingsIcons.css';
import { RegionId } from '../../types/siteSettings.types';

// Appendix 20.1 Region icons — 24 × 24, stroke 1.6
export const RegionIcon: React.FC<{ region: RegionId; className?: string }> = ({ region, className = '' }) => {
  const baseClass = `hok-icon hok-region-icon ${className}`.trim();

  switch (region) {
    case 'announcement':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <rect x="3" y="5" width="18" height="5" rx="1" />
          <line x1="3" y1="14" x2="21" y2="14" />
          <line x1="3" y1="18" x2="14" y2="18" />
        </svg>
      );
    case 'header':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <rect x="3" y="4" width="18" height="6" rx="1" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="3" y1="19" x2="21" y2="19" />
        </svg>
      );
    case 'footer':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <line x1="3" y1="5" x2="21" y2="5" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <rect x="3" y="14" width="18" height="6" rx="1" />
        </svg>
      );
    case 'mobile':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    case 'brand':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z" />
        </svg>
      );
    case 'contact':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M4 4h16v12H7l-3 3z" />
        </svg>
      );
    case 'google':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.7" y2="16.7" />
        </svg>
      );
    case 'legal':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <path d="M12 3v18M5 7h14M7 7l-3 6h6zM17 7l-3 6h6z" />
        </svg>
      );
    case 'regional':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'maintenance':
      return (
        <svg viewBox="0 0 24 24" className={baseClass}>
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    default:
      return null;
  }
};

// Appendix 20.2 Other marks
export const SearchMagnifierIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={`hok-icon hok-search-icon ${className}`.trim()}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.7" y2="16.7" />
  </svg>
);

export const CheckboxTickIcon: React.FC = () => (
  <svg
    viewBox="0 0 15 15"
    width="15"
    height="15"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      pointerEvents: 'none'
    }}
  >
    <polyline
      points="4,8 6.5,10.5 11,4.5"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.7"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);

export const MenuChevronIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 8 6" width="7" height="6" className={`hok-icon hok-chevron-icon ${className}`.trim()}>
    <path d="M1 1.5L4 4.5L7 1.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
  </svg>
);

export const DrawerCaretIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 6 8" width="6" height="8" className={`hok-icon hok-chevron-icon ${className}`.trim()}>
    <path d="M1.5 1L4.5 4L1.5 7" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
  </svg>
);

export const HamburgerIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`hok-hamburger-icon ${className}`.trim()}>
    <div className="hok-hamburger-bar" />
    <div className="hok-hamburger-bar" />
    <div className="hok-hamburger-bar" />
  </div>
);

export const EyeLineIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`hok-icon ${className}`.trim()}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeCrossLineIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`hok-icon ${className}`.trim()}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
