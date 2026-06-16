import React from 'react';
import '../../styles/howitworks/policies-section.css';

const PoliciesSection = () => {
  const policies = [
    {
      id: 'deposits',
      title: 'Deposits & Refunds',
      link: 'Deposit Policy →',
      body: 'A refundable security deposit is charged at rental checkout. Once the piece is returned and inspected, your deposit is refunded within 3 working days. No chasing required.',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.3 8.7c0 3.3-2.3 5-5 6a0.7 0.7 0 0 1-0.4 0c-2.7-1-5-2.7-5-6V4a0.7 0.7 0 0 1 0.7-0.7c1.3 0 3-0.8 4.2-1.8a0.8 0.8 0 0 1 1 0c1.2 1 2.9 1.8 4.2 1.8a0.7 0.7 0 0 1 0.7 0.7v4.7z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      )
    },
    {
      id: 'care',
      title: 'Care & Cleaning',
      link: 'Care Policy →',
      body: 'All rental pieces are professionally dry-cleaned before dispatch. After your event, return the piece in its original packaging – post-rental cleaning is managed entirely by HOK. Please don\'t clean the piece yourself.',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 14v-5.3a0.7 0.7 0 0 0-0.7-0.7H6.7a0.7 0.7 0 0 0-0.7 0.7V14" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 6.7a1.3 1.3 0 0 1 0.5-1l4.7-4a1.3 1.3 0 0 1 1.6 0l4.7 4a1.3 1.3 0 0 1 0.5 1v6a1.3 1.3 0 0 1-1.3 1.3H3.3A1.3 1.3 0 0 1 2 12.7V6.7z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      )
    },
    {
      id: 'disclosure',
      title: 'Honest Disclosure',
      link: 'Seller Guidelines →',
      body: 'Every preloved listing requires a mandatory Honest Disclosure block – condition, wear count, alterations, any damage. No preloved listing goes live without it. You always know exactly what you\'re buying.',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1.3 3.3l4.7-1.3 4.7 1.3 4.7-1.3v10.7l-4.7 1.3-4.7-1.3-4.7 1.3V3.3z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 2v12" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 2v12" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: 'pricing',
      title: 'Pricing & GST',
      link: 'Pricing & Fees →',
      body: 'Rental fees and preloved prices are shown exclusive of GST – tax is calculated and added at checkout (18% GST for rentals, 5% for preloved pieces). Delivery charges are always shown before payment – never as a surprise.',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="3.3" width="13" height="9.3" rx="1" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1.5" x2="14.5" y1="6.3" y2="6.3" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      )
    },
    {
      id: 'cancellations',
      title: 'Cancellations',
      link: 'Cancellation Policy →',
      body: 'Cancellation windows and refund eligibility vary by mode and timing. Our policy is designed to be fair to both shopper and list. Full terms in the cancellation policy document.',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M14.7 11.3a1.3 1.3 0 0 1-1.3 1.3H4.6a1.3 1.3 0 0 0-0.9.4l-1.4 1.4a0.5 0.5 0 0 1-0.5-0.5V3.3a1.3 1.3 0 0 1 1.3-1.3h10.3a1.3 1.3 0 0 1 1.3 1.3v8z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      )
    },
    {
      id: 'damage',
      title: 'Lister – Damage & Returns',
      link: 'Damage Policy →',
      body: 'If a renter returns a piece with damage beyond normal wear, the relevant deduction is made from their deposit – not from your earnings as a list. Your payout is always protected.',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M7.7 1.5a0.35 0.35 0 0 1 0.6 0l1.5 3a1.4 1.4 0 0 0 1.1 0.7l3.4 0.5a0.35 0.35 0 0 1 0.2 0.6l-2.5 2.4a1.4 1.4 0 0 0-0.4 1.2l0.6 3.3a0.35 0.35 0 0 1-0.5 0.4l-3-1.6a1.4 1.4 0 0 0-1.3 0l-3 1.6a0.35 0.35 0 0 1-0.5-0.4l0.6-3.3a1.4 1.4 0 0 0-0.4-1.2L1.1 6.3a0.35 0.35 0 0 1 0.2-0.6l3.4-0.5a1.4 1.4 0 0 0 1.1-0.7z" stroke="#1A1612" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      )
    }
  ];

  return (
    <section id="section-pol" className="hok-hiw-sec hok-hiw-policies">
      {/* Header */}
      <div className="hok-hiw-pol-header">
        <div className="hok-hiw-pol-header-left">
          <h2 className="hok-hiw-pol-title">
            Everything is <em>taken care of. </em>
          </h2>
        </div>
        <div className="hok-hiw-pol-header-right">
          <p className="hok-hiw-pol-desc">
            The details that matter — deposits, cleaning, honest disclosure, cancellations —
            handled transparently and without fuss. Full policy documents are linked below.
          </p>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="hok-hiw-pol-grid">
        {policies.map((policy) => (
          <div key={policy.id} className="hok-hiw-pol-card">
            {/* Icon */}
            <div className="hok-hiw-pol-icon">
              {policy.icon}
            </div>

            {/* Title */}
            <h3 className="hok-hiw-pol-card-title">{policy.title}</h3>

            {/* Body */}
            <p className="hok-hiw-pol-card-body">{policy.body}</p>

            {/* Link */}
            <a href="#" className="hok-hiw-pol-card-link">
              {policy.link}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PoliciesSection;