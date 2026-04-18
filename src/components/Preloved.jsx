
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ShoppingBag, Heart, Star, TrendingUp, Calendar, MessageCircleCheck, Shield, ArrowRight, X, Plus, Truck, Gift, ChevronRight, CircleAlert, User, CreditCard } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { products, makeProductDetail } from "./ProductList";
import '../styles/preloved.css'
import RelatedProduct from "./RelatedProduct";

const gradeDotColor = {
  pristine: "#6B7E5A",
  excellent: "#C9A96E",
  good: "#B85C38"
};

const gradeLabel = {
  pristine: "PRISTINE CONDITION",
  excellent: "EXCELLENT CONDITION",
  good: "GOOD CONDITION"
};

const gradeConfig = {
  pristine: {
    label: "PRISTINE",
    color: "#6B7E5A",
    desc: "Unworn or worn once for a short photoshoot. Tags may be attached. No visible wear whatsoever."
  },
  excellent: {
    label: "EXCELLENT",
    color: "#C9A96E",
    desc: "Worn once for a full-day event. Professionally cleaned. No visible damage, alteration, or significant bead loss. Any minor imperfections are fully disclosed and photographed above."
  },
  good: {
    label: "GOOD",
    color: "#B85C38",
    desc: "Worn 2–3 times. Any minor imperfections clearly photographed and disclosed in listing notes."
  }
};

