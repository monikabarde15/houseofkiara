/**
 * House of Kaira - Privacy Policy Page
 * Complete Build Specification v2.0 (hok_privacy_v2)
 */

import React, { useState, useEffect } from 'react';
import PrivacyBreadcrumb from '../components/privacy/PrivacyBreadcrumb.jsx';
import PrivacyHero from '../components/privacy/PrivacyHero.jsx';
import PrivacyStartCards from '../components/privacy/PrivacyStartCards.jsx';
import PrivacySectionBar from '../components/privacy/PrivacySectionBar.jsx';
import PrivacyOpeningIntro from '../components/privacy/PrivacyOpeningIntro.jsx';
import PrivacyEssentials from '../components/privacy/PrivacyEssentials.jsx';
import PrivacySectionsList from '../components/privacy/PrivacySectionsList.jsx';
import PrivacyPoliciesLine from '../components/privacy/PrivacyPoliciesLine.jsx';
import PrivacyQuestionsBand from '../components/privacy/PrivacyQuestionsBand.jsx';
import PrivacyPrintDocument from '../components/privacy/PrivacyPrintDocument.jsx';
import PrivacyToast from '../components/privacy/PrivacyToast.jsx';
import FloatingWhatsApp from '../components/FAQ/common/FloatingWhatsApp';
import { scrollToAnchor } from '../utils/privacy/privacyFormatter.jsx';

// Import CSS
import '../styles/privacy/privacy-variables.css';
import '../styles/privacy/privacy-chrome.css';
import '../styles/privacy/privacy-hero.css';
import '../styles/privacy/privacy-start-cards.css';
import '../styles/privacy/privacy-section-bar.css';
import '../styles/privacy/privacy-body.css';
import '../styles/privacy/privacy-closing-band.css';
import '../styles/privacy/privacy-print.css';

const PrivacyPage = () => {
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

  const handleSelectClause = (clauseItem) => {
    if (clauseItem && clauseItem.anchor) {
      scrollToAnchor(clauseItem.anchor, true);
    }
  };

  const handleSelectPart = (partItem) => {
    if (partItem && partItem.anchor) {
      scrollToAnchor(partItem.anchor, false); // Section 5.5: Parts are not highlighted
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="privacy-page">
      {/* 1. Breadcrumb Navigation */}
      <PrivacyBreadcrumb />

      {/* 2. Hero & Real-Time Search */}
      <PrivacyHero
        onSelectClause={handleSelectClause}
        onPrint={handlePrint}
        onShowToast={showToast}
      />

      {/* 3. Where to Start 3-Card Quick Entry */}
      <PrivacyStartCards
        onSelectCard={handleSelectPart}
      />

      {/* 4. Sticky Section Navigation Bar with Active Spy */}
      <PrivacySectionBar
        onSelectPart={handleSelectPart}
      />

      {/* 5. Main Policy Content Column */}
      <div className="privacy-main-container" id="privacy-content">
        {/* 5.1 Opening Introductory Paragraph */}
        <PrivacyOpeningIntro />

        {/* 5.2 The Essentials (8 Core Summary Principles) */}
        <PrivacyEssentials onSelectClause={handleSelectClause} />

        {/* 5.3 Complete 10 Parts with 47 Clauses, Definitions & Register Rows */}
        <PrivacySectionsList
          onShowToast={showToast}
          onJumpClause={handleSelectClause}
        />

        {/* 5.4 Our Policies & Your Choices Footer Links */}
        <PrivacyPoliciesLine
          onPrint={handlePrint}
          onJumpClause={handleSelectClause}
        />
      </div>

      {/* 6. Dark Questions Band (Contact Channels & Grievance Redressal) */}
      <PrivacyQuestionsBand
        onShowToast={showToast}
        onJumpClause={handleSelectClause}
      />

      {/* 7. Dedicated Clean A4 Print Document */}
      <PrivacyPrintDocument />

      {/* 8. Floating Action Toast */}
      <PrivacyToast
        message={toastState.message}
        isVisible={toastState.isVisible}
      />

      {/* 9. Floating WhatsApp Widget */}
      <FloatingWhatsApp onShowToast={showToast} />
    </main>
  );
};

export default PrivacyPage;
