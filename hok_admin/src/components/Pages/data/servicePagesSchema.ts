export interface PageFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  defaultValue: string;
  placeholder?: string;
  hint?: string;
  group?: 'pay' | 'earn';
}

export interface PageSectionDef {
  id: string;
  title: string;
  description?: string;
  specialEditor?: 'pricing_ledger' | 'pricing_qa';
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
  { label: 'Georgia (System Serif)', value: 'Georgia, serif' },
  { label: 'DM Sans (Clean Sans)', value: "'DM Sans', sans-serif" },
  { label: 'Inter (Modern Sans)', value: "'Inter', sans-serif" },
];

export const FONT_OPTIONS_BODY = [
  { label: 'DM Sans (Default Body)', value: "'DM Sans', 'Inter', sans-serif" },
  { label: 'Inter (Clean Sans)', value: "'Inter', sans-serif" },
  { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Georgia (Serif Body)', value: 'Georgia, serif' },
];

const PAY_LEDGER_ROWS: Array<[string, string, string, string, string]> = [
  [
    'The piece',
    'One price for 3 days',
    'Your standard rental window: it arrives the day before your celebration and goes back the day after.',
    'The price shown',
    'Or the offer we accept from you.',
  ],
  [
    'Extra days',
    'The daily rate, per day',
    'Shown on every piece. Add days when you book, or keep it longer if it is free.',
    'Not applicable',
    '',
  ],
  [
    'GST',
    '18% on the rental fee',
    'Added at checkout, and shown before you pay.',
    '5% on the price',
    'Added at checkout, and shown before you pay.',
  ],
  [
    'Deposit',
    'Refundable, set for each piece',
    'Shown before you book and paid separately. It carries no GST.',
    'None',
    '',
  ],
  [
    'Delivery in India',
    'Free from ₹5,000',
    'Covering both journeys. On smaller orders, quoted at checkout.',
    'Free from ₹5,000',
    'On smaller orders, quoted at checkout.',
  ],
  [
    'Faster delivery',
    'Quoted before you pay',
    'Express, or the same day within Indore.',
    'Quoted before you pay',
    'Express, the same day within Indore, or anywhere in the world.',
  ],
  [
    'Cleaning and care',
    'Always included',
    'Professional cleaning before and after every rental.',
    'Always included',
    'Checked and pressed, and professionally cleaned if it has been worn.',
  ],
  [
    'Changing your mind',
    'Free until 7 days before it starts',
    'With everything refunded. Closer to your dates, see what applies.',
    'Free until it is dispatched',
    'Then a final sale, unless it is not as described.',
  ],
];

const EARN_LEDGER_ROWS: Array<[string, string, string]> = [
  [
    'Your share',
    'Set for each piece',
    'By its value and the work it takes to rent or sell it, so that you recover a meaningful part of what you invested.',
  ],
  [
    'Never part of it',
    'GST, deposits and delivery',
    'And our promo codes never reduce your share.',
  ],
  [
    'Listing your piece',
    'Free',
    'Collection, photography, cleaning and every delivery to renters and buyers are on us.',
  ],
  [
    'When you are paid',
    'Within 3 working days',
    'Once a rental is back with us and inspected, or once a buyer has received the piece.',
  ],
  [
    'Where it goes',
    'Your own account',
    'A bank account or UPI ID in your name, with a statement for every payout.',
  ],
  [
    'Costs that can be yours',
    'Only four, each agreed first',
    'A repair to make it ready, an early return, a missed collection, or delivery when you borrow it back.',
  ],
];

const PRICING_LEDGER_FIELDS: PageFieldDef[] = [
  { id: 'pricing_tab_pay_label', label: 'Pay Tab Sub-label', type: 'text', defaultValue: 'Renting or buying', group: 'pay' },
  { id: 'pricing_tab_pay_title', label: 'Pay Tab Title', type: 'text', defaultValue: 'What you pay', group: 'pay' },
  { id: 'pricing_ledger_pay_title', label: 'Pay Card Heading', type: 'text', defaultValue: 'Every charge, at a glance', group: 'pay' },
  { id: 'pricing_ledger_pay_hint', label: 'Pay Card Hint', type: 'text', defaultValue: 'Each piece shows its own prices before you book or buy.', group: 'pay' },
  { id: 'pricing_ledger_pay_col1', label: 'Column 1 Label', type: 'text', defaultValue: 'Renting', group: 'pay' },
  { id: 'pricing_ledger_pay_col2', label: 'Column 2 Label', type: 'text', defaultValue: 'Buying preloved', group: 'pay' },
  ...PAY_LEDGER_ROWS.flatMap(([name, rFig, rLine, bFig, bLine], idx): PageFieldDef[] => {
    const fields: PageFieldDef[] = [
      { id: `pricing_pay_row_${idx}_name`, label: `Row ${idx + 1} Label`, type: 'text', defaultValue: name, group: 'pay' },
      { id: `pricing_pay_row_${idx}_rent_fig`, label: `${name} — Renting Headline`, type: 'text', defaultValue: rFig, group: 'pay' },
      { id: `pricing_pay_row_${idx}_rent_line`, label: `${name} — Renting Note`, type: 'text', defaultValue: rLine, group: 'pay' },
      { id: `pricing_pay_row_${idx}_buy_fig`, label: `${name} — Preloved Headline`, type: 'text', defaultValue: bFig, group: 'pay' },
    ];
    if (bLine) {
      fields.push({ id: `pricing_pay_row_${idx}_buy_line`, label: `${name} — Preloved Note`, type: 'text', defaultValue: bLine, group: 'pay' });
    }
    return fields;
  }),
  { id: 'pricing_ledger_pay_foot', label: 'Pay Footer Text', type: 'text', defaultValue: 'No convenience fee, no platform fee, and nothing extra for paying by card or UPI. ', group: 'pay' },
  { id: 'pricing_ledger_pay_foot_link', label: 'Pay Footer Link Text', type: 'text', defaultValue: 'Every way to pay', group: 'pay' },

  { id: 'pricing_tab_earn_label', label: 'Earn Tab Sub-label', type: 'text', defaultValue: 'Listing your pieces', group: 'earn' },
  { id: 'pricing_tab_earn_title', label: 'Earn Tab Title', type: 'text', defaultValue: 'What you earn', group: 'earn' },
  { id: 'pricing_ledger_earn_title', label: 'Earn Card Heading', type: 'text', defaultValue: 'Your earnings, at a glance', group: 'earn' },
  { id: 'pricing_ledger_earn_hint', label: 'Earn Card Hint', type: 'text', defaultValue: 'Every share is agreed with you, piece by piece.', group: 'earn' },
  ...EARN_LEDGER_ROWS.flatMap(([name, fig, line], idx): PageFieldDef[] => [
    { id: `pricing_earn_row_${idx}_name`, label: `Row ${idx + 1} Label`, type: 'text', defaultValue: name, group: 'earn' },
    { id: `pricing_earn_row_${idx}_fig`, label: `${name} — Headline`, type: 'text', defaultValue: fig, group: 'earn' },
    { id: `pricing_earn_row_${idx}_line`, label: `${name} — Explanation`, type: 'text', defaultValue: line, group: 'earn' },
  ]),
  { id: 'pricing_ledger_earn_foot', label: 'Earn Footer Text', type: 'text', defaultValue: "Your share and your prices are confirmed in your piece's Listing Terms before it goes live, as our ", group: 'earn' },
  { id: 'pricing_ledger_earn_foot_link', label: 'Earn Footer Link Text', type: 'text', defaultValue: 'Seller Guidelines', group: 'earn' },
];

export const SERVICE_PAGES_SCHEMA: ServicePageSchema[] = [
  {
    slug: 'pricing-fees',
    label: 'Pricing & Fees (/pricing-fees)',
    liveUrl: '/pricing-fees',
    description: 'Complete Pricing & Fees page: hero, pay/earn ledger, worked examples, 13 Q&A categories, and closing band.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: '1. Hero & Search',
        description: 'Top eyebrow, main heading (with italic highlight), subtitle & search prompt.',
        fields: [
          { id: 'pricing_hero_eyebrow', label: 'Eyebrow Label', type: 'text', defaultValue: 'CLEAR FROM THE START' },
          { id: 'pricing_hero_title_prefix', label: 'Heading Text', type: 'text', defaultValue: 'Pricing & ' },
          { id: 'pricing_hero_italic', label: 'Heading Italic Gold Word', type: 'text', defaultValue: 'fees' },
          {
            id: 'pricing_hero_subtitle',
            label: 'Subtitle Paragraph',
            type: 'textarea',
            defaultValue:
              'Every price, every charge and every share, explained plainly for renting, buying and listing with us, so that nothing ever comes as a surprise.',
          },
          {
            id: 'pricing_search_placeholder',
            label: 'Search Input Placeholder',
            type: 'text',
            defaultValue: "Search a question, like 'late return' or 'my share'",
          },
          { id: 'pricing_popular_label', label: 'Popular Row Label', type: 'text', defaultValue: 'Popular:' },
        ],
      },
      {
        id: 'ledger',
        title: '2. Price & Earning Ledger Table',
        description: 'Comparison table rows for Renting / Buying Preloved and Listing Earnings.',
        specialEditor: 'pricing_ledger',
        fields: PRICING_LEDGER_FIELDS,
      },
      {
        id: 'side_intro',
        title: '3. Perspective Overview Paragraphs',
        description: 'Opening summary paragraph shown below the section bar on each tab.',
        fields: [
          {
            id: 'pricing_intro_pay',
            label: 'What You Pay — Overview Paragraph',
            type: 'textarea',
            defaultValue:
              'Every rental is priced for its window, and every preloved piece at the price agreed with its owner. GST is added at checkout, standard delivery is free on every order of ₹5,000 or more, and a deposit is simply held in safekeeping until your piece is home with us.',
          },
          {
            id: 'pricing_intro_earn',
            label: 'What You Earn — Overview Paragraph',
            type: 'textarea',
            defaultValue:
              'When your piece is rented or sold, you receive a share of what it earns, agreed with you for that piece before it goes live, so that you recover a meaningful part of what you invested in it. Listing is free, and your earnings reach your own account within 3 working days.',
          },
        ],
      },
      {
        id: 'worked_examples',
        title: '4. Your Order in Numbers (Worked Examples)',
        description: 'Interactive rental and preloved cost breakdown calculator — changing prices recalculates GST & totals automatically.',
        fields: [
          { id: 'pricing_ex_title_prefix', label: 'Section Heading', type: 'text', defaultValue: 'Your order, in ' },
          { id: 'pricing_ex_italic', label: 'Heading Italic Gold Word', type: 'text', defaultValue: 'numbers' },
          {
            id: 'pricing_ex_subline',
            label: 'Subheading',
            type: 'textarea',
            defaultValue: 'One rental and one preloved piece, added up line by line. Every piece shows its own prices before you book or buy.',
          },
          { id: 'pricing_ex_rental_tab', label: 'Rental Tab Label', type: 'text', defaultValue: 'A rental' },
          {
            id: 'pricing_ex_rental_lead',
            label: 'Rental Example Description',
            type: 'textarea',
            defaultValue: 'A bridal lehenga priced at ₹18,000 for its standard window of 3 days, with a daily rate of ₹3,500 and a deposit of ₹20,000.',
          },
          { id: 'pricing_ex_rental_window_price', label: 'Rental Window Price (₹)', type: 'text', defaultValue: '18000' },
          { id: 'pricing_ex_rental_daily_rate', label: 'Extra Day Rate (₹)', type: 'text', defaultValue: '3500' },
          { id: 'pricing_ex_rental_deposit', label: 'Example Security Deposit (₹)', type: 'text', defaultValue: '20000' },
          {
            id: 'pricing_ex_rental_note',
            label: 'Rental Example Footnote',
            type: 'text',
            defaultValue: 'If it comes back after its Return Date, each late day costs ₹3,500 plus GST, exactly like an extra day.',
          },
          {
            id: 'pricing_ex_rental_deposit_note',
            label: 'Deposit Box Note',
            type: 'text',
            defaultValue: 'Returned within 3 to 5 business days of inspection, to the account it came from.',
          },
          { id: 'pricing_ex_preloved_tab', label: 'Preloved Tab Label', type: 'text', defaultValue: 'A preloved piece' },
          {
            id: 'pricing_ex_preloved_lead',
            label: 'Preloved Example Description',
            type: 'textarea',
            defaultValue: 'A designer saree listed at ₹60,000, on which an offer of ₹54,000 has been accepted.',
          },
          { id: 'pricing_ex_preloved_list_price', label: 'Preloved Listed Price (₹)', type: 'text', defaultValue: '60000' },
          { id: 'pricing_ex_preloved_offer_price', label: 'Preloved Accepted Offer (₹)', type: 'text', defaultValue: '54000' },
          { id: 'pricing_ex_preloved_note', label: 'Preloved Example Footnote', type: 'text', defaultValue: 'No deposit, and nothing more to pay once it is yours.' },
        ],
      },
      {
        id: 'qa_sections',
        title: '5. Questions & Answers (All 13 Policy Sections)',
        description: 'Edit existing questions, answers & badge tags, hide any category, or add new questions.',
        specialEditor: 'pricing_qa',
        fields: [],
      },
      {
        id: 'way_across',
        title: '6. Perspective Switcher Banner',
        description: 'Prompt banner at the bottom of questions to switch between Pay and Earn.',
        fields: [
          { id: 'pricing_way_pay_q', label: 'Prompt Shown on Pay Side', type: 'text', defaultValue: 'Listing a piece of your own?' },
          { id: 'pricing_way_pay_cta', label: 'Button Label on Pay Side', type: 'text', defaultValue: 'See what you earn' },
          { id: 'pricing_way_earn_q', label: 'Prompt Shown on Earn Side', type: 'text', defaultValue: 'Renting or buying with us?' },
          { id: 'pricing_way_earn_cta', label: 'Button Label on Earn Side', type: 'text', defaultValue: 'See what you pay' },
        ],
      },
      {
        id: 'related_policies',
        title: '7. Related Policies & Fine Print',
        description: 'Footer policy links bar and print disclaimer note.',
        fields: [
          { id: 'pricing_related_heading', label: 'Bar Heading', type: 'text', defaultValue: 'Related policies' },
          {
            id: 'pricing_related_note',
            label: 'Disclaimer Line',
            type: 'textarea',
            defaultValue:
              'This page explains our prices, charges and shares in plain words. Where it ever differs from our Terms & Conditions, the Terms apply. Last reviewed 11 October 2026.',
          },
          { id: 'pricing_related_print_btn', label: 'Print Button Text', type: 'text', defaultValue: 'Print or save as PDF' },
        ],
      },
      {
        id: 'closing_band',
        title: '8. Closing Concierge Band',
        description: 'Dark closing section with WhatsApp, Email & Account links.',
        fields: [
          { id: 'pricing_closing_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'We are here for you' },
          { id: 'pricing_closing_heading', label: 'Heading Prefix', type: 'text', defaultValue: 'A question about a ' },
          { id: 'pricing_closing_italic', label: 'Heading Italic Gold Word', type: 'text', defaultValue: 'price?' },
          {
            id: 'pricing_closing_body',
            label: 'Description',
            type: 'textarea',
            defaultValue:
              'Every piece has its own story, and its own prices. If you would like the exact figures for a piece, help planning a rental around your celebrations, or a word about listing with us, message us. We would much rather help you directly, and nothing is too small to ask.',
          },
          { id: 'pricing_closing_signoff', label: 'Signature Line', type: 'text', defaultValue: 'With love, the House of Kaira team' },
          { id: 'pricing_closing_wa_btn', label: 'WhatsApp Button Text', type: 'text', defaultValue: 'Message us on WhatsApp' },
          { id: 'pricing_closing_email_btn', label: 'Email Button Text', type: 'text', defaultValue: 'Write to us' },
          {
            id: 'pricing_closing_wa_desc',
            label: 'WhatsApp Channel Description',
            type: 'text',
            defaultValue: 'The fastest way to reach us. Seven days a week, 10 AM to 8 PM IST, with replies usually within 2 hours.',
          },
          {
            id: 'pricing_closing_email_desc',
            label: 'Email Channel Description',
            type: 'text',
            defaultValue: 'hello@houseofkaira.com. Best for anything you would like in writing, such as an invoice or a payout statement.',
          },
          { id: 'pricing_closing_account_title', label: 'Account Row Title', type: 'text', defaultValue: 'Every order and payout, in one place' },
          {
            id: 'pricing_closing_account_desc',
            label: 'Account Row Description',
            type: 'text',
            defaultValue: 'Your bookings, receipts, deposits and payouts, in My Account.',
          },
        ],
      },
    ],
  },
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
        title: '1. Hero & Steps',
        fields: [
          { id: 'hiw_kicker', label: 'Eyebrow', type: 'text', defaultValue: 'Simple by Design' },
          { id: 'hiw_heading', label: 'Custom Main Heading', type: 'text', defaultValue: '', placeholder: 'Fashion that moves beautifully — and keeps moving.' },
          { id: 'hiw_lead', label: 'Lead Description', type: 'textarea', defaultValue: 'Everything you need to know about shopping, renting, selling, and giving beautiful pieces a longer life — in one place, laid out clearly.' },
          { id: 'hiw_left_col_title', label: 'Left Column Title', type: 'text', defaultValue: 'Rent or buy preloved with confidence' },
          { id: 'hiw_step_0_title', label: 'Step 1 Title', type: 'text', defaultValue: 'Browse & discover' },
          { id: 'hiw_step_1_title', label: 'Step 2 Title', type: 'text', defaultValue: 'Choose your mode' },
          { id: 'hiw_step_2_title', label: 'Step 3 Title', type: 'text', defaultValue: 'Checkout & confirm' },
          { id: 'hiw_step_3_title', label: 'Step 4 Title', type: 'text', defaultValue: 'Delivered, ready to wear' },
          { id: 'hiw_right_col_title', label: 'Right Column Title', type: 'text', defaultValue: 'Give your wardrobe a second life' },
          { id: 'hiw_lstep_0_title', label: 'Lister Step 1 Title', type: 'text', defaultValue: 'Photograph & list' },
        ],
      },
      {
        id: 'modes',
        title: '2. Ways to Wear (Modes)',
        fields: [
          { id: 'hiw_modes_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Two ways to wear' },
          { id: 'hiw_modes_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Find what your moment fits' },
          { id: 'hiw_rent_title', label: 'Rent Card Title', type: 'text', defaultValue: 'Access couture freely.' },
          { id: 'hiw_rent_lead', label: 'Rent Card Subtitle', type: 'text', defaultValue: 'The whole outfit. None of the storage.' },
        ],
      },
      {
        id: 'divider',
        title: '3. Craft Quote Band',
        fields: [
          { id: 'hiw_craft_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'The Craft' },
          { id: 'hiw_craft_quote', label: 'Quote', type: 'textarea', defaultValue: "“The zardozi on a Sabyasachi lehenga doesn't diminish because it's been worn once. Designer craftsmanship deserves to be experienced – not stored.”" },
        ],
      },
      {
        id: 'list_and_earn',
        title: '4. List & Earn Section',
        fields: [
          { id: 'hiw_earn_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'List & Earn' },
          { id: 'hiw_earn_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Your wardrobe has been waiting for this.' },
          { id: 'hiw_earn_lead', label: 'Description', type: 'textarea', defaultValue: 'The wedding lehenga in the back of your cupboard. The bridal set that deserves another evening. Every designer piece you loved and wore once is a piece someone is searching for right now.' },
        ],
      },
      {
        id: 'faq',
        title: '5. Quick FAQs',
        fields: [
          { id: 'hiw_faq_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'FAQ' },
          { id: 'hiw_faq_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Questions you probably have.' },
        ],
      },
      {
        id: 'closing',
        title: '6. Closing CTA',
        fields: [
          { id: 'hiw_closing_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: "Every outfit has a story. We make sure it's never the last chapter." },
          { id: 'hiw_closing_sub', label: 'Subtext', type: 'textarea', defaultValue: "Whether you're dressing for a celebration or giving a beautiful piece another moment to shine – this is where that story continues." },
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
        title: '1. FAQ Header',
        fields: [
          { id: 'faq_greeting', label: 'Greeting Line', type: 'text', defaultValue: "Hello, we're so glad you're here" },
          { id: 'faq_heading', label: 'Custom Main Heading', type: 'text', defaultValue: '', placeholder: "What's on your mind?" },
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
        title: '1. Contact Hero',
        fields: [
          { id: 'contact_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'WE ARE HERE' },
          { id: 'contact_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Write to us anytime.' },
          { id: 'contact_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Questions about sizing, custom dates, or listing a piece? Our studio team is here to help.' },
        ],
      },
      {
        id: 'reach',
        title: '2. Ways to Reach Us Card',
        fields: [
          { id: 'contact_reach_heading', label: 'Card Heading', type: 'text', defaultValue: 'Ways to reach us' },
          { id: 'contact_wa_title', label: 'WhatsApp Label', type: 'text', defaultValue: 'WhatsApp' },
          { id: 'contact_wa_number', label: 'WhatsApp Number', type: 'text', defaultValue: '+91 93401 39300' },
          { id: 'contact_wa_note', label: 'WhatsApp Hours / Note', type: 'text', defaultValue: 'Seven days a week, 10 AM to 8 PM IST, with replies usually within 2 hours.' },
          { id: 'contact_wa_button', label: 'WhatsApp Button Label', type: 'text', defaultValue: 'Message on WhatsApp' },
          { id: 'contact_email_title', label: 'Email Label', type: 'text', defaultValue: 'Email' },
          { id: 'contact_email_address', label: 'Support Email', type: 'text', defaultValue: 'hello@houseofkaira.com' },
          { id: 'contact_email_note', label: 'Email SLA Note', type: 'text', defaultValue: 'Replies within 24 hours.' },
          { id: 'contact_call_title', label: 'Phone Label', type: 'text', defaultValue: 'Phone' },
          { id: 'contact_call_number', label: 'Phone Number', type: 'text', defaultValue: '+91 93401 39300' },
          { id: 'contact_call_note', label: 'Call Note', type: 'text', defaultValue: 'Studio concierge line.' },
        ],
      },
      {
        id: 'visit',
        title: '3. Visit Studio Card',
        fields: [
          { id: 'contact_visit_heading', label: 'Card Heading', type: 'text', defaultValue: 'Visit our Indore studio' },
          { id: 'contact_visit_lead', label: 'Intro Text', type: 'textarea', defaultValue: 'Come in for trials, custom measurements or dropping off a piece by appointment.' },
          { id: 'contact_visit_address', label: 'Studio Address', type: 'textarea', defaultValue: '24, Dadi Dham (Basement), Joy Builders Colony, Old Palasiya, Indore, Madhya Pradesh 452001' },
          { id: 'contact_visit_terms', label: 'Appointment Note', type: 'text', defaultValue: 'By appointment only · Mon – Sat' },
          { id: 'contact_visit_button', label: 'Button Label', type: 'text', defaultValue: 'Book a studio visit' },
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
        title: '1. Shipping Policy Hero',
        fields: [
          { id: 'shipping_hero_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Delivered with care' },
          { id: 'shipping_hero_prefix', label: 'Heading Text', type: 'text', defaultValue: 'Shipping & ' },
          { id: 'shipping_hero_italic', label: 'Heading Italic Gold Word', type: 'text', defaultValue: 'delivery' },
          {
            id: 'shipping_hero_lead',
            label: 'Lead Text',
            type: 'textarea',
            defaultValue: 'Every piece is prepared by hand and planned to reach you in good time for your celebration. Here is exactly how delivery and returns work, for every rental and every preloved piece.',
          },
        ],
      },
      {
        id: 'intro',
        title: '2. Opening Paragraph & Rental Window',
        fields: [
          {
            id: 'shipping_intro_part1',
            label: 'Intro First Part',
            type: 'textarea',
            defaultValue: 'Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Rentals are planned around your celebration, and standard delivery is ',
          },
          { id: 'shipping_intro_part2', label: 'Intro Closing Part', type: 'text', defaultValue: ", including a rental's journey back to us." },
          { id: 'shipping_window_title', label: 'Rental Window Card Title', type: 'text', defaultValue: 'How your rental window works' },
          { id: 'shipping_window_hint', label: 'Rental Window Hint', type: 'text', defaultValue: 'Your exact dates are always shown before you pay.' },
          { id: 'shipping_ways_prefix', label: 'Ways We Deliver Heading', type: 'text', defaultValue: 'Ways we ' },
          { id: 'shipping_ways_italic', label: 'Ways We Deliver Italic Word', type: 'text', defaultValue: 'deliver' },
          { id: 'shipping_ways_subline', label: 'Ways We Deliver Subline', type: 'text', defaultValue: 'Times are counted from the day your piece leaves us.' },
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
        title: '1. Refunds Header',
        fields: [
          { id: 'refunds_hero_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Our commitment to you' },
          { id: 'refunds_hero_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Refunds & cancellations' },
          { id: 'refunds_hero_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'Plans change, and we understand. Before you order or after, here is exactly what happens when they do, in plain words and with no surprises.' },
        ],
      },
    ],
  },
  {
    slug: 'deposit-policy',
    label: 'Deposit Policy (/deposit-policy)',
    liveUrl: '/deposit-policy',
    description: 'Security deposit rules, release timelines, and inspection criteria.',
    defaultStyle: { ...DEFAULT_PAGE_STYLE },
    sections: [
      {
        id: 'hero',
        title: '1. Deposit Policy Header',
        fields: [
          { id: 'deposit_hero_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Our promise to you' },
          { id: 'deposit_hero_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Your security deposit' },
          {
            id: 'deposit_hero_lead',
            label: 'Lead Text',
            type: 'textarea',
            defaultValue: 'Every rental is protected by a fully refundable deposit, held in safekeeping while the piece is with you. Here is everything you need to know, from the day you pay it to the day it returns to you.',
          },
          { id: 'opening_body', label: 'Custom Opening Paragraph', type: 'textarea', defaultValue: '', placeholder: 'Leave blank to use default opening note with bold highlight' },
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
        title: '1. Care Policy Header & Intro',
        fields: [
          { id: 'care_hero_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Our promise to every piece' },
          { id: 'care_hero_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Care, cleaning & damage' },
          {
            id: 'care_hero_lead',
            label: 'Lead Text',
            type: 'textarea',
            defaultValue: 'How we look after every piece, how you can too, and what happens in the rare moment something goes wrong, explained simply and fairly.',
          },
          { id: 'care_intro_body', label: 'Custom Opening Paragraph', type: 'textarea', defaultValue: '', placeholder: 'Leave blank to keep default stewardship intro' },
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
        title: '1. Seller Guidelines Header',
        fields: [
          { id: 'seller_hero_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'Sell with Us' },
          { id: 'seller_hero_title', label: 'Heading', type: 'text', defaultValue: 'Seller Guidelines' },
          { id: 'seller_hero_lead', label: 'Lead Text', type: 'textarea', defaultValue: 'How we curate, authenticate, insure, and pay out for pieces shared from your wardrobe.' },
          { id: 'seller_protect_title', label: 'Protection Card Title', type: 'text', defaultValue: 'Your piece is in trusted hands' },
          { id: 'seller_protect_line', label: 'Protection Card Subtitle', type: 'text', defaultValue: 'Deposits, cleaning, and doorstep care are handled end-to-end.' },
          { id: 'seller_closing_title', label: 'Closing Band Title', type: 'text', defaultValue: 'Ready to list your piece?' },
          { id: 'seller_closing_lead', label: 'Closing Band Lead', type: 'textarea', defaultValue: 'Submit photographs in two minutes and our curation team will respond within 48 hours.' },
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
        title: '1. Terms Header',
        fields: [
          { id: 'terms_hero_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'THE AGREEMENT BETWEEN US' },
          { id: 'terms_hero_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Terms & Conditions' },
          {
            id: 'terms_hero_lead',
            label: 'Lead Text',
            type: 'textarea',
            defaultValue: 'Everything you and House of Kaira agree to when you rent, buy or list with us. Written to be read, with every clause numbered so it is easy to find and share.',
          },
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
        title: '1. Privacy Header',
        fields: [
          { id: 'privacy_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'PRIVACY POLICY' },
          { id: 'privacy_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Privacy Policy' },
          {
            id: 'privacy_lead',
            label: 'Lead Text',
            type: 'textarea',
            defaultValue: 'How House of Kaira collects, uses, stores and protects your personal information across our rental, purchase and consignment services. Written to be read, with every clause numbered so it is easy to find and share.',
          },
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
        title: '1. Cookies Header',
        fields: [
          { id: 'cookie_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'COOKIE NOTICE & CHOICES' },
          { id: 'cookie_heading', label: 'Custom Heading', type: 'text', defaultValue: '', placeholder: 'Cookie Notice & Choices' },
          {
            id: 'cookie_lead',
            label: 'Lead Text',
            type: 'textarea',
            defaultValue: 'How House of Kaira uses cookies and browser storage, which ones we set, why we need them, and how you can switch off everything that is not strictly necessary.',
          },
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
        title: '1. Maintenance Notice',
        fields: [
          { id: 'maint_eyebrow', label: 'Eyebrow', type: 'text', defaultValue: 'A short pause' },
          { id: 'maint_heading_prefix', label: 'Heading Prefix', type: 'text', defaultValue: 'We’ll be back' },
          { id: 'maint_heading_italic', label: 'Heading Italic Gold Words', type: 'text', defaultValue: 'very shortly' },
          { id: 'maint_lead', label: 'Message', type: 'textarea', defaultValue: 'House of Kaira is undergoing brief scheduled maintenance.' },
          { id: 'maint_status_text', label: 'Status Pill Text', type: 'text', defaultValue: 'Scheduled update in progress' },
          { id: 'maint_celebrating_heading', label: 'Concierge Box Heading', type: 'text', defaultValue: 'Celebrating' },
          { id: 'maint_celebrating_italic', label: 'Concierge Box Italic Word', type: 'text', defaultValue: 'soon?' },
          { id: 'maint_whatsapp_cta', label: 'WhatsApp Button Label', type: 'text', defaultValue: 'Message us on WhatsApp' },
          { id: 'maint_instagram_cta', label: 'Instagram Button Label', type: 'text', defaultValue: 'Our latest pieces on Instagram' },
        ],
      },
    ],
  },
];
