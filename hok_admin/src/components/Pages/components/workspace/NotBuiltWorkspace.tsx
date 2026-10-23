/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: NotBuiltWorkspace (Spec §7.12 & §8.3, Screen 59)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../../types';
import { AlertCircle, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NotBuiltWorkspaceProps {
  page: PageCardData;
  onCreateDraft?: (slug: string, initialTitle: string, initialSummary: string) => void;
  onUnlinkNavigation?: (slug: string) => void;
  builtPages?: { slug: string; title: string }[];
}

interface InboundLinkItem {
  anchorText: string;
  location: string;
  source: string;
}

export const NotBuiltWorkspace: React.FC<NotBuiltWorkspaceProps> = ({
  page,
  onCreateDraft,
  onUnlinkNavigation,
  builtPages = [
    { slug: '/terms', title: 'Terms & Conditions' },
    { slug: '/faqs', title: 'Help & FAQs' },
    { slug: '/contact', title: 'Contact Us' },
    { slug: '/about', title: 'About HOK' },
    { slug: '/how-it-works', title: 'How It Works' },
    { slug: '/list-your-piece', title: 'List Your Piece' },
    { slug: '/refunds', title: 'Refund & Cancellation Policy' },
    { slug: '/deposit', title: 'Deposit Policy' },
    { slug: '/care-policy', title: 'Care, Cleaning & Damage Policy' },
    { slug: '/shipping-policy', title: 'Shipping & Delivery Policy' },
    { slug: '/pricing-fees', title: 'Pricing & Fees' },
    { slug: '/seller-guidelines', title: 'Seller Guidelines' }
  ]
}) => {
  // Decision states: 'undecided' | 'build_small' | 'point_existing' | 'hide_link'
  const [decision, setDecision] = useState<'undecided' | 'build_small' | 'point_existing' | 'hide_link'>('undecided');
  const [targetSlug, setTargetSlug] = useState<string>('/contact');
  const [whyExplanation, setWhyExplanation] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  // Inbound links mapped per unbuilt page
  const getInboundLinks = (): InboundLinkItem[] => {
    switch (page.slug) {
      case '/careers':
        return [
          { anchorText: 'Careers', location: 'Footer › About Us', source: 'Site Settings › Navigation' }
        ];
      case '/designer-partners':
        return [
          { anchorText: 'Designer Partners', location: 'Header › Navigation', source: 'Site Settings › Navigation' },
          { anchorText: 'Our Atelier Partners', location: 'Footer › Discover', source: 'Site Settings › Navigation' }
        ];
      case '/sustainability':
        return [
          { anchorText: 'Sustainability', location: 'Footer › House', source: 'Site Settings › Navigation' }
        ];
      case '/size-guide':
        return [
          { anchorText: 'Size Guide', location: 'Header › Concierge', source: 'Site Settings › Navigation' },
          { anchorText: 'Measurements', location: 'Product Detail Modal', source: 'Storefront Template' }
        ];
      case '/press':
        return [
          { anchorText: 'Press & Editorial', location: 'Footer › House', source: 'Site Settings › Navigation' }
        ];
      case '/journal':
        return [
          { anchorText: 'Journal & Stories', location: 'Header › Editorial', source: 'Site Settings › Navigation' }
        ];
      default:
        return [
          { anchorText: page.title, location: 'Footer › General Links', source: 'Site Settings › Navigation' }
        ];
    }
  };

  // Planned parts outline per unbuilt page
  const getPartsOutline = () => {
    switch (page.slug) {
      case '/careers':
        return [
          '01 Hero: The philosophy of House of Kiara and career opportunities',
          '02 Open roles: Styling concierge, logistics specialist, curation associate',
          '03 Culture & atelier: Working in luxury Indian circular fashion',
          '04 How to apply: Portfolio and resume submission channel'
        ];
      case '/designer-partners':
        return [
          '01 Hero: Partnering with premier Indian couture ateliers',
          '02 Provenance & authenticity: Direct brand partnerships and consignment guarantee',
          '03 Benefits for designers: Revenue expansion, preservation, brand presentation',
          '04 Contact atelier desk: Partnership inquiry form and onboarding guide'
        ];
      case '/sustainability':
        return [
          '01 Hero: Extending the life cycle of luxury garments across generations',
          '02 Zero single-use plastics: Garment packaging and recycled materials',
          '03 Eco-certified cleaning: Biodegradable wet cleaning and energy reduction',
          '04 Impact metrics: Water saved, emissions avoided, pieces circulated'
        ];
      case '/size-guide':
        return [
          '01 Hero: Finding your bespoke fit across luxury Indian designers',
          '02 Measurement chart: Bust, waist, hip, blouse length, lehenga flare',
          '03 Alteration guidelines: Non-invasive temporary stitch options',
          '04 Virtual stylist consultation: Book a complimentary measurement call'
        ];
      default:
        return [
          '01 Hero: Opening introduction and purpose',
          '02 Core overview: Key details and guidance for visitors',
          '03 Supporting resources: Related documents and contact concierge'
        ];
    }
  };

  const inboundLinks = getInboundLinks();
  const partsOutline = getPartsOutline();

  const handleSaveDecision = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    if (decision === 'build_small') {
      onCreateDraft?.(page.slug, page.title, `Scaffolding for ${page.title}`);
    } else if (decision === 'hide_link') {
      onUnlinkNavigation?.(page.slug);
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* 1. Item to Look At Warning Banner (Spec §8.3 & Screen 59) */}
      <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#a4512f]/40 shadow-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#a4512f] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#a4512f]">
              Linked from the site, with nothing behind it
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#a4512f]/10 text-[#a4512f]">
              High importance
            </span>
          </div>
          <p className="text-[#5c5248] leading-relaxed">
            Nothing is built at <code className="font-mono text-[#a4512f] bg-[#f7f2ea] px-1 py-0.5 rounded-[2px]">{page.slug}</code>. {inboundLinks.length === 1 ? 'One link' : `${inboundLinks.length} links`} on the site {inboundLinks.length === 1 ? 'points' : 'point'} here, so a visitor who follows it meets a page that is not there.
          </p>
        </div>
      </div>

      {/* 2. Main Desk Form: What happens to this address (Spec §7.12 & Screen 59) */}
      <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-12 space-y-8">
        {/* Form Title */}
        <div className="border-b border-[#e6dccb] pb-6 space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e6358]">
            Not built
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1612]">
            What happens to this address
          </h1>
          <p className="text-xs text-[#5c5248] leading-relaxed">
            <span className="font-mono text-[#1a1612]">{page.slug}</span> leads nowhere yet. Decide what the links that point here should do. Until the page is written, this is the plan for it.
          </p>
        </div>

        {/* Links that point here (Spec §8.3) */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
            Links that point here
          </h2>
          <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
            {inboundLinks.map((lnk, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-[#fffefb] hover:bg-[#fbf8f2] transition-colors">
                <div className="space-y-0.5">
                  <div className="font-medium text-[#1a1612]">{lnk.anchorText}</div>
                  <div className="text-[11px] text-[#6e6358]">
                    {lnk.location} · <span className="font-mono text-[#8a6a36]">{lnk.source}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs rounded-[3px] border border-[#d9ccb6] hover:bg-[#efe7db] text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors"
                  title="Open where this link is set"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3 text-[#6e6358]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* The Decision (Spec §8.3) */}
        <div className="space-y-4 pt-4 border-t border-[#efe7da]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
            The decision
          </h2>

          {/* Decision Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#1a1612] font-medium block">
              What happens to this address
            </label>
            <select
              value={decision}
              onChange={e => setDecision(e.target.value as any)}
              className="w-full px-3 py-2 rounded-[4px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
            >
              <option value="undecided">Undecided</option>
              <option value="build_small">Build a small page</option>
              <option value="point_existing">Point the link at an existing page</option>
              <option value="hide_link">Hide the link until there is something</option>
            </select>
          </div>

          {/* Conditional field: Send it to (when pointing at existing page) */}
          {decision === 'point_existing' && (
            <div className="space-y-1.5 animate-in fade-in duration-150 pl-3 border-l-2 border-[#8a6a36]">
              <label className="text-xs text-[#1a1612] font-medium block">
                Send it to
              </label>
              <select
                value={targetSlug}
                onChange={e => setTargetSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-[4px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none"
              >
                {builtPages.map(bp => (
                  <option key={bp.slug} value={bp.slug}>
                    {bp.title} ({bp.slug})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#6e6358]">
                Links pointing to {page.slug} will redirect automatically with a clean 301 header until this page is built.
              </p>
            </div>
          )}

          {/* Why explanation textarea */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#1a1612] font-medium block">
              Why
            </label>
            <textarea
              rows={3}
              value={whyExplanation}
              onChange={e => setWhyExplanation(e.target.value)}
              placeholder="Record the reasoning for this routing decision so the atelier team understands why..."
              className="w-full px-3 py-2 rounded-[4px] bg-[#fffefb] border border-[#d9ccb6] focus:border-[#8a6a36] text-xs text-[#1a1612] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleSaveDecision}
              className="px-4 py-2 rounded-[4px] bg-[#8a6a36] hover:bg-[#70552b] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Decision recorded' : 'Save decision'}</span>
            </button>
            {isSaved && (
              <span className="text-xs text-[#6b7e5a] font-medium animate-in fade-in">
                Plan updated in site registry.
              </span>
            )}
          </div>
        </div>

        {/* What the page would say (Spec §8.3 & Screen 59) */}
        <div className="space-y-3 pt-6 border-t border-[#efe7da]">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6e6358] font-mono">
              What the page would say
            </h2>
            <span className="text-[11px] text-[#6e6358]">
              An outline of parts, until it is written
            </span>
          </div>

          <div className="bg-[#fcfaf7] border border-[#e6dccb] rounded-[4px] p-4 space-y-2 text-xs text-[#5c5248]">
            {partsOutline.map((partLine, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-mono text-[#8a6a36] text-[11px] shrink-0 mt-0.5">
                  §
                </span>
                <span>{partLine}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onCreateDraft?.(page.slug, page.title, `Initial draft for ${page.title}`)}
              className="text-xs font-semibold text-[#8a6a36] hover:text-[#1a1612] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Begin writing this page now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotBuiltWorkspace;