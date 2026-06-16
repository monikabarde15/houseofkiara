import React from 'react';
import '../../../styles/howitworks/mobile/mobile-policies-section.css';

const MobilePoliciesSection = () => {
  const policies = [
    {
      id: 'deposits',
      title: 'Deposits & Refunds',
      link: 'Deposit Policy →',
      body: 'A refundable security deposit is charged at rental checkout. Once the piece is returned and inspected, your deposit is refunded within 3 working days. No chasing required.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11.6 7.6c0 2.9-2 4.4-4.4 5.3a0.6 0.6 0 0 1-0.4 0c-2.4-0.9-4.4-2.4-4.4-5.3V3.5a0.6 0.6 0 0 1 0.6-0.6c1.1 0 2.6-0.7 3.7-1.6a0.7 0.7 0 0 1 0.9 0c1.1 0.9 2.6 1.6 3.7 1.6a0.6 0.6 0 0 1 0.6 0.6v4.1z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'care',
      title: 'Care & Cleaning',
      link: 'Care Policy →',
      body: 'All rental pieces are professionally dry-cleaned before dispatch. After your event, return the piece in its original packaging – post-rental cleaning is managed entirely by HOK. Please don\'t clean the piece yourself.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M8.8 12.3V7.7a0.6 0.6 0 0 0-0.6-0.6H5.8a0.6 0.6 0 0 0-0.6 0.6v4.6" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.8 5.9a1.1 1.1 0 0 1 0.4-0.9l4.1-3.5a1.1 1.1 0 0 1 1.4 0l4.1 3.5a1.1 1.1 0 0 1 0.4 0.9v5.3a1.1 1.1 0 0 1-1.1 1.1H2.9a1.1 1.1 0 0 1-1.1-1.1V5.9z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'disclosure',
      title: 'Honest Disclosure',
      link: 'Seller Guidelines →',
      body: 'Every preloved listing requires a mandatory Honest Disclosure block – condition, wear count, alterations, any damage. No preloved listing goes live without it. You always know exactly what you\'re buying.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1.1 2.9l4.1-1.1 4.1 1.1 4.1-1.1v9.4l-4.1 1.1-4.1-1.1-4.1 1.1V2.9z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.3 1.8v10.5" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.8 1.8v10.5" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'pricing',
      title: 'Pricing & GST',
      link: 'Pricing & Fees →',
      body: 'Rental fees and preloved prices are shown exclusive of GST – tax is calculated and added at checkout (18% GST for rentals, 5% for preloved pieces). Delivery charges are always shown before payment – never as a surprise.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1.3" y="2.9" width="11.4" height="8.2" rx="0.9" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1.3" x2="12.7" y1="5.5" y2="5.5" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'cancellations',
      title: 'Cancellations',
      link: 'Cancellation Policy →',
      body: 'Cancellation windows and refund eligibility vary by mode and timing. Our policy is designed to be fair to both shopper and list. Full terms in the cancellation policy document.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M12.9 9.9a1.1 1.1 0 0 1-1.1 1.1H4a1.1 1.1 0 0 0-0.8 0.4l-1.2 1.2a0.4 0.4 0 0 1-0.4-0.4V2.9a1.1 1.1 0 0 1 1.1-1.1h9.1a1.1 1.1 0 0 1 1.1 1.1v7z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'damage',
      title: 'Lister – Damage & Returns',
      link: 'Damage Policy →',
      body: 'If a renter returns a piece with damage beyond normal wear, the relevant deduction is made from their deposit – not from your earnings as a list. Your payout is always protected.',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M6.8 1.3a0.3 0.3 0 0 1 0.5 0l1.3 2.6a1.2 1.2 0 0 0 1 0.6l3 0.4a0.3 0.3 0 0 1 0.2 0.5l-2.2 2.1a1.2 1.2 0 0 0-0.4 1.1l0.5 2.9a0.3 0.3 0 0 1-0.4 0.3l-2.6-1.4a1.2 1.2 0 0 0-1.1 0l-2.6 1.4a0.3 0.3 0 0 1-0.4-0.3l0.5-2.9a1.2 1.2 0 0 0-0.4-1.1L0.9 5.4a0.3 0.3 0 0 1 0.2-0.5l3-0.4a1.2 1.2 0 0 0 1-0.6z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section id="section-pol" className="hok-hiw-mobile-policies">
      {/* Header */}
      <div className="hok-hiw-mobile-pol-header">
        <h2 className="hok-hiw-mobile-pol-title">
          Everything is taken care of. <em>Always.</em>
        </h2>
        <p className="hok-hiw-mobile-pol-desc">
          The details that matter – handled transparently. Full policy documents are linked below.
        </p>
      </div>

      {/* Policies Stack */}
      <div className="hok-hiw-mobile-pol-stack">
        {policies.map((policy) => (
          <div key={policy.id} className="hok-hiw-mobile-pol-card">
            {/* Icon */}
            <div className="hok-hiw-mobile-pol-icon">
              {policy.icon}
            </div>
            
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