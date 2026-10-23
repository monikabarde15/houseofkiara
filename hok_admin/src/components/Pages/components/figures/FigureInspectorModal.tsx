/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FigureInspectorModal (Spec §5 & §10 Inspector)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState, useEffect, useRef } from 'react';
import { X, Hash, Lock, FileText, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { FigureItem } from '../../types';

interface FigureInspectorModalProps {
  figure: FigureItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveFigureValue?: (key: string, newValue: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const FigureInspectorModal: React.FC<FigureInspectorModalProps> = ({
  figure,
  isOpen,
  onClose,
  onSaveFigureValue,
  onNavigateToPage
}) => {
  const [newValue, setNewValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (figure) {
      setNewValue(String(figure.value));
      setIsSaved(false);
    }
  }, [figure]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !figure) return null;

  const isLocked = figure.locked || figure.owner === 'By law' || figure.owner === 'Counted';

  const handleSave = () => {
    if (!newValue.trim() || isLocked) return;
    onSaveFigureValue?.(figure.key, newValue.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1612]/35 backdrop-blur-[2px]">
      <div
        ref={containerRef}
        className="w-full max-w-[500px] bg-[#fffefb] border border-[#e6dccb] rounded-[8px] shadow-[0_16px_48px_rgba(26,22,18,0.18)] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#e6dccb] flex items-center justify-between bg-[#fffefb]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-[4px] bg-[#f5edd8] text-[#8a6a36]">
              <Hash className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#6e6358]">
                Figure Inspector
              </span>
              <h2 className="text-sm font-serif font-bold text-[#1a1612]">
                {figure.label}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key and Status Row */}
          <div className="p-3 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#6e6358]">Token Key</span>
              <code className="font-mono text-[11px] text-[#1a1612] bg-[#fffefb] px-1.5 py-0.5 rounded-[3px] border border-[#d9ccb6]">
                {figure.key}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#6e6358]">Owner</span>
              <span className="font-medium text-[#1a1612] flex items-center gap-1">
                {isLocked && <Lock className="w-3 h-3 text-[#8a6a36]" />}
                {figure.owner}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#6e6358]">Subject Group</span>
              <span className="capitalize text-[#5c5248] font-medium">
                {figure.subject.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Current & Edit Value */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#6e6358] font-medium block">
              Figure Value
            </label>
            {isLocked ? (
              <div className="p-3 rounded-[6px] bg-[#efe7db]/40 border border-[#d9ccb6] flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-[#1a1612]">
                  {figure.displayValue}
                </span>
                <span className="text-[11px] text-[#6e6358] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#8a6a36]" />
                  <span>Governed by {figure.owner}</span>
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-sm text-[#1a1612] font-medium focus:outline-none transition-colors"
                  placeholder="Enter figure value..."
                />
                <span className="text-[10px] text-[#6e6358] block">
                  Editing this figure will update it across all {figure.reachCount} connected pages upon review.
                </span>
              </div>
            )}
          </div>

          {/* Rules & Notes from Appendix A */}
          {figure.notes && (
            <div className="p-3 rounded-[6px] bg-[#f5edd8]/40 border border-[#c9a96e]/30 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8a6a36] block">
                Rule & Governance
              </span>
              <p className="text-[11px] text-[#5c5248] leading-relaxed">
                {figure.notes}
              </p>
            </div>
          )}

          {/* Connected Pages Reach List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#6e6358] uppercase tracking-wider">
              <span>Used on pages ({figure.reachCount})</span>
              <span className="text-[10px] text-[#b4a99e] lowercase font-normal">universal reach</span>
            </div>

            {figure.usedOnSlugs.length > 0 ? (
              <div className="divide-y divide-[#e6dccb] border border-[#e6dccb] rounded-[6px] overflow-hidden bg-[#fffefb]">
                {figure.usedOnSlugs.map(slug => (
                  <button
                    key={slug}
                    onClick={() => {
                      onNavigateToPage?.(slug);
                      onClose();
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#f7f2ea] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#8a6a36]" />
                      <span className="font-mono text-xs text-[#1a1612] group-hover:text-[#8a6a36]">
                        {slug}
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#b4a99e] group-hover:text-[#1a1612] transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center rounded-[6px] bg-[#f7f2ea] text-[#6e6358] text-[11px]">
                This figure is internal and not printed on any public page.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-[#e6dccb] bg-[#f7f2ea] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-[6px] border border-[#d9ccb6] text-xs font-medium text-[#1a1612] bg-[#fffefb] hover:bg-[#efe7db] transition-colors"
          >
            Cancel
          </button>

          {!isLocked && (
            <button
              onClick={handleSave}
              disabled={isSaved || !newValue.trim()}
              className={`px-4 py-1.5 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
                isSaved
                  ? 'bg-[#6b7e5a] text-white'
                  : 'bg-[#8a6a36] hover:bg-[#70552b] text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Value Updated</span>
                </>
              ) : (
                <span>Queue change</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FigureInspectorModal;