export default function Preloved() {

  const location = useLocation();
  const { id } = useParams();

  // ===== PRODUCT FETCH =====
  let product;

  const found = products.find((p) => p.id === Number(id));
  if (found) product = makeProductDetail(found);

  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

  // ===== STATES =====
  const [wish, setWish] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const [selectedWindow, setSelectedWindow] = useState("standard");
  const [openSections, setOpenSections] = useState(["details"]);
  const [isOfferOpen, setIsOfferOpen] = useState(false);

  const isOpen = (key) => openSections.includes(key);

  // for Dot color
  const grade = product.condition?.grade || "pristine";


  // FOR DISCOUNT - 
  const price = product.preloved?.pricing?.price || 185000;
  const retail = 420000;
  const discount = Math.round(((retail - price) / retail) * 100);


  // MINIMUM AND MAXIMUM OFFER PRICE

  const minOffer = Math.round(price * 0.54 / 5000) * 5000;
  const maxOffer = price;

  const [offer, setOffer] = useState(minOffer);      // number (slider)
  const [inputValue, setInputValue] = useState(minOffer); // (typing)


  // CALCULATION ON TOP
  const savings = maxOffer - offer;
  const savingsPercent = Math.round((savings / maxOffer) * 100);

  // Golden Progress Bar
  const progress = ((offer - minOffer) / (maxOffer - minOffer)) * 100;

  // FOR INPUT AND NOTES
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Offer submitted 
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggle = (key) => {
    setOpenSections((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };


  return (
    <section className="pdp">
      <Container>

        {/* BREADCRUMB */}
        <div className="pdp-breadcrumb-wrapper">
          <div className="breadcrumb">
            <span className="crumb">Home</span>
            <span className="sep">›</span>
            <span className="crumb">Buy Preloved</span>
            <span className="sep">›</span>
            <span className="crumb">Bridal Lehengas</span>
            <span className="sep">›</span>
            <span className="crumb current">Sabyasachi</span>
            <span className="sep">›</span>
            <span className="crumb current">{product.title}</span>
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

            <div
              className="main-img"
              style={{ backgroundImage: `url(${activeImage})` }}
            >
              <img src={activeImage} alt={product.title} />

              <div className="gallery-badge preloved">
                PRELOVED
              </div>

              <button
                className="wishlist-icon-btn"
                onClick={() => setWish(!wish)}
              >
                <Heart className={wish ? "active" : ""} />
              </button>

              <div className="zoom-hint">ZOOM</div>
            </div>
          </Col>

          {/* RIGHT */}
          <Col md={6}>
            <div className="pdp-preloved-info">

              <div className="preloved-eyebrow-strip">
                <span className="preloved-eyebrow-line"></span>
                <span className="preloved-eyebrow-text">PRELOVED PIECE</span>
              </div>

              <p className="preloved-designer-name">{product.designer}</p>

              <h1 className="preloved-product-title">
                {product.title} <em>{product.subTitle}</em>
              </h1>

              <p className="preloved-product-desc">{product.description}</p>

              {/* RATING */}
              <div className="preloved-rating-row">

                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={product.rating >= s ? "#c5a46d" : "none"}
                    stroke="#c5a46d"
                  />
                ))}

                <span className="preloved-rating-text">{product.rating}.0</span>

                <span className="preloved-rating-separator" />

                <span className="preloved-reviews">{product.reviews} reviews</span>

                <span className="preloved-rating-separator" />

                <span
                  className="preloved-never-worn-soft"
                  style={{ "--dot-color": gradeDotColor[grade] }}
                >
                  {gradeLabel[grade]}
                </span>

              </div>

              {/* Price Block */}

              <div className="preloved-price-block">

                <p className="preloved-price-label">
                  LISTED RESALE PRICE
                </p>

                <h2 className="preloved-main-price">
                  ₹{price.toLocaleString()}
                </h2>

                <div className="preloved-price-row">
                  <span className="preloved-retail-price">
                    ₹{retail.toLocaleString()} retail
                  </span>

                  <span className="preloved-discount-badge">
                    {discount}% OFF RETAIL
                  </span>
                </div>

              </div>


              {/* HONEST DISCLOUSRE */}
              <div className="preloved-disclosure">

                <p className="preloved-disclosure-label">
                  HONEST DISCLOSURE
                </p>

                <p className="preloved-disclosure-text">
                  {product.disclosure}
                </p>

              </div>


              {/* SIZE BLOCK */}

              <div className="preloved-size-block">

                <p className="preloved-size-label">
                  SIZE
                </p>

                <div className="preloved-size-pills">
                  <span className="preloved-size-pill active">
                    <span className="preloved-size-pill active">
                      {product.prelovedSize}
                    </span>
                  </span>
                </div>

              </div>


              {/* CTA BUTTONS  */}

              <div className="preloved-cta-group">

                {/* BUY NOW */}
                <button className="preloved-btn primary">
                  <span className="preloved-icon"><ShoppingBag /></span>
                  BUY NOW — ₹{price.toLocaleString()}
                </button>

                {/* WISHLIST */}
                <button className="preloved-btn outline">
                  <span className="preloved-icon"><Heart /></span>
                  SAVE TO WISHLIST
                </button>

              </div>



              {/* // NAME YOUR PRICE */}

              {/* ===== PRELOVED OFFER DIVIDER ===== */}
              <div className="preloved-offer-divider">
                <span className="preloved-offer-line"></span>
                <span className="preloved-offer-text">OR MAKE AN OFFER</span>
                <span className="preloved-offer-line"></span>
              </div>

              {/* ===== PRELOVED OFFER TRIGGER ===== */}
              <div
                className={`preloved-offer-trigger ${isOfferOpen ? "open" : ""}`}
                onClick={() => setIsOfferOpen(!isOfferOpen)}
              >

                <div className="preloved-offer-left">
                  <span className="preloved-offer-icon"><Gift /></span>

                  <div>
                    <p className="preloved-offer-title">Name Your Price</p>
                    <p className="preloved-offer-sub">
                      Submit a quote — our team responds within 24 hours
                    </p>
                  </div>
                </div>

                <span className={`preloved-offer-arrow ${isOfferOpen ? "rotate" : ""}`}>
                  ›
                </span>

              </div>

              {/* Now triggered */}
              {isOfferOpen && (
                <div className="preloved-offer-panel">
                  <div className="preloved-offer-price-row">

                    {/* LEFT - LISTED PRICE */}
                    <div className="preloved-offer-col">
                      <p className="preloved-offer-label">LISTED AT</p>
                      <h3 className="preloved-offer-amount">
                        ₹{price.toLocaleString()}
                      </h3>
                    </div>

                    {/* ARROW */}
                    <div className="preloved-offer-arrow-icon">→</div>

                    {/* RIGHT - YOUR OFFER */}
                    <div className="preloved-offer-col">
                      <p className="preloved-offer-label">YOUR OFFER</p>
                      <h3 className="preloved-offer-amount highlight">
                        ₹{offer.toLocaleString()}
                      </h3>
                    </div>

                  </div>

                  <div className="preloved-offer-slider-wrap">

                    {/* LABELS */}
                    <div className="preloved-slider-labels">
                      <span>₹{minOffer.toLocaleString()}</span>
                      <span>₹{maxOffer.toLocaleString()}</span>
                    </div>

                    {/* SLIDER */}
                    <input
                      type="range"
                      min={minOffer}
                      max={maxOffer}
                      step={5000}
                      value={offer}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setOffer(val);
                        setInputValue(val.toString());
                      }}
                      className="preloved-slider"
                      style={{
                        background: `linear-gradient(
      to right,
      #C9A96E 0%,
      #C9A96E ${((offer - minOffer) / (maxOffer - minOffer)) * 100}%,
      #E8E0D4 ${((offer - minOffer) / (maxOffer - minOffer)) * 100}%,
      #E8E0D4 100%
    )`
                      }}
                    />

                    {/* HINT */}
                    <p className="preloved-slider-hint">
                      Slide to set your offer · Min ₹{minOffer.toLocaleString()}
                    </p>
                  </div>

                  {/* INPUT ROW */}
                  <div className="preloved-offer-input-row">

                    <div className="preloved-offer-input-wrap">
                      <span className="preloved-rupee">₹</span>

                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                          const val = e.target.value;

                          // allow typing freely
                          setInputValue(val);

                          const num = Number(val);

                          if (!isNaN(num)) {
                            if (num >= minOffer && num <= maxOffer) {
                              setOffer(num);
                            }
                          }
                        }}
                        className="preloved-offer-input"
                      />
                    </div>

                    {/* SAVINGS */}
                    {maxOffer - offer > 0 && (
                      <div className="preloved-offer-savings-pill">
                        Save ₹{(maxOffer - offer).toLocaleString()}
                      </div>
                    )}

                  </div>

                  {!isSubmitted ? (
                    <>

                      {/* ===== NOTE ===== */}
                      <textarea
                        className="preloved-note"
                        placeholder='Add a note (optional) — e.g. "Available for immediate pickup..."'
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />

                      {/* ===== CONTACT ===== */}
                      <div className="preloved-contact-grid">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />

                        <input
                          type="text"
                          placeholder="WhatsApp number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      {/* ===== TERMS ===== */}
                      <div className="preloved-terms-row">
                        <CircleAlert className="preloved-terms-icon" />

                        <p className="preloved-terms-text">
                          Submitting an offer does not reserve the piece. The listing remains active until a purchase is completed.
                        </p>
                      </div>
                      <button
                        className="preloved-submit-btn"
                        onClick={() => {
                          if (!name || !phone) {
                            alert("Please fill name and phone");
                            return;
                          }

                          if (offer < minOffer) {
                            alert("Offer too low");
                            return;
                          }

                          setIsSubmitted(true);
                        }}
                      >
                        SUBMIT OFFER →
                      </button>
                    </>
                  ) : (
                    <div className="preloved-success">
                      <div className="preloved-success-icon">✓</div>

                      <h3>Offer submitted</h3>

                      <p>
                        Our team will review your quote of ₹{offer.toLocaleString()} and get back to you within 24 hours.
                      </p>

                      <button
                        className="preloved-reset-btn"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Submit another offer
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* WHATSAPP ENQUIREY */}

              <div className="preloved-whatsapp-btn">
                <MessageCircleCheck className="whatsapp-icon" />
                ENQUIRE ON WHATSAPP
              </div>


              {/* CONSULT A STYSLISH */}

              <div className="preloved-consult-box">

                <div className="preloved-consult-left">

                  <div className="preloved-consult-icon">
                    <User />
                  </div>

                  <div>
                    <p className="preloved-consult-title">
                      Not sure if this is the one?
                    </p>

                    <p className="preloved-consult-subtitle">
                      Our stylist can help you find the right piece for your occasion, size, and budget.
                    </p>
                  </div>

                </div>

                <button className="preloved-consult-btn">
                  Consult a stylist
                </button>

              </div>


              {/* TRUST BADAGE */}

              <div className="preloved-trust-badges">

                <div className="preloved-trust-item">
                  <Shield className="preloved-trust-icon" />
                  <span>AUTHENTICATED BY HOK</span>
                </div>

                <div className="preloved-trust-item">
                  <Shield className="preloved-trust-icon" />
                  <span>SECURE PAYMENT VIA RAZORPAY</span>
                </div>

                <div className="preloved-trust-item">
                  <CreditCard className="preloved-trust-icon" />
                  <span>SECURE CHECKOUT</span>
                </div>

              </div>


              {/*  PRELOVED PAGE ACCORDANCE*/}



              {/* ================= PRODUCT DETAILS ================= */}
              <div className="preloved-accordion">

                <div className="preloved-accordion-item">

                  <div
                    className="preloved-accordion-header"
                    onClick={() => toggle("details")}
                  >
                    <span>PRODUCT DETAILS</span>

                    <Plus
                      className={`preloved-accordion-icon ${isOpen("details") ? "open" : ""
                        }`}
                    />
                  </div>

                  {isOpen("details") && (
                    <div className="preloved-accordion-content">

                      <div className="preloved-details-grid">

                        <div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Designer</span>
                            <p>{product.designer}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Fabric</span>
                            <p>{product.details?.fabric}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Embroidery</span>
                            <p>{product.details?.technique}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Includes</span>
                            <p>{product.details?.includes}</p>
                          </div>
                        </div>

                        <div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Category</span>
                            <p>{product.subTitle}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Colour</span>
                            <p>{product.details?.color}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Occasion</span>
                            <p>{product.details?.occasion}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Origin</span>
                            <p>{product.details?.origin}</p>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* ================= THE CRAFT ================= */}
              <div className="preloved-accordion-item">

                <div
                  className="preloved-accordion-header"
                  onClick={() => toggle("story")}
                >
                  <span>THE STORY OF THIS PIECE</span>

                  <Plus
                    className={`preloved-accordion-icon ${isOpen("story") ? "open" : ""
                      }`}
                  />
                </div>

                {isOpen("story") && (
                  <div className="preloved-accordion-content">

                    <p className="preloved-story-text">
                      {product.story ||
                        "Worn once for a wedding celebration, this piece carries delicate handwork and timeless elegance. Carefully preserved and professionally cleaned, it remains in excellent condition with no visible damage."}
                    </p>

                    {product.stylingNote && (
                      <p className="preloved-story-note">
                        {product.stylingNote}
                      </p>
                    )}

                  </div>
                )}

              </div>

              {/* ================= SIZE & FIT ================= */}
              <div className="preloved-accordion-item">

                <div
                  className="preloved-accordion-header"
                  onClick={() => toggle("size")}
                >
                  <span>SIZE & FIT</span>

                  <Plus
                    className={`preloved-accordion-icon ${isOpen("size") ? "open" : ""
                      }`}
                  />
                </div>

                {isOpen("size") && (
                  <div className="preloved-accordion-content">

                    {/* INTRO */}
                    <p className="preloved-size-intro">
                      {product.sizeNote || "Fits true to size. Blouse tailored for a 32\" bust with adjustable waist."}
                    </p>

                    {/* TABLE */}
                    <table className="preloved-size-table">
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
                          <tr
                            key={i}
                            className={row.recommended ? "active-row" : ""}
                          >
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

              {/* ====================CONDITION GRADE========================== */}

              <div className="preloved-accordion-item">

                <div
                  className="preloved-accordion-header"
                  onClick={() => toggle("condition")}
                >
                  <span>CONDITION GRADE</span>

                  <Plus
                    className={`preloved-accordion-icon ${isOpen("condition") ? "open" : ""
                      }`}
                  />
                </div>

                {isOpen("condition") && (
                  <div className="preloved-accordion-content">

                    {Object.keys(gradeConfig).map((key) => {
                      const item = gradeConfig[key];
                      const isActive = product.condition?.grade === key;

                      return (
                        <div
                          key={key}
                          className={`preloved-grade-item ${isActive ? "active" : ""
                            }`}
                        >
                          <div className="preloved-grade-header">

                            <span
                              className="preloved-grade-dot"
                              style={{ background: item.color }}
                            />

                            <span className="preloved-grade-name">
                              {item.label}
                              {isActive && " ← THIS PIECE"}
                            </span>

                          </div>

                          <p className="preloved-grade-desc">
                            {item.desc}
                          </p>
                        </div>
                      );
                    })}

                  </div>
                )}

              </div>


              {/* ================= CARE ================= */}
              <div className="preloved-accordion-item">

                <div
                  className="preloved-accordion-header"
                  onClick={() => toggle("care")}
                >
                  <span>CARE INSTRUCTIONS</span>

                  <Plus
                    className={`preloved-accordion-icon ${isOpen("care") ? "open" : ""
                      }`}
                  />
                </div>

                {isOpen("care") && (
                  <div className="preloved-accordion-content">

                    {product.care?.map((item, i) => (
                      <p key={i} className="preloved-care-item">
                        <span className="preloved-care-dash">—</span>
                        {item}
                      </p>
                    ))}

                  </div>
                )}

              </div>

              {/* ================= SHIPPING ================= */}
              <div className="preloved-accordion-item">

                <div
                  className="preloved-accordion-header"
                  onClick={() => toggle("shipping")}
                >
                  <span>SHIPPING & DELIVERY</span>

                  <Plus
                    className={`preloved-accordion-icon ${isOpen("shipping") ? "open" : ""
                      }`}
                  />
                </div>

                {isOpen("shipping") && (
                  <div className="preloved-accordion-content">

                    {/* DELIVERY METHODS */}
                    {product.shipping?.map((item, i) => (
                      <p key={i} className="preloved-shipping-item">
                        <span className="preloved-shipping-dash">—</span>
                        {item.method}: {item.time}, {item.cost}
                      </p>
                    ))}

                    {/* PACKAGING */}
                    {product.packaging?.map((text, i) => (
                      <p key={i} className="preloved-shipping-packaging">
                        {text}
                      </p>
                    ))}

                  </div>
                )}

              </div>



            </div>
          </Col>
        </Row>
      </Container>
      <RelatedProduct />
    </section>

  )
}
