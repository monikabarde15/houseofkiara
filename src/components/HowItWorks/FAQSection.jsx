import React, { useState } from 'react';
import '../../styles/howitworks/faq-section.css';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What sizes are available? How do I know it will fit?',
      answer: (
        <>
          Every listing shows actual garment measurements - not just a label size. Many Indian occasion wear pieces have blouse allowances or lehenga adjustability that we detail in the listing. If you're unsure before booking, message us. Sizing is the question we take most seriously.
        </>
      )
    },
    {
      question: 'How far in advance should I book a rental?',
      answer: (
        <>
          We recommend at least <strong>7-10 days</strong> before your event for comfortable delivery logistics. During peak wedding season (November to February, and the April-June window), booking 3-4 weeks ahead is advisable for the most in-demand pieces. Once booked, your dates are locked - no one else can take that piece.
        </>
      )
    },
    {
      question: 'Can the same piece be listed for both rental and resale?',
      answer: (
        <>
          Yes. HOK supports dual-mode listings - a single piece can be available for both rental and preloved sale simultaneously. If a sale completes, rental availability is automatically removed. The choice of single or dual mode is entirely yours at the time of listing.
        </>
      )
    },
    {
      question: 'How do I know a preloved piece is authentic?',
      answer: (
        <>
          Every preloved listing is reviewed by HOK's curation team before going live. Listers are required to provide provenance where available - original receipts, care labels, or designer certificates. Any listing found to misrepresent authenticity is removed and the account suspended. We are also building an authentication partnership for high-value pieces.
        </>
      )
    },
    {
      question: 'When and how do I receive my payout as a lister?',
      answer: (
        <>
          Payouts are processed <strong>T+3 working days</strong> after buyer confirmation of receipt (for preloved sales) or after the rental period concludes (for rental listings). Earnings are transferred directly to your registered bank account. Payout status is trackable from your lister dashboard.
        </>
      )
    },
    {
      question: 'Can I list a piece that has been altered?',
      answer: (
        <>
          Yes - but alterations must be fully disclosed in the Honest Disclosure block: what was altered, how significantly, and by whom if known. Pieces with complete, honest disclosures consistently perform better than vague listings. Our team reviews the disclosure as part of approval.
        </>
      )
    },
    {
      question: 'What happens if a renter damages my piece?',
      answer: (
        <>
          The renter's security deposit covers accidental damage beyond normal wear. If a returned piece has such damage, the relevant deduction is made from the renter's deposit - your earnings as the lister are not affected. HOK manages the assessment and resolution process.
        </>
      )
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="section-faq" className="hok-hiw-sec hok-hiw-sec-alt hok-hiw-faq">
      <div className="hok-hiw-faq-inner">
        {/* Header */}
        <div className="hok-hiw-faq-header">
          <div className="hok-hiw-faq-eyebrow">
            <span className="hok-hiw-faq-line"></span>
            <span className="hok-hiw-faq-eyebrow-text">FAQ</span>
            <span className="hok-hiw-faq-line"></span>
          </div>
          
          <h2 className="hok-hiw-faq-title">
            Questions you <em>probably have.</em>
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="hok-hiw-faq-items">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`hok-hiw-faq-item ${index === 0 ? 'hok-hiw-faq-item-first' : ''} ${openIndex === index ? 'hok-hiw-open' : ''}`}
            >
              {/* Question */}
              <div 
                className="hok-hiw-faq-q" 
                onClick={() => toggleFAQ(index)}
              >
                <span className="hok-hiw-faq-txt">{faq.question}</span>
                <span className={`hok-hiw-faq-icon ${openIndex === index ? 'hok-hiw-open' : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>

              {/* Answer */}
              <div className="hok-hiw-faq-answer">
                <div className="hok-hiw-faq-answer-inner">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;