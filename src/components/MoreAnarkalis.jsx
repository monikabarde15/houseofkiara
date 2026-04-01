import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart } from "lucide-react";
import "../styles/product-list.css";
import { Link } from "react-router-dom";
const products = [
  {
    id: 1,
    designer: "RAHUL MISHRA",
    name: "Blush Zardosi Anarkali",
    price: "₹2,40,000",
    tag: "NEW",
    color: "#eee6db",
  },
  {
    id: 2,
    designer: "RAHUL MISHRA",
    name: "Midnight Threadwork Sharara Set",
    price: "₹3,10,000",
    tag: "RENT",
    color: "#2c1c4d",
  },
  {
    id: 3,
    designer: "RAHUL MISHRA",
    name: "Crimson Embroidered Lehenga",
    price: "₹4,20,000",
    tag: "NEW",
    color: "#0f2f1f",
  },
  {
    id: 4,
    designer: "RAHUL MISHRA",
    name: "Ivory Resham Kurta Set",
    price: "₹1,85,000",
    tag: "PRELOVED",
    color: "#4b0f14",
  },
];

export default function MoreAnarkalis() {
  return (
    <section className="luxury-products">
      <Container>

        {/* HEADER */}
        <div className="lux-header d-flex justify-content-between align-items-center">
          <div>
            <p className="sub">FROM THE SAME HOUSE</p>
            <h2>
              More by <span>Rahul Mishra</span>
            </h2>
          </div>

          <p className="view-all">VIEW ALL →</p>
        </div>

        {/* GRID */}
        <Row className="g-4">
          {products.map((item) => (
            <Col lg={3} md={4} sm={6} xs={6} key={item.id}>
             <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
              <div className="lux-card">

                {/* COLOR BOX (NO IMAGE) */}
                <div
                  className="img-box"
                  style={{ background: item.color }}
                >
                  {/* TAG */}
                  <span className={`badge-${item.tag.toLowerCase()}`}>
                    {item.tag}
                  </span>

                  {/* WISHLIST */}
                  <div className="wishlist">
                    <Heart size={16} />
                  </div>
                </div>

                {/* TEXT */}
                <div className="info">
                  <p className="designer">{item.designer}</p>
                  <h6>{item.name}</h6>
                  <p className="price">{item.price}</p>
                </div>

              </div>
              </Link>
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}