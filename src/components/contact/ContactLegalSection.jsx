import React from "react";
import { Link } from "react-router-dom";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";
import { CONTACT_TOKENS } from "../../data/contact/contactSettings";
import "../../styles/contact/contact-legal.css";

export default function ContactLegalSection() {
  const { concern, details } = CONTACT_CONTENT;

  return (
    <section
      className="legal-band"
      aria-label="Raising a concern, and our details"
    >
      <div className="wrap">
        <div className="legal">
          {/* Left Column: Raising a concern */}
          <div className="legal-col" aria-labelledby="concern-heading">
            <h2 id="concern-heading">{concern.title}</h2>
            <p className="intro">{concern.intro}</p>

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
              <p>{concern.promise}</p>
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
                  Terms & Conditions
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Right Column: Our details */}
          <div className="legal-col" aria-labelledby="details-heading">
            <h2 id="details-heading">{details.title}</h2>
            <p className="intro">{details.intro}</p>

            <dl className="dl">
              {details.rows.map((row) => (
                <div key={row.label} className="dl-row">
                  <dt className="dl-k">{row.label}</dt>
                  <dd className="dl-v">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="post-note" aria-labelledby="sending-box-title">
              <h3 id="sending-box-title">{details.box.title}</h3>
              <p>{details.box.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
