import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Search, MapPin, Package, Heart, Upload, Tag, Truck, Wallet } from "lucide-react";

export default function HowItWorks() {
  const [active, setActive] = useState("shop");

  // 🛍️ SHOP DATA
  const shopSteps = [
    {
      icon: <Search size={18} />,
      title: "Browse & Discover",
      desc: "Explore thousands of designer pieces across rent, preloved, and new categories."
    },
    {
      icon: <MapPin size={18} />,
      title: "Pick Your Path",
      desc: "Choose to rent, buy preloved, or invest in something brand new."
    },
    {
      icon: <Package size={18} />,
      title: "Doorstep Delivery",
      desc: "Delivered dry-cleaned, pressed, and ready to wear."
    },
    {
      icon: <Heart size={18} />,
      title: "Wear, Love, Repeat",
      desc: "Enjoy your look. We handle pickup after use."
    }
  ];

  // 💰 SELL DATA
  const sellSteps = [
    {
      icon: <Upload size={18} />,
      title: "Upload Product",
      desc: "List your fashion items with images and details."
    },
    {
      icon: <Tag size={18} />,
      title: "Set Your Price",
      desc: "Choose selling or rental price for your product."
    },
    {
      icon: <Truck size={18} />,
      title: "We Handle Delivery",
      desc: "We take care of logistics and delivery."
    },
    {
      icon: <Wallet size={18} />,
      title: "Earn Money",
      desc: "Get paid directly once your item is sold or rented."
    }
  ];

  // 🔁 Dynamic steps based on toggle
  const steps = active === "shop" ? shopSteps : sellSteps;

  return (
    <section className="section-padding how-section">
      <Container>

        {/* HEADER */}
        <div className="how-header">
          <div>
            <p className="how-eyebrow">SIMPLE BY DESIGN</p>
            <h2 className="section-title">
              How House of Kaira <em>works</em>
            </h2>
          </div>

          {/* TOGGLE */}
          <div className="toggle">
            <button
              className={active === "shop" ? "active" : ""}
              onClick={() => setActive("shop")}
            >
              I WANT TO SHOP
            </button>

            <button
              className={active === "sell" ? "active" : ""}
              onClick={() => setActive("sell")}
            >
              I WANT TO SELL
            </button>
          </div>
        </div>

        {/* STEPS */}
        <Row className="g-0 mt-5">
          {steps.map((step, i) => (
            <Col lg={3} md={6} key={i}>
              <motion.div className="step-card">

                <h1 className="step-number">0{i + 1}</h1>

                <div className="step-icon">
                  {step.icon}
                </div>

                <h4 className="step-title">{step.title}</h4>

                <p className="step-desc">{step.desc}</p>

              </motion.div>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}