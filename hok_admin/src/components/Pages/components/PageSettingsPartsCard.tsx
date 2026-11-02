/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Component: PageSettingsPartsCard (Spec §7.9, Screen 28, 46)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { PageCardData } from '../types';
import { AboutPageSettingsCard } from './about/AboutPageSettingsCard';
import { HowItWorksPageSettingsCard } from './howItWorks/HowItWorksPageSettingsCard';
import { ListYourPiecePageSettingsCard } from './listYourPiece/ListYourPiecePageSettingsCard';
import { TermsPageSettingsCard } from './terms/TermsPageSettingsCard';
import { PrivacyPageSettingsCard } from './privacy/PrivacyPageSettingsCard';
import { CookiePageSettingsCard } from './cookies/CookiePageSettingsCard';
import { RefundsPageSettingsCard } from './refunds/RefundsPageSettingsCard';
import { DepositPageSettingsCard } from './deposit/DepositPageSettingsCard';
import { CarePageSettingsCard } from './care/CarePageSettingsCard';
import { ShippingPageSettingsCard } from './shipping/ShippingPageSettingsCard';
import { PricingPageSettingsCard } from './pricing/PricingPageSettingsCard';
import { SellerPageSettingsCard } from './seller/SellerPageSettingsCard';
import { PageNotFoundPageSettingsCard } from './notFound/PageNotFoundPageSettingsCard';
import { NoSearchPageSettingsCard } from './noSearchResults/NoSearchPageSettingsCard';
import { MaintenancePageSettingsCard } from './maintenance/MaintenancePageSettingsCard';
import { DefaultPageSettingsCard } from './DefaultPageSettingsCard';

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

  const isCare = page.slug === '/care-policy' || page.slug === 'care-policy' || page.slug === 'care-damage' || page.slug === '/care-damage';
  if (isCare) {
    return (
      <CarePageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
      />
    );
  }

  const isShipping = page.slug === '/shipping-policy' || page.slug === 'shipping-policy' || page.slug === 'shipping-delivery' || page.slug === '/shipping-delivery';
  if (isShipping) {
    return (
      <ShippingPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
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

  const isPricing = page.slug === '/pricing' || page.slug === 'pricing';
  if (isPricing) {
    return (
      <PricingPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={() => onJumpToPart('answers')}
      />
    );
  }

  const isSeller = page.slug === '/seller-guidelines' || page.slug === 'seller-guidelines';
  if (isSeller) {
    return (
      <SellerPageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenChaptersView={() => onJumpToPart('chapters')}
      />
    );
  }

  const is404 = page.slug === '/404' || page.slug === '404';
  if (is404) {
    return <PageNotFoundPageSettingsCard />;
  }

  const isSearch = page.slug === '/search' || page.slug === 'search';
  if (isSearch) {
    return <NoSearchPageSettingsCard />;
  }

  const isMaintenance = page.slug === '/maintenance' || page.slug === 'maintenance';
  if (isMaintenance) {
    return <MaintenancePageSettingsCard />;
  }

  const isListYourPiece = page.slug === '/list-your-piece' || page.slug === 'list-your-piece';
  if (isListYourPiece) {
    return (
      <ListYourPiecePageSettingsCard
        hiddenParts={hiddenParts}
        onTogglePartHidden={onTogglePartHidden}
        onOpenAnswersView={onOpenAnswersView}
      />
    );
  }

  const isHowItWorks = page.slug === '/how-it-works' || page.slug === 'how-it-works';
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

  const isAbout = page.slug === '/about' || page.slug === 'about';
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

  return (
    <DefaultPageSettingsCard
      onJumpToPart={onJumpToPart}
      onOpenAnswersView={onOpenAnswersView}
    />
  );
};

export default PageSettingsPartsCard;
