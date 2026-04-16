import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, Truck, Shield, User, Box, Plus, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import "../styles/product-detail.css";
import RelatedProduct from "./RelatedProduct";

export default function ProductDetail() {
  const location = useLocation();
  const product = location.state?.product;

  const [wish, setWish] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [rating, setRating] = useState(4);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("highlights");
  const [openSections, setOpenSections] = useState(["details"]);

  const [price, setPrice] = useState(product?.price);
  const [activeImage, setActiveImage] = useState(product?.images?.[0]);

  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

  const toggle = (key) => {
    setOpenSections((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const isOpen = (key) => openSections.includes(key);

  useEffect(() => {
    if (product.colors?.length) {
      setSelectedColor(product.colors[0].code);
      setActiveImage(product.colors[0].images[0]);
    }
  }, [product]);

  const handleSize = (size) => {
    setSelectedSize(size);
    let base = Number(product.price.replace(/[^0-9]/g, ""));
    if (size === "M") base += 2000;
    if (size === "L") base += 5000;
    setPrice(`₹${base.toLocaleString()}`);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select size");
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <section className="pdp">
      <Container>

        {/*  BREADCRUMB */}
        <div className="pdp-breadcrumb-wrapper">
          <div className="breadcrumb">
            <span className="crumb">Home</span>
            <span className="sep">›</span>
            <span className="crumb">Buy New</span>
            <span className="sep">›</span>
            <span className="crumb">{product.category}</span>
            <span className="sep">›</span>
            <span className="crumb">{product.designer}</span>
            <span className="sep">›</span>
            <span className="crumb current">
              {product.title} {product.subTitle}
            </span>
          </div>
        </div>

        <Row>

          {/* LEFT */}
          <Col md={6} className="pdp-left-wrap">

            <div className="thumbs">
              {product.images?.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImage(img)} />
              ))}
            </div>

            {/* Main Image */}
            <div
              className="main-img"
              style={{ backgroundImage: `url(${activeImage})` }}
            >
              <img src={activeImage} alt={product.title} />

              <div className="gallery-badge">Buy New</div>

              <button
                className="wishlist-icon-btn"
                onClick={() => setWish(!wish)}
              >
                <Heart className={`wishlist-icon ${wish ? "active" : ""}`} />
              </button>

              <div className="zoom-hint">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
                </svg>
                ZOOM
              </div>

            </div>

          </Col>

          {/* RIGHT */}
          <Col md={6}>
            {/* <div className="pdp-right-grid"> */}

            {/* INFO */}
            <div className="pdp-info">

              {/* ===== Top Tags (eyebrow + designer + title + desc + rating) ===== */}
              <div className="eyebrow">

                <span className="line"></span>

                {/* {product.badges?.includes("BUY NEW") && (
                    <span className="eyebrow-text">BUY NEW</span>
                    )} */}

                <span className="eyebrow-text">
                  BUY NEW
                </span>

                {/* {product.badges?.includes("NEVER WORN") && (
                    <span className="never-worn-badge">
                      NEVER WORN
                    </span>
                  )} */}

                <span className="never-worn-badge">
                  NEVER WORN
                </span>

              </div>


              <p className="designer-name">
                {product.designer}
              </p>

              <h1 className="product-title">
                {product.title} <em>{product.subTitle}</em>
              </h1>

              <p className="product-desc">
                {product.description}
              </p>

              <div className="rating-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={product.rating >= s ? "#c5a46d" : "none"}
                    stroke="#c5a46d"
                    strokeWidth={1.5}
                  />
                ))}

                <span className="rating-text">{product.rating}.0</span>
                <span className="reviews">{product.reviews} reviews</span>

                {/* {product.badges?.includes("NEVER WORN") && (
                    <span className="never-worn-soft">
                      NEVER WORN
                    </span>
                  )} */}
                <span className="never-worn-soft">
                  NEVER WORN
                </span>
              </div>

              {/* ========PRICE BLOCK ====== */}

              <div className="price-block">

                <p className="price-label">Price</p>
                <h2 className="main-price">{price}</h2>
                <p className="price-meta">
                  Inclusive of all taxes · Free delivery above ₹2,999
                </p>

              </div>

              {/* =========DELIVERY ROW ======= */}

              <div className="delivery-row">
                <div className="delivery-icon">
                  <Truck />
                </div>

                <p className="delivery-text">
                  <span className="strong">Ready to ship</span> · Dispatches in 2–3 days · Standard delivery 4–6 days
                </p>
              </div>

              {/* COLORS */}
              <div className="color-section">
                <p className="section-label">SELECT COLOUR</p>
                <div className="swatches-details">
                  {product.colors?.map((c, i) => (
                    <div
                      key={i}
                      className={`swatches-details ${selectedColor === c.code ? "active" : ""}`}
                      onClick={() => {
                        console.log(product.colors)
                        setSelectedColor(c.code);
                        setActiveImage(c.images[0]);
                      }}
                    >
                      <div
                        className="swatch-circle-details"
                        style={{ backgroundColor: c.code }}
                      ></div>
                      <span className="swatch-name">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIZE */}
              <div className="section">
                <div className="size-header">
                  <p className="size-label">Select Size</p>
                  <span className="size-guide">Size Guide & Measurements</span>
                </div>
                <div className="sizes">
                  {product.sizes?.map((s, i) => (
                    <span
                      key={i}
                      className={`${selectedSize === s ? "active" : ""} ${!product.availableSizes?.includes(s) ? "disabled" : ""}`}
                      onClick={() => {
                        if (!product.availableSizes?.includes(s)) return;
                        handleSize(s);
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="size-note">
                  This piece is unstitched. It runs true to size — for a more relaxed flare in the anarkali silhouette, consider sizing up.
                  <span className="size-help"> Need help choosing?</span>
                </p>
              </div>

              {/* CTA Section */}

              <div className="cta-section">

                <div className="qty">
                  <span>Qty:</span>
                  <select>
                    {[1, 2, 3, 4, 5].map(q => (
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <button className="add-btn" onClick={handleAddToCart}>
                  {added ? "✔ ADDED" : "ADD TO BAG"}
                </button>

                <button className="buy-now">BUY NOW</button>
                <button className="wishlist-btn">SAVE TO WISHLIST</button>
                <button className="whatsapp-btn">ASK ON WHATSAPP</button>

              </div>

              {/* Trust Badages */}

              <div className="trust-badages">
                <div className="trust-item">
                  <Shield />
                  <span>Authenticated by HOK</span>
                </div>
                <div className="trust-item">
                  <Box />
                  <span>Direct from designer</span>
                </div>
                <div className="trust-item">
                  <Truck />
                  <span>Ready to Ship</span>
                </div>
              </div>

              {/* Consultant */}

              <div className="consult-box">
                <div className="consult-left">
                  <div className="consult-icon">
                    <User />
                  </div>

                  <div className="consult-text">
                    <p className="consult-title">
                      Not sure if this is the one?
                    </p>

                    <p className="consult-subtitle">
                      Our stylist can help you choose the right piece, colour, and size for your occasion.
                    </p>
                  </div>
                </div>

                <button className="consult-btn">
                  Consult a stylish
                </button>
              </div>

              {/* PRODUCTS PAGE DETAILS */}

              <div className="pdp-accordion">

                {/* ================= PRODUCT DETAILS ================= */}
                <div className="pdp-item">
                  <div className="pdp-header" onClick={() => toggle("details")}>
                    <span>PRODUCT DETAILS</span>

                    {isOpen("details") ? (
                      <X className="icon" />
                    ) : (
                      <Plus className="icon" />
                    )}
                  </div>

                  {isOpen("details") && (
                    <div className="pdp-content">
                      <div className="pdp-grid">

                        <div>
                          <div className="pdp-row"><span className="pdp-label">Designer</span><p>{product.designer}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Fabric</span><p>{product.details?.fabric}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Craft Technique</span><p>{product.details?.technique}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Includes</span><p>{product.details?.includes}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Delivery Time</span><p>{product.details?.delivery}</p></div>
                        </div>

                        <div>
                          <div className="pdp-row"><span className="pdp-label">Category</span><p>{product.subTitle}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Colour</span><p>{product.details?.color}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Thread</span><p>{product.details?.thread}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Occasion</span><p>{product.details?.occasion}</p></div>
                          <div className="pdp-row"><span className="pdp-label">Origin</span><p>{product.details?.origin}</p></div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* ================= THE CRAFT ================= */}
                <div className="pdp-item">
                  <div className="pdp-header" onClick={() => toggle("craft")}>
                    <span>THE CRAFT</span>

                    {isOpen("craft") ? (
                      <X className="icon" />
                    ) : (
                      <Plus className="icon" />
                    )}
                  </div>

                  {isOpen("craft") && (
                    <div className="pdp-content">
                      <p className="craft-text">
                        {product.craft}
                      </p>
                    </div>
                  )}
                </div>

                {/* ================= SIZE & FIT ================= */}
                <div className="pdp-item">
                  <div className="pdp-header" onClick={() => toggle("size")}>
                    <span>SIZE & FIT</span>

                    {isOpen("size") ? (
                      <X className="icon" />
                    ) : (
                      <Plus className="icon" />
                    )}
                  </div>

                  {isOpen("size") && (
                    <div className="pdp-content">

                      <p className="size-intro">{product.sizeNote}</p>

                      <table className="size-table">
                        <thead>
                          <tr>
                            <th>Size</th>
                            <th>Bust</th>
                            <th>Waist</th>
                            <th>Hips</th>
                            <th>Height</th>
                          </tr>
                        </thead>

                        <tbody>
                          {product.sizeTable?.map((row, i) => (
                            <tr key={i} className={row.recommended ? "active-row" : ""}>
                              <td>{row.size}</td>
                              <td>{row.bust}</td>
                              <td>{row.waist}</td>
                              <td>{row.hips}</td>
                              <td>{row.height}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                  )}
                </div>

                {/* ================= CARE ================= */}
                <div className="pdp-item">
                  <div className="pdp-header" onClick={() => toggle("care")}>
                    <span>CARE INSTRUCTIONS</span>

                    {isOpen("care") ? (
                      <X className="icon" />
                    ) : (
                      <Plus className="icon" />
                    )}
                  </div>

                  {isOpen("care") && (
                    <div className="pdp-content">
                      <ul className="care-list">
                        {product.care?.map((item, i) => (
                          <li key={i}>
                            <span className="dash">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ================= SHIPPING ================= */}
                <div className="pdp-item">
                  <div className="pdp-header" onClick={() => toggle("shipping")}>
                    <span>SHIPPING & DELIVERY</span>

                    {isOpen("shipping") ? (
                      <X className="icon" />
                    ) : (
                      <Plus className="icon" />
                    )}
                  </div>

                  {isOpen("shipping") && (
                    <div className="pdp-content">

                      <table className="shipping-table">
                        <thead>
                          <tr>
                            <th>Method</th>
                            <th>Estimated time</th>
                            <th>Cost</th>
                          </tr>
                        </thead>

                        <tbody>
                          {product.shipping?.map((item, i) => (
                            <tr key={i}>
                              <td>{item.method}</td>
                              <td>{item.time}</td>
                              <td className="cost">{item.cost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                  )}
                </div>

              </div>
            </div>
          </Col>

        </Row>
      </Container>

      {/* ================= RELATED PRODUCT SECTION ================= */}
      <RelatedProduct/>

      
      
    </section>
  );
}