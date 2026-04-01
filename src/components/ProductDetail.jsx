import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart } from "lucide-react";
import "../styles/product-detail.css";

export default function ProductDetail() {
  const [zoom, setZoom] = useState(false);
const [wish, setWish] = useState(false);
const [selectedSize, setSelectedSize] = useState(null);
const handleAddToCart = () => {
  if (!selectedSize) {
    alert("Please select a size");
    return;
  }

  alert(`Added to cart: ${product.title} (${selectedSize})`);
};
  const product = {
    designer: "RAHUL MISHRA",
    title: "Ivory Threadwork",
    subTitle: "Anarkali Set",
    price: "₹2,85,000",
    tag: "BUY NEW",
    reviews: "3 reviews",
    images: [
      "https://i.pinimg.com/736x/91/97/93/9197932b37c0a9222429224c17aa77cc.jpg",
      "https://i.pinimg.com/736x/91/97/93/9197932b37c0a9222429224c17aa77cc.jpg",
      "https://i.pinimg.com/736x/91/97/93/9197932b37c0a9222429224c17aa77cc.jpg",
    ],
    colors: ["#eee6db", "#8b0000", "#000080", "#4b0082"],
    sizes: ["XS", "S", "M", "L", "XL"],
  };

  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <section className="pdp">
    
      <Container>
      <div className="breadcrumb">
  Home / Buy New / Anarkalis / Rahul Mishra / Ivory Threadwork Anarkali Set
</div>
        <Row>

          {/* LEFT */}
          <Col md={6} className="pdp-left-wrap">
            <div className="thumbs">
              {product.images.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImage(img)} />
              ))}
            </div>

           <div className="main-img" onClick={() => setZoom(!zoom)}>
              <img
                src={activeImage}
                alt=""
                className={zoom ? "zoomed" : ""}
              />

              <span className="tag">{product.tag}</span>

              <div className="wishlist" onClick={(e) => {
                e.stopPropagation();
                setWish(!wish);
              }}>
                <Heart size={16} fill={wish ? "black" : "none"} />
              </div>
            </div>
          </Col>

          {/* RIGHT */}
          <Col md={6}>
            <div className="pdp-right">

              <div className="top-tags">
                <div className="buy-tag">
                  BUY NEW
                </div>
                <span>READY TO SHIP</span>
              </div>

              <p className="designer">{product.designer}</p>

              <h1>
                {product.title}
                <span>{product.subTitle}</span>
              </h1>

              <div className="rating">
                <span className="stars">★★★★★</span>
                <span className="score">5.0</span>
                <span className="reviews">• {product.reviews}</span>
              </div>

              <h2 className="price">{product.price}</h2>

              <div className="delivery-box">
                Ready to ship • Dispatch in 2-3 days • Express available
              </div>

              {/* COLORS */}
              <div className="section">
                <p>SELECT COLOUR</p>
                <div className="colors">
                  {product.colors.map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* SIZE */}
              <div className="section">
                <div className="size-head">
                  <p>SELECT SIZE</p>
                  <span>SIZE GUIDE & MEASUREMENTS</span>
                </div>

               <div className="sizes">
                {product.sizes.map((s, i) => (
                  <span
                    key={i}
                    className={selectedSize === s ? "active" : ""}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </span>
                ))}
              </div>
              </div>

              {/* BUTTONS */}
             <button className="add-btn" onClick={handleAddToCart}>
                ADD TO BAG — {product.price}
              </button>

              <button className="wishlist-btn">
                SAVE TO WISHLIST
              </button>

              <button className="whatsapp-btn">
                ASK ON WHATSAPP
              </button>

              {/* INFO */}
              <div className="info-grid">
                <div>AUTHENTICATED BY HK</div>
                <div>DIRECT FROM DESIGNER</div>
                <div>READY TO SHIP</div>
              </div>

              {/* CONSULT */}
              <div className="consult-box">
                <p>Not sure if this is the one?</p>
                <button>CONSULT A STYLIST</button>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="product-details">
                <div className="details-header">
                  <p>PRODUCT DETAILS</p>
                  <span>×</span>
                </div>

                <div className="details-grid">

                  <div className="details-col">
                    <div><label>DESIGNER</label><p>Rahul Mishra</p></div>
                    <div><label>FABRIC</label><p>Pure Silk Georgette</p></div>
                    <div><label>CRAFT TECHNIQUE</label><p>Chikankari & Zardozi</p></div>
                    <div><label>INCLUDES</label><p>Anarkali, Churidar, Dupatta</p></div>
                    <div><label>DELIVERY TIME</label><p>3–5 business days</p></div>
                  </div>

                  <div className="details-col">
                    <div><label>CATEGORY</label><p>Anarkali Set</p></div>
                    <div><label>COLOUR</label><p>Ivory & Antique Gold</p></div>
                    <div><label>THREAD</label><p>Hand-spun silk</p></div>
                    <div><label>OCCASION</label><p>Wedding, Festive</p></div>
                    <div><label>ORIGIN</label><p>Lucknow, India</p></div>
                  </div>

                </div>
              </div>

              {/* ACCORDION */}
              <div className="accordion">
                <div className="acc-item">THE CRAFT <span>+</span></div>
                <div className="acc-item">SIZE & FIT <span>+</span></div>
                <div className="acc-item">CARE INSTRUCTIONS <span>+</span></div>
                <div className="acc-item">SHIPPING & DELIVERY <span>+</span></div>
              </div>

            </div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}