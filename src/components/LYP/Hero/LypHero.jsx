import React from "react";
import "../../../styles/LYP/hero.css";
import { Shield,Clock, DollarSign  } from "lucide-react";

const LypHero = () => {
  return (
    <section className="lyp-hero">

      <div className="lyp-hero__inner">

        {/* LEFT */}
        <div className="lyp-hero__left">

          <div className="lyp-hero__eyebrow">
            <span className="lyp-hero__eyebrow-line"></span>
            <span>LIST YOUR PIECE</span>
          </div>

          <h1 className="lyp-hero__title">
            Your lehenga deserves <br />
            another <em>standing ovation.</em>
          </h1>

          <p className="lyp-hero__desc">
            Submit your piece in under 5 minutes. We handle pickup,
            photography, listing, dry cleaning, and returns — every time it
            goes to a new celebration.
          </p>

        </div>

        {/* RIGHT */}
        <div className="lyp-hero__right">

          <div className="lyp-hero__prop">
            <div className="lyp-hero__icon">
                <Shield/>
            </div>
            <div>
              <div className="lyp-hero__prop-title">
                Your piece, always protected
              </div>
              <div className="lyp-hero__prop-desc">
                Professional dry cleaning, quality inspection and secure packaging on every rental cycle.
              </div>
            </div>
          </div>

          <div className="lyp-hero__prop">
            <div className="lyp-hero__icon">
                <Clock />
            </div>
            <div>
              <div className="lyp-hero__prop-title">
                Review within 48 hours
              </div>
              <div className="lyp-hero__prop-desc">
                Our ops team reviews every submission personally. You'll hear from us within 2 business days.
              </div>
            </div>
          </div>

          <div className="lyp-hero__prop">
            <div className="lyp-hero__icon">
                <DollarSign/>
            </div>
            <div>
              <div className="lyp-hero__prop-title">
                Transparent earnings, always
              </div>
              <div className="lyp-hero__prop-desc">
                Revenue share agreed before listing. Payout processed after each completed rental or sale.
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default LypHero;