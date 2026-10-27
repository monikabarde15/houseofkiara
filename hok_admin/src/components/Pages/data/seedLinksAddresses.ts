/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Seed Data: Links & Addresses (Spec §6, Screen 17)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import { LinksAndAddressesData } from '../types/links.types';

export const SEED_LINKS_ADDRESSES: LinksAndAddressesData = {
  /* -------------------------------------------------------------
     Card 1: Links in the header and footer (Screen 17)
  ------------------------------------------------------------- */
  headerFooterLinks: [
    { id: 'hf_1', location: 'Header', where: 'Header', label: 'Rent', address: '/rent', targetType: 'catalogue', leadsTo: 'Products: The catalogue, filtered to rentals.' },
    { id: 'hf_2', location: 'Header', where: 'Header', label: 'Buy Preloved', address: '/buy-preloved', targetType: 'catalogue', leadsTo: 'Products: The catalogue, filtered to preloved pieces.' },
    { id: 'hf_3', location: 'Header', where: 'Header', label: 'Buy New', address: '/buy-new', targetType: 'catalogue', leadsTo: 'Products: The catalogue, filtered to Buy New.' },
    { id: 'hf_4', location: 'Header', where: 'Header', label: 'Women', address: '/women', targetType: 'catalogue', leadsTo: 'Master Data: Womenswear landing pages.' },
    { id: 'hf_5', location: 'Header', where: 'Header', label: 'Men', address: '/men', targetType: 'catalogue', leadsTo: 'Master Data: Menswear landing pages.' },
    { id: 'hf_6', location: 'Header', where: 'Header', label: 'Occasions', address: '/occasions', targetType: 'catalogue', leadsTo: 'Master Data: One landing page per occasion.' },
    { id: 'hf_7', location: 'Header', where: 'Header', label: 'Designers', address: '/designers', targetType: 'catalogue', leadsTo: 'Designers: The index, and one profile per active designer.' },
    { id: 'hf_8', location: 'Footer · Sell with Us', where: 'Footer · Sell with Us', label: 'List Your Piece', address: '/list-your-piece', targetType: 'page', targetSlug: '/list-your-piece', leadsTo: 'List Your Piece' },
    { id: 'hf_9', location: 'Footer · Sell with Us', where: 'Footer · Sell with Us', label: 'How It Works', address: '/how-it-works', targetType: 'page', targetSlug: '/how-it-works', leadsTo: 'How It Works' },
    { id: 'hf_10', location: 'Footer · Sell with Us', where: 'Footer · Sell with Us', label: 'Seller Guidelines', address: '/seller-guidelines', targetType: 'page', targetSlug: '/seller-guidelines', leadsTo: 'Seller Guidelines' },
    { id: 'hf_11', location: 'Footer · Sell with Us', where: 'Footer · Sell with Us', label: 'Pricing & Fees', address: '/pricing', targetType: 'page', targetSlug: '/pricing', leadsTo: 'Pricing & Fees' },
    { id: 'hf_12', location: 'Footer · Sell with Us', where: 'Footer · Sell with Us', label: 'Designer Partners', address: '/designer-partners', targetType: 'nowhere', targetSlug: '/designer-partners', leadsTo: '● Designer Partners, not built', isTerracotta: true },
    { id: 'hf_13', location: 'Footer · Support', where: 'Footer · Support', label: 'FAQs', address: '/faqs', targetType: 'page', targetSlug: '/faqs', leadsTo: 'Help & FAQs' },
    { id: 'hf_14', location: 'Footer · Support', where: 'Footer · Support', label: 'Care, Cleaning & Damage', address: '/care-policy', targetType: 'page', targetSlug: '/care-policy', leadsTo: 'Care, Cleaning & Damage Policy' },
    { id: 'hf_15', location: 'Footer · Support', where: 'Footer · Support', label: 'Deposit Policy', address: '/deposit-policy', targetType: 'page', targetSlug: '/deposit-policy', leadsTo: 'Deposit Policy' },
    { id: 'hf_16', location: 'Footer · Support', where: 'Footer · Support', label: 'Refunds & Cancellations', address: '/refunds', targetType: 'page', targetSlug: '/refunds', leadsTo: 'Refund & Cancellation Policy' },
    { id: 'hf_17', location: 'Footer · Support', where: 'Footer · Support', label: 'Contact Us', address: '/contact', targetType: 'page', targetSlug: '/contact', leadsTo: 'Contact Us' },
    { id: 'hf_18', location: 'Footer · Company', where: 'Footer · Company', label: 'About HOK', address: '/about', targetType: 'page', targetSlug: '/about', leadsTo: 'About HOK' },
    { id: 'hf_19', location: 'Footer · Company', where: 'Footer · Company', label: 'Sustainability', address: '/sustainability', targetType: 'nowhere', targetSlug: '/sustainability', leadsTo: '● Sustainability, not built', isTerracotta: true },
    { id: 'hf_20', location: 'Footer · Company', where: 'Footer · Company', label: 'Careers', address: '/careers', targetType: 'nowhere', targetSlug: '/careers', leadsTo: '● Careers, not built', isTerracotta: true },
    { id: 'hf_21', location: 'Footer · Company', where: 'Footer · Company', label: 'Press', address: '/press', targetType: 'nowhere', targetSlug: '/press', leadsTo: '● Press, not built', isTerracotta: true },
    { id: 'hf_22', location: 'Footer · Company', where: 'Footer · Company', label: 'Blog', address: '/blog', targetType: 'nowhere', targetSlug: '/blog', leadsTo: '● Blog, not built', isTerracotta: true },
    { id: 'hf_23', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Terms & Conditions', address: '/terms', targetType: 'page', targetSlug: '/terms', leadsTo: 'Terms & Conditions' },
    { id: 'hf_24', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Privacy Policy', address: '/privacy', targetType: 'page', targetSlug: '/privacy', leadsTo: 'Privacy Policy' },
    { id: 'hf_25', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Refund & Cancellation Policy', address: '/refunds', targetType: 'page', targetSlug: '/refunds', leadsTo: 'Refund & Cancellation Policy' },
    { id: 'hf_26', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Deposit Policy', address: '/deposit-policy', targetType: 'page', targetSlug: '/deposit-policy', leadsTo: 'Deposit Policy' },
    { id: 'hf_27', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Care, Cleaning & Damage Policy', address: '/care-policy', targetType: 'page', targetSlug: '/care-policy', leadsTo: 'Care, Cleaning & Damage Policy' },
    { id: 'hf_28', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Shipping Policy', address: '/shipping-policy', targetType: 'page', targetSlug: '/shipping-policy', leadsTo: 'Shipping & Delivery Policy' },
    { id: 'hf_29', location: 'Footer · policy row', where: 'Footer · policy row', label: 'Cookie Policy', address: '/cookies', targetType: 'page', targetSlug: '/cookies', leadsTo: 'Cookie Policy' },
    { id: 'hf_30', location: 'Mobile bar', where: 'Mobile bar', label: 'Home', address: '/', targetType: 'catalogue', leadsTo: 'Homepage: The homepage.' },
    { id: 'hf_31', location: 'Mobile bar', where: 'Mobile bar', label: 'Browse', address: '/rent', targetType: 'catalogue', leadsTo: 'Products: The catalogue, filtered to rentals.' },
    { id: 'hf_32', location: 'Mobile bar', where: 'Mobile bar', label: 'Wishlist', address: '/wishlist', targetType: 'catalogue', leadsTo: 'Customers: Saved pieces.' },
    { id: 'hf_33', location: 'Mobile bar', where: 'Mobile bar', label: 'Bag', address: '/cart', targetType: 'catalogue', leadsTo: 'Orders: The bag.' },
    { id: 'hf_34', location: 'Mobile bar', where: 'Mobile bar', label: 'Account', address: '/account', targetType: 'catalogue', leadsTo: 'Customers: My Account.' }
  ],

  /* -------------------------------------------------------------
     Card 2: Pages linked but not built (Screen 17)
  ------------------------------------------------------------- */
  linkedNotBuilt: [
    {
      id: 'lnb_1',
      slug: '/designer-partners',
      title: 'Designer Partners',
      decision: 'Build a small page',
      linksPointingAtIt: [
        { location: 'Footer · Sell with Us', label: '“Designer Partners”' },
        { location: 'List Your Piece', label: '“Partner Enquiry” button in For Boutiques' },
        { location: 'Pricing & Fees', label: '“Designer Partners” in I am a designer or a boutique' },
        { location: 'Seller Guidelines', label: '“Designer Partners” in Who can list a piece with House of Kaira?' }
      ]
    },
    {
      id: 'lnb_2',
      slug: '/size-guide',
      title: 'Size & Measurement Guide',
      decision: 'Undecided',
      linksPointingAtIt: [
        { location: 'Every rental product page', label: 'The Size & Measurement Guide link beside the measurements' },
        { location: 'Every preloved product page', label: 'The Size & Measurement Guide link beside the measurements' }
      ]
    },
    {
      id: 'lnb_3',
      slug: '/sustainability',
      title: 'Sustainability',
      decision: 'Point the link at an existing page',
      linksPointingAtIt: [
        { location: 'Footer · Company', label: '“Sustainability”' }
      ]
    },
    {
      id: 'lnb_4',
      slug: '/careers',
      title: 'Careers',
      decision: 'Build a small page',
      linksPointingAtIt: [
        { location: 'Footer · Company', label: '“Careers”' }
      ]
    },
    {
      id: 'lnb_5',
      slug: '/press',
      title: 'Press',
      decision: 'Hide the link until there is something',
      linksPointingAtIt: [
        { location: 'Footer · Company', label: '“Press”' }
      ]
    },
    {
      id: 'lnb_6',
      slug: '/blog',
      title: 'Blog',
      decision: 'Undecided',
      linksPointingAtIt: [
        { location: 'Footer · Company', label: '“Blog”' }
      ]
    }
  ],

  /* -------------------------------------------------------------
     Card 3: Old addresses sent to a page (Screen 17)
  ------------------------------------------------------------- */
  oldAddresses: [
    { id: 'old_1', oldPath: '/faq', targetSlug: '/faqs', targetPageTitle: 'Help & FAQs', isEnabled: true },
    { id: 'old_2', oldPath: '/help', targetSlug: '/faqs', targetPageTitle: 'Help & FAQs', isEnabled: true },
    { id: 'old_3', oldPath: '/contact-us', targetSlug: '/contact', targetPageTitle: 'Contact Us', isEnabled: true },
    { id: 'old_4', oldPath: '/support', targetSlug: '/contact', targetPageTitle: 'Contact Us', isEnabled: true },
    { id: 'old_5', oldPath: '/about-us', targetSlug: '/about', targetPageTitle: 'About HOK', isEnabled: true },
    { id: 'old_6', oldPath: '/sell', targetSlug: '/list-your-piece', targetPageTitle: 'List Your Piece', isEnabled: true },
    { id: 'old_7', oldPath: '/lyp', targetSlug: '/list-your-piece', targetPageTitle: 'List Your Piece', isEnabled: true },
    { id: 'old_8', oldPath: '/privacy-policy', targetSlug: '/privacy', targetPageTitle: 'Privacy Policy', isEnabled: true },
    { id: 'old_9', oldPath: '/cookie-policy', targetSlug: '/cookies', targetPageTitle: 'Cookie Policy', isEnabled: true },
    { id: 'old_10', oldPath: '/refund-policy', targetSlug: '/refunds', targetPageTitle: 'Refund & Cancellation Policy', isEnabled: true },
    { id: 'old_11', oldPath: '/pricing-fees', targetSlug: '/pricing', targetPageTitle: 'Pricing & Fees', isEnabled: true }
  ],

  /* -------------------------------------------------------------
     Card 4: Addresses people tried that led nowhere (Screen 17)
  ------------------------------------------------------------- */
  notFound404Logs: [
    {
      id: 'nf_1',
      attemptedPath: '/preloved/sabyasachi-crimson-zardozi-bridal-lehenga',
      subtitle: 'A piece that has sold',
      hitsCount: 41,
      visits: 41,
      lastHitDate: '15 Oct 2026',
      lastDate: '15 Oct 2026',
      cameFrom: 'Instagram',
      referrers: ['instagram.com'],
      resolved: false
    },
    {
      id: 'nf_2',
      attemptedPath: '/rent/sabyasachi-ivory-bridal-lehnga',
      subtitle: 'A mistyped link to a piece',
      hitsCount: 17,
      visits: 17,
      lastHitDate: '14 Oct 2026',
      lastDate: '14 Oct 2026',
      cameFrom: 'Instagram',
      referrers: ['instagram.com'],
      resolved: false
    },
    {
      id: 'nf_3',
      attemptedPath: '/collections/festive-anarkali-edit',
      subtitle: 'An old link on our own site',
      hitsCount: 9,
      visits: 9,
      lastHitDate: '12 Oct 2026',
      lastDate: '12 Oct 2026',
      cameFrom: 'Our own site',
      referrers: ['houseofkiara.com'],
      resolved: false
    },
    {
      id: 'nf_4',
      attemptedPath: '/rent/rimzim-dadu-silver-cord-saree',
      subtitle: 'A piece its owner took back',
      hitsCount: 6,
      visits: 6,
      lastHitDate: '11 Oct 2026',
      lastDate: '11 Oct 2026',
      cameFrom: 'WhatsApp',
      referrers: ['api.whatsapp.com'],
      resolved: false
    },
    {
      id: 'nf_5',
      attemptedPath: '/faq',
      subtitle: 'An old address for a page',
      hitsCount: 3,
      visits: 3,
      lastHitDate: '9 Oct 2026',
      lastDate: '9 Oct 2026',
      cameFrom: 'Google',
      referrers: ['google.com'],
      resolved: false
    }
  ],

  /* -------------------------------------------------------------
     Card 5: Names the built pages use for each page (Screen 17)
  ------------------------------------------------------------- */
  pageNameAliases: [
    { id: 'al_1', page: 'Help & FAQs', resolvedTitle: 'Help & FAQs', name: 'faqs', aliasName: 'faqs', alsoWrittenAs: 'faq', resolvedSlug: '/faqs' },
    { id: 'al_2', page: 'About HOK', resolvedTitle: 'About HOK', name: 'about', aliasName: 'about', alsoWrittenAs: 'about-us', resolvedSlug: '/about' },
    { id: 'al_3', page: 'List Your Piece', resolvedTitle: 'List Your Piece', name: 'list-your-piece', aliasName: 'list-your-piece', alsoWrittenAs: 'sell', resolvedSlug: '/list-your-piece' },
    { id: 'al_4', page: 'Terms & Conditions', resolvedTitle: 'Terms & Conditions', name: 'terms', aliasName: 'terms', alsoWrittenAs: 'lister-terms', resolvedSlug: '/terms' },
    { id: 'al_5', page: 'Privacy Policy', resolvedTitle: 'Privacy Policy', name: 'privacy', aliasName: 'privacy', alsoWrittenAs: 'privacy-policy', resolvedSlug: '/privacy' },
    { id: 'al_6', page: 'Cookie Policy', resolvedTitle: 'Cookie Policy', name: 'cookies', aliasName: 'cookies', alsoWrittenAs: 'cookie-policy', resolvedSlug: '/cookies' },
    { id: 'al_7', page: 'Refund & Cancellation Policy', resolvedTitle: 'Refund & Cancellation Policy', name: 'refunds', aliasName: 'refunds', alsoWrittenAs: 'refund-policy', resolvedSlug: '/refunds' },
    { id: 'al_8', page: 'Pricing & Fees', resolvedTitle: 'Pricing & Fees', name: 'pricing', aliasName: 'pricing', alsoWrittenAs: 'pricing-fees', resolvedSlug: '/pricing' }
  ],

  externalLinks: [],
  internalCrossLinks: [],

  summary: {
    thingsToFixCount: 10,
    linksNowhereCount: 5,
    notBuiltPagesCount: 6,
    notFoundUnresolvedCount: 5,
    oldAddressesCount: 11,
    externalBrokenCount: 0,
    internalBrokenCount: 0
  }
};
