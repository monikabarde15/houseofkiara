import React from "react";
import ContactBreadcrumb from "./ContactBreadcrumb";
import ContactLiveStatus from "./ContactLiveStatus";
import ContactReachCard from "./ContactReachCard";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";

export default function ContactHero({
  showCallRow = true,
  onShowToast,
  contactSettings,
  getVal,
}) {
  const defaultHero = CONTACT_CONTENT.hero;
  const eyebrow = getVal ? getVal("contact_eyebrow", defaultHero.eyebrow) : defaultHero.eyebrow;
  const title = getVal ? getVal("contact_heading", defaultHero.title) : defaultHero.title;
  const lead = getVal ? getVal("contact_lead", defaultHero.lead) : defaultHero.lead;

  return (
    <section className="hero" aria-labelledby="contact-hero-heading">
      {/* Breadcrumb inside the band above the two-column grid (Section 5.1) */}
      <ContactBreadcrumb />

      <div className="hero-in">
        {/* Left Column: Eyebrow, Title, Lead and Live Status */}
        <div className="hero-left">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="h1" id="contact-hero-heading">
            {title}
          </h1>
          <p className="lead">{lead}</p>

          {/* Live Status Engine */}
          <ContactLiveStatus getVal={getVal} contactSettings={contactSettings} />
        </div>

        {/* Right Column: Ways to reach us card */}
        <div className="hero-right">
          <ContactReachCard
            showCallRow={showCallRow}
            onShowToast={onShowToast}
            contactSettings={contactSettings}
            getVal={getVal}
          />
        </div>
      </div>
    </section>
  );
}
