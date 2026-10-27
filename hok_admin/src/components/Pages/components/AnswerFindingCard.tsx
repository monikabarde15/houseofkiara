/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AnswerFindingCard (Spec §7.8, Screen 26)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { AnswerItem } from '../types/answers.types';

interface AnswerFindingCardProps {
  answer: AnswerItem;
  onUpdateAnswer: (updated: AnswerItem) => void;
}

export const AnswerFindingCard: React.FC<AnswerFindingCardProps> = ({
  answer,
  onUpdateAnswer
}) => {
  return (
    <div className="space-y-4 pt-3 border-t border-[#f0eae1]">
      {/* Finding it (Spec §7.8) */}
      <div className="space-y-3">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Finding it
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-0.5">
            Search words
          </label>
          <p className="text-[10.5px] text-[#8a7f73] mb-1">
            Words a customer might type that are not in the question. Never shown.
          </p>
          <input
            type="text"
            value={answer.searchWords || ''}
            onChange={e => onUpdateAnswer({ ...answer, searchWords: e.target.value })}
            placeholder="e.g. cancel, grace period, wallet"
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-0.5">
            Link name
          </label>
          <p className="text-[10.5px] text-[#8a7f73] mb-1">
            Fixed: other answers and popular questions link to it by this name.
          </p>
          <input
            type="text"
            readOnly
            value={answer.linkName}
            className="w-full p-2 bg-[#f5f1eb] border border-[#e6dccb] rounded-[5px] text-xs text-[#5c5248] cursor-not-allowed font-mono text-[11px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-0.5">
            Note for the team
          </label>
          <textarea
            rows={2}
            value={answer.teamNote || ''}
            onChange={e => onUpdateAnswer({ ...answer, teamNote: e.target.value })}
            placeholder="Optional and never printed."
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b] resize-none"
          />
        </div>
      </div>

      {/* Where it appears (Spec §7.8) */}
      <div className="space-y-2 pt-2 border-t border-[#f0eae1]">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#8a7f73]">
          Where it appears
        </div>
        {answer.appearsIn && answer.appearsIn.length > 0 ? (
          <div className="space-y-1">
            {answer.appearsIn.map(place => (
              <div key={place} className="flex items-center justify-between p-2 rounded bg-[#faf7f2] border border-[#ebe5dc]">
                <span className="text-[11.5px] text-[#3d362e]">{place}</span>
                <span className="text-[11px] text-[#8a6a36] font-medium cursor-pointer hover:underline">
                  Open
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11.5px] text-[#8a7f73] italic">
            Appears only in this policy section.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerFindingCard;
