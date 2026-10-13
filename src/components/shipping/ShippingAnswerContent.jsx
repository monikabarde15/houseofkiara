/**
 * House of Kaira: Shipping Answer Content & Footer (D11)
 * Section 4.11, 5.9 & Page 21, 22 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { Link } from "react-router-dom";
import { SHIPPING_SETTINGS } from "../../data/shipping/shippingSettings";

const PAGE_ROUTES = {
  home: "/",
  faq: "/faqs",
  account: "/profile",
  "refund-policy": "/refunds",
  "deposit-policy": "/deposit",
  "care-policy": "/care",
  "seller-guidelines": "/seller-guidelines",
  terms: "/terms",
  privacy: "/privacy",
  "cookie-policy": "/cookies",
  contact: "/contact"
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="fill" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function renderParagraphWithLinks(pText, allLinks, onSelectQuestion) {
  if (!allLinks || allLinks.length === 0) {
    return pText;
  }

  // Find all matches in this paragraph
  const matches = [];
  allLinks.forEach((linkItem) => {
    const idx = pText.indexOf(linkItem.text);
    if (idx !== -1) {
      matches.push({
        start: idx,
        end: idx + linkItem.text.length,
        link: linkItem
      });
    }
  });

  if (matches.length === 0) {
    return pText;
  }

  // Sort matches by start index
  matches.sort((a, b) => a.start-b.start);

  const parts = [];
  let lastIdx = 0;

  matches.forEach((m, i) => {
    if (m.start > lastIdx) {
      parts.push(pText.slice(lastIdx, m.start));
    }

    if (m.link.type === "page") {
      parts.push(
        <Link key={`link-${i}`} to={m.link.path} className="lnk">
          {m.link.text}
        </Link>
      );
    } else {
      parts.push(
        <button
          key={`link-${i}`}
          type="button"
          className="lnk"
          onClick={() => onSelectQuestion && onSelectQuestion(m.link.target)}
        >
          {m.link.text}
        </button>
      );
    }

    lastIdx = m.end;
  });

  if (lastIdx < pText.length) {
    parts.push(pText.slice(lastIdx));
  }

  return parts;
}

function ShippingAnswerContent({ question, onSelectQuestion, onShowToast }) {
  // Aggregate all potential inline links for this question
  const allLinks = [];

  if (question.cardLink) {
    allLinks.push({
      text: question.cardLink.text,
      type: "card",
      target: "#rental-window"
    });
  }

  if (question.links) {
    question.links.forEach((l) => {
      const targetId = l.target.startsWith("q:")
        ? `#${l.target.slice(2)}`
        : `#${l.target}`;
      allLinks.push({
        text: l.text,
        type: "jump",
        target: targetId
      });
    });
  }

  if (question.pageLinks) {
    question.pageLinks.forEach((pl) => {
      allLinks.push({
        text: pl.text,
        type: "page",
        path: PAGE_ROUTES[pl.pageKey] || `/${pl.pageKey}`
      });
    });
  }

  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast("Opening WhatsApp");
    }
    const msg = `Hello House of Kaira, I have a question about delivery: ${question.question}`;
    const url = `https://wa.me/${SHIPPING_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();
    const cleanUrl = `${window.location.origin}${window.location.pathname}#${question.id}`;
    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const tempInput = document.createElement("input");
        tempInput.value = cleanUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (onShowToast) {
      onShowToast("Link copied. Paste it anywhere to share this answer.");
    }
  };

  return (
    <div className="ans">
      {question.paragraphs.map((p, pIdx) => (
        <p key={pIdx}>
          {renderParagraphWithLinks(p, allLinks, onSelectQuestion)}
        </p>
      ))}

      {question.bullets && question.bullets.length > 0 && (
        <ul>
          {question.bullets.map((b, bIdx) => (
            <li key={bIdx}>{b}</li>
          ))}
        </ul>
      )}

      {question.note && <p className="note">{question.note}</p>}

      {/* D11 Answer Footer Actions */}
      <div className="cq-foot">
        <a
          href={`https://wa.me/${SHIPPING_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(`Hello House of Kaira, I have a question about delivery: ${question.question}`)}`}
          onClick={handleWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          Still unsure? Ask us about this
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
        >
          <LinkIcon />
          Copy link
        </button>
      </div>
    </div>
  );
}

export default React.memo(ShippingAnswerContent);
