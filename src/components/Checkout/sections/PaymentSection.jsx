import { useState } from "react";


import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/payment-section.css";
import "../../../styles/checkout/sections/components/field.css";
import "../../../styles/checkout/sections/components/form-section.css";


const PaymentSection = () => {

  const [selected, setSelected] = useState("upi");

  return (
    <FormSection>

      <div className="payment-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">05</div>

          <h2 className="checkout-section-title">
            Payment <em>Method</em>
          </h2>
        </div>

        {/* PAYMENT OPTION GROUP */}
        <div className="checkout-payment-option-group">

          {/* UPI PAYMENT METHOD */}
          <div
            className={`checkout-payment-option-card ${selected === "upi" ? "selected" : ""}`}
            id="pay-upi"
            onClick={() => setSelected("upi")}
          >

            {/* LEFT */}
            <div className="checkout-payment-option-left">
              <div className="checkout-payment-opt-radio"></div>

              <div className="checkout-payment-option-text">
                <div className="checkout-payment-option-title">UPI</div>
                <div className="checkout-payment-option-desc">
                  Google Pay · PhonePe · Paytm · Any UPI-enabled app
                </div>
              </div>
            </div>

            {/* RIGHT TAG */}
            <div className="checkout-payment-tag checkout-payment-tag-instant">
              INSTANT
            </div>

          </div>

          {/* UPI PAYMENT METHOD PANEL - DEFAULT OPEN*/}
          <div
            className={`checkout-payment-option-panel ${selected === "upi" ? "open" : ""}`}
            id="panel-upi"
          >

            <div className="checkout-payment-field">

              <label className="checkout-payment-field-label">
                YOUR UPI ID
              </label>

              <input
                type="text"
                className="checkout-payment-field-input"
                placeholder="yourname@okaxis · 9876543210@ybl"
              />

              <div className="checkout-payment-field-hint">
                You will receive a payment request on your UPI app after placing the order.
                Confirm it there to complete the transaction.
              </div>

            </div>

          </div>

          {/* CREDIT CARD / DEBIT CARD */}
          <div
            className={`checkout-payment-option-card ${selected === "card" ? "selected" : ""}`}
            id="pay-card"
            onClick={() => setSelected("card")}
          >

            {/* LEFT */}
            <div className="checkout-payment-option-left">
              <div className="checkout-payment-opt-radio"></div>

              <div className="checkout-payment-option-text">
                <div className="checkout-payment-option-title">
                  Credit / Debit card
                </div>

                <div className="checkout-payment-option-desc">
                  Visa · Mastercard · RuPay · American Express
                </div>
              </div>
            </div>

          </div>

          {/* CREDIT CARD / DEBIT CARD PANEL - OPEN  */}
          <div
            className={`checkout-payment-option-panel ${selected === "card" ? "open" : ""}`}
            id="panel-card"
          >
            <div className="checkout-payment-panel-fields">

              {/* Card Number */}
              <div className="checkout-payment-field">
                <label>Card number</label>
                <input
                  id="card-num"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={22}
                />
              </div>

              {/* Row of 3 */}
              <div className="checkout-payment-field-grid c3">

                {/* Name */}
                <div className="checkout-payment-field">
                  <label>Name on card</label>
                  <input
                    type="text"
                    placeholder="As printed on card"
                  />
                </div>

                {/* Expiry */}
                <div className="checkout-payment-field">
                  <label>Expiry</label>
                  <input
                    id="card-exp"
                    type="text"
                    placeholder="MM / YY"
                    maxLength={7}
                  />
                </div>

                {/* CVV */}
                <div className="checkout-payment-field">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                  />
                  <span className="checkout-payment-field-hint">
                    3 or 4 digits, back of card
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* NET BANKING METHOD */}
          <div
            className={`checkout-payment-option-card ${selected === "nb" ? "selected" : ""}`}
            id="pay-nb"
            onClick={() => setSelected("nb")}
          >

            {/* LEFT */}
            <div className="checkout-payment-option-left">
              <div className="checkout-payment-opt-radio"></div>

              <div className="checkout-payment-option-text">
                <div className="checkout-payment-option-title">
                  Net banking
                </div>

                <div className="checkout-payment-option-desc">
                  All major Indian banks · Axis · HDFC · ICICI · SBI · Kotak & more
                </div>
              </div>
            </div>

          </div>

          {/* NET BANKING METHOD PANEL- OPEN */}

          <div
            className={`checkout-payment-option-panel ${selected === "nb" ? "open" : ""}`}
            id="panel-nb"
          >
            <div className="checkout-payment-panel-fields">

              <div className="checkout-payment-field">
                <label>Select your bank</label>

                <select className="checkout-payment-select">
                  <option value="">Choose bank</option>
                  <option>Axis Bank</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>IndusInd Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>State Bank of India</option>
                  <option>Yes Bank</option>
                </select>

              </div>

            </div>
          </div>

          {/* NO COST EMI */}

          <div
            className={`checkout-payment-option-card ${selected === "emi" ? "selected" : ""}`}
            id="pay-emi"
            onClick={() => setSelected("emi")}
          >

            {/* LEFT */}
            <div className="checkout-payment-option-left">
              <div className="checkout-payment-opt-radio"></div>

              <div className="checkout-payment-option-text">
                <div className="checkout-payment-option-title">
                  No-cost EMI
                </div>

                <div className="checkout-payment-option-desc">
                  3 · 6 · 9 · 12 month plans · Available on select cards · Zero interest, no processing fee
                </div>
              </div>
            </div>

            {/* RIGHT TAG */}
            <div className="checkout-payment-tag checkout-payment-tag-popular">
              FROM ₹4,305/MO
            </div>

          </div>

          {/* NO COST EMI PANEL - OPEN */}
          <div
            className={`checkout-payment-option-panel ${selected === "emi" ? "open" : ""}`}
            id="panel-emi"
          >
            <div className="checkout-payment-panel-fields">

              {/* pf.c3 → 3 column row */}
              <div className="checkout-payment-row pf-c3">

                {/* Card Number */}
                <div className="checkout-payment-field">
                  <label>Card number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={22}
                  />
                </div>


                {/* Tenure */}
                <div className="checkout-payment-field">
                  <label>Tenure</label>
                  <select className="checkout-payment-select">
                    <option>3 months · ₹17,210/mo</option>
                    <option>6 months · ₹8,605/mo</option>
                    <option selected>12 months · ₹4,305/mo</option>
                  </select>
                </div>

                {/* Bank / Issuer */}
                <div className="checkout-payment-field">
                  <label>Bank / Issuer</label>
                  <select className="checkout-payment-select">
                    <option selected>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Bank</option>
                  </select>
                </div>

                {/* Empty spacer (matches spec layout balance) */}
                <div></div>

              </div>

            </div>
          </div>

        </div>

        {/* PAYMENT NOTICE  */}

        <div className="checkout-payment-notice notice-slate">
          <p>
            All payments are processed via <b>Razorpay</b> (PCI-DSS compliant).
            House of Kaira does not store card or UPI details.
            For net banking and UPI, you will be redirected to your bank's secure portal to complete authorisation.
          </p>
        </div>

      </div>

    </FormSection>
  );
};

export default PaymentSection;