/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WorkspaceChecksTab (Spec §9, Pages 50–53, Screen 32)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useMemo, useState } from 'react';
import { PageCardData, CheckItem } from '../../types';
import { CheckItemCard } from './CheckItemCard';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Filter, BookOpen } from 'lucide-react';

interface WorkspaceChecksTabProps {
  page: PageCardData;
  checks: CheckItem[];
  onResolveCheck: (checkId: string) => void;
  onUndoCheck?: (checkId: string) => void;
  onAcknowledgeCheck?: (checkId: string, reason: string) => void;
  onSwitchToEdit: () => void;
  onOpenWords?: (check: CheckItem) => void;
  onOpenFigure?: (figureKey: string) => void;
  onOpenPage?: (slug: string) => void;
}

export const WorkspaceChecksTab: React.FC<WorkspaceChecksTabProps> = ({
  page,
  checks,
  onResolveCheck,
  onUndoCheck,
  onAcknowledgeCheck,
  onSwitchToEdit,
  onOpenWords,
  onOpenFigure,
  onOpenPage
}) => {
  const [activeTab, setActiveTab] = useState<'unresolved' | 'acknowledged' | 'resolved'>('unresolved');
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Filter checks belonging to this page
  const pageChecks = useMemo(() => {
    return checks.filter(c => c.pageSlug === page.slug);
  }, [checks, page.slug]);

  // Active Unresolved (neither resolved nor acknowledged)
  const unresolvedChecks = useMemo(() => {
    const list = pageChecks.filter(c => !c.resolved && !c.acknowledged);
    const order = { high: 0, medium: 1, low: 2 };
    return list.sort((a, b) => order[a.importance] - order[b.importance]);
  }, [pageChecks]);

  // Acknowledged (§9.4)
  const acknowledgedChecks = useMemo(() => {
    return pageChecks.filter(c => c.acknowledged);
  }, [pageChecks]);

  // Resolved in this draft
  const resolvedChecks = useMemo(() => {
    return pageChecks.filter(c => c.resolved);
  }, [pageChecks]);

  // Apply importance filter
  const displayedChecks = useMemo(() => {
    let targetList = activeTab === 'unresolved' ? unresolvedChecks : activeTab === 'acknowledged' ? acknowledgedChecks : resolvedChecks;
    if (importanceFilter !== 'all') {
      targetList = targetList.filter(c => c.importance === importanceFilter);
    }
    return targetList;
  }, [activeTab, unresolvedChecks, acknowledgedChecks, resolvedChecks, importanceFilter]);

  const highCount = unresolvedChecks.filter(c => c.importance === 'high').length;
  const mediumCount = unresolvedChecks.filter(c => c.importance === 'medium').length;
  const lowCount = unresolvedChecks.filter(c => c.importance === 'low').length;

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Health Overview Card */}
      <div className="p-6 rounded-[2px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e6dccb]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
              To look at · {page.slug}
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1a1612]">
              {page.title} Audit
            </h2>
          </div>

          <button
            onClick={onSwitchToEdit}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8a6a36] hover:text-[#1a1612] bg-[#f7f2ea] hover:bg-[#ede4d4] px-3 py-1.5 rounded-[2px] border border-[#d9ccb6] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to paper</span>
          </button>
        </div>

        {/* Severity Count Pills (Spec §9.1) */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => { setActiveTab('unresolved'); setImportanceFilter('high'); }}
            className={`p-3 rounded-[2px] border flex items-center justify-between transition-colors cursor-pointer ${
              importanceFilter === 'high' && activeTab === 'unresolved'
                ? 'bg-[#fcf2ed] border-[#f2cfc2]'
                : 'bg-[#f7f2ea] border-[#e6dccb] hover:bg-[#ede4d4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b85c38]" />
              <span className="text-[#5c5248]">High</span>
            </div>
            <span className="font-mono font-semibold text-[#b85c38]">{highCount}</span>
          </button>

          <button
            onClick={() => { setActiveTab('unresolved'); setImportanceFilter('medium'); }}
            className={`p-3 rounded-[2px] border flex items-center justify-between transition-colors cursor-pointer ${
              importanceFilter === 'medium' && activeTab === 'unresolved'
                ? 'bg-[#fdf8ed] border-[#f7e0b5]'
                : 'bg-[#f7f2ea] border-[#e6dccb] hover:bg-[#ede4d4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d19a3c]" />
              <span className="text-[#5c5248]">Medium</span>
            </div>
            <span className="font-mono font-semibold text-[#d19a3c]">{mediumCount}</span>
          </button>

          <button
            onClick={() => { setActiveTab('unresolved'); setImportanceFilter('low'); }}
            className={`p-3 rounded-[2px] border flex items-center justify-between transition-colors cursor-pointer ${
              importanceFilter === 'low' && activeTab === 'unresolved'
                ? 'bg-[#f7f2ea] border-[#c9beaf]'
                : 'bg-[#f7f2ea] border-[#e6dccb] hover:bg-[#ede4d4]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8a8075]" />
              <span className="text-[#5c5248]">Low</span>
            </div>
            <span className="font-mono font-semibold text-[#5c5248]">{lowCount}</span>
          </button>
        </div>
      </div>

      {/* Tabs Strip: To look at vs Acknowledged vs Resolved */}
      <div className="flex items-center justify-between border-b border-[#e6dccb] pb-2">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => { setActiveTab('unresolved'); setImportanceFilter('all'); }}
            className={`px-3 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer ${
              activeTab === 'unresolved'
                ? 'bg-[#1a1612] text-white'
                : 'bg-[#f7f2ea] text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            To look at ({unresolvedChecks.length})
          </button>
          <button
            onClick={() => { setActiveTab('acknowledged'); setImportanceFilter('all'); }}
            className={`px-3 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer ${
              activeTab === 'acknowledged'
                ? 'bg-[#1a1612] text-white'
                : 'bg-[#f7f2ea] text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Acknowledged ({acknowledgedChecks.length})
          </button>
          <button
            onClick={() => { setActiveTab('resolved'); setImportanceFilter('all'); }}
            className={`px-3 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer ${
              activeTab === 'resolved'
                ? 'bg-[#1a1612] text-white'
                : 'bg-[#f7f2ea] text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Resolved ({resolvedChecks.length})
          </button>
        </div>

        {/* Importance Filter pill */}
        {importanceFilter !== 'all' && (
          <button
            onClick={() => setImportanceFilter('all')}
            className="text-[11px] text-[#8a6a36] hover:underline cursor-pointer"
          >
            Clear {importanceFilter} filter
          </button>
        )}
      </div>

      {/* Checks List */}
      <div className="space-y-3">
        {displayedChecks.length === 0 ? (
          <div className="p-8 text-center bg-[#fffefb] border border-[#e6dccb] rounded-[2px] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#0e6245] mx-auto opacity-70" />
            <h3 className="font-serif text-base text-[#1a1612]">
              {activeTab === 'unresolved'
                ? 'No items to look at'
                : activeTab === 'acknowledged'
                ? 'No acknowledged items on this page'
                : 'No resolved items yet'}
            </h3>
            <p className="text-xs text-[#6e6358]">
              {activeTab === 'unresolved'
                ? 'Every sentence, figure token and cross-link on this page is clean.'
                : 'Items marked with “It is an example” or “It is right here” appear in Acknowledged.'}
            </p>
          </div>
        ) : (
          displayedChecks.map(chk => (
            <CheckItemCard
              key={chk.id}
              check={chk}
              onResolve={onResolveCheck}
              onUndo={onUndoCheck}
              onAcknowledge={onAcknowledgeCheck}
              onOpenWords={onOpenWords}
              onOpenFigure={onOpenFigure}
              onOpenPage={onOpenPage}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WorkspaceChecksTab;
