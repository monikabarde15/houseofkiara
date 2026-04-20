import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Heart, Star, TrendingUp, Gift, User, Calendar, CreditCard, MessageCircleCheck, Shield, CircleAlert, ArrowRight, ShoppingBag, X, Plus, Truck } from "lucide-react";
import { products, makeProductDetail } from "./ProductList";
import GalleryColumn from "./GalleryColumn";
import '../styles/rental-and-preloved.css'
import RentalCalendar from "./RentalCalendar";
import RelatedProduct from "./RelatedProduct";

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


export default function RentalAndPreloved() {
    const { id } = useParams();

    const found = products.find((p) => p.id === Number(id));
    const product = found ? makeProductDetail(found) : null;

    const [mode, setMode] = useState(
        product?.modes?.rent?.enabled ? "rent" : "buy"
    );

    const [wish, setWish] = useState(false);
    const [selectedWindow, setSelectedWindow] = useState("standard");
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [openSections, setOpenSections] = useState(["details"]);

    const [isOfferOpen, setIsOfferOpen] = useState(false);

    if (!product) return <h2>Product not found</h2>;

    // ===== DATA =====
    const rentData = product.modes?.rent || null;
    const buyData = product.modes?.buy || null;
    const sizes = product?.modes?.rent?.sizes || [];

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

    // ===== SELECTED WINDOW =====
    const selectedWindowData =
        rentData?.pricing?.windows?.find((w) => w.id === selectedWindow) ||
        rentData?.pricing?.windows?.[0];


    // for dot color
    const grade = product.condition?.grade || "pristine";


    // ===============PRELOVED======================//

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

    return (
        <section className={`rap-root ${mode === "buy" ? "buy-mode" : "rent-mode"}`}>
            <Container>

                {/* BREADCRUMB */}
                <div className="rap-pdp-breadcrumb-wrapper">
                    <div className="rap-breadcrumb">
                        <span className="rap-crumb">Home</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb">Buy Preloved</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb">Bridal Lehengas</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb current">Sabyasachi</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb current">{product.title}</span>
                    </div>
                </div>

                <Row>

                    {/* ================= LEFT (COPY SAME) ================= */}
                    <Col md={6} className="rap-left">

                        <GalleryColumn
                            images={product.images}
                            video={product.video}
                            mode={mode}          // 🔥 for badge (rent/buy)
                            wish={wish}
                            setWish={setWish}
                        />

                    </Col>

                    {/* ================= RIGHT ================= */}
                    <Col md={6}>
                        <div className="rap-right">

                            {/* ================= TOGGLE ================= */}
                            <div className="rap-toggle">

                                {product.modes?.rent?.enabled && (
                                    <button
                                        className={`rap-toggle-btn ${mode === "rent" ? "active" : ""}`}
                                        onClick={() => setMode("rent")}
                                    >
                                        RENT THIS PIECE
                                    </button>
                                )}

                                {product.modes?.buy?.enabled && (
                                    <button
                                        className={`rap-toggle-btn ${mode === "buy" ? "active" : ""}`}
                                        onClick={() => setMode("buy")}
                                    >
                                        BUY NEW
                                    </button>
                                )}

                            </div>

                            {/* ================= COMMON PRODUCT INFO ================= */}

                            <p className="rap-rental-designer-name">{product.designer}</p>

                            <h1 className="rap-rental-product-title">
                                {product.title} <em>{product.subTitle}</em>
                            </h1>

                            <p className="rap-rental-product-desc">{product.description}</p>

                            {/* RATING */}
                            <div className="rap-rental-rating-row">

                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        className="rap-rental-star-icon"
                                        key={s}
                                        size={16}
                                        fill={product.rating >= s ? "#c5a46d" : "none"}
                                        stroke="#c5a46d"
                                    />
                                ))}

                                <span className="rap-rental-rating-text">{product.rating}.0</span>

                                <span className="rap-rental-rating-separator" />

                                <span className="rap-rental-reviews">{product.reviews} reviews</span>

                                <span className="rap-rental-rating-separator" />

                                <span
                                    className="rap-rental-never-worn-soft"
                                    style={{ "--dot-color": "#6B7E5A" }}
                                >
                                    {mode === "rent" ? "AVAILABLE FOR RENT" : "IN STOCK"}
                                </span>

                                {/* <span className="rap-rental-rating-separator" /> */}



                            </div>

                            {/* ================= RENT MODE ================= */}
                            {mode === "rent" && (
                                <div className="rap-rent">



                                    {/* 1. PRICE BLOCK */}
                                    <div className="rap-rental-price-block">

                                        <p className="rap-rental-price-label">Rental Price</p>

                                        <h2 className="rap-rental-main-price">
                                            ₹{selectedWindowData?.price}
                                            <span className="rap-onlyduration">
                                                {" "}
                                                / {selectedWindowData?.days} days
                                            </span>
                                        </h2>

                                        <p className="rap-rental-price-subline">
                                            ₹{rentData.pricing.pricePerDay} per day • Minimum{" "}
                                            {rentData.pricing.minDays} days
                                        </p>

                                        {/* 2. RENTAL WINDOWS */}
                                        {/* WINDOWS */}
                                        <div className="rap-rental-rental-window">
                                            {rentData.pricing.windows.map((w) => (
                                                <div
                                                    key={w.id}
                                                    className={`rap-rental-rental-block ${selectedWindow === w.id ? "selected" : ""
                                                        }`}
                                                    onClick={() => setSelectedWindow(w.id)}
                                                >
                                                    <p className="rap-rental-option-label">{w.label}</p>
                                                    <h3 className="rap-rental-option-amount">₹{w.price}</h3>
                                                    <p className="rap-rental-option-days">
                                                        {w.days} days — {
                                                            w.tag || (w.id === "standard"
                                                                ? "most popular"
                                                                : "destination weddings")
                                                        }
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 3. DEPOSIT */}
                                        {/* DEPOSIT */}
                                        <div className="rap-rental-deposit-block">
                                            <Shield className="rap-rental-deposit-icon" />
                                            <p className="rap-rental-deposit-text">
                                                <b className="rap-rental-deposit-bold">
                                                    ₹{rentData.deposit.amount} refundable deposit
                                                </b>{" "}
                                                required • Returned within 3 -{" "}
                                                {rentData.deposit.returnDays} business days after piece is recieved and inspected
                                            </p>
                                        </div>
                                    </div>



                                    {/* 4. SIZE */}
                                    <div className="rap-rental-size-block">

                                        {/* HEADER */}
                                        <div className="rap-rental-size-header">
                                            <span className="rap-rental-size-label">Select Size</span>
                                            <span className="rap-rental-size-guide">Size & Measurement Guide</span>
                                        </div>

                                        {/* SIZE PILLS */}
                                        <div className="rap-rental-size-options">
                                            {tempSizes.map((size, i) => (
                                                <button
                                                    key={i}
                                                    disabled={!size.available}
                                                    onClick={() => size.available && setSelectedSize(size.label)}
                                                    className={`rap-rental-size-pill
        ${!size.available ? "unavailable" : ""}
        ${selectedSize === size.label ? "active" : ""}
      `}
                                                >
                                                    {size.label}
                                                </button>
                                            ))}
                                        </div>

                                    </div>

                                    {/* 5. CALENDAR */}
                                    <RentalCalendar
                                        rentData={rentData}
                                        selectedStart={selectedStart}
                                        setSelectedStart={setSelectedStart}
                                        selectedEnd={selectedEnd}
                                        setSelectedEnd={setSelectedEnd}
                                    />

                                    {/* 6. CTA */}
                                    <div className="rap-rental-rental-cta">

                                        {/* PRIMARY CTA */}
                                        <button
                                            className={`rap-rental-cta-primary ${selectedStart && selectedEnd ? "active" : "disabled"}`}
                                            disabled={!(selectedStart && selectedEnd)}
                                        >
                                            <span className="rap-rental-cta-icon"><Calendar /></span>
                                            CONFIRM BOOKING
                                        </button>

                                        {/* WISHLIST */}
                                        <button className="rap-rental-cta-wishlist">
                                            <span className="rap-rental-cta-icon"><Heart /></span>
                                            SAVE TO WISHLIST
                                        </button>

                                        {/* WHATSAPP */}
                                        <button className="rap-rental-cta-whatsapp">
                                            <span className="rap-rental-cta-icon">
                                                <MessageCircleCheck />
                                            </span>
                                            ASK ON WHATSAPP
                                        </button>

                                    </div>

                                    {/* 7. TRUST BADGES */}
                                    <div className="rap-rental-trust-badages">
                                        <div className="rap-rental-trust-item">
                                            <ArrowRight />
                                            <span>DRY-CLEANED & DELIVERED </span>
                                        </div>
                                        <div className="rap-rental-trust-item">
                                            <Shield />
                                            <span>SECURE PAYMENT VIA RAZORPAY</span>
                                        </div>
                                        <div className="rap-rental-trust-item">
                                            <TrendingUp />
                                            <span>DEPOSIT REFUND IN 3-5 DAYS</span>
                                        </div>
                                    </div>

                                    {/* 8. ACCORDION */}
                                    {/*  RENTAL PAGE ACCORDANCE*/}

                                    <div className="rap-pdp-rental-accordion">

                                        {/* ================= PRODUCT DETAILS ================= */}
                                        <div className="rap-pdp-rental-item">
                                            <div className="rap-pdp-rental-header" onClick={() => toggle("details")}>
                                                <span>PRODUCT DETAILS</span>

                                                <Plus className={`rap-onlyrental-icon ${isOpen("details") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("details") && (
                                                <div className="rap-rental-pdp-content">
                                                    <div className="rap-rental-pdp-grid">

                                                        <div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Designer</span><p>{product.designer}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Fabric</span><p>{product.details?.fabric}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Craft Technique</span><p>{product.details?.technique}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Includes</span><p>{product.details?.includes}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Delivery Time</span><p>{product.details?.delivery}</p></div>
                                                        </div>

                                                        <div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Category</span><p>{product.subTitle}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Colour</span><p>{product.details?.color}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Thread</span><p>{product.details?.thread}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Occasion</span><p>{product.details?.occasion}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Origin</span><p>{product.details?.origin}</p></div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= THE CRAFT ================= */}
                                        <div className="rap-pdp-rental-item">
                                            <div className="rap-pdp-rental-header" onClick={() => toggle("craft")}>
                                                <span>THE CRAFT</span>

                                                <Plus className={`rap-onlyrental-icon ${isOpen("craft") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("craft") && (
                                                <div className="rap-rental-pdp-content">
                                                    <p className="rap-rental-craft-text">
                                                        {product.craft}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= SIZE & FIT ================= */}
                                        <div className="rap-pdp-rental-item">
                                            <div className="rap-pdp-rental-header" onClick={() => toggle("size")}>
                                                <span>SIZE & FIT</span>

                                                <Plus className={`rap-onlyrental-icon ${isOpen("size") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("size") && (
                                                <div className="rap-rental-pdp-content">

                                                    <p className="rap-rental-size-intro">{product.sizeNote}</p>

                                                    <table className="rap-rental-size-table">
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
                                                                <tr key={i} className={row.recommended ? "rap-rental-active-row" : ""}>
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
                                        <div className="rap-pdp-rental-item">
                                            <div className="rap-pdp-rental-header" onClick={() => toggle("care")}>
                                                <span>CARE INSTRUCTIONS</span>

                                                <Plus className={`rap-onlyrental-icon ${isOpen("care") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("care") && (
                                                <div className="rap-rental-pdp-content">
                                                    <ul className="rap-rental-care-list">
                                                        {product.care?.map((item, i) => (
                                                            <li key={i}>
                                                                <span className="rap-rental-dash">—</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= SHIPPING ================= */}
                                        <div className="rap-pdp-rental-item">
                                            <div className="rap-pdp-rental-header" onClick={() => toggle("shipping")}>
                                                <span>SHIPPING & DELIVERY</span>

                                                <Plus className={`rap-onlyrental-icon ${isOpen("shipping") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("shipping") && (
                                                <div className="rap-rental-pdp-content">

                                                    <table className="rap-rental-shipping-table">
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
                                                                    <td className="rap-rental-cost">{item.cost}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                </div>
                                            )}
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* ================= BUY MODE ================= */}
                            {mode === "buy" && (
                                <div className="rap-buy">



                                    {/* 1. PRICE */}
                                    <div className="rap-preloved-price-block">

                                        <p className="rap-preloved-price-label">
                                            LISTED RESALE PRICE
                                        </p>

                                        <h2 className="rap-preloved-main-price">
                                            ₹{price.toLocaleString()}
                                        </h2>

                                        <div className="rap-preloved-price-row">
                                            <span className="rap-preloved-retail-price">
                                                ₹{retail.toLocaleString()} retail
                                            </span>

                                            <span className="rap-preloved-discount-badge">
                                                {discount}% OFF RETAIL
                                            </span>
                                        </div>

                                    </div>

                                    {/* 2. DISCLOSURE */}
                                    <div className="rap-preloved-disclosure">

                                        <p className="rap-preloved-disclosure-label">
                                            HONEST DISCLOSURE
                                        </p>

                                        <p className="rap-preloved-disclosure-text">
                                            {product.disclosure}
                                        </p>

                                    </div>

                                    {/* 3. SIZE */}
                                    <div className="rap-preloved-size-block">

                                        <p className="rap-preloved-size-label">
                                            SIZE
                                        </p>

                                        <div className="rap-preloved-size-pills">
                                            <span className="rap-preloved-size-pill active">
                                                <span className="rap-preloved-size-pill active">
                                                    {product.prelovedSize}
                                                </span>
                                            </span>
                                        </div>

                                    </div>

                                    {/* 4. CTA */}
                                    <div className="rap-preloved-cta-group">

                                        {/* BUY NOW */}
                                        <button className="rap-preloved-btn primary">
                                            <span className="rap-preloved-icon"><ShoppingBag /></span>
                                            BUY NOW — ₹{price.toLocaleString()}
                                        </button>

                                        {/* WISHLIST */}
                                        <button className="rap-preloved-btn outline">
                                            <span className="rap-preloved-icon"><Heart /></span>
                                            SAVE TO WISHLIST
                                        </button>

                                    </div>

                                    {/* 5. MAKE AN OFFER */}

                                    {/* ===== PRELOVED OFFER DIVIDER ===== */}
                                    <div className="rap-preloved-offer-divider">
                                        <span className="rap-preloved-offer-line"></span>
                                        <span className="rap-preloved-offer-text">OR MAKE AN OFFER</span>
                                        <span className="rap-preloved-offer-line"></span>
                                    </div>

                                    {/* ===== PRELOVED OFFER TRIGGER ===== */}
                                    <div
                                        className={`rap-preloved-offer-trigger ${isOfferOpen ? "open" : ""}`}
                                        onClick={() => setIsOfferOpen(!isOfferOpen)}
                                    >

                                        <div className="rap-preloved-offer-left">
                                            <span className="rap-preloved-offer-icon"><Gift /></span>

                                            <div>
                                                <p className="rap-preloved-offer-title">Name Your Price</p>
                                                <p className="rap-preloved-offer-sub">
                                                    Submit a quote — our team responds within 24 hours
                                                </p>
                                            </div>
                                        </div>

                                        <span className={`rap-preloved-offer-arrow ${isOfferOpen ? "rotate" : ""}`}>
                                            ›
                                        </span>

                                    </div>

                                    {/* Now triggered */}
                                    {isOfferOpen && (
                                        <div className="rap-preloved-offer-panel">
                                            <div className="rap-preloved-offer-price-row">

                                                {/* LEFT - LISTED PRICE */}
                                                <div className="rap-preloved-offer-col">
                                                    <p className="rap-preloved-offer-label">LISTED AT</p>
                                                    <h3 className="rap-preloved-offer-amount">
                                                        ₹{price.toLocaleString()}
                                                    </h3>
                                                </div>

                                                {/* ARROW */}
                                                <div className="rap-preloved-offer-arrow-icon">→</div>

                                                {/* RIGHT - YOUR OFFER */}
                                                <div className="rap-preloved-offer-col">
                                                    <p className="rap-preloved-offer-label">YOUR OFFER</p>
                                                    <h3 className="rap-preloved-offer-amount highlight">
                                                        ₹{offer.toLocaleString()}
                                                    </h3>
                                                </div>

                                            </div>

                                            <div className="rap-preloved-offer-slider-wrap">

                                                {/* LABELS */}
                                                <div className="rap-preloved-slider-labels">
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
                                                    className="rap-preloved-slider"
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
                                                <p className="rap-preloved-slider-hint">
                                                    Slide to set your offer · Min ₹{minOffer.toLocaleString()}
                                                </p>
                                            </div>

                                            {/* INPUT ROW */}
                                            <div className="rap-preloved-offer-input-row">

                                                <div className="rap-preloved-offer-input-wrap">
                                                    <span className="rap-preloved-rupee">₹</span>

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
                                                        className="rap-preloved-offer-input"
                                                    />
                                                </div>

                                                {/* SAVINGS */}
                                                {maxOffer - offer > 0 && (
                                                    <div className="rap-preloved-offer-savings-pill">
                                                        Save ₹{(maxOffer - offer).toLocaleString()}
                                                    </div>
                                                )}

                                            </div>

                                            {!isSubmitted ? (
                                                <>

                                                    {/* ===== NOTE ===== */}
                                                    <textarea
                                                        className="rap-preloved-note"
                                                        placeholder='Add a note (optional) — e.g. "Available for immediate pickup..."'
                                                        value={note}
                                                        onChange={(e) => setNote(e.target.value)}
                                                    />

                                                    {/* ===== CONTACT ===== */}
                                                    <div className="rap-preloved-contact-grid">
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
                                                    <div className="rap-preloved-terms-row">
                                                        <CircleAlert className="preloved-terms-icon" />

                                                        <p className="preloved-terms-text">
                                                            Submitting an offer does not reserve the piece. The listing remains active until a purchase is completed.
                                                        </p>
                                                    </div>
                                                    <button
                                                        className="rap-preloved-submit-btn"
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
                                                <div className="rap-preloved-success">
                                                    <div className="preloved-success-icon">✓</div>

                                                    <h3>Offer submitted</h3>

                                                    <p>
                                                        Our team will review your quote of ₹{offer.toLocaleString()} and get back to you within 24 hours.
                                                    </p>

                                                    <button
                                                        className="rap-preloved-reset-btn"
                                                        onClick={() => setIsSubmitted(false)}
                                                    >
                                                        Submit another offer
                                                    </button>
                                                </div>
                                            )}

                                        </div>
                                    )}

                                    {/* 6. WHATSAPP */}
                                    <div className="rap-preloved-whatsapp-btn">
                                        <MessageCircleCheck className="rap-whatsapp-icon" />
                                        ENQUIRE ON WHATSAPP
                                    </div>

                                    {/* 7.  CONSULT A STYSLISH */}

                                    <div className="rap-preloved-consult-box">

                                        <div className="rap-preloved-consult-left">

                                            <div className="rap-preloved-consult-icon">
                                                <User />
                                            </div>

                                            <div>
                                                <p className="rap-preloved-consult-title">
                                                    Not sure if this is the one?
                                                </p>

                                                <p className="rap-preloved-consult-subtitle">
                                                    Our stylist can help you find the right piece for your occasion, size, and budget.
                                                </p>
                                            </div>

                                        </div>

                                        <button className="rap-preloved-consult-btn">
                                            Consult a stylist
                                        </button>

                                    </div>


                                    {/* TRUST BADAGES */}

                                    <div className="rap-preloved-trust-badges">

                                        <div className="rap-preloved-trust-item">
                                            <Shield className="rap-preloved-trust-icon" />
                                            <span>AUTHENTICATED BY HOK</span>
                                        </div>

                                        <div className="rap-preloved-trust-item">
                                            <Shield className="rap-preloved-trust-icon" />
                                            <span>SECURE PAYMENT VIA RAZORPAY</span>
                                        </div>

                                        <div className="rap-preloved-trust-item">
                                            <CreditCard className="rap-preloved-trust-icon" />
                                            <span>SECURE CHECKOUT</span>
                                        </div>

                                    </div>

                                    {/* 8.PRELOVED PAGE ACCORDANCE* */}

                                    <div className="rap-preloved-accordion">

                                        <div className="rap-preloved-accordion-item">

                                            <div
                                                className="rap-preloved-accordion-header"
                                                onClick={() => toggle("details")}
                                            >
                                                <span>PRODUCT DETAILS</span>

                                                <Plus
                                                    className={`rap-preloved-accordion-icon ${isOpen("details") ? "open" : ""
                                                        }`}
                                                />
                                            </div>

                                            {isOpen("details") && (
                                                <div className="rap-preloved-accordion-content">

                                                    <div className="rap-preloved-details-grid">

                                                        <div>
                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Designer</span>
                                                                <p>{product.designer}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Fabric</span>
                                                                <p>{product.details?.fabric}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Embroidery</span>
                                                                <p>{product.details?.technique}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Includes</span>
                                                                <p>{product.details?.includes}</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Category</span>
                                                                <p>{product.subTitle}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Colour</span>
                                                                <p>{product.details?.color}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Occasion</span>
                                                                <p>{product.details?.occasion}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Origin</span>
                                                                <p>{product.details?.origin}</p>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            )}

                                        </div>

                                    </div>

                                    {/* ================= THE CRAFT ================= */}
                                    <div className="rap-preloved-accordion-item">

                                        <div
                                            className="rap-preloved-accordion-header"
                                            onClick={() => toggle("story")}
                                        >
                                            <span>THE STORY OF THIS PIECE</span>

                                            <Plus
                                                className={`rap-preloved-accordion-icon ${isOpen("story") ? "open" : ""
                                                    }`}
                                            />
                                        </div>

                                        {isOpen("story") && (
                                            <div className="rap-preloved-accordion-content">

                                                <p className="rap-preloved-story-text">
                                                    {product.story ||
                                                        "Worn once for a wedding celebration, this piece carries delicate handwork and timeless elegance. Carefully preserved and professionally cleaned, it remains in excellent condition with no visible damage."}
                                                </p>

                                                {product.stylingNote && (
                                                    <p className="rap-preloved-story-note">
                                                        {product.stylingNote}
                                                    </p>
                                                )}

                                            </div>
                                        )}

                                    </div>

                                    {/* ================= SIZE & FIT ================= */}
                                    <div className="rap-preloved-accordion-item">

                                        <div
                                            className="rap-preloved-accordion-header"
                                            onClick={() => toggle("size")}
                                        >
                                            <span>SIZE & FIT</span>

                                            <Plus
                                                className={`rap-preloved-accordion-icon ${isOpen("size") ? "open" : ""
                                                    }`}
                                            />
                                        </div>

                                        {isOpen("size") && (
                                            <div className="rap-preloved-accordion-content">

                                                {/* INTRO */}
                                                <p className="rap-preloved-size-intro">
                                                    {product.sizeNote || "Fits true to size. Blouse tailored for a 32\" bust with adjustable waist."}
                                                </p>

                                                {/* TABLE */}
                                                <table className="rap-preloved-size-table">
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

                                    <div className="rap-preloved-accordion-item">

                                        <div
                                            className="rap-preloved-accordion-header"
                                            onClick={() => toggle("condition")}
                                        >
                                            <span>CONDITION GRADE</span>

                                            <Plus
                                                className={`rap-preloved-accordion-icon ${isOpen("condition") ? "open" : ""
                                                    }`}
                                            />
                                        </div>

                                        {isOpen("condition") && (
                                            <div className="rap-preloved-accordion-content">

                                                {Object.keys(gradeConfig).map((key) => {
                                                    const item = gradeConfig[key];
                                                    const isActive = product.condition?.grade === key;

                                                    return (
                                                        <div
                                                            key={key}
                                                            className={`rap-preloved-grade-item ${isActive ? "active" : ""
                                                                }`}
                                                        >
                                                            <div className="rap-preloved-grade-header">

                                                                <span
                                                                    className="rap-preloved-grade-dot"
                                                                    style={{ background: item.color }}
                                                                />

                                                                <span className="rap-preloved-grade-name">
                                                                    {item.label}
                                                                    {isActive && " ← THIS PIECE"}
                                                                </span>

                                                            </div>

                                                            <p className="rap-preloved-grade-desc">
                                                                {item.desc}
                                                            </p>
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        )}

                                    </div>


                                    {/* ================= CARE ================= */}
                                    <div className="rap-preloved-accordion-item">

                                        <div
                                            className="rap-preloved-accordion-header"
                                            onClick={() => toggle("care")}
                                        >
                                            <span>CARE INSTRUCTIONS</span>

                                            <Plus
                                                className={`rap-preloved-accordion-icon ${isOpen("care") ? "open" : ""
                                                    }`}
                                            />
                                        </div>

                                        {isOpen("care") && (
                                            <div className="rap-preloved-accordion-content">

                                                {product.care?.map((item, i) => (
                                                    <p key={i} className="rap-preloved-care-item">
                                                        <span className="rap-preloved-care-dash">—</span>
                                                        {item}
                                                    </p>
                                                ))}

                                            </div>
                                        )}

                                    </div>

                                    {/* ================= SHIPPING ================= */}
                                    <div className="rap-preloved-accordion-item">

                                        <div
                                            className="rap-preloved-accordion-header"
                                            onClick={() => toggle("shipping")}
                                        >
                                            <span>SHIPPING & DELIVERY</span>

                                            <Plus
                                                className={`rap-preloved-accordion-icon ${isOpen("shipping") ? "open" : ""
                                                    }`}
                                            />
                                        </div>

                                        {isOpen("shipping") && (
                                            <div className="rap-preloved-accordion-content">

                                                {/* DELIVERY METHODS */}
                                                {product.shipping?.map((item, i) => (
                                                    <p key={i} className="rap-preloved-shipping-item">
                                                        <span className="rap-preloved-shipping-dash">—</span>
                                                        {item.method}: {item.time}, {item.cost}
                                                    </p>
                                                ))}

                                                {/* PACKAGING */}
                                                {product.packaging?.map((text, i) => (
                                                    <p key={i} className="rap-preloved-shipping-packaging">
                                                        {text}
                                                    </p>
                                                ))}

                                            </div>
                                        )}

                                    </div>


                                </div>
                            )}

                        </div>
                    </Col>

                </Row>
            </Container>
            <RelatedProduct />
        </section>
    );
}