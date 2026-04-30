import React, { useState } from "react";
import { CircleQuestionMark, File } from 'lucide-react';

const GSTBreakdown = ({
  rentalGST,
  prelovedGST,
  newGST,
  totalGST
}) => {
  const [open, setOpen] = useState(false);



  return (
    <>

      {/* TOGGLE ROW */}
      <div className="summary-row gst-row">

          <div className="gst-left">

          <File
            className="gst-icon"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          />

          <div className="gst-text-group">
            <p className="gst-title">Taxes & GST</p>
            <p className="gst-note-inline">
              included in total
            </p>
          </div>

        </div>

        <div className="summary-value">
          ₹{totalGST.toLocaleString()}
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
   </>
  );
};

export default GSTBreakdown;

