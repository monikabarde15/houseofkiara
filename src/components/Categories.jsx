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
    <section className="designer-section">

      <div className="designer-inner">

        {/* HEADER */}
       <div className="designer-header">

  {/* LEFT */}
  <div className="designer-left">

    <div className="designer-label">
      <span className="designer-cat-line"></span>
      <span className="label-text">CURATED FOR EVERY OCCASION</span>
    </div>

    <h2 className="section-title">
      Shop by <em>Category</em>
    </h2>

  </div>

  {/* RIGHT */}
  <div className="designer-view">
    VIEW ALL <span className="arrow">→</span>
  </div>

</div>
        {/* GRID */}
        <div className="designer-grid">

          {/* TOP */}
          <div className="designer-top">
            {data.slice(0,2).map((item, i) => (
              <div className="designer-card" key={i}>
                <img src={item.img} alt={item.title} />
                <div className="designer-overlay">
                  <h4>{item.title}</h4>
                  <span>SHOP NOW</span>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM */}
          <div className="designer-bottom">
            {data.slice(2).map((item, i) => (
              <div className="designer-card" key={i}>
                <img src={item.img} alt={item.title} />
                <div className="designer-overlay">
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