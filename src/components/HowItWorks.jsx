import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  Search, MapPin, Package, Heart,
  Upload, Tag, Truck, Wallet
} from "lucide-react";
import "../styles/howitswork.css";

export default function HowItWorks() {

  const [active, setActive] = useState("shop");

  const shopSteps = [
    { icon: <Search size={18} />, title: "Browse & Discover", desc: "Explore thousands of designer pieces." },
    { icon: <MapPin size={18} />, title: "Pick Your Path", desc: "Choose rent, preloved or new." },
    { icon: <Package size={18} />, title: "Delivery", desc: "Delivered ready-to-wear." },
    { icon: <Heart size={18} />, title: "Wear & Return", desc: "Enjoy & we handle pickup." }
  ];

  const sellSteps = [
    { icon: <Upload size={18} />, title: "Upload", desc: "List your items easily." },
    { icon: <Tag size={18} />, title: "Set Price", desc: "Choose pricing." },
    { icon: <Truck size={18} />, title: "We Deliver", desc: "We manage delivery." },
    { icon: <Wallet size={18} />, title: "Earn", desc: "Get paid directly." }
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
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } }
          }}
        >
          <Row className="g-0 steps-row">

            {steps.map((step, i) => (
              <Col lg={3} md={6} key={i}>

                <motion.div
                  className="step-card"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 }
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

          </Row>
        </motion.div>

      </Container>

    </section>
  );
}