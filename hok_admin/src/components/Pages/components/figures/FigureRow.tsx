/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureRow (Spec §5.1, Pages 10 & 11)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { Lock, Clock, AlertCircle } from 'lucide-react';
import { FigureItem } from '../../types';

interface FigureRowProps {
  figure: FigureItem;
  isSelected?: boolean;
  onInspect: (figure: FigureItem) => void;
}

export const FigureRow: React.FC<FigureRowProps> = ({ figure, isSelected = false, onInspect }) => {
  // Reach description & terracotta check
  const renderReach = () => {
    if (figure.status === 'never-printed') {
      if (figure.reachCount > 0) {
        return (
          <span className="text-[#a4512f] font-medium">
            {figure.reachCount} still printed
          </span>
        );
      }
      return <span className="text-[#6e6358]">Not printed</span>;
    }
    if (figure.status === 'retired') {
      if (figure.reachCount > 0) {
        return (
          <span className="text-[#a4512f] font-medium">
            {figure.reachCount} still printed
          </span>
        );
      }
      return <span className="text-[#6e6358]">Not printed</span>;
    }
    if (figure.reachCount === 0) {
      return <span className="text-[#6e6358]">Not printed yet</span>;
    }
    return (
      <span className="text-[#6e6358]">
        {figure.reachCount} places · {figure.reachPages?.length || 1} pages
      </span>
    );
  };

  return (
    <div
      onClick={() => onInspect(figure)}
      className={`p-3.5 border-b border-[#efe7da] last:border-b-0 hover:bg-[#f7f2ea]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer ${
        isSelected ? 'bg-[#f5edd8]/60 ring-1 ring-inset ring-[#c9a96e]/40' : 'bg-[#fffefb]'
      }`}
    >
      {/* Left: Name, Badges & Description */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Name and Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#1a1612]">
            {figure.label}
          </span>

          {/* Status Badges (Spec §5.1) */}
          {figure.status === 'retired' && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#f8e3da] text-[#b85c38] border border-[#b85c38]/40">
              Retired
            </span>
          )}
          {figure.decisionRequired && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#f5edd8] text-[#8a6a36] border border-[#c9a96e]/60 border-dashed">
              Waiting for a decision
            </span>
          )}
          {figure.status === 'never-printed' && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#eee9f5] text-[#5b4a7a] border border-[#5b4a7a]/40">
              Never printed
            </span>
          )}
          {figure.locked && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#efe7db] text-[#5c5248] border border-[#d9ccb6] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-[#8a6a36]" />
              <span>Locked</span>
            </span>
          )}
          {figure.status === 'waiting' && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#e3f0da] text-[#6e8d58] border border-[#6e8d58]/40">
              Change waiting
            </span>
          )}
          {figure.hasScheduled && (
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[3px] bg-[#3d6e8e]/10 text-[#3d6e8e] border border-[#3d6e8e]/30 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>Scheduled</span>
            </span>
          )}
        </div>

        {/* Description line with ellipsis */}
        <p className="text-[11.5px] text-[#6e6358] truncate mt-0.5 max-w-xl">
          {figure.notes || figure.key}
        </p>
      </div>

      {/* Center: Value in serif */}
      <div className="md:w-44 shrink-0 text-left md:text-right">
        {figure.status === 'waiting' && figure.displayValue !== figure.value ? (
          <div>
            <span className="line-through text-xs text-[#a4512f] mr-1.5">
              {figure.value}
            </span>
            <span className="font-serif text-[17px] font-normal text-[#1a1612]">
              {figure.displayValue}
            </span>
            <div className="text-[10px] text-[#6e8d58] font-mono">waiting to publish</div>
          </div>
        ) : (
          <div className="font-serif text-[17px] font-normal text-[#1a1612]">
            {figure.displayValue || 'Not added yet'}
          </div>
        )}
      </div>

      {/* Right: Reach & Owner */}
      <div className="md:w-56 shrink-0 flex items-center justify-between md:justify-end gap-3 text-[11px]">
        {/* Reach */}
        <div className="text-right">
          {renderReach()}
        </div>

        {/* Owner badge */}
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#f7f2ea] text-[#6e6358] border border-[#e6dccb] shrink-0">
          {figure.owner}
        </span>
      </div>
    </div>
  );
};

export default FigureRow;
