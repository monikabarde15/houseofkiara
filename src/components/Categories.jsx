import React from "react";
import "../styles/categories.css";

export default function DesignersSection() {

  const data = [
    {
      title: "SAAKSHA & KINNI",
      img: "https://img.perniaspopupshop.com/HOMEPAGE_IMAGES/WOMEN/10_Apr_26/Saaksha-&-Kinni-desk-best-10-04-2026.jpg"
    },
    {
      title: "QUENCH A THIRST",
      img: "https://img.perniaspopupshop.com/HOMEPAGE_IMAGES/WOMEN/10_Apr_26/Quench-A-Thirst-desk-best-10-04-2026.jpg"
    },
    {
      title: "BASIL LEAF",
      img: "https://img.perniaspopupshop.com/HOMEPAGE_IMAGES/WOMEN/10_Apr_26/Basil-Leaf-desk-best-10-04-2026.jpg"
    },
    {
      title: "SAFAA",
      img: "https://img.perniaspopupshop.com/HOMEPAGE_IMAGES/WOMEN/10_Apr_26/Safaa-desk-best-10-04-2026.jpg"
    },
    {
      title: "RAJDEEP RANAWAT",
      img: "https://img.perniaspopupshop.com/HOMEPAGE_IMAGES/WOMEN/10_Apr_26/Rajdeep-Ranawat-desk-best-10-04-2026.jpg"
    }
  ];

  return (
    <section className="hp-designer-section">

      <div className="hp-designer-inner">

        {/* HEADER */}
        <div className="hp-designer-header">

          {/* LEFT */}
          <div className="hp-designer-left">

            <div className="hp-designer-label">
              <span className="hp-designer-cat-line"></span>
              <span className="hp-label-text">CURATED FOR EVERY OCCASION</span>
            </div>

            <h2 className="hp-section-title">
              Shop by <em>Category</em>
            </h2>

          </div>

          {/* RIGHT */}
          <div className="hp-designer-view">
            VIEW ALL <span className="arrow">→</span>
          </div>

        </div>
        {/* GRID */}
        <div className="hp-designer-grid">

          {/* TOP */}
          <div className="hp-designer-top">
            {data.slice(0, 2).map((item, i) => (
              <div className="hp-designer-card" key={i}>
                <img src={item.img} alt={item.title} />
                <div className="hp-designer-overlay">
                  <h4>{item.title}</h4>
                  <span>SHOP NOW</span>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM */}
          <div className="hp-designer-bottom">
            {data.slice(2).map((item, i) => (
              <div className="hp-designer-card" key={i}>
                <img src={item.img} alt={item.title} />
                <div className="hp-designer-overlay">
                  <h4>{item.title}</h4>
                  <span>SHOP NOW</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}