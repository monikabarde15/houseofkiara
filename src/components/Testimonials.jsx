import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/testimonials.css";
import { Star } from "lucide-react";

export default function Testimonials() {

  const data = [
    {
      text: "I wore a Sabyasachi lehenga to my sister’s wedding for a fraction of the retail price. The quality, the packaging — everything felt completely premium.",
      name: "Priya Rathore",
      detail: "Mumbai · Rented for a Wedding",
      initials: "PR",
    },
    {
      text: "Listed my wedding lehenga and sold it in 3 days. The process was so smooth and I got a great price.",
      name: "Aishwarya Sharma",
      detail: "Delhi · Sold her Bridal Lehenga",
      initials: "AS",
    },
    {
      text: "As someone who attends 6–8 weddings a year, HOK is a revelation. The curation is impeccable and delivery is always on time.",
      name: "Neha Kulkarni",
      detail: "Pune · Regular Renter",
      initials: "NK",
    },
  ];

  return (
    <section className="hp-testimonials-section">
<div className="hp-testimonials-inner">
      <Container>

        {/* HEADER */}
        <motion.div
          className="hp-section-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <div className="hp-eyebrow-wrap">
            <span className="hp-line"></span>
            <p className="hp-eyebrow-text">
              WORN, LOVED & SHARED ACROSS INDIA
            </p>
            <span className="hp-line"></span>
          </div>

          <h2 className="hp-testimonials-title">
            What our customers <span>say</span>
          </h2>

        </motion.div>
        <br/>
        {/* CARDS */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          <Row className="g-4 hp-testimonials-row">

            {data.map((item, i) => (
              <Col lg={4} md={6} xs={12} className="d-flex" key={i}>

                <motion.div
                  className="hp-testimonial-card"
                  variants={{
                   hidden: { opacity: 0, y: 40 },
show: { opacity: 1, y: 0 }
                  }}
                >

                  <div className="hp-testimonials-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#C9A96E" stroke="none" />
                    ))}
                  </div>
                  <div className="hp-testimonials-quote">"</div>

                  <p className="hp-testimonials-text">{item.text}</p>

                  <div className="hp-testimonials-user">
                    <div className="hp-testimonials-avatar">{item.initials}</div>
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.detail}</p>
                    </div>
                  </div>

                </motion.div>

              </Col>
            ))}

          </Row>
        </motion.div>

      </Container>
</div>
    </section>
  );
}