/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Component: SellerChaptersSection (Spec § 8.17 Part 03, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { SELLER_CHAPTERS, SellerChapterItem } from '../../data/sellerRegistry';
import { SELLER_ANSWERS } from '../../data/sellerAnswers';
import SellerTwoWaysFeature from './SellerTwoWaysFeature';
import SellerFiveStepsFeature from './SellerFiveStepsFeature';
import SellerCareTrioFeature from './SellerCareTrioFeature';
import { EditableFieldProps } from '../types';

export interface SellerChaptersSectionProps extends EditableFieldProps {
  onSelectFigure?: (figureKey: string) => void;
  onOpenAnswersView?: () => void;
}

export const SellerChaptersSection: React.FC<SellerChaptersSectionProps> = ({
  onSelectFigure,
  onOpenAnswersView,
  fieldValues = {},
  onFieldChange = () => {},
  onFocusField = () => {}
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('ways');
  const [openQuestionIds, setOpenQuestionIds] = useState<Set<string>>(new Set(['keep-home']));

  const activeChapter: SellerChapterItem =
    SELLER_CHAPTERS.find((c) => c.id === activeChapterId) || SELLER_CHAPTERS[0];

  const chapterAnswers = SELLER_ANSWERS.filter((ans) =>
    activeChapter.questionIds.includes(ans.id)
  );

  const toggleQuestion = (id: string) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const titleKey = `seller_ch_${activeChapter.id}_title`;
  const introKey = `seller_ch_${activeChapter.id}_intro`;
  const chTitle = fieldValues[titleKey] || activeChapter.title;
  const chIntro = fieldValues[introKey] || activeChapter.intro;

  return (
    <div className="pt-2 pb-6 space-y-6">
      {/* Chapter Pills Bar (Screen 58) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#ede8e1] rounded-[8px]">
        {SELLER_CHAPTERS.map((ch) => {
          const isActive = ch.id === activeChapterId;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChapterId(ch.id)}
              className={`px-3 py-1.5 rounded-[5px] text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#e4ded6]'
              }`}
            >
              {ch.barLabel}
            </button>
          );
        })}
      </div>

      {/* Active Chapter Header */}
      <div className="space-y-1.5 pt-2">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] font-normal">
          <span
            contentEditable
            suppressContentEditableWarning
            onFocus={() => onFocusField(titleKey)}
            onBlur={(e) => onFieldChange(titleKey, e.currentTarget.textContent || '')}
            className="cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
          >
            {chTitle}
          </span>
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onFocus={() => onFocusField(introKey)}
          onBlur={(e) => onFieldChange(introKey, e.currentTarget.textContent || '')}
          className="text-xs sm:text-sm text-[#57534e] leading-relaxed cursor-pointer hover:bg-[#fbf4ea] px-1 rounded transition-colors focus:outline-none"
        >
          {chIntro}
        </p>
      </div>

      {/* Chapter Feature Block */}
      {activeChapter.feature === 'ways' && <SellerTwoWaysFeature />}
      {activeChapter.feature === 'steps' && <SellerFiveStepsFeature />}
      {activeChapter.feature === 'trio' && <SellerCareTrioFeature />}

      {/* Chapter Questions List */}
      <div className="space-y-3 pt-2">
        {chapterAnswers.map((item) => {
          const isOpen = openQuestionIds.has(item.id);
          const qKey = `seller_q_${item.id}_title`;
          const qTitle = fieldValues[qKey] || item.question;

          return (
            <div
              key={item.id}
              className={`border rounded-[8px] transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#dcd7ce] shadow-xs'
                  : 'bg-white border-[#ebe5dc] hover:border-[#ded8cf]'
              }`}
            >
              {/* Question Header */}
              <button
                type="button"
                onClick={() => toggleQuestion(item.id)}
                className={`w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer ${
                  isOpen ? 'border-b border-[#f5f1eb] bg-[#fbf9f5]' : ''
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                      isOpen ? 'bg-[#935b1e]' : 'bg-[#c5ad7d]'
                    }`}
                  />
                  <h3 className="font-serif text-base sm:text-lg text-[#1c1917] font-normal leading-snug">
                    {qTitle}
                  </h3>
                </div>
                <span className="text-xs text-[#8a7f73] font-mono shrink-0 mt-1">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {/* Question Content */}
              {isOpen && (
                <div className="p-5 sm:p-6 space-y-3 text-xs sm:text-[13px] text-[#44403c] leading-relaxed">
                  {item.paragraphs.map((p, pIdx) => {
                    const pKey = `seller_q_${item.id}_p_${pIdx}`;
                    const pText = fieldValues[pKey] || p.text;

                    return (
                      <p
                        key={p.id || pIdx}
                        contentEditable
                        suppressContentEditableWarning
                        onFocus={() => onFocusField(pKey)}
                        onBlur={(e) => onFieldChange(pKey, e.currentTarget.textContent || '')}
                        className="cursor-pointer hover:bg-[#fbf4ea] p-1 rounded transition-colors focus:outline-none"
                      >
                        {pText}
                      </p>
                    );
                  })}

                  {/* Open in Answers workspace shortcut */}
                  {onOpenAnswersView && (
                    <div className="pt-2 border-t border-[#f5f1eb] flex justify-end">
                      <button
                        type="button"
                        onClick={onOpenAnswersView}
                        className="text-[11px] text-[#935b1e] hover:underline font-medium cursor-pointer"
                      >
                        Edit in Answers workspace →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerChaptersSection;
