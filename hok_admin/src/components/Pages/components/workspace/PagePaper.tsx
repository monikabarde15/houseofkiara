/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePaper (Spec §7.3, §7.10, §7.11, §8.1 to §8.14)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem, CheckItem } from '../../types';
import { FigureToken } from './FigureToken';
import { FloatingFormatBar } from './FloatingFormatBar';
import { ContactPaper } from './ContactPaper';
import { FaqPaper } from './FaqPaper';
import { AboutPaper } from './AboutPaper';
import { HowItWorksPaper } from './HowItWorksPaper';
import { ListYourPiecePaper } from './ListYourPiecePaper';
import { TermsPaper } from './TermsPaper';
import { RefundsPaper } from './RefundsPaper';
import { DepositPaper } from './DepositPaper';
import { CarePaper } from './CarePaper';
import { ShippingPaper } from './ShippingPaper';
import { PricingPaper } from './PricingPaper';
import { SellerPaper } from './SellerPaper';
import { WaitingPolicyWorkspace } from './WaitingPolicyWorkspace';
import { SEED_FIGURES } from '../../data';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

interface PagePaperProps {
  page: PageCardData;
  figures: FigureItem[];
  checks?: CheckItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
  onPageContentChange?: (updatedSummary: string) => void;
  showMode?: 'changes' | 'live' | 'date';
  selectedDate?: string;
  onResetShowMode?: () => void;
  onSelectCheck?: (check: CheckItem) => void;
}

