/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · 16 LINE ICONS
   Spec Section 4.13 (v213)
   Exact SVG path data on 24x24 viewBox with 1.5 stroke
========================================================= */

import React from 'react';
import './HomepageIcons.css';

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ICON_NAMES = [
  'search',
  'pin',
  'box',
  'heart',
  'camera',
  'users',
  'card',
  'shield',
  'clock',
  'refresh',
  'tag',
  'recycle',
  'gem',
  'wallet',
  'infinity',
  'spark'
] as const;

export type HomepageIconName = typeof ICON_NAMES[number];

export const HomepageLineIcon: React.FC<{ name: string; size?: number; className?: string }> = ({
  name,
  size = 14,
  className = ''
}) => {
  const baseClass = `hok-icon hok-line-icon ${className}`.trim();

  switch (name) {
    case 'search':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
      );
    case 'pin':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'box':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'camera':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      );
    case 'card':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case 'refresh':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case 'tag':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M20.6 13.4 12 22l-9-9V3h10z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      );
    case 'recycle':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M7 19H4.8a1.8 1.8 0 0 1-1.5-2.7L6.2 11.5" />
          <path d="m9 22-2.5-3 3-2" />
          <path d="M10.9 5.9 9.8 4a1.8 1.8 0 0 0-3.1 0L5 7.2" />
          <path d="M17 5h2.2a1.8 1.8 0 0 1 1.5 2.7L17.8 13" />
          <path d="m14.5 2.5 3 2.5-3 2.5" />
          <path d="M13.5 18.5h3.7a1.8 1.8 0 0 0 1.5-2.7" />
        </svg>
      );
    case 'gem':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M2 9h20" />
          <path d="m10 3-2 6 4 12 4-12-2-6" />
        </svg>
      );
    case 'wallet':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
          <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
        </svg>
      );
    case 'infinity':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4Z" />
          <path d="M12 12c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4Z" />
        </svg>
      );
    case 'spark':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} className={baseClass}>
          <path d="M12 2l2.2 6.3L21 10l-5.4 4 1.7 7-5.3-3.8L6.7 21l1.7-7L3 10l6.8-1.7z" />
        </svg>
      );
    default:
      return null;
  }
};

/* Additional UI Helper Icons */
export const SearchMagnifierIcon: React.FC<IconProps> = ({ size = 14, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={`hok-icon hok-line-icon ${className}`.trim()}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.7" y2="16.7" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 12, className = '' }) => (
  <svg viewBox="0 0 12 12" width={size} height={size} className={`hok-icon hok-line-icon ${className}`.trim()}>
    <line x1="6" y1="1" x2="6" y2="11" />
    <line x1="1" y1="6" x2="11" y2="6" />
  </svg>
);

export const SwapIcon: React.FC<IconProps> = ({ size = 12, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={`hok-icon hok-line-icon ${className}`.trim()}>
    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

export const DoorArrowIcon: React.FC<IconProps> = ({ size = 10, className = '' }) => (
  <svg viewBox="0 0 10 10" width={size} height={size} className={`hok-icon hok-line-icon ${className}`.trim()}>
    <path d="M1 9L9 1M9 1H3M9 1V7" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 10, className = '' }) => (
  <svg viewBox="0 0 10 6" width={size} height={size} className={`hok-icon hok-line-icon ${className}`.trim()}>
    <polyline points="1 1 5 5 9 1" fill="none" />
  </svg>
);
