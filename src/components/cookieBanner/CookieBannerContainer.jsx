/**
 * House of Kaira - Cookie Banner Main Container & Controller
 * Build Specification v1.0 (hok_cookie_banner_spec_v1.docx)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import CookieFirstView from './CookieFirstView.jsx';
import CookieSettingsView from './CookieSettingsView.jsx';
import CookieSavedNote from './CookieSavedNote.jsx';
import {
  COOKIE_BANNER_CONFIG,
  formatSavedDate,
  generateSavedNoteMessage
} from '../../data/cookieBanner/cookieBannerConfig.js';
import {
  getStoredConsent,
  saveConsentRecord
} from '../../utils/cookieBanner/cookieConsentStorage.js';
import {
  HOK_CONSENT,
  notifyConsentSettled
} from '../../utils/cookieBanner/consentManager.js';

// Stylesheets
import '../../styles/cookieBanner/cookie-banner-variables.css';
import '../../styles/cookieBanner/cookie-banner-card.css';
import '../../styles/cookieBanner/cookie-settings-panel.css';
import '../../styles/cookieBanner/cookie-saved-note.css';
import '../../styles/cookieBanner/cookie-banner-responsive.css';

const CookieBannerContainer = () => {
  const [viewMode, setViewMode] = useState('hidden'); // 'hidden' | 'first-view' | 'settings' | 'saved-note'
  const [isCardLeaving, setIsCardLeaving] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [savedNoteMsg, setSavedNoteMsg] = useState('');
  const [openedFromFooter, setOpenedFromFooter] = useState(false);

  const containerRef = useRef(null);
  const triggerElementRef = useRef(null);

  // 1. Initial Mount Check & 1,000ms Delay on First Visit (Section 4.5 & 10.2)
  useEffect(() => {
    const existing = getStoredConsent();
    setCurrentRecord(existing);

    if (!existing) {
      const timer = setTimeout(() => {
        setViewMode('first-view');
      }, COOKIE_BANNER_CONFIG.arriveDelayMs);

      return () => clearTimeout(timer);
    } else {
      notifyConsentSettled(existing);
    }
  }, []);

  // 2. Listen to custom event to reopen Cookie settings (Section 10.9)
  useEffect(() => {
    const handleOpenSettings = () => {
      triggerElementRef.current = document.activeElement;
      const latest = getStoredConsent();
      setCurrentRecord(latest);
      setOpenedFromFooter(Boolean(latest));
      setIsCardLeaving(false);
      setViewMode('settings');
    };

    window.addEventListener('hok_open_cookie_settings', handleOpenSettings);
    return () => {
      window.removeEventListener('hok_open_cookie_settings', handleOpenSettings);
    };
  }, []);

  // 3. Coordinate Floating WhatsApp Button (Section 3.3)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;

    if (viewMode === 'first-view') {
      whatsappBtn.classList.add('cb-wa-lift');
      whatsappBtn.classList.remove('cb-wa-fade');
    } else if (viewMode === 'settings') {
      whatsappBtn.classList.add('cb-wa-fade');
      whatsappBtn.classList.remove('cb-wa-lift');
    } else {
      whatsappBtn.classList.remove('cb-wa-lift', 'cb-wa-fade');
    }

    return () => {
      whatsappBtn.classList.remove('cb-wa-lift', 'cb-wa-fade');
    };
  }, [viewMode]);

  // 4. Save & Transition Handlers
  const applyChoiceAndShowNote = useCallback((choices, howMethod) => {
    setIsCardLeaving(true);

    const saved = saveConsentRecord(choices, howMethod);
    setCurrentRecord(saved);
    notifyConsentSettled(saved);

    const noteMessage = generateSavedNoteMessage(choices);
    setSavedNoteMsg(noteMessage);

    // Section 4.5: Note arrives 280ms after card starts leaving
    setTimeout(() => {
      setViewMode('saved-note');
      setIsCardLeaving(false);
    }, 280);
  }, []);

  // Choose "Only essential"
  const handleChooseEssential = useCallback(() => {
    applyChoiceAndShowNote(
      { functional: false, personalisation: false, analytics: false, marketing: false },
      'only-essential'
    );
  }, [applyChoiceAndShowNote]);

  // Choose "Allow all"
  const handleChooseAllowAll = useCallback(() => {
    applyChoiceAndShowNote(
      { functional: true, personalisation: true, analytics: true, marketing: true },
      'allowall'
    );
  }, [applyChoiceAndShowNote]);

  // Save custom choices from settings
  const handleSaveSettings = useCallback((choices) => {
    applyChoiceAndShowNote(choices, 'settings');
  }, [applyChoiceAndShowNote]);

  // Card Close Button (×) or Escape key (Section 10.1 & 10.5)
  const handleCloseCard = useCallback(() => {
    if (!currentRecord) {
      // First visit: close is recorded as Only essential with method "closed"
      applyChoiceAndShowNote(
        { functional: false, personalisation: false, analytics: false, marketing: false },
        'closed'
      );
    } else {
      // Reopened with saved choice: close changes nothing and shows no note
      setIsCardLeaving(true);
      setTimeout(() => {
        setViewMode('hidden');
        setIsCardLeaving(false);
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
          triggerElementRef.current.focus();
        }
      }, 550);
    }
  }, [currentRecord, applyChoiceAndShowNote]);

  // Back button in settings (Section 6.1 & 10.7)
  const handleBackFromSettings = useCallback(() => {
    if (openedFromFooter) {
      // Opened from footer: Back means close
      setIsCardLeaving(true);
      setTimeout(() => {
        setViewMode('hidden');
        setIsCardLeaving(false);
        if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
          triggerElementRef.current.focus();
        }
      }, 550);
    } else {
      // Opened from first view card: returns to first view
      setViewMode('first-view');
    }
  }, [openedFromFooter]);

  // Keyboard Escape listener (Section 10.1 & 14)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (viewMode === 'first-view' || viewMode === 'settings')) {
        e.preventDefault();
        handleCloseCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewMode, handleCloseCard]);

  // Cross-tab visibility sync (Section 15: Check cookie on visibilitychange)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const latest = getStoredConsent();
        if (latest && !currentRecord) {
          setCurrentRecord(latest);
          setViewMode('hidden');
          notifyConsentSettled(latest);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentRecord]);

  if (viewMode === 'hidden') {
    return null;
  }

  if (viewMode === 'saved-note') {
    return (
      <CookieSavedNote
        message={savedNoteMsg}
        onDismiss={() => setViewMode('hidden')}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`cb-banner-region ${isCardLeaving ? 'cb-animate-leave' : 'cb-animate-arrive'}`}
      role="region"
      aria-label="Cookie choices"
    >
      <div className="cb-card-surface">
        {/* 4.3 The Keyline Frame */}
        <div className="cb-keyline-frame" aria-hidden="true" />

        {/* View Switcher: First View vs Settings */}
        {viewMode === 'first-view' ? (
          <CookieFirstView
            onClose={handleCloseCard}
            onChooseEssential={handleChooseEssential}
            onChooseAllowAll={handleChooseAllowAll}
            onOpenSettings={() => {
              setOpenedFromFooter(false);
              setViewMode('settings');
            }}
          />
        ) : (
          <CookieSettingsView
            hasSavedChoice={Boolean(currentRecord)}
            savedDateText={formatSavedDate(currentRecord?.t)}
            initialChoices={currentRecord?.c || {}}
            onBack={handleBackFromSettings}
            onClose={handleCloseCard}
            onSaveChoices={handleSaveSettings}
            onQuickEssential={handleChooseEssential}
            onQuickAllowAll={handleChooseAllowAll}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(CookieBannerContainer);
