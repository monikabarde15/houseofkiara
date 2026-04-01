import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/categories.css";

export default function Categories() {
  return (
    <section className="categories-section">

      <Container className="custom-container">

        {/* HEADER */}
        {/* <div className="section-header">

          <div className="heading-left">
            <div className="eyebrow-row">
              <span className="line"></span>
              <p className="eyebrow">CURATED FOR EVERY OCCASION</p>
            </div>

            <h2 className="section-title">
              Shop by <em>Category</em>
            </h2>
          </div>

          <span className="view-all">VIEW ALL →</span>

        </div> */}
      <div className="featured-header">

          <div className="heading-block">
          <div className="eyebrow-row">
            <div className="heading-line"></div>
            <p className="eyebrow">CURATED FOR EVERY OCCASION</p>
          </div>

          <h2 className="title">
            Shop by <em>Category</em>
          </h2>

        </div>

          <div className="view-all">VIEW ALL →</div>

        </div>
        {/* GRID */}
        <Row className="g-3">

          {/* TOP */}
          <Col lg={8}>
            <div className="cat-card big">
              <img src="https://i.pinimg.com/736x/88/c4/72/88c47272ed16ee684e43bfb1914bc5aa.jpg" />
              <div className="overlay">
                <h4>BRIDAL LEHENGAS</h4>
                <span>SHOP NOW</span>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div className="cat-card big">
              <img src="https://i.pinimg.com/736x/d0/bd/db/d0bddb788a66ba992c1cbf463933763f.jpg" />
              <div className="overlay">
                <h4>SHERWANIS</h4>
                <span>SHOP NOW</span>
              </div>
            </div>
          </Col>

          {/* BOTTOM */}
          {[
            "https://i.pinimg.com/736x/b0/57/8d/b0578d57080464cf62be53fe40234b92.jpg",
            "https://i.pinimg.com/736x/53/eb/0c/53eb0cafd815425db5da6c81a7ea3c70.jpg",
            "https://i.pinimg.com/736x/97/18/7e/97187ef2f16c67561b5e715cba9949c5.jpg"
          ].map((img, i) => (
            <Col lg={4} md={4} sm={12} key={i}>
              <div className="cat-card small">
                <img src={img} />
                <div className="overlay">
                  <h4>{["SAREES","ANARKALIS","INDO-WESTERN"][i]}</h4>
                  <span>SHOP NOW</span>
                </div>
              </div>
            </Col>
          ))}

        </Row>

      </Container>

    </section>
  );
}