import '../../../../styles/LYP/wizard/sidebar.css'

import React from "react";

const CommissionCard = () => {
  return (
    <div className="lyp-commission">

      {/* Eyebrow */}
      <div className="lyp-sidebar-eyebrow">
        YOUR EARNINGS
      </div>

      {/* Card */}
      <div className="lyp-commission-card">

        {/* Label */}
        <div className="lyp-commission-label">
          COMMISSION STRUCTURE
        </div>

        {/* Rows */}
        <div className="lyp-commission-row">
          <div className="lyp-commission-left">
            <div className="lyp-commission-type">
              Rental · Premium
            </div>
            <div className="lyp-commission-sub">
              All ops costs covered per cycle
            </div>
          </div>
          <div className="lyp-commission-value">45%</div>
        </div>

        <div className="lyp-commission-row">
          <div className="lyp-commission-left">
            <div className="lyp-commission-type">
              Rental · Luxury / Couture
            </div>
            <div className="lyp-commission-sub">
              Higher-value pieces
            </div>
          </div>
          <div className="lyp-commission-value">50–55%</div>
        </div>

        <div className="lyp-commission-row">
          <div className="lyp-commission-left">
            <div className="lyp-commission-type">
              Resale · Premium
            </div>
            <div className="lyp-commission-sub">
              Single-transaction cost
            </div>
          </div>
          <div className="lyp-commission-value">65%</div>
        </div>

        <div className="lyp-commission-row last">
          <div className="lyp-commission-left">
            <div className="lyp-commission-type">
              Resale · Luxury
            </div>
            <div className="lyp-commission-sub">
              Higher payout for premium pieces
            </div>
          </div>
          <div className="lyp-commission-value">70–85%</div>
        </div>

        {/* Footer */}
        <div className="lyp-commission-foot">
          Rental lower because HOK covers every dry clean, logistics,
          fitting, and QC per cycle.{" "}
          <span>Your exact rate confirmed before listing.</span>
        </div>

      </div>
    </div>
  );
};

export default CommissionCard;