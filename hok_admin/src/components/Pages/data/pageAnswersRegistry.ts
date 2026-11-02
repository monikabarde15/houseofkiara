/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Registry: Page Answers (Spec §8.4, §8.12, §8.13, §8.14, §8.15, §8.16)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../types/answers.types';
import { SEED_ANSWERS } from './seedAnswers';
import { DEPOSIT_ANSWERS } from './depositAnswers';
import { CARE_ANSWERS } from './careAnswers';
import { REFUND_ANSWERS } from './refundAnswers';
import { ALL_120_FAQ_ANSWERS } from './faq';
import { SHIPPING_ANSWERS } from './shippingAnswers';
import { PRICING_ANSWERS } from './pricingAnswers';
import { SELLER_ANSWERS } from './sellerAnswers';

// 1. Help & FAQs Answers (Spec §8.4)
const FAQ_ANSWERS: AnswerItem[] = ALL_120_FAQ_ANSWERS;

export const getPageAnswers = (slug: string): AnswerItem[] => {
  const clean = slug.replace(/^\//, '');
  switch (clean) {
    case 'deposit-policy':
      return DEPOSIT_ANSWERS;
    case 'faqs':
    case 'faq':
      return FAQ_ANSWERS;
    case 'care-damage':
    case 'care-policy':
      return CARE_ANSWERS;
    case 'shipping-delivery':
    case 'shipping-policy':
      return SHIPPING_ANSWERS;
    case 'refunds':
      return REFUND_ANSWERS;
    case 'pricing':
    case 'pricing-fees':
      return PRICING_ANSWERS;
    case 'seller-guidelines':
      return SELLER_ANSWERS;
    default:
      return SEED_ANSWERS;
  }
};
