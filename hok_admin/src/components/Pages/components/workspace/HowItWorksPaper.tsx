/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: HowItWorksPaper (Spec §8.7, Screen 47, Pages 33–34)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import { EyeOff, ArrowRight, ArrowDown, Repeat, ShieldCheck, Sparkles, CheckCircle2, Instagram } from 'lucide-react';

interface HowItWorksPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const HowItWorksPaper: React.FC<HowItWorksPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Band toggles (§8.7)
  const [showHero, setShowHero] = useState(true);
  const [showIndex, setShowIndex] = useState(true);
  const [showShoppingSteps, setShowShoppingSteps] = useState(true);
  const [showLoopCard, setShowLoopCard] = useState(true);
  const [showTwoWays, setShowTwoWays] = useState(true);
  const [showCraftDivider, setShowCraftDivider] = useState(true);
  const [showListEarn, setShowListEarn] = useState(true);
  const [showGoodToKnow, setShowGoodToKnow] = useState(true);
  const [showFaq, setShowFaq] = useState(true);
  const [showClosing, setShowClosing] = useState(true);

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

  // Four shopping steps (§8.7 Part 03)
  const shoppingSteps = [
    {
      num: '01',
      title: 'Find your couture piece',
      body: 'Explore verified designer lehengas, sarees, gowns and sherwanis curated for Indian weddings and festive occasions.',
      lines: ['Browse by designer, occasion, or colour', 'Filter by available rental dates', 'Stylist sizing consultation available']
    },
    {
      num: '02',
      title: 'Choose your dates & fit',
      body: 'Select a 3, 5 or 7 day reservation. We coordinate complimentary custom blouse adjustments and fall-pico finishing.',
      lines: ['Arrives 2 days before your celebration', 'Secured with a refundable deposit', 'Tamper-evident luxury packaging']
    },
    {
      num: '03',
      title: 'Wear & celebrate',
      body: 'Step into your celebration looking radiant. Every garment arrives professionally dry-cleaned, steam-pressed and ready to wear.',
      lines: ['No dry-cleaning required before return', 'Minor accidental wear covered', 'Concierge on call throughout']
    },
    {
      num: '04',
      title: 'Effortless return pickup',
      body: 'Pack the piece back into its garment bag on the agreed return date. Our courier partner collects it right from your doorstep.',
      lines: ['Prepaid return shipping label included', 'Deposit released within 24 hours of QC', 'Zero return stress']
    }
  ];

  // Lister journey 4 steps (§8.7 Part 06)
  const listerSteps = [
    {
      num: '01',
      title: 'Submit your piece online',
      body: 'Upload 3 photographs and share original purchase details. Our curation team evaluates valuation within 24 hours.',
      pill: 'Free assessment'
    },
    {
      num: '02',
      title: 'Complimentary doorstep courier',
      body: 'We arrange secure collection from your home to our Indore atelier for physical authentication, inspection and photography.',
      pill: 'Insured in transit'
    },
    {
      num: '03',
      title: 'Live in the luxury gallery',
      body: 'Your garment is presented to thousands of verified celebrants with high-definition editorial imagery and sizing notes.',
      pill: 'Retain ownership'
    },
    {
      num: '04',
      title: 'Earn on every reservation',
      body: 'Receive direct bank payouts within 72 hours of each completed rental, or a lump-sum upon preloved acquisition.',
      pill: 'Direct NEFT transfer'
    }
  ];

  // Good to know 6 cards (§8.7 Part 07)
  const goodToKnowCards = [
    { title: 'Security deposits explained', body: 'How refundable holds protect garments and when they return.', linkTo: '/deposit' },
    { title: 'Hygiene & cleaning standards', body: 'Dual dry-cleaning protocols for every rental piece.', linkTo: '/care-policy' },
    { title: 'Fit & minor alterations', body: 'Non-invasive temporary stitching for bespoke blouse fit.', linkTo: '/faqs' },
    { title: 'Cancellation grace periods', body: 'Full refunds up to 14 days before dispatch.', linkTo: '/refunds' },
    { title: 'Lister insurance coverage', body: 'Protection against permanent garment impairment or loss.', linkTo: '/seller-guidelines' },
    { title: 'Nationwide delivery transit', body: 'Guaranteed arrival timelines for major metro areas.', linkTo: '/shipping-policy' }
  ];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-14 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_how_it_works_v4
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 8 figures · 31 items to look at</span>
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
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#8a6a36]">
            Simple by design
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            How House of Kiara works, for both sides of the wardrobe
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            Whether you are choosing a couture masterpiece to celebrate in, or opening your private collection to earn from it, every detail is handled personally by our atelier.
          </p>

          {/* Two Intent Buttons (Spec §8.7: jump down the page) */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#1a1612] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <span>I want to rent or shop</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] hover:bg-[#efe7db] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <span>I want to list my piece</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* ==================== 02 WHAT’S ON THIS PAGE ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showIndex ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 What’s on this page</span>
          <div className="flex items-center gap-2">
            {!showIndex && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowIndex(!showIndex)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#e6dccb] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-serif font-bold text-[#1a1612] block">
                The Shopper Journey (4 steps)
              </span>
              <ul className="text-xs text-[#5c5248] space-y-1 list-decimal list-inside">
                <li>Find your couture piece</li>
                <li>Choose your dates & fit</li>
                <li>Wear & celebrate</li>
                <li>Effortless return pickup</li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-serif font-bold text-[#1a1612] block">
                The Lister Journey (4 steps)
              </span>
              <ul className="text-xs text-[#5c5248] space-y-1 list-decimal list-inside">
                <li>Submit your piece online</li>
                <li>Complimentary courier collection</li>
                <li>Live in the luxury gallery</li>
                <li>Earn on every reservation</li>
              </ul>
            </div>
          </div>
          <div className="text-[11px] text-[#6e6358] italic border-t border-[#efe7da] pt-2">
            Read from the steps below, never typed separately. Tabs follow reader down the page.
          </div>
        </div>
      </section>

      {/* ==================== 03 SHOPPING STEPS & THE LOOP CARD ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showShoppingSteps ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Shopping steps</span>
          <div className="flex items-center gap-2">
            {!showShoppingSteps && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowShoppingSteps(!showShoppingSteps)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shoppingSteps.map(step => (
            <div key={step.num} className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-2">
              <span className="font-mono text-xs text-[#8a6a36] font-bold">{step.num}</span>
              <h3 className="font-serif text-base font-bold text-[#1a1612]">
                {step.title}
              </h3>
              <p className="text-xs text-[#5c5248] leading-relaxed">
                {step.body}
              </p>
              <ul className="pt-2 text-[11px] text-[#6e6358] space-y-1 border-t border-[#efe7da]">
                {step.lines.map((l, lIdx) => (
                  <li key={lIdx} className="flex items-center gap-1.5">
                    <span className="text-[#8a6a36]">·</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The Loop Card (Spec §8.7 Part 03) */}
        {showLoopCard && (
          <div className="p-6 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#8a6a36]" />
                <span className="text-xs font-mono uppercase text-[#8a6a36] font-semibold">The Loop</span>
              </div>
              <h4 className="font-serif text-base font-bold text-[#1a1612]">
                Loved the experience? List your own bridal piece.
              </h4>
              <p className="text-xs text-[#5c5248] max-w-lg">
                After returning your rental, turn your own wardrobe treasures into recurring revenue.
              </p>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-[3px] bg-[#8a6a36] hover:bg-[#70552b] text-white text-xs font-semibold cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              List your piece
            </button>
          </div>
        )}
      </section>

      {/* ==================== 04 TWO WAYS TO SHOP ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showTwoWays ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 Two ways to shop</span>
          <div className="flex items-center gap-2">
            {!showTwoWays && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowTwoWays(!showTwoWays)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rent Column */}
          <div className="p-5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-3">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#efe7db] text-[#8a6a36]">
              Option 1: Rent
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1a1612]">
              For celebrations you want to shine at once
            </h3>
            <p className="text-xs text-[#5c5248] leading-relaxed">
              Standard reservation starts at <FigureToken figure={getFig('rental_period_primary_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_primary_days'} /> with zero dry-cleaning burden.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#8a6a36] hover:underline cursor-pointer">
                Explore rental catalog →
              </span>
            </div>
          </div>

          {/* Buy Preloved Column */}
          <div className="p-5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-3">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[2px] bg-[#efe7db] text-[#8a6a36]">
              Option 2: Buy Preloved
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1a1612]">
              For heirloom pieces you wish to own forever
            </h3>
            <p className="text-xs text-[#5c5248] leading-relaxed">
              Archival pieces authenticated and dry-cleaned, delivered to your permanent wardrobe with no return obligations.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#8a6a36] hover:underline cursor-pointer">
                Shop preloved collection →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 05 THE CRAFT DIVIDER ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showCraftDivider ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 The Craft divider</span>
          <div className="flex items-center gap-2">
            {!showCraftDivider && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowCraftDivider(!showCraftDivider)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-8 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/30 text-center space-y-6">
          <blockquote className="font-serif text-lg md:text-xl italic text-[#1a1612] max-w-xl mx-auto">
            “Every thread in our care is treated with ancestral reverence. Luxury is how things are treated when nobody is watching.”
          </blockquote>

          {/* Three Figures from Register (Spec §8.7 Part 05) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#efe7da]">
            <div className="space-y-0.5">
              <div className="font-serif text-xl font-bold text-[#1a1612]">
                <FigureToken figure={getFig('delivery_free_threshold_inr')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'delivery_free_threshold_inr'} />
              </div>
              <span className="text-[11px] text-[#6e6358]">Free courier delivery from</span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif text-xl font-bold text-[#1a1612]">
                <FigureToken figure={getFig('reach_support_sla_minutes')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'reach_support_sla_minutes'} />
              </div>
              <span className="text-[11px] text-[#6e6358]">Stylist response SLA</span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif text-xl font-bold text-[#1a1612]">
                100%
              </div>
              <span className="text-[11px] text-[#6e6358]">Double dry-cleaning protocol</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 06 LIST & EARN ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showListEarn ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 List & Earn</span>
          <div className="flex items-center gap-2">
            {!showListEarn && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowListEarn(!showListEarn)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-[#1a1612]">
            Turn your bridal wardrobe into recurring revenue
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listerSteps.map(step => (
              <div key={step.num} className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#8a6a36]">{step.num}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#f7f2ea] text-[#8a6a36]">
                    {step.pill}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#1a1612]">
                  {step.title}
                </h4>
                <p className="text-xs text-[#5c5248] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 07 GOOD TO KNOW ==================== */}
      <section className={`space-y-4 pt-6 border-t border-[#efe7da] ${!showGoodToKnow ? 'opacity-40 bg-[#f7f2ea] p-4 rounded-[4px]' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Good to Know</span>
          <div className="flex items-center gap-2">
            {!showGoodToKnow && <span className="text-[#6e6358]">Hidden on page</span>}
            <button
              onClick={() => setShowGoodToKnow(!showGoodToKnow)}
              className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {goodToKnowCards.map((card, idx) => (
            <div key={idx} className="p-3.5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1 hover:border-[#8a6a36] transition-colors">
              <h4 className="font-serif text-sm font-bold text-[#1a1612]">
                {card.title}
              </h4>
              <p className="text-[11px] text-[#5c5248] leading-relaxed">
                {card.body}
              </p>
              <div className="pt-1 text-[11px] text-[#8a6a36] font-medium flex items-center gap-1 cursor-pointer">
                <span>Read policy</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
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
            Answers picked from Help & FAQs and the Seller Guidelines (Nothing is written twice):
          </span>
          <ul className="list-disc list-inside text-[#5c5248] space-y-1">
            <li>A001: What is House of Kiara?</li>
            <li>A002: What is the difference between renting and buying preloved?</li>
            <li>A003: How do you keep every piece clean and hygienic?</li>
            <li>A025: When is the security deposit returned?</li>
            <li>S004: How are garment damages evaluated upon return?</li>
            <li>S012: When do lister rental payouts get processed?</li>
          </ul>
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
            Ready to experience House of Kiara?
          </h2>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold cursor-pointer">
              Browse the Collection
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer">
              List Your Piece
            </span>
          </div>
          <div className="pt-3 text-[11px] text-[#b4a99e] flex items-center justify-center gap-1.5">
            <Instagram className="w-3.5 h-3.5 text-[#c9a96e]" />
            <span>@houseofkairaofficial</span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default HowItWorksPaper;