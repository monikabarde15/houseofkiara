/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Data: Canonical Page Content Definitions (Spec §8)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { PageContentDefinition } from '../types/pageContent.types';

export const CANONICAL_PAGE_CONTENTS: Record<string, PageContentDefinition> = {
  // 1. Refunds & cancellations (Spec §8.12, Pages 38-39, Screen 49/58)
  'refunds': {
    slug: '/refunds',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'two-policies', label: 'Two policies' },
      { id: 'opening', label: 'Opening' },
      { id: 'the-policy-in-brief', label: 'The policy in brief' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 103, hasChecks: true },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
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
      { id: 'answers', label: 'Answers', count: 61 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'A FULLY REFUNDABLE DEPOSIT',
      headingPrefix: 'Security deposit ',
      headingGoldItalic: 'policy',
      lead: 'Everything you need to know about how your deposit is requested, held, and returned. Written in plain words, with every rule, timeline, and deduction worked out in public.',
      searchPlaceholder: 'Search deposit questions, like "when is it due" or "normal wear"',
      popularQuestions: [
        'When is my deposit due?',
        'When do I get my deposit back?',
        'What counts as normal wear?',
        'How is a deduction worked out?'
      ]
    },
    opening: {
      sideLabel: 'Opening note',
      text: 'Every piece at House of Kaira carries a story, often one its owner holds dear. Your refundable security deposit keeps that story safe for the next person who wears it. It remains yours throughout: when your piece returns on time and as it left us, every rupee is returned to you.'
    }
  },

  // 3. Help & FAQs (Spec §8.4, Page 28-29, Screens 39-41)
  'faqs': {
    slug: 'faqs',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'moments', label: 'Moments' },
      { id: 'hygiene-promise', label: 'Hygiene promise' },
      { id: 'answers', label: 'Answers', count: 120, hasChecks: true },
      { id: 'most-asked', label: 'Most asked' },
      { id: 'full-policies', label: 'Full policies' },
      { id: 'still-wondering', label: 'Still wondering' }
    ],
    hero: {
      tagline: "Hello, we're so glad you're here",
      headingPrefix: "What's on ",
      headingGoldItalic: 'your mind?',
      lead: 'One hundred and twenty answers, sorted by the moment a customer is in. The answers here are also the ones How It Works and List Your Piece show.',
      searchPlaceholder: 'Ask anything: deposit, fit, late return, offer...',
      popularQuestions: [
        'How do I know a piece will fit me?',
        'When will I get my deposit back?',
        'How far in advance should I book?',
        'Can I return a preloved piece?'
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
  },

  // 6. Contact Us (Spec §8.5, Page 29-31, Screens 42-43)
  'contact': {
    slug: '/contact',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'open-closed', label: 'Open or closed' },
      { id: 'ways-to-reach', label: 'Ways to reach us', hasChecks: true },
      { id: 'answers-any-time', label: 'Answers, any time' },
      { id: 'write-a-note', label: 'Write us a note' },
      { id: 'visit-us', label: 'Visit us', hasChecks: true },
      { id: 'just-arrived', label: 'Just arrived' },
      { id: 'raising-a-concern', label: 'Raising a concern' },
      { id: 'our-details', label: 'Our details' }
    ],
    hero: {
      tagline: 'Contact Us',
      headingPrefix: 'We’d love to hear from ',
      headingGoldItalic: 'you',
      lead: 'Whether you are choosing a piece for a celebration, wearing one now, or thinking of listing your own, our team in Indore is here to help, personally.',
      searchPlaceholder: 'Search contact details',
      popularQuestions: [
        'What are your customer care hours?',
        'How do I book a visit in Indore?'
      ]
    },
    opening: {
      sideLabel: 'Concierge direct line',
      text: 'Every way to reach us, up front. Phone numbers, email and hours are set in Site Settings and printed here, never typed.',
      figures: [
        {
          key: 'support_sla',
          label: 'Response SLA',
          displayValue: '2 hours',
          contextBefore: 'During our hours, we usually reply within',
          contextAfter: 'on WhatsApp.'
        }
      ]
    }
  },

  // 7. About HOK (Spec §8.6, Pages 31-33)
  'about': {
    slug: '/about',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'the-name', label: 'The Name' },
      { id: 'manifesto', label: 'Manifesto' },
      { id: 'what-we-believe', label: 'What We Believe' },
      { id: 'two-sides', label: 'Two Sides' },
      { id: 'from-the-founder', label: 'From The Founder' },
      { id: 'why-we-built-it', label: 'Why We Built It' },
      { id: 'three-ways', label: 'Three Ways' },
      { id: 'closing', label: 'Closing' }
    ],
    hero: {
      tagline: 'About House of Kaira',
      headingPrefix: 'The House, ',
      headingGoldItalic: 'in Motion',
      lead: 'The house, the name, and the person behind it. A circular couture community built on craft and cherished beauty.',
      searchPlaceholder: 'Search about the house',
      popularQuestions: [
        'Where does the name KAIRA come from?',
        'Who founded House of Kaira?'
      ]
    },
    opening: {
      sideLabel: 'House narrative',
      text: 'Every garment deserves a second standing ovation. We give occasionwear somewhere to go next.',
      figures: [
        {
          key: 'instagram_handle',
          label: 'Instagram handle',
          displayValue: '@houseofkaira',
          contextBefore: 'Follow our celebrations on Instagram at',
          contextAfter: 'for live releases.'
        }
      ]
    }
  },

  // 8. How It Works (Spec §8.7, Pages 33-35)
  'how-it-works': {
    slug: '/how-it-works',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'whats-on-this-page', label: "What's on this page" },
      { id: 'shopping-steps', label: 'Shopping steps' },
      { id: 'two-ways-to-shop', label: 'Two ways to shop' },
      { id: 'the-craft-divider', label: 'The Craft divider' },
      { id: 'list-and-earn', label: 'List & Earn' },
      { id: 'good-to-know', label: 'Good to Know' },
      { id: 'faq', label: 'FAQ', count: 6 },
      { id: 'closing', label: 'Closing' }
    ],
    hero: {
      tagline: 'Simple by Design',
      headingPrefix: 'Fashion that moves ',
      headingGoldItalic: 'beautifully',
      lead: 'Everything you need to know about shopping, renting, selling, and giving beautiful pieces a longer life in one place, laid out clearly.',
      searchPlaceholder: 'Search how it works',
      popularQuestions: [
        'How do I rent a piece for an event?',
        'How much do I earn listing my piece?'
      ]
    },
    opening: {
      sideLabel: 'Two-sided ecosystem',
      text: 'A circular luxury community connecting people who want to wear showstoppers with people whose closets deserve to earn.',
      figures: [
        {
          key: 'free_delivery_min',
          label: 'Free delivery threshold',
          displayValue: '₹5,000',
          contextBefore: 'Standard delivery is complimentary above',
          contextAfter: 'across India.'
        }
      ]
    }
  },

  // 9. List Your Piece (Spec §8.8, Pages 35-37)
  'list-your-piece': {
    slug: '/list-your-piece',
    parts: [
      { id: 'hero', label: 'Hero', hasChecks: true },
      { id: 'the-listers-promise', label: "The Lister's Promise" },
      { id: 'three-promises', label: 'Three Promises', hasChecks: true },
      { id: 'how-it-works', label: 'How It Works', hasChecks: true },
      { id: 'earnings-preview', label: 'Earnings preview', hasChecks: true },
      { id: 'the-form', label: 'The Form', hasChecks: true },
      { id: 'for-boutiques', label: 'For Boutiques' },
      { id: 'faq', label: 'FAQ', count: 6 }
    ],
    hero: {
      tagline: 'The Acquisition Page',
      headingPrefix: "Your wardrobe's next life ",
      headingGoldItalic: 'starts here.',
      lead: 'Give the pieces you have celebrated in a second standing ovation. Earn on every booking without lifting a finger.',
      searchPlaceholder: 'Search listing guidelines',
      popularQuestions: [
        'How is the rental price determined?',
        'How and when do I get paid?'
      ]
    },
    opening: {
      sideLabel: 'Curated Circularity',
      text: 'Every piece entrusted to us is treated as an heirloom in transit: authenticated, carefully maintained, and returned whenever you choose.',
      figures: [
        {
          key: 'lister_share',
          label: 'Lister share',
          displayValue: 'Agreed piece by piece',
          contextBefore: 'Earn on every booking with commission',
          contextAfter: 'based on physical intake assessment.'
        }
      ]
    }
  },

  // 10. Terms & Conditions (Spec §8.9, Pages 37-38)
  'terms': {
    slug: '/terms',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'where-to-start', label: 'Where to start' },
      { id: 'opening', label: 'Opening' },
      { id: 'the-essentials', label: 'The essentials' },
      { id: 'clauses', label: 'Clauses', count: 59, hasChecks: true },
      { id: 'our-policies', label: 'Our policies' },
      { id: 'questions', label: 'Questions' }
    ],
    hero: {
      tagline: 'The Agreement Between Us',
      headingPrefix: 'Terms & ',
      headingGoldItalic: 'conditions',
      lead: 'Everything you and House of Kaira agree to when you rent, buy or list with us. Written to be read, with every clause numbered so it is easy to find and share.',
      searchPlaceholder: 'Search the terms, like "deposit", "late return" or a clause number',
      popularQuestions: [
        'Your security deposit',
        'Responsibility for the piece while it is with you',
        'Late returns',
        'If a preloved piece is not as described'
      ]
    },
    opening: {
      sideLabel: 'Master Platform Agreement',
      text: 'These Terms are the agreement between you and House of Kaira. We have written them to be read, in plain words, with every clause numbered so it is easy to find and share.',
      figures: [
        {
          key: 'support_email',
          label: 'Support email',
          displayValue: 'hello@houseofkaira.com',
          contextBefore: 'For questions or notices, contact',
          contextAfter: 'at our Indore office.'
        }
      ]
    }
  },

  // 11. Privacy Policy (Spec §8.1 & §8.10, Screen 58)
  'privacy': {
    slug: '/privacy',
    parts: [
      { id: 'the-policy', label: 'The policy', hasChecks: true }
    ],
    hero: {
      tagline: 'PRIVACY POLICY',
      headingPrefix: 'Privacy ',
      headingGoldItalic: 'Policy',
      lead: 'Its words load here from its page file, which is still to come.',
      searchPlaceholder: '',
      popularQuestions: []
    },
    opening: {
      sideLabel: 'Data & Privacy',
      text: 'Privacy Policy is built at v3, on the same engine as the Terms. Its page file is still to come.',
      figures: [
        {
          key: 'sep',
          label: 'Title separator',
          displayValue: '·',
          contextBefore: 'Standard metadata separator symbol is',
          contextAfter: 'used in search result title tags.'
        },
        {
          key: 'site_name',
          label: 'Site name',
          displayValue: 'House of Kaira',
          contextBefore: 'Data controller and service operator is',
          contextAfter: 'under registered proprietorship.'
        }
      ]
    }
  },

  // 12. Cookie Policy (Spec §8.1 & §8.11, Screen 58)
  'cookies': {
    slug: '/cookies',
    parts: [
      { id: 'the-policy', label: 'The policy', hasChecks: true }
    ],
    hero: {
      tagline: 'COOKIE POLICY',
      headingPrefix: 'Cookie ',
      headingGoldItalic: 'Policy',
      lead: 'Its words load here from its page file, which is still to come.',
      searchPlaceholder: '',
      popularQuestions: []
    },
    opening: {
      sideLabel: 'Cookies & Consent',
      text: 'Cookie Policy is built at v3, on the same engine as the Terms. Its page file is still to come.',
      figures: [
        {
          key: 'sep',
          label: 'Title separator',
          displayValue: '·',
          contextBefore: 'Standard metadata separator symbol is',
          contextAfter: 'used in search result title tags.'
        },
        {
          key: 'site_name',
          label: 'Site name',
          displayValue: 'House of Kaira',
          contextBefore: 'Data controller and service operator is',
          contextAfter: 'under registered proprietorship.'
        }
      ]
    }
  },

};
