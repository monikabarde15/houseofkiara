import React from "react";

export default function FeaturedDesigners() {
  const designers = [
    { name: "Sabyasachi", pieces: "210 Pieces", color: "#5a1d0c" },
    { name: "Manish Malhotra", pieces: "98 Pieces", color: "#1c1a3a" },
    { name: "Tarun Tahiliani", pieces: "88 Pieces", color: "#0f2e1c" },
    { name: "Anita Dongre", pieces: "84 Pieces", color: "#3a240f" },
    { name: "Ritu Kumar", pieces: "81 Pieces", color: "#3a0f1c" },
    { name: "Rahul Mishra", pieces: "64 Pieces", color: "#0f2430" },
  ];

  return (
    <section className="designers">
      <div className="container">

        {/* HEADER */}
        <div className="designer-header">
          <div>
            <p className="eyebrow">
                <span className="line"></span>
                TRUSTED CREATORS
            </p>
            <h2>
              Featured <span>Designers</span>
            </h2>
          </div>

          <a href="#" className="view-all">
            ALL DESIGNERS →
          </a>
        </div>

        {/* GRID */}
        <div className="designer-grid">
          {designers.map((d, i) => (
            <div
              key={i}
              className="designer-card"
              style={{ background: d.color }}
            >
              <div className="overlay" />

              <div className="content">
                <h4>{d.name}</h4>
                <p>{d.pieces}</p>
                <span>SHOP NOW</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}