/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AnswersPaperCanvas (Spec §7.8, Screen 26)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { AnswerItem, AnswerParagraph } from '../types/answers.types';

interface AnswersPaperCanvasProps {
  answers: AnswerItem[];
  selectedAnswer: AnswerItem;
  onSelectAnswer: (id: string) => void;
  onUpdateParagraph: (answerId: string, paragraphId: string, newText: string) => void;
  onAddParagraph: (answerId: string, kind: 'paragraph' | 'bullet') => void;
  onDetachSharedParagraph: (answerId: string, paragraphId: string) => void;
  onOpenParagraphPicker: () => void;
}

export const AnswersPaperCanvas: React.FC<AnswersPaperCanvasProps> = ({
  answers,
  selectedAnswer,
  onSelectAnswer,
  onUpdateParagraph,
  onAddParagraph,
  onDetachSharedParagraph,
  onOpenParagraphPicker
}) => {
  // Questions in the same section as selectedAnswer
  const sectionQuestions = answers.filter(a => a.section === selectedAnswer.section);

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center">
      {/* Notice line at top of paper (Spec §7.8) */}
      <div className="w-full max-w-[760px] pb-3 text-xs text-[#73675a] flex items-center justify-between">
        <span>
          Showing the Rental policy, as the page does under this tab.
        </span>
        <span className="text-[11px] text-[#8a7f73]">
          Section: <strong className="text-[#1a1612] font-medium">{selectedAnswer.section}</strong>
        </span>
      </div>

      {/* The Paper Sheet (Spec §7.3 & §7.8) */}
      <div className="w-full max-w-[760px] bg-white border border-[#ebe5dc] rounded-[8px] shadow-[0_4px_24px_rgba(26,22,18,0.06)] p-8 md:p-10 space-y-8">
        {/* Section title & subtitle as the page prints it */}
        <div className="border-b border-[#f0eae1] pb-5 space-y-1.5">
          <div className="text-[11px] uppercase tracking-wider text-[#8a6a36] font-medium">
            Policy section
          </div>
          <h2 className="font-serif text-[28px] md:text-[32px] text-[#1a1612] font-normal leading-snug">
            {selectedAnswer.section}
          </h2>
          <p className="text-xs text-[#73675a]">
            Questions customers ask most often regarding this policy commitment.
          </p>
        </div>

        {/* Section Questions Accordion List */}
        <div className="space-y-4">
          {sectionQuestions.map(item => {
            const isOpen = item.id === selectedAnswer.id;

            if (!isOpen) {
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAnswer(item.id)}
                  className="p-3.5 rounded-[6px] border border-[#ebe5dc] hover:border-[#bda67b] bg-[#fcfaf7]/50 cursor-pointer flex items-center justify-between group transition-all"
                >
                  <span className="font-medium text-[13px] text-[#3d362e] group-hover:text-[#1a1612]">
                    {item.question}
                  </span>
                  <span className="text-xs text-[#8a7f73] group-hover:text-[#1a1612]">
                    +
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="p-5 rounded-[8px] border-2 border-[#bda67b] bg-white shadow-sm space-y-5"
              >
                {/* Active Question Title & Tag */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {item.statusTag && (
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-[#f5e7c6] text-[#785b1a]">
                        {item.statusTag.label}
                      </span>
                    )}
                    {item.isShared && (
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-[#eef4fa] text-[#2c5282]">
                        Shared with other policies
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[22px] text-[#1a1612] font-normal leading-snug">
                    {item.question}
                  </h3>
                </div>

                {/* Paragraphs */}
                <div className="space-y-3.5 pt-2">
                  {item.paragraphs.map(p => {
                    const isShared = Boolean(p.sharedFrom);

                    if (isShared) {
                      return (
                        <div
                          key={p.id}
                          className="border-l-3 border-[#2b6cb0] pl-3.5 py-1 bg-[#f4f8fc] rounded-r-[5px] space-y-2"
                        >
                          <p className="text-[13.5px] text-[#2c3e50] leading-relaxed italic">
                            {p.text}
                          </p>
                          <div className="text-[11px] text-[#4a5568] flex items-center justify-between">
                            <span>
                              Shared word for word with {p.sharedFrom?.pageName}, "{p.sharedFrom?.questionTitle}".
                            </span>
                            <button
                              type="button"
                              onClick={() => onDetachSharedParagraph(item.id, p.id)}
                              className="text-[#2b6cb0] hover:underline font-medium ml-2 cursor-pointer"
                            >
                              Write this page's own words
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={p.id} className="relative group">
                        {p.kind === 'bullet' ? (
                          <div className="flex items-start gap-2.5">
                            <span className="text-[#8a6a36] font-bold mt-1 text-sm">•</span>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={e => onUpdateParagraph(item.id, p.id, e.currentTarget.textContent || '')}
                              className="flex-1 text-[13.5px] text-[#3d362e] leading-relaxed p-1 rounded hover:bg-[#fcfaf7] focus:ring-1 focus:ring-[#bda67b] focus:bg-white outline-none"
                            >
                              {p.text}
                            </div>
                          </div>
                        ) : p.kind === 'note' ? (
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => onUpdateParagraph(item.id, p.id, e.currentTarget.textContent || '')}
                            className="p-3 bg-[#faf7f2] border-l-2 border-[#c5ad7d] text-[12.5px] text-[#5c5248] italic rounded-r leading-relaxed focus:ring-1 focus:ring-[#bda67b] outline-none"
                          >
                            {p.text}
                          </div>
                        ) : (
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => onUpdateParagraph(item.id, p.id, e.currentTarget.textContent || '')}
                            className="text-[14px] text-[#3d362e] leading-relaxed p-1.5 rounded hover:bg-[#fcfaf7] focus:ring-1 focus:ring-[#bda67b] focus:bg-white outline-none"
                          >
                            {p.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Foot Action Buttons (Spec §7.8) */}
                <div className="pt-4 border-t border-[#f0eae1] flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onAddParagraph(item.id, 'paragraph')}
                    className="px-2.5 py-1.5 rounded bg-[#f7f2ea] hover:bg-[#ebe5dc] text-[#1a1612] font-medium transition-colors"
                  >
                    + Add a paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddParagraph(item.id, 'bullet')}
                    className="px-2.5 py-1.5 rounded bg-[#f7f2ea] hover:bg-[#ebe5dc] text-[#1a1612] font-medium transition-colors"
                  >
                    + Add a bullet
                  </button>
                  <button
                    type="button"
                    onClick={onOpenParagraphPicker}
                    className="px-2.5 py-1.5 rounded border border-[#d6ccbd] hover:border-[#bda67b] text-[#8a6a36] hover:bg-[#faf7f2] font-medium transition-colors"
                  >
                    Use a paragraph from another page
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnswersPaperCanvas;
