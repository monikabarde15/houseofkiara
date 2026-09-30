/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — HOMEPAGE · SEED REGISTRY
   Spec Section 15 & Appendix A (v213)
========================================================= */

import { HomepageRegistry } from '../types/homepage.types';

export const initialHomepageRegistry: HomepageRegistry = {
  bands: [
    { id: 'hero', lbl: 'Hero', ttl: 'HERO', grp: 'Homepage', sub: 'The first screen' },
    { id: 'hiw', lbl: 'How It Works', ttl: 'HOW IT WORKS', grp: 'Homepage', sub: 'Two panes behind one toggle' },
    { id: 'featured', lbl: 'Featured Pieces', ttl: 'FEATURED PIECES', grp: 'Homepage', sub: 'Handpicked from the catalogue' },
    { id: 'category', lbl: 'Shop by Category', ttl: 'SHOP BY CATEGORY', grp: 'Homepage', sub: 'The 5-tile mosaic' },
    { id: 'occasions', lbl: 'Shop by Occasion', ttl: 'SHOP BY OCCASION', grp: 'Homepage', sub: 'Present but not built' },
    { id: 'commit', lbl: 'Our Commitment', ttl: 'OUR COMMITMENT', grp: 'Homepage', sub: 'Pills and cards' },
    { id: 'designers', lbl: 'Featured Designers', ttl: 'FEATURED DESIGNERS', grp: 'Homepage', sub: 'Six across' },
    { id: 'testi', lbl: 'Testimonials', ttl: 'TESTIMONIALS', grp: 'Homepage', sub: 'Customer quotes' },
    { id: 'insta', lbl: 'Instagram', ttl: 'INSTAGRAM', grp: 'Homepage', sub: 'Six tiles and follow line' }
  ],

  vis: {
    hero: true,
    hiw: true,
    featured: true,
    category: true,
    occasions: false, // Not built on storefront
    commit: true,
    designers: true,
    testi: true,
    insta: true
  },

  /* 1. Hero Band */
  hero: {
    eyebrow: "India's Premier Circular Fashion Platform",
    heading: 'Wear it with *love.*\nPass it on.',
    headingMob: 'Wear it with *love.* Pass it on.',
    sub: "Rent, buy preloved, or discover new designer pieces — all in one curated destination for India's most discerning occasions.",
    subMob: '',
    subMobV3: "Rent, buy preloved, or discover new designer pieces — curated for India's most discerning occasions.",
    ctaA: { lbl: 'Explore Collection', url: '/rent' },
    ctaB: { lbl: 'How It Works', url: '/how-it-works' },
    statsOn: false,
    stats: [
      { id: 'stat-1', val: '2,400+', lbl: 'Curated Pieces', lblMob: 'Pieces', src: 'Typed' },
      { id: 'stat-2', val: '70+', lbl: 'Active Designers', lblMob: 'Designers', src: 'Typed' },
      { id: 'stat-3', val: '₹50+', lbl: 'Cr Fashion Circulated', lblMob: 'Circulated', src: 'Typed' }
    ],
    layout: 'Split',
    side: 'Right',
    dim: 38,
    layoutMob: 'Full bleed',
    dimMob: 52,
    img: {
      alt: 'Bridal lehenga on House of Kaira',
      img: '',
      focal: 'Centre'
    },
    imgMob: {
      alt: 'Bridal lehenga on House of Kaira',
      img: '',
      focal: 'Centre'
    },
    badge: {
      on: false,
      mob: false,
      mode: 'Piece',
      sku: 'HOK-SAB-002',
      title: '',
      sub: ''
    }
  },

  /* 2. How It Works Band */
  hiw: {
    eyebrow: 'Simple by Design',
    heading: 'How House of Kaira *works*',
    tabA: 'I want to shop',
    tabB: 'I want to sell',
    open: 'Shop',
    shop: [
      {
        id: 'step-1',
        ico: 'search',
        t: 'Browse & Discover',
        d: 'Explore thousands of designer pieces across rent, preloved, and new categories — filtered by occasion, budget, and aesthetic.'
      },
      {
        id: 'step-2',
        ico: 'pin',
        t: 'Pick Your Path',
        d: 'Choose to rent for the occasion, buy preloved forever, or purchase brand new with authenticity guaranteed.'
      },
      {
        id: 'step-3',
        ico: 'box',
        t: 'Doorstep Delivery',
        d: 'Your look arrives dry-cleaned, pressed, and tailored — delivered right to your door with insured transit.'
      },
      {
        id: 'step-4',
        ico: 'heart',
        t: 'Wear, Love, Repeat',
        d: 'Enjoy your look. For rentals, we collect it hassle-free. For purchases, love it forever or re-circulate it.'
      }
    ],
    sell: [
      {
        id: 'sell-1',
        ico: 'camera',
        t: 'Photograph & List',
        d: 'Upload a few photos of your piece, set your price, and go live in under 10 minutes.'
      },
      {
        id: 'sell-2',
        ico: 'users',
        t: 'We Review & Feature',
        d: 'Our team reviews your listing and recommends pricing to maximize your earnings.'
      },
      {
        id: 'sell-3',
        ico: 'card',
        t: 'Ship & Get Paid',
        d: 'Once sold or rented, ship with our prepaid kit and receive {{payout_cycle}} direct to bank.'
      }
    ],
    sellCard: {
      on: true,
      head: 'The hours of *craftsmanship* on that piece deserve more than a dark wardrobe shelf.',
      body: 'Give your occasion wear another life. Let someone else fall in love with it — and earn while you do.',
      quote: "Every piece has a story. Don't let it end with you.",
      cta: { lbl: 'List Your Piece →', url: '/list-your-piece' }
    }
  },

  /* 3. Featured Pieces Band */
  featured: {
    eyebrow: 'Handpicked for You',
    heading: 'Featured *Pieces*',
    viewAll: { lbl: 'View All →', url: '/rent/all' },
    slots: ['HOK-SAB-002', 'HOK-MM-001', 'HOK-TT-001', 'HOK-AD-001'],
    shots: { 'HOK-SAB-002': 'On model' },
    cap: 8,
    perRow: 4,
    perRowMob: 2,
    topUp: 'Off',
    topUpBy: 'Newest live',
    showModeBadge: true,
    showWishlist: true,
    showWasPrice: true,
    showDuration: true
  },

  /* 4. Shop by Category Band */
  category: {
    eyebrow: 'Curated for Every Occasion',
    heading: 'Shop by *Category*',
    viewAll: { lbl: 'View All →', url: '/categories' },
    layout: 'Mosaic',
    layoutMob: 'Carousel',
    header: true,
    headerMob: false,
    ctaLbl: 'Shop Now',
    showCount: false,
    showCountMob: true,
    countLblMob: '{n} pieces available',
    tiles: {
      'bridal-lehenga': { alt: 'Bridal lehengas', lbl: 'Bridal Lehengas', kickMob: 'Curated for every occasion' },
      'sherwani': { alt: 'Sherwanis', lbl: 'Sherwanis', kickMob: 'Curated for every occasion' },
      'saree': { alt: 'Sarees', lbl: 'Sarees', kickMob: 'Curated for every occasion' },
      'anarkali': { alt: 'Anarkalis', lbl: 'Anarkalis', kickMob: 'Curated for every occasion' },
      'indo-western': { alt: 'Indo-Western', lbl: 'Indo-Western', kickMob: 'Curated for every occasion' }
    }
  },

  /* 5. Shop by Occasion Band */
  occasions: {
    eyebrow: 'Dressed for the Day',
    heading: 'Shop by *Occasion*',
    viewAll: { lbl: 'All Occasions →', url: '/occasions' },
    layout: 'Even grid',
    ctaLbl: 'Shop the Edit',
    showCount: true
  },

  /* 6. Our Commitment Band */
  commit: {
    eyebrow: 'Our Commitment',
    heading: 'Fashion that gives *back*',
    body: "Every outfit rented or resold keeps textile waste out of landfill. House of Kaira is building India's most loved circular fashion economy — one outfit at a time.",
    bodyMob: "Every outfit rented or resold keeps textile waste out of landfill. Building India's most loved circular fashion economy — one outfit at a time.",
    pills: [
      { id: 'pill-1', l: 'Rent', u: '/rent', on: true },
      { id: 'pill-2', l: 'Buy Preloved', u: '/preloved', on: true },
      { id: 'pill-3', l: 'Buy New', u: '/buy-new', on: true },
      { id: 'pill-4', l: 'List & Sell', u: '/list-your-piece', on: true }
    ],
    cards: [
      {
        id: 'c-1',
        ico: 'shield',
        mob: true,
        h: 'Every piece rented is one less outfit the world needed to make.',
        d: "At HOK, choosing to rent isn't a compromise — it's a quiet act of intention. Wear beautifully, tread lightly."
      },
      {
        id: 'c-2',
        ico: 'heart',
        mob: true,
        h: 'Designer craftsmanship should be experienced, not just owned.',
        d: 'Heritage weaves, intricate zardozi, hand-cut silks — made to be celebrated, then passed on.'
      },
      {
        id: 'c-3',
        ico: 'card',
        mob: false,
        h: 'Your wardrobe is an asset. It’s time it started acting like one.',
        d: 'Turn unworn occasion wear into passive earnings while keeping luxury in active circulation.'
      },
      {
        id: 'c-4',
        ico: 'refresh',
        mob: true,
        h: 'Occasion wear that outlives the occasion.',
        d: 'A wardrobe that expands for every wedding, gala, and dinner — without taking up a single centimetre of closet space.'
      }
    ]
  },

  /* 7. Featured Designers Band */
  designers: {
    eyebrow: 'Trusted Creators',
    heading: 'Featured *Designers*',
    viewAll: { lbl: 'All Designers →', url: '/designers' },
    layout: 'Grid',
    layoutMob: 'Carousel',
    header: true,
    headerMob: false,
    slideKick: 'Featured Designer',
    ctaLbl: 'Shop the Collection',
    showCount: true,
    countLbl: '{n} PIECES',
    countLblMob: '{n} pieces available',
    cap: 6
  },

  /* 8. Testimonials Band */
  testi: {
    eyebrow: 'Worn, Loved & Shared Across India',
    heading: 'What our customers *say*',
    layout: 'Three across',
    layoutMob: 'Swipe',
    cards: [
      {
        id: 't-1',
        on: true,
        name: 'Priya Rathore',
        ini: 'PR',
        city: 'Mumbai',
        ctx: 'Rented for a Wedding',
        stars: 5,
        src: 'Verified order',
        ref: 'HOK-ORD-001',
        q: "I wore a Sabyasachi lehenga to my sister's wedding for a fraction of the retail price. The quality, the packaging — everything felt completely premium."
      },
      {
        id: 't-2',
        on: true,
        name: 'Aishwarya Sharma',
        ini: 'AS',
        city: 'Delhi',
        ctx: 'Sold her Bridal Lehenga',
        stars: 5,
        src: 'Verified order',
        ref: 'HOK-ORD-002',
        q: 'Listing was completely seamless. HOK picked up the lehenga, handled dry cleaning and photography, and I had earnings in my account within a week.'
      },
      {
        id: 't-3',
        on: true,
        name: 'Neha Kulkarni',
        ini: 'NK',
        city: 'Pune',
        ctx: 'Regular Renter',
        stars: 5,
        src: 'Verified order',
        ref: 'HOK-ORD-003',
        q: 'I have rented four times this season for different celebrations. The fit is always flawless and returning is literally just putting it in the bag.'
      }
    ]
  },

  /* 9. Instagram Band */
  insta: {
    eyebrow: 'Our Community',
    heading: 'As seen on *Instagram*',
    viewAll: { lbl: '', url: '' },
    viewAllMob: '',
    source: 'Manual tiles',
    strip: 'Follow our story at',
    stripMob: 'Follow us at',
    tiles: [
      { id: 'in-1', alt: 'Instagram post 1', url: '' },
      { id: 'in-2', alt: 'Instagram post 2', url: '' },
      { id: 'in-3', alt: 'Instagram post 3', url: '' },
      { id: 'in-4', alt: 'Instagram post 4', url: '' },
      { id: 'in-5', alt: 'Instagram post 5', url: '' },
      { id: 'in-6', alt: 'Instagram post 6', url: '' }
    ]
  }
};
