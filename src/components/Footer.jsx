import React from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="footer">

      {/* TOP */}
      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-brand">
          <h3>HOUSE OF KAIRA</h3>
          <p className="sub">CIRCULAR LUXURY FASHION</p>

          <p className="tagline">
            "Every outfit has a story. We make sure it's never the last chapter."
          </p>

          <div className="socials">
            <span><FaInstagram size={16} /></span>
            <span><FaFacebookF size={16} /></span>
            <span><FaLinkedinIn size={16} /></span>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-col">
          <h4>SHOP</h4>
          <p>Rent</p>
          <p>Buy Preloved</p>
          <p>Buy New</p>
          <p>Shop by Occasion</p>
          <p>Shop by Category</p>
          <p>All Designers</p>
        </div>

        <div className="footer-col">
          <h4>SELL WITH US</h4>
          <p>List Your Piece</p>
          <p>How It Works</p>
          <p>Seller Guidelines</p>
          <p>Pricing & Fees</p>
          <p>Designer Partners</p>
        </div>

        <div className="footer-col">
          <h4>SUPPORT</h4>
          <p>FAQs</p>
          <p>Care, Cleaning & Damage</p>
          <p>Deposit Policy</p>
          <p>Refunds & Cancellations</p>
          <p>Contact Us</p>
        </div>

        <div className="footer-col">
          <h4>COMPANY</h4>
          <p>About HOK</p>
          <p>Sustainability</p>
          <p>Careers</p>
          <p>Press</p>
          <p>Blog</p>
        </div>

      </div>

      {/* MIDDLE LINKS */}
      <div className="footer-middle">
        <p>Terms & Conditions</p>
        <p>Privacy Policy</p>
        <p>Refund & Cancellation Policy</p>
        <p>Deposit Policy</p>
        <p>Care, Cleaning & Damage Policy</p>
        <p>Cookie Policy</p>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2025 House of Kaira. All rights reserved. India, India.</p>

        <div className="footer-buttons">
          <button>SECURE PAYMENTS</button>
          <button>CIRCULAR FASHION</button>
        </div>
      </div>

    </footer>
  );
}