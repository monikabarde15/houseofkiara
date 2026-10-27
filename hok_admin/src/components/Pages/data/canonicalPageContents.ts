/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Data: Canonical Page Content Definitions (Spec §8)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { PageContentDefinition } from '../types/pageContent.types';

export const CANONICAL_PAGE_CONTENTS: Record<string, PageContentDefinition> = {
  // 1. Refunds & cancellations (Spec §8.12, Page 37)
  'refunds': {
    slug: 'refunds',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'two-policies', label: 'Two policies' },
      { id: 'opening', label: 'Opening' },
      { id: 'policy-brief', label: 'The policy in brief' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 103, hasChecks: true },
      { id: 'related', label: 'Related policies' },
      { id: 'cant-find', label: "Can't find it" }
    ],
    hasTwoSides: true,
    rentalAnswersCount: 68,
    prelovedAnswersCount: 53,
    hero: {
      tagline: 'Our commitment to you',
      headingPrefix: 'Refunds & ',
      headingGoldItalic: 'cancellations',
      lead: 'Plans change, and we understand. Before you order or after, here is exactly what happens when they do, in plain words and with no surprises.',
      searchPlaceholder: 'Search a question, like "late return" or "deposit"',
      popularQuestions: [
        'What do I get back if I cancel more than 7 days before?',
        'When do I get my deposit back?'
      ]
    },
    opening: {
      sideLabel: 'Rental policy',
      text: 'When you rent with House of Kaira, your piece is held for you alone: turned away from everyone else, then cleaned, pressed and packed for your dates. Our policy is built to be fair to you and to the next customer who has booked it.',
      figures: [
        {
          key: 'order_cancel_window',
          label: 'Order cancel window',
          displayValue: '24 hours',
          contextBefore: 'You may cancel any rental order up to',
          contextAfter: 'after placing it without any cancellation charge. Free delivery applies from'
        },
        {
          key: 'free_delivery_min',
          label: 'Free delivery from',
          displayValue: '₹5,000',
          contextBefore: '',
          contextAfter: 'nationwide.'
        }
      ]
    }
  },

  // 2. Deposit Policy (Spec §8.13, Page 38)
  'deposit-policy': {
    slug: 'deposit-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'five-steps', label: 'Five steps' },
      { id: 'opening', label: 'Opening' },
      { id: 'at-a-glance', label: 'At a glance' },
      { id: 'worked-example', label: 'Worked example' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 42 },
      { id: 'related', label: 'Related policies' }
    ],
    hero: {
      tagline: 'Holding and returning trust',
      headingPrefix: 'Security deposit ',
      headingGoldItalic: 'policy',
      lead: 'The deposit from request to refund, with worked examples you can follow step by step. Built to be transparent and returned promptly.',
      searchPlaceholder: 'Search deposit questions, like "hold amount" or "inspection"',
      popularQuestions: [
        'When do I get my security deposit back?',
        'What counts as normal wear and tear?'
      ]
    },
    opening: {
      sideLabel: 'Security deposit terms',
      text: 'A security deposit is held purely as collateral during your rental period. It is never banked as revenue, remains segregated, and is returned to your original payment card immediately after concierge inspection.',
      figures: [
        {
          key: 'deposit_standard_hold',
          label: 'Standard deposit hold',
          displayValue: '₹10,000',
          contextBefore: 'The standard deposit hold for couture gowns is',
          contextAfter: 'and is released within'
        },
        {
          key: 'deposit_return_window_hours',
          label: 'Deposit release window',
          displayValue: '48 hours',
          contextBefore: '',
          contextAfter: 'of studio verification.'
        }
      ]
    }
  },

  // 3. Help & FAQs (Spec §8.4, Page 28)
  'faqs': {
    slug: 'faqs',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'moments', label: 'Moments' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 120, hasChecks: true },
      { id: 'cant-find', label: "Can't find it" }
    ],
    hero: {
      tagline: 'Plain answers to real questions',
      headingPrefix: 'Help & ',
      headingGoldItalic: 'frequently asked questions',
      lead: 'One hundred and twenty answers, sorted by the moment you are in. Everything from booking lead times to care, authentication, and lister payouts.',
      searchPlaceholder: 'Ask anything about House of Kaira',
      popularQuestions: [
        'How early should I book for wedding season?',
        'Can I try on the outfit before renting?'
      ]
    },
    opening: {
      sideLabel: 'Customer concierge guidance',
      text: 'Our team is here to ensure your experience with luxury fashion is seamless, elevated, and joyful. If your question is not covered below, our live WhatsApp concierge is ready to assist.',
      figures: [
        {
          key: 'advance_booking_max_days',
          label: 'Advance booking window',
          displayValue: '120 days',
          contextBefore: 'You can reserve pieces up to',
          contextAfter: 'in advance with concierge support open'
        },
        {
          key: 'support_hours_daily',
          label: 'Concierge hours',
          displayValue: '10:00 to 20:00',
          contextBefore: '',
          contextAfter: 'seven days a week.'
        }
      ]
    }
  },

  // 4. Care, Cleaning & Damage Policy (Spec §8.14, Page 40)
  'care-damage': {
    slug: 'care-damage',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'care-journey', label: 'Care journey' },
      { id: 'normal-wear-test', label: 'Normal wear test' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 36 },
      { id: 'related', label: 'Related policies' }
    ],
    hero: {
      tagline: 'Every piece in safe hands',
      headingPrefix: 'Care, cleaning & ',
      headingGoldItalic: 'damage policy',
      lead: 'The care journey from arrival to return, and the single clear test that decides normal wear from repairable damage.',
      searchPlaceholder: 'Search care rules, like "dry cleaning" or "hem dust"',
      popularQuestions: [
        'Do I need to dry clean the piece before returning?',
        'What happens if wine or makeup gets on the garment?'
      ]
    },
    opening: {
      sideLabel: 'Garment preservation protocol',
      text: 'Every garment returned to House of Kaira undergoes bespoke botanical dry cleaning and restoration by master tailors. You are never expected or permitted to wash or press garments yourself.',
      figures: [
        {
          key: 'cleaning_included_flag',
          label: 'Cleaning included',
          displayValue: 'Included complimentary',
          contextBefore: 'Professional dry cleaning is',
          contextAfter: 'with every rental. Report accidental spills within'
        },
        {
          key: 'damage_report_window_hours',
          label: 'Spill report window',
          displayValue: '12 hours',
          contextBefore: '',
          contextAfter: 'for optimal fiber recovery.'
        }
      ]
    }
  },

  // 5. Shipping & Delivery Policy (Spec §8.15, Page 42)
  'shipping-delivery': {
    slug: 'shipping-delivery',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'rental-window', label: 'Rental window' },
      { id: 'delivery-promise', label: 'Delivery promise' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 28 },
      { id: 'related', label: 'Related policies' }
    ],
    hero: {
      tagline: 'From our studio to your door',
      headingPrefix: 'Shipping & ',
      headingGoldItalic: 'delivery policy',
      lead: 'Tracked courier dispatch, scheduled delivery promises, and door-to-door concierge returns across all major cities.',
      searchPlaceholder: 'Search shipping details, like "dispatch tracking" or "return bag"',
      popularQuestions: [
        'When will my order arrive before my event?',
        'How does the doorstep return collection work?'
      ]
    },
    opening: {
      sideLabel: 'Logistics promise',
      text: 'We know how important your calendar is. Garments are dispatched 2 days prior to your rental start date to guarantee arrival before your celebrations begin.',
      figures: [
        {
          key: 'delivery_lead_time_days',
          label: 'Dispatch lead time',
          displayValue: '2 business days',
          contextBefore: 'Shipments depart the Mumbai atelier at least',
          contextAfter: 'before booking start, with return pickup within'
        },
        {
          key: 'return_pickup_window_hours',
          label: 'Return pickup window',
          displayValue: '24 hours',
          contextBefore: '',
          contextAfter: 'of rental conclusion.'
        }
      ]
    }
  }
};
