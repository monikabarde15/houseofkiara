/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ShippingPaper (Spec §8.15, Screen 54, Pages 43–44)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  SHIPPING_HERO,
  SHIPPING_POPULAR_QUESTIONS,
  SHIPPING_RENTAL_WINDOW_CARD,
  SHIPPING_DELIVERY_OPTIONS,
  SHIPPING_SECTIONS
} from '../../data/contentRegistries/shipping/shippingRegistry.js';
import { Search, ChevronRight, MessageSquare, Mail, Phone, ArrowRight, Truck, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface ShippingPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const ShippingPaper: React.FC<ShippingPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'shipping',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  const deliveryWays = [
    {
      name: 'Standard courier',
      where: 'Pan India (Metros and Tier 1 & 2 cities)',
      timeFigureKey: 'delivery_dispatch_standard_days',
      timeFallback: '2 to 3 business days',
      tag: 'Most popular',
      tone: 'good',
      line: 'Complimentary on orders above ₹10,000, tracked end to end with signature verification.'
    },
    {
      name: 'Express priority',
      where: 'Major metropolitan hubs',
      timeFigureKey: 'delivery_dispatch_express_days',
      timeFallback: 'Next business day',
      tag: 'Urgent bookings',
      tone: 'worth',
      line: 'Guaranteed dispatch via air express for last-minute celebratory bookings.'
    },
    {
      name: 'Indore atelier concierge',
      where: 'Within Indore city limits',
      timeFigureKey: 'delivery_dispatch_same_day_cutoff',
      timeFallback: 'Same day (Order by 2 PM)',
      tag: 'Hand-delivered',
      tone: 'good',
      line: 'Delivered in bespoke garment carriers directly by our studio concierge.'
    },
    {
      name: 'International shipping',
      where: 'Overseas destination weddings',
      timeFigureKey: 'shipping_international_days',
      timeFallback: '5 to 7 business days',
      tag: 'Preloved only',
      tone: 'worth',
      line: 'Preloved purchases ship internationally with export customs documentation.'
    }
  ];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_shipping_policy_v3
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 23 figures · 0 items to look at</span>
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
            {SHIPPING_HERO.eyebrow}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            {SHIPPING_HERO.titlePrefix}<span className="italic text-[#8a6a36] font-normal">{SHIPPING_HERO.italicWord}</span> Policy
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            {SHIPPING_HERO.subtitle}
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl pt-1">
            <div className="w-full px-4 py-3 rounded-[3px] border border-[#d9ccb6] bg-[#fffefb] text-xs text-[#6e6358] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8a6a36]" />
                <span className="text-[#8c827a]">Search delivery transit, courier tracking and return windows...</span>
              </div>
            </div>
          </div>

          {/* Popular Questions */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono uppercase text-[#6e6358]">Popular:</span>
            {SHIPPING_POPULAR_QUESTIONS.map(pq => (
              <span
                key={pq.id}
                className="px-2.5 py-1 rounded-[3px] bg-[#efe7db] text-[#1a1612] text-xs cursor-pointer hover:bg-[#e4dacb] transition-colors"
              >
                {pq.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 02 RENTAL WINDOW (Screen 54) ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 Rental window (Screen 54)</span>
          <span className="text-[#6e6358]">The three days of a rental</span>
        </div>

        <div className="p-6 md:p-8 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/40 space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#1a1612]">
              {SHIPPING_RENTAL_WINDOW_CARD.title}
            </h3>
            <p className="text-xs text-[#6e6358]">
              {SHIPPING_RENTAL_WINDOW_CARD.hint}
            </p>
          </div>

          {/* 3 Days Visual Grid (Screen 54) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SHIPPING_RENTAL_WINDOW_CARD.days.map((d, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-[4px] border space-y-2 ${
                  d.isCelebration
                    ? 'bg-[#1a1612] text-white border-[#1a1612] shadow-sm'
                    : 'bg-[#fffefb] border-[#e6dccb] text-[#1a1612]'
                }`}
              >
                <span className={`text-[10px] font-mono uppercase tracking-wider block ${d.isCelebration ? 'text-[#c9a96e]' : 'text-[#8a6a36]'}`}>
                  {d.label}
                </span>
                <h4 className="font-serif text-base font-bold">
                  {d.title}
                </h4>
                <p className={`text-[11px] leading-relaxed ${d.isCelebration ? 'text-[#d9ccb6]' : 'text-[#5c5248]'}`}>
                  {d.line}
                </p>
              </div>
            ))}
          </div>

          {/* Extra Days Card */}
          <div className="p-4 rounded-[3px] bg-[#fffefb] border border-[#e6dccb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase text-[#8a6a36] font-bold">
                {SHIPPING_RENTAL_WINDOW_CARD.extraDays.label}
              </span>
              <div className="font-semibold text-[#1a1612]">
                {SHIPPING_RENTAL_WINDOW_CARD.extraDays.title}
              </div>
              <p className="text-[#5c5248]">
                {SHIPPING_RENTAL_WINDOW_CARD.extraDays.line}
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#6e6358] shrink-0">
              {SHIPPING_RENTAL_WINDOW_CARD.bracketExtraLabel}
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 03 OPENING ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Opening</span>
          <span className="text-[#6e6358]">Opening paragraph</span>
        </div>

        <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] text-sm text-[#2c241c] leading-relaxed">
          <p>
            Delivery is scheduled to arrive at least one full day before your event, so you have ample time to try the piece on in good light. Prepaid courier return handoff is scheduled for the day following your celebration:{' '}
            <strong className="font-serif italic font-normal text-[#8a6a36]">our logistics team coordinates courier collection directly from your doorstep</strong>.
          </p>
        </div>
      </section>

      {/* ==================== 04 WAYS WE DELIVER ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 Ways we deliver</span>
          <span className="text-[#6e6358]">Four delivery methods with transit times</span>
        </div>

        <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
          {deliveryWays.map((way, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fffefb]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold text-[#1a1612]">{way.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                    way.tone === 'good' ? 'bg-[#6b7e5a]/10 text-[#6b7e5a]' : 'bg-[#8a6a36]/10 text-[#8a6a36]'
                  }`}>
                    {way.tag}
                  </span>
                </div>
                <div className="text-[11px] text-[#6e6358]">{way.where}</div>
                <p className="text-[11px] text-[#5c5248]">{way.line}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-[#8a6a36] block">
                  <FigureToken figure={getFig(way.timeFigureKey)} onClick={onSelectFigure} isSelected={selectedFigureKey === way.timeFigureKey} />
                </span>
                <span className="text-[10px] text-[#6e6358]">Transit window</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 05 SECTIONS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Sections</span>
          <span className="text-[#6e6358]">7 numbered sections</span>
        </div>

        <div className="space-y-3">
          {SHIPPING_SECTIONS.map((sec, idx) => (
            <div key={idx} className="border border-[#e6dccb] rounded-[4px] bg-[#fffefb] p-4 space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#8a6a36] block">
                Section 0{idx + 1}
              </span>
              <h4 className="font-serif text-base font-bold text-[#1a1612]">
                {sec.title}
              </h4>
              <p className="text-xs text-[#5c5248]">
                {sec.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 07 RELATED POLICIES ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Related policies</span>
          <span className="text-[#6e6358]">6 links</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a6a36]">
          <span className="hover:underline cursor-pointer">Terms & Conditions</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Refund & Cancellation Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Deposit Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Care, Cleaning & Damage Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Pricing & Fees</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Seller Guidelines</span>
        </div>
        <div className="pt-1 text-[11px] text-[#6e6358]">
          Last reviewed {page.lastPublished}. Version stamped v3.
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
            Delivery tracking inquiries
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Our logistics team in Indore is on call
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-xl leading-relaxed">
            Need to update your delivery address or check live courier dispatch coordinates? Reach out directly.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp logistics desk</span>
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Email delivery support</span>
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default ShippingPaper;