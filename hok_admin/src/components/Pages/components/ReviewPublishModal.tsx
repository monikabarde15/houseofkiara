/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ReviewPublishModal (Review Sheet, Spec §10.2, Screens 18, 19, 64)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useRef, useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Trash2,
  CheckSquare,
  Square,
  AlertCircle,
  Calendar,
  Lock
} from 'lucide-react';

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
  pendingChanges?: PendingChange[];
  onConfirmPublish?: () => void;
  userRole?: 'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer';
  accessLevel?: 'Full Access' | 'Edit' | 'View Only';
  onNavigateToWords?: (pageSlug: string, fieldId: string) => void;
}

export const ReviewPublishModal: React.FC<ReviewPublishModalProps> = ({
  isOpen,
  onClose,
  pendingChanges = [],
  onConfirmPublish,
  userRole = 'Super Admin',
  accessLevel = 'Full Access',
  onNavigateToWords
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAllSentences, setShowAllSentences] = useState(false);
  const [figureChangesDismissed, setFigureChangesDismissed] = useState(false);
  const [revertedEditIds, setRevertedEditIds] = useState<string[]>([]);
  const [isExampleTicked, setIsExampleTicked] = useState(false);
  const [isScheduledCancelled, setIsScheduledCancelled] = useState(false);

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

  if (!isOpen) return null;

  // Staged Figure Change (Screen 18, Spec §10.2)
  const stagedFigure = {
    key: 'lender_commission_rate_percent',
    name: 'Lender revenue share',
    oldValue: '70%',
    newValue: '65%',
    effective: 'From 1 December 2026. Until then the site keeps saying 70%.',
    contractualNotice: 'Orders and bookings made before then keep the old figure.',
    why: 'Winter festive rental fee update and updated arbitration clause.',
    drives: 'Lender payout calculations, List Your Piece earnings slider, and storefront commission disclosures.',
    handwrittenWarning: 'Warning: texts in other sections that type it by hand will not change by themselves.',
    sentences: [
      {
        page: '/list-your-piece',
        pageTitle: 'List Your Piece',
        part: 'Earnings calculator',
        before: 'Earn up to 70% of every rental booking fee.',
        after: 'Earn up to 65% of every rental booking fee.'
      },
      {
        page: '/how-it-works',
        pageTitle: 'How It Works',
        part: 'Lister earnings',
        before: 'Listers keep 70% of the rental fee after dry cleaning.',
        after: 'Listers keep 65% of the rental fee after dry cleaning.'
      },
      {
        page: '/terms',
        pageTitle: 'Terms & Conditions',
        part: 'Clause 7.3 (Commission)',
        before: 'The standard commission payable to owner is 70% of gross booking.',
        after: 'The standard commission payable to owner is 65% of gross booking.'
      },
      {
        page: '/seller-guidelines',
        pageTitle: 'Seller Guidelines',
        part: 'Pricing your piece',
        before: 'Your piece earns 70% whenever someone books it for a celebration.',
        after: 'Your piece earns 65% whenever someone books it for a celebration.'
      },
      {
        page: '/faqs',
        pageTitle: 'Help & FAQs',
        part: 'Question 12 (Lister payout)',
        before: 'We share 70% of the rental fee with each dress owner.',
        after: 'We share 65% of the rental fee with each dress owner.'
      }
    ]
  };

  // Staged Word Edits (Screen 18, Spec §10.2)
  const stagedEdits = [
    {
      id: 'edit_faqs_delivery',
      page: '/faqs',
      pageTitle: 'Help & FAQs',
      part: 'Answers · Question 4 (Delivery speeds)',
      before: 'Delivery usually takes 3 to 4 business days nationwide.',
      after: 'Standard delivery takes 2 to 3 business days in major metros.'
    },
    {
      id: 'edit_terms_arbitration',
      page: '/terms',
      pageTitle: 'Terms & Conditions',
      part: 'Clauses · Arbitration clause 14.2',
      before: 'Arbitration seat shall be the City of Mumbai.',
      after: 'Arbitration seat shall be Mumbai, India, under the Arbitration and Conciliation Act.'
    }
  ];

  // Example to check by hand (Spec §10.2, Screen 19)
  const stagedExample = {
    page: '/terms',
    pageTitle: 'Terms & Conditions',
    part: 'Clause 6 · Worked deposit return timeline',
    words: 'For an outfit with a ₹15,000 security hold returned within 3 days, deposit releases in 24 to 48 hours...',
    confirmationText: 'The dates in this example are worked out by hand. I have read it against the new figure and it is right.'
  };

  // New versions to be minted (Spec §10.2 & §10.3)
  const newVersionsPreview = [
    {
      page: 'Terms & Conditions',
      fromVer: 'Version 1.0',
      toVer: 'Version 1.1',
      date: 'Today, 20 October 2026',
      changes: 'Arbitration clause update and statutory citations.'
    },
    {
      page: 'Help & FAQs',
      fromVer: 'Version 6',
      toVer: 'Version 7',
      date: 'Today, 20 October 2026',
      changes: 'Standard delivery transit time updated to 2 to 3 business days.'
    },
    {
      page: 'List Your Piece',
      fromVer: 'Version 2',
      toVer: 'Version 3',
      date: '01 December 2026 (Scheduled)',
      changes: 'Lender revenue share figure adjusted to 65%.'
    }
  ];

  const activeEdits = stagedEdits.filter(e => !revertedEditIds.includes(e.id));
  const hasFigureChange = !figureChangesDismissed;
  const totalWaitingCount = (hasFigureChange ? 1 : 0) + activeEdits.length;

  // Publishing Blockers (Spec §10.2)
  const blockers: string[] = [];
  if (!isExampleTicked) {
    blockers.push('1 example to check by hand has not been ticked.');
  }
  if (accessLevel === 'Edit') {
    blockers.push('Publishing needs Full Access to Pages. These changes wait here for someone who has it.');
  } else if (accessLevel === 'View Only') {
    blockers.push('Your role has View Only access. Changes cannot be published.');
  }

  const canPublish = totalWaitingCount > 0 && blockers.length === 0 && accessLevel === 'Full Access';

  const handleRevertEdit = (id: string) => {
    setRevertedEditIds(prev => [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1a1612]/40 backdrop-blur-[2px]">
      <div
        ref={containerRef}
        className="w-full max-w-[660px] bg-[#fffefb] border-l border-[#d9ccb6] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200"
      >
        {/* Header (Spec §10.2, Screen 18) */}
        <div className="p-6 border-b border-[#e6dccb] bg-[#fffefb] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
              Staged for release · Review before it goes live
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#6e6358] hover:text-[#1a1612] hover:bg-[#efe7db]/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="font-serif text-2xl text-[#1a1612] tracking-tight">
            Review before it goes live
          </h2>
          <p className="text-xs text-[#6e6358] leading-relaxed pt-0.5">
            {totalWaitingCount > 0 ? (
              <>
                <strong className="text-[#1a1612]">
                  {hasFigureChange ? '1 figure change' : '0 figure changes'} and {activeEdits.length} edit{activeEdits.length === 1 ? '' : 's'} to the words waiting.
                </strong>{' '}
                Nothing here is live until it is published.
              </>
            ) : (
              'All changes have been published or reverted. The storefront is clean.'
            )}
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
          {totalWaitingCount === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f7f9f5] border border-[#cbd8c2] text-[#0e6245] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-[#1a1612]">All changes published</h3>
              <p className="text-xs text-[#6e6358] max-w-sm mx-auto">
                Every page, figure token, and clause is currently synchronized with the live production site.
              </p>
            </div>
          ) : (
            <>
              {/* Part 1: Figure Changes (Spec §10.2, Screen 18) */}
              {hasFigureChange && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e6dccb] pb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                      Figures waiting to change (1)
                    </span>
                    <button
                      onClick={() => setFigureChangesDismissed(true)}
                      className="text-xs text-[#a4512f] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Discard figure change</span>
                    </button>
                  </div>

                  <div className="p-4 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-mono text-[#8a8075] uppercase">
                          Figure: {stagedFigure.key}
                        </div>
                        <h4 className="font-serif text-base text-[#1a1612] font-semibold mt-0.5">
                          {stagedFigure.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-sm bg-white px-3 py-1.5 rounded border border-[#d9ccb6]">
                        <span className="line-through text-[#a4512f]">{stagedFigure.oldValue}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8a6a36]" />
                        <span className="font-bold text-[#0e6245]">{stagedFigure.newValue}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#f7f2ea] border border-[#e6dccb] rounded space-y-1 text-xs">
                      <div className="flex items-start gap-1.5 text-[#1a1612] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#8a6a36] shrink-0 mt-0.5" />
                        <span>{stagedFigure.effective}</span>
                      </div>
                      <p className="text-[11px] text-[#6e6358] pl-5">
                        {stagedFigure.contractualNotice}
                      </p>
                    </div>

                    <div className="text-xs text-[#4a4036]">
                      <strong className="text-[#1a1612]">Why:</strong> {stagedFigure.why}
                    </div>

                    {/* Sentences before and after diff (Spec §10.2: "16 sentences on 5 pages") */}
                    <div className="space-y-2 pt-2 border-t border-[#e6dccb]">
                      <div className="flex items-center justify-between text-[11px] text-[#6e6358]">
                        <span className="font-semibold text-[#1a1612]">
                          5 sentences on 5 pages affected:
                        </span>
                        <button
                          onClick={() => setShowAllSentences(!showAllSentences)}
                          className="text-[#8a6a36] hover:underline cursor-pointer"
                        >
                          {showAllSentences ? 'Show fewer' : 'Show all'}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(showAllSentences ? stagedFigure.sentences : stagedFigure.sentences.slice(0, 2)).map((s, idx) => (
                          <div key={idx} className="p-2.5 bg-white border border-[#e6dccb] rounded text-xs space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-[#8a6a36] font-mono">
                              <span>{s.pageTitle} ({s.page})</span>
                              <span>{s.part}</span>
                            </div>
                            <div className="text-[11px] text-[#a4512f] line-through font-mono">
                              {s.before}
                            </div>
                            <div className="text-[11px] text-[#0e6245] font-mono">
                              {s.after}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#e6dccb] space-y-1 text-[11px] text-[#6e6358]">
                      <div>
                        <strong className="text-[#1a1612]">Behind the scenes:</strong> {stagedFigure.drives}
                      </div>
                      <div className="text-[#a4512f] italic">
                        {stagedFigure.handwrittenWarning}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Part 2: Examples to check by hand (Spec §10.2, Screen 19) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#e6dccb] pb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                    Examples to check by hand (1)
                  </span>
                  <span className="text-[11px] text-[#6e6358]">Screen 19</span>
                </div>

                <div className={`p-4 rounded-[2px] border transition-colors space-y-3 ${
                  isExampleTicked ? 'bg-[#f7f9f5] border-[#cbd8c2]' : 'bg-[#fffbf5] border-[#e8d5bc]'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono text-[#8a6a36]">
                        {stagedExample.pageTitle} · {stagedExample.part}
                      </div>
                      <p className="text-xs text-[#1a1612] italic mt-1 font-serif">
                        “{stagedExample.words}”
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToWords?.('/terms', 'clause-6')}
                      className="px-2 py-1 text-xs text-[#8a6a36] hover:bg-[#ede4d4] rounded border border-[#d9ccb6] cursor-pointer shrink-0"
                    >
                      Open
                    </button>
                  </div>

                  <div
                    onClick={() => setIsExampleTicked(!isExampleTicked)}
                    className="flex items-start gap-2.5 pt-2 border-t border-[#efe7da] cursor-pointer select-none"
                  >
                    {isExampleTicked ? (
                      <CheckSquare className="w-4 h-4 text-[#0e6245] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8a6a36] shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs text-[#1a1612] font-medium leading-snug">
                      {stagedExample.confirmationText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Part 3: Edits to the words waiting (Spec §10.2, Screen 18) */}
              {activeEdits.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e6dccb] pb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                      Edits to the words ({activeEdits.length})
                    </span>
                    <button
                      onClick={() => setRevertedEditIds(stagedEdits.map(e => e.id))}
                      className="text-xs text-[#a4512f] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revert all edits</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeEdits.map(edit => (
                      <div
                        key={edit.id}
                        className="p-4 bg-white border border-[#d9ccb6] rounded-[2px] shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[10px] font-mono text-[#8a6a36]">
                              {edit.pageTitle} · {edit.page}
                            </div>
                            <h4 className="font-serif text-sm font-semibold text-[#1a1612] mt-0.5">
                              {edit.part}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleRevertEdit(edit.id)}
                            className="text-xs text-[#8a6a36] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Revert</span>
                          </button>
                        </div>

                        <div className="p-3 bg-[#fbf9f5] border border-[#e6dccb] rounded space-y-1.5 font-mono text-xs">
                          <div className="text-[#a4512f] line-through bg-[#fdf2ee] p-1.5 rounded">
                            {edit.before}
                          </div>
                          <div className="text-[#0e6245] bg-[#f0f6ed] p-1.5 rounded">
                            {edit.after}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Part 4: New versions that will be minted (Spec §10.2 & §10.3) */}
              <div className="space-y-3">
                <div className="border-b border-[#e6dccb] pb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                    New versions to be created
                  </span>
                </div>

                <div className="space-y-2">
                  {newVersionsPreview.map((ver, idx) => (
                    <div key={idx} className="p-3 bg-white border border-[#e6dccb] rounded-[2px] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1a1612]">{ver.page}</span>
                        <span className="font-mono text-[11px] text-[#8a6a36]">
                          {ver.fromVer} → {ver.toVer}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6e6358]">{ver.date}</div>
                      <p className="text-[11px] text-[#4a4036] leading-relaxed">
                        Changes: {ver.changes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 5: Going live later (Spec §10.2) */}
              {!isScheduledCancelled && (
                <div className="p-4 bg-[#f4f7f9] border border-[#cbd8e2] rounded-[2px] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-[#244b67]">
                      <Calendar className="w-3.5 h-3.5 text-[#3d6e8e]" />
                      <span>Going live later</span>
                    </div>

                    {accessLevel === 'Full Access' && (
                      <button
                        onClick={() => setIsScheduledCancelled(true)}
                        className="text-[11px] text-[#a4512f] hover:underline cursor-pointer"
                      >
                        Cancel it (Full Access)
                      </button>
                    )}
                  </div>
                  <p className="text-[#3c566b] leading-relaxed">
                    DPDP Act statutory citations and Festive Season commission rate changes are scheduled for 01 December 2026.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Blockers & Publish Actions (Spec §10.2 & §11, Screens 64) */}
        <div className="p-6 border-t border-[#e6dccb] bg-[#f7f2ea] space-y-4">
          {/* Blockers Callout */}
          {blockers.length > 0 && totalWaitingCount > 0 && (
            <div className="p-3 bg-[#fdf2ee] border border-[#f2cfc2] rounded-[2px] space-y-1 text-xs text-[#a4512f]">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Before publishing:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {blockers.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Access status line */}
          <div className="flex items-center justify-between text-[11px] text-[#6e6358]">
            <span>Active role: <strong className="text-[#1a1612]">{userRole}</strong> ({accessLevel})</span>
            {accessLevel === 'Edit' && (
              <span className="text-[#a4512f] font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Publishing requires Full Access</span>
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[2px] border border-[#d9ccb6] text-xs font-medium text-[#1a1612] bg-white hover:bg-[#efe7db] transition-colors cursor-pointer"
            >
              Keep editing
            </button>

            {totalWaitingCount > 0 && (
              <button
                onClick={() => {
                  if (canPublish) {
                    onConfirmPublish?.();
                    onClose();
                  }
                }}
                disabled={!canPublish}
                className={`px-5 py-2 rounded-[2px] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  canPublish
                    ? 'bg-[#8a6a36] hover:bg-[#72572c] text-white shadow-xs'
                    : 'bg-[#d9ccb6] text-[#6e6358] opacity-60 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish {totalWaitingCount} change{totalWaitingCount === 1 ? '' : 's'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishModal;
