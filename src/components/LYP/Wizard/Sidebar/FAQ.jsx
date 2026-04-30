import '../../../../styles/LYP/wizard/sidebar.css'

import React, { useState } from "react";

const FAQ = () => {

  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Do I need to send the piece to you?",
      a: "No. We arrange pickup from your location after approval — at no cost to you."
    },
    {
      q: "What if my piece gets damaged?",
      a: "Every rental includes a security deposit from the renter. Verified damage is covered from that deposit."
    },
    {
      q: "Can I get it back to wear?",
      a: "Yes, with notice. We block your dates and ensure the piece isn’t booked during them."
    },
    {
      q: "When do I get paid?",
      a: "After each completed rental or sale. Bank transfer / UPI within 5 business days of the transaction closing."
    },
    {
      q: "How long until my piece goes live?",
      a: "After pickup, typically 5–7 business days for photography, QC, and listing."
    }
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="lyp-faq">

      {/* Eyebrow */}
      <div className="lyp-sidebar-eyebrow">
        COMMON QUESTIONS
      </div>

      <div className="lyp-faq-list">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={index} className="lyp-faq-item">

              {/* Question Row */}
              <div
                className="lyp-faq-question"
                onClick={() => toggle(index)}
              >
                <span>{item.q}</span>

                <svg
                  className={`lyp-faq-icon ${isOpen ? "open" : ""}`}
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Answer */}
              {isOpen && (
                <div className="lyp-faq-answer">
                  {item.a}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default FAQ;