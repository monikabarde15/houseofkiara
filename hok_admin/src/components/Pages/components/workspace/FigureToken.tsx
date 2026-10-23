/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureToken (Spec §7.3 & §10.1 Paper Figure Token)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { FigureItem } from '../../types';

interface FigureTokenProps {
  figure: FigureItem;
  onClick: (figure: FigureItem) => void;
  isSelected?: boolean;
  position?: 'start' | 'inline';
}

export const FigureToken: React.FC<FigureTokenProps> = ({
  figure,
  onClick,
  isSelected = false,
  position = 'start'
}) => {
  // Determine token badge style based on lifecycle status (Spec §2.1)
  const getStyle = () => {
    switch (figure.status) {
      case 'waiting':
        return 'bg-[#e3f0da] text-[#6e8d58] border-b-2 border-[#6e8d58]';
      case 'retired':
        return 'bg-[#f8e3da] text-[#b85c38] border-b-2 border-[#b85c38] line-through';
      case 'never-printed':
        return 'bg-[#eee9f5] text-[#5b4a7a] border-b-2 border-[#5b4a7a]';
      default:
        return 'bg-[#f5edd8] text-[#8a6a36] border-b-2 border-[#c9a96e]';
    }
  };

  // Format value according to §13.2 capitalization rules:
  // "Days we answer is stored as Site Settings shows it ('Seven days a week').
  // At the start of a field, a line or a sentence, or after a colon, it prints as stored;
  // inside a sentence it takes a small first letter ('seven days a week')."
  const getFormattedValue = () => {
    let raw = figure.displayValue || String(figure.value || '');
    if (!raw || raw.trim() === '') {
      return '';
    }
    if (
      position === 'inline' &&
      figure.key === 'support_days'
    ) {
      if (raw.startsWith('Seven days a week')) {
        return raw.replace(/^Seven days a week/, 'seven days a week');
      }
    }
    return raw;
  };

  const formattedValue = getFormattedValue();
  if (!formattedValue) {
    return null;
  }

  return (
    <span
      onClick={e => {
        e.stopPropagation();
        onClick(figure);
      }}
      contentEditable={false}
      className={`inline-flex items-center px-1.5 py-0.5 mx-1 rounded-[3px] font-mono text-[12px] font-semibold select-none cursor-pointer transition-all hover:scale-102 hover:shadow-xs ${getStyle()} ${
        isSelected ? 'ring-2 ring-[#8a6a36] shadow-xs' : ''
      }`}
      title={`Figure token: ${figure.label} (${figure.key}) · Click to inspect`}
    >
      {formattedValue}
    </span>
  );
};

export default FigureToken;
