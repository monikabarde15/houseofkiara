/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureRow (Spec §5.1, Screens 04, 05, 12-15)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { FigureItem } from '../types';

interface FigureRowProps {
  figure: FigureItem;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

export const FigureRow: React.FC<FigureRowProps> = ({
  figure,
  isSelected,
  onSelect
}) => {
  // 1. Render all applicable badges (Spec §5.1)
  const renderBadges = () => {
    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap">
        {figure.status === 'retired' && (
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#faeae6] text-[#b85c38] text-[10.5px] font-medium">
            Retired
          </span>
        )}

        {figure.status === 'waiting' && (
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#fdf4eb] text-[#a25828] text-[10.5px] font-medium">
            Waiting for a decision
          </span>
        )}

        {(figure.owner === 'Never printed' || figure.status === 'never-printed') && (
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#f4f2ee] text-[#5c5248] text-[10.5px] font-medium">
            Never printed
          </span>
        )}

        {(figure.isLocked || figure.locked) && (
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#f4f2ee] text-[#5c5248] text-[10.5px]">
            Locked
          </span>
        )}

        {figure.hasPendingChange && (
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#fdf8e6] text-[#8a6a36] text-[10.5px] font-medium">
            Change waiting
          </span>
        )}

        {figure.hasScheduled && !figure.hasPendingChange && (
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#eef4f8] text-[#2c5270] text-[10.5px] font-medium">
            Scheduled
          </span>
        )}
      </div>
    );
  };

  // 2. Render Value column (Spec §5.1)
  const renderValue = () => {
    // Empty state
    if (!figure.displayValue && (figure.value === undefined || figure.value === null || figure.value === '')) {
      return (
        <span className="font-serif text-[15px] italic text-[#8a7f73]">
          Not added yet
        </span>
      );
    }

    // Page dates owner
    if (figure.owner === 'Each page' || figure.type === 'page date') {
      return (
        <span className="text-[13px] text-[#73675a]">
          {figure.displayValue || 'Per page'}
        </span>
      );
    }

    // Change waiting state (Spec §5.1, Screen 12)
    if (figure.hasPendingChange && figure.waitingChange) {
      return (
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1.5">
            <span className="font-serif text-[14px] line-through text-[#8a7f73]">
              {figure.displayValue}
            </span>
            <span className="font-serif text-[16px] text-[#1a1612]">
              {figure.waitingChange.value}
            </span>
          </div>
          <div className="text-[11px] text-[#2c5270] mt-0.5">
            {figure.waitingChange.when === 'date' && figure.waitingChange.date
              ? `from ${figure.waitingChange.date}`
              : 'waiting to publish'}
          </div>
        </div>
      );
    }

    // Scheduled change state (Spec §5.1, Screen 15)
    if (figure.hasScheduled && figure.scheduledChange) {
      return (
        <div className="text-right">
          <div className="font-serif text-[16px] text-[#1a1612]">
            {figure.displayValue}
          </div>
          <div className="text-[11px] text-[#73675a] mt-0.5">
            {figure.scheduledChange.value} from {figure.scheduledChange.fromDate}
          </div>
        </div>
      );
    }

    // Default current live value in Cormorant Garamond serif
    return (
      <span className="font-serif text-[16px] text-[#1a1612]">
        {figure.displayValue || String(figure.value)}
      </span>
    );
  };

  // 3. Render Reach column (Spec §5.1)
  const renderReach = () => {
    const reach = figure.reachCount || 0;
    const pages = figure.pageCount || (figure.reachPages ? figure.reachPages.length : (figure.usedOnSlugs ? figure.usedOnSlugs.length : 0));
    const isRetired = figure.status === 'retired';
    const isNeverPrinted = figure.owner === 'Never printed' || figure.status === 'never-printed';

    // Terracotta for retired or never printed figure that a page still prints
    if ((isRetired || isNeverPrinted) && reach > 0) {
      return (
        <div className="text-[11.5px] font-medium text-[#b85c38]">
          {reach} still printed
        </div>
      );
    }

    if (isNeverPrinted && reach === 0) {
      return (
        <div className="text-[11.5px] text-[#8a7f73]">
          Not printed
        </div>
      );
    }

    if (reach === 0) {
      return (
        <div className="text-[11.5px] text-[#8a7f73]">
          Not printed yet
        </div>
      );
    }

    return (
      <div className="text-[11.5px] font-medium text-[#1a1612]">
        {reach} {reach === 1 ? 'place' : 'places'}
        {pages > 0 && (
          <span className="font-normal text-[#73675a]"> · {pages} {pages === 1 ? 'page' : 'pages'}</span>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelect(figure.key)}
      className={`p-3.5 px-4 flex items-center justify-between gap-4 cursor-pointer transition-colors border-b border-[#f0ebe3] last:border-b-0 ${
        isSelected
          ? 'bg-[#f6f0e6] border-l-4 border-[#bda67b]'
          : 'bg-white hover:bg-[#faf7f2]'
      }`}
    >
      {/* 1. Name, badges, and one-line cut-short description */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-medium text-[#1a1612]">
            {figure.label}
          </span>
          {renderBadges()}
        </div>
        <p className="text-[11.5px] text-[#73675a] truncate mt-0.5">
          {figure.notes || figure.description}
        </p>
      </div>

      {/* 2. Value in Cormorant Garamond serif */}
      <div className="shrink-0 text-right min-w-[130px]">
        {renderValue()}
      </div>

      {/* 3. Reach and Owner */}
      <div className="shrink-0 text-right min-w-[110px]">
        {renderReach()}
        <div className="text-[10.5px] text-[#8a7f73] mt-0.5">
          {figure.owner}
        </div>
      </div>
    </div>
  );
};

export default FigureRow;
