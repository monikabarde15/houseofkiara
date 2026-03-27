import React from "react";

export default function Categories() {
  return (
    <section className="section-padding">
    
      <div className="container">

        <div className="section-header">
          <div>
            <p className="section-eyebrow">
              CURATED FOR EVERY OCCASION
            </p>

            <h2 className="section-title">
              Shop by <em>Category</em>
            </h2>
          </div>

          <div className="view-all">
            VIEW ALL →
          </div>
        </div>

       <div className="category-grid">

          <div className="cat big lehenga">
            <div className="overlay">
              <h4>BRIDAL LEHENGAS</h4>
              <span>SHOP NOW</span>
            </div>
          </div>

          <div className="cat right sherwani">
            <div className="overlay">
              <h4>SHERWANIS</h4>
              <span>SHOP NOW</span>
            </div>
          </div>

          <div className="category-bottom">

            <div className="cat saree">
              <div className="overlay">
                <h4>SAREES</h4>
                <span>SHOP NOW</span>
              </div>
            </div>

            <div className="cat anarkali">
              <div className="overlay">
                <h4>ANARKALIS</h4>
                <span>SHOP NOW</span>
              </div>
            </div>

            <div className="cat indo">
              <div className="overlay">
                <h4>INDO-WESTERN</h4>
                <span>SHOP NOW</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}