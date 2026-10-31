/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Registry: Deposit Policy Answers (Spec §8.13, 61 items)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem, AnswerParagraph, StatusTagTone } from '../types/answers.types';
import { DEPOSIT_SECTIONS } from './depositRegistry';

const TONE_MAP: Record<string, StatusTagTone> = {
  positive: 'good-news',
  neutral: 'worth-knowing',
  negative: 'not-possible'
};

const items: AnswerItem[] = [];
let orderCounter = 1;

(DEPOSIT_SECTIONS as any[]).forEach((section) => {
  const sectionTitle = section.title || 'Deposit Policy';

  (section.questions || []).forEach((q: any) => {
    const statusTag = q.tag
      ? {
          label: q.tag,
          tone: TONE_MAP[q.tagType] || 'none'
        }
      : undefined;

    const paragraphs: AnswerParagraph[] = [];
    if (Array.isArray(q.content)) {
      q.content.forEach((block: any, bIdx: number) => {
        if (block.type === 'ul' && Array.isArray(block.items)) {
          block.items.forEach((bulletText: string, bulletIdx: number) => {
            paragraphs.push({
              id: `${q.id}_b_${bIdx}_${bulletIdx}`,
              kind: 'bullet',
              text: bulletText
            });
          });
        } else {
          paragraphs.push({
            id: `${q.id}_p_${bIdx}`,
            kind: 'paragraph',
            text: block.text || ''
          });
        }
      });
    }

    if (paragraphs.length === 0) {
      paragraphs.push({
        id: `${q.id}_p_0`,
        kind: 'paragraph',
        text: 'Information regarding security deposit policy.'
      });
    }

    items.push({
      id: q.id,
      question: q.question,
      section: sectionTitle,
      side: 'rentals',
      statusTag,
      paragraphs,
      searchWords: q.keywords || '',
      linkName: q.id,
      isShared: !!q.shared,
      orderIndex: orderCounter++
    });
  });
});

export const DEPOSIT_ANSWERS: AnswerItem[] = items;
export default DEPOSIT_ANSWERS;
