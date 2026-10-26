/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Registry: Page Answers (Spec §8.4, §8.12, §8.13, §8.14, §8.15)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../types/answers.types';
import { SEED_ANSWERS } from './seedAnswers';

// 1. Deposit Policy Answers (Spec §8.13)
const DEPOSIT_ANSWERS: AnswerItem[] = [
  {
    id: 'dep_1',
    question: 'When do I get my security deposit back?',
    section: 'Return timelines',
    side: 'rentals',
    orderIndex: 1,
    statusTag: { label: 'Within 48 hours of return', tone: 'good-news' },
    paragraphs: [
      {
        id: 'dp1',
        kind: 'paragraph',
        text: 'Once your piece arrives back at our Mumbai concierge studio, our master tailors inspect it within 24 hours. The pre-authorization or deposit hold is released automatically to your account within 48 hours.'
      }
    ],
    searchWords: 'deposit release, return time, inspection, 48 hours',
    linkName: 'deposit-release-time',
    appearsIn: ['Security deposit policy', 'Popular questions on Hero']
  },
  {
    id: 'dep_2',
    question: 'What counts as normal wear and tear on a piece?',
    section: 'What counts as damage',
    side: 'rentals',
    orderIndex: 2,
    isShared: true,
    statusTag: { label: 'Zero deduction', tone: 'good-news' },
    paragraphs: [
      {
        id: 'dp2',
        kind: 'paragraph',
        text: 'Minor hem dust from evening wear, faint makeup traces that vanish during standard dry cleaning, and slight zipper stiffness are completely normal and never charged to you.',
        sharedFrom: { pageName: 'Care, Cleaning & Damage Policy', questionTitle: 'What counts as normal wear and tear?' }
      }
    ],
    searchWords: 'wear and tear, hem dust, stain, normal use',
    linkName: 'normal-wear-definition'
  },
  {
    id: 'dep_3',
    question: 'How is repair cost assessed if accidental damage occurs?',
    section: 'What counts as damage',
    side: 'rentals',
    orderIndex: 3,
    statusTag: { label: 'At cost with receipts', tone: 'worth-knowing' },
    paragraphs: [
      {
        id: 'dp3',
        kind: 'paragraph',
        text: 'If a tear or burn occurs, an independent atelier tailors quotation is provided before any amount is deducted. We never charge punitive fees.'
      }
    ],
    searchWords: 'damage cost, repair estimate, independent atelier',
    linkName: 'repair-cost-assessment'
  }
];

// 2. Help & FAQs Answers (Spec §8.4)
const FAQ_ANSWERS: AnswerItem[] = [
  {
    id: 'faq_1',
    question: 'How early should I book for wedding season?',
    section: 'Rentals & bookings',
    side: 'rentals',
    orderIndex: 1,
    statusTag: { label: 'Recommended 6 to 8 weeks', tone: 'worth-knowing' },
    paragraphs: [
      {
        id: 'fp1',
        kind: 'paragraph',
        text: 'Couture pieces are reserved quickly during peak celebration months (October to March). We recommend booking 6 to 8 weeks ahead of your event date.'
      }
    ],
    searchWords: 'wedding season, advance booking, reserve dates',
    linkName: 'wedding-season-booking'
  },
  {
    id: 'faq_2',
    question: 'Can I try on the outfit before renting?',
    section: 'Rentals & bookings',
    side: 'rentals',
    orderIndex: 2,
    statusTag: { label: 'Mumbai try on studio', tone: 'good-news' },
    paragraphs: [
      {
        id: 'fp2',
        kind: 'paragraph',
        text: 'Clients in Mumbai can book a private styling appointment at our concierge studio. For clients outside Mumbai, our sizing concierge provides exact measurement consultations.'
      }
    ],
    searchWords: 'try on, studio trial, fitting, sizing appointment',
    linkName: 'try-on-options'
  },
  {
    id: 'faq_3',
    question: 'How do payouts work for piece listers?',
    section: 'Preloved & selling',
    side: 'preloved',
    orderIndex: 3,
    statusTag: { label: 'Bi-monthly bank transfer', tone: 'good-news' },
    paragraphs: [
      {
        id: 'fp3',
        kind: 'paragraph',
        text: 'Lister earnings are transferred directly to your registered bank account twice a month following the successful return of your rented piece.'
      }
    ],
    searchWords: 'payouts, lister earnings, commission, bank transfer',
    linkName: 'lister-payout-cycle'
  }
];

// 3. Care, Cleaning & Damage Policy Answers (Spec §8.14)
const CARE_ANSWERS: AnswerItem[] = [
  {
    id: 'care_1',
    question: 'Do I need to dry clean the piece before returning?',
    section: 'Care journey',
    side: 'rentals',
    orderIndex: 1,
    statusTag: { label: 'Never wash or dry clean', tone: 'worth-knowing' },
    paragraphs: [
      {
        id: 'cp1',
        kind: 'paragraph',
        text: 'No. Complimentary specialist couture dry cleaning is included with every rental. Attempting to wash or iron items at home can damage delicate zardozi or silk fibers.'
      }
    ],
    searchWords: 'dry clean, ironing, home wash, care instructions',
    linkName: 'no-home-cleaning'
  },
  {
    id: 'care_2',
    question: 'What happens if wine or perfume spills on the garment?',
    section: 'Care journey',
    side: 'rentals',
    orderIndex: 2,
    statusTag: { label: 'Notify concierge within 12 hours', tone: 'worth-knowing' },
    paragraphs: [
      {
        id: 'cp2',
        kind: 'paragraph',
        text: 'Do not rub the fabric with napkins or water. Simply notify our WhatsApp team with a photo within 12 hours so our restoration team can prepare the proper organic solvent upon return.'
      }
    ],
    searchWords: 'wine spill, perfume stain, spot treatment, accident',
    linkName: 'spill-protocol'
  }
];

// 4. Shipping & Delivery Policy Answers (Spec §8.15)
const SHIPPING_ANSWERS: AnswerItem[] = [
  {
    id: 'ship_1',
    question: 'When will my order arrive before my event?',
    section: 'Rental window',
    side: 'rentals',
    orderIndex: 1,
    statusTag: { label: '2 days prior to booking start', tone: 'good-news' },
    paragraphs: [
      {
        id: 'sp1',
        kind: 'paragraph',
        text: 'All rentals arrive at least 2 full days before your event date to allow for trying on with your jewelry and footwear.'
      }
    ],
    searchWords: 'arrival date, dispatch timeline, delivery window',
    linkName: 'delivery-arrival-timing'
  },
  {
    id: 'ship_2',
    question: 'How does the doorstep return collection work?',
    section: 'Rental window',
    side: 'rentals',
    orderIndex: 2,
    statusTag: { label: 'Pre-paid return satchel included', tone: 'good-news' },
    paragraphs: [
      {
        id: 'sp2',
        kind: 'paragraph',
        text: 'On the final day of your rental, place the garment in the provided reusable protective bag. Our courier arrives between 10:00 and 16:00 with a pre-printed barcode label.'
      }
    ],
    searchWords: 'return pickup, door collection, courier return',
    linkName: 'doorstep-return-process'
  }
];

export const getPageAnswers = (slug: string): AnswerItem[] => {
  switch (slug) {
    case 'deposit-policy':
      return DEPOSIT_ANSWERS;
    case 'faqs':
      return FAQ_ANSWERS;
    case 'care-damage':
    case 'care-policy':
      return CARE_ANSWERS;
    case 'shipping-delivery':
    case 'shipping-policy':
      return SHIPPING_ANSWERS;
    case 'refunds':
    default:
      return SEED_ANSWERS;
  }
};
