/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: InternalLinksCard (Spec §6.3)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useState } from 'react';
import { Link2, AlertCircle, ArrowRight, CheckCircle2, Check, CornerDownRight } from 'lucide-react';
import { InternalCrossLinkItem } from '../../types';

interface InternalLinksCardProps {
  links: InternalCrossLinkItem[];
  onRelink?: (id: string, newTarget: string) => void;
  onNavigateToPage?: (slug: string) => void;
}

export const InternalLinksCard: React.FC<InternalLinksCardProps> = ({
  links,
  onRelink,
  onNavigateToPage
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTarget, setNewTarget] = useState('');

  const handleStartRelink = (item: InternalCrossLinkItem) => {
    setEditingId(item.id);
    setNewTarget(item.targetSlug + (item.targetClauseAnchor || ''));
  };

  const handleSaveRelink = (id: string) => {
    if (!newTarget.trim()) return;
    onRelink?.(id, newTarget.trim());
    setEditingId(null);
  };

  return (
    <div className="rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#e6dccb] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-[4px] bg-[#f5edd8] text-[#8a6a36]">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              2. Links pointing into other pages
            </h3>
            <p className="text-[11px] text-[#6e6358] mt-0.5">
              Cross-references between policy clauses, FAQs, and guide pages.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#6e6358] bg-[#efe7db] px-2 py-0.5 rounded-[4px]">
          {links.length} cross-links
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#e6dccb]/70">
        {links.map(link => {
          const isProblem = link.health !== 'ok';
          const isEditing = editingId === link.id;

          return (
            <div key={link.id} className="p-4 hover:bg-[#f7f2ea]/40 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Source Page */}
                  <button
                    onClick={() => onNavigateToPage?.(link.sourceSlug)}
                    className="font-mono text-[11px] bg-[#f7f2ea] text-[#1a1612] px-2 py-0.5 rounded-[4px] border border-[#d9ccb6] hover:bg-[#efe7db] transition-colors cursor-pointer"
                  >
                    {link.sourceSlug}
                  </button>

                  <span className="text-[#6e6358]">links via</span>
                  <span className="italic text-[#1a1612] font-serif">&ldquo;{link.sourceAnchorText}&rdquo;</span>
                  <ArrowRight className="w-3 h-3 text-[#8a6a36]" />

                  {/* Target Page */}
                  <span className="font-mono text-[11px] bg-[#fffefb] text-[#8a6a36] px-2 py-0.5 rounded-[4px] border border-[#c9a96e]/50 font-semibold">
                    {link.targetSlug}{link.targetClauseAnchor || ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isProblem ? (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#a4512f]/10 text-[#a4512f] border border-[#a4512f]/30 font-mono text-[10px] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      <span>{link.health === 'missing-clause' ? 'Anchor Missing' : 'Unbuilt Target'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30 font-mono text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Anchor Valid</span>
                    </span>
                  )}

                  {isProblem && !isEditing && (
                    <button
                      onClick={() => handleStartRelink(link)}
                      className="px-2.5 py-1 rounded-[4px] text-[11px] font-medium text-[#1a1612] bg-[#f7f2ea] border border-[#d9ccb6] hover:bg-[#efe7db] transition-colors cursor-pointer"
                    >
                      Relink
                    </button>
                  )}
                </div>
              </div>

              {/* Problem detail message */}
              {link.problemDetails && (
                <div className="flex items-start gap-1.5 text-[11px] text-[#a4512f] bg-[#a4512f]/5 p-2 rounded-[4px] border border-[#a4512f]/20">
                  <CornerDownRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{link.problemDetails}</span>
                </div>
              )}

              {/* Inline Relink Edit Bar */}
              {isEditing && (
                <div className="p-3 rounded-[6px] bg-[#f5edd8]/40 border border-[#c9a96e]/40 flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    value={newTarget}
                    onChange={e => setNewTarget(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-[4px] bg-[#fffefb] border border-[#d9ccb6] text-xs text-[#1a1612] focus:outline-none focus:border-[#8a6a36]"
                    placeholder="e.g. /deposit-policy#section-holds"
                  />
                  <button
                    onClick={() => handleSaveRelink(link.id)}
                    className="px-3 py-1 rounded-[4px] bg-[#8a6a36] text-white font-medium hover:bg-[#70552b] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save link</span>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2.5 py-1 rounded-[4px] text-[#6e6358] hover:text-[#1a1612] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InternalLinksCard;
