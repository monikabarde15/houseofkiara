import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/address-section.css";
import "../../../styles/checkout/sections/components/field.css";

import { useState } from "react";

export default function DeliveryAddress() {
  const [sameBilling, setSameBilling] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(false);

  const handlePinChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) e.target.value = value;
  };

  return (
    <FormSection>
      <div className="address-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">02</div>
          <h2 className="checkout-section-title">
            Delivery <em>Address</em>
          </h2>
        </div>

        {/* ADDRESS LINE 1 */}
        <div className="checkout-fg">
          <div className="checkout-field">
            <label className="req">ADDRESS LINE 1</label>
            <input placeholder="Flat / house number, building name" />
          </div>
        </div>

        {/* ADDRESS LINE 2 */}
        <div className="checkout-fg">
          <div className="checkout-field">
            <label>
              ADDRESS LINE 2
              <span className="checkout-label-optional">(Optional)</span>
            </label>
            <input placeholder="Street, locality, area" />
          </div>
        </div>

        {/* CITY + STATE + PIN */}
        <div className="checkout-fg checkout-fg--c3">
          <div className="checkout-field">
            <label className="req">CITY</label>
            <input placeholder="City" />
          </div>

          <div className="checkout-field">
            <label className="req">STATE</label>
            <select defaultValue="">
              <option value="">Select state</option>
              <option>Delhi</option>
            </select>
          </div>

          <div className="checkout-field">
            <label className="req">PIN CODE</label>
            <input maxLength={6} onChange={handlePinChange} />
          </div>
        </div>

        {/* DELIVERY INSTRUCTIONS */}
        <div className="checkout-fg">
          <div className="checkout-field">
            <label>
              DELIVERY INSTRUCTIONS
              <span className="checkout-label-optional">(Optional)</span>
            </label>
            <textarea />
          </div>
        </div>

        {/* BILLING TOGGLE */}
        <div className="checkout-toggle-block">

          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={sameBilling}
              onChange={() => setSameBilling(!sameBilling)}
            />
            <span className="checkout-checkbox-box"></span>
            <span>Billing address is the same as delivery address</span>
          </label>

          {/* PANEL */}
          <div className={`checkout-panel ${!sameBilling ? "open" : ""}`}>
            <div className="checkout-fg">
              <div className="checkout-field">
                <input placeholder="Billing address line 1" />
              </div>
            </div>
          </div>

        </div>

        {/* GST TOGGLE */}
        <div className="checkout-toggle-block">

          <label className="checkout-checkbox">
            <input
              type="checkbox"
              checked={gstEnabled}
              onChange={() => setGstEnabled(!gstEnabled)}
            />
            <span className="checkout-checkbox-box"></span>

            <span>
              I need a GST invoice
              <span className="checkout-label-optional">
                (for business purchases)
              </span>
            </span>
          </label>

          <div className={`checkout-panel ${gstEnabled ? "open" : ""}`}>
            <div className="checkout-fg checkout-fg--c2">
              <input placeholder="Business / Company Name" />
              <input placeholder="GSTIN" maxLength={15} />
            </div>
          </div>

        </div>

      </div>
    </FormSection>
  );
}