/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaperMoments (Spec §8.4, Screens 39, 40)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { EditableFieldInfo } from '../PagePaperCanvas';
import { AnswerItem } from '../../types';

export interface FaqMomentDefinition {
  id: string;
  tag: string;
  title: string;
  answerCount: number;
  kicker: string;
  headingPrefix: string;
  headingGold: string;
  subline: string;
  sectionTitle: string;
}

export const FAQ_MOMENTS_LIST: FaqMomentDefinition[] = [
  {
    id: 'before',
    tag: 'RENT & PRELOVED',
    title: 'Before I book',
    answerCount: 46,
    kicker: 'BEFORE YOU BOOK',
    headingPrefix: 'Before you ',
    headingGold: 'book',
    subline: 'Choosing a piece, getting the fit right, your rental dates, and paying.',
    sectionTitle: 'EVERYTHING · 46'
  },
  {
    id: 'on-way',
    tag: 'RENT & PRELOVED',
    title: "It's on its way",
    answerCount: 13,
    kicker: 'ON ITS WAY',
    headingPrefix: 'When it is on its ',
    headingGold: 'way',
    subline: 'Dispatch, courier tracking, and doorstep delivery.',
    sectionTitle: 'EVERYTHING · 13'
  },
  {
    id: 'wearing',
    tag: 'RENTING',
    title: "While I'm wearing it",
    answerCount: 12,
    kicker: "WHILE IT'S WITH YOU",
    headingPrefix: "While you're ",
    headingGold: 'wearing it',
    subline: 'Looking after your rental, from the first fitting to the last dance.',
    sectionTitle: 'EVERYTHING · 12'
  },
  {
    id: 'returning',
    tag: 'RENTING',
    title: 'Sending it back',
    answerCount: 14,
    kicker: 'SENDING IT HOME',
    headingPrefix: 'Sending it ',
    headingGold: 'back',
    subline: 'Packing, courier pickup, and deposit release timelines.',
    sectionTitle: 'EVERYTHING · 14'
  },
  {
    id: 'preloved',
    tag: 'PRELOVED',
    title: 'Buying preloved',
    answerCount: 20,
    kicker: 'BUYING PRELOVED',
    headingPrefix: 'Buying ',
    headingGold: 'preloved',
    subline: 'Making an offer, condition grading, and permanent purchase.',
    sectionTitle: 'EVERYTHING · 20'
  },
  {
    id: 'plans',
    tag: 'RENT & PRELOVED',
    title: 'Plans have changed',
    answerCount: 8,
    kicker: 'WHEN PLANS CHANGE',
    headingPrefix: 'When plans ',
    headingGold: 'change',
    subline: 'Cancellations, date changes, and event postponements.',
    sectionTitle: 'EVERYTHING · 8'
  }
];

interface FaqPaperMomentsProps {
  activePartId: string;
  selectedMomentId: string | null;
  onSelectMomentId: (id: string | null) => void;
  focusedField: EditableFieldInfo | null;
  getVal: (id: string, fallback: string) => string;
  onSelectPart: (partId: string) => void;
  onFieldFocus: (partId: string, fieldId: string, fieldName: string, helpText?: string, isHeading?: boolean) => void;
  momentQuestions: AnswerItem[];
  onOpenQuestionView?: (questionId: string) => void;
}

export const FaqPaperMoments: React.FC<FaqPaperMomentsProps> = ({
  activePartId,
  selectedMomentId,
  onSelectMomentId,
  focusedField,
  getVal,
  onSelectPart,
  onFieldFocus,
  momentQuestions,
  onOpenQuestionView
}) => {
  const activeMoment = FAQ_MOMENTS_LIST.find(m => m.id === selectedMomentId) || FAQ_MOMENTS_LIST[0];

  return (
    <section
      id="moments"
      onClick={() => onSelectPart('moments')}
      className={`relative pt-4 pb-6 transition-colors rounded ${
        activePartId === 'moments' ? 'ring-1 ring-[#bda67b]/50' : ''
      }`}
    >
      {/* 1. Divider line and OR CHOOSE WHERE YOU ARE prompt */}
      <div className="text-center mb-6 border-t border-[#f0e8dc] pt-6">
        <span className="text-[11px] tracking-[0.22em] font-medium text-[#c5a86d] uppercase">
          OR CHOOSE WHERE YOU ARE
        </span>
      </div>

      {/* 2. Grid of 6 Moment Cards (Screens 39, 40) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-w-[760px] mx-auto px-2">
        {FAQ_MOMENTS_LIST.map(moment => {
          const isSelected = selectedMomentId === moment.id;
          return (
            <div
              key={moment.id}
              onClick={e => {
                e.stopPropagation();
                onSelectMomentId(moment.id);
                onSelectPart('moments');
              }}
              className={`p-4 rounded-[3px] text-left transition-all cursor-pointer bg-[#241f1b] text-white flex flex-col justify-between min-h-[92px] ${
                isSelected
                  ? 'ring-2 ring-[#c5a86d] shadow-sm'
                  : 'hover:bg-[#2c2621]'
              }`}
            >
              <div className="text-[9.5px] tracking-[0.16em] uppercase font-medium text-[#a6927d]">
                {moment.tag}
              </div>
              <div>
                <div className="font-serif text-[19px] leading-snug text-[#f7f3ee]">
                  {moment.title}
                </div>
                <div className="text-[10px] tracking-wider text-[#a6927d] uppercase mt-1">
                  {moment.answerCount} ANSWERS
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Link under the cards (Screen 39) */}
      <div className="text-center mt-5 text-[13px] text-[#6e6358]">
        <span>Looking for something else? </span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onSelectMomentId('account');
          }}
          className="text-[#6e6358] underline underline-offset-3 hover:text-[#1a1612] cursor-pointer"
        >
          Your account, data and how to reach us
        </button>
      </div>

      {/* 4. Active Moment Questions Container (Screen 40) */}
      <div className="mt-10 bg-white border border-[#ece4d8] rounded-[6px] p-6 max-w-[760px] mx-auto text-left shadow-2xs">
        <div className="text-[11px] tracking-[0.2em] font-medium text-[#c5a86d] uppercase mb-1">
          {activeMoment.kicker}
        </div>
        <h2 className="font-serif text-[32px] text-[#1a1612] leading-tight mb-2">
          <span>{activeMoment.headingPrefix}</span>
          <span className="italic text-[#bda67b]">{activeMoment.headingGold}</span>
        </h2>
        <p className="text-[13.5px] text-[#6e6358] leading-relaxed mb-6">
          {activeMoment.subline}
        </p>

        {/* Section counter label */}
        <div className="text-[10.5px] tracking-[0.16em] font-medium text-[#8a7f72] uppercase pb-3 border-b border-[#f0e8dc]">
          {activeMoment.sectionTitle}
        </div>

        {/* Question Rows */}
        <div className="divide-y divide-[#f0e8dc]">
          {momentQuestions.slice(0, 5).map(q => (
            <div
              key={q.id}
              onClick={e => {
                e.stopPropagation();
                onOpenQuestionView?.(q.id);
              }}
              className="py-3.5 flex items-center justify-between group hover:bg-[#faf7f2]/60 px-2 -mx-2 rounded cursor-pointer transition-colors"
            >
              <span className="text-[15px] font-serif text-[#1a1612] group-hover:text-[#8a6a36]">
                {q.question}
              </span>
            </div>
          ))}
        </div>

        {momentQuestions.length > 5 && (
          <div className="pt-3 text-[12px] text-[#8a7f72] font-serif italic">
            and {momentQuestions.length - 5} more
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqPaperMoments;
