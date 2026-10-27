/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Seed Data: Answers (Spec §7.8, Screens 26-27, 38)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { AnswerItem } from '../types/answers.types';

export const SEED_ANSWERS: AnswerItem[] = [
  {
    id: 'ans_cancel_7days',
    question: 'What do I get back if I cancel more than 7 days before my rental starts?',
    section: 'Cancelling a rental',
    side: 'rentals',
    orderIndex: 1,
    statusTag: {
      label: 'Full refund in credits',
      tone: 'good-news'
    },
    paragraphs: [
      {
        id: 'p1',
        kind: 'paragraph',
        text: 'When you cancel 7 or more days prior to your reserved delivery date, you receive a 100% refund of your rental fee issued instantly to your House of Kaira wallet, or credited to your original payment method within 3 to 5 business days.'
      },
      {
        id: 'p2',
        kind: 'bullet',
        text: 'No processing fee is deducted when cancelled in this window.'
      },
      {
        id: 'p3',
        kind: 'bullet',
        text: 'Security deposits are released in full immediately.'
      }
    ],
    searchWords: 'cancel early, full refund, advance cancellation, cancel rental',
    linkName: 'cancel-more-than-7-days',
    teamNote: 'Standard policy since launch. Keeps customer loyalty high without holding pieces needlessly.',
    appearsIn: ['Popular questions on Hero', 'Refunds & cancellations'],
    hasChecks: false
  },
  {
    id: 'ans_cancel_24hours',
    question: 'How soon can I cancel without any cancellation fee?',
    section: 'Cancelling a rental',
    side: 'both',
    orderIndex: 2,
    statusTag: {
      label: 'Within 24 hours of booking',
      tone: 'good-news'
    },
    paragraphs: [
      {
        id: 'p4',
        kind: 'paragraph',
        text: 'You may cancel any rental or preloved order within 24 hours of placing it for a complete cash refund, no questions asked, provided dispatch has not commenced.'
      }
    ],
    searchWords: 'grace period, 24 hours, change mind, cancel order immediately',
    linkName: 'cancel-within-24-hours',
    appearsIn: ['Refunds & cancellations', 'Order confirmation'],
    hasChecks: false
  },
  {
    id: 'ans_cancel_48hours',
    question: 'What if I cancel within 48 hours of my booking start date?',
    section: 'Cancelling a rental',
    side: 'rentals',
    orderIndex: 3,
    statusTag: {
      label: '50% cancellation fee',
      tone: 'not-possible'
    },
    paragraphs: [
      {
        id: 'p5',
        kind: 'paragraph',
        text: 'Because another client could have booked that piece for the weekend, cancellations made within 48 hours of your delivery date incur a 50% cancellation fee. The remaining 50% is credited to your wallet.'
      },
      {
        id: 'p6',
        kind: 'note',
        text: 'Security deposits are always refunded in full regardless of late cancellation.'
      }
    ],
    searchWords: 'late cancel, emergency cancel, 48 hours, cancellation charge',
    linkName: 'cancel-within-48-hours',
    appearsIn: ['Refunds & cancellations'],
    hasChecks: true,
    checkTone: 'amber'
  },
  {
    id: 'ans_swap_dates',
    question: 'Can I change my dates or swap sizes instead of cancelling?',
    section: 'Cancelling a rental',
    side: 'rentals',
    orderIndex: 4,
    statusTag: {
      label: 'Free date reschedule',
      tone: 'worth-knowing'
    },
    paragraphs: [
      {
        id: 'p7',
        kind: 'paragraph',
        text: 'Yes. If your event changes or you want to swap your rental dates, contact concierge at least 72 hours before dispatch. Date changes are complimentary subject to calendar availability.'
      }
    ],
    searchWords: 'swap dates, change rental date, different size, reschedule',
    linkName: 'swap-dates-sizes',
    appearsIn: ['Refunds & cancellations'],
    hasChecks: false
  },
  {
    id: 'ans_deposit_return',
    question: 'When do I get my security deposit back?',
    section: 'The deposit',
    side: 'rentals',
    orderIndex: 5,
    statusTag: {
      label: 'Within 48 hours of return inspection',
      tone: 'good-news'
    },
    paragraphs: [
      {
        id: 'p8',
        kind: 'paragraph',
        text: 'Once your piece arrives back at our Mumbai concierge studio, our master tailors inspect it within 24 hours. The pre-authorization or deposit hold is released automatically to your account within 48 hours.'
      }
    ],
    searchWords: 'security deposit, deposit hold, when refunded, return deposit',
    linkName: 'deposit-return-timeline',
    appearsIn: ['Popular questions on Hero', 'Deposit Policy', 'Refunds & cancellations'],
    hasChecks: false
  },
  {
    id: 'ans_normal_wear',
    question: 'What counts as normal wear and tear?',
    section: 'The deposit',
    side: 'rentals',
    orderIndex: 6,
    isShared: true,
    statusTag: {
      label: 'Covered by House of Kaira',
      tone: 'worth-knowing'
    },
    paragraphs: [
      {
        id: 'p9',
        kind: 'paragraph',
        text: 'Minor hem dust from evening wear, faint makeup traces that vanish during standard dry cleaning, and slight zipper stiffness are completely normal and never charged to you.',
        sharedFrom: {
          pageName: 'Deposit Policy',
          questionTitle: 'What counts as normal wear?'
        }
      },
      {
        id: 'p10',
        kind: 'bullet',
        text: 'Our garment care team treats routine minor wear as part of the rental privilege.'
      }
    ],
    searchWords: 'normal wear, stain, dirt, makeup mark, hem dust, dry clean',
    linkName: 'normal-wear-definition',
    appearsIn: ['Deposit Policy', 'Refunds & cancellations', 'Care & Cleaning Policy'],
    hasChecks: false
  },
  {
    id: 'ans_preloved_trial',
    question: 'Can I return a preloved piece if it does not fit or suit me?',
    section: 'Preloved purchases & offers',
    side: 'preloved',
    orderIndex: 7,
    statusTag: {
      label: '48 hour trial window',
      tone: 'worth-knowing'
    },
    paragraphs: [
      {
        id: 'p11',
        kind: 'paragraph',
        text: 'Every preloved purchase arrives with our security ribbon intact. You have 48 hours from delivery to inspect and try on the garment. If you choose to return it with the ribbon unbroken, a full store credit or refund is issued.'
      }
    ],
    searchWords: 'preloved return, trial window, ribbon intact, preloved fit',
    linkName: 'preloved-trial-window',
    appearsIn: ['Refunds & cancellations', 'Preloved Terms'],
    hasChecks: false
  }
];

export const seedAnswers = SEED_ANSWERS;
