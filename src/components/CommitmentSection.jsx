import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Repeat, Sparkles } from "lucide-react";
import "../styles/commitment.css";

export default function CommitmentSection() {

  const cards = [
    {
      icon: <ShieldCheck size={18} />,
      title: "Every piece resold is one less outfit the world needs to make.",
      desc: "Choosing to rent is a quiet act of intention."
    },
    {
      icon: <Heart size={18} />,
      title: "Designer craftsmanship should be experienced, not just owned.",
      desc: "Luxury is meant to be lived in."
    },
    {
      icon: <Repeat size={18} />,
      title: "Your wardrobe is an asset.",
      desc: "Let it generate value back to you."
    },
    {
      icon: <Sparkles size={18} />,
      title: "Occasion wear that outlives the occasion.",
      desc: "Every outfit carries stories."
    }
  ];

  return (
    <section className="commitment-section">

      <Container fluid="xl">

        <Row className="align-items-center g-4">

          {/* LEFT */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="eyebrow">
                <span className="line"></span> OUR COMMITMENT
              </p>

              <h2 className="title">
                Fashion that gives <span>back</span>
              </h2>

              <p className="desc">
                Every outfit rented or resold keeps textile waste out of landfill.
                Building India’s most loved circular fashion economy.
              </p>

              <div className="btn-group-custom mt-4">
                {["Rent","Buy Preloved","Buy New","List & Sell"].map((b,i)=>(
                  <button key={i} className="btn-pill">{b}</button>
                ))}
              </div>
            </motion.div>
          </Col>

          {/* RIGHT */}
          <Col lg={6}>
            <Row className="g-3">

              {cards.map((card, i) => (
                <Col md={6} key={i}>
                  <motion.div
                    className="commit-card"
                   initial={{ opacity: 0 }}
whileInView={{ opacity: 1 }}
transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="icon">{card.icon}</div>
                    <h4>{card.title}</h4>
                    <p>{card.desc}</p>
                  </motion.div>
                </Col>
              ))}

            </Row>
          </Col>

        </Row>

      </Container>

    </section>
  );
}