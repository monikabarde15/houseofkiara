/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: AboutPaper (Spec §8.6, Screens 44–46, Pages 31–32)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import { EyeOff, Film, ChevronDown, Sparkles, ArrowRight, Instagram, User } from 'lucide-react';

interface AboutPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const AboutPaper: React.FC<AboutPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Band visibility switches (Spec §8.6: "Show this band on the page")
  const [showHero, setShowHero] = useState(true);
  const [showNameBand, setShowNameBand] = useState(true);
  const [showManifesto, setShowManifesto] = useState(true);
  const [showBeliefs, setShowBeliefs] = useState(true);
  const [showTwoSides, setShowTwoSides] = useState(true);
  const [showFounder, setShowFounder] = useState(true);
  const [showWhy, setShowWhy] = useState(true);
  const [showThreeWays, setShowThreeWays] = useState(true);
  const [showClosing, setShowClosing] = useState(true);

  // Part 02: The Name letter tab selection (K-A-I-R-A)
  const [selectedLetter, setSelectedLetter] = useState<'K' | 'A1' | 'I' | 'R' | 'A2'>('K');

  // Part 05: Two Sides toggle (Celebrating vs Listing)
  const [activeSide, setActiveSide] = useState<'celebrating' | 'listing'>('celebrating');

  // Part 07: Circular mark toggle
  const [showCircularMark, setShowCircularMark] = useState(true);

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'brand',
      owner: 'Site Settings',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  // Letter data for Part 02
  const nameLetters = [
    { id: 'K', letter: 'K', word: 'Karigari', meaning: 'The reverence for Indian artisan craftsmanship, zardozi needlework and ancestral textile arts.' },
    { id: 'A1', letter: 'A', word: 'Asal', meaning: 'Pure authenticity: every garment verified, sourced directly from premier ateliers with certified provenance.' },
    { id: 'I', letter: 'I', word: 'Inayat', meaning: 'Grace and blessings: treating celebratory attire as memorable cultural moments rather than disposable fashion.' },
    { id: 'R', letter: 'R', word: 'Riwayaat', meaning: 'Timeless heritage: honoring festive rituals, weddings, and generational Indian family milestones.' },
    { id: 'A2', letter: 'A', word: 'Apnapan', meaning: 'Warmth and belonging: concierge luxury hospitality delivered with personal care from our studio in Indore.' }
  ];

  // Beliefs data for Part 04 (two halves heading)
  const beliefs = [
    {
      halfOne: 'Couture belongs on celebrations,',
      halfTwo: 'not stored away in dark wardrobes',
      body: 'Masterpiece lehengas and sherwanis are designed to be seen, photographed, and remembered. Keeping them locked in garment covers robs them of their life.'
    },
    {
      halfOne: 'Authenticity must be proven,',
      halfTwo: 'verified stitch by stitch before dispatch',
      body: 'We handle every cleaning, quality inspection, and logistics handoff ourselves. You only ever deal with House of Kiara.'
    },
    {
      halfOne: 'Circulating beauty',
      halfTwo: 'preserves the artisan legacy of Indian fashion',
      body: 'Extending the lifespan of hand-embroidered textiles reduces fashion waste and honors the hundreds of artisan hours behind each creation.'
    },
    {
      halfOne: 'Luxury is hospitality,',
      halfTwo: 'warm, personal and unhurried',
      body: 'From our styling conversations in Indore to bespoke packaging across India, concierge care is at the center of every booking.'
    }
  ];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-14 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_about_us
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 1 figure · 9 items to look at</span>
          </div>
        </div>
      </header>

      {/* ==================== 01 HERO ==================== */}
      <section className={`space-y-4 ${!showHero ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>01 Hero</span>
          <div className="flex items-center gap-2">
            {!showHero && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowHero(!showHero)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
              title="Toggle band visibility"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#6e6358]">
            The House · Indore, India
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            A home for Indian couture that deserves to be seen again
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            House of Kiara was born in Indore with a singular vision: to make India’s most breathtaking designer bridal and occasionwear accessible through thoughtful rentals, verified preloved acquisitions, and authentic preservation.
          </p>

          {/* Three Facts (Spec §8.6) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-[3px] bg-[#fcfaf7] border border-[#efe7da] space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6e6358] block">Origin</span>
              <span className="font-serif text-sm font-bold text-[#1a1612]">Indore, Madhya Pradesh</span>
            </div>
            <div className="p-3 rounded-[3px] bg-[#fcfaf7] border border-[#efe7da] space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6e6358] block">Philosophy</span>
              <span className="font-serif text-sm font-bold text-[#1a1612]">Circular Luxury Couture</span>
            </div>
            <div className="p-3 rounded-[3px] bg-[#fcfaf7] border border-[#efe7da] space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6e6358] block">Standards</span>
              <span className="font-serif text-sm font-bold text-[#1a1612]">100% Verified Provenance</span>
            </div>
          </div>

          {/* Brand Film Slot Underneath (Spec §8.6) */}
          <div className="p-4 rounded-[4px] border border-dashed border-[#d9ccb6] bg-[#fcfaf7] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#5c5248]">
              <Film className="w-4 h-4 text-[#8a6a36]" />
              <span>Brand film coming soon · Captured in our Indore atelier</span>
            </div>
            <span className="text-[11px] font-mono text-[#8a6a36]">Coming soon</span>
          </div>

          {/* Scroll Cue */}
          <div className="text-center pt-2 text-[11px] font-mono text-[#6e6358] flex items-center justify-center gap-1">
            <span>Explore our story</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </section>

      {/* ==================== 02 THE NAME ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showNameBand ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 The Name</span>
          <div className="flex items-center gap-2">
            {!showNameBand && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowNameBand(!showNameBand)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-[#6e6358]">What is in a name</div>
          <h2 className="text-2xl font-serif font-bold text-[#1a1612]">
            Five letters, five promises
          </h2>
          <p className="text-xs text-[#5c5248]">
            Each letter in KAIRA represents an enduring pillar of our curation and commitment.
          </p>

          {/* Tappable Letter Tabs */}
          <div className="flex items-center gap-2 pt-2">
            {nameLetters.map(nl => (
              <button
                key={nl.id}
                onClick={() => setSelectedLetter(nl.id as any)}
                className={`w-12 h-12 rounded-[4px] font-serif text-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                  selectedLetter === nl.id
                    ? 'bg-[#1a1612] text-[#c9a96e] shadow-xs'
                    : 'bg-[#fcfaf7] border border-[#d9ccb6] text-[#1a1612] hover:bg-[#efe7db]'
                }`}
              >
                {nl.letter}
              </button>
            ))}
          </div>

          {/* Open Letter Card */}
          {(() => {
            const activeLetter = nameLetters.find(nl => nl.id === selectedLetter) || nameLetters[0];
            return (
              <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/30 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold text-[#8a6a36]">{activeLetter.word}</span>
                  <span className="text-xs font-mono text-[#6e6358]">· {activeLetter.letter} in Kiara</span>
                </div>
                <p className="text-xs text-[#5c5248] leading-relaxed">
                  {activeLetter.meaning}
                </p>
              </div>
            );
          })()}

          <div className="pt-2 text-[11px] text-[#6e6358] italic">
            Where the name comes from: Derived from classical Sanskrit roots symbolizing radiance, clarity, and celebration.
          </div>
        </div>
      </section>

      {/* ==================== 03 MANIFESTO ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showManifesto ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Manifesto</span>
          <div className="flex items-center gap-2">
            {!showManifesto && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowManifesto(!showManifesto)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-[4px] bg-[#fcfaf7] border-l-4 border-[#8a6a36] space-y-4">
          <blockquote className="font-serif text-xl md:text-2xl text-[#1a1612] leading-snug font-normal italic">
            “Occasionwear was never meant to be worn once and forgotten in darkness. It was made to celebrate life, shared across generations and celebrations.”
          </blockquote>
          <p className="text-xs text-[#5c5248] leading-relaxed max-w-xl font-sans">
            Every garment we welcome into the house represents hundreds of artisan hours. Our purpose is to keep that artistic craftsmanship in continuous rotation.
          </p>
        </div>
      </section>

      {/* ==================== 04 WHAT WE BELIEVE ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showBeliefs ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 What We Believe</span>
          <div className="flex items-center gap-2">
            {!showBeliefs && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowBeliefs(!showBeliefs)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase text-[#6e6358]">Four core ideas</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {beliefs.map((b, idx) => (
              <div key={idx} className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-2">
                <div className="space-y-0.5">
                  <h3 className="font-serif text-base font-bold text-[#1a1612] leading-tight">
                    {b.halfOne}
                  </h3>
                  <div className="font-serif text-sm italic text-[#8a6a36]">
                    {b.halfTwo}
                  </div>
                </div>
                <p className="text-xs text-[#5c5248] leading-relaxed">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 05 TWO SIDES ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showTwoSides ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Two Sides</span>
          <div className="flex items-center gap-2">
            {!showTwoSides && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowTwoSides(!showTwoSides)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex rounded-[3px] p-0.5 bg-[#efe7db] border border-[#d9ccb6] text-xs">
            <button
              type="button"
              onClick={() => setActiveSide('celebrating')}
              className={`px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
                activeSide === 'celebrating' ? 'bg-[#fffefb] text-[#1a1612] font-semibold shadow-xs' : 'text-[#6e6358]'
              }`}
            >
              For the person celebrating
            </button>
            <button
              type="button"
              onClick={() => setActiveSide('listing')}
              className={`px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
                activeSide === 'listing' ? 'bg-[#fffefb] text-[#1a1612] font-semibold shadow-xs' : 'text-[#6e6358]'
              }`}
            >
              For the person listing
            </button>
          </div>

          <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#e6dccb] space-y-3">
            {activeSide === 'celebrating' ? (
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#1a1612]">
                  Wear the couture piece you’ve always dreamed of, effortlessly
                </h3>
                <p className="text-xs text-[#5c5248] leading-relaxed">
                  Rent certified designer sarees, lehengas and gowns for weddings, sangeets, and gala evenings. Delivered dry-cleaned and custom-fitted, with prepaid pickup right after your celebration.
                </p>
                <div className="pt-2">
                  <span className="px-3.5 py-1.5 rounded-[3px] bg-[#1a1612] text-white text-xs font-medium cursor-pointer inline-flex items-center gap-1.5">
                    <span>Browse designer collections</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#1a1612]">
                  Monetize your luxury wardrobe with complete concierge care
                </h3>
                <p className="text-xs text-[#5c5248] leading-relaxed">
                  List your bridal or festive designer wear. We handle professional photography, dry-cleaning, insurance, client vetting, and payouts straight into your bank account.
                </p>
                <div className="pt-2">
                  <span className="px-3.5 py-1.5 rounded-[3px] bg-[#8a6a36] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
                    <span>List your couture piece</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 06 FROM THE FOUNDER ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showFounder ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 From The Founder</span>
          <div className="flex items-center gap-2">
            {!showFounder && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowFounder(!showFounder)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#efe7db] border border-[#d9ccb6] flex items-center justify-center font-serif text-lg font-bold text-[#8a6a36]">
              PS
            </div>
            <div>
              <div className="font-serif text-base font-bold text-[#1a1612]">Pooja Sharma</div>
              <div className="text-xs text-[#6e6358]">Founder & Creative Director · House of Kiara</div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#5c5248] leading-relaxed">
            <p>
              I started House of Kiara because I watched friends and family invest lakhs into extraordinary bridal lehengas that saw the light of day exactly once.
            </p>
            <p>
              In Indore, we believe deeply in the dignity of craft. Every thread, every zardozi motif tells an artisan’s story. Sharing these pieces honors that artistry while giving modern celebrants access to unmatched luxury.
            </p>
            <p>
              When you rent or list with us, you are joining an intimate circle of custodians who cherish heritage fashion as much as you do.
            </p>
          </div>

          <div className="pt-2 font-serif text-sm italic text-[#8a6a36]">
            Warm regards, Pooja
          </div>
        </div>
      </section>

      {/* ==================== 07 WHY WE BUILT IT ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showWhy ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Why We Built It</span>
          <div className="flex items-center gap-2">
            {!showWhy && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowWhy(!showWhy)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-[4px] border border-[#e6dccb] space-y-3 relative overflow-hidden ${showCircularMark ? 'bg-[#fcfaf7]' : 'bg-[#fffefb]'}`}>
          {showCircularMark && (
            <div className="absolute right-4 -top-8 w-40 h-40 rounded-full border-8 border-[#c9a96e]/10 pointer-events-none" />
          )}

          <h3 className="font-serif text-lg font-bold text-[#1a1612]">
            The circular economy for Indian luxury occasionwear
          </h3>
          <p className="text-xs text-[#5c5248] leading-relaxed">
            The traditional wedding wardrobe was built on permanence. But celebration culture has evolved: today’s celebrations demand variety, conscious consumption, and intelligent wardrobe curation.
          </p>
          <p className="text-xs text-[#5c5248] leading-relaxed">
            By establishing verified valuation, tamper-evident security, and artisan dry-cleaning, we turn static bridal assets into dynamic, joy-generating experiences.
          </p>
        </div>
      </section>

      {/* ==================== 08 THREE WAYS ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showThreeWays ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>08 Three Ways</span>
          <div className="flex items-center gap-2">
            {!showThreeWays && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowThreeWays(!showThreeWays)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1.5">
            <span className="font-mono text-[10px] text-[#8a6a36]">01</span>
            <h4 className="font-serif text-base font-bold text-[#1a1612]">Rent for Days</h4>
            <p className="text-[11px] text-[#5c5248]">
              Book couture for 3, 5, or 7 days with complimentary fitting adjustments and prepaid courier return.
            </p>
          </div>
          <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1.5">
            <span className="font-mono text-[10px] text-[#8a6a36]">02</span>
            <h4 className="font-serif text-base font-bold text-[#1a1612]">Buy Preloved</h4>
            <p className="text-[11px] text-[#5c5248]">
              Acquire verified archival pieces at a fraction of atelier retail, authenticated and delivered to keep.
            </p>
          </div>
          <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1.5">
            <span className="font-mono text-[10px] text-[#8a6a36]">03</span>
            <h4 className="font-serif text-base font-bold text-[#1a1612]">List & Monetize</h4>
            <p className="text-[11px] text-[#5c5248]">
              Consign your designer wear with our Indore concierge. We safeguard it, insure it, and pay out per booking.
            </p>
          </div>
        </div>

        <div className="pt-1 text-center text-xs text-[#6e6358]">
          Have a bespoke celebration requirement? Speak directly with our styling concierge.
        </div>
      </section>

      {/* ==================== 09 CLOSING ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showClosing ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>09 Closing</span>
          <div className="flex items-center gap-2">
            {!showClosing && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowClosing(!showClosing)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-8 rounded-[4px] bg-[#1a1612] text-white text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Step into the world of House of Kiara
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-md mx-auto leading-relaxed">
            Begin with our curated collection of verified designer lehengas, or speak with our concierge in Indore.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold cursor-pointer">
              Explore the Collection
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer">
              Book a Styling Call
            </span>
          </div>

          <div className="pt-3 text-[11px] text-[#b4a99e] flex items-center justify-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-[#c9a96e]" />
            <span>Follow our journey on Instagram: @houseofkairaofficial</span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default AboutPaper;