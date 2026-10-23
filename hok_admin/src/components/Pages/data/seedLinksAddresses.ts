/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Seed Data: Links & Addresses (Spec §6, Pages 15 & 16)
   Admin panel v217 · 20 October 2026
========================================================= */

import { LinksAndAddressesData } from '../types/links.types';

export const SEED_LINKS_ADDRESSES: LinksAndAddressesData = {
  /* -------------------------------------------------------------
     Card 1: Links in the header and footer (Spec §6)
  ------------------------------------------------------------- */
  headerFooterLinks: [
    {
      id: 'hf_1',
      location: 'Site Settings > Header menu',
      label: 'How It Works',
      address: '/how-it-works',
      targetType: 'page',
      targetSlug: '/how-it-works'
    },
    {
      id: 'hf_2',
      location: 'Site Settings > Header menu',
      label: 'List Your Piece',
      address: '/list-your-piece',
      targetType: 'page',
      targetSlug: '/list-your-piece'
    },
    {
      id: 'hf_3',
      location: 'Site Settings > Header menu',
      label: 'Saree Collection',
      address: '/catalog/sarees',
      targetType: 'catalogue'
    },
    {
      id: 'hf_4',
      location: 'Footer column 1 (About)',
      label: 'About House of Kiara',
      address: '/about',
      targetType: 'page',
      targetSlug: '/about'
    },
    {
      id: 'hf_5',
      location: 'Footer column 1 (About)',
      label: 'Sustainability',
      address: '/sustainability',
      targetType: 'nowhere', // Leads nowhere in terracotta
      targetSlug: '/sustainability'
    },
    {
      id: 'hf_6',
      location: 'Footer column 2 (Help)',
      label: 'Help & FAQs',
      address: '/faqs',
      targetType: 'page',
      targetSlug: '/faqs'
    },
    {
      id: 'hf_7',
      location: 'Footer column 2 (Help)',
      label: 'Shipping & Delivery',
      address: '/shipping-policy',
      targetType: 'page',
      targetSlug: '/shipping-policy'
    },
    {
      id: 'hf_8',
      location: 'Footer policy row',
      label: 'Terms & Conditions',
      address: '/terms',
      targetType: 'page',
      targetSlug: '/terms'
    },
    {
      id: 'hf_9',
      location: 'Footer policy row',
      label: 'Privacy Policy',
      address: '/privacy',
      targetType: 'page',
      targetSlug: '/privacy'
    },
    {
      id: 'hf_10',
      location: 'Footer column 3 (Community)',
      label: 'Careers',
      address: '/careers',
      targetType: 'nowhere', // Leads nowhere in terracotta
      targetSlug: '/careers'
    },
    {
      id: 'hf_11',
      location: 'Mobile bar',
      label: 'Help',
      address: '/faqs',
      targetType: 'page',
      targetSlug: '/faqs'
    }
  ],

  /* -------------------------------------------------------------
     Card 2: Pages linked but not built (Spec §6)
  ------------------------------------------------------------- */
  linkedNotBuilt: [
    {
      id: 'lnb_1',
      slug: '/designer-partners',
      title: 'Designer Partners',
      linksPointingAtIt: [
        { location: 'List Your Piece > Partner Enquiry button', label: 'Partner with us' },
        { location: 'Footer column 3 (Listers)', label: 'Designer partners' },
        { location: 'Seller Guidelines > Consignment chapter', label: 'Partner programme' }
      ]
    },
    {
      id: 'lnb_2',
      slug: '/size-guide',
      title: 'Size & Measurement Guide',
      linksPointingAtIt: [
        { location: 'Every Product Page > Sizing selector', label: 'Size guide' },
        { location: 'How It Works > Fit guarantee', label: 'Measurement chart' }
      ]
    },
    {
      id: 'lnb_3',
      slug: '/sustainability',
      title: 'Sustainability',
      linksPointingAtIt: [
        { location: 'Footer column 1 (About)', label: 'Sustainability' }
      ]
    },
    {
      id: 'lnb_4',
      slug: '/careers',
      title: 'Careers',
      linksPointingAtIt: [
        { location: 'Footer column 3 (Community)', label: 'Careers' }
      ]
    },
    {
      id: 'lnb_5',
      slug: '/press',
      title: 'Press',
      linksPointingAtIt: [
        { location: 'Footer column 1 (About)', label: 'Press & Media' }
      ]
    },
    {
      id: 'lnb_6',
      slug: '/blog',
      title: 'Blog',
      linksPointingAtIt: [
        { location: 'Footer column 4 (Editorial)', label: 'The Journal' }
      ]
    }
  ],

  /* -------------------------------------------------------------
     Card 3: Old addresses sent to a page (Spec §6)
  ------------------------------------------------------------- */
  oldAddresses: [
    {
      id: 'old_1',
      oldPath: '/cancellation-policy',
      targetSlug: '/refunds',
      targetPageTitle: 'Refund & Cancellation Policy',
      isEnabled: true
    },
    {
      id: 'old_2',
      oldPath: '/rental-terms',
      targetSlug: '/terms',
      targetPageTitle: 'Terms & Conditions',
      isEnabled: true
    },
    {
      id: 'old_3',
      oldPath: '/faq',
      targetSlug: '/faqs',
      targetPageTitle: 'Help & FAQs',
      isEnabled: true
    },
    {
      id: 'old_4',
      oldPath: '/contact-us',
      targetSlug: '/contact',
      targetPageTitle: 'Contact Us',
      isEnabled: true
    },
    {
      id: 'old_5',
      oldPath: '/care',
      targetSlug: '/care-policy',
      targetPageTitle: 'Care, Cleaning & Damage Policy',
      isEnabled: false
    }
  ],

  /* -------------------------------------------------------------
     Card 4: Addresses people tried that led nowhere (Spec §6)
  ------------------------------------------------------------- */
  notFound404Logs: [
    {
      id: 'nf_1',
      attemptedPath: '/anarkali-sets-couture',
      hitsCount: 148,
      lastHitDate: '20 Oct 2026, 08:14 IST',
      referrers: ['instagram.com/p/DB14829', 'google.com/search'],
      suggestedRedirect: '/terms',
      resolved: false
    },
    {
      id: 'nf_2',
      attemptedPath: '/returns-and-cancellation',
      hitsCount: 89,
      lastHitDate: '19 Oct 2026, 21:40 IST',
      referrers: ['google.com/search', 'direct'],
      suggestedRedirect: '/refunds',
      resolved: false
    },
    {
      id: 'nf_3',
      attemptedPath: '/tarun-tahiliani-lehenga-red',
      hitsCount: 42,
      lastHitDate: '19 Oct 2026, 16:02 IST',
      referrers: ['pinterest.com/pin/839129', 'direct'],
      resolved: false
    },
    {
      id: 'nf_4',
      attemptedPath: '/track-order',
      hitsCount: 31,
      lastHitDate: '18 Oct 2026, 12:15 IST',
      referrers: ['direct'],
      suggestedRedirect: '/shipping-policy',
      resolved: false
    }
  ],

  /* -------------------------------------------------------------
     Card 5: Names the built pages use for each page (Spec §6)
  ------------------------------------------------------------- */
  pageNameAliases: [
    { id: 'al_1', aliasName: 'hok_terms', resolvedSlug: '/terms', resolvedTitle: 'Terms & Conditions' },
    { id: 'al_2', aliasName: 'hok_faq', resolvedSlug: '/faqs', resolvedTitle: 'Help & FAQs' },
    { id: 'al_3', aliasName: 'hok_contact', resolvedSlug: '/contact', resolvedTitle: 'Contact Us' },
    { id: 'al_4', aliasName: 'hok_care', resolvedSlug: '/care-policy', resolvedTitle: 'Care, Cleaning & Damage Policy' },
    { id: 'al_5', aliasName: 'hok_refund', resolvedSlug: '/refunds', resolvedTitle: 'Refund & Cancellation Policy' },
    { id: 'al_6', aliasName: 'hok_shipping', resolvedSlug: '/shipping-policy', resolvedTitle: 'Shipping & Delivery Policy' },
    { id: 'al_7', aliasName: 'hok_deposit', resolvedSlug: '/deposit-policy', resolvedTitle: 'Deposit Policy' },
    { id: 'al_8', aliasName: 'hok_pricing', resolvedSlug: '/pricing', resolvedTitle: 'Pricing & Fees' }
  ],

  externalLinks: [
    {
      id: 'ext_bluedart',
      url: 'https://www.bluedart.com/tracking',
      domain: 'bluedart.com',
      statusCode: 200,
      statusText: 'OK',
      health: 'ok',
      usedOnPages: ['/shipping-policy', '/faqs'],
      lastChecked: '20 Oct 2026, 06:00 IST',
      responseTimeMs: 340
    },
    {
      id: 'ext_consumer_portal',
      url: 'https://consumerhelpline.gov.in/national-consumer-helpline',
      domain: 'consumerhelpline.gov.in',
      statusCode: 404,
      statusText: 'Not Found',
      health: 'broken',
      usedOnPages: ['/terms', '/refunds'],
      lastChecked: '20 Oct 2026, 06:00 IST',
      responseTimeMs: 510
    }
  ],

  internalCrossLinks: [],

  summary: {
    thingsToFixCount: 4, // 2 links nowhere + 2 broken 404s
    linksNowhereCount: 2,
    notBuiltPagesCount: 6,
    notFoundUnresolvedCount: 2,
    oldAddressesCount: 5,
    externalBrokenCount: 1,
    internalBrokenCount: 0
  }
};
