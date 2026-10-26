// src\components\Checkout\sections\ReviewSection.jsx
import FormSection from "./components/FormSection";
import "../../../styles/checkout/sections/components/form-section.css";
import "../../../styles/checkout/sections/review-section.css";
import "../../../styles/checkout/sections/components/field.css";
import ConsentErrorBanner from "../ui/ConsentErrorBanner";
import { useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

const ReviewSection = ({
  onValidityChange,
  submitCount,
  checkoutItems = [],
}) => {


  // const location = useLocation();
  // const checkoutItems = location.state?.checkoutItems || [];

  //  separate items by mode
  const rentalItems =
    checkoutItems.filter(i => i.type === "rental");

  const prelovedItems =
    checkoutItems.filter(i => i.type === "preloved");

  //  pick first item (as per spec text usage)
  const rentalItem = rentalItems[0];
  const prelovedItem = prelovedItems[0];

  //  safe values
  const rentalName =
    rentalItem?.product?.title ||
    rentalItem?.title ||
    "your rental item";

  const prelovedName =
    prelovedItem?.product?.title ||
    prelovedItem?.title ||
    "this preloved item";

  //  return date (you must confirm field name)
  const returnDateRaw =
    rentalItem?.booking?.returnDate;


  /* formatted date */
  const returnDate = returnDateRaw
    ? new Date(returnDateRaw).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
      }
    )
    : "selected date";


  /* weekday */
  const returnDay = returnDateRaw
    ? new Date(returnDateRaw).toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
      }
    )
    : "";

  // CREATE CONSENT_META
  const CONSENT_META = [

    {
      id: 1,
      required: true,
      type: "legal",
    },

    prelovedItem && {
      id: 2,
      required: true,
      type: "preloved",
      itemName: prelovedName,
    },

    rentalItem && {
      id: 3,
      required: true,
      type: "rental-return",
      itemName: rentalName,
    },

    rentalItem && {
      id: 4,
      required: true,
      type: "rental-return",
      itemName: rentalName,
      returnDate,
    },

    {
      id: 5,
      required: false,
      type: "marketing",
    },

  ].filter(Boolean);

  // DYNAMIC INITIAL STATE 1–4 required → true by default, 5 optional → false
  const initialConsents = {};

  CONSENT_META.forEach((item) => {
    initialConsents[item.id] = item.required;
  });

  /* marketing optional */
  initialConsents[5] = false;

  const [consents, setConsents] =
    useState(initialConsents);

  const [consentErrors, setConsentErrors] = useState([]);

  // toggle handler
  const toggleConsent = (id) => {

    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    /* live clear */
    setConsentErrors((prev) =>
      prev.filter((item) => item !== id)
    );
  };

  // validation: all required must be true
  const isValid = useMemo(() => {
    return CONSENT_META
      .filter((item) => item.required)
      .every((item) => consents[item.id]);
  }, [consents]);

  // VALIDATION EFFECT

  useEffect(() => {

    const nextErrors = [];

    CONSENT_META.forEach((item) => {

      if (
        item.required &&
        !consents[item.id]
      ) {
        nextErrors.push(item.id);
      }

    });

    setConsentErrors(nextErrors);

  }, [
    consents,
    // CONSENT_META,
  ]);



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
        <div id="consent-group" className="checkout-consent-group">

          {/* CONSENT 1 */}
          <label className={`
  checkout-consent-row
  ${consentErrors.includes(1) ? "has-error" : ""}
`} data-consent-id="1" onClick={() => toggleConsent(1)}>

            <span className={`checkout-c-box ${consents[1] ? "on" : ""}`}></span>

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
          {prelovedItem && (
            <label
              className={`
  checkout-consent-row
  ${consentErrors.includes(2) ? "has-error" : ""}
`}
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

          )}


          {/* CONSENT 3 (RENTAL) */}
          {rentalItem && (
            <label
              className={`
  checkout-consent-row
  ${consentErrors.includes(3) ? "has-error" : ""}
`}
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
          )}

          {/* CONSENT 4 (RENTAL RETURN) */}
          {rentalItem && (
            <label
              className={`
  checkout-consent-row
  ${consentErrors.includes(4) ? "has-error" : ""}
`}
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
                <strong>
                  {returnDate}
                  {returnDay ? ` (${returnDay})` : ""}
                </strong> using the prepaid label included in the packaging, and I have read the late return and damage policy.
              </span>

            </label>
          )}


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

        <ConsentErrorBanner
          consentErrors={consentErrors}
          consentMeta={CONSENT_META}
        />

        {/* CTA Sentinel - for docking behavior */}
        <div id="cta-sentinel" style={{ height: "1px", pointerEvents: "none" }} />

      </div>

    </FormSection>
  );
};

export default ReviewSection;