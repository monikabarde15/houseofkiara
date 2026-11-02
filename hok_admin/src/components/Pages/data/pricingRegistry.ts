/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Registry: Pricing & Fees Policy Presentation Data (Spec § 8.16)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export const PRICING_HERO = {
  eyebrow: 'CLEAR FROM THE START',
  headingPrefix: 'Pricing & ',
  headingItalic: 'fees',
  subtitle:
    'Every price, every charge and every share, explained plainly for renting, buying and listing with us, so that nothing ever comes as a surprise.'
};

export const PRICING_POPULAR_QUERIES = [
  { id: 'r-price', side: 'pay', text: 'How is a rental priced?' },
  { id: 'c-free', side: 'pay', text: 'When is delivery free?' },
  { id: 'x-late', side: 'pay', text: 'What does a late return cost?' },
  { id: 'e-how', side: 'earn', text: 'How is my share decided?' }
];

export const PRICING_LEDGER = {
  tabs: [
    { id: 'pay', label: 'Renting or buying', title: 'What you pay' },
    { id: 'earn', label: 'Listing your pieces', title: 'What you earn' }
  ],
  pay: {
    title: 'Every charge, at a glance',
    hint: 'Each piece shows its own prices before you book or buy.',
    rows: [
      {
        name: 'The piece',
        rental: 'One price for 3 days',
        rentalFigureKey: 'rental_window_days',
        rentalFigureValue: '3 days',
        preloved: 'The price shown'
      },
      {
        name: 'Extra days',
        rental: 'The daily rate, per day',
        preloved: 'Not applicable'
      },
      {
        name: 'GST',
        rental: '18% on the rental fee',
        rentalFigureKey: 'gst_rental',
        rentalFigureValue: '18%',
        preloved: '5% on the price',
        prelovedFigureKey: 'gst_preloved',
        prelovedFigureValue: '5%'
      },
      {
        name: 'Deposit',
        rental: 'Refundable, set for each piece',
        preloved: 'None'
      },
      {
        name: 'Delivery in India',
        rental: 'Free from ₹5,000',
        rentalFigureKey: 'free_delivery_min',
        rentalFigureValue: '₹5,000',
        preloved: 'Free from ₹5,000',
        prelovedFigureKey: 'free_delivery_min',
        prelovedFigureValue: '₹5,000'
      },
      {
        name: 'Faster delivery',
        rental: 'Quoted before you pay',
        preloved: 'Quoted before you pay'
      },
      {
        name: 'Cleaning and care',
        rental: 'Always included',
        preloved: 'Always included'
      },
      {
        name: 'Changing your mind',
        rental: 'Free until 7 days before it starts',
        rentalFigureKey: 'rental_cancel_full',
        rentalFigureValue: '7 days',
        preloved: 'Free until it is dispatched'
      }
    ],
    footText:
      'No convenience fee, no platform fee, and nothing extra for paying by card or UPI. Every way to pay'
  },
  earn: {
    title: 'Your earnings, at a glance',
    hint: 'Every share is agreed with you, piece by piece.',
    rows: [
      {
        name: 'Your share',
        detail: 'Set for each piece',
        subtext: 'By its value and the work it takes to rent or sell it, so that you recover a meaningful part of what you invested.'
      },
      {
        name: 'Never part of it',
        detail: 'GST, deposits and delivery',
        subtext: 'And our promo codes never reduce your share.'
      },
      {
        name: 'Listing your piece',
        detail: 'Free',
        subtext: 'Collection, photography, cleaning and every delivery to renters and buyers are on us.'
      },
      {
        name: 'When you are paid',
        detail: 'Within 3 working days',
        figureKey: 'lister_payout_days',
        figureValue: '3 working days',
        subtext: 'Once a rental is back with us and inspected, or once a buyer has received the piece.'
      },
      {
        name: 'Where it goes',
        detail: 'Your own account',
        subtext: 'A bank account or UPI ID in your name, with a statement for every payout.'
      },
      {
        name: 'Costs that can be yours',
        detail: 'Only four, each agreed first',
        subtext: 'A repair to make it ready, an early return, a missed collection, or delivery when you borrow it back.'
      }
    ],
    footText:
      "Your share and your prices are confirmed in your piece's Listing Terms before it goes live, as our Seller Guidelines"
  }
};

export const PRICING_SIDE_INTROS = {
  pay: 'Every rental is priced for its window, and every preloved piece at the price agreed with its owner. GST is added at checkout, standard delivery is free on every order of ₹5,000 or more, and a deposit is simply held in safekeeping until your piece is home with us.',
  earn: 'When your piece is rented or sold, you receive a share of what it earns, agreed with you for that piece before it goes live, so that you recover a meaningful part of what you invested in it. Listing is free, and your earnings reach your own account within 3 working days.'
};

export const PRICING_WORKED_EXAMPLES = {
  titlePrefix: 'Your order, in ',
  italicWord: 'numbers',
  subline:
    'One rental and one preloved piece, added up line by line. Every piece shows its own prices before you book or buy.',
  rental: {
    lead: 'A bridal lehenga priced at ₹18,000 for its standard window of 3 days, with a daily rate of ₹3,500 and a deposit of ₹20,000.',
    standardDays: '3 days',
    windowPrice: '₹18,000',
    extraDayRate: '₹3,500',
    rentalFee: '₹21,500',
    gstRate: '18%',
    gstAmount: '₹3,870',
    delivery: 'Free',
    total: '₹25,370',
    depositHeld: '₹20,000',
    depositRefundWindow: '3 to 5 business days',
    lateDailyRate: '₹3,500'
  },
  preloved: {
    lead: 'A designer saree listed at ₹60,000, on which an offer of ₹54,000 has been accepted.',
    price: '₹54,000',
    gstRate: '5%',
    gstAmount: '₹2,700',
    delivery: 'Free',
    total: '₹56,700',
    note: 'No deposit, and nothing more to pay once it is yours.'
  }
};

export interface PricingSectionItem {
  id: string;
  side: 'pay' | 'earn';
  num: string;
  title: string;
  count: number;
}

export const PRICING_SECTIONS_LIST: PricingSectionItem[] = [
  { id: 's-renting', side: 'pay', num: '01', title: 'Renting a piece', count: 6 },
  { id: 's-preloved', side: 'pay', num: '02', title: 'Buying preloved', count: 4 },
  { id: 's-deposit', side: 'pay', num: '03', title: 'Your deposit', count: 5 },
  { id: 's-delivery', side: 'pay', num: '04', title: 'Delivery charges', count: 5 },
  { id: 's-extras', side: 'pay', num: '05', title: 'Extra days and late returns', count: 5 },
  { id: 's-cancel', side: 'pay', num: '06', title: 'Cancellations and refunds', count: 4 },
  { id: 's-damage', side: 'pay', num: '07', title: 'If something happens', count: 4 },
  { id: 's-paying', side: 'pay', num: '08', title: 'How you pay', count: 4 },
  { id: 's-share', side: 'earn', num: '09', title: 'Your share', count: 4 },
  { id: 's-costs', side: 'earn', num: '10', title: 'What listing costs', count: 3 },
  { id: 's-payouts', side: 'earn', num: '11', title: 'Your payouts', count: 3 },
  { id: 's-tax', side: 'earn', num: '12', title: 'Tax and your PAN', count: 2 },
  { id: 's-prices', side: 'earn', num: '13', title: 'Prices and offers', count: 3 }
];
