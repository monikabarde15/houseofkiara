/**
 * House of Kaira - Seller Closing Band Component (Component C11)
 * Section 5.11 & Appendix A of Build Specification 1.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { SELLER_CLOSING_BAND } from "../../data/seller/sellerRegistry";

export default function SellerClosingBand() {
  return (
    <section className="sg-close" aria-labelledby="sg-close-heading">
      <div className="sg-close-inner">
        {/* Left Column: CTA & WhatsApp */}
        <div>
          <h2 id="sg-close-heading">{SELLER_CLOSING_BAND.title}</h2>
          <p className="sg-close-lead">{SELLER_CLOSING_BAND.lead}</p>

          <div className="sg-btns">
            <a
              href={SELLER_CLOSING_BAND.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83-1.56 1.56-3.63 2.41-5.82 2.41-1.46 0-2.9-.39-4.16-1.14l-.3-.18-3.1 1.05.83-3.02-.2-.31a8.16 8.16 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.23-8.24zm4.52 11.63c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
              </svg>
              <span>Message us on WhatsApp</span>
            </a>

            <Link
              to={SELLER_CLOSING_BAND.list_your_piece_url}
              className="btn btn-line"
            >
              List your piece
            </Link>
          </div>
        </div>

        {/* Right Column: Agreement Panel */}
        <div className="sg-agree">
          <h3>{SELLER_CLOSING_BAND.panel_title}</h3>
          <p>{SELLER_CLOSING_BAND.panel_text}</p>

          <ul>
            {SELLER_CLOSING_BAND.panel_links.map((link, idx) => (
              <li key={idx}>
                <Link to={link.href}>
                  <span>{link.label}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
