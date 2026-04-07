import React from "react";
import { Container } from "react-bootstrap";
import "../styles/designers.css";

export default function FeaturedDesigners() {

  const designers = [
    { name: "Sabyasachi", pieces: "214 pieces", image: "https://i.pinimg.com/736x/73/3c/67/733c67cc088a9b04c9495a64104eaa46.jpg" },
    { name: "Manish Malhotra", pieces: "187 pieces", image: "https://i.pinimg.com/736x/06/e4/47/06e447550bc57e1226507591a9b847e5.jpg" },
    { name: "Tarun Tahiliani", pieces: "143 pieces", image: "https://i.pinimg.com/736x/64/4d/ad/644dada7a4300ff468edc48628985f49.jpg" },
    { name: "Anita Dongre", pieces: "118 pieces", image: "https://i.pinimg.com/736x/52/82/d5/5282d56768cba6255a3c8eeb3c015c78.jpg" },
  ];

  return (
    <section className="fd">

      <Container fluid="xl">

        {/* HEADER */}
        <div className="fd__header">

          <div>
            <div className="fd__eyebrowRow">
              <span className="fd__line"></span>
              <p className="fd__eyebrow">TRUSTED CREATORS</p>
            </div>

            <h2 className="fd__title">
              Featured <em>Designers</em>
            </h2>
          </div>

          <div className="fd__viewAll">VIEW ALL</div>
        </div>

        {/* GRID */}
        <div className="fd__grid">
          {designers.map((d, i) => (
            <div key={i} className="fd__card">

             <img
              src={d.image || "/images/placeholder.jpg"}
              alt={d.name}
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg";
              }}
            />

              <div className="fd__overlay"></div>

              <div className="fd__content">
                <h4>{d.name}</h4>
                <p>{d.pieces}</p>
                <span>SHOP NOW</span>
              </div>

            </div>
          ))}
        </div>

      </Container>

    </section>
  );
}