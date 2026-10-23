/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: WaitingPolicyWorkspace (Spec §8.1 & §7.12, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData, FigureItem } from '../../types';
import { AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface WaitingPolicyWorkspaceProps {
  page: PageCardData;
  figures?: FigureItem[];
  onSelectFigure?: (figure: FigureItem) => void;
  onNavigateToFigures?: () => void;
}

export const WaitingPolicyWorkspace: React.FC<WaitingPolicyWorkspaceProps> = ({
  page,
  figures = [],
  onSelectFigure,
  onNavigateToFigures
}) => {
  const isCookie = page.slug === '/cookies';

  const whatItCarries = isCookie
    ? 'Cookie categories, third-party analytics, marketing consent, and browser preference controls. The Cookie Policy has no search box, by decision.'
    : 'How personal data, rental verification documents, addresses, and sizing measurements are collected, protected, and retained under the Digital Personal Data Protection Act.';

  const subject = isCookie ? 'Cookies & consent' : 'Legal details & complaints';

  // Associated figures under subject
  const relevantFigures = figures.filter(f => f.subject === (isCookie ? 'cookies' : 'legal'));

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* 1. Item to Look At Warning Banner (Spec §8.1 & Screen 58) */}
      <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#a4512f]/40 shadow-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#a4512f] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#a4512f]">
              Its words are not loaded into Pages yet
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#a4512f]/10 text-[#a4512f]">
              To look at
            </span>
          </div>
          <p className="text-[#5c5248] leading-relaxed">
            The {page.title} is built on version 3 of the policy engine. Until its page file is placed, its figures print in the register under {subject}.
          </p>
        </div>
      </div>

      {/* 2. The Short Paper on the Desk (Spec §8.1 & Screen 58) */}
      <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-8">
        {/* Document Header */}
        <header className="border-b border-[#e6dccb] pb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6e6358]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
              {page.slug}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
                {page.version}
              </span>
              <span>Waiting for page file</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            {page.title}
          </h1>

          <div className="p-4 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] space-y-2 text-xs">
            <p className="font-medium text-[#1a1612]">
              Its words load here from its page file, which is still to come.
            </p>
            <p className="text-[#5c5248] leading-relaxed">
              When the file arrives, it will load the same way the Terms did (Hero, Where to start, Opening, The essentials, Clauses, Our policies, Questions), with parts, numbered clauses and sub-clauses, and every figure as a token, with no change to the engine.
            </p>
          </div>
        </header>

        {/* What it Carries Section */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
            What it carries
          </h2>
          <p className="text-sm text-[#5c5248] leading-relaxed font-sans bg-[#fffefb] p-4 rounded-[4px] border border-[#e6dccb]">
            {whatItCarries}
          </p>
        </div>

        {/* Figures Registered Under Subject */}
        <div className="space-y-3 pt-4 border-t border-[#efe7da]">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
              Figures ready under {subject}
            </h2>
            <button
              type="button"
              onClick={onNavigateToFigures}
              className="text-xs text-[#8a6a36] hover:text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View in figures register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {relevantFigures.length > 0 ? (
            <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] text-xs">
              {relevantFigures.slice(0, 4).map(fig => (
                <div
                  key={fig.key}
                  onClick={() => onSelectFigure?.(fig)}
                  className="p-3 flex items-center justify-between hover:bg-[#fbf8f2] cursor-pointer transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[#8a6a36] text-[11px] block">{fig.key}</span>
                    <span className="text-[#1a1612] font-medium">{fig.label}</span>
                  </div>
                  <span className="font-serif text-sm font-semibold text-[#1a1612]">
                    {fig.displayValue}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6e6358] italic">
              Figures for this policy are preserved in the master register.
            </p>
          )}
        </div>
      </article>

      {/* Under-paper Note */}
      <div className="text-center text-xs text-[#6e6358] py-2">
        A waiting policy shows this short paper until its structured file is connected.
      </div>
    </div>
  );
};

export default WaitingPolicyWorkspace;