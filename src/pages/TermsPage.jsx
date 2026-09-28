import React, { useState, useEffect } from 'react';
import TermsBreadcrumb from '../components/terms/TermsBreadcrumb.jsx';
import TermsHero from '../components/terms/TermsHero.jsx';
import WhereToStartCards from '../components/terms/WhereToStartCards.jsx';
import TermsSectionBar from '../components/terms/TermsSectionBar.jsx';
import TermsOpeningIntro from '../components/terms/TermsOpeningIntro.jsx';
import TheEssentials from '../components/terms/TheEssentials.jsx';
import TermsSectionsList from '../components/terms/TermsSectionsList.jsx';
import TermsPoliciesLine from '../components/terms/TermsPoliciesLine.jsx';
import TermsQuestionsBand from '../components/terms/TermsQuestionsBand.jsx';
import TermsPrintDocument from '../components/terms/TermsPrintDocument.jsx';
import TermsToast from '../components/terms/TermsToast.jsx';
import FloatingWhatsApp from '../components/FAQ/common/FloatingWhatsApp';
import { scrollToClause } from '../utils/terms/termsFormatter.jsx';

// Import CSS
import '../styles/terms/terms-variables.css';
import '../styles/terms/terms-chrome.css';
import '../styles/terms/terms-hero.css';
import '../styles/terms/terms-start-cards.css';
import '../styles/terms/terms-section-bar.css';
import '../styles/terms/terms-body.css';
import '../styles/terms/terms-closing-band.css';
import '../styles/terms/terms-print.css';

/**
 * House of Kaira - Terms & Conditions Page
 * Complete Build Specification v3.0 (hok_terms_v4)
 */
const TermsPage = () => {
  const [toastState, setToastState] = useState({ message: '', isVisible: false });

  // Handle URL hash on initial load
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        scrollToClause(window.location.hash);
      }, 300);
    }
  }, []);

  const showToast = (message) => {
    setToastState({ message, isVisible: true });
    setTimeout(() => {
      setToastState(prev => ({ ...prev, isVisible: false }));
    }, 2800);
  };

  const handleSelectClause = (clauseItem) => {
    if (clauseItem && clauseItem.anchor) {
      scrollToClause(clauseItem.anchor);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="terms-page terms-theme">
      {/* 1. Breadcrumb Navigation */}
      <TermsBreadcrumb />

      {/* 2. Hero & Real-Time Search */}
      <TermsHero
        onSelectClause={handleSelectClause}
        onPrint={handlePrint}
      />

      {/* 3. Where to Start 3-Card Quick Entry */}
      <WhereToStartCards />

      {/* 4. Sticky Section Navigation Bar with Active Spy */}
      <TermsSectionBar />

      {/* 5. Main Terms Content Column */}
      <div className="terms-main-container" id="terms-content">
        {/* 5.1 Opening Introductory Paragraph */}
        <TermsOpeningIntro />

        {/* 5.2 The Essentials (8 Core Summary Principles) */}
        <TheEssentials onSelectClause={handleSelectClause} />

        {/* 5.3 Complete 12 Parts & 59 Clauses */}
        <TermsSectionsList onShowToast={showToast} />

        {/* 5.4 Our Policies Footer Links & Document Metadata */}
        <TermsPoliciesLine onPrint={handlePrint} />
      </div>

      {/* 6. Questions Band (Contact Channels & Grievance Redressal) */}
      <TermsQuestionsBand onShowToast={showToast} />

      {/* 7. Dedicated Clean A4 Print Document */}
      <TermsPrintDocument />

      {/* 8. Floating Action Toast */}
      <TermsToast
        message={toastState.message}
        isVisible={toastState.isVisible}
      />

      {/* 9. Floating WhatsApp Widget */}
      <FloatingWhatsApp onShowToast={showToast} />
    </main>
  );
};

export default TermsPage;