export const PagePaper: React.FC<PagePaperProps> = ({
  page,
  figures,
  checks = [],
  onSelectFigure,
  selectedFigureKey,
  onPageContentChange,
  showMode = 'changes',
  selectedDate = '20 October 2026',
  onResetShowMode,
  onSelectCheck
}) => {
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    return (
      figures.find(f => f.key === key) ||
      SEED_FIGURES.find(f => f.key === key) || {
        key,
        label: key,
        value: '---',
        displayValue: '---',
        subject: 'brand',
        owner: 'Set here',
        status: 'live',
        reachCount: 1,
        usedOnSlugs: [page.slug],
        format: 'text'
      }
    );
  };

  const handleApplyFormat = (format: 'bold' | 'italic') => {
    setActiveFormat(format);
    setTimeout(() => setActiveFormat(null), 1000);
  };

  const handleInsertFigure = (fig: FigureItem) => {
    onSelectFigure(fig);
  };

  // Route 1: Waiting Policies (§8.1 & Screen 58)
  if (page.slug === '/privacy' || page.slug === '/cookies') {
    return (
      <WaitingPolicyWorkspace
        page={page}
        figures={figures}
        onSelectFigure={onSelectFigure}
      />
    );
  }

  // Route 2: Contact Us (§8.5, Screens 42–43)
  if (page.slug === '/contact') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <ContactPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 3: Help & FAQs (§8.4, Screens 39–41)
  if (page.slug === '/faqs') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <FaqPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 4: About HOK (§8.6, Screens 44–46)
  if (page.slug === '/about') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <AboutPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 5: How It Works (§8.7, Screen 47)
  if (page.slug === '/how-it-works') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <HowItWorksPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 6: List Your Piece (§8.8, Screen 48)
  if (page.slug === '/list-your-piece') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <ListYourPiecePaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 7: Terms & Conditions (§8.9, Screens 49–50)
  if (page.slug === '/terms') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <TermsPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 8: Refund & Cancellation Policy (§8.12, Screens 20, 25)
  if (page.slug === '/refunds') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <RefundsPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 9: Deposit Policy (§8.13, Screen 51)
  if (page.slug === '/deposit' || page.slug === '/deposit-policy') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <DepositPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 10: Care, Cleaning & Damage Policy (§8.14, Screens 52–53)
  if (page.slug === '/care-policy') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <CarePaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 11: Shipping & Delivery Policy (§8.15, Screen 54)
  if (page.slug === '/shipping-policy') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <ShippingPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 12: Pricing & Fees (§8.16, Screens 55–56)
  if (page.slug === '/pricing' || page.slug === '/pricing-fees') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <PricingPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Route 13: Seller Guidelines (§8.17, Screen 57)
  if (page.slug === '/seller-guidelines') {
    return (
      <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
        <FloatingFormatBar
          onApplyFormat={handleApplyFormat}
          onInsertLink={url => console.log('Link inserted:', url)}
          onInsertFigure={handleInsertFigure}
        />

        {showMode === 'date' && (
          <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
            <span className="text-[#1a1612]">
              Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
            </span>
            <button
              onClick={onResetShowMode}
              className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to editing</span>
            </button>
          </div>
        )}

        <SellerPaper
          page={page}
          figures={figures}
          onSelectFigure={onSelectFigure}
          selectedFigureKey={selectedFigureKey}
        />

        <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
          Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
        </div>
      </div>
    );
  }

  // Fallback Route for Other Pages
  const pageChecks = checks.filter(c => c.pageSlug === page.slug);

  return (
    <div className="relative w-full max-w-[760px] mx-auto animate-in fade-in duration-150 space-y-4">
      {/* Floating Formatting Toolbar above Paper (Spec §7.4) */}
      <FloatingFormatBar
        onApplyFormat={handleApplyFormat}
        onInsertLink={url => console.log('Link inserted:', url)}
        onInsertFigure={handleInsertFigure}
      />

      {/* Date Viewing Banner (Spec §7.10, Screen 31) */}
      {showMode === 'date' && (
        <div className="p-3 bg-[#fcfaf7] border border-[#d9ccb6] rounded-[3px] text-xs flex items-center justify-between shadow-xs">
          <span className="text-[#1a1612]">
            Viewing as of <strong>{selectedDate}</strong> · Read only · Nothing on the paper can be typed into.
          </span>
          <button
            onClick={onResetShowMode}
            className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to editing</span>
          </button>
        </div>
      )}

      {/* The Central Paper Document (Spec §7.3) */}
      <article className="relative w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-8 select-text">
        {/* Margin Marks Column (Spec §7.11, Screen 32) */}
        {pageChecks.length > 0 && (
          <aside className="absolute right-3 top-24 bottom-24 w-8 flex flex-col items-center gap-6 pointer-events-auto">
            {pageChecks.map((chk, idx) => (
              <div
                key={chk.id || idx}
                onClick={() => onSelectCheck?.(chk)}
                className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer shadow-xs border transition-transform hover:scale-110 ${
                  chk.severity === 'error'
                    ? 'bg-[#a4512f]/10 border-[#a4512f] text-[#a4512f]'
                    : 'bg-[#8a6a36]/10 border-[#8a6a36] text-[#8a6a36]'
                }`}
                title={`Mark in margin: ${chk.title}`}
              >
                <span className="text-[10px] font-mono font-bold">!</span>
              </div>
            ))}
          </aside>
        )}

        {/* Document Header */}
        <header className="border-b border-[#e6dccb] pb-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6e6358]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
              {page.slug}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
                {page.version}
              </span>
              <span>Published {page.lastPublished}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            {page.title}
          </h1>

          <p className="text-sm text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            {page.summary}
          </p>

          <div className="flex items-center gap-4 pt-2 text-[11px] text-[#6e6358] border-t border-[#efe7da]">
            <span>{page.wordsCount.toLocaleString()} words</span>
            <span>·</span>
            <span>~{page.readingTimeMinutes} min reading time</span>
            <span>·</span>
            <span className="text-[#8a6a36] font-medium font-mono">
              {page.figuresCount} figures bound
            </span>
          </div>
        </header>

        {/* Document Clauses & Content with Embedded Figure Tokens */}
        <div className="space-y-6 text-sm text-[#1a1612] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              1. Commercial Scope and Duration
            </h2>
            <p className="text-[#5c5248]">
              Welcome to <FigureToken figure={getFig('trade_name')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'trade_name'} />. 
              Our luxury rental ecosystem provides verified access to designer couture. Standard reservation durations start at 
              <FigureToken figure={getFig('rental_period_primary_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_primary_days'} />, 
              with extended options available for <FigureToken figure={getFig('rental_period_extended_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_extended_days'} /> for destination weddings and festive ceremonies.
            </p>
            <p className="text-[#5c5248]">
              The rental period begins <FigureToken figure={getFig('rental_period_start_time')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_start_time'} />. 
              All items must be returned during the scheduled courier window of <FigureToken figure={getFig('rental_period_return_cutoff_time')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'rental_period_return_cutoff_time'} /> on the agreed return date.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              2. Security Deposit and Hold Policy
            </h2>
            <p className="text-[#5c5248]">
              To protect our designer partners, every reservation requires a refundable security deposit. The default assessment is 
              <FigureToken figure={getFig('deposit_default_percent')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_default_percent'} />. 
              For high-value couture pieces exceeding retail valuations of ₹1,00,000, a fixed security deposit of 
              <FigureToken figure={getFig('deposit_luxury_tier_inr')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_luxury_tier_inr'} /> applies.
            </p>
            <p className="text-[#5c5248]">
              All deposits are secured via <FigureToken figure={getFig('deposit_hold_mode')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_hold_mode'} />. 
              Following return, our specialist quality team conducts an inspection within <FigureToken figure={getFig('deposit_qc_duration_hours')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_qc_duration_hours'} />. 
              Upon successful clearance, funds are automatically released within <FigureToken figure={getFig('deposit_release_hours_after_qc')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'deposit_release_hours_after_qc'} />.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              3. Cancellation and Refund Guidelines
            </h2>
            <p className="text-[#5c5248]">
              We understand plans change. Customers enjoy a complimentary cancellation grace period of 
              <FigureToken figure={getFig('cancel_free_window_hours')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'cancel_free_window_hours'} /> with zero deduction. 
              Cancellations requested after this window but prior to dispatch incur an inventory lock fee of 
              <FigureToken figure={getFig('cancel_prior_dispatch_fee_percent')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'cancel_prior_dispatch_fee_percent'} />.
            </p>
            <p className="text-[#5c5248]">
              Approved refunds are credited directly to the <FigureToken figure={getFig('refund_mode_original_source')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'refund_mode_original_source'} /> within 
              <FigureToken figure={getFig('refund_processing_business_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'refund_processing_business_days'} /> in accordance with RBI merchant settlement standards.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              4. Dispatch, Shipping & Logistics
            </h2>
            <p className="text-[#5c5248]">
              Deliveries are handled through premier courier networks including <FigureToken figure={getFig('delivery_dispatch_courier_partners')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'delivery_dispatch_courier_partners'} />. 
              Standard transit requires <FigureToken figure={getFig('delivery_dispatch_standard_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'delivery_dispatch_standard_days'} />, 
              while express shipping guarantees arrival in <FigureToken figure={getFig('delivery_dispatch_express_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'delivery_dispatch_express_days'} /> across major metropolitan areas. 
              Orders placed before <FigureToken figure={getFig('delivery_dispatch_same_day_cutoff')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'delivery_dispatch_same_day_cutoff'} /> dispatch the same business day.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2.5">
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              5. Statutory Disclosures and Grievance Redressal
            </h2>
            <p className="text-[#5c5248]">
              House of Kiara operates under statutory compliance with the Consumer Protection Act, 2019, 
              the IT Intermediary Rules, 2021, and the DPDP Act, 2023. 
              Apparel rentals attract GST at <FigureToken figure={getFig('gst_rental')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'gst_rental'} /> under SAC 997326.
            </p>
            <p className="text-[#5c5248]">
              For consumer complaints, contact our Grievance Officer <FigureToken figure={getFig('grievance_name')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'grievance_name'} /> at 
              <FigureToken figure={getFig('grievance_email')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'grievance_email'} />. 
              All grievances are formally addressed within <FigureToken figure={getFig('grievance_resolve')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'grievance_resolve'} />.
            </p>
          </section>
        </div>

        {/* Document Footer */}
        <footer className="pt-8 border-t border-[#e6dccb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6e6358]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#6b7e5a]" />
            <span>Document synchronized with public store template</span>
          </div>
          <div className="font-mono text-[11px] text-[#8a6a36]">
            Legal Entity: {getFig('legal_name').displayValue}
          </div>
        </footer>
      </article>

      {/* Under the paper note (Spec §7.3, Page 17) */}
      <div className="mt-4 text-center text-xs text-[#6e6358] py-2">
        Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
      </div>
    </div>
  );
};

export default PagePaper;