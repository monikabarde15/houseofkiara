import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "../styles/testimonials.css";

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
    <section className="testimonials-section">

      <Container fluid="xl">

        {/* HEADER */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <div className="eyebrow-wrap">
            <span className="line"></span>
            <p className="eyebrow-text">
              WORN, LOVED & SHARED ACROSS INDIA
            </p>
            <span className="line"></span>
          </div>

          <h2 className="title">
            What our customers <span>say</span>
          </h2>

        </motion.div>

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
          <Row className="g-4 testimonials-row">

            {data.map((item, i) => (
              <Col xl={4} lg={4} md={6} xs={12} key={i}>

                <motion.div
                  className="testimonial-card"
                  variants={{
                   hidden: { opacity: 0, y: 40 },
show: { opacity: 1, y: 0 }
                  }}
                >

                  <div className="stars">★★★★★</div>
                  <div className="quote">“</div>

                  <p className="text">{item.text}</p>

                  <div className="user">
                    <div className="avatar">{item.initials}</div>
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

    </section>
  );
}