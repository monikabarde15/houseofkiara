/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Seller Guidelines Presentation Data (Spec § 8.17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { SELLER_TOKENS } from './sellerSettings';

export const SELLER_HERO = {
  eyebrow: 'SELL WITH US',
  title: 'Seller Guidelines',
  lead:
    'Every piece listed with House of Kaira stays yours. With every celebration it joins, it recovers a meaningful part of what you invested in it, and the craft that went into it lives on in more stories. Here is how listing works, and how we look after your piece along the way.',
  searchPlaceholder: 'Try payouts or damage',
  quickQueries: ['payout', 'damage', 'take my piece back', 'share'],
  listerTermsLabel: 'Read the Lister Terms',
  listerTermsUrl: '/terms#lister-terms'
};

export const SELLER_PROTECTION_CARD = {
  title: 'Your piece, protected',
  line: 'However you list, these hold for every piece:',
  points: [
    'Every renter pays a refundable deposit before your piece is dispatched.',
    'For high value pieces, we confirm the renter’s identity and address first.',
    'Our specialists clean your piece before and after every rental.',
    'Damage during a rental is ours to put right, and never taken from your share.',
    'Your name and address are never shown to renters or buyers.'
  ],
  linkText: 'How we protect your piece',
  linkTarget: 'protect'
};

export const TWO_WAYS_FEATURE = {
  marker: 'or',
  keep: {
    badge: 'Keep it with you',
    title: 'Keep it with you',
    summary: 'Your piece stays in your wardrobe until someone books or buys it.',
    rows: [
      {
        label: 'You',
        desc: 'Share clear photographs, a short video and exact measurements, and keep the piece ready to leave.'
      },
      {
        label: 'We',
        desc: 'Write and publish your listing, and arrange collection the moment it is booked or sold.'
      },
      {
        label: 'It travels',
        desc: 'To us first, so we can clean and check it before it goes to anyone.'
      },
      {
        label: 'Suits',
        desc: 'Pieces you may still want to wear yourself.'
      }
    ]
  },
  send: {
    badge: 'Send it to us',
    title: 'Send it to us',
    summary: 'Your piece comes to us once, and rests in our care, ready to leave.',
    rows: [
      {
        label: 'You',
        desc: 'Hand it to the courier we send. There is nothing else to prepare.'
      },
      {
        label: 'We',
        desc: 'Measure and photograph it, care for it between celebrations, and handle every dispatch and return.'
      },
      {
        label: 'It travels',
        desc: 'Straight to its renter or buyer, cleaned and checked, often on shorter notice.'
      },
      {
        label: 'Suits',
        desc: 'Pieces you would like to earn with no effort on your part.'
      }
    ]
  }
};

export const FIVE_STEPS_FEATURE = [
  {
    step: 1,
    title: 'Share your piece',
    desc: 'A few photographs and the details you know, through the List Your Piece form or on WhatsApp.',
    linkText: 'List Your Piece',
    linkHref: '/list-your-piece'
  },
  {
    step: 2,
    title: 'We review it',
    desc: `Our curation team replies on WhatsApp within ${SELLER_TOKENS.submission_reply}.`
  },
  {
    step: 3,
    title: 'Agree its Listing Terms',
    desc: 'Its price, your share and its Replacement Value, confirmed to you in writing.'
  },
  {
    step: 4,
    title: 'We prepare the listing',
    desc: 'Measurements, photographs and condition notes, which you see before anything goes live.'
  },
  {
    step: 5,
    title: 'It goes live',
    desc: 'We send you the link, and you hear from us every time it earns.'
  }
];

export const CARE_TRIO_FEATURE = [
  {
    title: 'Before it leaves',
    desc: 'Cleaned by our specialists, checked against its listing, then photographed and videoed, so we always know exactly how it left.'
  },
  {
    title: 'While it is away',
    desc: 'The renter is responsible for your piece from delivery until it is back with our courier, having agreed to our care rules and paid a refundable deposit.'
  },
  {
    title: 'When it comes back',
    desc: 'Inspected against that record, cleaned again, and any damage put right before its next celebration.'
  }
];

export interface SellerChapterItem {
  id: string;
  barLabel: string;
  title: string;
  intro: string;
  bg: 'warm-white' | 'cream';
  feature: 'ways' | 'steps' | 'trio' | null;
  questionIds: string[];
}

export const SELLER_CHAPTERS: SellerChapterItem[] = [
  {
    id: 'ways',
    barLabel: 'Two ways to list',
    title: 'Two ways to list',
    intro:
      'Your piece stays yours either way. You simply choose where it waits for its next celebration, and tell us which suits you when we review it.',
    bg: 'warm-white',
    feature: 'ways',
    questionIds: ['keep-home', 'send-us', 'which-way', 'wear-it']
  },
  {
    id: 'start',
    barLabel: 'Getting started',
    title: 'Before your piece goes live',
    intro:
      'From your first photographs to the day your listing goes live, here is what happens, and what we ask of you.',
    bg: 'warm-white',
    feature: 'steps',
    questionIds: [
      'who-can',
      'what-take',
      'cannot-take',
      'review-time',
      'listing-terms',
      'photos',
      'prepare',
      'grade',
      'disclose'
    ]
  },
  {
    id: 'price',
    barLabel: 'Pricing & your share',
    title: 'Pricing and your share',
    intro:
      'We price every piece so that it recovers a meaningful part of what you invested in it, while it goes on to be part of more celebrations. House of Kaira keeps only what its work on your piece justifies.',
    bg: 'warm-white',
    feature: null,
    questionIds: [
      'who-prices',
      'my-share',
      'lower-price',
      'offers',
      'replacement-value',
      'cost-to-list',
      'both-modes'
    ]
  },
  {
    id: 'care',
    barLabel: 'How we care',
    title: 'How we look after your piece',
    intro:
      'Every piece on House of Kaira was part of someone’s most special day. We treat yours as our own, from the moment it reaches us to the moment it comes home.',
    bg: 'warm-white',
    feature: 'trio',
    questionIds: ['between-rentals', 'renters', 'normal-wear', 'updates']
  },
  {
    id: 'protect',
    barLabel: 'Your protection',
    title: 'If something happens',
    intro:
      'Renting always carries some risk that no one can remove entirely, and listing a piece for rent means sharing it with us. We take every care to keep it small, because we know what your piece means to you. If something does go wrong, this is exactly what happens.',
    bg: 'cream',
    feature: null,
    questionIds: ['damaged', 'lost', 'our-care', 'insured', 'disagree']
  },
  {
    id: 'selling',
    barLabel: 'When it sells',
    title: 'When your piece is sold',
    intro:
      'A sale is the start of your piece’s next chapter, with someone new. Here is what happens from the moment it is bought.',
    bg: 'warm-white',
    feature: null,
    questionIds: ['sold', 'not-as-described', 'genuine']
  },
  {
    id: 'control',
    barLabel: 'Staying in control',
    title: 'Your piece, your decision',
    intro:
      'Listing a piece never means giving it up. You can pause, change or end its listing whenever you choose.',
    bg: 'warm-white',
    feature: null,
    questionIds: ['take-back', 'pause', 'min-period', 'elsewhere', 'not-booked', 'stop-listing']
  },
  {
    id: 'payouts',
    barLabel: 'Payouts & tax',
    title: 'Payouts and tax',
    intro:
      'Your earnings are paid promptly, into your own account, with a clear record of each payout.',
    bg: 'warm-white',
    feature: null,
    questionIds: ['when-paid', 'where-paid', 'pan', 'deductions']
  },
  {
    id: 'privacy',
    barLabel: 'Privacy',
    title: 'Privacy and photographs',
    intro:
      'Your piece is shown to the world. You are not, unless you choose to be.',
    bg: 'warm-white',
    feature: null,
    questionIds: ['my-name', 'photo-own', 'ai-images']
  }
];

export const SELLER_CLOSING_BAND = {
  title: 'Still deciding, or curious about a particular piece?',
  lead: `Message us on WhatsApp at ${SELLER_TOKENS.support_whatsapp}, and our team will talk it through with you, piece by piece.`,
  whatsappUrl: `https://wa.me/${SELLER_TOKENS.support_whatsapp_raw}`,
  listYourPieceUrl: '/list-your-piece',
  panelTitle: 'These guidelines and your agreement',
  panelText:
    'These guidelines explain how listing works, in plain words. Your agreement with us is the Lister Terms in our Terms & Conditions, together with the Listing Terms we confirm for each of your pieces. If anything here ever reads differently, they apply.',
  panelLinks: [
    { label: 'Lister Terms', href: '/terms#lister-terms' },
    { label: 'Pricing & Fees', href: '/pricing' },
    { label: 'Care, Cleaning & Damage Policy', href: '/care-policy' },
    { label: 'Deposit Policy', href: '/deposit-policy' }
  ]
};
