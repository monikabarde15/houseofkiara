import React from "react";
import "../styles/categories.css";

export default function CategoriesNew() {
  return (
    <section className="hok-cat-section">
 <div className="hok-container">  
      {/* HEADER */}
      <div className="hok-cat-header">
        <div>
          <div className="hok-cat-label">
            <span className="hok-line"></span>
            <span>CURATED FOR EVERY OCCASION</span>
          </div>

          <h2 className="hok-cat-title">
            Shop by <em>Category</em>
          </h2>
        </div>

        <div className="hok-view">VIEW ALL →</div>
      </div>

      {/* GRID */}
      <div className="hok-cat-grid">

        {/* TOP */}
        <div className="hok-row-top">
          <div className="hok-card">
            <img src="https://i.pinimg.com/736x/88/c4/72/88c47272ed16ee684e43bfb1914bc5aa.jpg" />
            <div className="hok-overlay">
              <h4>BRIDAL LEHENGAS</h4>
              <span>SHOP NOW</span>
            </div>
          </div>

          <div className="hok-card">
            <img src="https://i.pinimg.com/736x/d0/bd/db/d0bddb788a66ba992c1cbf463933763f.jpg" />
            <div className="hok-overlay">
              <h4>SHERWANIS</h4>
              <span>SHOP NOW</span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="hok-row-bottom">
          {[
            "SAREES",
            "ANARKALIS",
            "INDO-WESTERN"
          ].map((title, i) => (
            <div className="hok-card" key={i}>
              <img src="https://i.pinimg.com/736x/b0/57/8d/b0578d57080464cf62be53fe40234b92.jpg" />
              <div className="hok-overlay">
                <h4>{title}</h4>
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