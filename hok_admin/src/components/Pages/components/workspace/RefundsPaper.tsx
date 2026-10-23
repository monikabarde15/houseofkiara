/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: RefundsPaper (Spec §8.12, Screens 20, 25, Pages 38–39)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  POLICY_TABS,
  POLICY_SECTIONS
} from '../../data/contentRegistries/refunds/refundPolicyRegistry.js';
import { Search, ChevronRight, MessageSquare, Mail, Phone, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface RefundsPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const RefundsPaper: React.FC<RefundsPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Two policies tab state (§8.12 Part 02)
  const [activeSide, setActiveSide] = useState<'rental' | 'preloved'>('rental');
  const [openSectionId, setOpenSectionId] = useState<string | null>('cancel');

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'refunds',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  // Popular questions picks
  const popularQuestions = [
    { id: '1', q: 'Can I cancel my rental booking for free?' },
    { id: '2', q: 'What happens if my dates change?' },
    { id: '3', q: 'When is my security deposit refunded?' },
    { id: '4', q: 'Can preloved purchases be returned?' }
  ];

  // The policy in brief summary rows (§8.12 Part 04)
  const rentalBriefRows = [
    { text: 'Cancellations 14+ days before dispatch', tag: 'Full refund', tone: 'good' },
    { text: 'Cancellations 7 to 13 days before dispatch', tag: '50% refund or store credit', tone: 'worth' },
    { text: 'Cancellations within 48 hours of booking', tag: 'Complimentary grace period', tone: 'good' },
    { text: 'Swapping a piece before dispatch', tag: 'Free of charge', tone: 'good' },
    { text: 'Cancellations once dispatched', tag: 'No refund possible', tone: 'not_possible' },
    { text: 'Security deposit release', tag: '24 hours post-QC', tone: 'good' }
  ];

  const prelovedBriefRows = [
    { text: 'Condition does not match description', tag: 'Full refund guaranteed', tone: 'good' },
    { text: 'Item reported within 24 hours of delivery', tag: 'Return accepted', tone: 'good' },
    { text: 'Change of mind after dispatch', tag: 'Final sale, no return', tone: 'not_possible' },
    { text: 'Authenticity challenge verification', tag: '100% refund guarantee', tone: 'good' },
    { text: 'Refund processing timeframe', tag: '5 to 7 business days', tone: 'worth' }
  ];

  const currentBriefRows = activeSide === 'rental' ? rentalBriefRows : prelovedBriefRows;
  const currentSections = POLICY_SECTIONS[activeSide] || [];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_refund_cancellation_v7
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 23 figures · 5 items to look at</span>
          </div>
        </div>
      </header>

      {/* ==================== 01 HERO ==================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>01 Hero</span>
          <span className="text-[#6e6358]">Heading with gold italic & search</span>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#6e6358]">
            Customer Safeguards
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            Refund &amp; <span className="italic text-[#8a6a36] font-normal">Cancellation Policy</span>
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            Clear, transparent protection for every booking and purchase. We explain exactly what happens when plans shift.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl pt-1">
            <div className="w-full px-4 py-3 rounded-[3px] border border-[#d9ccb6] bg-[#fffefb] text-xs text-[#6e6358] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8a6a36]" />
                <span className="text-[#8c827a]">Search refund terms, cancellation windows and deposit timelines...</span>
              </div>
            </div>
          </div>

          {/* Popular Questions */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono uppercase text-[#6e6358]">Popular:</span>
            {popularQuestions.map(pq => (
              <span
                key={pq.id}
                className="px-2.5 py-1 rounded-[3px] bg-[#efe7db] text-[#1a1612] text-xs cursor-pointer hover:bg-[#e4dacb] transition-colors"
              >
                {pq.q}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 02 TWO POLICIES (TABS) ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 Two policies</span>
          <span className="text-[#6e6358]">Rental and preloved sides</span>
        </div>

        <div className="inline-flex rounded-[3px] p-0.5 bg-[#efe7db] border border-[#d9ccb6] text-xs">
          <button
            type="button"
            onClick={() => setActiveSide('rental')}
            className={`px-4 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeSide === 'rental'
                ? 'bg-[#fffefb] text-[#1a1612] font-semibold shadow-xs'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            <span>Rental policy</span>
            <span className="font-mono text-[10px] bg-[#efe7da] px-1.5 py-0.2 rounded-[2px] text-[#8a6a36]">
              68 answers
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSide('preloved')}
            className={`px-4 py-1.5 rounded-[2px] font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeSide === 'preloved'
                ? 'bg-[#fffefb] text-[#1a1612] font-semibold shadow-xs'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            <span>Preloved policy</span>
            <span className="font-mono text-[10px] bg-[#efe7da] px-1.5 py-0.2 rounded-[2px] text-[#8a6a36]">
              35 answers
            </span>
          </button>
        </div>
      </section>

      {/* ==================== 03 OPENING ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Opening</span>
          <span className="text-[#6e6358]">{activeSide === 'rental' ? 'Rental side' : 'Preloved side'}</span>
        </div>

        <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] text-sm text-[#2c241c] leading-relaxed">
          {activeSide === 'rental' ? (
            <p>
              When you rent a piece with House of Kiara, your reservation is protected against unexpected schedule shifts. Standard cancellations enjoy a complimentary grace window of{' '}
              <FigureToken figure={getFig('cancel_free_window_hours')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'cancel_free_window_hours'} />.
            </p>
          ) : (
            <p>
              Preloved garments are archival pieces curated for permanent ownership. Because every item is unique, preloved sales are final once dispatched, except in cases where a piece fails authentication or significantly deviates from its catalog condition report.
            </p>
          )}
        </div>
      </section>

      {/* ==================== 04 THE POLICY IN BRIEF ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 The policy in brief</span>
          <span className="text-[#6e6358]">Summary rows with tags &amp; tones</span>
        </div>

        <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
          {currentBriefRows.map((row, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-[#fffefb] hover:bg-[#fbf8f2] transition-colors">
              <span className="text-[#1a1612] font-medium">{row.text}</span>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-[2px] shrink-0 ${
                  row.tone === 'good'
                    ? 'bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30'
                    : row.tone === 'worth'
                    ? 'bg-[#8a6a36]/10 text-[#8a6a36] border border-[#8a6a36]/30'
                    : 'bg-[#a4512f]/10 text-[#a4512f] border border-[#a4512f]/30'
                }`}
              >
                {row.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 05 SECTIONS & ANSWERS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Sections &amp; Answers</span>
          <span className="text-[#6e6358]">{currentSections.length} numbered sections</span>
        </div>

        <div className="space-y-3">
          {currentSections.map((sec: any) => {
            const isOpen = openSectionId === sec.id;
            return (
              <div key={sec.id} className="border border-[#e6dccb] rounded-[4px] bg-[#fffefb] overflow-hidden">
                <div
                  onClick={() => setOpenSectionId(isOpen ? null : sec.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#fcfaf7] transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase text-[#8a6a36] block">
                      {sec.barLabel}
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#1a1612]">
                      {sec.title.replace(/\*/g, '')}
                    </h3>
                    <p className="text-xs text-[#5c5248]">
                      {sec.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#6e6358] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>

                {isOpen && (
                  <div className="p-4 bg-[#fcfaf7] border-t border-[#efe7da] space-y-2 text-xs text-[#5c5248] leading-relaxed animate-in fade-in">
                    <p>
                      Cancellations must be requested via My Account or by messaging our concierge. If cancelled prior to dispatch, refunds are returned to your <FigureToken figure={getFig('refund_mode_original_source')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'refund_mode_original_source'} /> within <FigureToken figure={getFig('refund_processing_business_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'refund_processing_business_days'} />.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== 07 RELATED POLICIES ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Related policies</span>
          <span className="text-[#6e6358]">5 policy links</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a6a36]">
          <span className="hover:underline cursor-pointer">Terms & Conditions</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Deposit Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Care, Cleaning & Damage Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Shipping & Delivery Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Seller Guidelines</span>
        </div>
        <div className="pt-1 text-[11px] text-[#6e6358]">
          Last reviewed {page.lastPublished}. Version stamped v7.
        </div>
      </section>

      {/* ==================== 08 CAN’T FIND IT ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>08 Can’t find it</span>
          <span className="text-[#6e6358]">Closing band</span>
        </div>

        <div className="p-8 rounded-[4px] bg-[#1a1612] text-white space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#c9a96e]">
            Need help with a cancellation?
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Speak directly with our concierge team in Indore
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-xl leading-relaxed">
            If an emergency or unexpected date change has arisen, tell us right away. We are always ready to explore date swaps or credit options.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message us on WhatsApp</span>
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Email support</span>
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default RefundsPaper;