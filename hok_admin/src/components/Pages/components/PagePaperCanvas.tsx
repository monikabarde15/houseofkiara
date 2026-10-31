/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PagePaperCanvas (Spec §7.3, §8.4, §8.5, Screens 20, 39, 42)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React, { useState } from 'react';
import { PageCardData } from '../types';
import { CheckItem } from '../types/checks.types';
import { getPageContent } from '../data/pageContentRegistry';
import { getPageAnswers } from '../data/pageAnswersRegistry';
import { FloatingWordBar } from './FloatingWordBar';
import { FigurePickerPopover } from './FigurePickerPopover';
import { LinkPickerPopover } from './LinkPickerPopover';
import { PagePaperHero } from './PagePaperHero';
import { FaqPaperSection } from './faq/FaqPaperSection';
import { ContactPaperSection } from './contact/ContactPaperSection';
import { AboutPaperSection } from './about/AboutPaperSection';
import { HowItWorksSection } from './howItWorks/HowItWorksSection';
import { ListYourPieceSection } from './listYourPiece/ListYourPieceSection';
import { TermsPaperSection } from './terms/TermsPaperSection';
import { TermsClausesWorkspaceView } from './terms/TermsClausesWorkspaceView';
import { PrivacyPaperSection } from './privacy/PrivacyPaperSection';
import { CookiePaperSection } from './cookies/CookiePaperSection';
import { RefundsPaperSection } from './refunds/RefundsPaperSection';
import { DepositPaperSection } from './deposit/DepositPaperSection';
import { PagePaperOpening } from './PagePaperOpening';
import { MarginCheckMark } from './MarginCheckMark';

export interface EditableFieldInfo {
  partId: string;
  fieldId: string;
  fieldName: string;
  helpText?: string;
  isHeading?: boolean;
}

interface PagePaperCanvasProps {
  page: PageCardData;
  activePartId: string;
  onSelectPart: (partId: string) => void;
  onSelectFigure: (key: string) => void;
  onOpenAnswersView?: () => void;
  onOpenCheck?: (check: CheckItem) => void;
  focusedField: EditableFieldInfo | null;
  onFocusField: (info: EditableFieldInfo | null) => void;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  highlightedFigureKey?: string | null;
  onSelectPage?: (slug: string) => void;
  hiddenParts?: Record<string, boolean>;
  showCircularMark?: boolean;
  showFourthWayLine?: boolean;
  showInstagramLine?: boolean;
}

