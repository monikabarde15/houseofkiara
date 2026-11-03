/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Data: Complete 120 FAQ Answers Registry (Spec §8.4, Screen 41)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../../types';
import { FAQ_ANSWERS_PART_1 } from './faqAnswersPart1';
import { FAQ_ANSWERS_PART_2 } from './faqAnswersPart2';
import { FAQ_ANSWERS_PART_3 } from './faqAnswersPart3';

export const ALL_120_FAQ_ANSWERS: AnswerItem[] = [
  ...FAQ_ANSWERS_PART_1,
  ...FAQ_ANSWERS_PART_2,
  ...FAQ_ANSWERS_PART_3
];

export * from './faqAnswersPart1';
export * from './faqAnswersPart2';
export * from './faqAnswersPart3';
