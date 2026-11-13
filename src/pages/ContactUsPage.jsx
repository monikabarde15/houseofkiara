import React, { useEffect, useState, useRef } from "react";
import { CONTACT_PAGE_CONFIG } from "../data/contact/contactSettings";
import { usePageContent } from "../hooks/usePageContent";
import {
  getContactSettings,
  defaultContactConfig,
} from "../services/contactApi";

import ContactHero from "../components/contact/ContactHero";
import ContactAnswersSection from "../components/contact/ContactAnswersSection";
import ContactWriteSection from "../components/contact/ContactWriteSection";
import ContactLegalSection from "../components/contact/ContactLegalSection";

import "../styles/contact/contact-variables.css";
import "../styles/contact/contact-chrome.css";
import "../styles/contact/contact-hero.css";

export default function ContactUsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [contactSettings, setContactSettings] = useState(defaultContactConfig);
  const toastTimeoutRef = useRef(null);

  // Load dynamic content from PostgreSQL via pages API
  const { getVal } = usePageContent("/contact");

  // Set document title & meta description
  useEffect(() => {
    document.title = getVal("contact_page_title", CONTACT_PAGE_CONFIG.title);
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = CONTACT_PAGE_CONFIG.meta_description;
  }, [getVal]);

  // Subscribe to global Site Settings contact updates
  useEffect(() => {
    let isMounted = true;
    getContactSettings().then((cfg) => {
      if (isMounted && cfg) {
        setContactSettings(cfg);
      }
    });

    const handleUpdated = (e) => {
      if (e.detail) {
        setContactSettings(e.detail);
      } else {
        getContactSettings(true).then((cfg) => {
          if (isMounted && cfg) {
            setContactSettings(cfg);
          }
        });
      }
    };

    window.addEventListener("hok_contact_updated", handleUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("hok_contact_updated", handleUpdated);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (msg = "Email address copied") => {
    setToastMessage(msg);
    setIsToastVisible(true);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2600);
  };

  return (
    <div className="cu-page" id="contact-us-page">
      {/* Skip link for keyboard accessibility (Section 13.1) */}
      <a href="#cu-main" className="skip">
        Skip to contact details
      </a>

      {/* Main page content container */}
      <main id="cu-main" role="main">
        {/* Step 2: Band 1 Hero & Ways to reach us */}
        <ContactHero
          showCallRow={CONTACT_PAGE_CONFIG.adminSwitches.showCallRow}
          onShowToast={showToast}
          contactSettings={contactSettings}
          getVal={getVal}
        />

        {/* Step 3: Band 2 Answers Policy Index */}
        <ContactAnswersSection getVal={getVal} />

        {/* Step 4 & 5: Band 3 Write us a note and Aside */}
        <ContactWriteSection
          showVisitCard={CONTACT_PAGE_CONFIG.adminSwitches.showVisitCard}
          contactSettings={contactSettings}
          getVal={getVal}
        />

        {/* Step 6: Band 4 Raising a concern and Our details */}
        <ContactLegalSection getVal={getVal} contactSettings={contactSettings} />
      </main>

      {/* Polite toast feedback container (Section 10.1) */}
      <div
        className={`toast ${isToastVisible ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>
    </div>
  );
}
