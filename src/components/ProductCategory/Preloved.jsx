import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ShoppingBag, Heart, Star,Check, TrendingUp, Calendar, MessageCircleCheck, Shield, ArrowRight, X, Plus, Truck, Gift, ChevronRight, CircleAlert, User, CreditCard } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../../styles/productcategory/preloved.css";
import RelatedProduct from "../RelatedProduct";
import GalleryColumn from "../GalleryColumn";
import useWishlistStore from "../../store/wishlistStore";
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
  const navigate = useNavigate();

  // ===== STATES =====
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = wishlistItems.includes(id);

  const [selectedWindow, setSelectedWindow] = useState("standard");
  const [openSections, setOpenSections] = useState(["details"]);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    fetch(`${backendUrl}/api/web-products/${id}`)
      .then(res => {
        if(!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        if (data && data.success && data.data) {
          setProduct(data.data);
          setActiveImage(data.data.images?.[0] || data.data.colors?.[0]?.images?.[0]);
          setLoading(false);
        } else {
          throw new Error("No data returned");
        }
      })
      .catch(err => {
        console.error("API error:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const price = product?.preloved?.pricing?.price || 185000;
  const retail = 420000;
  const discount = Math.round(((retail - price) / retail) * 100);
  const minOffer = Math.round(price * 0.54 / 5000) * 5000;
  const maxOffer = price;

  const [offer, setOffer] = useState(0);      // number (slider)
  const [inputValue, setInputValue] = useState(0); // (typing)

  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize offer states when product loads
  useEffect(() => {
    if (product) {
      setOffer(minOffer);
      setInputValue(minOffer);
    }
  }, [product]);

  if (loading) return <h2 style={{ padding: 40 }}>Loading product...</h2>;
  if (error || !product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

  const isOpen = (key) => openSections.includes(key);

  const grade = product.condition?.grade || "pristine";

  const savings = maxOffer - offer;
  const savingsPercent = Math.round((savings / maxOffer) * 100);
  const progress = ((offer - minOffer) / (maxOffer - minOffer)) * 100;

  const toggle = (key) => {
    setOpenSections((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };


  //  function for adding to cart and redirecting to checkout
  const handleBuyNow = () => {
    // Create cart item
    const cartItem = {
      id: product.id,
      title: product.title,
      price: price,
      size: selectedSize || product?.sizeTable?.[0]?.label || product.prelovedSize || "M",
      color: selectedColor || product?.colors?.[0]?.code || "Standard",
      image: product.images?.[0],
      designer: product.designer,
      type: "preloved",
      condition: product.condition?.grade,
      quantity: 1
    };

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check for duplicate
    const existingIndex = existingCart.findIndex(item => item.id === cartItem.id);

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Redirect to checkout flow (per spec)
    navigate("/checkout");
  };

  // function to add to the Wishlist and redirect

  const handleAddToWishlist = () => {
    const wishlistItem = {
      id: product.id,
      title: product.title,
      price: price,
      size: selectedSize || product?.sizeTable?.[0]?.label || product.prelovedSize || "M",
      color: selectedColor || product?.colors?.[0]?.code || "Standard",
      image: product.images?.[0],
      designer: product.designer,
      type: "preloved",
      condition: product.condition?.grade
    };

    const existingWishlist = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );

    const alreadyExists = existingWishlist.some(
      (item) => item.id === wishlistItem.id
    );

    if (!alreadyExists) {
      existingWishlist.push(wishlistItem);
      localStorage.setItem(
        "wishlist",
        JSON.stringify(existingWishlist)
      );
    }

    setWish(true);

    setTimeout(() => {
      navigate("/wishlist");
    }, 300);
  };

  // function to connect to the Whatsapp and redirect

  const handleWhatsApp = () => {
    const phoneNumber = "919999999999"; // Replace with actual number

    const message = `
Hi,

I am interested in this preloved piece.

Product: ${product.title}
Designer: ${product.designer}
Price: ₹${price.toLocaleString()}
Condition: ${product.condition?.grade || "N/A"}
Size: ${product.prelovedSize}

Product ID: ${product.id}
`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
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
          <Col md={6} className="preloved-pdp-left-wrap">

            <GalleryColumn
              images={product.images}
              video={product.video}
              variant="preloved"
            />
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


              {/* COLORS BLOCK */}
              {(() => {
                const displayColors = product?.colors?.length > 0 ? product.colors : [{ code: '#000000', name: 'Standard' }];
                return (
                  <div className="preloved-size-block" style={{ marginBottom: "20px" }}>
                    <p className="preloved-size-label">
                      SELECT COLOUR
                    </p>
                    <div className="rab-color-list" style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                      {displayColors.map((c, i) => (
                        <div
                          key={i}
                          className={`rab-swatches-details ${selectedColor === c.code ? "active" : ""}`}
                          onClick={() => {
                            setSelectedColor(c.code);
                            if (c.images && c.images.length > 0) {
                              setActiveImage(c.images[0]);
                            }
                          }}
                        >
                          <span
                            className="rab-swatch-circle-details"
                            style={{ backgroundColor: c.code }}
                          ></span>
                          <span className="rab-swatch-name">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* SIZE BLOCK */}

              <div className="preloved-size-block">

                <p className="preloved-size-label">
                  SIZE
                </p>

                <div className="preloved-size-pills">
                  {(() => {
                    const displaySizes = (product?.sizeTable?.length > 0 ? product.sizeTable : (product?.sizes?.map(s => ({label: s, available: true})) || [])).filter(s => s && s.label && String(s.label).trim() !== "");
                    return displaySizes.length > 0 ? (
                      displaySizes.map((s, i) => (
                        <span 
                          key={i} 
                          className={`preloved-size-pill ${selectedSize === s.label ? "active" : ""} ${!s.available ? "unavailable" : ""}`}
                          onClick={() => s.available && setSelectedSize(s.label)}
                          style={{ cursor: s.available ? 'pointer' : 'not-allowed' }}
                        >
                          {s.label}
                        </span>
                      ))
                    ) : (
                      <span className="preloved-size-pill active">
                        {product?.prelovedSize || product?.sizes?.[0] || "Standard"}
                      </span>
                    );
                  })()}
                </div>

              </div>


              {/* CTA BUTTONS  */}

              <div className="preloved-cta-group">

                {/* BUY NOW */}
                <button
                  className="preloved-btn primary"
                  onClick={handleBuyNow}
                >
                  <span className="preloved-icon"><ShoppingBag /></span>
                  BUY NOW — ₹{price.toLocaleString()}
                </button>

                {/* WISHLIST */}
                <button
                  className="preloved-btn outline"
                  onClick={handleAddToWishlist}
                >
                  <span className="preloved-icon"><Heart /></span>
                  {isWishlisted ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
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
                      <div className="preloved-success-icon">
                        <Check size={22} strokeWidth={2.2} />
                      </div>

                      <h3>Offer submitted</h3>

                      <p>
                        Our team will review your quote of ₹
                        {offer.toLocaleString()} and get back to you within 24
                        hours via WhatsApp or email.
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

              <div className="preloved-whatsapp-btn"
                onClick={handleWhatsApp}
              >
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
                            <p>{product.designer || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Fabric</span>
                            <p>{product.craft || product.details?.fabric || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Embroidery</span>
                            <p>{product.details?.technique || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Includes</span>
                            <p>{product.details?.includes || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Delivery Time</span>
                            <p>{product.details?.delivery || ' '}</p>
                          </div>
                        </div>
                        <div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Category</span>
                            <p>{product.subTitle || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Colour</span>
                            <p>{product.details?.color || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Occasion</span>
                            <p>{product.details?.occasion || ' '}</p>
                          </div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Origin</span>
                            <p>{product.details?.origin || ' '}</p>
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
                      {product.story || ' '}
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

                    <p className="preloved-size-intro">
                      {product.sizeNote || ' '}
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
      <RelatedProduct product={product} currentProductId={id} category={product?.category} />
    </section>

  )
}
