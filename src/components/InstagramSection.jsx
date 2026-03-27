import React from "react";

export default function InstagramSection() {
  const posts = [
  "#4b1f0f",
  "#1f1c3b",
  "#0f2b1f",
  "#3b240f",
  "#3a1320",
  "#102531",
];

  return (
    <section className="instagram">
      <div className="container">

        {/* HEADER */}
        <div className="insta-header">
          <div>
            <p className="eyebrow">
              <span className="line"></span>
              OUR COMMUNITY
            </p>

            <h2>
              As seen on <span>Instagram</span>
            </h2>
          </div>

          <a href="#" className="follow-btn">
            FOLLOW US →
          </a>
        </div>

        {/* GRID */}
        <div className="insta-grid">
          {posts.map((color, i) => (
            <div
              key={i}
              className="insta-card"
              style={{ background: color }}
            >
              <div className="overlay" />
            </div>
          ))}
        </div>

        {/* BOTTOM TEXT */}
        <div className="insta-footer">
          <span className="line"></span>
          <p>
            Follow our story at <strong>@houseofkaira</strong>
          </p>
          <span className="line"></span>
        </div>

      </div>
    </section>
  );
}