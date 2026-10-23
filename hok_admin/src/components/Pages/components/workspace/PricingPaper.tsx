/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PricingPaper (Spec §8.16, Screens 55–56, Pages 44–46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Printer
} from 'lucide-react';

interface PricingPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const PricingPaper: React.FC<PricingPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  const [activeSide, setActiveSide] = useState<'pay' | 'earn'>('pay');
  const [activeExampleTab, setActiveExampleTab] = useState<'rental' | 'preloved'>('rental');
  const [selectedRentalChoice, setSelectedRentalChoice] = useState<'3days' | '3days_plus1' | '7days'>('3days');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'pay-1': true,
    'earn-1': true
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'pricing',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Popular questions for hero (Spec §8.16 Part 01)
  const popularQuestions = [
    'What is included in the rental price?',
    'How is GST calculated on rentals and preloved?',
    'When do I get my security deposit back?',
    'How much does a lister earn per rental?'
  ];

  // Dynamic calculations for worked examples (Spec §8.16 Part 05, Screen 56)
  // Window duration values
  const baseRentalWindowDays = 3;
  const extraDays = selectedRentalChoice === '3days_plus1' ? 1 : selectedRentalChoice === '7days' ? 4 : 0;
  const totalRentalDays = baseRentalWindowDays + extraDays;
  const dailyRate = 3500;
  const rentalBaseAmount = 10500;
  const extraDaysAmount = extraDays * dailyRate;
  const rentalSubtotal = rentalBaseAmount + extraDaysAmount;
  const gstRate = 0.18; // 18% token
  const rentalGst = Math.round(rentalSubtotal * gstRate);
  const deliveryThreshold = 10000;
  const rentalDelivery = rentalSubtotal >= deliveryThreshold ? 0 : 350;
  const totalRentalPayable = rentalSubtotal + rentalGst + rentalDelivery;
  const securityDepositHold = 15000;

  // Preloved calculation
  const prelovedListedPrice = 42000;
  const prelovedDiscount = 4000;
  const prelovedPayable = prelovedListedPrice - prelovedDiscount;

  // Ledger data for "What you pay" (Spec §8.16 Part 03, Screen 55)
  const payLedgerRows = [
    {
      charge: 'Rental fee',
      rental: 'Per 3 day or 7 day window',
      preloved: 'Not applicable',
      notes: 'Includes specialist cleaning and minor wear protection'
    },
    {
      charge: 'Preloved purchase price',
      rental: 'Not applicable',
      preloved: 'Full ownership price',
      notes: 'Authenticity verified by our specialist curators'
    },
    {
      charge: 'Security deposit',
      rental: 'Pre-auth card hold (refundable)',
      preloved: 'Zero deposit',
      notes: 'Released within 24 to 48 hours after return inspection'
    },
    {
      charge: 'Goods & Services Tax (GST)',
      rental: '18% on rental fee',
      preloved: 'Apparel rate included',
      notes: 'Separated on official tax invoice'
    },
    {
      charge: 'Standard delivery',
      rental: 'Complimentary over ₹10,000 (else ₹350)',
      preloved: 'Complimentary over ₹10,000 (else ₹350)',
      notes: 'Tracked two-way courier transit with signature verification'
    },
    {
      charge: 'Return courier collection',
      rental: 'Always complimentary',
      preloved: 'Not applicable',
      notes: 'Collected from your address on final day of rental'
    },
    {
      charge: 'Cleaning & hygiene',
      rental: 'Complimentary before and after',
      preloved: 'Cleaned before dispatch',
      notes: 'Specialist ecological dry cleaning'
    },
    {
      charge: 'Cancellation fee',
      rental: 'Free up to 14 days before start',
      preloved: 'Before dispatch only',
      notes: '100% refund to original payment method'
    }
  ];

  // Ledger data for "What you earn" (Spec §8.16 Part 03)
  const earnLedgerRows = [
    {
      item: 'Rental payout',
      youReceive: 'Agreed percentage of rental fee',
      role: 'Platform manages clients and logistics',
      notes: 'Transferred within 3 business days of completed return'
    },
    {
      item: 'Preloved sale payout',
      youReceive: 'Agreed percentage of final sale price',
      role: 'We photograph, curate and verify buyer',
      notes: 'Transferred upon successful delivery and buyer trial'
    },
    {
      item: 'Cleaning & hygiene',
      youReceive: 'Zero cost to you',
      role: 'House of Kaira manages specialist cleaning',
      notes: 'Maintained to couture grade between celebrations'
    },
    {
      item: 'Courier collection & transit',
      youReceive: 'Complimentary collection and return',
      role: 'Insured courier with tamper-evident seals',
      notes: 'Collected from your door and brought back anytime'
    },
    {
      item: 'Damage protection',
      youReceive: 'Protected up to Replacement Value',
      role: 'We repair couture or reimburse replacement',
      notes: 'Never deducted from your rental earnings'
    },
    {
      item: 'Listing & photography',
      youReceive: 'Zero upfront fees',
      role: 'Studio photography, measurements, condition notes',
      notes: 'You only share earnings when your piece books'
    }
  ];

  // Section list (Spec §8.16 Part 06, 13 sections total)
  const paySections = [
    {
      id: 'pay-1',
      num: '1',
      title: 'The rental fee and rental duration',
      body: 'Your rental fee covers your piece for the entire selected window, starting the morning your delivery arrives and ending the afternoon your courier picks it up. Every rental includes specialist dry cleaning before dispatch and after return, minor wear protection, and luxury packaging.'
    },
    {
      id: 'pay-2',
      num: '2',
      title: 'Security deposits and pre-authorisation holds',
      body: 'For rental pieces, a security deposit is held on your card as a temporary pre-authorisation hold, not an upfront debit. The hold is placed 24 hours before dispatch and released within 24 to 48 hours after our curation team completes the return quality inspection.'
    },
    {
      id: 'pay-3',
      num: '3',
      title: 'Goods and Services Tax (GST) breakdown',
      body: 'In accordance with Indian tax regulations, rental of designer goods is categorized as a supply of service subject to 18% GST. For preloved sales, applicable apparel tax is included in the listed price. A complete GST tax invoice is emailed upon order confirmation.'
    },
    {
      id: 'pay-4',
      num: '4',
      title: 'Delivery, express shipping and cutoff times',
      body: 'Standard delivery is complimentary on all orders above ₹10,000, or ₹350 for smaller orders. Express delivery is available in major metro cities for orders placed before 1:00 PM IST on business days.'
    },
    {
      id: 'pay-5',
      num: '5',
      title: 'Cancellations and event date adjustments',
      body: 'You may cancel your rental reservation free of charge up to 14 days before your scheduled start date for a 100% refund. Cancellations between 7 and 13 days receive a 50% refund or full store credit. Cancellations within 6 days are non-refundable as the piece has already entered preparation.'
    },
    {
      id: 'pay-6',
      num: '6',
      title: 'Late returns and rental extensions',
      body: 'If you wish to keep your piece longer, please request an extension at least 24 hours before your scheduled return. Unscheduled late returns incur the standard daily rental rate plus a 10% late coordination charge.'
    },
    {
      id: 'pay-7',
      num: '7',
      title: 'Minor wear versus significant damage',
      body: 'Normal wear such as minor hem dust, loose sequins, or superficial makeup dust is fully covered by House of Kaira and never charged. Significant damage requiring panel reconstruction, deep fabric tears, or loss is deducted from the deposit up to the confirmed Replacement Value.'
    }
  ];

  const earnSections = [
    {
      id: 'earn-1',
      num: '8',
      title: 'Lister commission and payout timeline',
      body: 'Lister shares are agreed individually for each piece based on designer pedigree, retail value, and condition. Payouts are transferred directly to your verified bank account within 3 business days of the piece completing its rental inspection.'
    },
    {
      id: 'earn-2',
      num: '9',
      title: 'Setting prices and Replacement Values',
      body: 'Our curation team provides recommended rental and preloved sale prices based on historical demand and current designer collections. Together, we establish an agreed Replacement Value that sets the maximum protection coverage for your piece.'
    },
    {
      id: 'earn-3',
      num: '10',
      title: 'Studio photography, cleaning and garment care',
      body: 'We handle all styling, studio photography, detailed measurements, and condition cataloguing at zero upfront cost to you. Specialist dry cleaning and archival storage between celebrations are completely managed by House of Kaira.'
    },
    {
      id: 'earn-4',
      num: '11',
      title: 'Insured logistics and courier transit',
      body: 'Every journey your piece takes is booked with premium couriers in tamper-evident, climate-controlled packaging and covered by door-to-door transit insurance.'
    },
    {
      id: 'earn-5',
      num: '12',
      title: 'Piece protection and damage protocol',
      body: 'If a piece is damaged during a rental, House of Kaira takes responsibility for professional couture restoration. If unrepairable, you receive compensation up to the agreed Replacement Value. We never deduct restoration costs from your earnings.'
    },
    {
      id: 'earn-6',
      num: '13',
      title: 'Payouts, TDS certificates and tax statements',
      body: 'Payout statements detailing booking dates, rental amounts, platform shares, and statutory tax deductions are emailed monthly. Form 16A TDS certificates are issued quarterly in compliance with Indian income tax rules.'
    }
  ];

  return (
    <article className="relative w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* 01 Hero (Spec §8.16 Part 01) */}
      <section className="space-y-4 border-b border-[#e6dccb] pb-8">
        <div className="text-[11px] font-mono tracking-widest uppercase text-[#8a6a36]">
          Pricing & fees
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#1a1612] tracking-tight leading-snug">
          Every charge, explained{' '}
          <span className="italic text-[#8a6a36]">clearly.</span>
        </h1>
        <p className="text-sm md:text-base text-[#6e6358] max-w-2xl leading-relaxed">
          Everything you pay as a shopper, and everything you earn as a lister, laid out with no hidden additions.
        </p>

        {/* Search Box */}
        <div className="pt-2 max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8a6a36] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search charges, GST, deposits or payouts..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d9ccb6] rounded-[2px] text-xs md:text-sm text-[#1a1612] placeholder-[#a69888] focus:outline-none focus:border-[#8a6a36]"
            />
          </div>

          {/* Popular Questions Picks */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[#6e6358]">
            <span className="text-[11px] uppercase tracking-wider text-[#8a6a36] mr-1">Popular:</span>
            {popularQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(q)}
                className="px-2.5 py-1 bg-[#f7f2ea] hover:bg-[#ede4d4] border border-[#e6dccb] rounded-full text-xs text-[#1a1612] transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 02 Two Sides: What you pay vs What you earn (Spec §8.16 Part 02) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dccb] pb-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-[#8a6a36]">Choose your side</div>
            <h2 className="font-serif text-2xl text-[#1a1612] tracking-tight">
              {activeSide === 'pay' ? 'What you pay (Shopper)' : 'What you earn (Lister)'}
            </h2>
          </div>

          {/* Toggle pill buttons */}
          <div className="inline-flex p-1 bg-[#f2ebd9] rounded-[3px] border border-[#d9ccb6] self-start sm:self-auto">
            <button
              onClick={() => setActiveSide('pay')}
              className={`px-4 py-1.5 rounded-[2px] text-xs font-medium transition-all cursor-pointer ${
                activeSide === 'pay'
                  ? 'bg-white text-[#1a1612] shadow-xs'
                  : 'text-[#6e6358] hover:text-[#1a1612]'
              }`}
            >
              What you pay
            </button>
            <button
              onClick={() => setActiveSide('earn')}
              className={`px-4 py-1.5 rounded-[2px] text-xs font-medium transition-all cursor-pointer ${
                activeSide === 'earn'
                  ? 'bg-white text-[#1a1612] shadow-xs'
                  : 'text-[#6e6358] hover:text-[#1a1612]'
              }`}
            >
              What you earn
            </button>
          </div>
        </div>

        {/* 04 Opening Paragraph (Spec §8.16 Part 04) */}
        <p className="text-sm md:text-base text-[#4a4036] leading-relaxed italic font-serif">
          {activeSide === 'pay'
            ? 'Every price you see on House of Kaira is honest and transparent. There are never any surprise platform fees or checkout additions added at the last moment.'
            : 'As a lister, you earn from pieces resting in your wardrobe while they celebrate again. We handle every courier, cleaning, inspection and client conversation.'}
        </p>

        {/* 03 At a glance: Fee Ledger Table (Spec §8.16 Part 03, Screen 55) */}
        <div className="space-y-3">
          <div className="text-xs font-mono tracking-wider uppercase text-[#8a6a36]">
            Fee ledger at a glance
          </div>

          {activeSide === 'pay' ? (
            <div className="overflow-x-auto border border-[#d9ccb6] rounded-[2px] bg-white">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f7f2ea] border-b border-[#d9ccb6] text-[#8a6a36] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4 font-semibold">Charge</th>
                    <th className="py-2.5 px-4 font-semibold">Rental</th>
                    <th className="py-2.5 px-4 font-semibold">Preloved buying</th>
                    <th className="py-2.5 px-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dccb] text-[#1a1612]">
                  {payLedgerRows.map((r, i) => (
                    <tr key={i} className="hover:bg-[#fcfaf7] transition-colors">
                      <td className="py-2.5 px-4 font-medium">{r.charge}</td>
                      <td className="py-2.5 px-4 text-[#4a4036]">
                        {r.charge === 'Goods & Services Tax (GST)' ? (
                          <span>
                            <FigureToken
                              figure={getFig('gst_rental')}
                              onSelect={onSelectFigure}
                              isSelected={selectedFigureKey === 'gst_rental'}
                            />{' '}
                            on rental fee
                          </span>
                        ) : r.charge === 'Rental fee' ? (
                          <span>
                            Per{' '}
                            <FigureToken
                              figure={getFig('window_standard')}
                              onSelect={onSelectFigure}
                              isSelected={selectedFigureKey === 'window_standard'}
                            />{' '}
                            or{' '}
                            <FigureToken
                              figure={getFig('window_extended')}
                              onSelect={onSelectFigure}
                              isSelected={selectedFigureKey === 'window_extended'}
                            />{' '}
                            window
                          </span>
                        ) : (
                          r.rental
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[#4a4036]">{r.preloved}</td>
                      <td className="py-2.5 px-4 text-[#6e6358] text-xs">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#d9ccb6] rounded-[2px] bg-white">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#f7f2ea] border-b border-[#d9ccb6] text-[#8a6a36] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4 font-semibold">Item</th>
                    <th className="py-2.5 px-4 font-semibold">You receive</th>
                    <th className="py-2.5 px-4 font-semibold">Platform role</th>
                    <th className="py-2.5 px-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dccb] text-[#1a1612]">
                  {earnLedgerRows.map((r, i) => (
                    <tr key={i} className="hover:bg-[#fcfaf7] transition-colors">
                      <td className="py-2.5 px-4 font-medium">{r.item}</td>
                      <td className="py-2.5 px-4 text-[#4a4036]">{r.youReceive}</td>
                      <td className="py-2.5 px-4 text-[#4a4036]">{r.role}</td>
                      <td className="py-2.5 px-4 text-[#6e6358] text-xs">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-[11px] text-[#6e6358] italic pt-1">
            No lister share is printed in public: shares are agreed individually with each owner upon review of their piece.
          </div>
        </div>
      </section>

      {/* 05 Worked Examples Card (Spec §8.16 Part 05, Screen 56) */}
      <section className="p-6 md:p-8 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[3px] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6dccb] pb-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-[#8a6a36] flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-[#8a6a36]" />
              <span>Worked examples</span>
            </div>
            <h3 className="font-serif text-xl md:text-2xl text-[#1a1612]">
              An order added up line by line
            </h3>
            <p className="text-xs text-[#6e6358] mt-0.5">
              The amounts are worked out, never typed.
            </p>
          </div>

          {/* Example Tabs */}
          <div className="inline-flex p-1 bg-[#ede4d4] rounded-[3px] border border-[#d9ccb6] self-start sm:self-auto">
            <button
              onClick={() => setActiveExampleTab('rental')}
              className={`px-3.5 py-1 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
                activeExampleTab === 'rental'
                  ? 'bg-white text-[#1a1612] shadow-xs'
                  : 'text-[#6e6358] hover:text-[#1a1612]'
              }`}
            >
              A rental
            </button>
            <button
              onClick={() => setActiveExampleTab('preloved')}
              className={`px-3.5 py-1 text-xs font-medium rounded-[2px] transition-all cursor-pointer ${
                activeExampleTab === 'preloved'
                  ? 'bg-white text-[#1a1612] shadow-xs'
                  : 'text-[#6e6358] hover:text-[#1a1612]'
              }`}
            >
              A preloved piece
            </button>
          </div>
        </div>

        {activeExampleTab === 'rental' ? (
          <div className="space-y-5">
            {/* Opening line with grey figure tokens (Spec §8.16 Part 05) */}
            <p className="text-xs md:text-sm text-[#4a4036] leading-relaxed">
              An example for a{' '}
              <span className="font-mono text-xs px-1.5 py-0.5 bg-[#ede4d4] text-[#1a1612] rounded">
                <FigureToken
                  figure={getFig('window_standard')}
                  onSelect={onSelectFigure}
                  isSelected={selectedFigureKey === 'window_standard'}
                />
              </span>{' '}
              rental of a designer lehenga with a{' '}
              <span className="font-mono text-xs px-1.5 py-0.5 bg-[#ede4d4] text-[#1a1612] rounded">
                ₹3,500/day
              </span>{' '}
              daily rate and a{' '}
              <span className="font-mono text-xs px-1.5 py-0.5 bg-[#ede4d4] text-[#1a1612] rounded">
                <FigureToken
                  figure={getFig('inspect_within')}
                  onSelect={onSelectFigure}
                  isSelected={selectedFigureKey === 'inspect_within'}
                />
              </span>{' '}
              quality inspection turnaround.
            </p>

            {/* Duration choice buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#6e6358] font-medium mr-1">Rental choice:</span>
              <button
                onClick={() => setSelectedRentalChoice('3days')}
                className={`px-3 py-1 rounded-[2px] border text-xs cursor-pointer transition-colors ${
                  selectedRentalChoice === '3days'
                    ? 'bg-[#8a6a36] text-white border-[#8a6a36]'
                    : 'bg-white text-[#1a1612] border-[#d9ccb6] hover:bg-[#f7f2ea]'
                }`}
              >
                Standard 3 days
              </button>
              <button
                onClick={() => setSelectedRentalChoice('3days_plus1')}
                className={`px-3 py-1 rounded-[2px] border text-xs cursor-pointer transition-colors ${
                  selectedRentalChoice === '3days_plus1'
                    ? 'bg-[#8a6a36] text-white border-[#8a6a36]'
                    : 'bg-white text-[#1a1612] border-[#d9ccb6] hover:bg-[#f7f2ea]'
                }`}
              >
                3 days + 1 extra day
              </button>
              <button
                onClick={() => setSelectedRentalChoice('7days')}
                className={`px-3 py-1 rounded-[2px] border text-xs cursor-pointer transition-colors ${
                  selectedRentalChoice === '7days'
                    ? 'bg-[#8a6a36] text-white border-[#8a6a36]'
                    : 'bg-white text-[#1a1612] border-[#d9ccb6] hover:bg-[#f7f2ea]'
                }`}
              >
                Extended 7 days
              </button>
            </div>

            {/* Statement lines */}
            <div className="bg-white border border-[#d9ccb6] rounded-[2px] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#1a1612]">
                <span>Rental fee ({totalRentalDays} days window)</span>
                <span>₹{rentalBaseAmount.toLocaleString('en-IN')}</span>
              </div>
              {extraDays > 0 && (
                <div className="flex items-center justify-between text-[#1a1612]">
                  <span>{extraDays} extra day(s) at ₹{dailyRate.toLocaleString('en-IN')}/day</span>
                  <span>+₹{extraDaysAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#6e6358] border-t border-[#e6dccb] pt-2">
                <span>Rental subtotal</span>
                <span>₹{rentalSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#6e6358]">
                <span>GST (18% on rental of goods)</span>
                <span>+₹{rentalGst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#6e6358]">
                <span>Delivery (Standard courier)</span>
                <span>{rentalDelivery === 0 ? 'Complimentary' : `₹${rentalDelivery}`}</span>
              </div>
              <div className="flex items-center justify-between text-[#1a1612] font-semibold text-sm border-t-2 border-[#1a1612] pt-2">
                <span>Total charged at booking</span>
                <span className="text-[#8a6a36]">₹{totalRentalPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-4 p-3 bg-[#f7f2ea] border border-[#e6dccb] rounded text-xs space-y-1 text-[#4a4036]">
                <div className="flex items-center justify-between font-medium text-[#1a1612]">
                  <span>Security deposit hold (not an upfront charge)</span>
                  <span>₹{securityDepositHold.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-[#6e6358] leading-normal">
                  Held on your card 24 hours before dispatch. Released within 24 to 48 hours of return inspection.
                </div>
              </div>
            </div>

            <p className="text-xs text-[#6e6358] italic">
              Daily late fee applies only if return is delayed beyond the scheduled courier pickup window.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Preloved opening line */}
            <p className="text-xs md:text-sm text-[#4a4036] leading-relaxed">
              An example for purchasing a verified preloved designer saree with a listed price of{' '}
              <span className="font-mono text-xs px-1.5 py-0.5 bg-[#ede4d4] text-[#1a1612] rounded">
                ₹{prelovedListedPrice.toLocaleString('en-IN')}
              </span>{' '}
              and an accepted offer of{' '}
              <span className="font-mono text-xs px-1.5 py-0.5 bg-[#ede4d4] text-[#1a1612] rounded">
                ₹{prelovedPayable.toLocaleString('en-IN')}
              </span>.
            </p>

            {/* Statement lines */}
            <div className="bg-white border border-[#d9ccb6] rounded-[2px] p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#1a1612]">
                <span>Original listed price</span>
                <span>₹{prelovedListedPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#0e6245]">
                <span>Accepted offer adjustment</span>
                <span>-₹{prelovedDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#6e6358] border-t border-[#e6dccb] pt-2">
                <span>Agreed purchase price</span>
                <span>₹{prelovedPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#6e6358]">
                <span>Applicable apparel GST</span>
                <span>Included in price</span>
              </div>
              <div className="flex items-center justify-between text-[#6e6358]">
                <span>Delivery (Pan India insured)</span>
                <span>Complimentary</span>
              </div>
              <div className="flex items-center justify-between text-[#1a1612] font-semibold text-sm border-t-2 border-[#1a1612] pt-2">
                <span>Total charged at checkout</span>
                <span className="text-[#8a6a36]">₹{prelovedPayable.toLocaleString('en-IN')}</span>
              </div>
              <div className="mt-4 p-3 bg-[#f7f2ea] border border-[#e6dccb] rounded text-xs space-y-1 text-[#4a4036]">
                <div className="flex items-center justify-between font-medium text-[#1a1612]">
                  <span>Security deposit</span>
                  <span>₹0 (None required)</span>
                </div>
                <div className="text-[11px] text-[#6e6358] leading-normal">
                  Preloved purchases require zero security deposit. You have a 48-hour condition verification period upon delivery.
                </div>
              </div>
            </div>

            <p className="text-xs text-[#6e6358] italic">
              Preloved pieces are final sale after our 48-hour authenticity and condition verification window.
            </p>
          </div>
        )}
      </section>

      {/* 06 Sections & 07 Answers (Spec §8.16 Part 06 & 07) */}
      <section className="space-y-6">
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-[#8a6a36]">
            Detailed sections ({activeSide === 'pay' ? 'What you pay' : 'What you earn'})
          </div>
          <h3 className="font-serif text-2xl text-[#1a1612] tracking-tight">
            {activeSide === 'pay' ? 'Questions on shopper charges' : 'Questions on lister earnings'}
          </h3>
        </div>

        <div className="space-y-3">
          {(activeSide === 'pay' ? paySections : earnSections).map(sec => {
            const isOpen = openSections[sec.id];
            return (
              <div
                key={sec.id}
                className="border border-[#e6dccb] rounded-[2px] overflow-hidden bg-white transition-shadow hover:shadow-xs"
              >
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-4 bg-[#fcfaf7] hover:bg-[#f7f2ea] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#f2ebd9] text-[#8a6a36] font-mono text-xs flex items-center justify-center font-semibold">
                      {sec.num}
                    </span>
                    <span className="font-serif text-base text-[#1a1612] font-medium">
                      {sec.title}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8a6a36] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8a6a36] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-3 border-t border-[#e6dccb] text-xs md:text-sm text-[#4a4036] leading-relaxed space-y-2">
                    <p>{sec.body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Crossing sides band (Spec §8.16 Part 06) */}
        <div className="p-4 bg-[#f7f2ea] border border-[#d9ccb6] rounded-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-[#4a4036]">
            {activeSide === 'pay'
              ? 'Curious what you could earn by renting or selling your own designer pieces?'
              : 'Looking for details on renting or purchasing preloved pieces instead?'}
          </span>
          <button
            onClick={() => setActiveSide(activeSide === 'pay' ? 'earn' : 'pay')}
            className="text-[#8a6a36] font-semibold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>{activeSide === 'pay' ? 'Switch to What you earn' : 'Switch to What you pay'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 08 Related Policies (Spec §8.16 Part 08) */}
      <section className="pt-6 border-t border-[#e6dccb] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[#6e6358]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-[#1a1612]">Related policies:</span>
            <a href="/terms" className="text-[#8a6a36] hover:underline">Terms & Conditions</a>
            <span>·</span>
            <a href="/refunds" className="text-[#8a6a36] hover:underline">Refund Policy</a>
            <span>·</span>
            <a href="/deposit" className="text-[#8a6a36] hover:underline">Deposit Policy</a>
            <span>·</span>
            <a href="/care-policy" className="text-[#8a6a36] hover:underline">Care Policy</a>
            <span>·</span>
            <a href="/shipping-policy" className="text-[#8a6a36] hover:underline">Shipping Policy</a>
            <span>·</span>
            <a href="/seller-guidelines" className="text-[#8a6a36] hover:underline">Seller Guidelines</a>
            <span>·</span>
            <a href="/faqs" className="text-[#8a6a36] hover:underline">Help & FAQs</a>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-[#8a6a36] hover:underline cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print this fee schedule</span>
          </button>
        </div>

        <div className="text-[11px] text-[#8a8075] italic">
          Last reviewed 18 October 2026. Stamped when published. Reviewed quarterly by Platform & Legal.
        </div>
      </section>

      {/* 09 A question: Closing dark band (Spec §8.16 Part 09) */}
      <section className="p-8 md:p-10 bg-[#1a1612] text-[#fffefb] rounded-[2px] space-y-6">
        <div className="space-y-2">
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#c4a265]">
            Have a question about a charge?
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-white tracking-tight">
            We are here to walk through every calculation.
          </h3>
          <p className="text-xs md:text-sm text-[#b8afa5] max-w-xl leading-relaxed">
            If a line on your invoice or statement is unclear, message our concierge team on WhatsApp or email.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://wa.me/919340139300"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8a6a36] hover:bg-[#72572c] text-white text-xs font-medium rounded-[2px] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href="mailto:concierge@houseofkiara.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium rounded-[2px] transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email concierge</span>
          </a>
        </div>

        <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#b8afa5]">
          <div>
            <div className="text-white font-medium mb-0.5">Concierge WhatsApp</div>
            <div className="font-mono text-[#c4a265]">+91 93401 39300</div>
          </div>
          <div>
            <div className="text-white font-medium mb-0.5">Client accounts desk</div>
            <div>billing@houseofkiara.com</div>
          </div>
          <div>
            <div className="text-white font-medium mb-0.5">Operating hours</div>
            <div>Monday to Saturday, 10:00 to 19:00 IST</div>
          </div>
        </div>
      </section>
    </article>
  );
};
