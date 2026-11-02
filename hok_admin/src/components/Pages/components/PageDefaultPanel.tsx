/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageDefaultPanel (Spec §7.7, §8.4, §8.5, §8.6, Screens 20, 39, 42, 44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';

interface PageDefaultPanelProps {
  page: PageCardData;
  onOpenFigure?: (key: string) => void;
  onOpenChecks?: () => void;
  onOpenSettings?: () => void;
  onMarkReviewed?: () => void;
}

export const PageDefaultPanel: React.FC<PageDefaultPanelProps> = ({
  page,
  onOpenFigure,
  onOpenChecks,
  onOpenSettings,
  onMarkReviewed
}) => {
  const isFaq = page.slug === '/faqs' || page.slug === 'faqs';
  const isContact = page.slug === '/contact' || page.slug === 'contact';
  const isAbout = page.slug === '/about' || page.slug === 'about';
  const isHowItWorks = page.slug === '/how-it-works' || page.slug === 'how-it-works';
  const isListYourPiece = page.slug === '/list-your-piece' || page.slug === 'list-your-piece';
  const isTerms = page.slug === '/terms' || page.slug === 'terms';
  const isPrivacy = page.slug === '/privacy' || page.slug === 'privacy';
  const isCookies = page.slug === '/cookies' || page.slug === 'cookies';
  const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';
  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';
  const isCare = page.slug === '/care-policy' || page.slug === 'care-policy' || page.slug === 'care-damage' || page.slug === '/care-damage';
  const isShipping = page.slug === '/shipping-policy' || page.slug === 'shipping-policy' || page.slug === 'shipping-delivery' || page.slug === '/shipping-delivery';
  const isPricing = page.slug === '/pricing' || page.slug === 'pricing' || page.slug === '/pricing-fees' || page.slug === 'pricing-fees';
  const isSeller = page.slug === '/seller-guidelines' || page.slug === 'seller-guidelines';
  const is404 = page.slug === '/404' || page.slug === '404';
  const isSearch = page.slug === '/search' || page.slug === 'search';
  const isMaintenance = page.slug === '/maintenance' || page.slug === 'maintenance';

  const faqChecks = [
    { id: 'c1', type: 'high', title: 'Prints a retired figure: Extended rental window', location: 'Answers · How long can I keep a rental?' },
    { id: 'c2', type: 'high', title: 'Prints a retired figure: Return pickup within', location: 'Answers · How do I return my rental?' },
    { id: 'c3', type: 'high', title: 'Prints a retired figure: Deposit arranged within', location: 'Answers · When and how do I pay the deposit?' },
    { id: 'c4', type: 'medium', title: 'Says "above" the free delivery amount', location: 'Answers · What is included in the rental price?' },
    { id: 'c5', type: 'medium', title: 'A word the site never uses: insured, insurance', location: 'Answers · Is the piece insured while I have it?' }
  ];

  const contactChecks = [
    { id: 'cc1', type: 'medium', title: 'Prints a figure waiting for a decision: Phone number', location: 'Ways to reach us · Call' },
    { id: 'cc2', type: 'medium', title: 'Prints a figure waiting for a decision: Where visits happen', location: 'Visit us' }
  ];

  const aboutChecks = [
    { id: 'ac1', type: 'low', title: 'A word the site never uses: a dash', location: 'Hero' },
    { id: 'ac2', type: 'low', title: 'A word the site never uses: a dash', location: 'The Name' },
    { id: 'ac3', type: 'low', title: 'A word the site never uses: a dash', location: 'The Name' },
    { id: 'ac4', type: 'low', title: 'A word the site never uses: a dash', location: 'Manifesto' },
    { id: 'ac5', type: 'low', title: 'A word the site never uses: a dash', location: 'What We Believe' }
  ];

  const howItWorksChecks = [
    { id: 'hiw1', type: 'high', title: 'Prints a retired figure: Extended rental window', location: 'Shopping steps · Choose your dates' },
    { id: 'hiw2', type: 'medium', title: 'Says "above" the free delivery amount', location: 'Shopping steps · Browse & Discover' },
    { id: 'hiw3', type: 'medium', title: 'A word the site never uses: insured, insurance', location: 'Two ways to shop · Rent' },
    { id: 'hiw4', type: 'medium', title: 'Prints a figure waiting for a decision: Lister payout', location: 'List & Earn · Payouts' },
    { id: 'hiw5', type: 'low', title: 'A word the site never uses: a dash', location: 'Hero' },
    { id: 'hiw6', type: 'medium', title: 'A hand-written example to check', location: 'Good to Know · Deposit Policy' }
  ];

  const listYourPieceChecks = [
    { id: 'lyp1', type: 'high', title: 'Prints a figure marked never printed: Lister share', location: 'Hero' },
    { id: 'lyp2', type: 'high', title: 'Prints a figure marked never printed: Lister share', location: 'Three Promises' },
    { id: 'lyp3', type: 'high', title: 'Prints a figure marked never printed: Lister share', location: 'Three Promises' },
    { id: 'lyp4', type: 'high', title: 'Prints a figure marked never printed: Lister share', location: 'Earnings preview' },
    { id: 'lyp5', type: 'high', title: 'Prints a figure marked never printed: Lister share', location: 'Earnings preview' }
  ];

  const termsChecks = [
    { id: 'tc1', type: 'high', title: 'Prints a retired figure: CIN', location: 'Clauses · Who we are' },
    { id: 'tc2', type: 'high', title: 'Prints a retired figure: Extended rental window', location: 'Clauses · Your Rental Period' },
    { id: 'tc3', type: 'high', title: 'Prints a retired figure: Deposit arranged within', location: 'Clauses · Your security deposit' },
    { id: 'tc4', type: 'medium', title: 'Prints a figure waiting for a decision: GSTIN', location: 'Clauses · Who we are' },
    { id: 'tc5', type: 'medium', title: 'A word the site never uses: insured, insurance', location: 'Clauses · Delivery, ownership and responsibility' }
  ];

  const privacyChecks = [
    { id: 'pc1', type: 'medium', title: 'Its words are not loaded into Pages yet', location: 'The policy' }
  ];

  const cookieChecks = [
    { id: 'ck1', type: 'medium', title: 'Its words are not loaded into Pages yet', location: 'The policy' }
  ];

  const refundChecks = [
    { id: 'rc1', type: 'high', title: 'Prints a retired figure: Extended rental window', location: 'Answers · Can I switch to a shorter rental window for a lower price?' },
    { id: 'rc2', type: 'high', title: 'Prints a retired figure: Deposit arranged within', location: 'Answers · When and how do I pay the deposit?' },
    { id: 'rc3', type: 'medium', title: 'A word the site never uses: insured, insurance', location: 'Answers · The courier lost my parcel' },
    { id: 'rc4', type: 'medium', title: 'Prints a figure waiting for a decision: Decision on a claim within', location: 'Answers · How quickly will you reply to my claim?' },
    { id: 'rc5', type: 'medium', title: 'A hand-written example to check', location: 'Answers · How are the 7 days counted?' }
  ];

  const defaultChecks = [
    { id: 'c1', type: 'high', title: 'Prints a retired figure: Extended rental window', location: 'Answers · Can I switch to a shorter rental window for a lower price?' },
    { id: 'c2', type: 'high', title: 'Prints a retired figure: Deposit arranged within', location: 'Answers · When and how do I pay the deposit?' },
    { id: 'c3', type: 'medium', title: 'A word the site never uses: insured, insurance', location: 'Answers · The courier lost my parcel' },
    { id: 'c4', type: 'medium', title: 'Prints a figure waiting for a decision: Decision on a claim within', location: 'Answers · How quickly will you reply to my claim?' },
    { id: 'c5', type: 'medium', title: 'A hand-written example to check', location: 'Answers · How are the 7 days counted?' }
  ];

  const depositChecks: any[] = [];
  const careChecks: any[] = [];
  const shippingChecks: any[] = [];
  const notFoundChecks: any[] = [];
  const searchChecks: any[] = [];
  const maintenanceChecks = [
    {
      id: 'maint_chk_year',
      type: 'medium',
      title: 'A year typed by hand in a copyright line',
      location: 'Words · Footnote'
    }
  ];
  const pricingChecks = [
    {
      id: 'chk_pricing_designer',
      type: 'high',
      title: 'Links to a page that is not built: Designer Partners',
      location: 'Answers · I am a designer or a boutique'
    }
  ];

  const sellerChecks = [
    {
      id: 'chk_seller_designer_partners',
      type: 'high',
      title: 'Links to a page that is not built: Designer Partners',
      location: 'Chapters · Who can list a piece with House of Kaira?'
    }
  ];

  const checks = isMaintenance ? maintenanceChecks : isSearch ? searchChecks : is404 ? notFoundChecks : isSeller ? sellerChecks : isPricing ? pricingChecks : isShipping ? shippingChecks : isCare ? careChecks : isDeposit ? depositChecks : isFaq ? faqChecks : isContact ? contactChecks : isAbout ? aboutChecks : isHowItWorks ? howItWorksChecks : isListYourPiece ? listYourPieceChecks : isTerms ? termsChecks : isPrivacy ? privacyChecks : isCookies ? cookieChecks : isRefunds ? refundChecks : defaultChecks;

  const faqFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours', count: '5×' },
    { key: 'rental_arrival', label: 'A rental arrives', value: '1 day', count: '4×' },
    { key: 'whatsapp_number', label: 'WhatsApp number', value: '+91 93401 39300', count: '2×' }
  ];

  const contactFigures = [
    { key: 'support_days', label: 'Days we answer', value: 'Seven days a week', count: '3×' },
    { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '3×' },
    { key: 'email_sla', label: 'Email reply within', value: '24 hours', count: '3×' },
    { key: 'support_whatsapp', label: 'WhatsApp number', value: '+91 93401 39300', count: '2×' },
    { key: 'support_email', label: 'Support email', value: 'hello@houseofkaira.com', count: '2×' },
    { key: 'issue_window', label: 'Tell us about a problem within', value: '24 hours', count: '1×' }
  ];

  const aboutFigures = [
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' }
  ];

  const howItWorksFigures = [
    { key: 'free_delivery_min', label: 'Free delivery threshold', value: '₹2,500', count: '1×' },
    { key: 'standard_rental_window', label: 'Standard rental window', value: '4 days', count: '2×' },
    { key: 'lister_payout_days', label: 'Lister payout turnaround', value: 'T+3 days', count: '2×' },
    { key: 'deposit_share', label: 'Security deposit', value: 'Zero', count: '1×' },
    { key: 'dispatch_window', label: 'Dispatch turnaround', value: '24 hours', count: '1×' },
    { key: 'lister_share', label: 'Lister commission share', value: '75%', count: '1×' },
    { key: 'support_whatsapp', label: 'WhatsApp concierge', value: '+91 93401 39300', count: '1×' },
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' }
  ];

  const listYourPieceFigures = [
    { key: 'lister_share', label: 'Lister share', value: 'Agreed piece by piece', count: '5×', tag: 'Never printed' },
    { key: 'payout_cycle', label: 'Lister payout within', value: '3 working days', count: '4×' },
    { key: 'support_whatsapp', label: 'WhatsApp number', value: '+91 93401 39300', count: '1×' },
    { key: 'support_sla', label: 'WhatsApp reply within', value: '2 hours', count: '1×' },
    { key: 'pickup_cities', label: 'Cities we collect from', value: '10', count: '1×' },
    { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1×' },
    { key: 'sep', label: 'Title separator', value: '·', count: '1×' }
  ];

  const termsFigures = [
    { key: 'support_email', label: 'Support email', value: 'hello@houseofkaira.com', count: '4×' },
    { key: 'issue_window', label: 'Tell us about a problem within', value: '24 hours', count: '3×' },
    { key: 'proprietor_name', label: 'Legal owner (proprietor)', value: 'Ekta Agrawal', count: '3×' },
    { key: 'support_whatsapp', label: 'WhatsApp number', value: '+91 93401 39300', count: '2×' },
    { key: 'window_standard', label: 'Standard rental window', value: '4 days', count: '2×' },
    { key: 'window_extended', label: 'Extended rental window', value: '7 days', count: '1×' },
    { key: 'payout_cycle', label: 'Lister payout within', value: '3 working days', count: '2×' },
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' }
  ];

  const privacyFigures = [
    { key: 'sep', label: 'Title separator', value: '·', count: '1×' },
    { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1×' }
  ];

  const cookieFigures = [
    { key: 'sep', label: 'Title separator', value: '·', count: '1×' },
    { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1×' }
  ];

  const refundFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours', count: '22×' },
    { key: 'full_refund_window', label: 'Full refund, rentals cancelled more than', value: '7 days', count: '6×' },
    { key: 'customer_refund_sla', label: 'Refunds reach the customer within', value: '7 to 14 days', count: '5×' },
    { key: 'deposit_return_sla', label: 'Deposit returned within', value: '3 to 5 business days', count: '4×' },
    { key: 'rental_arrival', label: 'A rental arrives', value: '1 day', count: '3×' },
    { key: 'inspection_sla', label: 'Returned piece inspected within', value: '24 hours', count: '2×' }
  ];

  const defaultFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours', count: '4×' },
    { key: 'full_refund_window', label: 'Full refund window, cancellations', value: '7 days', count: '3×' },
    { key: 'late_cancel_share', label: 'Refund inside that window, before dispatch', value: '70%', count: '2×' },
    { key: 'deposit_receipt_confirm', label: 'Deposit receipt confirmed within', value: '2 hours', count: '1×' }
  ];

  const depositFigures = [
    { key: 'deposit_refund_window', label: 'Deposit returned within', value: '3 to 5 business days', count: '14×' },
    { key: 'gst_rate', label: 'GST on a rental', value: '18%', count: '4×' },
    { key: 'inspect_within', label: 'Returned piece inspected within', value: '24 hours', count: '4×' },
    { key: 'deposit_due_before', label: 'Deposit due', value: '10 days', count: '4×' },
    { key: 'deposit_receipt_within', label: 'Deposit receipt confirmed within', value: '48 hours', count: '3×' },
    { key: 'deduction_reply_within', label: 'Time to reply to a deduction', value: '2 business days', count: '3×' }
  ];

  const careFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours', count: '8×' },
    { key: 'deduction_reply_within', label: 'Time to reply to a deduction', value: '2 business days', count: '3×' },
    { key: 'deduction_notice_within', label: 'Deduction explained within', value: '2 business days', count: '3×' },
    { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '2×' },
    { key: 'rental_arrival', label: 'A rental arrives', value: '1 day', count: '1×' },
    { key: 'inspect_within', label: 'Returned piece inspected within', value: '24 hours', count: '1×' }
  ];

  const shippingFigures = [
    { key: 'problem_window', label: 'Tell us about a problem within', value: '24 hours', count: '5×' },
    { key: 'free_delivery_min', label: 'Free delivery from', value: '₹5,000', count: '5×' },
    { key: 'rental_window_days', label: 'Standard rental window', value: '3 days', count: '4×' },
    { key: 'standard_delivery', label: 'Standard delivery time', value: '3 to 5 business days', count: '3×' },
    { key: 'express_delivery', label: 'Express delivery time', value: '1 to 2 business days', count: '3×' },
    { key: 'intl_delivery', label: 'International delivery time', value: '10 business days', count: '3×' }
  ];

  const pricingFigures = [
    { key: 'standard_rental_window', label: 'Standard rental window', value: '3 days', count: '6×' },
    { key: 'gst_rental', label: 'GST on a rental', value: '18%', count: '6×' },
    { key: 'free_delivery_min', label: 'Free delivery from', value: '₹5,000', count: '5×' },
    { key: 'gst_preloved', label: 'GST on a preloved piece', value: '5%', count: '4×' },
    { key: 'lister_payout_days', label: 'Lister payout within', value: '3 working days', count: '4×' },
    { key: 'deposit_refund_window', label: 'Deposit returned within', value: '3 to 5 business days', count: '3×' }
  ];

  const sellerFigures = [
    { key: 'free_return_after', label: 'Free return of a piece after', value: '90 days', count: '4×' },
    { key: 'payout_cycle', label: 'Lister payout within', value: '3 working days', count: '3×' },
    { key: 'submission_reply', label: 'Reply to a new listing within', value: '48 hours', count: '3×' },
    { key: 'support_whatsapp', label: 'WhatsApp number', value: '+91 93401 39300', count: '1×' },
    { key: 'issue_window', label: 'Tell us about a problem within', value: '24 hours', count: '1×' },
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' }
  ];

  const notFoundFigures = [
    { key: 'support_days', label: 'Days we answer', value: 'Seven days a week', count: '1×' },
    { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '1×' },
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' },
    { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1×' }
  ];

  const searchFigures = [
    { key: 'support_days', label: 'Days we answer', value: 'Seven days a week', count: '1×' },
    { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '1×' },
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' },
    { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1×' }
  ];

  const maintenanceFigures = [
    { key: 'support_days', label: 'Days we answer', value: 'Seven days a week', count: '1×' },
    { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '1×' },
    { key: 'title_separator', label: 'Title separator', value: '·', count: '1×' },
    { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1×' }
  ];

const figures = isMaintenance ? maintenanceFigures : isSearch ? searchFigures : is404 ? notFoundFigures : isSeller ? sellerFigures : isPricing ? pricingFigures : isShipping ? shippingFigures : isCare ? careFigures : isDeposit ? depositFigures : isFaq ? faqFigures : isContact ? contactFigures : isAbout ? aboutFigures : isHowItWorks ? howItWorksFigures : isListYourPiece ? listYourPieceFigures : isTerms ? termsFigures : isPrivacy ? privacyFigures : isCookies ? cookieFigures : isRefunds ? refundFigures : defaultFigures;

  return (
    <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-5 shadow-2xs space-y-5 text-xs">
      {/* 1. Page Header Metadata */}
      <div>
        <div className="text-[11.5px] text-[#73675a] capitalize">
          {page.group === 'system' ? 'System pages' : page.group.replace('-', ' ')}
        </div>
        <h2 className="font-serif text-[22px] font-normal text-[#1a1612] mt-0.5">
          {page.title}
        </h2>
        <p className="text-[12px] text-[#5c5248] mt-1.5 leading-relaxed">
          {page.summary}
        </p>
      </div>

      {/* 2. Key Metadata Grid */}
      <div className="border-t border-[#f0ebe3] pt-3.5 space-y-2 text-[12px]">
        <div className="flex justify-between">
          <span className="text-[#8a7f73]">Address</span>
          <span className="font-mono text-[#1a1612]">{page.slug}</span>
        </div>
        {!isContact && !isAbout && !isListYourPiece && !is404 && !isSearch && !isMaintenance && (
          <div className="flex justify-between">
            <span className="text-[#8a7f73]">Version</span>
            <span className="text-[#1a1612]">{isSeller ? 'Version 2' : isPricing ? 'Version 4' : isShipping ? 'Version 3' : isCare ? 'Version 3' : isDeposit ? 'Version 4' : isTerms ? 'Version 1.0' : (isPrivacy || isCookies) ? 'Version 3' : isRefunds ? 'Version 7' : (page.version || (isHowItWorks ? 'Version 4' : 'Version 6'))}</span>
          </div>
        )}
        {isTerms && (
          <div className="flex justify-between">
            <span className="text-[#8a7f73]">In force from</span>
            <span className="text-[#1a1612]">7 October 2026</span>
          </div>
        )}
        {isAbout || isListYourPiece ? (
          <div className="flex justify-between">
            <span className="text-[#8a7f73]">Last edited</span>
            <span className="text-[#1a1612]">{isListYourPiece ? '27 February 2026' : '4 March 2026'}</span>
          </div>
        ) : !isContact && !is404 && !isSearch && !isMaintenance && (
          <div className="flex justify-between">
            <span className="text-[#8a7f73]">Last reviewed</span>
            <span className="text-[#1a1612]">{isSeller ? '8 October 2026' : isPricing ? '11 October 2026' : isShipping ? '10 October 2026' : isCare ? '7 October 2026' : isDeposit ? '6 October 2026' : isTerms ? '26 September 2026' : isPrivacy ? '30 September 2026' : isCookies ? '1 September 2026' : isRefunds ? '23 September 2026' : (page.lastPublished || '17 September 2026')}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#8a7f73]">Built from</span>
          <span className="font-mono text-[11px] text-[#5c5248]">
            {isMaintenance ? 'hok_maintenance_page_v1' : isSearch ? 'hok_no_search_results_v1' : is404 ? 'hok_404_page_v1' : isSeller ? 'hok_seller_guidelines_v2' : isPricing ? 'hok_pricing_fees_v4' : isShipping ? 'hok_shipping_policy_v3' : isCare ? 'hok_care_policy_v3' : isDeposit ? 'hok_deposit_policy_v4' : isAbout ? 'hok_about_us' : isContact ? 'hok_contact_v5' : isHowItWorks ? 'hok_how_it_works_v4' : isListYourPiece ? 'hok_list_your_piece' : isTerms ? 'hok_terms_v4' : isPrivacy ? 'hok_privacy_v3' : isCookies ? 'hok_cookie_v3' : isRefunds ? 'hok_refund_cancellation_v7' : (page.builtFrom || 'hok_faq_v6')}
          </span>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={page.slug}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-1.5 px-3 bg-white border border-[#e6dccb] rounded-[4px] text-center text-xs text-[#1a1612] hover:bg-[#faf7f2] cursor-pointer transition-colors"
        >
          View on the site ↗
        </a>
        {!isAbout && !isListYourPiece && !isPrivacy && !isCookies && !is404 && !isSearch && !isMaintenance && (
          <button
            type="button"
            onClick={onMarkReviewed}
            className="flex-1 py-1.5 px-3 bg-white border border-[#e6dccb] rounded-[4px] text-xs text-[#1a1612] hover:bg-[#faf7f2] cursor-pointer transition-colors"
          >
            Mark as reviewed today
          </button>
        )}
      </div>

      {/* 4. Section: To look at (Spec §7.7, §8.6, Screen 44) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-[#1a1612]">
            To look at
          </h3>
          {onOpenChecks && checks.length > 0 && (
            <button
              type="button"
              onClick={onOpenChecks}
              className="text-[#8a6a36] hover:underline cursor-pointer"
            >
              All {isMaintenance ? 1 : isSeller ? 1 : isPricing ? 1 : isFaq ? 14 : isContact ? 2 : isAbout ? 9 : isHowItWorks ? 31 : isListYourPiece ? 30 : isTerms ? 9 : (page.checksCount || checks.length)}
            </button>
          )}
        </div>

        {checks.length === 0 ? (
          <p className="text-xs text-[#8a7f73]">
            Nothing to look at on this page.
          </p>
        ) : (
          <div className="space-y-2.5">
            {checks.map(check => (
            <div key={check.id} className="flex items-start gap-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                check.type === 'high' ? 'bg-[#b85c38]' : check.type === 'low' ? 'bg-[#8a7f73]' : 'bg-[#d19a3c]'
              }`} />
              <div className="min-w-0">
                <div className="font-medium text-[#1a1612] leading-tight text-xs">
                  {check.title}
                </div>
                <div className="text-[11px] text-[#8a7f73] mt-0.5 truncate">
                  {check.location}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* 5. Section: Figures on this page (Spec §7.7, §8.6, Screen 44) */}
      <div className="border-t border-[#f0ebe3] pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-[#1a1612]">
            Figures on this page
          </h3>
          <span className="text-[#8a7f73]">
            All {isMaintenance ? 4 : isSearch ? 4 : is404 ? 4 : isSeller ? 13 : isPricing ? 27 : isCare ? 13 : isDeposit ? 28 : isFaq ? 29 : isContact ? 19 : isAbout ? 1 : isHowItWorks ? 8 : isListYourPiece ? 7 : isTerms ? 48 : (page.figuresCount || 23)}
          </span>
        </div>

        <div className="space-y-1.5">
          {figures.map(fig => (
            <div
              key={fig.key}
              onClick={() => onOpenFigure && onOpenFigure(fig.key)}
              className="flex items-center justify-between gap-2 py-1 px-1.5 -mx-1.5 rounded hover:bg-[#faf7f2] cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex items-center gap-1.5">
                <span className="text-[#5c5248] truncate">{fig.label}</span>
                {(fig as any).tag && (
                  <span className="text-[9.5px] text-[#7352a8] bg-[#f5effc] border border-[#d8c2f2] px-1 py-0.2 rounded font-mono shrink-0">
                    {(fig as any).tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-serif text-[13px] text-[#1a1612]">{fig.value}</span>
                {fig.count && (
                  <span className="text-[10.5px] text-[#8a7f73] font-mono">{fig.count}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageDefaultPanel;
