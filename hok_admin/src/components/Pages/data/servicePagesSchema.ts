export interface PageFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  defaultValue: string;
  hint?: string;
}

export interface PageSectionDef {
  id: string;
  title: string;
  description?: string;
  fields: PageFieldDef[];
}

export interface PageStyleConfig {
  bgColor: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
}

export interface ServicePageSchema {
  slug: string;
  label: string;
  liveUrl: string;
  description: string;
  defaultStyle: PageStyleConfig;
  sections: PageSectionDef[];
}

export const DEFAULT_PAGE_STYLE: PageStyleConfig = {
  bgColor: '#faf7f2',
  textColor: '#1e1412',
  accentColor: '#c5a880',
  headingFont: "'Cormorant Garamond', Georgia, serif",
  bodyFont: "'DM Sans', 'Inter', sans-serif",
};

export const FONT_OPTIONS_HEADING = [
  { label: 'Cormorant Garamond (Editorial Serif)', value: "'Cormorant Garamond', Georgia, serif" },
  { label: 'Playfair Display (Classic Serif)', value: "'Playfair Display', Georgia, serif" },
  { label: 'Lora (Warm Serif)', value: "'Lora', Georgia, serif" },
  { label: 'Georgia (System Serif)', value: "Georgia, serif" },
  { label: 'DM Sans (Clean Sans)', value: "'DM Sans', sans-serif" },
  { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif" },
];

export const FONT_OPTIONS_BODY = [
  { label: 'DM Sans (Default Body)', value: "'DM Sans', 'Inter', sans-serif" },
  { label: 'Inter (Clean Sans)', value: "'Inter', sans-serif" },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Georgia (Serif Body)', value: "Georgia, serif" },
];

export const SERVICE_PAGES_SCHEMA: ServicePageSchema[] = [
  {
    slug: 'about',
    label: 'About Us (/about-us)',
    liveUrl: '/about-us',
    description: 'Brand story, KAIRA acronym, manifesto, philosophy, founder letter, orbit & 3 ways.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: '1. Hero Section',
        description: 'Top banner, main headline, brand film slot and 3 trust facts.',
        fields: [
          { id: 'about_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Coming Soon' },
          { id: 'about_heading', label: 'Hero Heading', type: 'text', defaultValue: 'Wear the extraordinary, without owning the cupboard.' },
          { id: 'about_lead', label: 'Hero Lead Paragraph', type: 'textarea', defaultValue: 'House of Kaira brings India’s most coveted couture into circular circulation — rented, preloved, and cared for like heirlooms.' },
          { id: 'about_film_slot', label: 'Film Slot Label', type: 'text', defaultValue: 'Brand Film — Coming Soon' },
          { id: 'about_fact1_title', label: 'Fact 1 Title', type: 'text', defaultValue: '100% genuine' },
          { id: 'about_fact1_desc', label: 'Fact 1 Description', type: 'text', defaultValue: 'Authenticated before every listing.' },
          { id: 'about_fact2_title', label: 'Fact 2 Title', type: 'text', defaultValue: 'Complimentary care' },
          { id: 'about_fact2_desc', label: 'Fact 2 Description', type: 'text', defaultValue: 'Surgically cleaned, always.' },
          { id: 'about_fact3_title', label: 'Fact 3 Title', type: 'text', defaultValue: 'Door to door' },
          { id: 'about_fact3_desc', label: 'Fact 3 Description', type: 'text', defaultValue: 'Direct delivery across India.' },
          { id: 'about_scroll_cue', label: 'Scroll Cue Text', type: 'text', defaultValue: 'Scroll to read the story' },
        ],
      },
      {
        id: 'name',
        title: '2. The Name (KAIRA Interactive)',
        description: 'K-A-I-R-A acronym heading and letter meanings.',
        fields: [
          { id: 'about_name_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'THE NAME' },
          { id: 'about_name_heading', label: 'Section Heading', type: 'text', defaultValue: 'Five letters, one promise.' },
          { id: 'about_name_lead', label: 'Section Subtext', type: 'textarea', defaultValue: 'Every house begins with a word it intends to live up to.' },
          { id: 'about_letter_word_0', label: 'K — Word', type: 'text', defaultValue: 'Keepsake' },
          { id: 'about_letter_meaning_0', label: 'K — Meaning', type: 'text', defaultValue: 'Cherished beauty is worth keeping in motion.' },
          { id: 'about_letter_word_1', label: 'A — Word', type: 'text', defaultValue: 'Authentic' },
          { id: 'about_letter_meaning_1', label: 'A — Meaning', type: 'text', defaultValue: 'Pristine condition guaranteed on every piece.' },
          { id: 'about_letter_word_2', label: 'I — Word', type: 'text', defaultValue: 'Inherited' },
          { id: 'about_letter_meaning_2', label: 'I — Meaning', type: 'text', defaultValue: 'Honouring the craft and handwork of Indian ateliers.' },
          { id: 'about_letter_word_3', label: 'R — Word', type: 'text', defaultValue: 'Revolving' },
          { id: 'about_letter_meaning_3', label: 'R — Meaning', type: 'text', defaultValue: 'Giving storied garments a second, third, and fourth celebration.' },
          { id: 'about_letter_word_4', label: 'A — Word', type: 'text', defaultValue: 'Affection' },
          { id: 'about_letter_meaning_4', label: 'A — Meaning', type: 'text', defaultValue: 'Personal concierge care, before and after every wear.' },
        ],
      },
      {
        id: 'manifesto',
        title: '3. Manifesto',
        fields: [
          { id: 'about_manifesto_quote', label: 'Manifesto Quote', type: 'textarea', defaultValue: 'Every garment deserves a life longer than one evening.' },
          { id: 'about_manifesto_body', label: 'Manifesto Body', type: 'textarea', defaultValue: "We don't sell clothes — we circulate stories, craft, and celebration." },
        ],
      },
      {
        id: 'philosophy',
        title: '4. What We Believe (Philosophy)',
        fields: [
          { id: 'about_believe_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'What We Believe' },
          { id: 'about_believe_heading', label: 'Heading', type: 'text', defaultValue: 'Four convictions we never compromise.' },
          { id: 'about_b_b1_h1', label: 'Pillar 1 Heading', type: 'text', defaultValue: 'Celebration,' },
          { id: 'about_b_b1_p', label: 'Pillar 1 Body', type: 'textarea', defaultValue: "You don't need to own a moment to live it fully." },
          { id: 'about_b_b2_h1', label: 'Pillar 2 Heading', type: 'text', defaultValue: 'Curation,' },
          { id: 'about_b_b2_p', label: 'Pillar 2 Body', type: 'textarea', defaultValue: 'Every piece is chosen, not just accepted.' },
          { id: 'about_b_b3_h1', label: 'Pillar 3 Heading', type: 'text', defaultValue: 'Turnaround,' },
          { id: 'about_b_b3_p', label: 'Pillar 3 Body', type: 'textarea', defaultValue: 'Pieces belong on women at celebrations, not in garment bags.' },
          { id: 'about_b_b4_h1', label: 'Pillar 4 Heading', type: 'text', defaultValue: 'Care,' },
          { id: 'about_b_b4_p', label: 'Pillar 4 Body', type: 'textarea', defaultValue: 'A lehenga returns from a wedding with our studio standing behind every stitch.' },
        ],
      },
      {
        id: 'duality',
        title: '5. Two Sides, One Wardrobe (Duality)',
        fields: [
          { id: 'about_sides_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Two Sides, One Wardrobe' },
          { id: 'about_sides_heading', label: 'Heading', type: 'text', defaultValue: 'Whether you are wearing it or sharing it.' },
          { id: 'about_sides_tab1', label: 'Tab 1 Label', type: 'text', defaultValue: "I'm celebrating" },
          { id: 'about_sides_tab2', label: 'Tab 2 Label', type: 'text', defaultValue: "I'm giving it new life" },
          { id: 'about_side1_label', label: 'Tab 1 Panel Label', type: 'text', defaultValue: 'For the woman dressing up' },
          { id: 'about_side1_body', label: 'Tab 1 Panel Body', type: 'textarea', defaultValue: 'Walk into every sangeet, reception, and milestone wearing authentic couture without the lifetime cupboard burden.' },
        ],
      },
      {
        id: 'founder',
        title: '6. From The Founder',
        fields: [
          { id: 'about_founder_monogram', label: 'Monogram Letter', type: 'text', defaultValue: 'K' },
          { id: 'about_founder_name', label: 'Founder Name', type: 'text', defaultValue: 'Kiara' },
          { id: 'about_founder_role', label: 'Founder Role', type: 'text', defaultValue: 'Founder, House of Kaira' },
          { id: 'about_founder_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'From The Founder' },
          { id: 'about_founder_heading', label: 'Heading', type: 'text', defaultValue: 'Why this house exists.' },
          { id: 'about_founder_p1', label: 'Paragraph 1', type: 'textarea', defaultValue: 'Before House of Kaira, there was a wardrobe full of unforgettable pieces worn exactly once.' },
          { id: 'about_founder_p2', label: 'Paragraph 2', type: 'textarea', defaultValue: 'Through years of watching extraordinary craftsmanship sit behind cedar doors, we knew couture deserved a second life.' },
          { id: 'about_founder_p3', label: 'Paragraph 3', type: 'textarea', defaultValue: 'House of Kaira is our promise that luxury and circularity belong in the same sentence.' },
          { id: 'about_founder_signoff', label: 'Signoff Name', type: 'text', defaultValue: 'With warmth, House of Kaira' },
        ],
      },
      {
        id: 'orbit',
        title: '7. Why We Built It (Orbit)',
        fields: [
          { id: 'about_orbit_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Why We Built It' },
          { id: 'about_orbit_heading', label: 'Heading', type: 'text', defaultValue: 'Indian couture, in motion.' },
          { id: 'about_orbit_p1', label: 'Paragraph 1', type: 'textarea', defaultValue: "India's finest bridal and festive wear represents hundreds of hours of handwork." },
          { id: 'about_orbit_p2', label: 'Paragraph 2', type: 'textarea', defaultValue: 'We did not want another marketplace; we wanted a trusted studio with white-glove logistics.' },
          { id: 'about_orbit_p3', label: 'Paragraph 3', type: 'textarea', defaultValue: 'Circular fashion works when trust is built into every stitch, cleaning cycle, and payout.' },
        ],
      },
      {
        id: 'three-ways',
        title: '8. Three Ways to Belong',
        fields: [
          { id: 'about_three_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'How It Works' },
          { id: 'about_three_heading', label: 'Heading', type: 'text', defaultValue: 'Three ways to belong to the house.' },
          { id: 'about_three_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Every door leads to the same standard of care and authenticity.' },
          { id: 'about_door_0_title', label: 'Door 1 Title', type: 'text', defaultValue: 'Rent' },
          { id: 'about_door_0_lead', label: 'Door 1 Tagline', type: 'text', defaultValue: 'For the night that deserves everything.' },
          { id: 'about_door_0_body', label: 'Door 1 Body', type: 'textarea', defaultValue: 'Wear the showstopper. Sent cleaned, fitted, and insured straight to your door.' },
          { id: 'about_door_1_title', label: 'Door 2 Title', type: 'text', defaultValue: 'Buy Preloved' },
          { id: 'about_door_1_lead', label: 'Door 2 Tagline', type: 'text', defaultValue: "A piece doesn't lose its story." },
          { id: 'about_door_1_body', label: 'Door 2 Body', type: 'textarea', defaultValue: 'Inspected, disclosed honestly, and priced fairly for permanent ownership.' },
          { id: 'about_door_2_title', label: 'Door 3 Title', type: 'text', defaultValue: 'List Your Piece' },
          { id: 'about_door_2_lead', label: 'Door 3 Tagline', type: 'text', defaultValue: "Your wardrobe's finest should earn." },
          { id: 'about_door_2_body', label: 'Door 3 Body', type: 'textarea', defaultValue: 'We take care of every detail — photography, cleaning, logistics, and T+3 payouts.' },
        ],
      },
      {
        id: 'closing',
        title: '9. Closing CTA',
        fields: [
          { id: 'about_closing_heading', label: 'Closing Heading', type: 'text', defaultValue: 'Ready to find your next celebration?' },
          { id: 'about_closing_sub', label: 'Closing Subtext', type: 'textarea', defaultValue: 'Explore curated couture to rent, buy preloved, or list from your own wardrobe.' },
        ],
      },
    ],
  },
  {
    slug: 'how-it-works',
    label: 'How It Works (/how-it-works)',
    liveUrl: '/how-it-works',
    description: 'Step-by-step guide for Rent, Buy Preloved, and List Your Piece.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Hero & Overview',
        fields: [
          { id: 'hiw_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'How House of Kaira Works' },
          { id: 'hiw_heading', label: 'Main Heading', type: 'text', defaultValue: 'Couture circulation, made effortless.' },
          { id: 'hiw_lead', label: 'Lead Description', type: 'textarea', defaultValue: 'From choosing your dates to doorstep delivery and complimentary dry cleaning.' },
        ],
      },
    ],
  },
  {
    slug: 'faqs',
    label: 'FAQs (/faqs)',
    liveUrl: '/faqs',
    description: 'Frequently asked questions across Rental, Preloved, LYP & Payments.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'FAQ Header',
        fields: [
          { id: 'faq_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Help & Answers' },
          { id: 'faq_heading', label: 'Heading', type: 'text', defaultValue: 'Frequently Asked Questions' },
          { id: 'faq_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Everything you need to know about renting, buying preloved, and listing your pieces.' },
        ],
      },
    ],
  },
  {
    slug: 'contact',
    label: 'Contact Us (/contact)',
    liveUrl: '/contact',
    description: 'Studio contact details, concierge hours, and support channels.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Contact Header & Studio Info',
        fields: [
          { id: 'contact_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Concierge & Support' },
          { id: 'contact_heading', label: 'Heading', type: 'text', defaultValue: 'Get in touch with House of Kaira' },
          { id: 'contact_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Questions about sizing, custom dates, or listing a piece? Our studio team is here to help.' },
          { id: 'contact_email', label: 'Support Email', type: 'text', defaultValue: 'concierge@houseofkaira.com' },
          { id: 'contact_phone', label: 'WhatsApp / Phone', type: 'text', defaultValue: '+91 98765 43210' },
          { id: 'contact_hours', label: 'Studio Hours', type: 'text', defaultValue: 'Mon – Sat, 10:00 AM – 7:00 PM IST' },
        ],
      },
    ],
  },
  {
    slug: 'shipping-policy',
    label: 'Shipping Policy (/shipping-policy)',
    liveUrl: '/shipping-policy',
    description: 'Delivery timelines, free shipping threshold, and return pickup logistics.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Shipping Policy Header',
        fields: [
          { id: 'shipping_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Logistics & Delivery' },
          { id: 'shipping_heading', label: 'Heading', type: 'text', defaultValue: 'Shipping & Delivery Policy' },
          { id: 'shipping_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Pan-India insured delivery and complimentary return pickup for every rental order.' },
        ],
      },
    ],
  },
  {
    slug: 'refunds',
    label: 'Refunds & Cancellations (/refunds)',
    liveUrl: '/refunds',
    description: 'Cancellation windows, deposit refund timelines, and store credit rules.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Refunds Header',
        fields: [
          { id: 'refunds_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Our Commitment' },
          { id: 'refunds_heading', label: 'Heading', type: 'text', defaultValue: 'Refunds & Cancellations' },
          { id: 'refunds_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Clear, transparent cancellation and security deposit release timelines.' },
        ],
      },
    ],
  },
  {
    slug: 'deposit-policy',
    label: 'Deposit Policy (/deposit)',
    liveUrl: '/deposit',
    description: 'Security deposit rules, T+3 release promise, and deduction criteria.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Deposit Policy Header',
        fields: [
          { id: 'deposit_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Security Escrow' },
          { id: 'deposit_heading', label: 'Heading', type: 'text', defaultValue: 'Security Deposit Policy' },
          { id: 'deposit_lead', label: 'Lead Text', type: 'textarea', defaultValue: '100% refundable security deposits released within T+3 business days of return inspection.' },
        ],
      },
    ],
  },
  {
    slug: 'care-policy',
    label: 'Care & Cleaning Policy (/care-policy)',
    liveUrl: '/care-policy',
    description: 'Dry cleaning, minor wear coverage, and damage assessment standards.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Care Policy Header',
        fields: [
          { id: 'care_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Garment Stewardship' },
          { id: 'care_heading', label: 'Heading', type: 'text', defaultValue: 'Care, Cleaning & Damage Policy' },
          { id: 'care_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Every rental includes complimentary professional dry cleaning after return.' },
        ],
      },
    ],
  },
  {
    slug: 'pricing-fees',
    label: 'Pricing & Fees (/pricing-fees)',
    liveUrl: '/pricing-fees',
    description: 'Rental pricing, GST breakdown, and lister commission structure.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Pricing & Fees Header',
        fields: [
          { id: 'pricing_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Transparency' },
          { id: 'pricing_heading', label: 'Heading', type: 'text', defaultValue: 'Pricing & Fees' },
          { id: 'pricing_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Clear breakdown of rental rates, preloved pricing, GST, and lister payouts.' },
        ],
      },
    ],
  },
  {
    slug: 'seller-guidelines',
    label: 'Seller Guidelines (/seller-guidelines)',
    liveUrl: '/seller-guidelines',
    description: 'Standards for listing couture pieces on House of Kaira.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Seller Guidelines Header',
        fields: [
          { id: 'seller_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'List Your Piece' },
          { id: 'seller_heading', label: 'Heading', type: 'text', defaultValue: 'Seller & Lister Guidelines' },
          { id: 'seller_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'How we curate, authenticate, insure, and pay out for pieces shared from your wardrobe.' },
        ],
      },
    ],
  },
  {
    slug: 'terms',
    label: 'Terms & Conditions (/terms)',
    liveUrl: '/terms',
    description: 'Legal terms of service for renters, buyers, and listers.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Terms Header',
        fields: [
          { id: 'terms_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Legal' },
          { id: 'terms_heading', label: 'Heading', type: 'text', defaultValue: 'Terms & Conditions' },
          { id: 'terms_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Governing terms for using House of Kaira services.' },
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    label: 'Privacy Policy (/privacy)',
    liveUrl: '/privacy',
    description: 'Data privacy, security, and customer information protection.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Privacy Header',
        fields: [
          { id: 'privacy_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Legal' },
          { id: 'privacy_heading', label: 'Heading', type: 'text', defaultValue: 'Privacy Policy' },
          { id: 'privacy_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'How House of Kaira collects, protects, and uses your personal information.' },
        ],
      },
    ],
  },
  {
    slug: 'cookies',
    label: 'Cookie Policy (/cookies)',
    liveUrl: '/cookies',
    description: 'Cookie usage and browser preferences.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Cookies Header',
        fields: [
          { id: 'cookies_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Legal' },
          { id: 'cookies_heading', label: 'Heading', type: 'text', defaultValue: 'Cookie Policy' },
          { id: 'cookies_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'How we use essential and analytics cookies to improve your browsing experience.' },
        ],
      },
    ],
  },
  {
    slug: 'maintenance',
    label: 'Maintenance (/maintenance)',
    liveUrl: '/maintenance',
    description: 'Scheduled maintenance page copy & styling.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: 'Maintenance Notice',
        fields: [
          { id: 'maint_heading', label: 'Heading', type: 'text', defaultValue: 'We will be right back.' },
          { id: 'maint_lead', label: 'Message', type: 'textarea', defaultValue: 'House of Kaira is undergoing brief scheduled maintenance.' },
        ],
      },
    ],
  },
];
