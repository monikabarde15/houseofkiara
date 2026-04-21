import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Heart, Star, TrendingUp, Gift, User, Calendar,Box, CreditCard, MessageCircleCheck, Shield, CircleAlert, ArrowRight, ShoppingBag, X, Plus, Truck } from "lucide-react";
import { products, makeProductDetail } from "./ProductList";
import GalleryColumn from "./GalleryColumn";
import '../styles/rental-and-buy.css'
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


    // ===============BUY NOW======================//

    const [price, setPrice] = useState(product?.price);
    const [selectedColor, setSelectedColor] = useState(null);



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
                            variant={mode === "rent" ? "rent" : "buy"}
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
                                <div className="rab-buy">

                                    {/* ========PRICE BLOCK ====== */}

                                    <div className="rab-price-block">

                                        <p className="rab-price-label">Price</p>
                                        <h2 className="rab-main-price">{price}</h2>
                                        <p className="rab-price-meta">
                                            Inclusive of all taxes · Free delivery above ₹2,999
                                        </p>

                                    </div>

                                    {/* =========DELIVERY ROW ======= */}

                                    <div className="rab-delivery-row">
                                        <div className="rab-delivery-icon">
                                            <Truck />
                                        </div>

                                        <p className="rab-delivery-text">
                                            <span className="rab-strong">Ready to ship</span> · Dispatches in 2–3 days · Standard delivery 4–6 days
                                        </p>
                                    </div>

                                    {/* COLORS */}
                                    <div className="rab-color-section">
                                        <p className="rab-section-label">SELECT COLOUR</p>
                                        <div className="rab-swatches-details">
                                            {product.colors?.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className={`rab-swatches-details ${selectedColor === c.code ? "active" : ""}`}
                                                    onClick={() => {
                                                        
                                                        setSelectedColor(c.code);
                                                        setActiveImage(c.images[0]);
                                                    }}
                                                >
                                                    <div
                                                        className="rab-swatch-circle-details"
                                                        style={{ backgroundColor: c.code }}
                                                    ></div>
                                                    <span className="rab-swatch-name">
                                                        {c.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SIZE */}
                                    <div className="rab-section">
                                        <div className="rab-size-header">
                                            <p className="rab-size-label">Select Size</p>
                                            <span className="rab-size-guide">Size Guide & Measurements</span>
                                        </div>
                                        <div className="rab-sizes">
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
                                        <p className="rab-size-note">
                                            This piece is unstitched. It runs true to size — for a more relaxed flare in the anarkali silhouette, consider sizing up.
                                            <span className="rab-size-help"> Need help choosing?</span>
                                        </p>
                                    </div>

                                    {/* CTA Section */}

                                    <div className="rab-pdp-cta">

                                        <button className="rab-pdp-btn-primary">
                                            ADD TO BAG — {price}
                                        </button>

                                        <button className="rab-pdp-btn-outline">
                                            SAVE TO WISHLIST
                                        </button>

                                        <button className="rab-pdp-btn-whatsapp">
                                            ASK ON WHATSAPP
                                        </button>

                                    </div>

                                    {/* Trust Badages */}

                                    <div className="rab-trust-badages">
                                        <div className="rab-trust-item">
                                            <Shield />
                                            <span>Authenticated by HOK</span>
                                        </div>
                                        <div className="rab-trust-item">
                                            <Box />
                                            <span>Direct from designer</span>
                                        </div>
                                        <div className="rab-trust-item">
                                            <Truck />
                                            <span>Ready to Ship</span>
                                        </div>
                                    </div>

                                    {/* Consultant */}

                                    <div className="rab-consult-box">
                                        <div className="rab-consult-left">
                                            <div className="rab-consult-icon">
                                                <User />
                                            </div>

                                            <div className="rab-consult-text">
                                                <p className="rab-consult-title">
                                                    Not sure if this is the one?
                                                </p>

                                                <p className="rab-consult-subtitle">
                                                    Our stylist can help you choose the right piece, colour, and size for your occasion.
                                                </p>
                                            </div>
                                        </div>

                                        <button className="rab-consult-btn">
                                            Consult a stylish
                                        </button>
                                    </div>

                                    {/* PRODUCTS PAGE DETAILS */}
                                    
                                    <div className="rab-pdp-accordion">

                                        {/* ================= PRODUCT DETAILS ================= */}
                                        <div className="rab-pdp-item">
                                            <div className="rab-pdp-header" onClick={() => toggle("details")}>
                                                <span>PRODUCT DETAILS</span>

                                                <Plus className={`rab-pdp-icon ${isOpen("details") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("details") && (
                                                <div className="rab-pdp-content">
                                                    <div className="rab-pdp-grid">

                                                        <div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Designer</span><p>{product.designer}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Fabric</span><p>{product.details?.fabric}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Craft Technique</span><p>{product.details?.technique}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Includes</span><p>{product.details?.includes}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Delivery Time</span><p>{product.details?.delivery}</p></div>
                                                        </div>

                                                        <div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Category</span><p>{product.subTitle}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Colour</span><p>{product.details?.color}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Thread</span><p>{product.details?.thread}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Occasion</span><p>{product.details?.occasion}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Origin</span><p>{product.details?.origin}</p></div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= THE CRAFT ================= */}
                                        <div className="rab-pdp-item">
                                            <div className="rab-pdp-header" onClick={() => toggle("craft")}>
                                                <span>THE CRAFT</span>

                                                <Plus className={`rab-pdp-icon ${isOpen("craft") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("craft") && (
                                                <div className="rab-pdp-content">
                                                    <p className="rab-craft-text">
                                                        {product.craft}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= SIZE & FIT ================= */}
                                        <div className="rab-pdp-item">
                                            <div className="rab-pdp-header" onClick={() => toggle("size")}>
                                                <span>SIZE & FIT</span>

                                                <Plus className={`rab-pdp-icon ${isOpen("size") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("size") && (
                                                <div className="rab-pdp-content">

                                                    <p className="rab-size-intro">{product.sizeNote}</p>

                                                    <table className="rab-size-table">
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
                                                                <tr key={i} className={row.recommended ? "rab-active-row" : ""}>
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
                                        <div className="rab-pdp-item">
                                            <div className="rab-pdp-header" onClick={() => toggle("care")}>
                                                <span>CARE INSTRUCTIONS</span>

                                                <Plus className={`rab-pdp-icon ${isOpen("care") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("care") && (
                                                <div className="rab-pdp-content">
                                                    <ul className="rab-care-list">
                                                        {product.care?.map((item, i) => (
                                                            <li key={i}>
                                                                <span className="rab-dash">—</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* ================= SHIPPING ================= */}
                                        <div className="rab-pdp-item">
                                            <div className="rab-pdp-header" onClick={() => toggle("shipping")}>
                                                <span>SHIPPING & DELIVERY</span>

                                                <Plus className={`rab-pdp-icon ${isOpen("shipping") ? "open" : ""}`} />
                                            </div>

                                            {isOpen("shipping") && (
                                                <div className="rab-pdp-content">

                                                    <table className="rab-shipping-table">
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
                                                                    <td className="rab-cost">{item.cost}</td>
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

                            
                        </div>
                    </Col>

                </Row>
            </Container>
            <RelatedProduct />
        </section>
    );
}