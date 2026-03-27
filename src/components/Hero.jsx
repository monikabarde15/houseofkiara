import React from "react";
import { Row, Col } from "react-bootstrap";

export default function Hero() {
  return (
    // <section className="hero">
    //   <div className="hero-wrapper">

    //     <Row className="g-0">

    //       {/* LEFT */}
    //       <Col lg={6} className="hero-left">

    //         <p className="hero-eyebrow">
    //           INDIA'S PREMIER CIRCULAR FASHION PLATFORM
    //         </p>

    //         <h1 className="hero-title">
    //           Wear it <br />
    //           with <em>love</em>. <br />
    //           Pass it on.
    //         </h1>

    //         <p className="hero-sub">
    //           Rent, buy preloved, or discover new designer pieces — 
    //           all in one curated destination for India's most discerning occasions.
    //         </p>

    //         <div className="hero-btns">
    //           <button className="btn-dark">
    //             EXPLORE COLLECTION
    //           </button>

    //           <button className="btn-light">
    //             HOW IT WORKS
    //           </button>
    //         </div>

    //       </Col>

    //       {/* RIGHT */}
    //       <Row className="g-0 hero-row">

    //     <Col lg={6} md={12} className="hero-left">
    //       {/* content */}
    //     </Col>

    //     <Col lg={6} md={12} className="hero-right">
    //       <img src="https://i.pinimg.com/1200x/85/e3/d7/85e3d75810dcad9df6c8dd082615705d.jpg" />
    //     </Col>

    //   </Row>

    //     </Row>

    //   </div>
    // </section>
<section className="hero">
  <div className="hero-wrapper">

    <div className="hero-row">

      <div className="hero-left">
        <p className="hero-eyebrow">INDIA'S PREMIER CIRCULAR FASHION PLATFORM</p>
              <h1 className="hero-title">
               Wear it <br />
               with <em>love</em>. <br />
               Pass it on.
             </h1>

             <p className="hero-sub">
               Rent, buy preloved, or discover new designer pieces — 
               all in one curated destination for India's most discerning occasions.
             </p>

             <div className="hero-btns">
               <button className="btn-dark">
                 EXPLORE COLLECTION
               </button>

               <button className="btn-light">
                 HOW IT WORKS
              </button>
             </div>
      </div>

      <div className="hero-right">
        <img src="https://i.pinimg.com/1200x/85/e3/d7/85e3d75810dcad9df6c8dd082615705d.jpg" alt="hero" />
      </div>

    </div>

  </div>
</section>
  );
}