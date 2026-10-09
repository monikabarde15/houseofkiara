import React, { useState } from "react";
import { CONTACT_CONTENT } from "../../data/contact/contactContent";

const WhatsAppIcon = ({ className = "wa", size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    />
  </svg>
);

const EnvelopeIcon = ({ className = "line", size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3.5 6 8.5 7 8.5-7" />
  </svg>
);

const PhoneIcon = ({ className = "line", size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6.6 3.5h3l1.5 4.2-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4.2 1.5v3a1.6 1.6 0 0 1-1.7 1.6A16.2 16.2 0 0 1 5 5.2a1.6 1.6 0 0 1 1.6-1.7Z" />
  </svg>
);

export default function ContactReachCard({ showCallRow = true, onShowToast }) {
  const { title, whatsapp, email, call } = CONTACT_CONTENT.reachCard;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(email.value)
        .then(() => {
          setIsCopied(true);
          if (onShowToast) onShowToast(email.copiedToast);
          setTimeout(() => setIsCopied(false), 2200);
        })
        .catch(() => {
          if (onShowToast) onShowToast(email.copyFailToast);
        });
    } else {
      if (onShowToast) onShowToast(email.copyFailToast);
    }
  };

  const whatsappUrl = `https://wa.me/${whatsapp.rawNumber}?text=${encodeURIComponent(
    whatsapp.greeting
  )}`;
  const mailtoUrl = `mailto:${email.value}?subject=${encodeURIComponent(
    email.subject
  )}`;
  const telUrl = `tel:${call.rawPhone}`;

  return (
    <section className="reach" aria-labelledby="reach-title">
      <h2 className="reach-title" id="reach-title">
        {title}
      </h2>

      <div id="channels">
        {/* Row 1: WhatsApp */}
        <div className="ch">
          <div className="ch-top">
            <span className="ch-ic">
              <WhatsAppIcon size={20} className="wa" />
            </span>
            <h3 className="ch-name">{whatsapp.name}</h3>
          </div>

          <div className="ch-line">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ch-v"
            >
              {whatsapp.value}
            </a>
          </div>

          <div className="ch-n">{whatsapp.note}</div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            <WhatsAppIcon size={15} className="wa" />
            <span>{whatsapp.buttonLabel}</span>
          </a>
        </div>

        {/* Row 2: Email */}
        <div className="ch">
          <div className="ch-top">
            <span className="ch-ic">
              <EnvelopeIcon />
            </span>
            <h3 className="ch-name">{email.name}</h3>
          </div>

          <div className="ch-line">
            <a href={mailtoUrl} className="ch-v">
              {email.value}
            </a>
            <button
              type="button"
              className={`ch-copy ${isCopied ? "done" : ""}`}
              onClick={handleCopyEmail}
              aria-label={email.copyAriaName}
            >
              {isCopied ? email.copiedLabel : email.copyLabel}
            </button>
          </div>

          <div className="ch-n">{email.note}</div>
        </div>

        {/* Row 3: Call (Optional based on admin switch) */}
        {showCallRow && (
          <div className="ch">
            <div className="ch-top">
              <span className="ch-ic">
                <PhoneIcon />
              </span>
              <h3 className="ch-name">{call.name}</h3>
            </div>

            <div className="ch-line">
              <a href={telUrl} className="ch-v">
                {call.value}
              </a>
            </div>

            <div className="ch-n">{call.note}</div>
          </div>
        )}
      </div>
    </section>
  );
}
