/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WorkspaceHistoryTab (Spec §11 Revisions & Diff)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../../types';
import { History, Clock, ArrowLeft, RotateCcw, CheckCircle2, ChevronRight, FileText, User } from 'lucide-react';

interface RevisionRecord {
  version: string;
  publishedDate: string;
  author: string;
  summary: string;
  wordsCount: number;
  figuresCount: number;
  isCurrent?: boolean;
  diffSnippet?: {
    added: string[];
    removed: string[];
  };
}

interface WorkspaceHistoryTabProps {
  page: PageCardData;
  onRestoreRevision?: (version: string) => void;
  onSwitchToEdit: () => void;
}

export const WorkspaceHistoryTab: React.FC<WorkspaceHistoryTabProps> = ({
  page,
  onRestoreRevision,
  onSwitchToEdit
}) => {
  // Generate realistic historical revisions for the selected page
  const revisions: RevisionRecord[] = [
    {
      version: page.version,
      publishedDate: `${page.lastPublished}, 14:30 IST`,
      author: page.lastEditor,
      summary: 'Updated standard delivery window and synchronized customer care email address tokens.',
      wordsCount: page.wordsCount,
      figuresCount: page.figuresCount,
      isCurrent: true,
      diffSnippet: {
        added: ['Standard delivery window 3 to 5 business days', 'support email care@houseofkiara.com'],
        removed: ['Standard delivery window 3 to 4 days', 'support email help@houseofkiara.com']
      }
    },
    {
      version: 'v3.5',
      publishedDate: '28 Sep 2026, 11:15 IST',
      author: 'Priya R.',
      summary: 'Adjusted luxury piece deposit threshold and added same-day dispatch cutoff reference.',
      wordsCount: page.wordsCount - 120,
      figuresCount: page.figuresCount - 1,
      diffSnippet: {
        added: ['Luxury pieces fixed deposit ₹5,000', '12:00 noon dispatch cut-off'],
        removed: ['Luxury pieces fixed deposit ₹4,500', '11:00 AM dispatch cut-off']
      }
    },
    {
      version: 'v3.0',
      publishedDate: '15 Aug 2026, 09:40 IST',
      author: 'Legal Counsel',
      summary: 'Statutory alignment with DPDP Act 2023 Rules and Consumer Protection E-Commerce Rules.',
      wordsCount: page.wordsCount - 340,
      figuresCount: page.figuresCount - 3,
      diffSnippet: {
        added: ['Statutory transaction retention 8 years', 'DPDP Act 2023 compliance'],
        removed: ['Data retention 5 years', 'IT Act 2000 general notice']
      }
    },
    {
      version: 'v2.0',
      publishedDate: '01 Jun 2026, 16:00 IST',
      author: 'Aman S.',
      summary: 'Initial production publication following commercial beta launch.',
      wordsCount: page.wordsCount - 680,
      figuresCount: page.figuresCount - 5
    }
  ];

  const [selectedVersion, setSelectedVersion] = useState<string>(revisions[0].version);
  const activeRev = revisions.find(r => r.version === selectedVersion) || revisions[0];

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header Overview Card */}
      <div className="p-6 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e6dccb]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8a6a36] font-medium">
              Revision Audit Trail · {page.slug}
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1a1612]">
              History & Version Diff
            </h2>
          </div>

          <button
            onClick={onSwitchToEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8a6a36] hover:text-[#1a1612] bg-[#f5edd8] hover:bg-[#f5edd8]/80 px-3 py-1.5 rounded-[6px] border border-[#c9a96e]/40 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Paper</span>
          </button>
        </div>

        <p className="text-xs text-[#5c5248]">
          Review past published iterations, inspect word and figure diffs, or restore an earlier version.
        </p>
      </div>

      {/* Main Revision Inspector Layout */}
      <div className="space-y-4">
        {/* Revision Selector List */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#1a1612] px-1">
            Published Revisions ({revisions.length})
          </span>

          <div className="divide-y divide-[#e6dccb] border border-[#e6dccb] rounded-[8px] bg-[#fffefb] overflow-hidden">
            {revisions.map(rev => {
              const isSelected = rev.version === selectedVersion;

              return (
                <div
                  key={rev.version}
                  onClick={() => setSelectedVersion(rev.version)}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#f5edd8]/40' : 'hover:bg-[#f7f2ea]/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-mono text-xs px-2 py-0.5 rounded-[4px] font-semibold border ${
                          rev.isCurrent
                            ? 'bg-[#1a1612] text-white border-[#1a1612]'
                            : 'bg-[#f7f2ea] text-[#5c5248] border-[#d9ccb6]'
                        }`}
                      >
                        {rev.version}
                      </span>

                      {rev.isCurrent && (
                        <span className="text-[10px] font-medium text-[#6b7e5a] bg-[#6b7e5a]/10 px-2 py-0.5 rounded-[4px] border border-[#6b7e5a]/30">
                          Current live
                        </span>
                      )}

                      <span className="text-xs font-medium text-[#1a1612]">
                        {rev.publishedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#6e6358]">
                      <span className="flex items-center gap-1 text-[11px]">
                        <User className="w-3 h-3 text-[#b4a99e]" />
                        <span>{rev.author}</span>
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{rev.wordsCount.toLocaleString()} words</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#5c5248] leading-relaxed">
                    {rev.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Revision Diff Card */}
        <div className="p-5 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e6dccb]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#1a1612] bg-[#f7f2ea] px-2 py-0.5 rounded-[4px] border border-[#d9ccb6]">
                {activeRev.version} Diff
              </span>
              <span className="text-xs text-[#6e6358]">
                Published by {activeRev.author} on {activeRev.publishedDate}
              </span>
            </div>

            {!activeRev.isCurrent && (
              <button
                onClick={() => onRestoreRevision?.(activeRev.version)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-semibold bg-[#8a6a36] hover:bg-[#70552b] text-white transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore this revision</span>
              </button>
            )}
          </div>

          {activeRev.diffSnippet ? (
            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6b7e5a] block">
                  + Additions & Token Updates
                </span>
                <div className="space-y-1">
                  {activeRev.diffSnippet.added.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-[4px] bg-[#6b7e5a]/10 border border-[#6b7e5a]/30 text-[#1a1612] font-mono text-[11px]"
                    >
                      + {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#b85c38] block">
                  - Removed or Superseded Copy
                </span>
                <div className="space-y-1">
                  {activeRev.diffSnippet.removed.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-[4px] bg-[#b85c38]/10 border border-[#b85c38]/30 text-[#5c5248] font-mono text-[11px] line-through"
                    >
                      - {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#6e6358] py-4 text-center">
              Initial base document release. No previous diff recorded.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHistoryTab;
