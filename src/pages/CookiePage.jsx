/**
 * House of Kaira - Cookie Policy Page
 * Complete Build Specification v1.0 (hok_cookie_v4)
 */

import React, { useState, useEffect } from 'react';
import CookieBreadcrumb from '../components/cookies/CookieBreadcrumb.jsx';
import CookieHero from '../components/cookies/CookieHero.jsx';
import CookieStartCards from '../components/cookies/CookieStartCards.jsx';
import CookieSectionBar from '../components/cookies/CookieSectionBar.jsx';
import CookieSectionsList from '../components/cookies/CookieSectionsList.jsx';
import CookiePoliciesLine from '../components/cookies/CookiePoliciesLine.jsx';
import CookieQuestionsBand from '../components/cookies/CookieQuestionsBand.jsx';
import CookiePrintDocument from '../components/cookies/CookiePrintDocument.jsx';
import CookieToast from '../components/cookies/CookieToast.jsx';
import FloatingWhatsApp from '../components/FAQ/common/FloatingWhatsApp';
import { scrollToAnchor } from '../utils/cookies/cookieFormatter.jsx';

// Import CSS
import '../styles/cookies/cookie-variables.css';
import '../styles/cookies/cookie-chrome.css';
import '../styles/cookies/cookie-hero.css';
import '../styles/cookies/cookie-start-cards.css';
import '../styles/cookies/cookie-section-bar.css';
import '../styles/cookies/cookie-body.css';
import '../styles/cookies/cookie-closing-band.css';
import '../styles/cookies/cookie-print.css';

const CookiePage = () => {
  const [toastState, setToastState] = useState({ message: '', isVisible: false });

  // Handle URL hash on initial load (Section 6)
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        scrollToAnchor(window.location.hash, true);
      }, 140);
    }
  }, []);

  const showToast = (message) => {
    setToastState({ message, isVisible: true });
    setTimeout(() => {
      setToastState(prev => ({ ...prev, isVisible: false }));
    }, 2400);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenCookieSettings = () => {
    if (typeof window !== 'undefined' && window.HOK_CONSENT) {
      window.HOK_CONSENT.open();
    } else {
      scrollToAnchor('#c-change', true);
    }
  };

  const handleJumpClause = (anchor) => {
    if (typeof anchor === 'string') {
      scrollToAnchor(anchor, true);
    } else if (anchor && anchor.anchor) {
      scrollToAnchor(anchor.anchor, true);
    }
  };

  return (
    <main className="cookie-page">
      {/* 1. Breadcrumb Navigation */}
      <CookieBreadcrumb />

      {/* 2. Hero & 5-Item Version Row (No search per Section 1.1) */}
      <CookieHero
        onPrint={handlePrint}
        onOpenCookieSettings={handleOpenCookieSettings}
      />

      {/* 3. Where to Start Cards (Section 5.3) */}
      <CookieStartCards />

      {/* 4. Sticky 6-Tab Section Bar (Section 5.4) */}
      <CookieSectionBar />

      {/* 5. Policy Body (Intro, Essentials, 6 Parts, 30 Clauses, 11 Cookie Rows, Clause 4 Definitions) */}
      <CookieSectionsList
        onShowToast={showToast}
        onJumpClause={handleJumpClause}
      />

      {/* 6. Policies Band (Our policies, Your choices, PDF link) */}
      <CookiePoliciesLine
        onPrint={handlePrint}
        onOpenCookieSettings={handleOpenCookieSettings}
      />

      {/* 7. Dark Questions Band (WhatsApp, Email, Grievance contact) */}
      <CookieQuestionsBand
        onShowToast={showToast}
        onJumpClause={handleJumpClause}
      />

      {/* 8. Floating Action Toast */}
      <CookieToast
        message={toastState.message}
        isVisible={toastState.isVisible}
      />

      {/* 9. Floating WhatsApp Widget */}
      <FloatingWhatsApp onShowToast={showToast} />

      {/* 10. Dedicated Clean A4 Print Document (Section 9) */}
      <CookiePrintDocument />
    </main>
  );
};

export default CookiePage;
