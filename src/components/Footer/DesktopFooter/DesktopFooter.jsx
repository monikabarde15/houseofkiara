import { useLocation } from "react-router-dom";
import { desktopFooterColumns, desktopPolicyLinks } from "../footerData";
import "../../../styles/Footer/desktop-footer.css";
import { showToast } from "../../AboutUs/shared/Toast";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2H15A5 5 0 0 0 10 7V12H7V16H10V22H14V16H17L18 12H14V8A1 1 0 0 1 15 7H18V2Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8A6 6 0 0 1 22 14V22H18V14A2 2 0 0 0 16 12A2 2 0 0 0 14 14V22H10V8H14V10A4 4 0 0 1 16 8Z" />
    <rect x="2" y="9" width="4" height="13" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DesktopFooter = ({ footerSettings, brandSettings, contactSettings }) => {
  const location = useLocation();

  const isCurrentPage = (link) => {
    if (!location) return false;
    const currentPath = location.pathname;
    if (link.path === currentPath) return true;
    if (
      link.label === "Deposit Policy" &&
      (currentPath === "/deposit" || currentPath === "/deposit-policy")
    ) {
      return true;
    }
    if (
      link.label === "Seller Guidelines" &&
      (currentPath === "/seller-guidelines" || currentPath === "/seller" || currentPath === "/seller-faq")
    ) {
      return true;
    }
    if (
      link.label === "Contact Us" &&
      (currentPath === "/contact-us" || currentPath === "/contact" || currentPath === "/contactus")
    ) {
      return true;
    }
    if (
      (link.label === "Care, Cleaning & Damage" ||
        link.label === "Care, Cleaning & Damage Policy" ||
        link.label === "Care & Damage" ||
        link.label === "Care & Damage Policy") &&
      (currentPath === "/care-policy" ||
        currentPath === "/care" ||
        currentPath === "/care-cleaning-damage" ||
        currentPath === "/care-damage")
    ) {
      return true;
    }
    if (
      (link.label === "Shipping & Delivery" ||
        link.label === "Shipping & Delivery Policy") &&
      (currentPath === "/shipping-policy" ||
        currentPath === "/shipping" ||
        currentPath === "/shipping-and-delivery")
    ) {
      return true;
    }
    if (
      (link.label === "Pricing & Fees" ||
        link.label === "Pricing & Fees Policy" ||
        link.label === "Pricing and Fees") &&
      (currentPath === "/pricing-fees" ||
        currentPath === "/pricing" ||
        currentPath === "/pricing-policy")
    ) {
      return true;
    }
    return false;
  };

  const columns =
    footerSettings?.linkColumns && footerSettings.linkColumns.length > 0
      ? footerSettings.linkColumns
      : desktopFooterColumns;

  let policyLinks =
    footerSettings?.legalRow && footerSettings.legalRow.length > 0
      ? [...footerSettings.legalRow]
      : desktopPolicyLinks;

  const hasCookieSettings = policyLinks.some(
    (l) => l.isButton || l.label?.toLowerCase() === "cookie settings"
  );
  if (!hasCookieSettings) {
    policyLinks.push({
      label: "Cookie settings",
      isButton: true,
      action: "open-cookie-settings",
    });
  }

  const blurb = footerSettings?.blurbUnderWordmark || "Circular Luxury Fashion";
  const rawCopyright =
    footerSettings?.copyrightLine || "© 2026 House of Kaira. All rights reserved. Indore, India.";
  const cleanCopyright = rawCopyright.replace(/&copy;/g, "©");

  const badges = footerSettings?.trustBadges
    ? footerSettings.trustBadges
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : ["Secure Payments", "Circular Fashion"];

  return (
    <footer className="hok-desktop-footer">
      <div className="hok-footer-top">
        {/* Brand Column (Column 1) */}
        <div className="hok-footer-brand">
          <h3 className="hok-footer-brand-name">{brandSettings?.siteName || "House of Kaira"}</h3>
          <span className="hok-footer-brand-sub">{brandSettings?.tagline || blurb}</span>
          <p className="hok-footer-tagline">
            &ldquo;{brandSettings?.brandQuote || "Every outfit has a story. We make sure it's never the last chapter."}&rdquo;
          </p>
          <div className="hok-footer-socials">
            <button
              type="button"
              aria-label="Instagram"
              onClick={() => {
                showToast("Opening Instagram");
                const handle =
                  contactSettings?.social?.instagram || "@house_of_kaira";
                const url = handle.startsWith("http")
                  ? handle
                  : `https://instagram.com/${handle.replace(/^@/, "")}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <InstagramIcon />
            </button>

            <button
              type="button"
              aria-label="Facebook"
              onClick={() => {
                const fb = contactSettings?.social?.facebook;
                if (fb && fb.trim()) {
                  showToast("Opening Facebook");
                  const url = fb.startsWith("http") ? fb : `https://facebook.com/${fb}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                } else {
                  showToast("Facebook coming soon");
                }
              }}
            >
              <FacebookIcon />
            </button>

            <button
              type="button"
              aria-label="LinkedIn"
              onClick={() => {
                const li = contactSettings?.social?.linkedIn;
                if (li && li.trim()) {
                  showToast("Opening LinkedIn");
                  const url = li.startsWith("http") ? li : `https://linkedin.com/${li}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                } else {
                  showToast("LinkedIn coming soon");
                }
              }}
            >
              <LinkedinIcon />
            </button>
          </div>
        </div>

        {/* Footer Columns (Columns 2–5) */}
        {columns.map((column) => (
          <div key={column.heading || column.title || column.id} className="hok-footer-column">
            <h4 className="hok-footer-column-heading">{column.heading || column.title}</h4>
            <div className="hok-footer-column-links">
              {(column.links || []).map((link) => {
                const isCurrent = isCurrentPage(link);
                if (isCurrent) {
                  return (
                    <span
                      key={link.id || link.label}
                      className="hok-footer-link here"
                      aria-current="page"
                    >
                      {link.label}
                    </span>
                  );
                }
                return (
                  <a href={link.path} key={link.id || link.label} className="hok-footer-link">
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Policy Links Row */}
      <div className="hok-footer-policy-row">
        {policyLinks.map((link, index) => {
          const isLast = index === policyLinks.length - 1;
          const isCurrent = isCurrentPage(link);
          const isBtn = link.isButton || link.label?.toLowerCase() === "cookie settings";

          if (isBtn) {
            return (
              <button
                type="button"
                key={link.id || link.label}
                className={`hok-footer-policy-link ${isLast ? "last" : ""}`}
                onClick={() => {
                  if (typeof window !== "undefined" && window.HOK_CONSENT) {
                    window.HOK_CONSENT.open();
                  }
                }}
              >
                {link.label}
              </button>
            );
          }

          if (isCurrent) {
            return (
              <span
                key={link.id || link.label}
                className={`hok-footer-policy-link here ${isLast ? "last" : ""}`}
                aria-current="page"
              >
                {link.label}
              </span>
            );
          }

          return (
            <a
              href={link.path}
              key={link.id || link.label}
              className={`hok-footer-policy-link ${isLast ? "last" : ""}`}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      {/* Copyright Bar */}
      <div className="hok-footer-bottom">
        <p className="hok-footer-copyright">{cleanCopyright}</p>
        <div className="hok-footer-badges">
          {badges.map((badge, idx) => (
            <span key={idx} className="hok-footer-badge">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
