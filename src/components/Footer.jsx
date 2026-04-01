import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="hok-footer">

      <Container fluid="xl">

        {/* TOP */}
        <Row className="g-4 footer-row">

          {/* BRAND */}
          <Col xl={3} lg={3} md={12} className="footer-brand">
            <h3 className="logo">HOUSE OF KAIRA</h3>
            <p className="sub">CIRCULAR LUXURY FASHION</p>

            <p className="tagline">
              "Every outfit has a story. We make sure it's never the last chapter."
            </p>

            <div className="socials">
              <span><FaInstagram /></span>
              <span><FaFacebookF /></span>
              <span><FaLinkedinIn /></span>
            </div>
          </Col>

          {/* COLS */}
          <Col xl={2} lg={2} md={4} sm={6} xs={6} className="footer-col">
            <h4>SHOP</h4>
            <ul>
              <li>Rent</li>
              <li>Buy Preloved</li>
              <li>Buy New</li>
              <li>Occasion</li>
              <li>Category</li>
              <li>Designers</li>
            </ul>
          </Col>

          <Col xl={2} lg={2} md={4} sm={6} xs={6} className="footer-col">
            <h4>SELL WITH US</h4>
            <ul>
              <li>List Your Piece</li>
              <li>How It Works</li>
              <li>Guidelines</li>
              <li>Pricing</li>
              <li>Partners</li>
            </ul>
          </Col>

          <Col xl={2} lg={2} md={4} sm={6} xs={6} className="footer-col">
            <h4>SUPPORT</h4>
            <ul>
              <li>FAQs</li>
              <li>Care</li>
              <li>Deposit</li>
              <li>Refunds</li>
              <li>Contact</li>
            </ul>
          </Col>

          <Col xl={3} lg={3} md={6} sm={6} xs={6} className="footer-col">
            <h4>COMPANY</h4>
            <ul>
              <li>About</li>
              <li>Sustainability</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </Col>

        </Row>

        {/* MIDDLE */}
        <div className="footer-middle">
          <div className="footer-links">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Refund Policy</span>
            <span>Deposit</span>
            <span>Care Policy</span>
            <span>Cookies</span>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">

          <p>
            © 2025 House of Kaira. All rights reserved.
          </p>

          <div className="footer-buttons">
            <button>SECURE PAYMENTS</button>
            <button>CIRCULAR FASHION</button>
          </div>

        </div>

      </Container>

    </footer>
  );
}