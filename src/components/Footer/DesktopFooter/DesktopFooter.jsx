// import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { footerColumns, policyLinks } from "../footerData";
import "../../../styles/Footer/desktop-footer.css";
import { showToast } from "../../AboutUs/shared/Toast";


const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M18 2H15A5 5 0 0 0 10 7V12H7V16H10V22H14V16H17L18 12H14V8A1 1 0 0 1 15 7H18V2Z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M16 8A6 6 0 0 1 22 14V22H18V14A2 2 0 0 0 16 12A2 2 0 0 0 14 14V22H10V8H14V10A4 4 0 0 1 16 8Z" />
    <rect x="2" y="9" width="4" height="13" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DesktopFooter = () => {
  return (
    
    <section className="hok-desktop-footer">
      <div className="hok-footer-top">
        <div className="hok-footer-brand">
          <h3>House of Kaira</h3>
          <span>Circular Luxury Fashion</span>
          <p>
            Every outfit has a story.
            We make sure it's never the last chapter.
          </p>
          <div className="hok-footer-socials">
            <button
              aria-label="Instagram"
              onClick={() => {
                showToast("Opening Instagram");
                window.open(
                  "https://instagram.com/house_of_kaira",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <InstagramIcon />
            </button>

            <button
              aria-label="Facebook"
              onClick={() => showToast("Facebook coming soon")}
            >
              <FacebookIcon />
            </button>

            <button
              aria-label="LinkedIn"
              onClick={() => showToast("LinkedIn coming soon")}
            >
              <LinkedinIcon />
            </button>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="hok-footer-column">
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              <a href={link.path} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="hok-footer-policy-row">
        {policyLinks.map((link, index) => (
          <a
            href={link.path}
            key={link.label}
            className={index === policyLinks.length - 1 ? "last" : ""}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="hok-footer-bottom">
        <p>© 2026 House of Kaira. All rights reserved.</p>
        <div className="hok-footer-badges">
          <span>Secure Payments</span>
          <span>Circular Fashion</span>
        </div>
      </div>
    </section>
  );
};

export default DesktopFooter;