/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: FaqPaper (Spec §8.4, Screens 39–41, Pages 28–29)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FAQ_MOMENTS } from '../../data/contentRegistries/faq/faqRegistry.js';
import { Search, Sparkles, ChevronRight, ShieldCheck, ArrowRight, MessageSquare, Mail, Phone, ExternalLink } from 'lucide-react';

interface FaqPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const FaqPaper: React.FC<FaqPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Active selected moment (§8.4 Part 02)
  const [selectedMomentId, setSelectedMomentId] = useState<string>('before');

  // Currently open answer modal or inline preview (§8.4 Part 04, Screen 41)
  const [openAnswerCode, setOpenAnswerCode] = useState<string | null>('A001');

  // Popular questions (Part 01 picks)
  const popularQuestions = [
    { code: 'A001', q: 'What is House of Kaira?' },
    { code: 'A002', q: 'What is the difference between renting and buying preloved?' },
    { code: 'A003', q: 'How do you keep every piece clean and hygienic?' },
    { code: 'A025', q: 'How does the security deposit work?' }
  ];

  // Most asked customer tab state (Part 05)
  const [mostAskedKind, setMostAskedKind] = useState<'everyone' | 'renting' | 'preloved'>('everyone');

  const activeMoment = FAQ_MOMENTS.find(m => m.id === selectedMomentId) || FAQ_MOMENTS[0];

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Header Info */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug} · hok_faq_v6
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>120 answers · 29 figures · 14 items to look at</span>
          </div>
        </div>
      </header>

      {/* ==================== PART 01: HERO ==================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>01 Hero</span>
          <span className="text-[#6e6358]">Greeting, heading, search box & popular questions</span>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#6e6358]">
            Help & FAQs
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            How can we <span className="italic text-[#8a6a36] font-normal">help you today</span>?
          </h1>

          {/* Search Box */}
          <div className="relative max-w-xl pt-2">
            <div className="w-full px-4 py-3 rounded-[3px] border border-[#d9ccb6] bg-[#fffefb] text-xs text-[#6e6358] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#8a6a36]" />
                <span className="text-[#8c827a]">Search 120 answers, or ask in your own words...</span>
              </div>
            </div>
          </div>

          {/* Popular Questions Picks (4 picks) */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-mono uppercase text-[#6e6358]">Popular:</span>
            {popularQuestions.map(pq => (
              <button
                key={pq.code}
                onClick={() => setOpenAnswerCode(pq.code)}
                className="px-2.5 py-1 rounded-[3px] bg-[#efe7db] hover:bg-[#e4dacb] text-[#1a1612] text-xs transition-colors cursor-pointer"
              >
                {pq.q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PART 02: MOMENTS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 Moments</span>
          <span className="text-[#6e6358]">Six moment cards · Screen 40</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FAQ_MOMENTS.map(moment => {
            const isSelected = moment.id === selectedMomentId;
            return (
              <div
                key={moment.id}
                onClick={() => setSelectedMomentId(moment.id)}
                className={`p-4 rounded-[4px] border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'border-[#8a6a36] bg-[#fcfaf7] shadow-xs'
                    : 'border-[#e6dccb] bg-[#fffefb] hover:border-[#b4a99e]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#6e6358]">
                  <span>{moment.appliesToLabel}</span>
                  <span className="font-semibold text-[#8a6a36]">{moment.answerCount}</span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#1a1612]">
                  {moment.cardTitle}
                </h3>
                <p className="text-[11px] text-[#5c5248] line-clamp-2 leading-relaxed">
                  {moment.subline}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#fcfaf7] rounded-[3px] border border-[#efe7da] text-xs text-[#5c5248] flex items-center justify-between">
          <span>Looking for your order history, sizing notes or security deposit status?</span>
          <span className="font-semibold text-[#8a6a36] hover:underline cursor-pointer">
            Open Your Account →
          </span>
        </div>
      </section>

      {/* ==================== PART 03: HYGIENE PROMISE ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Hygiene promise</span>
          <span className="text-[#6e6358]">Band under the cards</span>
        </div>

        <div className="p-5 rounded-[4px] bg-[#fcfaf7] border border-[#8a6a36]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8a6a36]" />
              <span className="font-serif text-base font-bold text-[#1a1612]">
                Our Hygiene & Care Promise
              </span>
            </div>
            <p className="text-xs text-[#5c5248] max-w-xl leading-relaxed">
              Every rental garment is professionally dry-cleaned twice, steam-sanitized, and inspected under studio lighting before dispatch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpenAnswerCode('A003')}
            className="px-3.5 py-1.5 rounded-[3px] bg-[#1a1612] hover:bg-[#332c25] text-white text-xs font-medium cursor-pointer transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Read how we clean pieces
          </button>
        </div>
      </section>

      {/* ==================== PART 04: ANSWERS ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 Answers</span>
          <span className="text-[#6e6358]">
            {activeMoment.title} · {activeMoment.sections.length} sections
          </span>
        </div>

        <div className="space-y-6">
          {activeMoment.sections.map(sec => (
            <div key={sec.id} className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#efe7da] pb-1.5">
                <h3 className="font-serif text-lg font-bold text-[#1a1612]">
                  {sec.title}
                </h3>
                <span className="text-xs font-mono text-[#6e6358]">
                  {sec.count} answers
                </span>
              </div>

              <div className="divide-y divide-[#efe7da] text-xs">
                {sec.questions.map(q => {
                  const isOpen = openAnswerCode === q.code;
                  return (
                    <div key={q.id} className="py-2.5">
                      <div
                        onClick={() => setOpenAnswerCode(isOpen ? null : q.code)}
                        className="flex items-center justify-between cursor-pointer hover:text-[#8a6a36] transition-colors py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#8a6a36] bg-[#f7f2ea] px-1.5 py-0.5 rounded-[2px]">
                            {q.code}
                          </span>
                          <span className="font-medium text-[#1a1612]">{q.question}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 text-[#6e6358] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      </div>

                      {isOpen && (
                        <div className="mt-2 p-4 rounded-[4px] bg-[#fcfaf7] border border-[#e6dccb] space-y-2 text-xs leading-relaxed text-[#5c5248] animate-in fade-in">
                          {q.answer.paragraphs.map((p, pIdx) => (
                            <p key={pIdx}>{p}</p>
                          ))}
                          <div className="pt-2 text-[10px] font-mono text-[#6e6358] border-t border-[#efe7da] flex items-center justify-between">
                            <span>Applies to: {q.appliesTo}</span>
                            <span>Topic: {q.adminTopic}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PART 05: MOST ASKED ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Most asked</span>
          <span className="text-[#6e6358]">Three lists of five picks in Page settings</span>
        </div>

        <div className="inline-flex rounded-[3px] p-0.5 bg-[#efe7db] border border-[#d9ccb6] text-xs">
          <button
            type="button"
            onClick={() => setMostAskedKind('everyone')}
            className={`px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
              mostAskedKind === 'everyone' ? 'bg-[#fffefb] text-[#1a1612] font-semibold' : 'text-[#6e6358]'
            }`}
          >
            For everyone (5)
          </button>
          <button
            type="button"
            onClick={() => setMostAskedKind('renting')}
            className={`px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
              mostAskedKind === 'renting' ? 'bg-[#fffefb] text-[#1a1612] font-semibold' : 'text-[#6e6358]'
            }`}
          >
            For someone renting (5)
          </button>
          <button
            type="button"
            onClick={() => setMostAskedKind('preloved')}
            className={`px-3 py-1 rounded-[2px] transition-colors cursor-pointer ${
              mostAskedKind === 'preloved' ? 'bg-[#fffefb] text-[#1a1612] font-semibold' : 'text-[#6e6358]'
            }`}
          >
            For someone buying preloved (5)
          </button>
        </div>

        <div className="p-3 bg-[#fcfaf7] rounded-[4px] border border-[#efe7da] text-xs space-y-1">
          <span className="text-[11px] font-mono uppercase text-[#6e6358]">Configured picks:</span>
          <ul className="list-disc list-inside text-[#5c5248] space-y-0.5">
            <li>A001: What is House of Kaira?</li>
            <li>A002: Difference between renting and buying preloved</li>
            <li>A003: Hygiene and cleaning standards</li>
            <li>A025: Security deposit calculation</li>
            <li>A038: Alteration and fit policy</li>
          </ul>
        </div>
      </section>

      {/* ==================== PART 06: TOPICS ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 Topics</span>
          <span className="text-[#6e6358]">Ten topics search results are grouped under</span>
        </div>
        <p className="text-xs text-[#5c5248]">
          Not drawn on the public page. The ten topics search results are grouped under, each with its name, line and count of answers in it.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {['Choosing a piece', 'Sizing & fit', 'Rental dates', 'Security deposits', 'Delivery & courier', 'Garment care', 'Returns & collections', 'Preloved purchases', 'Seller guidelines', 'Legal & dispute'].map((top, idx) => (
            <div key={idx} className="p-2 rounded-[3px] bg-[#fffefb] border border-[#e6dccb] text-center">
              <span className="font-medium text-[#1a1612] text-[11px] block truncate">{top}</span>
              <span className="text-[10px] font-mono text-[#8a6a36]">~12 answers</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PART 07: FULL POLICIES ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Full policies</span>
          <span className="text-[#6e6358]">Policy links and fine print</span>
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-semibold text-[#1a1612]">Read our comprehensive policy documents:</span>
          <div className="flex items-center gap-3 flex-wrap text-xs text-[#8a6a36]">
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Refund & Cancellation Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Deposit Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Care, Cleaning & Damage Policy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Shipping & Delivery Policy</span>
          </div>
          <div className="pt-2 text-[11px] text-[#6e6358]">
            Fine print: Last reviewed {page.lastPublished}. Synchronized with legal registry v217.
          </div>
        </div>
      </section>

      {/* ==================== PART 08: STILL WONDERING ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>08 Still wondering</span>
          <span className="text-[#6e6358]">The dark band that ends the page</span>
        </div>

        <div className="p-8 rounded-[4px] bg-[#1a1612] text-white space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#c9a96e]">
            Still wondering?
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Speak with our concierge team in Indore
          </h2>
          <p className="text-xs text-[#d9ccb6] max-w-xl leading-relaxed">
            Whether you need sizing advice, date confirmation, or custom styling, we are here to help, personally.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-[3px] bg-[#c9a96e] text-[#1a1612] text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message us on WhatsApp</span>
            </span>
            <span className="px-4 py-2 rounded-[3px] bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Email our concierge</span>
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default FaqPaper;