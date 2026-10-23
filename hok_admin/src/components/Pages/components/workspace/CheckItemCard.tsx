/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: CheckItemCard (Spec §9, Pages 50–53, Screen 32)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Check,
  RotateCcw,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { CheckItem } from '../../types';

interface CheckItemCardProps {
  check: CheckItem;
  onResolve: (checkId: string) => void;
  onUndo?: (checkId: string) => void;
  onAcknowledge?: (checkId: string, reason: string) => void;
  onOpenWords?: (check: CheckItem) => void;
  onOpenFigure?: (figureKey: string) => void;
  onOpenPage?: (slug: string) => void;
}

export const CheckItemCard: React.FC<CheckItemCardProps> = ({
  check,
  onResolve,
  onUndo,
  onAcknowledge,
  onOpenWords,
  onOpenFigure,
  onOpenPage
}) => {
  const [isPromptingReason, setIsPromptingReason] = useState(false);
  const [reasonText, setReasonText] = useState('');

  const getImportanceBadge = () => {
    switch (check.importance) {
      case 'high':
        return {
          dotBg: 'bg-[#b85c38]',
          badge: 'bg-[#fcf2ed] text-[#b85c38] border-[#f2cfc2]',
          label: 'High'
        };
      case 'medium':
        return {
          dotBg: 'bg-[#d19a3c]',
          badge: 'bg-[#fdf8ed] text-[#d19a3c] border-[#f7e0b5]',
          label: 'Medium'
        };
      default:
        return {
          dotBg: 'bg-[#8a8075]',
          badge: 'bg-[#f7f2ea] text-[#6e6358] border-[#e6dccb]',
          label: 'Low'
        };
    }
  };

  const badge = getImportanceBadge();

  const handleConfirmAcknowledge = () => {
    if (!reasonText.trim()) return;
    if (onAcknowledge) {
      onAcknowledge(check.id, reasonText.trim());
    } else {
      onResolve(check.id);
    }
    setIsPromptingReason(false);
    setReasonText('');
  };

  // State 1: Acknowledged check (§9.4)
  if (check.acknowledged) {
    return (
      <div className="p-3.5 rounded-[3px] bg-[#f7f4ee] border border-[#d9ccb6] space-y-2 text-xs transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6245] shrink-0" />
            <span className="font-medium text-[#1a1612]">
              Acknowledged: {check.title}
            </span>
          </div>

          {onUndo && (
            <button
              onClick={() => onUndo(check.id)}
              className="text-[11px] text-[#8a6a36] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Un-acknowledge</span>
            </button>
          )}
        </div>

        {check.surroundingWords && (
          <div className="pl-5 text-[11px] font-mono text-[#6e6358] italic border-l-2 border-[#d9ccb6]">
            “{check.surroundingWords}”
          </div>
        )}

        <div className="pl-5 text-[11px] text-[#4a4036] space-y-0.5">
          <div>
            <strong>Reason:</strong> {check.acknowledgedReason || 'Acknowledged by operator.'}
          </div>
          <div className="text-[#8a8075]">
            Confirmed by {check.acknowledgedBy || 'Admin'} on {check.acknowledgedAt || check.createdDate}
          </div>
        </div>
      </div>
    );
  }

  // State 2: Resolved in this draft
  if (check.resolved) {
    return (
      <div className="p-3.5 rounded-[3px] bg-[#f7f9f5] border border-[#cbd8c2] flex items-center justify-between text-xs transition-all">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6245] shrink-0" />
          <div>
            <span className="font-medium text-[#1a1612] line-through opacity-70">
              {check.title}
            </span>
            <span className="block text-[11px] text-[#0e6245]">
              Resolved in this draft
            </span>
          </div>
        </div>

        {onUndo && (
          <button
            onClick={() => onUndo(check.id)}
            className="p-1 text-[#6e6358] hover:text-[#1a1612] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        )}
      </div>
    );
  }

  // State 3: Active Unresolved Check (§9.1 & §9.2, Screen 32)
  return (
    <div className="p-4 rounded-[3px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] hover:border-[#8a6a36] transition-all space-y-3">
      {/* Header: Importance Pill, Location (Part & Clause), Title */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${badge.badge}`}>
              {badge.label}
            </span>
            {check.part && (
              <span className="text-[11px] text-[#8a6a36] font-medium">
                {check.part}
              </span>
            )}
            {check.clauseId && (
              <span className="text-[10px] font-mono text-[#6e6358] bg-[#f7f2ea] px-1.5 py-0.5 rounded border border-[#e6dccb]">
                {check.clauseId}
              </span>
            )}
          </div>
          <h4 className="text-xs md:text-sm font-semibold text-[#1a1612]">
            {check.title}
          </h4>
        </div>

        <button
          onClick={() => onOpenWords?.(check)}
          className="px-2.5 py-1 text-xs font-semibold text-[#8a6a36] hover:bg-[#f7f2ea] rounded border border-[#d9ccb6] cursor-pointer shrink-0 transition-colors"
        >
          Open
        </button>
      </div>

      {/* Quoted Surrounding Words (§9.1: "quotes the words around it") */}
      {check.surroundingWords && (
        <div className="p-2.5 bg-[#fbf9f5] border-l-2 border-[#8a6a36] rounded-r text-xs font-mono text-[#1a1612]">
          “{check.surroundingWords}”
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-[#5c5248] leading-relaxed">
        {check.description}
      </p>

      {/* Interactive Reason Prompt Modal/Box (§9.4) */}
      {isPromptingReason ? (
        <div className="p-3 bg-[#f7f2ea] border border-[#d9ccb6] rounded-[2px] space-y-2 animate-in fade-in duration-100">
          <label className="text-[11px] font-semibold text-[#1a1612] block">
            Why is this not a figure? (Spec §9.4)
          </label>
          <input
            type="text"
            value={reasonText}
            onChange={e => setReasonText(e.target.value)}
            placeholder="e.g. An example amount, not a policy figure."
            className="w-full px-2.5 py-1.5 bg-white border border-[#d9ccb6] rounded text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
            autoFocus
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setIsPromptingReason(false)}
              className="px-2.5 py-1 text-xs text-[#6e6358] hover:underline cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAcknowledge}
              disabled={!reasonText.trim()}
              className="px-3 py-1 bg-[#8a6a36] hover:bg-[#72572c] disabled:opacity-50 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Save reason & acknowledge
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons Row (§9.2) */
        <div className="pt-2 border-t border-[#efe7da] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#8a8075]">
            Detected {check.createdDate || 'today'}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Action 1: It is an example / It is right here (triggers reason prompt) */}
            {(check.availableActions?.includes('is-example') || check.availableActions?.includes('is-right-here')) && (
              <button
                onClick={() => setIsPromptingReason(true)}
                className="px-2.5 py-1 bg-[#f7f2ea] hover:bg-[#ede4d4] border border-[#d9ccb6] text-xs font-medium text-[#4a4036] rounded cursor-pointer transition-colors"
              >
                {check.availableActions?.includes('is-example') ? 'It is an example' : 'It is right here'}
              </button>
            )}

            {/* Action 2: The figure (opens inspector) */}
            {check.figureKey && (
              <button
                onClick={() => onOpenFigure?.(check.figureKey!)}
                className="px-2.5 py-1 bg-[#f7f2ea] hover:bg-[#ede4d4] border border-[#d9ccb6] text-xs font-medium text-[#8a6a36] rounded cursor-pointer transition-colors flex items-center gap-1"
              >
                <span>The figure</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {/* Action 3: The page */}
            {check.targetSlug && (
              <button
                onClick={() => onOpenPage?.(check.targetSlug!)}
                className="px-2.5 py-1 bg-[#f7f2ea] hover:bg-[#ede4d4] border border-[#d9ccb6] text-xs font-medium text-[#8a6a36] rounded cursor-pointer transition-colors flex items-center gap-1"
              >
                <span>The page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => onResolve(check.id)}
              className="px-3 py-1 bg-[#8a6a36] hover:bg-[#72572c] text-white text-xs font-semibold rounded shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Check className="w-3 h-3" />
              <span>{check.actionLabel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckItemCard;
