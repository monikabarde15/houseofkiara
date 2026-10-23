/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WorkspaceReachTab (Spec §14.1 Document Reach)
   Admin panel v217 · 20 October 2026
========================================================= */

import React, { useMemo } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { Network, Hash, Link2, ExternalLink, Mail, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

interface WorkspaceReachTabProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  onNavigateToPage: (slug: string) => void;
  onSwitchToEdit: () => void;
}

export const WorkspaceReachTab: React.FC<WorkspaceReachTabProps> = ({
  page,
  figures,
  onSelectFigure,
  onNavigateToPage,
  onSwitchToEdit
}) => {
  // Find all figures bound on this specific page
  const pageFigures = useMemo(() => {
    return figures.filter(f => f.usedOnSlugs.includes(page.slug));
  }, [figures, page.slug]);

  // Realistic cross-link graph for this page
  const inboundPages = useMemo(() => {
    const list = [
      { slug: '/faqs', title: 'Help & FAQs', anchor: 'detailed policy terms' },
      { slug: '/how-it-works', title: 'How It Works', anchor: 'customer obligations' },
      { slug: '/pricing', title: 'Pricing & Fees', anchor: 'statutory deposit terms' },
      { slug: '/contact', title: 'Contact Us', anchor: 'dispute escalation framework' }
    ];
    return list.filter(item => item.slug !== page.slug);
  }, [page.slug]);

  const outboundPages = useMemo(() => {
    return (page.connectedSlugs || ['/privacy', '/refunds', '/deposit-policy']).map(slug => ({
      slug,
      anchor: `section reference to ${slug}`
    }));
  }, [page]);

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header Overview Card */}
      <div className="p-6 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e6dccb]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8a6a36] font-medium">
              System Reach & Graph · {page.slug}
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1a1612]">
              Connectivity & Reach Network
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
          Map of all single-source-of-truth figure tokens, internal cross-links, and external endpoints embedded in this document.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] flex items-center justify-between">
            <span className="text-[#5c5248]">Bound figures</span>
            <span className="font-mono font-bold text-[#8a6a36]">{pageFigures.length}</span>
          </div>

          <div className="p-3 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] flex items-center justify-between">
            <span className="text-[#5c5248]">Inbound links</span>
            <span className="font-mono font-bold text-[#1a1612]">{inboundPages.length}</span>
          </div>

          <div className="p-3 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] flex items-center justify-between">
            <span className="text-[#5c5248]">Outbound links</span>
            <span className="font-mono font-bold text-[#1a1612]">{outboundPages.length}</span>
          </div>
        </div>
      </div>

      {/* 1. Bound Figures on This Document */}
      <div className="p-5 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e6dccb]">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#8a6a36]" />
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              Bound Figure Tokens ({pageFigures.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#6e6358]">Click to inspect in right panel</span>
        </div>

        <div className="divide-y divide-[#e6dccb]/70">
          {pageFigures.map(fig => (
            <div
              key={fig.key}
              onClick={() => onSelectFigure(fig)}
              className="py-2.5 flex items-center justify-between hover:bg-[#f5edd8]/40 px-2 rounded-[4px] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[3px] bg-[#f5edd8] text-[#8a6a36] border border-[#c9a96e]/40 shrink-0">
                  {fig.displayValue}
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-xs text-[#1a1612] group-hover:text-[#8a6a36] transition-colors truncate">
                    {fig.label}
                  </div>
                  <code className="text-[10px] font-mono text-[#6e6358] block truncate">
                    {fig.key}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-xs">
                <span className="text-[10px] font-mono text-[#6e6358] bg-[#f7f2ea] px-2 py-0.5 rounded-[4px] border border-[#e6dccb]">
                  reach {fig.reachCount} pages
                </span>
                <span className="text-[10px] font-mono text-[#5c5248] bg-[#efe7db] px-1.5 py-0.5 rounded-[4px]">
                  {fig.owner}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#b4a99e] group-hover:text-[#1a1612] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Inbound Cross-Links (Pointing In) */}
      <div className="p-5 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e6dccb]">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#8a6a36]" />
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              Inbound Cross-References ({inboundPages.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#6e6358]">Pages pointing into {page.slug}</span>
        </div>

        <div className="divide-y divide-[#e6dccb]/70">
          {inboundPages.map(item => (
            <div
              key={item.slug}
              onClick={() => onNavigateToPage(item.slug)}
              className="py-2.5 flex items-center justify-between hover:bg-[#f7f2ea] px-2 rounded-[4px] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs">
                <code className="font-mono text-[11px] text-[#1a1612] bg-[#f7f2ea] px-1.5 py-0.5 rounded-[3px] border border-[#d9ccb6]">
                  {item.slug}
                </code>
                <span className="font-medium text-[#1a1612]">{item.title}</span>
                <span className="text-[#6e6358]">links via</span>
                <span className="italic text-[#5c5248] font-serif">&ldquo;{item.anchor}&rdquo;</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#b4a99e] group-hover:text-[#1a1612] transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Outbound Cross-Links (Pointing Out) */}
      <div className="p-5 rounded-[8px] bg-[#fffefb] border border-[#e6dccb] shadow-[0_1px_3px_rgba(26,22,18,0.03)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e6dccb]">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#8a6a36]" />
            <h3 className="text-sm font-serif font-bold text-[#1a1612]">
              Outbound Page References ({outboundPages.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#6e6358]">Pages linked from this text</span>
        </div>

        <div className="divide-y divide-[#e6dccb]/70">
          {outboundPages.map(item => (
            <div
              key={item.slug}
              onClick={() => onNavigateToPage(item.slug)}
              className="py-2.5 flex items-center justify-between hover:bg-[#f7f2ea] px-2 rounded-[4px] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#6e6358]">Points to</span>
                <code className="font-mono text-[11px] text-[#8a6a36] bg-[#f5edd8] px-1.5 py-0.5 rounded-[3px] border border-[#c9a96e]/40 font-semibold">
                  {item.slug}
                </code>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#b4a99e] group-hover:text-[#1a1612] transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceReachTab;
