/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RegisterFigurePointer (Spec §12, Screens 65-73)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { ExternalLink, Lock, CheckCircle2, Clock } from 'lucide-react';
import { FigureItem } from '../types';

interface RegisterFigurePointerProps {
  figure: FigureItem;
  label?: string;
  hint?: string;
  onOpenFigure?: (key: string) => void;
  extraControls?: React.ReactNode;
}

export const RegisterFigurePointer: React.FC<RegisterFigurePointerProps> = ({
  figure,
  label,
  hint,
  onOpenFigure,
  extraControls
}) => {
  const displayLabel = label || figure.label;
  const defaultHint =
    hint ||
    'A figure, set once in Pages under Figures. The cart, checkout and every page that mentions it read it from there.';

  return (
    <div className="bg-[#fcfaf7] border border-[#e8dfd2] rounded-[8px] p-4 text-[#1a1612] shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#1a1612] uppercase tracking-wider font-mono">
              {displayLabel}
            </span>
            {figure.status === 'live' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#eef5ea] text-[#3d682a]">
                <CheckCircle2 className="w-3 h-3" />
                Live
              </span>
            )}
            {figure.status === 'locked' && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#f5efe4] text-[#8a6a36]">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
            {figure.hasPendingChange && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#fff3e0] text-[#b85c38]">
                <Clock className="w-3 h-3" />
                Change waiting
              </span>
            )}
          </div>

          {/* Current Live Value */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-normal text-[#1a1612]">
              {figure.displayValue}
            </span>
            {figure.hasPendingChange && figure.waitingChange && (
              <span className="text-xs text-[#b85c38] font-mono bg-[#fff3e0] px-2 py-0.5 rounded">
                Changing to {figure.waitingChange.value}
              </span>
            )}
          </div>

          {/* Clarifying note (Spec §12) */}
          <p className="text-[12px] text-[#6e6358] leading-relaxed mt-2 max-w-[540px]">
            {defaultHint}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onOpenFigure?.(figure.key)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#d9ccb6] bg-white text-xs font-medium text-[#1a1612] hover:bg-[#f7f2ea] hover:border-[#8a6a36] transition cursor-pointer shadow-2xs"
          title="Open this figure in the Pages Figures register"
        >
          <span>Open the figure</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8a6a36]" />
        </button>
      </div>

      {/* Local Extra Controls (e.g. Threshold measured on: Before discount / After discount) */}
      {extraControls && (
        <div className="mt-4 pt-3 border-t border-[#eee5d8]">
          {extraControls}
        </div>
      )}
    </div>
  );
};

export default RegisterFigurePointer;
