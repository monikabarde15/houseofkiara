import { SiteSettingsRegistry } from '../types/siteSettings.types';

export const initialSiteSettingsRegistry: SiteSettingsRegistry = {
  announcement: {
    showAcrossSite: true,
    howItMoves: 'Scrolling loop',
    loopTimeSeconds: 28,
    pauseOnHover: true,
    backgroundColor: '#1A1612',
    textColor: '#C9A96E',
    italicLineColor: '#E3D2B4',
    separator: 'Dot',
    messages: [
      {
        id: 'msg-1',
        text: 'Every story deserves a second chapter',
        italicSerif: true,
        showsOn: 'All pages',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-2',
        text: 'Free delivery on orders above {{free_delivery_min}}',
        italicSerif: false,
        showsOn: 'All pages',
        link: '/rent',
        goLiveDate: '',
        expiresDate: '2026-03-28',
        enabled: true
      },
      {
        id: 'msg-3',
        text: 'New designer arrivals every Friday',
        italicSerif: false,
        showsOn: 'All pages',
        link: '/buy-new',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-4',
        text: 'Wedding season styling appointments now open',
        italicSerif: false,
        showsOn: 'All pages',
        link: '/contact',
        goLiveDate: '2026-04-01',
        expiresDate: '2026-05-31',
        enabled: true
      },
      {
        id: 'msg-5',
        text: 'Rent · Buy Preloved · Buy New',
        italicSerif: false,
        showsOn: 'All pages',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-6',
        text: 'Pan-India delivery available',
        italicSerif: false,
        showsOn: 'All pages',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-7',
        text: 'Wear it once. Wear it right.',
        italicSerif: true,
        showsOn: 'Rent',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-8',
        text: 'Free delivery on rentals above {{free_delivery_min_rental}}',
        italicSerif: false,
        showsOn: 'Rent',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-9',
        text: 'Returns collected from your door',
        italicSerif: false,
        showsOn: 'Rent',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-10',
        text: 'Every piece has a story.',
        italicSerif: true,
        showsOn: 'Preloved',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-11',
        text: 'Authenticated by HOK · Honestly graded',
        italicSerif: false,
        showsOn: 'Preloved',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-12',
        text: 'Your lehenga deserves another standing ovation',
        italicSerif: true,
        showsOn: 'List Your Piece',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-13',
        text: 'Your piece earns while you own it',
        italicSerif: false,
        showsOn: 'List Your Piece',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-14',
        text: 'We handle everything',
        italicSerif: false,
        showsOn: 'List Your Piece',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-15',
        text: 'Curated Indian Occasion Wear',
        italicSerif: true,
        showsOn: 'Account',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-16',
        text: 'Rent · Buy Preloved · List Your Own',
        italicSerif: false,
        showsOn: 'Account',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      },
      {
        id: 'msg-17',
        text: 'Pan-India Delivery',
        italicSerif: false,
        showsOn: 'Account',
        link: '',
        goLiveDate: '',
        expiresDate: '',
        enabled: true
      }
    ]
  },
  header: {
    searchPlaceholder: 'Search lehengas, designers, occasions…',
    bagCartLabel: 'Cart',
    stickyHeader: true,
    showTagline: true,
    reducedHeader: {
      backLink: 'Back to cart',
      securityLine: 'SSL encrypted · Secured by Razorpay',
      pagesUsingIt: 'Checkout, Payment, Order confirmation'
    },
    navItems: [
      {
        id: 'nav-rent',
        shown: true,
        label: 'Rent',
        link: '/rent',
        badge: '',
        style: 'Accent',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-rent-cat',
            heading: 'Shop by Category',
            links: [
              { id: 'l1', label: 'Bridal Lehengas', path: '/rent/bridal' },
              { id: 'l2', label: 'Sarees', path: '/rent/sarees' },
              { id: 'l3', label: 'Anarkalis', path: '/rent/anarkalis' },
              { id: 'l4', label: 'Sharara Sets', path: '/rent/sharara' },
              { id: 'l5', label: 'Sherwanis', path: '/rent/sherwanis' },
              { id: 'l6', label: 'Kurta Sets', path: '/rent/kurta' },
              { id: 'l7', label: 'See all categories', path: '/rent/all', position: 'last' }
            ]
          },
          {
            id: 'col-rent-des',
            heading: 'Shop by Designer',
            links: [
              { id: 'l8', label: 'Sabyasachi', path: '/rent/sabyasachi' },
              { id: 'l9', label: 'Manish Malhotra', path: '/rent/mm' },
              { id: 'l10', label: 'Anita Dongre', path: '/rent/anita' },
              { id: 'l11', label: 'Tarun Tahiliani', path: '/rent/tarun' },
              { id: 'l12', label: 'Abu Jani Sandeep', path: '/rent/ajs' },
              { id: 'l13', label: 'Torani', path: '/rent/torani' },
              { id: 'l14', label: 'Raw Mango', path: '/rent/rawmango' },
              { id: 'l15', label: 'Rimzim Dadu', path: '/rent/rimzim' },
              { id: 'l16', label: 'See all designers', path: '/rent/designers', position: 'last' }
            ]
          }
        ]
      },
      {
        id: 'nav-preloved',
        shown: true,
        label: 'Buy Preloved',
        link: '/buy-preloved',
        badge: '',
        style: 'Plain',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-pre-cat',
            heading: 'Shop by Category',
            links: [
              { id: 'pl1', label: 'Bridal Lehengas', path: '/preloved/bridal' },
              { id: 'pl2', label: 'Sarees', path: '/preloved/sarees' },
              { id: 'pl3', label: 'Anarkalis', path: '/preloved/anarkalis' },
              { id: 'pl4', label: 'Sharara Sets', path: '/preloved/sharara' },
              { id: 'pl5', label: 'Sherwanis', path: '/preloved/sherwanis' }
            ]
          },
          {
            id: 'col-pre-cond',
            heading: 'By Condition',
            links: [
              { id: 'pl6', label: 'Like New', path: '/preloved/likenew' },
              { id: 'pl7', label: 'Gently Worn', path: '/preloved/gently' },
              { id: 'pl8', label: 'Loved & Cherished', path: '/preloved/loved' }
            ]
          },
          {
            id: 'col-pre-des',
            heading: 'Shop by Designer',
            links: [
              { id: 'pl9', label: 'Sabyasachi', path: '/preloved/sabyasachi' },
              { id: 'pl10', label: 'Manish Malhotra', path: '/preloved/mm' },
              { id: 'pl11', label: 'Anita Dongre', path: '/preloved/anita' },
              { id: 'pl12', label: 'Raw Mango', path: '/preloved/rawmango' },
              { id: 'pl13', label: 'Tarun Tahiliani', path: '/preloved/tarun' },
              { id: 'pl14', label: 'Torani', path: '/preloved/torani' }
            ]
          },
          {
            id: 'col-pre-price',
            heading: 'By Price',
            links: [
              { id: 'pl15', label: 'Under ₹15,000', path: '/preloved/under15' },
              { id: 'pl16', label: '₹15,000 – ₹50,000', path: '/preloved/15to50' },
              { id: 'pl17', label: '₹50,000 & above', path: '/preloved/above50' }
            ]
          }
        ]
      },
      {
        id: 'nav-buy-new',
        shown: true,
        label: 'Buy New',
        link: '/buy-new',
        badge: '',
        style: 'Plain',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-bn-cat',
            heading: 'Shop by Category',
            links: [
              { id: 'bn1', label: 'Bridal Lehengas', path: '/new/bridal' },
              { id: 'bn2', label: 'Sarees', path: '/new/sarees' },
              { id: 'bn3', label: 'Anarkalis', path: '/new/anarkalis' },
              { id: 'bn4', label: 'Sharara Sets', path: '/new/sharara' },
              { id: 'bn5', label: 'Sherwanis', path: '/new/sherwanis' },
              { id: 'bn6', label: 'See all categories', path: '/new/all', position: 'last' }
            ]
          },
          {
            id: 'col-bn-des',
            heading: 'Shop by Designer',
            links: [
              { id: 'bn7', label: 'Sabyasachi', path: '/new/sabyasachi' },
              { id: 'bn8', label: 'Manish Malhotra', path: '/new/mm' },
              { id: 'bn9', label: 'Tarun Tahiliani', path: '/new/tarun' },
              { id: 'bn10', label: 'Raw Mango', path: '/new/rawmango' },
              { id: 'bn11', label: 'Torani', path: '/new/torani' },
              { id: 'bn12', label: 'Ekaya', path: '/new/ekaya' },
              { id: 'bn13', label: 'See all designers', path: '/new/all', position: 'last' }
            ]
          }
        ]
      },
      {
        id: 'nav-women',
        shown: true,
        label: 'Women',
        link: '/women',
        badge: '',
        style: 'Plain',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-w-cat',
            heading: 'Shop by Category',
            links: [
              { id: 'w1', label: 'Bridal Lehengas', path: '/women/bridal' },
              { id: 'w2', label: 'Sarees', path: '/women/sarees' },
              { id: 'w3', label: 'Anarkalis', path: '/women/anarkalis' },
              { id: 'w4', label: 'Sharara Sets', path: '/women/sharara' },
              { id: 'w5', label: 'Kurta Sets', path: '/women/kurta' },
              { id: 'w6', label: 'Gowns', path: '/women/gowns' },
              { id: 'w7', label: 'See all', path: '/women/all', position: 'last' }
            ]
          },
          {
            id: 'col-w-occ',
            heading: 'Shop by Occasion',
            links: [
              { id: 'w8', label: 'Bridal', path: '/women/occ/bridal' },
              { id: 'w9', label: 'Wedding Guest', path: '/women/occ/guest' },
              { id: 'w10', label: 'Mehendi & Sangeet', path: '/women/occ/mehendi' },
              { id: 'w11', label: 'Festive', path: '/women/occ/festive' },
              { id: 'w12', label: 'Cocktail', path: '/women/occ/cocktail' }
            ]
          },
          {
            id: 'col-w-mode',
            heading: 'Shop by Mode',
            links: [
              { id: 'w13', label: 'Rent', path: '/women/rent' },
              { id: 'w14', label: 'Buy Preloved', path: '/women/preloved' },
              { id: 'w15', label: 'Buy New', path: '/women/new' }
            ]
          }
        ]
      },
      {
        id: 'nav-men',
        shown: true,
        label: 'Men',
        link: '/men',
        badge: '',
        style: 'Plain',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-m-cat',
            heading: 'Shop by Category',
            links: [
              { id: 'm1', label: 'Sherwanis', path: '/men/sherwanis' },
              { id: 'm2', label: 'Bandhgalas', path: '/men/bandhgala' },
              { id: 'm3', label: 'Kurta Sets', path: '/men/kurta' },
              { id: 'm4', label: 'Indo-Western', path: '/men/indowestern' },
              { id: 'm5', label: 'Nehru Jackets', path: '/men/nehru' },
              { id: 'm6', label: 'See all', path: '/men/all', position: 'last' }
            ]
          },
          {
            id: 'col-m-occ',
            heading: 'Shop by Occasion',
            links: [
              { id: 'm7', label: 'Groom', path: '/men/occ/groom' },
              { id: 'm8', label: 'Wedding Guest', path: '/men/occ/guest' },
              { id: 'm9', label: 'Festive', path: '/men/occ/festive' }
            ]
          },
          {
            id: 'col-m-mode',
            heading: 'Shop by Mode',
            links: [
              { id: 'm10', label: 'Rent', path: '/men/rent' },
              { id: 'm11', label: 'Buy Preloved', path: '/men/preloved' },
              { id: 'm12', label: 'Buy New', path: '/men/new' }
            ]
          }
        ]
      },
      {
        id: 'nav-occasions',
        shown: true,
        label: 'Occasions',
        link: '/occasions',
        badge: '',
        style: 'Plain',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-occ-br',
            heading: 'Browse Occasions',
            links: [
              { id: 'o1', label: 'Bridal', path: '/occ/bridal' },
              { id: 'o2', label: 'Wedding Guest', path: '/occ/guest' },
              { id: 'o3', label: 'Mehendi & Sangeet', path: '/occ/mehendi' },
              { id: 'o4', label: 'Festive', path: '/occ/festive' },
              { id: 'o5', label: 'Cocktail', path: '/occ/cocktail' },
              { id: 'o6', label: 'Reception', path: '/occ/reception' },
              { id: 'o7', label: 'Engagement', path: '/occ/engagement' }
            ]
          },
          {
            id: 'col-occ-mode',
            heading: 'Shop by Mode',
            links: [
              { id: 'o8', label: 'Rent for the occasion', path: '/occ/rent' },
              { id: 'o9', label: 'Buy Preloved', path: '/preloved/all' },
              { id: 'o10', label: 'Buy New', path: '/new/all' }
            ]
          },
          {
            id: 'col-occ-qf',
            heading: 'Quick Filters',
            links: [
              { id: 'o11', label: 'Under ₹10,000 to rent', path: '/occ/under10' },
              { id: 'o12', label: 'Available this weekend', path: '/occ/rent' },
              { id: 'o13', label: 'Ships in 24 hours', path: '/occ/rent' }
            ]
          }
        ]
      },
      {
        id: 'nav-designers',
        shown: true,
        label: 'Designers',
        link: '/designers',
        badge: '',
        style: 'Plain',
        hasMenu: true,
        menuEnabled: true,
        menuColumns: [
          {
            id: 'col-des-feat',
            heading: 'Featured Designers',
            links: [
              { id: 'd1', label: 'Sabyasachi', path: '/des/sabyasachi' },
              { id: 'd2', label: 'Manish Malhotra', path: '/des/mm' },
              { id: 'd3', label: 'Anita Dongre', path: '/des/anita' },
              { id: 'd4', label: 'Tarun Tahiliani', path: '/des/tarun' },
              { id: 'd5', label: 'Raw Mango', path: '/des/rawmango' },
              { id: 'd6', label: 'Abu Jani Sandeep', path: '/des/ajs' },
              { id: 'd7', label: 'Torani', path: '/des/torani' },
              { id: 'd8', label: 'A–Z index', path: '/designers/index', position: 'last' }
            ]
          },
          {
            id: 'col-des-disc',
            heading: 'Discover by Type',
            links: [
              { id: 'd9', label: 'Couture Houses', path: '/des/couture' },
              { id: 'd10', label: 'Contemporary Labels', path: '/des/contemporary' },
              { id: 'd11', label: 'Heritage Weaves', path: '/des/heritage' },
              { id: 'd12', label: 'Indie Designers', path: '/des/indie' }
            ]
          },
          {
            id: 'col-des-new',
            heading: 'New to HOK',
            links: [
              { id: 'd13', label: 'Papa Don\'t Preach', path: '/des/pap' },
              { id: 'd14', label: 'Ekaya', path: '/des/ekaya' },
              { id: 'd15', label: 'Rahul Mishra', path: '/des/rahul' },
              { id: 'd16', label: 'Partner with HOK', path: '/list/your/piece', position: 'last' }
            ]
          }
        ]
      },
      {
        id: 'nav-shop-cat',
        shown: true,
        label: 'Shop by Category',
        link: '/categories',
        badge: '',
        style: 'Plain',
        hasMenu: false,
        menuEnabled: false,
        menuColumns: []
      },
      {
        id: 'nav-how-it-works',
        shown: true,
        label: 'How It Works',
        link: '/how-it-works',
        badge: '',
        style: 'Plain',
        hasMenu: false,
        menuEnabled: false,
        menuColumns: []
      },
      {
        id: 'nav-about',
        shown: true,
        label: 'About HOK',
        link: '/about',
        badge: '',
        style: 'Plain',
        hasMenu: false,
        menuEnabled: false,
        menuColumns: []
      },
      {
        id: 'nav-new-arrivals',
        shown: true,
        label: 'New Arrivals',
        link: '/new-arrivals',
        badge: 'New',
        style: 'Plain',
        hasMenu: false,
        menuEnabled: false,
        menuColumns: []
      },
      {
        id: 'nav-list-your-piece',
        shown: true,
        label: 'List Your Piece',
        link: '/list-your-piece',
        badge: '',
        style: 'Highlight',
        hasMenu: false,
        menuEnabled: false,
        menuColumns: []
      }
    ]
  },
  footer: {
    blurbUnderWordmark: '{{tagline}}',
    copyrightLine: '© {{year}} House of Kaira. All rights reserved. Indore, India.',
    trustBadges: 'Secure Payments, Circular Fashion',
    paymentMethods: {
      upi: true,
      visa: true,
      mastercard: true,
      rupay: true,
      netbanking: true,
      paytm: false,
      amex: false,
      nocost_emi: false
    },
    newsletter: {
      show: false,
      heading: 'Stay in the loop',
      buttonLabel: 'Subscribe',
      body: 'Get early access to drops and exclusive promotions.',
      consentLine: 'By subscribing you agree to our Privacy Policy.'
    },
    linkColumns: [
      {
        id: 'col-shop',
        heading: 'Shop',
        links: [
          { id: 'fl-1', label: 'Rent', path: '/rent' },
          { id: 'fl-2', label: 'Buy Preloved', path: '/preloved' },
          { id: 'fl-3', label: 'Buy New', path: '/buy-new' },
          { id: 'fl-4', label: 'Shop by Occasion', path: '/occasions' },
          { id: 'fl-5', label: 'Shop by Category', path: '/categories' },
          { id: 'fl-6', label: 'All Designers', path: '/designers' }
        ]
      },
      {
        id: 'col-sell',
        heading: 'Sell with Us',
        links: [
          { id: 'fl-7', label: 'List Your Piece', path: '/list-your-piece' },
          { id: 'fl-8', label: 'How It Works', path: '/how-it-works' },
          { id: 'fl-9', label: 'Seller Guidelines', path: '/seller-guidelines' },
          { id: 'fl-10', label: 'Pricing & Fees', path: '/pricing' },
          { id: 'fl-11', label: 'Designer Partners', path: '/designer-partners' }
        ]
      },
      {
        id: 'col-support',
        heading: 'Support',
        links: [
          { id: 'fl-12', label: 'FAQs', path: '/faqs' },
          { id: 'fl-13', label: 'Care, Cleaning & Damage', path: '/care-policy' },
          { id: 'fl-14', label: 'Deposit Policy', path: '/deposit-policy' },
          { id: 'fl-15', label: 'Refunds & Cancellations', path: '/refunds' },
          { id: 'fl-16', label: 'Contact Us', path: '/contact' }
        ]
      },
      {
        id: 'col-company',
        heading: 'Company',
        links: [
          { id: 'fl-17', label: 'About HOK', path: '/about' },
          { id: 'fl-18', label: 'Sustainability', path: '/sustainability' },
          { id: 'fl-19', label: 'Careers', path: '/careers' },
          { id: 'fl-20', label: 'Press', path: '/press' },
          { id: 'fl-21', label: 'Blog', path: '/blog' }
        ]
      }
    ],
    legalRow: [
      { id: 'leg-1', label: 'Terms & Conditions', path: '/terms' },
      { id: 'leg-2', label: 'Privacy Policy', path: '/privacy' },
      { id: 'leg-3', label: 'Refund & Cancellation Policy', path: '/refunds' },
      { id: 'leg-4', label: 'Deposit Policy', path: '/deposit-policy' },
      { id: 'leg-5', label: 'Care, Cleaning & Damage Policy', path: '/care-policy' },
      { id: 'leg-6', label: 'Shipping Policy', path: '/shipping-policy' },
      { id: 'leg-7', label: 'Cookie Policy', path: '/cookies' }
    ]
  },
  mobile: {
    tabs: [
      { id: 'mtab-1', label: 'Home', path: '/', shown: true },
      { id: 'mtab-2', label: 'Browse', path: '/rent', shown: true },
      { id: 'mtab-3', label: 'Wishlist', path: '/wishlist', shown: true },
      { id: 'mtab-4', label: 'Bag', path: '/cart', shown: true, isBagTab: true },
      { id: 'mtab-5', label: 'Account', path: '/account', shown: true }
    ],
    drawer: {
      showSearchField: true,
      showModeShortcuts: true,
      itemVisibility: {
        'nav-rent': true,
        'nav-preloved': true,
        'nav-buy-new': true,
        'nav-women': true,
        'nav-men': true,
        'nav-occasions': true,
        'nav-designers': true,
        'nav-shop-cat': true,
        'nav-how-it-works': true,
        'nav-about': true,
        'nav-new-arrivals': true,
        'nav-list-your-piece': true
      }
    }
  },
  brand: {
    siteName: 'House of Kaira',
    tagline: 'Circular Luxury Fashion',
    brandQuote: 'Every outfit has a story. We make sure it’s never the last chapter.',
    assets: {
      logoMark: {
        file: 'hok-logo.png',
        dimensions: '512×512',
        sizeKb: 24,
        addedBy: 'Soumya',
        addedWhen: '12 days ago'
      },
      wordmark: { file: '' },
      inverseMark: { file: '' },
      browserTabIcon: { file: '' },
      phoneHomeScreenIcon: { file: '' },
      linkPreviewImage: { file: '' }
    }
  },
  contact: {
    supportEmail: 'hello@houseofkaira.com',
    phone: '+91 731 4005 220',
    whatsApp: '+91 98765 43210',
    daysOpen: '7 days a week',
    hours: '10 AM – 8 PM IST',
    replyWithinHrs: 2,
    returnsAddress: {
      addressedTo: 'HOK Returns Desk',
      addressLine1: '14 Vijay Nagar',
      addressLine2: 'Scheme 54',
      landmark: '',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pinCode: '452010',
      contactNumber: '+91 731 4005 220'
    },
    whatsAppButton: {
      show: true,
      tooltip: 'Chat with us',
      preFilledMessage: 'Hi House of Kaira, I have a question about'
    },
    social: {
      instagram: '@house_of_kaira',
      followLabel: 'Follow Us',
      facebook: '',
      pinterest: '',
      youTube: '',
      linkedIn: ''
    }
  },
  google: {
    headline: 'House of Kaira — Rent, Buy & List Luxury Indian Occasion Wear',
    description: 'Discover India’s most curated platform for luxury occasion wear — rent, buy preloved, or list your own Sabyasachi, Manish Malhotra, and more.',
    allowSearchEngines: true,
    tracking: {
      googleAnalytics: '',
      metaPixel: '',
      googleSearchConsole: ''
    },
    devSettings: {
      titleTemplate: '{{page_title}} {{sep}} {{site_name}}',
      separator: '—',
      canonicalAddress: 'https://houseofkaira.com',
      publishSitemap: true
    }
  },
  legal: {
    registeredEntity: {
      registeredName: 'House of Kaira Retail Pvt Ltd',
      gstin: '23AABCH1234K1ZV',
      cin: 'U52609MP2025PTC071482',
      registeredAddress: '14 Vijay Nagar, Scheme 54, Indore, Madhya Pradesh 452010'
    },
    cookieConsent: {
      showBanner: false,
      heading: 'We use cookies',
      position: 'Bottom bar',
      body: 'We use cookies to run the site, remember your bag, and understand what people browse. You can accept all, or take only what the site needs to work.',
      acceptLabel: 'Accept all',
      rejectLabel: 'Only essential',
      manageLabel: 'Manage',
      policyLink: '/cookies',
      categories: {
        essential: 'Keeps you signed in, remembers your bag, and lets checkout work. These cannot be turned off.',
        analytics: 'Lets us see which pieces people browse and where they arrived from, so we know what to stock more of.',
        marketing: 'Lets us show House of Kaira pieces on Instagram and Facebook to people who have visited before.'
      }
    }
  },
  regional: {
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR ₹',
    dateFormat: 'DD MMM YYYY',
    numberFormat: 'Indian — lakh and crore'
  },
  maintenance: {
    maintenance: {
      enabled: false,
      heading: 'We’ll be right back',
      expectedBack: '',
      body: 'House of Kaira is briefly down for scheduled work. Rentals already booked are unaffected.',
      allowList: 'Soumya, Priya (Ops)'
    },
    notFoundPage: {
      heading: 'This piece has moved on',
      body: 'The page you were looking for is no longer here — which happens on a platform where pieces find new homes.',
      suggestedLinks: 'Rent, Buy Preloved, New Arrivals'
    }
  }
};
