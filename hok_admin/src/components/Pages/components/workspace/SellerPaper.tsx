/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: SellerPaper (Spec §8.17, Screen 57, Pages 46–48)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import {
  SELLER_PROTECTION_CARD,
  SELLER_CLOSING_BAND,
  TWO_WAYS_FEATURE,
  FIVE_STEPS_FEATURE,
  CARE_TRIO_FEATURE,
  SELLER_CHAPTERS,
  SELLER_QUESTIONS
} from '../../data/contentRegistries/seller/sellerRegistry.js';
import { SITE_TOKENS } from '../../data/contentRegistries/seller/sellerSettings.js';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Layers,
  HelpCircle
} from 'lucide-react';

interface SellerPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const SellerPaper: React.FC<SellerPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('ways');
  const [openQuestionIds, setOpenQuestionIds] = useState<Record<string, boolean>>({
    'keep-home': true,
    'who-can': true
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
      subject: 'seller',
      owner: 'Platform & Legal',
      status: 'live',
      reachCount: 1,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  const toggleQuestion = (id: string) => {
    setOpenQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeChapter = SELLER_CHAPTERS.find(c => c.id === activeChapterId) || SELLER_CHAPTERS[0];
  const chapterQuestions = SELLER_QUESTIONS.filter(q => q.chapterId === activeChapterId);

  // Suggested search chips (Spec §8.17 Part 01)
  const suggestedWords = ['payout', 'damage', 'take my piece back', 'share'];

  return (
    <article className="relative w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* 01 Hero & 02 Protection Card (Spec §8.17 Parts 01 & 02) */}
      <section className="space-y-6 border-b border-[#e6dccb] pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Hero Words */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[11px] font-mono tracking-widest uppercase text-[#8a6a36]">
              Seller guidelines
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1a1612] tracking-tight leading-snug">
              How listing works,{' '}
              <span className="italic text-[#8a6a36]">in plain words.</span>
            </h1>
            <p className="text-xs md:text-sm text-[#6e6358] leading-relaxed">
              Every piece listed with House of Kaira stays yours. With every celebration it joins, it recovers a meaningful part of what you invested in it, and the craft that went into it lives on in more stories. Here is how listing works, and how we look after your piece along the way.
            </p>
            <div className="text-xs text-[#8a6a36] pt-1">
              <span className="font-medium text-[#1a1612]">Updated {SITE_TOKENS.page_updated}</span> ·{' '}
              <a href="/terms#lister-terms" className="hover:underline font-medium">
                Read formal Lister Terms in Section 7 of Terms & Conditions →
              </a>
            </div>

            {/* Search Box */}
            <div className="pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8a6a36] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search the guidelines... Try payouts or damage"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d9ccb6] rounded-[2px] text-xs md:text-sm text-[#1a1612] placeholder-[#a69888] focus:outline-none focus:border-[#8a6a36]"
                />
              </div>

              {/* Suggested Words Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#6e6358]">
                <span className="text-[11px] uppercase tracking-wider text-[#8a6a36] mr-1">Suggestions:</span>
                {suggestedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(word)}
                    className="px-2.5 py-0.5 bg-[#f7f2ea] hover:bg-[#ede4d4] border border-[#e6dccb] rounded-full text-xs text-[#1a1612] transition-colors cursor-pointer"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Your piece, protected Card (Spec §8.17 Part 02) */}
          <div className="lg:col-span-5 p-5 md:p-6 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[3px] shadow-xs space-y-4">
            <div>
              <div className="text-[11px] font-mono tracking-wider uppercase text-[#8a6a36] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8a6a36]" />
                <span>Protection</span>
              </div>
              <h3 className="font-serif text-lg text-[#1a1612] font-semibold mt-0.5">
                {SELLER_PROTECTION_CARD.title}
              </h3>
              <p className="text-xs text-[#6e6358] mt-0.5">
                {SELLER_PROTECTION_CARD.line}
              </p>
            </div>

            <ul className="space-y-2 text-xs text-[#4a4036]">
              {SELLER_PROTECTION_CARD.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8a6a36] shrink-0 mt-0.5" />
                  <span className="leading-snug">{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-[#e6dccb]">
              <button
                onClick={() => setActiveChapterId('protect')}
                className="text-xs font-semibold text-[#8a6a36] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{SELLER_PROTECTION_CARD.link_text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Chapters Navigation & Content (Spec §8.17 Part 03, Screen 57) */}
      <section className="space-y-6">
        <div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-[#8a6a36]">
            The chapters
          </div>
          <h2 className="font-serif text-2xl text-[#1a1612] tracking-tight">
            Nine chapters, each with its questions
          </h2>
        </div>

        {/* Chapter Tabs Strip (Spec §8.17 Part 03) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#e6dccb] no-scrollbar">
          {SELLER_CHAPTERS.map(chap => {
            const isActive = chap.id === activeChapterId;
            return (
              <button
                key={chap.id}
                onClick={() => setActiveChapterId(chap.id)}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1a1612] text-white shadow-xs'
                    : 'bg-[#f7f2ea] text-[#6e6358] hover:text-[#1a1612] hover:bg-[#ede4d4] border border-[#e6dccb]'
                }`}
              >
                {chap.barLabel}
              </button>
            );
          })}
        </div>

        {/* Active Chapter Container */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl md:text-2xl text-[#1a1612]">
              {activeChapter.title}
            </h3>
            <p className="text-xs md:text-sm text-[#6e6358] leading-relaxed max-w-3xl">
              {activeChapter.intro}
            </p>
          </div>

          {/* Chapter Feature: Two Ways side by side (Spec §8.17 Part 03) */}
          {activeChapter.feature === 'ways' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Keep it with you */}
              <div className="p-5 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-3">
                <div className="inline-block px-2 py-0.5 bg-[#ede4d4] text-[#8a6a36] text-[11px] font-mono uppercase tracking-wider rounded">
                  {TWO_WAYS_FEATURE.keep.badge}
                </div>
                <h4 className="font-serif text-lg text-[#1a1612] font-semibold">
                  {TWO_WAYS_FEATURE.keep.title}
                </h4>
                <p className="text-xs text-[#6e6358] leading-relaxed">
                  {TWO_WAYS_FEATURE.keep.summary}
                </p>
                <div className="pt-2 border-t border-[#e6dccb] space-y-2 text-xs">
                  {TWO_WAYS_FEATURE.keep.rows.map((row, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-[#1a1612] min-w-[50px]">{row.label}:</span>
                      <span className="text-[#4a4036] leading-snug">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Send it to us */}
              <div className="p-5 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-3">
                <div className="inline-block px-2 py-0.5 bg-[#ede4d4] text-[#8a6a36] text-[11px] font-mono uppercase tracking-wider rounded">
                  {TWO_WAYS_FEATURE.send.badge}
                </div>
                <h4 className="font-serif text-lg text-[#1a1612] font-semibold">
                  {TWO_WAYS_FEATURE.send.title}
                </h4>
                <p className="text-xs text-[#6e6358] leading-relaxed">
                  {TWO_WAYS_FEATURE.send.summary}
                </p>
                <div className="pt-2 border-t border-[#e6dccb] space-y-2 text-xs">
                  {TWO_WAYS_FEATURE.send.rows.map((row, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-[#1a1612] min-w-[50px]">{row.label}:</span>
                      <span className="text-[#4a4036] leading-snug">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chapter Feature: Five Steps Roadmap */}
          {activeChapter.feature === 'steps' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
              {FIVE_STEPS_FEATURE.map(step => (
                <div key={step.step} className="p-3.5 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-1.5 text-xs">
                  <div className="w-5 h-5 rounded-full bg-[#8a6a36] text-white flex items-center justify-center font-mono text-[11px] font-bold">
                    {step.step}
                  </div>
                  <div className="font-serif text-sm font-semibold text-[#1a1612] pt-0.5">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-[#6e6358] leading-snug">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chapter Feature: Care Trio */}
          {activeChapter.feature === 'trio' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {CARE_TRIO_FEATURE.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-1.5 text-xs">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
                    Step 0{idx + 1}
                  </div>
                  <div className="font-serif text-sm font-semibold text-[#1a1612]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#6e6358] leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Questions in this Chapter (Spec §8.17 Part 03) */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#8a6a36]">
              Questions in this chapter ({chapterQuestions.length})
            </div>
            {chapterQuestions.map(q => {
              const isOpen = openQuestionIds[q.id];
              return (
                <div
                  key={q.id}
                  className="border border-[#e6dccb] rounded-[2px] overflow-hidden bg-white hover:shadow-xs transition-shadow"
                >
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full p-4 flex items-center justify-between text-left gap-4 bg-[#fcfaf7] hover:bg-[#f7f2ea] transition-colors cursor-pointer"
                  >
                    <span className="font-serif text-sm md:text-base text-[#1a1612] font-medium leading-snug">
                      {q.title}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8a6a36] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8a6a36] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-3 border-t border-[#e6dccb] text-xs md:text-sm text-[#4a4036] leading-relaxed space-y-2">
                      {q.body.map((b: any, bIdx: number) => {
                        if (b.type === 'ul') {
                          return (
                            <ul key={bIdx} className="space-y-2">
                              {b.items.map((it: string, iIdx: number) => (
                                <li key={iIdx} className="flex items-start gap-2">
                                  <span className="text-[#8a6a36] font-bold">·</span>
                                  <span>{it}</span>
                                </li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={bIdx}>{b.text}</p>;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 Closing Band & The Agreement (Spec §8.17 Part 04) */}
      <section className="space-y-8 pt-6 border-t border-[#e6dccb]">
        {/* Dark Closing Callout */}
        <div className="p-8 md:p-10 bg-[#1a1612] text-[#fffefb] rounded-[2px] space-y-5">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl md:text-3xl text-white tracking-tight">
              {SELLER_CLOSING_BAND.title}
            </h3>
            <p className="text-xs md:text-sm text-[#b8afa5] max-w-xl leading-relaxed">
              {SELLER_CLOSING_BAND.lead}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SELLER_CLOSING_BAND.list_your_piece_url}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8a6a36] hover:bg-[#72572c] text-white text-xs font-medium rounded-[2px] transition-colors"
            >
              <span>List Your Piece</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={SELLER_CLOSING_BAND.whatsapp_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium rounded-[2px] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* These guidelines and the agreement (Spec §8.17 Part 04) */}
        <div className="p-5 bg-[#fbf9f5] border border-[#d9ccb6] rounded-[2px] space-y-3">
          <h4 className="font-serif text-base text-[#1a1612] font-semibold">
            {SELLER_CLOSING_BAND.panel_title}
          </h4>
          <p className="text-xs text-[#6e6358] leading-relaxed">
            {SELLER_CLOSING_BAND.panel_text}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a6a36] pt-1">
            {SELLER_CLOSING_BAND.panel_links.map((link, idx) => (
              <React.Fragment key={idx}>
                <a href={link.href} className="hover:underline font-medium">
                  {link.label}
                </a>
                {idx < SELLER_CLOSING_BAND.panel_links.length - 1 && <span className="text-[#d9ccb6]">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
