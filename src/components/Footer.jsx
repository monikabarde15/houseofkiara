import React from "react";
import { Container } from "react-bootstrap";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="hok-footer">

      <Container fluid="xl">

        {/* TOP */}
        <div className="footer-row">

          {/* BRAND */}
          <div className="footer-brand">
            <h3 className="logo">House of Kaira</h3>
            <p className="sub">Circular Luxury Fashion</p>

            <p className="tagline">
              "Every outfit has a story. We make sure it's never the last chapter."
            </p>

            <div className="socials">
              <span><FaInstagram /></span>
              <span><FaFacebookF /></span>
              <span><FaLinkedinIn /></span>
            </div>
          </div>

          {/* COLS */}
          <div className="footer-col">
            <h4>SHOP</h4>
            <ul>
              <li>Rent</li>
              <li>Buy Preloved</li>
              <li>Buy New</li>
              <li>Shop by Occasion</li>
              <li>Shop by Category</li>
              <li>All Designers</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SELL WITH US</h4>
            <ul>
              <li>List Your Piece</li>
              <li>How It Works</li>
              <li>Seller Guidelines</li>
              <li>Pricing & Fees</li>
              <li>Designer Partners</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>SUPPORT</h4>
            <ul>
              <li>FAQs</li>
              <li>Care, Cleaning & Damage</li>
              <li>Deposit Policy</li>
              <li>Refunds & Cancellations</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li>About HOK</li>
              <li>Sustainability</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>

        </div>

        {/* POLICY LINKS */}
        <div className="footer-middle">
          <div className="footer-links">
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
            <span>Refund & Cancellation Policy</span>
            <span>Deposit Policy</span>
            <span>Care, Cleaning & Damage Policy</span>
            <span>Cookie Policy</span>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">

          <p>
            © 2025 House of Kaira. All rights reserved. Indore, India.
          </p>

          <div className="footer-buttons">
            <span>SECURE PAYMENTS</span>
            <span>CIRCULAR FASHION</span>
          </div>

        </div>

      </Container>

    </footer>
  );
}