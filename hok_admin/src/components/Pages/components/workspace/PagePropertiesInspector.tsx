/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePropertiesInspector (Spec §7.7, Page 22, Screen 20)
   Admin panel v217 · 20 October 2026
========================================================= */

import React from 'react';
import { ExternalLink, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageCardData } from '../../types';

interface PagePropertiesInspectorProps {
  page: PageCardData;
  onNavigateToChecks: () => void;
  onNavigateToReach: () => void;
}

export const PagePropertiesInspector: React.FC<PagePropertiesInspectorProps> = ({
  page,
  onNavigateToChecks,
  onNavigateToReach
}) => {
  const isPolicyOrFaq = page.group === 'policies' || page.slug === '/faqs';

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Page Header Block (Spec §7.7) */}
      <div className="p-4 rounded-[6px] bg-[#f7f2ea] border border-[#e6dccb] space-y-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#8a6a36] block">
          {page.group === 'policies' ? 'Policies' : page.group === 'content-help' ? 'Content & help' : page.group === 'not-built' ? 'Not built yet' : 'System pages'}
        </span>
        <h2 className="font-serif text-[22px] font-normal leading-tight text-[#1a1612]">
          {page.title}
        </h2>
        <p className="text-xs text-[#5c5248] leading-relaxed">
          {page.summary}
        </p>

        {/* Metadata items */}
        <div className="pt-2 border-t border-[#e6dccb] space-y-1.5 text-[11.5px]">
          <div className="flex items-center justify-between">
            <span className="text-[#6e6358]">Address</span>
            <code className="font-mono text-[#1a1612] bg-[#fffefb] px-1.5 py-0.2 rounded border border-[#d9ccb6]">
              {page.slug}
            </code>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6e6358]">Version</span>
            <span className="font-mono text-[#1a1612]">{page.version}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#6e6358]">
              {isPolicyOrFaq ? 'Last reviewed' : 'Last edited'}
            </span>
            <span className="text-[#1a1612]">{page.lastPublished}</span>
          </div>

          {page.builtFrom && (
            <div className="flex items-center justify-between">
              <span className="text-[#6e6358]">Built from</span>
              <code className="font-mono text-[10.5px] text-[#8a6a36]">
                {page.builtFrom}
              </code>
            </div>
          )}
        </div>

        {/* View on site / Mark as reviewed buttons */}
        <div className="pt-2 flex items-center gap-2">
          <a
            href={page.slug}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 px-2.5 rounded-[6px] bg-[#fffefb] border border-[#d9ccb6] hover:bg-[#efe7db] text-xs font-medium text-[#1a1612] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View on the site</span>
            <ExternalLink className="w-3 h-3 text-[#8a6a36]" />
          </a>

          {isPolicyOrFaq && (
            <button
              onClick={() => alert(`Marked ${page.title} as reviewed today.`)}
              className="py-1.5 px-2.5 rounded-[6px] bg-[#f5edd8] border border-[#c9a96e]/40 hover:bg-[#f5edd8]/80 text-xs font-medium text-[#8a6a36] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Mark as reviewed today (Full Access)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mark reviewed</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. To look at (Spec §7.7) */}
      <div className="p-3.5 rounded-[6px] bg-[#fffefb] border border-[#e6dccb] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-[#1a1612]">To look at</span>
          <button
            onClick={onNavigateToChecks}
            className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            All {page.checksCount}
          </button>
        </div>
        {page.checksCount > 0 ? (
          <div className="space-y-1.5">
            <div className="p-2 rounded bg-[#a4512f]/10 border border-[#a4512f]/20 text-[11px] text-[#a4512f] flex items-center justify-between">
              <span>{page.highChecksCount > 0 ? `${page.highChecksCount} high importance check` : `${page.checksCount} items to inspect`}</span>
              <button onClick={onNavigateToChecks} className="underline font-medium">Inspect</button>
            </div>
          </div>
        ) : (
          <p className="text-[11.5px] text-[#6b7e5a] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Nothing to look at on this page</span>
          </p>
        )}
      </div>

      {/* 3. Figures on this page (Spec §7.7) */}
      <div className="p-3.5 rounded-[6px] bg-[#fffefb] border border-[#e6dccb] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs text-[#1a1612]">Figures on this page</span>
          <button
            onClick={onNavigateToReach}
            className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
          >
            All {page.figuresCount}
          </button>
        </div>
        <p className="text-[11px] text-[#6e6358] leading-tight">
          Every figure the page prints. A figure is set once: change it here or in Figures, and every page that prints it follows on the same day.
        </p>
      </div>

      {/* 4. How it works (Spec §7.7: Verbatim guidance for editors) */}
      <div className="p-3.5 rounded-[6px] bg-[#f7f2ea]/60 border border-[#e6dccb] space-y-2 text-[11px] text-[#5c5248] leading-relaxed">
        <span className="font-semibold text-xs text-[#1a1612] block">How editing works</span>
        <p>
          Click any words on the page and type. A sentence that carries a figure shows it in gold: click the gold word to see the figure and every page that prints it. The bar above a sentence makes words bold, adds a link or puts a figure in.
        </p>
        <p className="text-[#6e6358] pt-1 border-t border-[#efe7da]">
          Where buttons lead, which questions are listed, tones and pictures are in Page settings. Nothing goes live until it is published.
        </p>
      </div>
    </div>
  );
};

export default PagePropertiesInspector;
