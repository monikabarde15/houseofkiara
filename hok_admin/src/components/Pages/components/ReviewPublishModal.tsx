/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ReviewPublishModal (Spec §10.2 & Screen 18, 64)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useRef, useEffect } from 'react';
import { X, Check, AlertCircle, Sparkles } from 'lucide-react';

interface PendingChange {
  id: string;
  type: 'figure' | 'page' | 'check';
  title: string;
  details: string;
  source: string;
}

interface ReviewPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingChanges: PendingChange[];
  onConfirmPublish?: () => void;
  userRole?: 'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer';
  accessLevel?: 'Full Access' | 'Edit' | 'View Only';
  onNavigateToWords?: (slug: string) => void;
}

export const ReviewPublishModal: React.FC<ReviewPublishModalProps> = ({
  isOpen,
  onClose,
  pendingChanges,
  onConfirmPublish,
  userRole = 'Super Admin',
  accessLevel = 'Full Access',
  onNavigateToWords
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const canPublish = accessLevel === 'Full Access';
  const changesCount = pendingChanges.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
      <div
        ref={modalRef}
        className="w-full max-w-xl h-full sm:h-auto sm:max-h-[90vh] bg-[#fffefb] sm:rounded-[8px] shadow-2xl border border-[#d9ccb6] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6dccb] flex items-center justify-between bg-[#fffefb] shrink-0">
          <div>
            <h2 className="font-serif text-xl font-normal text-[#1a1612]">
              Review before it goes live
            </h2>
            <p className="text-xs text-[#6e6358] mt-0.5">
              {changesCount === 0
                ? 'No changes are waiting to be published.'
                : `${changesCount} change${changesCount === 1 ? '' : 's'} waiting. Nothing here is live until it is published.`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6e6358] hover:text-[#1a1612] p-1.5 rounded hover:bg-[#efe7db] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#f7f2ea]/40">
          {changesCount === 0 ? (
            <div className="py-12 text-center text-xs text-[#6e6358]">
              <Sparkles className="w-8 h-8 text-[#8a6a36] mx-auto mb-2 opacity-60" />
              <p className="font-medium text-[#1a1612]">All settled</p>
              <p className="mt-1">Every page is serving its published figures and words.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="block text-xs font-semibold text-[#8a6a36] uppercase tracking-wider">
                Changes waiting ({changesCount})
              </span>
              <div className="space-y-2.5">
                {pendingChanges.map(change => (
                  <div
                    key={change.id}
                    className="p-3.5 bg-white border border-[#e6dccb] rounded-[6px] space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1a1612]">{change.title}</span>
                      <span className="text-[11px] font-mono text-[#8a6a36] bg-[#f7f2ea] px-2 py-0.5 rounded border border-[#d9ccb6]">
                        {change.source}
                      </span>
                    </div>
                    <p className="text-xs text-[#5c5248] leading-relaxed">
                      {change.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access Note (§11 & Screen 64) */}
          {!canPublish && changesCount > 0 && (
            <div className="p-3.5 bg-[#fdf8e6] border border-[#eedca6] rounded-[6px] text-xs text-[#7d5e16] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#9c7826] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Publishing needs Full Access to Pages.</span>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  Your current role ({userRole}) has Edit permissions. These changes will wait here for someone with Full Access to review and publish.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e6dccb] bg-[#fffefb] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[6px] text-xs font-medium text-[#5c5248] hover:text-[#1a1612] hover:bg-[#efe7db] transition-colors cursor-pointer"
          >
            Keep editing
          </button>

          {changesCount > 0 && (
            <button
              onClick={() => {
                if (canPublish) {
                  onConfirmPublish?.();
                  onClose();
                }
              }}
              disabled={!canPublish}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                canPublish
                  ? 'bg-[#c9a96e] hover:bg-[#b89558] text-[#1a1612] border border-[#b89558]'
                  : 'bg-[#efe7db] text-[#8a7f72] cursor-not-allowed border border-[#d9ccb6]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{canPublish ? `Publish ${changesCount} changes` : 'Publishing locked'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishModal;
