import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { footerColumns, policyLinks } from "../footerData";
import "../../../styles/Footer/desktop-footer.css";

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
            <button aria-label="Instagram">
              <FaInstagram size={14} />
            </button>
            <button aria-label="Facebook">
              <FaFacebook size={14} />
            </button>
            <button aria-label="LinkedIn">
              <FaLinkedin size={14} />
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