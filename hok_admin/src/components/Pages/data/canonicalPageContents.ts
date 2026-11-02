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
    'care-policy': {
    slug: 'care-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'if-something-happens', label: 'If something happens' },
      { id: 'our-one-request', label: 'Our one request' },
      { id: 'moment-by-moment', label: 'Moment by moment' },
      { id: 'wear-or-damage', label: 'Wear or damage' },
      { id: 'piece-by-piece', label: 'Piece by piece' },
      { id: 'our-care', label: 'Our care' },
      { id: 'restoring', label: 'Restoring' },
      { id: 'pieces-you-own', label: 'Pieces you own' },
      { id: 'answers', label: 'Answers', count: 57 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'OUR PROMISE TO EVERY PIECE',
      headingPrefix: 'Care, cleaning & ',
      headingGoldItalic: 'damage',
      lead: 'How we look after every piece, how you can too, and what happens in the rare moment something goes wrong, explained simply and fairly.',
      searchPlaceholder: 'Search care rules, like "dry cleaning" or "hem dust"',
      popularQuestions: [
        'How do you decide which it is?',
        'Can I use safety pins or fashion tape?',
        'Can I steam or iron out a crease?',
        'I spilled something on it'
      ]
    },
    opening: {
      sideLabel: 'Our one request',
      text: 'We ask one thing of everyone who rents with us: treat the piece as your own. It was part of someone\'s most special day, and it will be part of someone else\'s next. The cleaning is always ours, and so are the gentle signs of a wonderful evening.'
    }
  },
  'care-damage':  {
    slug: 'care-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'if-something-happens', label: 'If something happens' },
      { id: 'our-one-request', label: 'Our one request' },
      { id: 'moment-by-moment', label: 'Moment by moment' },
      { id: 'wear-or-damage', label: 'Wear or damage' },
      { id: 'piece-by-piece', label: 'Piece by piece' },
      { id: 'our-care', label: 'Our care' },
      { id: 'restoring', label: 'Restoring' },
      { id: 'pieces-you-own', label: 'Pieces you own' },
      { id: 'answers', label: 'Answers', count: 57 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'OUR PROMISE TO EVERY PIECE',
      headingPrefix: 'Care, cleaning & ',
      headingGoldItalic: 'damage',
      lead: 'How we look after every piece, how you can too, and what happens in the rare moment something goes wrong, explained simply and fairly.',
      searchPlaceholder: 'Search care rules, like "dry cleaning" or "hem dust"',
      popularQuestions: [
        'How do you decide which it is?',
        'Can I use safety pins or fashion tape?',
        'Can I steam or iron out a crease?',
        'I spilled something on it'
      ]
    },
    opening: {
      sideLabel: 'Our one request',
      text: 'We ask one thing of everyone who rents with us: treat the piece as your own. It was part of someone\'s most special day, and it will be part of someone else\'s next. The cleaning is always ours, and so are the gentle signs of a wonderful evening.'
    }
  },

  // 5. Shipping & Delivery Policy (Spec § 8.15, Screen 54)
  'shipping-policy': {
    slug: '/shipping-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'rental-window', label: 'Rental window' },
      { id: 'opening', label: 'Opening' },
      { id: 'ways-we-deliver', label: 'Ways we deliver' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 50 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'DELIVERED WITH CARE',
      headingPrefix: 'Shipping & ',
      headingGoldItalic: 'delivery',
      lead: 'Every piece is prepared by hand and planned to reach you in good time for your celebration. Here is exactly how delivery and returns work, for every rental and every preloved piece.',
      searchPlaceholder: 'Search delivery, like "pincode" or "return pickup"',
      popularQuestions: [
        'How does the rental window work?',
        'When is delivery free?',
        'How does my rental go back?',
        'Do you deliver outside India?'
      ]
    },
    opening: {
      sideLabel: 'Hand prepared promise',
      text: "Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Rentals are planned around your celebration, and standard delivery is free on every order of ₹5,000 or more, including a rental's journey back to us."
    }
  },
  'shipping-delivery': {
    slug: '/shipping-policy',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'rental-window', label: 'Rental window' },
      { id: 'opening', label: 'Opening' },
      { id: 'ways-we-deliver', label: 'Ways we deliver' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 50 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: "Can't find it" }
    ],
    hero: {
      tagline: 'DELIVERED WITH CARE',
      headingPrefix: 'Shipping & ',
      headingGoldItalic: 'delivery',
      lead: 'Every piece is prepared by hand and planned to reach you in good time for your celebration. Here is exactly how delivery and returns work, for every rental and every preloved piece.',
      searchPlaceholder: 'Search delivery, like "pincode" or "return pickup"',
      popularQuestions: [
        'How does the rental window work?',
        'When is delivery free?',
        'How does my rental go back?',
        'Do you deliver outside India?'
      ]
    },
    opening: {
      sideLabel: 'Hand prepared promise',
      text: "Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Rentals are planned around your celebration, and standard delivery is free on every order of ₹5,000 or more, including a rental's journey back to us."
    }
  },
  // 6. Pricing & Fees (Spec § 8.16, Screens 56 & 57)
  'pricing': {
    slug: '/pricing',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'two-sides', label: 'Two sides' },
      { id: 'at-a-glance', label: 'At a glance' },
      { id: 'opening', label: 'Opening' },
      { id: 'worked-examples', label: 'Worked examples' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 52 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: 'A question for us' }
    ],
    hero: {
      tagline: 'CLEAR FROM THE START',
      headingPrefix: 'Pricing & ',
      headingGoldItalic: 'fees',
      lead: 'Every price, every charge and every share, explained plainly for renting, buying and listing with us, so that nothing ever comes as a surprise.',
      searchPlaceholder: 'Search prices, like "cleaning included" or "payout time"',
      popularQuestions: [
        'How is a rental priced?',
        'When is delivery free?',
        'What does a late return cost?',
        'How is my share decided?'
      ]
    },
    opening: {
      sideLabel: 'Pricing promise',
      text: 'Every rental is priced for its window, and every preloved piece at the price agreed with its owner. GST is added at checkout, standard delivery is free on every order of ₹5,000 or more, and a deposit is simply held in safekeeping until your piece is home with us.'
    }
  },
  'pricing-fees': {
    slug: '/pricing',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'two-sides', label: 'Two sides' },
      { id: 'at-a-glance', label: 'At a glance' },
      { id: 'opening', label: 'Opening' },
      { id: 'worked-examples', label: 'Worked examples' },
      { id: 'sections', label: 'Sections' },
      { id: 'answers', label: 'Answers', count: 52 },
      { id: 'related-policies', label: 'Related policies' },
      { id: 'cant-find-it', label: 'A question for us' }
    ],
    hero: {
      tagline: 'CLEAR FROM THE START',
      headingPrefix: 'Pricing & ',
      headingGoldItalic: 'fees',
      lead: 'Every price, every charge and every share, explained plainly for renting, buying and listing with us, so that nothing ever comes as a surprise.',
      searchPlaceholder: 'Search prices, like "cleaning included" or "payout time"',
      popularQuestions: [
        'How is a rental priced?',
        'When is delivery free?',
        'What does a late return cost?',
        'How is my share decided?'
      ]
    },
    opening: {
      sideLabel: 'Pricing promise',
      text: 'Every rental is priced for its window, and every preloved piece at the price agreed with its owner. GST is added at checkout, standard delivery is free on every order of ₹5,000 or more, and a deposit is simply held in safekeeping until your piece is home with us.'
    }
  },
  // 7. Seller Guidelines (Spec § 8.17, Screen 58)
  'seller-guidelines': {
    slug: '/seller-guidelines',
    parts: [
      { id: 'hero', label: 'Hero' },
      { id: 'your-piece-protected', label: 'Your piece, protected' },
      { id: 'chapters', label: 'Chapters', hasChecks: true },
      { id: 'closing', label: 'Closing' }
    ],
    hero: {
      tagline: 'SELL WITH US',
      headingPrefix: 'Seller ',
      headingGoldItalic: 'Guidelines',
      lead: 'Every piece listed with House of Kaira stays yours. With every celebration it joins, it recovers a meaningful part of what you invested in it, and the craft that went into it lives on in more stories. Here is how listing works, and how we look after your piece along the way.',
      searchPlaceholder: 'Try payouts or damage',
      popularQuestions: [
        'payout',
        'damage',
        'take my piece back',
        'share'
      ]
    }
  },
    // 8. Page not found (Spec § 8.18, Screen 59)
  '404': {
    slug: '/404',
    parts: [
      { id: 'the-page', label: 'The page' }
    ]
  },
  '/404': {
    slug: '/404',
    parts: [
      { id: 'the-page', label: 'The page' }
    ]
  },
  // 9. No search results (Spec § 8.19, Screen 60)
  'search': {
    slug: '/search',
    parts: [
      { id: 'the-page', label: 'The page' },
      { id: 'trending', label: 'Trending' }
    ]
  },
  '/search': {
    slug: '/search',
    parts: [
      { id: 'the-page', label: 'The page' },
      { id: 'trending', label: 'Trending' }
    ]
  },
  // 10. Maintenance (Spec § 8.20, Screen 61)
  'maintenance': {
    slug: '/maintenance',
    parts: [
      { id: 'the-page', label: 'The page' }
    ]
  },
  '/maintenance': {
    slug: '/maintenance',
    parts: [
      { id: 'the-page', label: 'The page' }
    ]
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
