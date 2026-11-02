/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Shipping & Delivery Policy Presentation Data (Spec § 8.15)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { SHIPPING_TOKENS } from './shippingSettings';

export const SHIPPING_HERO = {
  eyebrow: 'DELIVERED WITH CARE',
  headingPrefix: 'Shipping & ',
  headingItalic: 'delivery',
  subtitle:
    'Every piece is prepared by hand and planned to reach you in good time for your celebration. Here is exactly how delivery and returns work, for every rental and every preloved piece.'
};

export const SHIPPING_POPULAR_QUESTIONS = [
  { id: 'w-how', text: 'How does the rental window work?' },
  { id: 'c-free', text: 'When is delivery free?' },
  { id: 'r-how', text: 'How does my rental go back?' },
  { id: 'i-where', text: 'Do you deliver outside India?' }
];

export const SHIPPING_RENTAL_WINDOW_CARD = {
  title: 'How your rental window works',
  hint: 'Your exact dates are always shown before you pay.',
  days: [
    {
      label: 'DAY 1',
      title: 'It arrives',
      line: 'The day before your celebration',
      isCelebration: false
    },
    {
      label: 'DAY 2',
      title: 'Your celebration',
      line: 'Wear it, and enjoy every moment',
      isCelebration: true
    },
    {
      label: 'DAY 3',
      title: 'It goes back',
      line: 'We collect it from your door',
      isCelebration: false
    }
  ],
  bracketDaysLabel: `Standard rental window · ${SHIPPING_TOKENS.window_standard} · one price`,
  extraDays: {
    label: 'EXTRA DAYS',
    title: 'Need it longer?',
    line: "Add days when you book, at the piece's daily rate."
  },
  bracketExtraLabel: 'Optional · daily rate',
  note1: {
    title: 'For example',
    text: 'A celebration on the 5th: your piece arrives on the 4th and goes back on the 6th.'
  },
  note2: {
    title: 'More than one day of celebrations?',
    textPrefix: 'Add one extra day for each additional day. ',
    linkText: 'See how it works',
    targetAnswerId: 'w-wedding'
  }
};

export const SHIPPING_INTRO = {
  text: 'Every House of Kaira piece is prepared by hand before it travels: pressed, wrapped in tissue, placed in its garment bag and boxed with care. Rentals are planned around your celebration, and standard delivery is ',
  emphasis: `free on every order of ${SHIPPING_TOKENS.free_delivery_min} or more`,
  suffix: ", including a rental's journey back to us."
};

export interface DeliveryOptionItem {
  id: string;
  place: string;
  name: string;
  time: string;
  timeFigureKey?: string;
  tag: { text: string; tone: 'yes' | 'mid' };
  tagFigureKey?: string;
  tagFigureValue?: string;
  note: string;
  linkText: string;
  targetAnswerId: string;
}

export const SHIPPING_WAYS_WE_DELIVER = {
  titlePrefix: 'Ways we ',
  italicWord: 'deliver',
  subline: 'Times are counted from the day your piece leaves us.',
  options: [
    {
      id: 'opt-standard',
      place: 'ACROSS INDIA',
      name: 'Standard',
      time: '3 to 5 business days',
      timeFigureKey: 'standard_delivery',
      tag: { text: 'Free from ₹5,000', tone: 'yes' as const },
      tagFigureKey: 'free_delivery_min',
      tagFigureValue: '₹5,000',
      note: 'Below that, worked out for your address and shown before you pay. For a rental, the journey back is included.',
      linkText: 'Details',
      targetAnswerId: 'c-free'
    },
    {
      id: 'opt-express',
      place: 'MOST PINCODES IN INDIA',
      name: 'Express',
      time: '1 to 2 business days',
      timeFigureKey: 'express_delivery',
      tag: { text: 'Quoted at checkout', tone: 'mid' as const },
      note: 'Priced for your address, never a flat fee, and charged even when standard delivery is free.',
      linkText: 'Details',
      targetAnswerId: 'c-express'
    },
    {
      id: 'opt-same-day',
      place: 'WITHIN INDORE',
      name: 'Same day',
      time: 'The same day',
      tag: { text: 'Quoted at checkout', tone: 'mid' as const },
      note: 'For rentals and preloved pieces, shown at checkout whenever it is available for your order.',
      linkText: 'Details',
      targetAnswerId: 'c-same'
    },
    {
      id: 'opt-international',
      place: 'WORLDWIDE',
      name: 'International',
      time: 'Within 10 business days',
      timeFigureKey: 'intl_delivery',
      tag: { text: 'Quoted at checkout', tone: 'mid' as const },
      note: 'For preloved pieces only. Customs duties and import taxes are paid by you on arrival.',
      linkText: 'Details',
      targetAnswerId: 'i-where'
    }
  ],
  footnote:
    'For a rental, the day your piece arrives is set by your celebration, whichever option you choose. Express and same day delivery simply let you book closer to your date.'
};

export interface ShippingSectionSummary {
  num: string;
  id: string;
  barLabel: string;
  titlePrefix: string;
  italicWord: string;
  desc: string;
  questionsCount: number;
}

export const SHIPPING_SECTIONS_LIST: ShippingSectionSummary[] = [
  {
    num: '01',
    id: 's-window',
    barLabel: 'Rental window',
    titlePrefix: 'Your rental ',
    italicWord: 'window',
    desc: 'Planned around your celebration: when your piece arrives, and when it goes back.',
    questionsCount: 7
  },
  {
    num: '02',
    id: 's-charges',
    barLabel: 'Charges',
    titlePrefix: 'Delivery ',
    italicWord: 'charges',
    desc: 'What delivery costs, and when it is on us.',
    questionsCount: 7
  },
  {
    num: '03',
    id: 's-preloved',
    barLabel: 'Preloved',
    titlePrefix: 'A preloved piece, on its ',
    italicWord: 'way',
    desc: 'When a preloved piece leaves us, and how long it takes to reach you.',
    questionsCount: 6
  },
  {
    num: '04',
    id: 's-arrival',
    barLabel: 'Arrival',
    titlePrefix: 'When your piece ',
    italicWord: 'arrives',
    desc: 'Opening your parcel, checking the fit, and what travels inside with the piece.',
    questionsCount: 9
  },
  {
    num: '05',
    id: 's-returns',
    barLabel: 'Returns',
    titlePrefix: 'Sending your rental ',
    italicWord: 'back',
    desc: 'Doorstep collection, using the prepaid label, and what needs to go inside.',
    questionsCount: 8
  },
  {
    num: '06',
    id: 's-intl',
    barLabel: 'Outside India',
    titlePrefix: 'Delivering outside ',
    italicWord: 'India',
    desc: 'Customs duties, delivery times, and taking a rental piece on your travels abroad.',
    questionsCount: 6
  },
  {
    num: '07',
    id: 's-issues',
    barLabel: 'When it is on us',
    titlePrefix: 'When something goes ',
    italicWord: 'wrong',
    desc: 'Late deliveries, courier delays, and what we do if a parcel does not reach you.',
    questionsCount: 7
  }
];
