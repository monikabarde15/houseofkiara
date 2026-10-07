/**
 * House of Kaira - Deposit Policy Answer Content & Footer (D11)
 * Section 5 (D11), 6.7 & 6.8 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import { DEPOSIT_SETTINGS } from '../../data/deposit/depositSettings.js';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="fill" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.4-.5-2.6-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 2 .6 3.8 1.6 5.3L2 22l4.8-1.6C8.2 21.4 10 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const DepositAnswerContent = ({
  questionId,
  questionText,
  content,
  onJump,
  onShowToast
}) => {
  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast('Opening WhatsApp');
    const msg = `Hello House of Kaira, I have a question about my security deposit: ${questionText}`;
    const url = `https://wa.me/${DEPOSIT_SETTINGS.support_whatsapp_raw}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();
    const cleanUrl = `${window.location.origin}${window.location.pathname}#${questionId}`;
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
        const tempInput = document.createElement('input');
        tempInput.value = cleanUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (onShowToast) {
      if (copied) {
        onShowToast('Link copied. Paste it anywhere to share this answer.');
      } else {
        onShowToast(cleanUrl);
      }
    }
  };

  return (
    <div
      className="cq-body"
      id={`ans-${questionId}`}
      role="region"
      aria-labelledby={`btn-${questionId}`}
    >
      <div className="cq-in">
        <div className="cq-pad">
          <div className="ans">
            {content.map((block, idx) => {
              if (block.type === 'p') {
                return (
                  <p key={idx}>
                    {block.text}
                    {block.links &&
                      block.links.map((link, lIdx) => {
                        if (link.anchor) {
                          return (
                            <React.Fragment key={lIdx}>
                              <button
                                type="button"
                                className="lnk"
                                onClick={() => onJump && onJump(link.anchor, link.exampleTab)}
                              >
                                {link.label}
                              </button>
                              {link.suffix}
                            </React.Fragment>
                          );
                        }
                        return (
                          <React.Fragment key={lIdx}>
                            <a href={link.path} className="lnk">
                              {link.label}
                            </a>
                            {link.suffix}
                          </React.Fragment>
                        );
                      })}
                  </p>
                );
              }

              if (block.type === 'ul') {
                return (
                  <ul key={idx}>
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }

              if (block.type === 'note') {
                return (
                  <div key={idx} className="note">
                    {block.text}
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* D11 Answer Footer Actions */}
          <div className="cq-foot">
            <button
              type="button"
              onClick={handleWhatsApp}
              aria-label={`Ask about ${questionText} on WhatsApp`}
            >
              <WhatsAppIcon />
              Still unsure? Ask us about this
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy direct link to this answer"
            >
              <LinkIcon />
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DepositAnswerContent);
