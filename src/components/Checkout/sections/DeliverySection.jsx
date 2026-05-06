import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/delivery-section.css";
import "../../../styles/checkout/sections/components/field.css";

import { useState } from "react";

export default function DeliverySection() {
  const [selected, setSelected] = useState("std");

  return (
    <FormSection>
      <div className="delivery-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">03</div>
          <h2 className="checkout-section-title">
            Delivery <em>Method</em>
          </h2>
        </div>

        {/* OPTION GROUP */}
        <div className="checkout-option-group">

          {/* STANDARD */}
          <div
            className={`checkout-option-card ${selected === "std" ? "selected" : ""
              }`}
            onClick={() => setSelected("std")}
          >
            <div
              className={`checkout-option-radio ${selected === "std" ? "selected" : ""
                }`}
            ></div>

            <div className="checkout-option-content">
              <div className="checkout-option-row">
                <span className="checkout-option-name">
                  Standard delivery
                </span>

                <span className="checkout-option-tag tag-free">
                  Free · ₹0
                </span>
              </div>

              <p className="checkout-option-desc">
                3–5 business days · Blue Dart / Delhivery · End-to-end tracking · Plastic-free HOK garment bag · Insured
              </p>
            </div>
          </div>

          {/* EXPRESS */}
          <div
            className={`checkout-option-card ${selected === "exp" ? "selected" : ""
              }`}
            onClick={() => setSelected("exp")}
          >
            <div
              className={`checkout-option-radio ${selected === "exp" ? "selected" : ""
                }`}
            ></div>

            <div className="checkout-option-content">
              <div className="checkout-option-row">
                <span className="checkout-option-name">
                  Express delivery
                </span>

                <span className="checkout-option-tag tag-express">
                  ₹299
                </span>
              </div>

              <p className="checkout-option-desc">
                1–2 business days · Blue Dart Priority · Signature on delivery · Insured transit
              </p>
            </div>
          </div>

        </div>

        {/* NOTICE */}
        <div className="checkout-delivery-notice">
          <p className="checkout-delivery-notice-text">
            <span className="checkout-delivery-notice-label">
              Rental dispatch note:
            </span>{" "}
            <span className="checkout-delivery-notice-body">
              Regardless of shipping method, your{" "}
              <span className="checkout-delivery-notice-strong">
                Crimson Zardozi Bridal Lehenga
              </span>{" "}
              will be dispatched to arrive by{" "}
              <span className="checkout-delivery-notice-strong">
                14 Nov (Friday)
              </span>{" "}
              — two days before your event. Rental dispatch timelines are fixed to the booking window and cannot be accelerated.
            </span>
          </p>
        </div>

      </div>
    </FormSection>
  );
}