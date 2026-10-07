/**
 * House of Kaira - Deposit Policy Page
 * Complete Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React, { useState, useEffect, useCallback } from 'react';
import DepositBreadcrumb from '../components/deposit/DepositBreadcrumb.jsx';
import DepositHero from '../components/deposit/DepositHero.jsx';
import DepositTrackerCard from '../components/deposit/DepositTrackerCard.jsx';
import DepositSectionBar from '../components/deposit/DepositSectionBar.jsx';
import DepositIntro from '../components/deposit/DepositIntro.jsx';
import DepositGlance from '../components/deposit/DepositGlance.jsx';
import DepositWorkedExample from '../components/deposit/DepositWorkedExample.jsx';
import DepositSectionsList from '../components/deposit/DepositSectionsList.jsx';
import DepositRelatedPolicies from '../components/deposit/DepositRelatedPolicies.jsx';
import DepositClosingBand from '../components/deposit/DepositClosingBand.jsx';
import DepositPrintDocument from '../components/deposit/DepositPrintDocument.jsx';
import FloatingWhatsApp from '../components/FAQ/common/FloatingWhatsApp';

import { DEPOSIT_SECTIONS } from '../data/deposit/depositRegistry.js';
import { scrollToTarget, triggerJumpHighlight } from '../utils/deposit/depositScroll.js';

// Styles
import '../styles/deposit/deposit-variables.css';
import '../styles/deposit/deposit-chrome.css';
import '../styles/deposit/deposit-hero.css';
import '../styles/deposit/deposit-tracker.css';
import '../styles/deposit/deposit-section-bar.css';
import '../styles/deposit/deposit-body.css';
import '../styles/deposit/deposit-example.css';
import '../styles/deposit/deposit-sections.css';
import '../styles/deposit/deposit-related.css';
import '../styles/deposit/deposit-closing.css';
import '../styles/deposit/deposit-print.css';

const DepositPage = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [openQuestionIds, setOpenQuestionIds] = useState(() => new Set());
  const [activeExampleTabId, setActiveExampleTabId] = useState(null);

  // Set document title and meta description per Section 2
  useEffect(() => {
    document.title = 'Deposit Policy · House of Kaira';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'How your security deposit is held and returned at House of Kaira: when it is due, how to pay it, how each piece is inspected, and exactly what can and cannot be deducted.'
      );
    }
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2200);
  }, []);

  const handleToggleQuestion = useCallback((id) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#${id}`);
        }
      }
      return next;
    });
  }, []);

  const handleJump = useCallback((anchor, exampleTab) => {
    if (!anchor) return;
    const cleanId = anchor.replace(/^#/, '');

    if (exampleTab) {
      setActiveExampleTabId(exampleTab);
    }

    const isQuestion = DEPOSIT_SECTIONS.some((sec) =>
      sec.questions.some((q) => q.id === cleanId)
    );

    if (isQuestion) {
      setOpenQuestionIds((prev) => new Set(prev).add(cleanId));
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${cleanId}`);
      }
    }

    setTimeout(() => {
      const targetElement = document.getElementById(cleanId);
      if (targetElement) {
        scrollToTarget(targetElement, () => {
          if (isQuestion) {
            triggerJumpHighlight(targetElement);
          }
        });
      }
    }, 50);
  }, []);

  // Handle URL hash on initial page mount (deep links)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash) {
      const cleanId = hash.replace(/^#/, '');
      const isQuestion = DEPOSIT_SECTIONS.some((sec) =>
        sec.questions.some((q) => q.id === cleanId)
      );

      if (isQuestion) {
        setOpenQuestionIds((prev) => new Set(prev).add(cleanId));
      }

      setTimeout(() => {
        const el = document.getElementById(cleanId);
        if (el) {
          scrollToTarget(el, () => {
            if (isQuestion) {
              triggerJumpHighlight(el);
            }
          });
        }
      }, 350);
    }
  }, []);

  const handleSelectSection = useCallback((sectionId) => {
    setActiveSectionId(sectionId);
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      scrollToTarget(targetElement);
    }
  }, []);

  return (
    <main className="deposit-page">
      {/* 1. D1 Breadcrumb Navigation */}
      <DepositBreadcrumb />

      {/* 2. D2 Hero Band & D3 Page Search */}
      <DepositHero
        onSelectQuestion={handleJump}
        onShowToast={showToast}
      />

      {/* 3. D4 "Your deposit, every step of the way" Tracker Card */}
      <DepositTrackerCard
        onSelectStep={handleJump}
      />

      {/* 4. Policy Container: Holds sticky section bar & policy content so bar releases before related policies */}
      <div className="deposit-policy-container" id="deposit-policy-container">
        {/* D5 Sticky Section Bar */}
        <DepositSectionBar
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
        />

        {/* D6 Body Column: Intro, Glance, Worked Example & 9 Policy Sections */}
        <div className="dp-body">
          {/* D6 Opening Intro Paragraph */}
          <DepositIntro />

          {/* D7 Your deposit at a glance (6 Brief Rows) */}
          <DepositGlance onSelectRow={handleJump} />

          {/* D9 Your deposit, in practice (Worked Example 4-Tab Card) */}
          <DepositWorkedExample
            activeTabId={activeExampleTabId}
            onTabChange={setActiveExampleTabId}
          />

          {/* D10 & D11: 9 Policy Sections, Question Accordion & Answer Footers */}
          <DepositSectionsList
            sections={DEPOSIT_SECTIONS}
            openQuestionIds={openQuestionIds}
            onToggleQuestion={handleToggleQuestion}
            onJump={handleJump}
            onShowToast={showToast}
          />
        </div>
      </div>

      {/* 5. D12 Related Policies & Last Reviewed */}
      <DepositRelatedPolicies />

      {/* 6. D13 "Can't find your answer?" Closing Band */}
      <DepositClosingBand onShowToast={showToast} />

      {/* 7. Section 6.10 Dedicated Print & PDF Document */}
      <DepositPrintDocument />

      {/* Floating WhatsApp Support Button */}
      <FloatingWhatsApp />

      {/* 2.2s Site Toast Notification */}
      {isToastVisible && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#1A1612',
            color: '#FAF7F2',
            padding: '12px 20px',
            borderRadius: '2px',
            fontSize: '12px',
            fontFamily: 'DM Sans, sans-serif',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
          }}
        >
          {toastMessage}
        </div>
      )}
    </main>
  );
};

export default DepositPage;
