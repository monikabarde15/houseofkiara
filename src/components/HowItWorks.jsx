import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  Search, MapPin, Package, Heart,
  Upload, Tag, Truck
} from "lucide-react";
import "../styles/howitswork.css";

export default function HowItWorks() {

  const [active, setActive] = useState("shop");

  const shopSteps = [
    {
      icon: <Search size={16} strokeWidth={1.5} />,
      title: "Browse & Discover",
      desc: "Explore a curated selection of designer pieces, handpicked for every occasion."
    },
    {
      icon: <MapPin size={16} strokeWidth={1.5} />,
      title: "Choose Your Style",
      desc: "Select from rental, preloved, or new — tailored to your preference."
    },
    {
      icon: <Package size={16} strokeWidth={1.5} />,
      title: "Delivered to You",
      desc: "Receive your outfit, perfectly prepared and ready to wear."
    },
    {
      icon: <Heart size={16} strokeWidth={1.5} />,
      title: "Wear & Return",
      desc: "Enjoy your look and return it effortlessly — we handle the rest."
    }
  ];

  const sellSteps = [
    {
      icon: <Upload size={16} strokeWidth={1.5} />,
      title: "List Your Piece",
      desc: "Upload your designer items with ease in just a few simple steps."
    },
    {
      icon: <Tag size={16} strokeWidth={1.5} />,
      title: "Set Your Price",
      desc: "Choose your pricing and let your piece find the right audience."
    },
    {
      icon: <Truck size={16} strokeWidth={1.5} />,
      title: "We Handle Delivery",
      desc: "From pickup to delivery, we take care of the entire process."
    }
  ];

  const steps = active === "shop" ? shopSteps : sellSteps;

  return (
    <section className="how-section">

      <Container fluid="xl">

        {/* HEADER */}
        <div className="how-header">

          <div>
            <p className="eyebrow">
              <span className="line"></span> SIMPLE BY DESIGN
            </p>

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
        <motion.div
          key={active}   // 🔥 IMPORTANT FIX
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.12 }
            }
          }}
        >
          <Row className="steps-row g-4">

            {steps.map((step, i) => (
              <Col lg={3} md={6} sm={12} key={i}>

                <motion.div
                  className="step-card"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 20,
                      filter: "blur(4px)"
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.6,
                        ease: [0.25, 0.1, 0.25, 1]
                      }
                    }
                  }}
                >
                  <div className="step-number">0{i + 1}</div>
                  <div className="step-icon">{step.icon}</div>
                  <h5 className="step-title">{step.title}</h5>
                  <p className="step-desc">{step.desc}</p>
                </motion.div>

              </Col>
            ))}

            {/* ✅ SELL CTA CARD */}
            {active === "sell" && (
              <Col lg={3} md={6} sm={12}>
                <div className="cta-card">
                  <h4 className="cta-title">
                    The hours of <em>craftsmanship</em> on that piece deserve more than a dark wardrobe shelf.
                  </h4>

                  <p className="cta-desc">
                    Give your occasion wear another life. Let someone else fall in love with it — and earn while you do.
                  </p>

                  <button className="cta-btn">
                    LIST YOUR PIECE →
                  </button>
                </div>
              </Col>
            )}

          </Row>
        </motion.div>

      </Container>

    </section>
  );
}