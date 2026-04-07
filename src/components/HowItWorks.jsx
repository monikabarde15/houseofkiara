import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  Search, MapPin, Package, Heart,
  Upload, Tag, Truck
} from "lucide-react";

import "../styles/howitswork.css";

export default function HowItWorks() {

  const [active, setActive] = useState("shop");

  /* SHOP CONTENT */
  const shopSteps = [
    {
      icon: <Search />,
      title: "Browse & Discover",
      desc: "Explore thousands of designer pieces across rent, preloved, and new categories — filtered by occasion, budget, and aesthetic."
    },
    {
      icon: <MapPin />,
      title: "Pick Your Path",
      desc: "Choose to rent for the occasion, buy preloved at a fraction of retail, or invest in something brand new — your occasion, your decision."
    },
    {
      icon: <Package />,
      title: "Doorstep Delivery",
      desc: "Your look arrives dry-cleaned, pressed, and ready to wear — delivered straight to your door before your event."
    },
    {
      icon: <Heart />,
      title: "Wear, Love, Repeat",
      desc: "Enjoy your look. For rentals, we collect it back after your event — cleaned, simple, and hassle-free. Fashion is more beautiful when it keeps moving."
    }
  ];

  /* SELL CONTENT */
  const sellSteps = [
    {
      icon: <Upload />,
      title: "Photograph & List",
      desc: "Upload a few photos of your piece, set your price, and go live in under 10 minutes."
    },
    {
      icon: <Tag />,
      title: "We Review & Feature",
      desc: "Our team reviews your listing and promotes it to the right buyers on the platform."
    },
    {
      icon: <Truck />,
      title: "Ship & Get Paid",
      desc: "Once sold, ship it out. Payment lands in your account within 3 working days — no chasing required."
    }
  ];

  const steps = active === "shop" ? shopSteps : sellSteps;

  return (
    <section className="how-section">

      <Container fluid="xl">

        {/* HEADER */}
        <div className="how-header">

          <div>
            <p className="section-label">
              <span className="line"></span>
              <span className="label-text">Simple by Design</span>
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

        {/* GRID */}
        <motion.div
          key={active}
          className={`steps-grid ${active === "sell" ? "sell" : ""}`}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } }
          }}
        >

          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="step-card"
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.6 }
                }
              }}
            >
              <div className="step-number">0{i + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <h5 className="step-title">{step.title}</h5>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}

          {/* CTA CARD (SELL ONLY) */}
          {active === "sell" && (
            <div className="cta-card">
              <h4 className="cta-title">
                The hours of <em>craftsmanship</em> on that piece deserve more than a dark wardrobe shelf.
              </h4>

              <p className="cta-desc">
                Give your occasion wear another life. Let someone else fall in love with it — and earn while you do.
              </p>

              <p className="cta-quote">
                "Every piece has a story. Don't let it end with you."
              </p>

              <button className="cta-btn">
                LIST YOUR PIECE →
              </button>
            </div>
          )}

        </motion.div>

      </Container>

    </section>
  );
}