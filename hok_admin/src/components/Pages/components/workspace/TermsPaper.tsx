/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: TermsPaper (Spec §8.9, Screens 49–50, Pages 37–38)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  OPENING_PARAGRAPH,
  THE_ESSENTIALS,
  WHERE_TO_START_CARDS
} from '../../data/contentRegistries/terms/termsRegistry.js';
import { Search, ChevronRight, MessageSquare, Mail, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface TermsPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const TermsPaper: React.FC<TermsPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterPart, setActiveFilterPart] = useState<number | null>(null);

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'legal',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  // Popular clause picks (Part 01)
  const popularClauses = [
    { num: 12, title: 'How House of Kaira works' },
    { num: 13, title: 'Our authenticity promise' },
    { num: 20, title: 'Your security deposit' },
    { num: 26, title: 'Late returns' }
  ];

  // 12 Parts of the Terms
  const partsList = [
    { partNum: 1, title: 'Introduction & Core Principles', startClause: 1, endClause: 6 },
    { partNum: 2, title: 'User Verification & Accounts', startClause: 7, endClause: 11 },
    { partNum: 3, title: 'How House of Kaira Operates', startClause: 12, endClause: 17 },
    { partNum: 4, title: 'Renting a Piece', startClause: 18, endClause: 28 },
    { partNum: 5, title: 'Buying Preloved Occasionwear', startClause: 29, endClause: 33 },
    { partNum: 6, title: 'Listing Your Piece (Lister Terms)', startClause: 34, endClause: 42 },
    { partNum: 7, title: 'Cancellations & Platform Discretion', startClause: 43, endClause: 47 },
    { partNum: 8, title: 'Garment Care, Damage & Liability', startClause: 48, endClause: 51 },
    { partNum: 9, title: 'Logistics, Couriers & Delivery', startClause: 52, endClause: 54 },
    { partNum: 10, title: 'Taxes, Invoicing & GST', startClause: 55, endClause: 56 },
    { partNum: 11, title: 'Intellectual Property & Content', startClause: 57, endClause: 57 },
    { partNum: 12, title: 'Statutory Disclosures & Dispute Resolution', startClause: 58, endClause: 59 }
  ];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_terms_v4
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>12 parts · 59 clauses · 48 figures bound</span>
          </div>
        </div>
      </header>

      {/* ==================== 01 HERO ==================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>01 Hero</span>
          <span className="text-[#6e6358]">Heading with gold italic & popular clauses</span>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#6e6358]">
            Legal Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            Terms &amp; <span className="italic text-[#8a6a36] font-normal">Conditions</span>
          </h1>
          <p className="text-xs text-[#6e6358]">
            Version 1.0, published {page.lastPublished}. Synchronized with Platform &amp; Legal master registry.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl pt-1">
            <div className="w-full px-4 py-3 rounded-[3px] border border-[#d9ccb6] bg-[#fffefb] text-xs text-[#6e6358] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8a6a36]" />
                <input
                  type="text"
                  placeholder="Search 59 clauses by keyword, topic or clause number..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-[#1a1612] placeholder-[#8c827a] focus:outline-none w-80"
                />
              </div>
            </div>
          </div>

          {/* Popular Clauses Picks */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono uppercase text-[#6e6358]">Popular:</span>
            {popularClauses.map(pc => (
              <span
                key={pc.num}
                className="px-2.5 py-1 rounded-[3px] bg-[#efe7db] text-[#1a1612] text-xs cursor-pointer hover:bg-[#e4dacb] transition-colors"
              >
                Clause {pc.num}: {pc.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 02 WHERE TO START ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 Where to start</span>
          <span className="text-[#6e6358]">Three cards that jump to parts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {WHERE_TO_START_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-2 hover:border-[#8a6a36] transition-colors cursor-pointer"
            >
              <div className="text-[10px] font-mono uppercase text-[#6e6358]">
                {card.tag}
              </div>
              <h3 className="font-serif text-base font-bold text-[#1a1612]">
                {card.title}
              </h3>
              <div className="text-[11px] text-[#8a6a36] font-mono">
                Clauses {card.startClause} to {card.endClause}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 03 OPENING ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Opening</span>
          <span className="text-[#6e6358]">Opening paragraph</span>
        </div>

        <p className="text-sm md:text-base text-[#2c241c] font-sans leading-relaxed bg-[#fcfaf7] p-5 rounded-[4px] border border-[#efe7da]">
          {OPENING_PARAGRAPH}
        </p>
      </section>

      {/* ==================== 04 THE ESSENTIALS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 The essentials</span>
          <span className="text-[#6e6358]">Eight points that each open a clause</span>
        </div>

        <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
          {THE_ESSENTIALS.map((item, idx) => (
            <div key={idx} className="p-3.5 flex items-start justify-between gap-4 bg-[#fffefb] hover:bg-[#fbf8f2] transition-colors">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[11px] font-bold text-[#8a6a36] mt-0.5">
                  0{idx + 1}
                </span>
                <p className="text-[#1a1612] leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <span className="font-mono text-[11px] text-[#8a6a36] shrink-0 hover:underline cursor-pointer">
                Clause {item.clauseNumber} →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 05 CLAUSES ==================== */}
      <section className="space-y-6 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Clauses</span>
          <span className="text-[#6e6358]">59 numbered clauses across 12 parts</span>
        </div>

        {/* Part Tabs Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilterPart(null)}
            className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeFilterPart === null ? 'bg-[#1a1612] text-white font-semibold' : 'bg-[#efe7db] text-[#5c5248]'
            }`}
          >
            All 12 Parts
          </button>
          {partsList.map(pt => (
            <button
              key={pt.partNum}
              onClick={() => setActiveFilterPart(pt.partNum)}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeFilterPart === pt.partNum ? 'bg-[#1a1612] text-white font-semibold' : 'bg-[#efe7db] text-[#5c5248]'
              }`}
            >
              Part {pt.partNum} ({pt.startClause}–{pt.endClause})
            </button>
          ))}
        </div>

        {/* Selected Part Sample Clauses with Figures */}
        <div className="space-y-6">
          <div className="p-6 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-4">
            <div className="border-b border-[#efe7da] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#8a6a36] font-semibold">
                  Part 4 · Renting a Piece
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1a1612]">
                  Clause 18: Booking and Rental Durations
                </h3>
              </div>
              <span className="text-xs font-mono bg-[#f7f2ea] text-[#6e6358] px-2 py-0.5 rounded-[2px]">
                hok_terms_v4 §18
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#5c5248] leading-relaxed">
              <p>
                <strong>18.1</strong> Standard reservations begin for a primary duration of{' '}
                <FigureToken figure={getFig('rental_period_primary_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_primary_days'} />,{' '}
                with extended durations of <FigureToken figure={getFig('rental_period_extended_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_extended_days'} />{' '}
                permitted for destination events.
              </p>
              <p>
                <strong>18.2</strong> The rental window formally commences at{' '}
                <FigureToken figure={getFig('rental_period_start_time')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_start_time'} />{' '}
                on your requested delivery date. All items must be prepared for scheduled courier collection by{' '}
                <FigureToken figure={getFig('rental_period_return_cutoff_time')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_return_cutoff_time'} />{' '}
                on your designated return date.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-4">
            <div className="border-b border-[#efe7da] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#8a6a36] font-semibold">
                  Part 4 · Renting a Piece
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1a1612]">
                  Clause 20: Security Deposit Assessment and Release
                </h3>
              </div>
              <span className="text-xs font-mono bg-[#f7f2ea] text-[#6e6358] px-2 py-0.5 rounded-[2px]">
                hok_terms_v4 §20
              </span>
            </div>

            <div className="space-y-3 text-xs text-[#5c5248] leading-relaxed">
              <p>
                <strong>20.1</strong> The refundable security deposit is assessed at{' '}
                <FigureToken figure={getFig('deposit_default_percent')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_default_percent'} />{' '}
                of retail valuation, held securely via <FigureToken figure={getFig('deposit_hold_mode')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_hold_mode'} />.
              </p>
              <p>
                <strong>20.2</strong> Studio inspection is conducted within{' '}
                <FigureToken figure={getFig('deposit_qc_duration_hours')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_qc_duration_hours'} />{' '}
                of return arrival, and deposit funds are released within{' '}
                <FigureToken figure={getFig('deposit_release_hours_after_qc')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_release_hours_after_qc'} />.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 06 OUR POLICIES ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 Our policies</span>
          <span className="text-[#6e6358]">7 policy links + review date</span>
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-semibold text-[#1a1612]">These Terms incorporate our specialized policy documents:</span>
          <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a6a36]">
            <span className="hover:underline cursor-pointer">Refund & Cancellation Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Deposit Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Care, Cleaning & Damage Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Shipping & Delivery Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Seller Guidelines</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Cookie Policy</span>
          </div>
          <div className="pt-2 text-[11px] text-[#6e6358]">
            Fine print: Last reviewed {page.lastPublished}. Version stamped v1.0.
          </div>
        </div>
      </section>

      {/* ==================== 07 QUESTIONS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Questions</span>
          <span className="text-[#6e6358]">Closing band</span>
        </div>

        <div className="p-8 rounded-[4px] bg-[#1a1612] text-white space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#c9a96e]">
            Questions about these terms?
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Speak with our legal and concierge desk
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-xl leading-relaxed">
            Every clause is written to protect your celebration and our listers with equal clarity. If you have questions about specific clauses, reach our team directly.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp our team</span>
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Email legal concierge</span>
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default TermsPaper;