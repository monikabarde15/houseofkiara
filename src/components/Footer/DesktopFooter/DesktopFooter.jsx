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

const DesktopFooter = () => {
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
    return false;
  };
  return (
    <footer className="hok-desktop-footer">
      <div className="hok-footer-top">
        {/* Brand Column (Column 1) */}
        <div className="hok-footer-brand">
          <h3 className="hok-footer-brand-name">House of Kaira</h3>
          <span className="hok-footer-brand-sub">Circular Luxury Fashion</span>
          <p className="hok-footer-tagline">
            &ldquo;Every outfit has a story. We make sure it&apos;s never the last chapter.&rdquo;
          </p>
          <div className="hok-footer-socials">
            <button
              type="button"
              aria-label="Instagram"
              onClick={() => {
                showToast("Opening Instagram");
                window.open(
                  "https://instagram.com/houseofkaira",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <InstagramIcon />
            </button>

            <button
              type="button"
              aria-label="Facebook"
              onClick={() => showToast("Facebook coming soon")}
            >
              <FacebookIcon />
            </button>

            <button
              type="button"
              aria-label="LinkedIn"
              onClick={() => showToast("LinkedIn coming soon")}
            >
              <LinkedinIcon />
            </button>
          </div>
        </div>

        {/* Footer Columns (Columns 2–5) */}
        {desktopFooterColumns.map((column) => (
          <div key={column.title} className="hok-footer-column">
            <h4 className="hok-footer-column-heading">{column.title}</h4>
            <div className="hok-footer-column-links">
              {column.links.map((link) => {
                const isCurrent = isCurrentPage(link);
                if (isCurrent) {
                  return (
                    <span
                      key={link.label}
                      className="hok-footer-link here"
                      aria-current="page"
                    >
                      {link.label}
                    </span>
                  );
                }
                return (
                  <a href={link.path} key={link.label} className="hok-footer-link">
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
        {desktopPolicyLinks.map((link, index) => {
          const isLast = index === desktopPolicyLinks.length - 1;
          const isCurrent = isCurrentPage(link);

          if (link.isButton) {
            return (
              <button
                type="button"
                key={link.label}
                className={`hok-footer-policy-link ${isLast ? "last" : ""}`}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.HOK_CONSENT) {
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
                key={link.label}
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
              key={link.label}
              className={`hok-footer-policy-link ${isLast ? "last" : ""}`}
            >
              {link.label}
            </a>
          );
        })}
      </div>

      {/* Copyright Bar */}
      <div className="hok-footer-bottom">
        <p className="hok-footer-copyright">
          &copy; 2025 House of Kaira. All rights reserved. Indore, India.
        </p>
        <div className="hok-footer-badges">
          <span className="hok-footer-badge">Secure Payments</span>
          <span className="hok-footer-badge">Circular Fashion</span>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;