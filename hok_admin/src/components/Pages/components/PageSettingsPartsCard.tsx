/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsPartsCard (Spec §7.9, Screen 28, 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../types';
import { AboutPageSettingsCard } from './about/AboutPageSettingsCard';
import { HowItWorksPageSettingsCard } from './howItWorks/HowItWorksPageSettingsCard';
import { ListYourPiecePageSettingsCard } from './listYourPiece/ListYourPiecePageSettingsCard';
import { TermsPageSettingsCard } from './terms/TermsPageSettingsCard';
import { PrivacyPageSettingsCard } from './privacy/PrivacyPageSettingsCard';
import { CookiePageSettingsCard } from './cookies/CookiePageSettingsCard';
import { RefundsPageSettingsCard } from './refunds/RefundsPageSettingsCard';
import { DepositPageSettingsCard } from './deposit/DepositPageSettingsCard';

interface PageSettingsPartsCardProps {
  page: PageCardData;
  onOpenAnswersView?: () => void;
  onJumpToPart: (partId: string) => void;
  hiddenParts?: Record<string, boolean>;
  onTogglePartHidden?: (partId: string) => void;
  showCircularMark?: boolean;
  onToggleCircularMark?: () => void;
  showFourthWayLine?: boolean;
  onToggleFourthWayLine?: () => void;
  showInstagramLine?: boolean;
  onToggleInstagramLine?: () => void;
  showLoopCard?: boolean;
  onToggleLoopCard?: () => void;
}

export const PageSettingsPartsCard: React.FC<PageSettingsPartsCardProps> = ({
  page,
  onOpenAnswersView,
  onJumpToPart,
  hiddenParts = {},
  onTogglePartHidden = () => {},
  showCircularMark = true,
  onToggleCircularMark = () => {},
  showFourthWayLine = true,
  onToggleFourthWayLine = () => {},
  showInstagramLine = true,
  onToggleInstagramLine = () => {},
  showLoopCard = true,
  onToggleLoopCard = () => {}
}) => {
  const isAbout = page.slug === '/about' || page.slug === 'about';
  const isHowItWorks = page.slug === '/how-it-works' || page.slug === 'how-it-works';
  const isListYourPiece = page.slug === '/list-your-piece' || page.slug === 'list-your-piece';
  const isTerms = page.slug === '/terms' || page.slug === 'terms';

  if (isTerms) {
    return (
      <TermsPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenClausesView={() => onJumpToPart('clauses')}
      />
    );
  }

  const isPrivacy = page.slug === '/privacy' || page.slug === 'privacy';

  if (isPrivacy) {
    return (
      <PrivacyPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
      />
    );
  }

  const isCookies = page.slug === '/cookies' || page.slug === 'cookies';

  if (isCookies) {
    return (
      <CookiePageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
      />
    );
  }

  const isDeposit = page.slug === '/deposit-policy' || page.slug === 'deposit-policy';

  if (isDeposit) {
    return (
      <DepositPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
      />
    );
  }

  const isRefunds = page.slug === '/refunds' || page.slug === 'refunds';

  if (isRefunds) {
    return (
      <RefundsPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
      />
    );
  }

  if (isListYourPiece) {
    return (
      <ListYourPiecePageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={onOpenAnswersView}
      />
    );
  }

  if (isHowItWorks) {
    return (
      <HowItWorksPageSettingsCard
        page={page}
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        showLoopCard={showLoopCard}
        onToggleLoopCard={onToggleLoopCard}
        showInstagramLine={showInstagramLine}
        onToggleInstagramLine={onToggleInstagramLine}
      />
    );
  }

  const [popularQuestions, setPopularQuestions] = useState<string[]>([
    'What do I get back if I cancel more than 7 days before my rental starts?',
    'When do I get my deposit back?',
    'How soon can I cancel without any cancellation fee?',
    'Can I change my dates or swap sizes instead of cancelling?'
  ]);

  const [whatsAppPrompt, setWhatsAppPrompt] = useState<string>(
    'Hello House of Kaira Concierge, I have a question regarding the policy.'
  );

  if (isAbout) {
    return (
      <AboutPageSettingsCard
        page={page}
        onJumpToPart={onJumpToPart}
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        showCircularMark={showCircularMark}
        onToggleCircularMark={onToggleCircularMark}
        showFourthWayLine={showFourthWayLine}
        onToggleFourthWayLine={onToggleFourthWayLine}
        showInstagramLine={showInstagramLine}
        onToggleInstagramLine={onToggleInstagramLine}
      />
    );
  }

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= popularQuestions.length) return;
    const copy = [...popularQuestions];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    setPopularQuestions(copy);
  };

  const handleRemoveQuestion = (index: number) => {
    setPopularQuestions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Part Settings */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">Hero</h3>
            <p className="text-[11.5px] text-[#73675a]">
              Popular questions: picks from this page's answers, at most four, shown under the search box.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('hero')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>

        <div className="space-y-2 pt-1">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8a7f73]">
            Popular questions list (at most four)
          </div>
          {popularQuestions.map((q, idx) => (
            <div key={q} className="flex items-center justify-between p-2.5 rounded bg-[#fcfaf7] border border-[#ebe5dc] text-xs">
              <span className="text-[#1a1612] truncate pr-2">
                <span className="font-medium text-[#8a7f73] mr-2">{idx + 1}.</span>
                {q}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveQuestion(idx, 'up')}
                  disabled={idx === 0}
                  className="px-1.5 py-0.5 rounded text-[11px] text-[#73675a] hover:bg-[#ebe5dc] disabled:opacity-30"
                  title="Move earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveQuestion(idx, 'down')}
                  disabled={idx === popularQuestions.length - 1}
                  className="px-1.5 py-0.5 rounded text-[11px] text-[#73675a] hover:bg-[#ebe5dc] disabled:opacity-30"
                  title="Move later"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="px-1.5 py-0.5 rounded text-[11px] text-[#993d3d] hover:bg-[#fae8e8]"
                  title="Remove question pick"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {popularQuestions.length < 4 && (
            <button
              type="button"
              onClick={() => setPopularQuestions(prev => [...prev, 'How is damage assessed?'])}
              className="py-1.5 px-3 rounded border border-dashed border-[#c5ad7d] text-xs text-[#8a6a36] hover:bg-[#faf7f2] font-medium"
            >
              + Add a question
            </button>
          )}
        </div>
      </div>

      {/* 2. Answers View Card (Spec §7.9, Screen 28) */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-[17px] text-[#1a1612]">Answers</h3>
          {onOpenAnswersView && (
            <button
              type="button"
              onClick={onOpenAnswersView}
              className="px-3 py-1 rounded bg-[#1a1612] text-white text-xs font-medium hover:bg-[#332e27] transition-colors"
            >
              Open it
            </button>
          )}
        </div>
        <p className="text-[12.5px] text-[#5c5248] leading-relaxed">
          Each answer's own settings, who it is shown for, its section, its tag and its search words, are with it in the Answers view.
        </p>
      </div>

      {/* 3. Can't find it Settings Card (Spec §7.9, Screen 28) */}
      <div className="bg-white border border-[#ebe5dc] rounded-[8px] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0eae1] pb-3">
          <div>
            <h3 className="font-serif text-[17px] text-[#1a1612]">Can't find it</h3>
            <p className="text-[11.5px] text-[#73675a]">
              The closing band. WhatsApp and email buttons and the three ways to reach us print contact figures from Site Settings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onJumpToPart('cant-find')}
            className="text-xs text-[#8a6a36] hover:underline font-medium"
          >
            See it on the page
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#73675a] mb-1">
            WhatsApp message it starts
          </label>
          <input
            type="text"
            value={whatsAppPrompt}
            onChange={e => setWhatsAppPrompt(e.target.value)}
            className="w-full p-2 bg-[#fcfaf7] border border-[#e6dccb] rounded-[5px] text-xs text-[#1a1612] focus:outline-none focus:border-[#bda67b]"
          />
        </div>
      </div>
    </div>
  );
};

export default PageSettingsPartsCard;
