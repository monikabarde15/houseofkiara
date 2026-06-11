import { FaInstagram,FaFacebook,FaLinkedin } from "react-icons/fa";


import {
  footerColumns,
  policyLinks,
} from "../footerData";

import "../../../styles/Footer/mobile-footer.css";

const MobileFooter = () => {
  return (
    <section className="hok-mobile-footer">

      {/* Brand Block */}

      <div className="hok-mobile-footer-brand">

        <h3>House of Kaira</h3>

        <span>Circular Luxury Fashion</span>

        <p>
          Every outfit has a story.
          We make sure it's never the last chapter.
        </p>

        <div className="hok-mobile-footer-socials">

          <button>
            <FaInstagram size={13} />
          </button>

          <button>
            <FaFacebook size={13} />
          </button>

          <button>
            <FaLinkedin size={13} />
          </button>

        </div>

      </div>

      {/* Footer Columns */}

      <div className="hok-mobile-footer-columns">

        {footerColumns.map((column) => (
          <div
            key={column.title}
            className="hok-mobile-footer-column"
          >
            <h4>{column.title}</h4>

            {column.links.map((link) => (
              <a href="/" key={link}>
                {link}
              </a>
            ))}
          </div>
        ))}

      </div>

      {/* Policies */}

      <div className="hok-mobile-footer-policy">

        {policyLinks.map((link, index) => (
          <a
            href="/"
            key={link}
            className={
              index === policyLinks.length - 1
                ? "last"
                : ""
            }
          >
            {link}
          </a>
        ))}

      </div>

      {/* Copyright */}

      <div className="hok-mobile-footer-copyright">

        <p>
          © 2026 House of Kaira.
          All rights reserved.
        </p>

        <div className="hok-mobile-footer-badges">

          <span>Secure Payments</span>

          <span>Circular Fashion</span>

        </div>

      </div>

    </section>
  );
};

export default MobileFooter;