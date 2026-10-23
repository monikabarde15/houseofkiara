/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ListYourPiecePaper (Spec §8.8, Screen 48, Pages 35–36)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import { EyeOff, Calculator, Upload, Check, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface ListYourPiecePaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const ListYourPiecePaper: React.FC<ListYourPiecePaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Band toggles (§8.8)
  const [showHero, setShowHero] = useState(true);
  const [showTicker, setShowTicker] = useState(true);
  const [showPromise, setShowPromise] = useState(true);
  const [showThreePromises, setShowThreePromises] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [showCalculator, setShowCalculator] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [showBoutiques, setShowBoutiques] = useState(true);
  const [showFaq, setShowFaq] = useState(true);

  // Part 05: Earnings calculator interactive preview state (§8.8 Part 05, Screen 48)
  const [garmentRetailValuation, setGarmentRetailValuation] = useState<number>(75000);
  const rentalSharePercent = 12; // 12% of retail valuation per rental
  const estimatedRentalsPerYear = 4;
  const perRentalEstimate = Math.round((garmentRetailValuation * rentalSharePercent) / 100);
  const yearlyEstimate = perRentalEstimate * estimatedRentalsPerYear;

  // Part 06: Form active step tab (§8.8 Part 06)
  const [activeFormStep, setActiveFormStep] = useState<number>(1);

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

  // Four assurance cards (Part 02)
  const assurances = [
    { title: 'Verified authentic celebrants', body: 'Every rental client undergoes digital government ID verification and background security review before dispatch.' },
    { title: 'Full replacement guarantee', body: 'In the rare event of irreversible staining or damage, you are compensated according to our formal valuation matrix.' },
    { title: 'Studio dry-cleaning care', body: 'We manage dry-cleaning between every wear using heritage-safe, eco-certified dry-cleaning processes.' },
    { title: 'Ownership remains yours', body: 'Recall your garment back to your home wardrobe whenever you have an upcoming family celebration.' }
  ];

  // Three promises (Part 03: heading in 3 parts, middle gold)
  const threePromises = [
    {
      kicker: 'PROMISE 01',
      part1: 'Your piece is insured',
      partGold: 'from doorstep pickup',
      part3: 'to its return',
      body: 'Zero transit liability falls on you. Our insured logistics partners handle pickup in custom reinforced luggage.'
    },
    {
      kicker: 'PROMISE 02',
      part1: 'Payouts are transferred',
      partGold: 'within 72 hours',
      part3: 'of completed rentals',
      body: 'No delayed seasonal batches. You receive itemized rental earnings directly via NEFT bank transfer.'
    },
    {
      kicker: 'PROMISE 03',
      part1: 'Consignment rates are',
      partGold: 'transparently agreed',
      part3: 'before publishing',
      body: 'You approve the rental fee and minimum preloved sale valuation before the garment goes live in the public gallery.'
    }
  ];

  // Five steps to payout (Part 04)
  const fiveSteps = [
    { num: '01', title: 'Submit 3 photos online', body: 'Takes less than 3 minutes. Share designer label, condition notes, and approximate year of purchase.' },
    { num: '02', title: 'Atelier valuation assessment', body: 'Our Indore curation team reviews market demand and recommends rental and preloved price points.' },
    { num: '03', title: 'Complimentary courier collection', body: 'We collect the piece from your home, steam-sanitize it, and capture 360-degree studio photographs.' },
    { num: '04', title: 'Live in the verified gallery', body: 'Your couture piece is featured with full designer provenance and sizing specifications.' },
    { num: '05', title: 'Receive regular rental payouts', body: 'Earn passive income every time a celebrant reserves your piece for a wedding or gala.' }
  ];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-14 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_list_your_piece
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 7 figures · 30 items to look at</span>
          </div>
        </div>
      </header>

      {/* ==================== 01 HERO & TICKER ==================== */}
      <section className={`space-y-4 ${!showHero ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>01 Hero</span>
          <div className="flex items-center gap-2">
            {!showHero && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowHero(!showHero)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ticker (Spec §8.8 Part 01) */}
        {showTicker && (
          <div className="p-2.5 rounded-[3px] bg-[#1a1612] text-[#c9a96e] text-xs font-mono flex items-center justify-between overflow-hidden">
            <span className="truncate">
              ✦ NOW ONBOARDING COUTURE LEHENGAS & SAREES FROM SABYASACHI, TARUN TAHILIANI, ANITA DONGRE & SEEMA GUJRAL ✦
            </span>
            <span className="text-[10px] text-white/50 shrink-0 ml-2">Ticker loops</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#6e6358]">
            Lister Onboarding · Concierge Care
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            Your designer bridal wear deserves more than a single evening
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            Consign your verified Indian designer couture with House of Kiara. We handle client verification, insured doorstep shipping, dry-cleaning, and direct bank payouts.
          </p>

          {/* Three Figures (Spec §8.8 Part 01) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3.5 rounded-[3px] bg-[#fcfaf7] border border-[#efe7da] space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6e6358] block">Average rental return</span>
              <span className="font-serif text-lg font-bold text-[#1a1612]">Up to 45%</span>
              <span className="text-[11px] text-[#6e6358] block">of original retail value</span>
            </div>
            <div className="p-3.5 rounded-[3px] bg-[#fcfaf7] border border-[#efe7da] space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6e6358] block">Transit insurance</span>
              <span className="font-serif text-lg font-bold text-[#1a1612]">100% Covered</span>
              <span className="text-[11px] text-[#6e6358] block">Door-to-door protection</span>
            </div>
            <div className="p-3.5 rounded-[3px] bg-[#fcfaf7] border border-[#efe7da] space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-[#6e6358] block">Payout speed</span>
              <span className="font-serif text-lg font-bold text-[#1a1612]">72 Hours</span>
              <span className="text-[11px] text-[#6e6358] block">Direct NEFT transfer</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 02 THE LISTER’S PROMISE ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showPromise ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 The Lister’s Promise</span>
          <div className="flex items-center gap-2">
            {!showPromise && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowPromise(!showPromise)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <blockquote className="p-6 rounded-[4px] bg-[#fcfaf7] border-l-4 border-[#8a6a36] font-serif text-lg italic text-[#1a1612]">
            “We protect your pieces with the same obsessive devotion you had on the day you chose them.”
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assurances.map((ass, idx) => (
              <div key={idx} className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1">
                <h4 className="font-serif text-sm font-bold text-[#1a1612]">
                  {ass.title}
                </h4>
                <p className="text-xs text-[#5c5248] leading-relaxed">
                  {ass.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 03 THREE PROMISES ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showThreePromises ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Three Promises</span>
          <div className="flex items-center gap-2">
            {!showThreePromises && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowThreePromises(!showThreePromises)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {threePromises.map((pr, idx) => (
            <div key={idx} className="p-5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-2">
              <span className="text-[10px] font-mono text-[#8a6a36] font-bold block">{pr.kicker}</span>
              <h4 className="font-serif text-base font-bold text-[#1a1612] leading-tight">
                {pr.part1} <span className="text-[#8a6a36] italic">{pr.partGold}</span> {pr.part3}
              </h4>
              <p className="text-xs text-[#5c5248] leading-relaxed">
                {pr.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 04 HOW IT WORKS ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showSteps ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 How It Works (5 steps to payout)</span>
          <div className="flex items-center gap-2">
            {!showSteps && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
          {fiveSteps.map(step => (
            <div key={step.num} className="p-4 flex items-start gap-4 bg-[#fffefb]">
              <span className="w-8 h-8 rounded-full bg-[#f7f2ea] text-[#8a6a36] font-serif font-bold text-sm flex items-center justify-center shrink-0">
                {step.num}
              </span>
              <div className="space-y-0.5">
                <h4 className="font-serif text-base font-bold text-[#1a1612]">
                  {step.title}
                </h4>
                <p className="text-[#5c5248] leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 05 EARNINGS PREVIEW (CALCULATOR) ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showCalculator ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Earnings preview (Screen 48)</span>
          <div className="flex items-center gap-2">
            {!showCalculator && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/40 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#8a6a36]" />
              <h3 className="font-serif text-xl font-bold text-[#1a1612]">
                Estimate your garment’s earning potential
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#6e6358]">Estimated projection</span>
          </div>

          {/* Slider for retail valuation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1a1612]">Original retail valuation</span>
              <span className="font-serif text-lg font-bold text-[#8a6a36]">
                ₹{garmentRetailValuation.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={350000}
              step={5000}
              value={garmentRetailValuation}
              onChange={e => setGarmentRetailValuation(Number(e.target.value))}
              className="w-full accent-[#8a6a36] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6e6358]">
              <span>₹25,000</span>
              <span>₹1,50,000</span>
              <span>₹3,50,000+</span>
            </div>
          </div>

          {/* Output estimate cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#efe7da]">
            <div className="p-4 rounded-[3px] bg-[#fffefb] border border-[#e6dccb] space-y-1">
              <span className="text-[11px] text-[#6e6358] block">Potential per rental</span>
              <span className="font-serif text-2xl font-bold text-[#1a1612]">
                ₹{perRentalEstimate.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#6e6358] block">Based on ~{rentalSharePercent}% rental valuation</span>
            </div>
            <div className="p-4 rounded-[3px] bg-[#fffefb] border border-[#e6dccb] space-y-1">
              <span className="text-[11px] text-[#6e6358] block">Estimated annual return (4 bookings)</span>
              <span className="font-serif text-2xl font-bold text-[#8a6a36]">
                ₹{yearlyEstimate.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#6e6358] block">Direct NEFT payout to your bank</span>
            </div>
          </div>

          <div className="p-3 bg-[#f7f2ea] rounded-[3px] border border-[#d9ccb6] text-[11px] text-[#5c5248] space-y-0.5">
            <span className="font-semibold text-[#1a1612] block">Atelier policy note (§8.8 Part 05):</span>
            <p>
              A lister’s share is agreed piece by piece and never shown publicly, so the calculator works out only what a piece could rent for. Exact consignment fee is finalized in your formal listing agreement.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 06 THE FORM ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showForm ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 The Form (Five steps of fields)</span>
          <div className="flex items-center gap-2">
            {!showForm && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowForm(!showForm)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Step Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['1. Your Details', '2. About the Piece', '3. Condition & Fit', '4. Photographs', '5. Consent & Send'].map((stepLabel, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFormStep(idx + 1)}
                className={`px-3 py-1.5 rounded-[3px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeFormStep === idx + 1
                    ? 'bg-[#1a1612] text-white font-semibold'
                    : 'bg-[#efe7db] text-[#5c5248] hover:bg-[#e4dacb]'
                }`}
              >
                {stepLabel}
              </button>
            ))}
          </div>

          {/* Form Step Visual Preview */}
          <div className="p-6 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-4 text-xs">
            {activeFormStep === 1 && (
              <div className="space-y-3">
                <span className="font-serif text-base font-bold text-[#1a1612] block">Step 1: Your Contact Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase font-mono text-[#6e6358] block">Your full name</label>
                    <div className="p-2 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-[#b4a99e]">Pooja Sharma</div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase font-mono text-[#6e6358] block">WhatsApp phone number</label>
                    <div className="p-2 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-[#b4a99e]">+91 98200 12345</div>
                  </div>
                </div>
              </div>
            )}

            {activeFormStep === 2 && (
              <div className="space-y-3">
                <span className="font-serif text-base font-bold text-[#1a1612] block">Step 2: Designer & Garment Provenance</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase font-mono text-[#6e6358] block">Designer House (reads Designers list)</label>
                    <div className="p-2 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-[#1a1612]">Sabyasachi Mukherjee</div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase font-mono text-[#6e6358] block">Category (reads Categories list)</label>
                    <div className="p-2 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-[#1a1612]">Bridal Lehenga</div>
                  </div>
                </div>
              </div>
            )}

            {activeFormStep === 3 && (
              <div className="space-y-3">
                <span className="font-serif text-base font-bold text-[#1a1612] block">Step 3: Condition & Sizing</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase font-mono text-[#6e6358] block">Condition grade</label>
                    <div className="p-2 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-[#1a1612]">Pristine · Worn Once</div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase font-mono text-[#6e6358] block">Standard Size & Alteration Margin</label>
                    <div className="p-2 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-[#1a1612]">Size M (Bust 36, Waist 30) · 2" Margins</div>
                  </div>
                </div>
              </div>
            )}

            {activeFormStep === 4 && (
              <div className="space-y-3">
                <span className="font-serif text-base font-bold text-[#1a1612] block">Step 4: Garment Photographs (Min 3, Max 8)</span>
                <div className="p-6 rounded-[4px] border-2 border-dashed border-[#d9ccb6] bg-[#fcfaf7] text-center space-y-2">
                  <Upload className="w-6 h-6 text-[#8a6a36] mx-auto" />
                  <span className="font-medium text-[#1a1612] block">Front view, embroidery detail, and designer neck label</span>
                  <span className="text-[11px] text-[#6e6358]">Natural daylight photographs preferred</span>
                </div>
              </div>
            )}

            {activeFormStep === 5 && (
              <div className="space-y-3">
                <span className="font-serif text-base font-bold text-[#1a1612] block">Step 5: Consent & Submission</span>
                <p className="text-xs text-[#5c5248]">
                  By submitting this form, you acknowledge that our curation team will review provenance details under our Seller Guidelines v2. Submissions write directly to LYP Submissions in Admin.
                </p>
                <div className="pt-2">
                  <span className="px-4 py-2 rounded-[3px] bg-[#8a6a36] text-white text-xs font-semibold cursor-pointer inline-block">
                    Submit Piece for Curation Review
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== 07 FOR BOUTIQUES ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showBoutiques ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 For Boutiques & Designers</span>
          <div className="flex items-center gap-2">
            {!showBoutiques && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowBoutiques(!showBoutiques)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-[4px] bg-[#fcfaf7] border border-[#e6dccb] space-y-3">
          <div className="flex items-center gap-2 text-[#8a6a36]">
            <Building2 className="w-4 h-4" />
            <h3 className="font-serif text-lg font-bold text-[#1a1612]">
              Atelier Partnerships for Fashion Houses
            </h3>
          </div>
          <p className="text-xs text-[#5c5248] leading-relaxed">
            Are you a designer label or boutique atelier? House of Kiara offers curated wholesale consignment, archival sample sale monetization, and zero-inventory-risk display partnerships.
          </p>
          <div className="pt-2">
            <span className="text-xs font-semibold text-[#8a6a36] hover:underline cursor-pointer flex items-center gap-1">
              <span>View Buy New partnerships live in Designers module</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 08 FAQ ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showFaq ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>08 FAQ</span>
          <div className="flex items-center gap-2">
            {!showFaq && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] space-y-2 text-xs">
          <span className="font-semibold text-[#1a1612] block">
            Lister answers picked from Help & FAQs and the Seller Guidelines:
          </span>
          <ul className="list-disc list-inside text-[#5c5248] space-y-1">
            <li>S001: Who sets the rental fee for my piece?</li>
            <li>S002: Can I recall my piece for my own family event?</li>
            <li>S003: What happens if a customer damages my garment?</li>
            <li>S005: When do rental earnings reach my bank account?</li>
            <li>S008: Can I choose to offer my piece for preloved purchase as well?</li>
            <li>S011: How are counterfeit or replica garments screened?</li>
          </ul>
        </div>
      </section>
    </article>
  );
};

export default ListYourPiecePaper;