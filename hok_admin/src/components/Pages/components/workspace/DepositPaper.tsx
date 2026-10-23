/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: DepositPaper (Spec §8.13, Screen 51, Pages 39–40)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  DEPOSIT_POPULAR_LINKS,
  DEPOSIT_TRACKER_STEPS,
  DEPOSIT_GLANCE_ROWS,
  DEPOSIT_SECTIONS
} from '../../data/contentRegistries/deposit/depositRegistry.js';
import { Search, ChevronRight, MessageSquare, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2, Calculator } from 'lucide-react';

interface DepositPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const DepositPaper: React.FC<DepositPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Worked example tab state (§8.13 Part 05, Screen 51)
  const [exampleTab, setExampleTab] = useState<'ontime' | 'late' | 'damage' | 'lost'>('ontime');

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'deposit',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  // Worked example baseline numbers (Spec §8.13: shown in grey)
  const examplePiece = 'Sabyasachi Heritage Crimson Lehenga';
  const exampleRentalDays = 4;
  const exampleDailyRate = 6000;
  const exampleDepositHeld = 25000;
  const exampleRestorationCost = 3500;
  const exampleReplacementValue = 180000;

  // Compute worked example amounts dynamically
  const getWorkedExampleStatement = () => {
    switch (exampleTab) {
      case 'ontime':
        return {
          tabTitle: 'Returned on time and in good care',
          deductions: 0,
          returnedAmount: exampleDepositHeld,
          explanation: 'Your garment arrived by the agreed Return Date and passed studio inspection with flying colors.',
          statementLines: [
            { label: 'Security deposit held', amount: `₹${exampleDepositHeld.toLocaleString()}` },
            { label: 'Deductions for late return', amount: '₹0' },
            { label: 'Deductions for normal wear', amount: '₹0 (Always on us)' },
            { label: 'Total refunded to original payment mode', amount: `₹${exampleDepositHeld.toLocaleString()}`, isTotal: true }
          ]
        };
      case 'late':
        const lateDays = 1;
        const lateFee = exampleDailyRate * lateDays;
        return {
          tabTitle: 'One day late return',
          deductions: lateFee,
          returnedAmount: exampleDepositHeld - lateFee,
          explanation: 'A late return incurs one standard day’s rental fee for each day beyond the scheduled courier handoff.',
          statementLines: [
            { label: 'Security deposit held', amount: `₹${exampleDepositHeld.toLocaleString()}` },
            { label: 'Late return fee (1 day @ ₹6,000/day)', amount: `-₹${lateFee.toLocaleString()}` },
            { label: 'Inspection status', amount: 'Passed (No damage)' },
            { label: 'Total refunded to original payment mode', amount: `₹${(exampleDepositHeld - lateFee).toLocaleString()}`, isTotal: true }
          ]
        };
      case 'damage':
        return {
          tabTitle: 'Repairable damage requiring specialist restoration',
          deductions: exampleRestorationCost,
          returnedAmount: exampleDepositHeld - exampleRestorationCost,
          explanation: 'Accidental tear requiring master zardozi restoration. Evaluated transparently at actual artisan atelier cost.',
          statementLines: [
            { label: 'Security deposit held', amount: `₹${exampleDepositHeld.toLocaleString()}` },
            { label: 'Specialist embroidery restoration cost', amount: `-₹${exampleRestorationCost.toLocaleString()}` },
            { label: 'Itemized artisan receipt provided', amount: 'Attached to booking' },
            { label: 'Total refunded to original payment mode', amount: `₹${(exampleDepositHeld - exampleRestorationCost).toLocaleString()}`, isTotal: true }
          ]
        };
      case 'lost':
        return {
          tabTitle: 'Lost piece or irreversible total impairment',
          deductions: exampleDepositHeld,
          returnedAmount: 0,
          explanation: 'Piece not returned or permanently destroyed. Deposit retained and formal insurance claim processed.',
          statementLines: [
            { label: 'Security deposit held', amount: `₹${exampleDepositHeld.toLocaleString()}` },
            { label: 'Total impairment recovery deduction', amount: `-₹${exampleDepositHeld.toLocaleString()}` },
            { label: 'Remaining replacement balance', amount: 'Claimed via transit insurance' },
            { label: 'Total refunded to customer', amount: '₹0', isTotal: true }
          ]
        };
    }
  };

  const statement = getWorkedExampleStatement();

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_deposit_policy_v4
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints 28 figures · 0 items to look at</span>
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
            Deposit Transparency
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            Deposit <span className="italic text-[#8a6a36] font-normal">Policy</span>
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            How your refundable security deposit is calculated, held securely, and returned to your original payment account after inspection.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl pt-1">
            <div className="w-full px-4 py-3 rounded-[3px] border border-[#d9ccb6] bg-[#fffefb] text-xs text-[#6e6358] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8a6a36]" />
                <span className="text-[#8c827a]">Search deposit rules, QC windows, and refund timelines...</span>
              </div>
            </div>
          </div>

          {/* Popular Links */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono uppercase text-[#6e6358]">Popular:</span>
            {DEPOSIT_POPULAR_LINKS.map((pl, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-[3px] bg-[#efe7db] text-[#1a1612] text-xs cursor-pointer hover:bg-[#e4dacb] transition-colors"
              >
                {pl.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 02 FIVE STEPS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 Five steps</span>
          <span className="text-[#6e6358]">The Deposit Tracker in My Account</span>
        </div>

        <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
          {DEPOSIT_TRACKER_STEPS.map(step => (
            <div key={step.number} className="p-3.5 flex items-center justify-between gap-4 bg-[#fffefb]">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#f7f2ea] text-[#8a6a36] font-mono font-bold flex items-center justify-center text-xs">
                  {step.number}
                </span>
                <span className="font-semibold text-[#1a1612]">{step.name}</span>
              </div>
              <span className="text-[#5c5248] text-right font-sans">
                {step.timing}
              </span>
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

        <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] text-sm text-[#2c241c] leading-relaxed">
          <p>
            Your security deposit is a fully refundable custody hold that protects our designer partners. It is never a fee, and never a charge for renting. When your piece returns on time and in good care,{' '}
            <strong className="font-serif italic font-normal text-[#8a6a36]">every single rupee is returned to you</strong>.
          </p>
        </div>
      </section>

      {/* ==================== 04 AT A GLANCE ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 At a glance</span>
          <span className="text-[#6e6358]">Summary rows with tags</span>
        </div>

        <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
          {DEPOSIT_GLANCE_ROWS.map((row, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-[#fffefb]">
              <span className="text-[#1a1612] font-medium">{row.text}</span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-[#6b7e5a]/10 text-[#6b7e5a] border border-[#6b7e5a]/30">
                {row.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 05 WORKED EXAMPLE ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Worked example (Screen 51)</span>
          <span className="text-[#6e6358]">Amounts worked out, never typed</span>
        </div>

        <div className="p-6 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/40 space-y-5">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#1a1612]">
              Worked example: Four ways a rental can conclude
            </h3>
            <p className="text-xs text-[#6e6358]">
              Sample garment: <span className="text-[#8a6a36] font-mono">{examplePiece}</span> (Value ₹{exampleReplacementValue.toLocaleString()})
            </p>
          </div>

          {/* Scenario Tabs (Screen 51) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ontime', label: 'Returned on time' },
              { id: 'late', label: 'One day late' },
              { id: 'damage', label: 'Minor damage' },
              { id: 'lost', label: 'Lost / not returned' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setExampleTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-[3px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  exampleTab === tab.id
                    ? 'bg-[#1a1612] text-white font-semibold'
                    : 'bg-[#efe7db] text-[#5c5248] hover:bg-[#e4dacb]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Live Computed Statement Card */}
          <div className="p-5 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#efe7da] pb-3">
              <span className="font-serif text-base font-bold text-[#1a1612]">
                {statement.tabTitle}
              </span>
              <span className="font-mono text-xs text-[#6e6358]">
                Calculation verified
              </span>
            </div>

            <div className="space-y-2">
              {statement.statementLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between py-1.5 ${
                    line.isTotal ? 'border-t-2 border-[#1a1612] pt-2 font-bold text-sm text-[#1a1612]' : 'text-[#5c5248]'
                  }`}
                >
                  <span>{line.label}</span>
                  <span className="font-mono">{line.amount}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#6e6358] italic pt-2 border-t border-[#efe7da]">
              {statement.explanation}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 06 SECTIONS & ANSWERS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 Sections &amp; Answers</span>
          <span className="text-[#6e6358]">9 numbered sections</span>
        </div>

        <div className="space-y-3">
          {DEPOSIT_SECTIONS.map(sec => (
            <div key={sec.id} className="border border-[#e6dccb] rounded-[4px] bg-[#fffefb] p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[#8a6a36]">
                  Section {sec.number} · {sec.barLabel}
                </span>
                <span className="text-xs font-mono text-[#6e6358]">
                  {sec.questions.length} questions
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-[#1a1612]">
                {sec.title}
              </h3>
              <p className="text-xs text-[#5c5248]">
                {sec.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 08 RELATED POLICIES ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>08 Related policies</span>
          <span className="text-[#6e6358]">5 links</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a6a36]">
          <span className="hover:underline cursor-pointer">Terms & Conditions</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Refund & Cancellation Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Care, Cleaning & Damage Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Shipping & Delivery Policy</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">Seller Guidelines</span>
        </div>
        <div className="pt-1 text-[11px] text-[#6e6358]">
          Last reviewed {page.lastPublished}. Version stamped v4.
        </div>
      </section>

      {/* ==================== 09 CAN’T FIND IT ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>09 Can’t find it</span>
          <span className="text-[#6e6358]">Closing band</span>
        </div>

        <div className="p-8 rounded-[4px] bg-[#1a1612] text-white space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#c9a96e]">
            Questions about your deposit?
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Our finance desk in Indore is ready to help
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-xl leading-relaxed">
            Every deposit is reconciled by hand within our quality control window. Message our team directly for status checks.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp finance desk</span>
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Email finance team</span>
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default DepositPaper;