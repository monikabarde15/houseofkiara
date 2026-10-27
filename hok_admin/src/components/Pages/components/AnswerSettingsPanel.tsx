/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AnswerSettingsPanel (Spec §7.8, Screen 26)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { AnswerItem, AnswerSide, StatusTagTone } from '../types/answers.types';
import { AnswerFindingCard } from './AnswerFindingCard';

interface AnswerSettingsPanelProps {
  answer: AnswerItem;
  totalInSection: number;
  currentIndexInSection: number;
  availableSections: string[];
  onUpdateAnswer: (updated: AnswerItem) => void;
  onMoveEarlier: () => void;
  onMoveLater: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const AnswerSettingsPanel: React.FC<AnswerSettingsPanelProps> = ({
  answer,
  totalInSection,
  currentIndexInSection,
  availableSections,
  onUpdateAnswer,
  onMoveEarlier,
  onMoveLater,
  onDuplicate,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-4 text-xs text-[#1a1612]">
      {/* 1. Header (Spec §7.8) */}
      <div className="border-b border-[#f0eae1] pb-3 space-y-1">
        <div className="text-[10.5px] uppercase tracking-wider text-[#8a7f73] font-semibold">
          Question {currentIndexInSection} of {totalInSection} in {answer.section}
        </div>
        <h2 className="font-serif text-[17px] text-[#1a1612] font-normal leading-snug">
          {answer.question}
        </h2>
      </div>

      {/* 2. Reorder & Actions Strip (Spec §7.8) */}
      <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onMoveEarlier}
            className="px-2 py-1 rounded bg-[#f7f2ea] hover:bg-[#ebe5dc] text-[11px] text-[#4a4238] transition-colors"
            title="Move earlier in this section"
          >
            ↑ Move earlier
          </button>
          <button
            type="button"
            onClick={onMoveLater}
            className="px-2 py-1 rounded bg-[#f7f2ea] hover:bg-[#ebe5dc] text-[11px] text-[#4a4238] transition-colors"
            title="Move later in this section"
          >
            ↓ Move later
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="px-2 py-1 rounded bg-[#f7f2ea] hover:bg-[#ebe5dc] text-[11px] text-[#4a4238] transition-colors"
          >
            Duplicate
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-[11px] text-[#993d3d] hover:underline cursor-pointer"
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation prompt (Spec §7.8) */}
      {showDeleteConfirm && (
        <div className="p-3 bg-[#fdf2f2] border border-[#f5c6c6] rounded-[6px] space-y-2">
          <div className="font-medium text-[#993d3d] text-[11.5px]">
            Delete this answer?
          </div>
          {answer.appearsIn && answer.appearsIn.length > 0 && (
            <p className="text-[11px] text-[#782828] leading-relaxed">
              This answer is also referenced in: {answer.appearsIn.join(', ')}. Those links will need to be fixed.
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setShowDeleteConfirm(false);
                onDelete();
              }}
              className="px-2.5 py-1 rounded bg-[#993d3d] text-white text-[11px] font-medium hover:bg-[#7d2f2f]"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 text-[11px] text-[#73675a] hover:text-[#1a1612]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. Where it sits (Spec §7.8) */}
      <div className="space-y-3">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Where it sits
        </div>

        {/* Shown for */}
        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Shown for
          </label>
          <div className="flex items-center gap-1.5">
            {(['rentals', 'preloved', 'both'] as AnswerSide[]).map(side => (
              <button
                key={side}
                type="button"
                onClick={() => onUpdateAnswer({ ...answer, side })}
                className={`flex-1 py-1 rounded text-center capitalize transition-colors ${
                  answer.side === side
                    ? 'bg-[#1a1612] text-white font-medium'
                    : 'bg-[#f7f2ea] text-[#73675a] hover:bg-[#ebe5dc]'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        {/* Section */}
        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            Section
          </label>
          <select
            value={answer.section}
            onChange={e => onUpdateAnswer({ ...answer, section: e.target.value })}
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          >
            {availableSections.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Status Tag */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-[#73675a]">
              Status tag
            </label>
            {answer.statusTag && (
              <button
                type="button"
                onClick={() => onUpdateAnswer({ ...answer, statusTag: undefined })}
                className="text-[10px] text-[#993d3d] hover:underline cursor-pointer"
              >
                Remove the tag
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={answer.statusTag?.label || ''}
              onChange={e => onUpdateAnswer({
                ...answer,
                statusTag: {
                  label: e.target.value,
                  tone: answer.statusTag?.tone || 'good-news'
                }
              })}
              placeholder="Tag label (optional)"
              className="flex-1 p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
            />
            <select
              value={answer.statusTag?.tone || 'good-news'}
              onChange={e => onUpdateAnswer({
                ...answer,
                statusTag: {
                  label: answer.statusTag?.label || 'Notice',
                  tone: e.target.value as StatusTagTone
                }
              })}
              className="p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
            >
              <option value="good-news">Good news</option>
              <option value="worth-knowing">Worth knowing</option>
              <option value="not-possible">Not possible</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Finding it & Appearances (AnswerFindingCard) */}
      <AnswerFindingCard answer={answer} onUpdateAnswer={onUpdateAnswer} />
    </div>
  );
};

export default AnswerSettingsPanel;
