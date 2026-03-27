import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const products = [
  {
    tag: ["RENT", "PRELOVED"],
    name: "Gulabi Silk Bridal Lehenga",
    brand: "SABYASACHI",
    price: "₹12,000 / 4 days"
  },
  {
    tag: ["PRELOVED"],
    name: "Ivory Embroidered Sherwani",
    brand: "MANISH MALHOTRA",
    price: "₹38,000"
  },
  {
    tag: ["NEW"],
    name: "Midnight Blue Crepe Saree",
    brand: "TARUN TAHILIANI",
    price: "₹68,000"
  },
  {
    tag: ["RENT"],
    name: "Rose Georgette Anarkali",
    brand: "ANITA DONGRE",
    price: "₹6,500 / 4 days"
  }
];

export default function Featured() {
  return (
    <section className="section-padding">
      <Container>

        <div className="section-header">
        
          <h2 className="section-title">
              <p className="section-eyebrow">
                HANDPICKED FOR YOU
              </p>

            Featured <em>Pieces</em>
          </h2>
          <span className="view-all">VIEW ALL →</span>
        </div>

        <Row className="g-4 mt-3">

          {products.map((p, i) => (
            <Col lg={3} md={6} key={i}>

              <motion.div
                className="product-card"
                whileHover={{ y: -6 }}
              >

                {/* IMAGE */}
                <div className="product-img">
                  <div className="wishlist">♡</div>
                  {/* TAGS */}
                  <div className="tags">
                    {p.tag.map((t, i) => (
                      <span key={i} className={`tag ${t.toLowerCase()}`}>
                        {t}
                      </span>
                    ))}
                  </div>

                </div>

                {/* TEXT */}
                <p className="brand">{p.brand}</p>
                <h4 className="name">{p.name}</h4>
                <p className="price">{p.price}</p>

              </motion.div>

            </Col>
          ))}

        </Row>
      </Container>
    </section>
  );
}