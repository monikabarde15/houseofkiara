/**
 * House of Kaira - Five Steps Feature Component (Component C7)
 * Section 5.8 & Appendix A of Build Specification 1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { FIVE_STEPS_FEATURE } from "../../data/seller/sellerRegistry";

export default function SellerFiveStepsFeature() {
  return (
    <ol className="steps" aria-label="Five steps to list your piece">
      {FIVE_STEPS_FEATURE.map((stepItem) => (
        <li className="step" key={stepItem.step}>
          <span className="step-n" aria-hidden="true">
            {stepItem.step}
          </span>
          <h3>{stepItem.title}</h3>
          <p>
            {stepItem.step === 1 ? (
              <>
                A few photographs and the details you know, through the{" "}
                <Link to="/list-your-piece">List Your Piece</Link> form or on
                WhatsApp.
              </>
            ) : (
              stepItem.desc
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}
