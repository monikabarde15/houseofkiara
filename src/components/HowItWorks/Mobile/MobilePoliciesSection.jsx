import React from "react";
import "../../../styles/howitworks/mobile/mobile-policies-section.css";

const MobilePoliciesSection = ({ getVal }) => {
  const policies = [
    {
      id: "deposits",
      title: getVal ? getVal("hiw_card_0_title", "Deposits & Refunds") : "Deposits & Refunds",
      link: "Deposit Policy →",
      body: getVal ? getVal("hiw_card_0_body", "A refundable security deposit is charged at rental checkout. Once the piece is returned and inspected, your deposit is refunded within 3 working days. No chasing required.") : "A refundable security deposit is charged at rental checkout...",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.3 8.7c0 3.3-2.3 5-5 6a0.7 0.7 0 0 1-0.4 0c-2.7-1-5-2.7-5-6V4a0.7 0.7 0 0 1 0.7-0.7c1.3 0 3-0.8 4.2-1.8a0.8 0.8 0 0 1 1 0c1.2 1 2.9 1.8 4.2 1.8a0.7 0.7 0 0 1 0.7 0.7v4.7z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "care",
      title: getVal ? getVal("hiw_card_1_title", "Care & Cleaning") : "Care & Cleaning",
      link: "Care Policy →",
      body: getVal ? getVal("hiw_card_1_body", "All rental pieces are professionally dry-cleaned before dispatch. After your event, return the piece in its original packaging – post-rental cleaning is managed entirely by HOK. Please don't clean the piece yourself.") : "All rental pieces are professionally dry-cleaned before dispatch...",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 14v-5.3a0.7 0.7 0 0 0-0.7-0.7H6.7a0.7 0.7 0 0 0-0.7 0.7V14" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 6.7a1.3 1.3 0 0 1 0.5-1l4.7-4a1.3 1.3 0 0 1 1.6 0l4.7 4a1.3 1.3 0 0 1 0.5 1v6a1.3 1.3 0 0 1-1.3 1.3H3.3A1.3 1.3 0 0 1 2 12.7V6.7z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "disclosure",
      title: getVal ? getVal("hiw_card_2_title", "Honest Disclosure") : "Honest Disclosure",
      link: "Seller Guidelines →",
      body: getVal ? getVal("hiw_card_2_body", "Every preloved listing requires a mandatory Honest Disclosure block – condition, wear count, alterations, any damage. No preloved listing goes live without it. You always know exactly what you're buying.") : "Every preloved listing requires a mandatory Honest Disclosure block...",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1.3 3.3l4.7-1.3 4.7 1.3 4.7-1.3v10.7l-4.7 1.3-4.7-1.3-4.7 1.3V3.3z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "sizing",
      title: getVal ? getVal("hiw_card_3_title", "Fitting & Measurements") : "Fitting & Measurements",
      link: "Size Guide →",
      body: getVal ? getVal("hiw_card_3_body", "Every piece displays exact garment dimensions, not just label sizes. Blouse allowances, lehenga waistbands, and lengths are detailed clearly.") : "Every piece displays exact garment dimensions...",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.7 8h10.6M8 2.7v10.6" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "auth",
      title: getVal ? getVal("hiw_card_4_title", "Authenticity Guarantee") : "Authenticity Guarantee",
      link: "Terms & Conditions →",
      body: getVal ? getVal("hiw_card_4_body", "Every silhouette passes physical verification by our master craftsmen in Indore before dispatch. Zero counterfeit tolerance across rentals and preloved.") : "Every silhouette passes physical verification...",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#1A1612" strokeWidth="1.3" />
          <path d="M5.5 8l1.8 1.8 3.2-3.6" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "delivery",
      title: getVal ? getVal("hiw_card_5_title", "Nationwide Delivery") : "Nationwide Delivery",
      link: "Shipping Policy →",
      body: getVal ? getVal("hiw_card_5_body", "Complimentary insured shipping on orders of ₹5,000 or more across India. Pre-paid tamper-evident return packaging included with every booking.") : "Complimentary insured shipping...",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="#1A1612" strokeWidth="1.3" />
          <path d="M2 7h12" stroke="#1A1612" strokeWidth="1.3" />
        </svg>
      ),
    },
  ];

  return (
    <section id="section-pol" className="hok-hiw-mobile-policies">
      {/* Header */}
      <div className="hok-hiw-mobile-pol-header">
        <h2 className="hok-hiw-mobile-pol-title">{getVal && getVal("hiw_gtk_heading", null) ? getVal("hiw_gtk_heading") : <>Everything in <em>plain sight</em></>}</h2>
        <p className="hok-hiw-mobile-pol-desc">
          The details that matter – handled transparently. Full policy documents
          are linked below.
        </p>
      </div>

      {/* Policies Stack */}
      <div className="hok-hiw-mobile-pol-stack">
        {policies.map((policy) => (
          <div key={policy.id} className="hok-hiw-mobile-pol-card">
            {/* Icon */}
            <div className="hok-hiw-mobile-pol-icon">{policy.icon}</div>

            {/* Title */}
            <h3 className="hok-hiw-mobile-pol-card-title">{policy.title}</h3>

            {/* Body */}
            <p className="hok-hiw-mobile-pol-card-body">{policy.body}</p>

            {/* Link */}
            <a href="#" className="hok-hiw-mobile-pol-card-link">
              {policy.link}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MobilePoliciesSection;
