/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: ContactPaper (Spec §8.5, Screens 42–43, Pages 29–30)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData, FigureItem } from '../../types';
import { FigureToken } from './FigureToken';
import { CONTACT_CONTENT } from '../../data/contentRegistries/contact/contactContent.js';
import { EyeOff, Clock, MessageSquare, Mail, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

interface ContactPaperProps {
  page: PageCardData;
  figures: FigureItem[];
  onSelectFigure: (figure: FigureItem) => void;
  selectedFigureKey?: string | null;
}

export const ContactPaper: React.FC<ContactPaperProps> = ({
  page,
  figures,
  onSelectFigure,
  selectedFigureKey
}) => {
  // Part 02: Within hours vs Outside hours tabs (§8.5, Screen 43)
  const [hoursMode, setHoursMode] = useState<'within' | 'outside'>('within');

  // Part 03 & 06: Row toggles (Page settings simulation)
  const [showWhatsapp, setShowWhatsapp] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [showCall, setShowCall] = useState(true);
  const [showVisit, setShowVisit] = useState(true);

  // Helper to find figure by key
  const getFig = (key: string): FigureItem => {
    const found = figures.find(f => f.key === key);
    if (found) return found;
    return {
      key,
      label: key,
      value: '---',
      displayValue: '---',
      subject: 'contact',
      owner: 'Site Settings',
      status: 'live',
      reachCount: 2,
      usedOnSlugs: [page.slug],
      format: 'text'
    };
  };

  return (
    <article className="w-full bg-[#fffefb] border border-[#e6dccb] rounded-[2px] shadow-[0_4px_20px_rgba(26,22,18,0.06),0_1px_3px_rgba(26,22,18,0.04)] p-8 md:p-14 text-[#1a1612] space-y-12 select-text">
      {/* Document Header Metadata */}
      <header className="border-b border-[#e6dccb] pb-6 space-y-2 text-xs text-[#6e6358]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8a6a36]">
            {page.slug}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-[#f7f2ea] text-[#5c5248] px-2 py-0.5 rounded-[3px] border border-[#e6dccb]">
              {page.version}
            </span>
            <span>Prints {page.figuresCount} figures</span>
          </div>
        </div>
      </header>

      {/* ==================== PART 01: HERO ==================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>01 Hero</span>
          <span className="text-[#6e6358]">Words only</span>
        </div>
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6e6358] block">
            {CONTACT_CONTENT.hero.eyebrow}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1a1612] tracking-tight leading-tight">
            {CONTACT_CONTENT.hero.title}
          </h1>
          <p className="text-sm md:text-base text-[#5c5248] leading-relaxed max-w-2xl font-sans">
            {CONTACT_CONTENT.hero.lead}
          </p>
        </div>
      </section>

      {/* ==================== PART 02: OPEN OR CLOSED ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>02 Open or closed</span>
          <span className="text-[#6e6358]">Worked out from support hours</span>
        </div>

        {/* Tab row: Within support hours vs Outside support hours */}
        <div className="inline-flex rounded-[3px] p-0.5 bg-[#efe7db] border border-[#d9ccb6] text-xs">
          <button
            type="button"
            onClick={() => setHoursMode('within')}
            className={`px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
              hoursMode === 'within'
                ? 'bg-[#fffefb] text-[#1a1612] shadow-xs font-semibold'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Within support hours
          </button>
          <button
            type="button"
            onClick={() => setHoursMode('outside')}
            className={`px-3 py-1 rounded-[2px] font-medium transition-colors cursor-pointer ${
              hoursMode === 'outside'
                ? 'bg-[#fffefb] text-[#1a1612] shadow-xs font-semibold'
                : 'text-[#6e6358] hover:text-[#1a1612]'
            }`}
          >
            Outside support hours (Screen 43)
          </button>
        </div>

        {/* Live Line Display */}
        <div className="p-4 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] space-y-1">
          {hoursMode === 'within' ? (
            <div>
              <div className="font-serif text-lg font-bold text-[#1a1612]">
                {CONTACT_CONTENT.liveStatus.openTitle}
              </div>
              <div className="text-xs text-[#5c5248] flex items-center gap-1.5 pt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#6b7e5a]" />
                <span>
                  <FigureToken figure={getFig('support_days')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'support_days'} />,{' '}
                  <FigureToken figure={getFig('support_hours')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'support_hours'} />.
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="font-serif text-lg font-bold text-[#1a1612]">
                We’re back tomorrow at <FigureToken figure={getFig('reach_support_opening_time')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'reach_support_opening_time'} /> IST
              </div>
              <div className="text-xs text-[#5c5248] pt-0.5">
                {CONTACT_CONTENT.liveStatus.closedSub}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== PART 03: WAYS TO REACH US ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>03 Ways to reach us</span>
          <span className="text-[#6e6358]">Each row shows a figure from Site Settings</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#1a1612]">
            {CONTACT_CONTENT.reachCard.title}
          </h2>

          <div className="border border-[#e6dccb] rounded-[4px] divide-y divide-[#efe7da] overflow-hidden text-xs">
            {/* WhatsApp row */}
            <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${!showWhatsapp ? 'opacity-40 bg-[#f7f2ea]' : 'bg-[#fffefb]'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1a1612]">WhatsApp</span>
                  {!showWhatsapp && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
                      Hidden on page
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-[#8a6a36]">
                  <FigureToken figure={getFig('support_whatsapp')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'support_whatsapp'} />
                </div>
                <p className="text-[11px] text-[#5c5248]">
                  The quickest way to reach us. During our hours, we usually reply within <FigureToken figure={getFig('support_sla')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'support_sla'} />.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsapp(!showWhatsapp)}
                  className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
                  title="Toggle visibility"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Email row */}
            <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${!showEmail ? 'opacity-40 bg-[#f7f2ea]' : 'bg-[#fffefb]'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1a1612]">Email</span>
                  {!showEmail && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
                      Hidden on page
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-[#8a6a36]">
                  <FigureToken figure={getFig('support_email')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'support_email'} />
                </div>
                <p className="text-[11px] text-[#5c5248]">
                  Best for photographs and documents. We reply within <FigureToken figure={getFig('email_sla')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'email_sla'} />.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmail(!showEmail)}
                  className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
                  title="Toggle visibility"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Call row */}
            <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${!showCall ? 'opacity-40 bg-[#f7f2ea]' : 'bg-[#fffefb]'}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1a1612]">Call</span>
                  {!showCall && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#efe7db] text-[#6e6358] border border-[#d9ccb6]">
                      Hidden on page
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-[#8a6a36]">
                  <FigureToken figure={getFig('support_phone')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'support_phone'} />
                </div>
                <p className="text-[11px] text-[#5c5248]">
                  Seven days a week, 10 AM to 8 PM IST.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCall(!showCall)}
                  className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
                  title="Toggle visibility"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PART 04: ANSWERS, ANY TIME ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>04 Answers, any time</span>
          <span className="text-[#6e6358]">Six pages chosen in Page settings</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-[#1a1612]">
            {CONTACT_CONTENT.answers.title}
          </h2>
          <p className="text-xs text-[#5c5248]">
            {CONTACT_CONTENT.answers.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {CONTACT_CONTENT.answers.pages.map(card => (
            <div key={card.id} className="p-3.5 rounded-[4px] border border-[#e6dccb] bg-[#fffefb] space-y-1 hover:border-[#8a6a36] transition-colors">
              <div className="font-semibold text-[#1a1612] flex items-center justify-between">
                <span>{card.name}</span>
                <ArrowRight className="w-3 h-3 text-[#8a6a36]" />
              </div>
              <p className="text-[11px] text-[#5c5248] leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PART 05: WRITE US A NOTE ==================== */}
      <section className="space-y-4 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>05 Write us a note</span>
          <span className="text-[#6e6358]">12 form field validation states in Page settings</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-[#1a1612]">
            {CONTACT_CONTENT.write.title}
          </h2>
          <p className="text-xs text-[#5c5248]">
            Prefer to put it in writing? Send us a note here, and our team will reply by email within <FigureToken figure={getFig('email_sla')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'email_sla'} />.
          </p>
        </div>

        {/* Visual representation of the 12 fields */}
        <div className="p-4 rounded-[4px] bg-[#fcfaf7] border border-[#efe7da] space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#6e6358]">{CONTACT_CONTENT.write.fields.name.label}</label>
              <div className="p-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] text-[#b4a99e]">Customer name</div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-[#6e6358]">{CONTACT_CONTENT.write.fields.email.label}</label>
              <div className="p-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] text-[#b4a99e]">name@example.com</div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-[#6e6358]">{CONTACT_CONTENT.write.fields.topic.label}</label>
            <div className="p-2 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] text-[#5c5248]">
              {CONTACT_CONTENT.write.fields.topic.firstOption}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-[#6e6358]">{CONTACT_CONTENT.write.fields.message.label}</label>
            <div className="p-3 rounded-[3px] bg-[#fffefb] border border-[#d9ccb6] text-[#b4a99e] h-20">
              {CONTACT_CONTENT.write.fields.message.hint}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#6e6358]">
            <span>{CONTACT_CONTENT.write.privacyNotice}</span>
            <span className="px-3 py-1 bg-[#1a1612] text-white rounded-[3px] font-medium">
              {CONTACT_CONTENT.write.buttonLabel}
            </span>
          </div>
        </div>
      </section>

      {/* ==================== PART 06: VISIT US ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>06 Visit us</span>
          <span className="text-[#6e6358]">Visits in Indore, by appointment</span>
        </div>

        <div className={`p-4 rounded-[4px] border border-[#e6dccb] space-y-2 ${!showVisit ? 'opacity-40 bg-[#f7f2ea]' : 'bg-[#fffefb]'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-[#1a1612]">
              {CONTACT_CONTENT.side.visit.title}
            </h2>
            <div className="flex items-center gap-2">
              {!showVisit && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#efe7db] text-[#6e6358]">
                  Switched off
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowVisit(!showVisit)}
                className="p-1 text-[#6e6358] hover:text-[#1a1612] cursor-pointer"
                title="Toggle visit card"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-[#5c5248] leading-relaxed">
            {CONTACT_CONTENT.side.visit.intro}
          </p>
          <div className="pt-2 text-xs flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#8a6a36]" />
            <span className="font-semibold text-[#1a1612]">
              Where: <FigureToken figure={getFig('visit_area')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'visit_area'} /> (By appointment)
            </span>
          </div>
        </div>
      </section>

      {/* ==================== PART 07: JUST ARRIVED ==================== */}
      <section className="space-y-3 pt-6 border-t border-[#efe7da]">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#8a6a36]">
          <span>07 Just arrived</span>
          <span className="text-[#6e6358]">Arrival issue resolution</span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#fffefb] border border-[#e6dccb] space-y-1 text-xs">
          <h2 className="font-serif text-base font-bold text-[#1a1612]">
            {CONTACT_CONTENT.side.arrival.title}
          </h2>
          <p className="text-[#5c5248]">
            Please tell us within <FigureToken figure={getFig('issue_window')} onClick={onSelectFigure} isSelected={selectedFigureKey === 'issue_window'} /> of delivery, with photographs, so we can put it right.
          </p>
          <div className="pt-1 text-[#8a6a36] font-medium hover:underline cursor-pointer flex items-center gap-1">
            <span>{CONTACT_CONTENT.side.arrival.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </section>
    </article>
  );
};

export default ContactPaper;