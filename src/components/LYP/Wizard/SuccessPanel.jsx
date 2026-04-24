import React from "react";
import "../../../styles/LYP/wizard/success.css";
import { Check } from "lucide-react";


const SuccessPanel = () => {
  return (
    <div className="lyp-success">

      {/* Icon */}
      <div className="lyp-success__icon">
        <Check size={28} />
      </div>

      {/* Tag */}
      <div className="lyp-success__tag">
        SUBMISSION RECEIVED
      </div>

      {/* Title */}
      <h2 className="lyp-success__title">
        Thank you — we'll be in touch within <em>48 hours</em>.
      </h2>

      {/* Description */}
      <p className="lyp-success__desc">
        We've received your submission and will review it carefully.
        You'll hear from us on WhatsApp within 48 hours with our assessment
        and next steps.
      </p>

      {/* Next steps cards */}
      <div className="lyp-success__cards">

        <div className="lyp-success__card">
          <div className="lyp-success__card-eyebrow">WHAT'S NEXT · 01</div>
          <div className="lyp-success__card-title">Team review</div>
          <div className="lyp-success__card-body">
            We assess your submission and confirm eligibility within 48 hours.
          </div>
        </div>

        <div className="lyp-success__card">
          <div className="lyp-success__card-eyebrow">WHAT'S NEXT · 02</div>
          <div className="lyp-success__card-title">Piece pickup</div>
          <div className="lyp-success__card-body">
            We arrange collection from your location — entirely at your convenience.
          </div>
        </div>

        <div className="lyp-success__card">
          <div className="lyp-success__card-eyebrow">WHAT'S NEXT · 03</div>
          <div className="lyp-success__card-title">Live on HOK</div>
          <div className="lyp-success__card-body">
            Photography, listing, and publishing handled entirely by us.
          </div>
        </div>

      </div>

      {/* CTA */}
      <a href="/" className="lyp-success__cta">
        BACK TO HOMEPAGE
      </a>

    </div>
  );
};

export default SuccessPanel;