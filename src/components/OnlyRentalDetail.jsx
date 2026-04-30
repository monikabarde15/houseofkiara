// src\components\OnlyRentalDetail.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, TrendingUp, Calendar, MessageCircleCheck, Shield, ArrowRight, X, Plus, Truck } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import "../styles/onlyrentaldetail.css";
import { products, makeProductDetail } from "./ProductList";
import RentalCalendar from "./RentalCalendar";
import RelatedProduct from "./RelatedProduct";
import GalleryColumn from "./GalleryColumn";
const tempSizes = [
  { label: "XS", available: true },
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: false },
  { label: "XL", available: false }
];

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


export default function RentalProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const incomingBooking = location.state?.booking || null; // if coming from cart page

  // ===== PRODUCT FETCH =====
  let product;

  const found = products.find((p) => p.id === Number(id));
  if (found) product = makeProductDetail(found);

  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

  // ===== STATES =====
  const [wish, setWish] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const [selectedWindow, setSelectedWindow] = useState("standard");

  const parseLocalDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day);
  };

  // Both logic of reset everytime and if comming from cart to pdp page
  const [selectedStart, setSelectedStart] = useState(
    incomingBooking?.deliveryDate
      ? parseLocalDate(incomingBooking.deliveryDate)
      : null
  );

  // Both logic of reset everytime and if comming from cart to pdp page
  const [selectedEnd, setSelectedEnd] = useState(
    incomingBooking?.returnDate
      ? parseLocalDate(incomingBooking.returnDate)
      : null
  );

  const [selectedSize, setSelectedSize] = useState(null);
  const [openSections, setOpenSections] = useState(["details"]);

  const isOpen = (key) => openSections.includes(key);

  const toggle = (key) => {
    setOpenSections((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };


  const isCTAEnabled = selectedStart && selectedEnd;
  // ===== DATA =====
  const rentData = product.modes?.rent || null;
  const buyData = product.modes?.buy || null;
  const sizes = product?.modes?.rent?.sizes || [];

  // ===== SELECTED WINDOW =====
  const selectedWindowData =
    rentData?.pricing?.windows?.find((w) => w.id === selectedWindow) ||
    rentData?.pricing?.windows?.[0];

  // for Dot color
  const grade = product.condition?.grade || "pristine";

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const eventDate = new Date(selectedStart);
  eventDate.setDate(eventDate.getDate() + 2); // delivery → event

  const handleConfirmBooking = () => {
    if (!selectedStart || !selectedEnd) return;

    const newItem = {
      id: Date.now(),
      type: "rental",

      product,

      booking: {
        size: selectedSize || "M",

        deliveryDate: formatDate(selectedStart),

        eventDate: formatDate(eventDate),

        returnDate: formatDate(selectedEnd),

        rentalWindowDays:
          Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24)) + 1
      }
    };

    navigate("/cart", {
      state: {
        newItem
      }
    });
  };

  return (
    <>
      <section className="pdp">
        <Container>

          {/* BREADCRUMB */}
          <div className="rental-pdp-breadcrumb-wrapper">
            <div className="rental-breadcrumb">
              <span className="rental-crumb">Home</span>
              <span className="rental-sep">›</span>
              <span className="rental-crumb">Rent</span>
              <span className="rental-sep">›</span>
              <span className="rental-crumb rental-current">
                {product.title}
              </span>
            </div>
          </div>

          <Row>

            {/* LEFT */}
            <Col md={6} className="rental-pdp-left-wrap">

              <GalleryColumn
                images={product.images}
                variant="rent"
                video={product.video}
              />

            </Col>

            {/* RIGHT */}
            <Col md={6}>
              <div className="rental-pdp-info">

                <div className="rental-eyebrow-strip">
                  <span className="rental-eyebrow-line"></span>
                  <span className="rental-eyebrow-text">Rental Piece</span>
                </div>

                <p className="rental-designer-name">{product.designer}</p>

                <h1 className="rental-product-title">
                  {product.title} <em>{product.subTitle}</em>
                </h1>

                <p className="rental-product-desc">{product.description}</p>

                {/* RATING */}
                <div className="rental-rating-row">

                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      className="rental-star-icon"
                      key={s}
                      size={16}
                      fill={product.rating >= s ? "#c5a46d" : "none"}
                      stroke="#c5a46d"
                    />
                  ))}

                  <span className="rental-rating-text">{product.rating}.0</span>

                  <span className="rental-rating-separator" />

                  <span className="rental-reviews">{product.reviews} reviews</span>

                  <span className="rating-separator" />

                  <span
                    className="rental-never-worn-soft"
                    style={{ "--dot-color": gradeDotColor[grade] }}
                  >
                    {gradeLabel[grade]}
                  </span>

                  <span className="rating-separator" />

                  <span className="rental-rent-count">
                    Rented {product.rentInfo.rentedCount}×
                  </span>

                </div>

                {/* Price Block */}
                <div className="rental-price-block">

                  <p className="rental-price-label">Rental Price</p>

                  <h2 className="rental-main-price">
                    ₹{selectedWindowData?.price}
                    <span className="onlyduration">
                      {" "}
                      / {selectedWindowData?.days} days
                    </span>
                  </h2>

                  <p className="rental-price-subline">
                    ₹{rentData.pricing.pricePerDay} per day • Minimum{" "}
                    {rentData.pricing.minDays} days
                  </p>

                  {/* WINDOWS */}
                  <div className="rental-rental-window">
                    {rentData.pricing.windows.map((w) => (
                      <div
                        key={w.id}
                        className={`rental-rental-block ${selectedWindow === w.id ? "selected" : ""
                          }`}
                        onClick={() => setSelectedWindow(w.id)}
                      >
                        <p className="rental-option-label">{w.label}</p>
                        <h3 className="rental-option-amount">₹{w.price}</h3>
                        <p className="rental-option-days">
                          {w.days} days — {
                            w.tag || (w.id === "standard"
                              ? "most popular"
                              : "destination weddings")
                          }
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* DEPOSIT */}
                  <div className="rental-deposit-block">
                    <Shield className="rental-deposit-icon" />
                    <p className="rental-deposit-text">
                      <b className="rental-deposit-bold">
                        ₹{rentData.deposit.amount} refundable deposit
                      </b>{" "}
                      required • Returned within 3 -{" "}
                      {rentData.deposit.returnDays} business days after piece is recieved and inspected
                    </p>
                  </div>
                </div>
                {/* SIZE BLOCK */}
                <div className="rental-size-block">

                  {/* HEADER */}
                  <div className="rental-size-header">
                    <span className="rental-size-label">Select Size</span>
                    <span className="rental-size-guide">Size & Measurement Guide</span>
                  </div>

                  {/* SIZE PILLS */}
                  <div className="rental-size-options">
                    {tempSizes.map((size, i) => (
                      <button
                        key={i}
                        disabled={!size.available}
                        onClick={() => size.available && setSelectedSize(size.label)}
                        className={`rental-size-pill
        ${!size.available ? "unavailable" : ""}
        ${selectedSize === size.label ? "active" : ""}
      `}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>

                </div>


                {/* // RENTAL CALENDAR */}
                <RentalCalendar
                  rentData={rentData}
                  selectedStart={selectedStart}
                  setSelectedStart={setSelectedStart}
                  selectedEnd={selectedEnd}
                  setSelectedEnd={setSelectedEnd}
                />

                {/* CTA BUTTONS  */}

                <div className="rental-rental-cta">

                  {/* PRIMARY CTA */}
                  <button
                    className={`rental-cta-primary ${selectedStart && selectedEnd ? "active" : "disabled"}`}
                    disabled={!(selectedStart && selectedEnd)}
                    onClick={handleConfirmBooking}
                  >
                    <span className="rental-cta-icon"><Calendar /></span>
                    CONFIRM BOOKING
                  </button>

                  {/* WISHLIST */}
                  <button className="rental-cta-wishlist">
                    <span className="rental-cta-icon"><Heart /></span>
                    SAVE TO WISHLIST
                  </button>

                  {/* WHATSAPP */}
                  <button className="rental-cta-whatsapp">
                    <span className="rental-cta-icon">
                      <MessageCircleCheck />
                    </span>
                    ASK ON WHATSAPP
                  </button>

                </div>

                {/* TRUST BADAGE */}

                <div className="rental-trust-badages">
                  <div className="rental-trust-item">
                    <ArrowRight />
                    <span>DRY-CLEANED & DELIVERED </span>
                  </div>
                  <div className="rental-trust-item">
                    <Shield />
                    <span>SECURE PAYMENT VIA RAZORPAY</span>
                  </div>
                  <div className="rental-trust-item">
                    <TrendingUp />
                    <span>DEPOSIT REFUND IN 3-5 DAYS</span>
                  </div>
                </div>


                {/*  RENTAL PAGE ACCORDANCE*/}

                <div className="pdp-rental-accordion">

                  {/* ================= PRODUCT DETAILS ================= */}
                  <div className="pdp-rental-item">
                    <div className="pdp-rental-header" onClick={() => toggle("details")}>
                      <span>PRODUCT DETAILS</span>

                      <Plus className={`onlyrental-icon ${isOpen("details") ? "open" : ""}`} />
                    </div>

                    {isOpen("details") && (
                      <div className="rental-pdp-content">
                        <div className="rental-pdp-grid">

                          <div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Designer</span><p>{product.designer}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Fabric</span><p>{product.details?.fabric}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Craft Technique</span><p>{product.details?.technique}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Includes</span><p>{product.details?.includes}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Delivery Time</span><p>{product.details?.delivery}</p></div>
                          </div>

                          <div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Category</span><p>{product.subTitle}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Colour</span><p>{product.details?.color}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Thread</span><p>{product.details?.thread}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Occasion</span><p>{product.details?.occasion}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Origin</span><p>{product.details?.origin}</p></div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================= THE CRAFT ================= */}
                  <div className="pdp-rental-item">
                    <div className="pdp-rental-header" onClick={() => toggle("craft")}>
                      <span>THE CRAFT</span>

                      <Plus className={`onlyrental-icon ${isOpen("craft") ? "open" : ""}`} />
                    </div>

                    {isOpen("craft") && (
                      <div className="rental-pdp-content">
                        <p className="rental-craft-text">
                          {product.craft}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ================= SIZE & FIT ================= */}
                  <div className="pdp-rental-item">
                    <div className="pdp-rental-header" onClick={() => toggle("size")}>
                      <span>SIZE & FIT</span>

                      <Plus className={`onlyrental-icon ${isOpen("size") ? "open" : ""}`} />
                    </div>

                    {isOpen("size") && (
                      <div className="rental-pdp-content">

                        <p className="rental-size-intro">{product.sizeNote}</p>

                        <table className="rental-size-table">
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
                              <tr key={i} className={row.recommended ? "rental-active-row" : ""}>
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
                  <div className="pdp-rental-item">
                    <div className="pdp-rental-header" onClick={() => toggle("care")}>
                      <span>CARE INSTRUCTIONS</span>

                      <Plus className={`onlyrental-icon ${isOpen("care") ? "open" : ""}`} />
                    </div>

                    {isOpen("care") && (
                      <div className="rental-pdp-content">
                        <ul className="rental-care-list">
                          {product.care?.map((item, i) => (
                            <li key={i}>
                              <span className="rental-dash">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* ================= SHIPPING ================= */}
                  <div className="pdp-rental-item">
                    <div className="pdp-rental-header" onClick={() => toggle("shipping")}>
                      <span>SHIPPING & DELIVERY</span>

                      <Plus className={`onlyrental-icon ${isOpen("shipping") ? "open" : ""}`} />
                    </div>

                    {isOpen("shipping") && (
                      <div className="rental-pdp-content">

                        <table className="rental-shipping-table">
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
                                <td className="rental-cost">{item.cost}</td>
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
      </section>
      <RelatedProduct />
    </>
  );
}