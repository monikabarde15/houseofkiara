import React, { useState } from "react";
import { CircleQuestionMark,File } from 'lucide-react';

const GSTBreakdown = ({
  rentalGST,
  prelovedGST,
  newGST,
  totalGST
}) => {
  const [open, setOpen] = useState(false);

  

  return (
    <div className="gst-wrapper">

      {/* TOGGLE ROW */}
      <div
        className="summary-row gst-row"
        onClick={() => setOpen(!open)}
      >
        <div className="summary-left gst-left">

          <File className="gst-icon" />

          <span className="gst-title">
            Taxes & GST
          </span>

          <span className="gst-inline-note">
            included in total
          </span>

        </div>

        <div className="summary-value">
          ₹{totalGST.toLocaleString()}
          <span className={`gst-caret ${open ? "open" : ""}`}>
            ▾
          </span>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className={`gst-detail ${open ? "vis" : ""}`}>

          {rentalGST > 0 && (
            <div className="gst-item">
              <div className="gst-left">
                <span className="gst-badge rental">Rental</span>
                <span className="gst-text">
                  18% GST · SAC 997329
                </span>
                <span className="gst-info">
                  <CircleQuestionMark className="gst-info-icon" />
                  <span className="gst-tooltip">
                    Fashion rental services attract 18% GST under SAC 997329.
                    Applied on rental fee only — security deposit is GST-exempt.
                  </span>
                </span>
              </div>
              <div className="gst-value">
                ₹{rentalGST.toLocaleString()}
              </div>
            </div>
          )}


          {prelovedGST > 0 && (
            <div className="gst-item">
              <div className="gst-left">
                <span className="gst-badge preloved">Preloved</span>
                <span className="gst-text">
                  5% GST · HSN 6204
                </span>
                <span className="gst-info">
                  <CircleQuestionMark className="gst-info-icon" />
                  <span className="gst-tooltip">
                    Fashion rental services attract 18% GST under SAC 997329.
                    Applied on rental fee only — security deposit is GST-exempt.
                  </span>
                </span>
              </div>
              <div className="gst-value">
                ₹{prelovedGST.toLocaleString()}
              </div>
            </div>
          )}

          {newGST > 0 && (
            <div className="gst-item">
              <div className="gst-left">
                <span className="gst-badge new">New</span>
                <span className="gst-text">
                  12% GST · HSN 6101
                </span>
                <span className="gst-info">
                  <CircleQuestionMark className="gst-info-icon" />
                  <span className="gst-tooltip">
                    Fashion rental services attract 18% GST under SAC 997329.
                    Applied on rental fee only — security deposit is GST-exempt.
                  </span>
                </span>
              </div>
              <div className="gst-value">
                ₹{newGST.toLocaleString()} <span className="gst-embedded">‡</span>
              </div>
            </div>
          )}

          {/* NOTE */}
          <div className="gst-note">
            ‡ New garment price is tax-inclusive — GST shown above is already embedded in the price, not added again.
            <br />
            Rental and preloved GST are added to the total. Delivery GST will be calculated at checkout.
            <br />
            IGST or CGST+SGST applied at checkout based on your delivery state.
          </div>

        </div>
    </div>
  );
};

export default GSTBreakdown;

