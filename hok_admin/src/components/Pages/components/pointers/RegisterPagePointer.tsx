/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RegisterPagePointer (Spec §12, Screens 68, 71, 74)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { PageCardData } from '../../types';

interface RegisterPagePointerProps {
  page: PageCardData;
  label?: string;
  hint?: string;
  onOpenPage?: (slug: string) => void;
  subLinkText?: string;
  onSubLinkClick?: () => void;
}

export const RegisterPagePointer: React.FC<RegisterPagePointerProps> = ({
  page,
  label,
  hint,
  onOpenPage,
  subLinkText,
  onSubLinkClick
}) => {
  return (
    <div className="bg-[#fcfaf7] border border-[#e8dfd2] rounded-[8px] p-4 text-[#1a1612] shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#1a1612] uppercase tracking-wider font-mono">
              {label || page.title}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#eef5ea] text-[#3d682a]">
              <CheckCircle2 className="w-3 h-3" />
              Live
            </span>
            {page.version && (
              <span className="text-[11px] font-mono text-[#6e6358] bg-[#f5efe4] px-1.5 py-0.5 rounded">
                {page.version}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8a6a36]" />
            <span className="text-sm font-medium text-[#1a1612]">
              {page.title}
            </span>
            <span className="text-xs font-mono text-[#8a7f72]">
              /{page.slug}
            </span>
          </div>

          <p className="text-[12px] text-[#6e6358] leading-relaxed mt-1.5 max-w-[540px]">
            {hint || 'The words, clauses and settings for this policy are managed centrally in Pages.'}
          </p>

          {page.lastReviewed && (
            <div className="mt-2 text-[11px] text-[#8a7f72]">
              Last reviewed: {page.lastReviewed}
            </div>
          )}

          {subLinkText && (
            <button
              type="button"
              onClick={onSubLinkClick}
              className="mt-2 text-xs font-medium text-[#8a6a36] hover:underline cursor-pointer block"
            >
              {subLinkText}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenPage?.(page.slug)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#d9ccb6] bg-white text-xs font-medium text-[#1a1612] hover:bg-[#f7f2ea] hover:border-[#8a6a36] transition cursor-pointer shadow-2xs"
          title="Open this page in Pages editor"
        >
          <span>Edit in Pages</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8a6a36]" />
        </button>
      </div>
    </div>
  );
};

export default RegisterPagePointer;
