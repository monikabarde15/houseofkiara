import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/form-section.css";
import "../../../styles/checkout/sections/review-section.css";
import "../../../styles/checkout/sections/components/field.css";
import { useLocation } from "react-router-dom";
import { useState, useMemo,useEffect } from "react";

const ReviewSection = ({ onValidityChange }) => {

  const location = useLocation();
  const checkoutItems = location.state?.checkoutItems || [];

  //  separate items by mode
  const rentalItems = checkoutItems.filter(i => i.mode === "rental");
  const prelovedItems = checkoutItems.filter(i => i.mode === "preloved");

  //  pick first item (as per spec text usage)
  const rentalItem = rentalItems[0];
  const prelovedItem = prelovedItems[0];

  //  safe values
  const rentalName = rentalItem?.title || "your rental item";
  const prelovedName = prelovedItem?.title || "this Preloved item";

  //  return date (you must confirm field name)
  const returnDate = rentalItem?.returnDate || "selected date";


  // 1–4 required → true by default, 5 optional → false
  const [consents, setConsents] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: false,
  });

  // toggle handler
  const toggleConsent = (id) => {
    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // validation: all required must be true
  const isValid = useMemo(() => {
    return consents[1] && consents[2] && consents[3] && consents[4];
  }, [consents]);

  
  useEffect(() => {
    if (typeof onValidityChange === "function") {
      onValidityChange(isValid);
    }
  }, [isValid]);

  return (
    <FormSection>

      <div className="checkout-review-section">

        {/* HEADER */}
        <div className="checkout-section-header">
          <div className="checkout-section-number">06</div>

          <h2 className="checkout-section-title">
            Review <em>& Confirm</em>
          </h2>
        </div>

        {/* CONSENT GROUP  */}
        <div className="checkout-consent-group">

          {/* CONSENT 1 */}
          <label className="checkout-consent-row" data-consent-id="1" onClick={() => toggleConsent(1)}>

            <span  className={`checkout-c-box ${consents[1] ? "on" : ""}`}></span>

            <span className="checkout-consent-req">*</span>

            <span className="checkout-consent-text">
              I have read and accept the{" "}
              <a className="checkout-consent-link">House of Kaira Terms of Service</a>,{" "}
              <a className="checkout-consent-link">Rental Agreement</a>,{" "}
              <a className="checkout-consent-link">Returns & Cancellation Policy</a>, and{" "}
              <a className="checkout-consent-link">Preloved Purchase Terms</a>.
            </span>

          </label>


          {/* CONSENT 2 (PRELOVED) */}
          <label
            className="checkout-consent-row"
            data-consent-id="2"
            data-consent-item="preloved"
            onClick={() => toggleConsent(2)}
          >

            {/* checkbox visual */}
            <span
              className={`checkout-c-box ${consents[2] ? "on" : ""}`}
            ></span>

            <span className="checkout-consent-req">*</span>

            <span className="checkout-consent-text">
              I understand that the <strong>{prelovedName}</strong> is a final sale preloved item and cannot be returned once dispatched. I have reviewed all condition disclosures and photographs.
            </span>

          </label>


          {/* CONSENT 3 (RENTAL) */}
          <label
            className="checkout-consent-row"
            data-consent-id="3"
            data-consent-item="rental"
            onClick={() => toggleConsent(3)}
          >

            {/* checkbox visual */}
            <span
              className={`checkout-c-box ${consents[3] ? "on" : ""}`}
            ></span>

            <span className="checkout-consent-req">*</span>

            <span className="checkout-consent-text">
              I confirm the contact and delivery details above are accurate. I understand the{" "}
              <strong>₹15,000 security deposit</strong> for my rental will be collected separately by the HOK ops team via WhatsApp before dispatch — it is not charged today.
            </span>

          </label>


          {/* CONSENT 4 (RENTAL RETURN) */}
          <label
            className="checkout-consent-row"
            data-consent-id="4"
            data-consent-item="rental"
            onClick={() => toggleConsent(4)}
          >

            {/* checkbox visual */}
            <span
              className={`checkout-c-box ${consents[4] ? "on" : ""}`}
            ></span>

            <span className="checkout-consent-req">*</span>

            <span className="checkout-consent-text">
              I acknowledge the <strong>{rentalName}</strong> must be returned by{" "}
              <strong>{returnDate}</strong> using the prepaid label included in the packaging, and I have read the late return and damage policy.
            </span>

          </label>


          {/* CONSENT 5 (OPTIONAL) */}
          <label
            className="checkout-consent-row"
            data-consent-id="5"
            data-consent-required="false"
            onClick={() => toggleConsent(5)}
          >

            {/* NO ASTERISK */}

            <span className={`checkout-c-box ${consents[5] ? "on" : ""}`}></span>

            <span className="checkout-consent-text">
              I’d like to receive new arrivals, styling edits, and exclusive member offers from House of Kaira.{" "}
              <span className="checkout-consent-optional">
                (Optional — unsubscribe any time.)
              </span>
            </span>

          </label>

        </div>

      </div>

    </FormSection>
  );
};

export default ReviewSection;