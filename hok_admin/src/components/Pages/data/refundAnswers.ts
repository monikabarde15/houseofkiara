/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Registry: Refund & Cancellation Answers (Spec §8.12, 103 items)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem, AnswerSide, StatusTagTone } from '../types/answers.types';
import { ALL_REFUND_QUESTIONS } from './refundPolicyRegistry';

const SECTION_MAP: Record<string, string> = {
  cancel: 'Cancelling a booking',
  change: 'Changing your booking',
  arrival: 'Delivery & arrival',
  wearing: 'During & after your event',
  deposit: 'Your security deposit',
  money: 'Refunds & payments',
  onus: 'When it is on us',
  concerns: 'Concerns & your rights',
  yours: 'Once it is yours',
  claims: 'How approved returns work'
};

const TONE_MAP: Record<string, StatusTagTone> = {
  yes: 'good-news',
  mid: 'worth-knowing',
  no: 'not-possible'
};

export const REFUND_ANSWERS: AnswerItem[] = (ALL_REFUND_QUESTIONS as any[]).map((q, idx) => {
  const side: AnswerSide =
    q.for === 'rent' ? 'rentals' : q.for === 'preloved' ? 'preloved' : 'both';

  const sectionName = SECTION_MAP[q.sec] || q.sec;

  const statusTag = q.tag
    ? {
        label: q.tag.text || '',
        tone: TONE_MAP[q.tag.tone] || 'none'
      }
    : undefined;

  const paragraphs = Array.isArray(q.a)
    ? q.a.map((paraText: string, pIdx: number) => ({
        id: `${q.id}_p${pIdx + 1}`,
        kind: 'paragraph' as const,
        text: paraText
      }))
    : [
        {
          id: `${q.id}_p1`,
          kind: 'paragraph' as const,
          text: String(q.a || '')
        }
      ];

  return {
    id: q.id,
    question: q.q,
    section: sectionName,
    side,
    statusTag,
    paragraphs,
    searchWords: q.kw || '',
    linkName: q.id,
    teamNote: q.rv,
    orderIndex: idx + 1
  };
});

export default REFUND_ANSWERS;