export const PagePaperCanvas: React.FC<PagePaperCanvasProps> = ({
  page,
  activePartId,
  onSelectPart,
  onSelectFigure,
  onOpenAnswersView,
  onOpenCheck,
  focusedField,
  onFocusField,
  fieldValues,
  onFieldChange,
  highlightedFigureKey,
  onSelectPage,
  hiddenParts = {},
  showCircularMark = true,
  showFourthWayLine = true,
  showInstagramLine = true
}) => {
  const [activeSide, setActiveSide] = useState<'rental' | 'preloved'>('rental');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);

  const pageContent = getPageContent(page.slug);
  const answers = getPageAnswers(page.slug);
  const openingChecks = page.checks?.filter(c => c.location === 'Opening statement') || [];

  const getVal = (id: string, fallback: string) =>
    fieldValues[id] !== undefined ? fieldValues[id] : fallback;

  const handleFieldFocus = (
    partId: string,
    fieldId: string,
    fieldName: string,
    helpText?: string,
    isHeading = false
  ) => {
    onSelectPart(partId);
    onFocusField({ partId, fieldId, fieldName, helpText, isHeading });
  };

  const handleInsertFigure = (figureKey: string, formattedValue: string) => {
    if (!focusedField) return;
    const currentVal = getVal(focusedField.fieldId, '');
    onFieldChange(focusedField.fieldId, currentVal + ' ' + formattedValue);
    setPickerOpen(false);
  };

  const handleSaveLink = (label: string, destinationSlug: string) => {
    if (!focusedField) return;
    const currentVal = getVal(focusedField.fieldId, '');
    onFieldChange(focusedField.fieldId, currentVal + ` [${label}](${destinationSlug})`);
    setLinkOpen(false);
  };

  const isFaq =
    page.slug === 'faqs' ||
    page.slug === '/faqs' ||
    page.slug === 'faq' ||
    page.slug === '/faq';

  const isContact =
    page.slug === 'contact' ||
    page.slug === '/contact';

  const isAbout =
    page.slug === 'about' ||
    page.slug === '/about';

  const isHowItWorks =
    page.slug === 'how-it-works' ||
    page.slug === '/how-it-works';

  const isListYourPiece =
    page.slug === 'list-your-piece' ||
    page.slug === '/list-your-piece';

  const isTerms =
    page.slug === 'terms' ||
    page.slug === '/terms';

  const isPrivacy =
    page.slug === 'privacy' ||
    page.slug === '/privacy';

  const isCookies =
    page.slug === 'cookies' ||
    page.slug === '/cookies';

  const isRefunds =
    page.slug === 'refunds' ||
    page.slug === '/refunds';

  const isDeposit =
    page.slug === 'deposit-policy' ||
    page.slug === '/deposit-policy';

  const isClausesMode = isTerms && activePartId === 'clauses';

  if (isClausesMode) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <TermsClausesWorkspaceView
          fieldValues={fieldValues}
          onFieldChange={onFieldChange}
          onFocusField={onFocusField}
          onBackToPaper={() => onSelectPart('hero')}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[760px] mx-auto">
      {/* The Paper Sheet (Spec §7.3) */}
      <div className="bg-[#fffefb] border border-[#e6dccb] rounded-[10px] p-8 md:p-14 shadow-[0_4px_24px_rgba(26,22,18,0.06)] min-h-[900px] relative space-y-10">
        {/* Floating formatting bar when a field is focused */}
        {focusedField && (
          <div className="sticky top-2 z-40 flex justify-center w-full pointer-events-none mb-2">
            <div className="pointer-events-auto">
              <FloatingWordBar
                isHeading={focusedField.isHeading}
                onBoldClick={() => {}}
                onLinkClick={() => setLinkOpen(true)}
                onAddFigureClick={() => setPickerOpen(true)}
                onGoldItalicClick={() => {}}
              />
              {pickerOpen && (
                <FigurePickerPopover
                  pageSlug={page.slug}
                  onSelectFigure={handleInsertFigure}
                  onClose={() => setPickerOpen(false)}
                  style={{ top: '38px', left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
              {linkOpen && (
                <LinkPickerPopover
                  initialWords={getVal(focusedField.fieldId, '').slice(0, 30)}
                  onSaveLink={handleSaveLink}
                  onClose={() => setLinkOpen(false)}
                  style={{ top: '38px', left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
            </div>
          </div>
        )}

        {isFaq ? (
          /* Help & FAQs specific canvas (Spec §8.4, Screens 39, 40) */
          <FaqPaperSection
            activePartId={activePartId}
            activeSide={activeSide}
            onSideChange={setActiveSide}
            focusedField={focusedField}
            getVal={getVal}
            onSelectPart={onSelectPart}
            onFieldFocus={handleFieldFocus}
            onFieldChange={onFieldChange}
            answers={answers}
            onOpenAnswersView={onOpenAnswersView}
            onNavigateToPage={onSelectPage}
          />
        ) : isContact ? (
          /* Contact Us specific canvas (Spec §8.5, Screens 42, 43) */
          <ContactPaperSection
            activePartId={activePartId}
            focusedField={focusedField}
            getVal={getVal}
            onSelectPart={onSelectPart}
            onFieldFocus={handleFieldFocus}
            onFieldChange={onFieldChange}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            onOpenCheck={() =>
              onOpenCheck?.({
                id: 'contact_check',
                pageSlug: '/contact',
                type: 'medium',
                title: 'Prints a figure waiting for a decision',
                description: 'Review phone number or visit location',
                location: 'Ways to reach us'
              })
            }
          />
        ) : isAbout ? (
          /* About HOK specific canvas (Spec §8.6, Screens 44, 45, 46) */
          <AboutPaperSection
            activePartId={activePartId}
            focusedField={focusedField}
            getVal={getVal}
            onSelectPart={onSelectPart}
            onFieldFocus={handleFieldFocus}
            onFieldChange={onFieldChange}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
            showCircularMark={showCircularMark}
            showFourthWayLine={showFourthWayLine}
            showInstagramLine={showInstagramLine}
          />
        ) : isHowItWorks ? (
          /* How It Works specific canvas (Spec §8.7, Screen 47) */
          <HowItWorksSection
            activePartId={activePartId}
            focusedField={focusedField}
            getVal={getVal}
            onSelectPart={onSelectPart}
            onFieldFocus={handleFieldFocus}
            onFieldChange={onFieldChange}
            onNavigateToPage={onSelectPage}
            onSelectFigure={onSelectFigure}
            onOpenAnswersView={onOpenAnswersView}
            hiddenParts={hiddenParts}
            showLoopCard={true}
            showInstagramLine={showInstagramLine}
          />
        ) : isListYourPiece ? (
          /* List Your Piece specific canvas (Spec §8.8, Screen 48) */
          <ListYourPieceSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            highlightedFigureKey={highlightedFigureKey}
            onSelectFigure={onSelectFigure}
            onOpenAnswersView={onOpenAnswersView}
            onOpenCheck={onOpenCheck}
            hiddenParts={hiddenParts}
          />
        ) : isTerms ? (
          /* Terms & Conditions Paper View (Spec §8.9, Screen 49) */
          <TermsPaperSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            highlightedFigureKey={highlightedFigureKey}
            onSelectFigure={onSelectFigure}
            onOpenClausesView={(num) => onSelectPart('clauses')}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />
        ) : isPrivacy ? (
          /* Privacy Policy Paper View (Spec §8.1 & §8.10, Screen 58) */
          <PrivacyPaperSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenCheck={onOpenCheck}
          />
        ) : isCookies ? (
          /* Cookie Policy Paper View (Spec §8.1 & §8.11, Screen 58) */
          <CookiePaperSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenCheck={onOpenCheck}
          />
        ) : isRefunds ? (
          /* Refund & Cancellation Policy Paper View (Spec §8.12, Screen 49/58) */
          <RefundsPaperSection
            page={page}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />
        ) : isDeposit ? (
          /* Deposit Policy Paper View (Spec § 8.13, Screen 51) */
          <DepositPaperSection
            page={page}
            activePartId={activePartId}
            onSelectPart={onSelectPart}
            fieldValues={fieldValues}
            onFieldChange={onFieldChange}
            onFocusField={onFocusField}
            onOpenAnswersView={onOpenAnswersView}
            onSelectFigure={onSelectFigure}
            onNavigateToPage={onSelectPage}
            hiddenParts={hiddenParts}
          />
        ) : (
          /* Standard Policy Canvas */
          <>
            <PagePaperHero
              activePartId={activePartId}
              heroContent={pageContent.hero}
              focusedField={focusedField}
              getVal={getVal}
              onSelectPart={onSelectPart}
              onFieldFocus={handleFieldFocus}
              onFieldChange={onFieldChange}
            />

            <div className="border-b border-dashed border-[#e6dccb]" />

            {/* Part 2: Two policies (Interactive sides toggle if supported) */}
            {pageContent.hasTwoSides && (
              <>
                <section
                  id="two-policies"
                  onClick={() => onSelectPart('two-policies')}
                  className={`relative space-y-4 cursor-pointer p-4 -m-4 rounded transition-colors ${
                    activePartId === 'two-policies' ? 'ring-1 ring-[#bda67b]/50 bg-[#fffdfa]' : 'hover:bg-[#fcfaf7]'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        setActiveSide('rental');
                        onSelectPart('two-policies');
                      }}
                      className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                        activeSide === 'rental'
                          ? 'bg-[#1a1612] text-white border-[#1a1612] shadow-sm'
                          : 'bg-white text-[#1a1612] border-[#ebe5dc] hover:border-[#bda67b]'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider mb-1 ${activeSide === 'rental' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'}`}>
                        For every rental
                      </div>
                      <div className="font-serif text-[18px]">Rental policy</div>
                      <div className={`text-[11px] mt-0.5 ${activeSide === 'rental' ? 'text-white/70' : 'text-[#73675a]'}`}>
                        {pageContent.rentalAnswersCount || 68} answers
                      </div>
                    </div>

                    <div
                      onClick={e => {
                        e.stopPropagation();
                        setActiveSide('preloved');
                        onSelectPart('two-policies');
                      }}
                      className={`p-4 rounded-[6px] border transition-all cursor-pointer ${
                        activeSide === 'preloved'
                          ? 'bg-[#1a1612] text-white border-[#1a1612] shadow-sm'
                          : 'bg-white text-[#1a1612] border-[#ebe5dc] hover:border-[#bda67b]'
                      }`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider mb-1 ${activeSide === 'preloved' ? 'text-[#c5ad7d]' : 'text-[#8a7f73]'}`}>
                        For every preloved piece
                      </div>
                      <div className="font-serif text-[18px]">Preloved policy</div>
                      <div className={`text-[11px] mt-0.5 ${activeSide === 'preloved' ? 'text-white/70' : 'text-[#73675a]'}`}>
                        {pageContent.prelovedAnswersCount || 53} answers · Show this side
                      </div>
                    </div>
                  </div>
                </section>
                <div className="border-b border-dashed border-[#e6dccb]" />
              </>
            )}

            {/* Part 3: Opening Statement with live figure tokens & margin check mark */}
            <div className="relative">
              <PagePaperOpening
                activePartId={activePartId}
                activeSide={activeSide}
                openingContent={pageContent.opening}
                focusedField={focusedField}
                getVal={getVal}
                onSelectPart={onSelectPart}
                onFieldFocus={handleFieldFocus}
                onFieldChange={onFieldChange}
                onSelectFigure={onSelectFigure}
                highlightedFigureKey={highlightedFigureKey}
              />
              <MarginCheckMark
                checks={openingChecks}
                onClick={c => onOpenCheck && onOpenCheck(c)}
              />
            </div>

            <div className="border-b border-dashed border-[#e6dccb]" />

            {/* Part 4: Answers Card */}
            <section
              id="answers"
              onClick={() => onSelectPart('answers')}
              className={`relative p-5 rounded-[8px] border-2 border-dashed border-[#e6dccb] bg-[#faf7f2]/60 space-y-3 cursor-pointer transition-colors ${
                activePartId === 'answers' ? 'border-[#bda67b] bg-[#fffdfa]' : 'hover:bg-[#faf7f2]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-medium text-[#1a1612]">
                  {page.wordsCount || 103} answers, each a question the page opens as it is asked
                </h3>
                {onOpenAnswersView && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onOpenAnswersView();
                    }}
                    className="text-xs text-[#8a6a36] hover:underline font-medium cursor-pointer"
                  >
                    Open the answers →
                  </button>
                )}
              </div>
              <p className="text-[12px] text-[#73675a]">
                They are written in the Answers view, with a list to find one in.
              </p>
            </section>
          </>
        )}
      </div>

      {/* Footnote under paper (Spec §7.3) */}
      <div className="py-4 text-center text-xs text-[#73675a]">
        Click any words to change them where they print. Gold words are figures: click one to see every page it prints on.
      </div>
    </div>
  );
};

export default PagePaperCanvas;
