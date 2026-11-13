import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";
import { CONTACT_TOKENS } from "../../data/contact/contactSettings";
import { getLegalSettings } from "../../services/legalApi";
import "../../styles/contact/contact-legal.css";

export default function ContactLegalSection({ getVal }) {
  const { concern, details } = CONTACT_CONTENT;
  const [legalData, setLegalData] = useState(null);

  useEffect(() => {
    let mounted = true;
    getLegalSettings().then((cfg) => {
      if (mounted && cfg) {
        setLegalData(cfg);
      }
    });

    const handleLegalUpdate = () => {
      getLegalSettings(true).then((cfg) => {
        if (mounted && cfg) {
          setLegalData(cfg);
        }
      });
    };

    window.addEventListener("hok_legal_updated", handleLegalUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("hok_legal_updated", handleLegalUpdate);
    };
  }, []);

  const registeredEntity = legalData?.registeredEntity;
  const entityName = registeredEntity?.registeredName || CONTACT_TOKENS.trade_name;
  const address = registeredEntity?.registeredAddress || CONTACT_TOKENS.business_address;

  const fallbackDetailsIntro = registeredEntity?.registeredName
    ? `House of Kaira is a brand of ${entityName}, ${CONTACT_TOKENS.legal_form} owned by ${CONTACT_TOKENS.legal_name}.`
    : details.intro;

  const detailsRows = [
    { label: "Principal place of business", value: address },
    { label: "Website", value: CONTACT_TOKENS.site_url, isPlain: true },
    ...(registeredEntity?.gstin ? [{ label: "GSTIN", value: registeredEntity.gstin }] : []),
    ...(registeredEntity?.cin ? [{ label: "CIN", value: registeredEntity.cin }] : []),
  ];

  const concernTitle = getVal ? getVal("contact_concern_heading", concern.title) : concern.title;
  const concernIntro = getVal ? getVal("contact_concern_intro", concern.intro) : concern.intro;
  const concernPromise = getVal ? getVal("contact_concern_promise_lead", concern.promise) : concern.promise;
  const detailsTitle = getVal ? getVal("contact_details_heading", details.title) : details.title;
  const detailsIntro = getVal ? getVal("contact_details_intro", fallbackDetailsIntro) : fallbackDetailsIntro;
  const sendBoxTitle = getVal ? getVal("contact_details_send_title", details.box.title) : details.box.title;
  const sendBoxText = getVal ? getVal("contact_details_send_text", details.box.text) : details.box.text;

  return (
    <section
      className="legal-band"
      aria-label="Raising a concern, and our details"
    >
      <div className="wrap">
        <div className="legal">
          {/* Left Column: Raising a concern */}
          <div className="legal-col" aria-labelledby="concern-heading">
            <h2 id="concern-heading">{concernTitle}</h2>
            <p className="intro">{concernIntro}</p>

            <dl className="dl">
              {concern.rows.map((row) => (
                <div key={row.label} className="dl-row">
                  <dt className="dl-k">{row.label}</dt>
                  <dd className="dl-v">
                    {row.isEmail ? (
                      <a href={`mailto:${row.value}`} className="tl">
                        {row.value}
                      </a>
                    ) : row.label === "Phone" ? (
                      <a
                        href={`tel:${CONTACT_TOKENS.support_phone_raw}`}
                        className="tl"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="small">
              <p>{concernPromise}</p>
              <p>
                You can also contact the National Consumer Helpline on{" "}
                {CONTACT_TOKENS.nch_phone}, on WhatsApp at{" "}
                <a
                  href={`https://wa.me/${CONTACT_TOKENS.nch_whatsapp_raw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl"
                >
                  {CONTACT_TOKENS.nch_whatsapp}
                </a>
                , or at{" "}
                <a
                  href={`https://${CONTACT_TOKENS.nch_web}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl"
                >
                  {CONTACT_TOKENS.nch_web}
                </a>
                . Your rights are set out in our{" "}
                <Link to={concern.termsPath} className="tl">
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Right Column: Our details */}
          <div className="legal-col" aria-labelledby="details-heading">
            <h2 id="details-heading">{detailsTitle}</h2>
            <p className="intro">{detailsIntro}</p>

            <dl className="dl">
              {detailsRows.map((row) => (
                <div key={row.label} className="dl-row">
                  <dt className="dl-k">{row.label}</dt>
                  <dd className="dl-v">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="post-note" aria-labelledby="sending-box-title">
              <h3 id="sending-box-title">{sendBoxTitle}</h3>
              <p>{sendBoxText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
