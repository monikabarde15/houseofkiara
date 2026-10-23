/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: CarePaper (Spec §8.14, Screens 52–53, Pages 41–42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  CARE_POPULAR_LINKS,
  FIRST_AID_STEPS,
  MOMENT_TABS
} from '../../data/contentRegistries/care/careRegistry.js';
import { Search, ChevronRight, MessageSquare, Mail, Phone, ArrowRight, ShieldCheck, Sparkles, Heart } from 'lucide-react';

interface CarePaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const CarePaper: React.FC<CarePaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Moment by moment active tab (§8.14 Part 04, Screen 52)
  const [activeMomentId, setActiveMomentId] = useState<string>('arrives');

  // Piece by piece tab (§8.14 Part 06)
  const [activePieceType, setActivePieceType] = useState<string>('lehenga');

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'care',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  const activeMoment = MOMENT_TABS.find(m => m.id === activeMomentId) || MOMENT_TABS[0];

  // Piece by piece advice (§8.14 Part 06)
  const pieceAdvice: Record<string, { title: string; habits: string[] }> = {
    lehenga: {
      title: 'Looking after a heavy lehenga & can-can skirt',
      habits: [
        'Always lift the skirt hem slightly when walking up staircases or dancing on stages.',
        'Never use safety pins directly through delicate tulle or silk dupion without pin-guards.',
        'Keep makeup and perfume application at least 15 minutes before slipping into the blouse.'
      ]
    },
    saree: {
      title: 'Draping and preserving handwoven & embellished sarees',
      habits: [
        'Use plastic-coated safety pins for pleats to avoid snagging delicate metallic zari threads.',
        'Avoid pulling forcibly on pallu tassels when adjusting your drape during photography.',
        'Fold gently along original crease lines before placing back inside the padded envelope.'
      ]
    },
    gown: {
      title: 'Couture evening gowns and structured corsetry',
      habits: [
        'Step in from above whenever possible to protect corsetry boning and zip alignments.',
        'Avoid prolonged contact with wet grass or damp garden lawns during outdoor receptions.'
      ]
    },
    sherwani: {
      title: 'Embroidered men’s sherwanis and bandhgalas',
      habits: [
        'Hang on the heavy contoured wooden hanger supplied to maintain shoulder structure.',
        'Avoid friction with heavy metallic wristwatches against embroidered sleeve cuffs.'
      ]
    }
  };

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_care_policy_v3
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 13 figures · 0 items to look at</span>
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
            Garment Care Standards
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            Care, Cleaning &amp; <span className="italic text-[#8a6a36] font-normal">Damage Policy</span>
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            The complete care journey from arrival to return, and the single clear test that distinguishes everyday wear from damage.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl pt-1">
            <div className="w-full px-4 py-3 rounded-[3px] border border-[#d9ccb6] bg-[#fffefb] text-xs text-[#6e6358] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8a6a36]" />
                <span className="text-[#8c827a]">Search garment care, cleaning methods, pins and stains...</span>
              </div>
            </div>
          </div>

          {/* Popular Links */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono uppercase text-[#6e6358]">Popular:</span>
            {CARE_POPULAR_LINKS.map((pl, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-[3px] bg-[#efe7db] text-[#1a1612] text-xs cursor-pointer hover:bg-[#e4dacb] transition-colors"
              >
                {pl.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 02 IF SOMETHING HAPPENS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 If something happens</span>
          <span className="text-[#6e6358]">Three first steps and WhatsApp button</span>
        </div>

        <div className="p-6 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#1a1612]">
              Three calm first steps if a mishap occurs
            </h3>
            <span className="text-[11px] font-mono text-[#8a6a36]">Zero stress first response</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FIRST_AID_STEPS.map(st => (
              <div key={st.num} className="p-3.5 rounded-[3px] bg-[#fffefb] border border-[#e6dccb] space-y-1">
                <span className="font-mono text-xs font-bold text-[#8a6a36]">Step {st.num}</span>
                <h4 className="font-serif text-sm font-bold text-[#1a1612]">{st.title}</h4>
                <p className="text-[11px] text-[#5c5248] leading-relaxed">{st.line}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#5c5248]">
              Reporting an issue early never counts against you.
            </span>
            <span className="px-3.5 py-1.5 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp our studio</span>
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 03 OUR ONE REQUEST ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Our one request</span>
          <span className="text-[#6e6358]">Opening paragraph</span>
        </div>

        <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] text-sm text-[#2c241c] leading-relaxed">
          <p>
            Please never attempt to wash, spot-clean, or dry-clean a piece yourself. Master dry-cleaning is{' '}
            <strong className="font-serif italic font-normal text-[#8a6a36]">always included in your rental</strong>, handled by our specialist dry-cleaners who know exactly how to preserve delicate zari and sequins.
          </p>
        </div>
      </section>

      {/* ==================== 04 MOMENT BY MOMENT ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 Moment by moment (Screen 52)</span>
          <span className="text-[#6e6358]">Five moments from arrival to return</span>
        </div>

        {/* Moment Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {MOMENT_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMomentId(tab.id)}
              className={`px-3 py-1.5 rounded-[3px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeMomentId === tab.id
                  ? 'bg-[#1a1612] text-white font-semibold'
                  : 'bg-[#efe7db] text-[#5c5248] hover:bg-[#e4dacb]'
              }`}
            >
              {tab.num}. {tab.title}
            </button>
          ))}
        </div>

        {/* Selected Moment Content */}
        <div className="p-5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-3 text-xs leading-relaxed animate-in fade-in">
          <div>
            <span className="text-[10px] font-mono text-[#8a6a36] uppercase font-bold">
              Moment 0{activeMoment.num}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1a1612]">
              {activeMoment.heading}
            </h3>
            <p className="text-xs text-[#6e6358]">
              {activeMoment.subheading}
            </p>
          </div>

          <ul className="space-y-1.5 pt-2 border-t border-[#efe7da] text-[#5c5248]">
            {activeMoment.notes.map((note, nIdx) => (
              <li key={nIdx} className="flex items-start gap-2">
                <span className="text-[#8a6a36] mt-0.5">✦</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================== 05 WEAR OR DAMAGE ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Wear or damage</span>
          <span className="text-[#6e6358]">The test that decides normal wear from damage</span>
        </div>

        <div className="p-6 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/40 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#1a1612]">
              The core distinction: Gentle celebration vs permanent harm
            </h3>
            <p className="text-xs text-[#5c5248]">
              This test reads word for word across the Deposit Policy, Care Policy, and Refund Policy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Always on us */}
            <div className="p-4 rounded-[3px] bg-[#fffefb] border border-[#6b7e5a]/30 space-y-2">
              <span className="font-serif text-base font-bold text-[#6b7e5a] block">
                Always on us (Normal wear)
              </span>
              <p className="text-[#5c5248]">
                Minor dust along the lower hemline, gentle wrinkles from sitting, loose hook fasteners, or standard makeup residue removed during dry-cleaning.
              </p>
              <span className="text-[10px] font-mono text-[#6b7e5a] block font-semibold">
                Deduction: ₹0 (Zero deposit impact)
              </span>
            </div>

            {/* Assessed with care */}
            <div className="p-4 rounded-[3px] bg-[#fffefb] border border-[#a4512f]/30 space-y-2">
              <span className="font-serif text-base font-bold text-[#a4512f] block">
                Assessed with care (Avoidable damage)
              </span>
              <p className="text-[#5c5248]">
                Irreversible wine or oil saturation, fabric burns, tears from high-heel punctures, or lost handcrafted tassels and latkans.
              </p>
              <span className="text-[10px] font-mono text-[#a4512f] block font-semibold">
                Deduction: Actual artisan restoration cost
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 06 PIECE BY PIECE ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 Piece by piece</span>
          <span className="text-[#6e6358]">Habits for each kind of garment</span>
        </div>

        {/* Piece Type Selector */}
        <div className="inline-flex rounded-[3px] p-0.5 bg-[#efe7db] border border-[#d9ccb6] text-xs">
          {[
            { id: 'lehenga', label: 'Lehengas' },
            { id: 'saree', label: 'Sarees' },
            { id: 'gown', label: 'Gowns' },
            { id: 'sherwani', label: 'Sherwanis' }
          ].map(pt => (
            <button
              key={pt.id}
              onClick={() => setActivePieceType(pt.id)}
              className={`px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
                activePieceType === pt.id
                  ? 'bg-[#fffefb] text-[#1a1612] font-semibold shadow-xs'
                  : 'text-[#6e6358]'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>

        <div className="p-5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-2 text-xs">
          <h4 className="font-serif text-base font-bold text-[#1a1612]">
            {pieceAdvice[activePieceType]?.title}
          </h4>
          <ul className="space-y-1.5 pt-1 text-[#5c5248]">
            {pieceAdvice[activePieceType]?.habits.map((h, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#8a6a36]">·</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================== 11 RELATED POLICIES ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>11 Related policies</span>
          <span className="text-[#6e6358]">5 links</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a6a36]">
          <span className="hover:underline cursor-pointer">Terms & Conditions</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Deposit Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Refund & Cancellation Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Shipping & Delivery Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Seller Guidelines</span>
        </div>
        <div className="pt-1 text-[11px] text-[#6e6358]">
          Last reviewed {page.lastPublished}. Version stamped v3.
        </div>
      </section>

      {/* ==================== 12 CAN’T FIND IT ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>12 Can’t find it</span>
          <span className="text-[#6e6358]">Closing band</span>
        </div>

        <div className="p-8 rounded-[4px] bg-[#1a1612] text-white space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#c9a96e]">
            Have a question about garment care?
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Our atelier specialists are on WhatsApp
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-xl leading-relaxed">
            From temporary pin-guards to emergency stain advice, our team is available to assist you throughout your celebration.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message our atelier team</span>
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Email care desk</span>
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default CarePaper;