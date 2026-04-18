import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, TrendingUp, Calendar, MessageCircleCheck, Shield, ArrowRight, X, Plus ,Truck} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import "../styles/rental-product-detail.css";
import { products, makeProductDetail } from "./ProductList";
import RentalCalendar from "./RentalCalendar";
import RelatedProduct from "./RelatedProduct";
const tempSizes = [
    { label: "XS", available: true },
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: false }
];
export default function RentalProductDetail() {
    const location = useLocation();
    const { id } = useParams();

    // ===== PRODUCT FETCH =====
    let product = location.state?.product;

    if (!product) {
        const found = products.find((p) => p.id === Number(id));
        if (found) product = makeProductDetail(found);
    }

    if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

    // ===== STATES =====
    const [wish, setWish] = useState(false);
    const [activeImage, setActiveImage] = useState(product.images?.[0]);
    const [mode, setMode] = useState(
        product.modes?.rent?.enabled ? "rent" : "buy"
    );
    const [selectedWindow, setSelectedWindow] = useState("standard");

    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
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

    // ===== STATES =====

// ✅ CHANGE (image + video support)
const [activeMedia, setActiveMedia] = useState({
    type: "image",
    src: product.images?.[0],
});
    return (
        <>
        <section className="pdp">
            <Container>

                {/* BREADCRUMB */}
                <div className="pdp-breadcrumb-wrapper">
                    <div className="breadcrumb">
                        <span className="crumb">Home</span>
                        <span className="sep">›</span>
                        <span className="crumb">Rent</span>
                        <span className="sep">›</span>
                        <span className="crumb current">{product.title}</span>
                    </div>
                </div>

                <Row>

                    {/* LEFT */}
                    <Col md={6} className="pdp-left-wrap">
                        <div className="thumbs">
                           {product.images?.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() =>
                                        setActiveMedia({ type: "image", src: img })
                                    }
                                />
                            ))}
                            {product.video && (
                                <div
                                    className="video-thumb"
                                    onClick={() =>
                                        setActiveMedia({
                                            type: "video",
                                            src: product.video,
                                        })
                                    }
                                >
                                    ▶
                                </div>
                            )}
                        </div>

                        <div
                            className="main-img"
                        >
                          {activeMedia.type === "image" ? (
                                <img
                                src={activeMedia.src}
                                alt={product.title}
                                className="product-image"
                                />
                            ) : (
                                <video
                                src={activeMedia.src}
                                controls
                                className="product-video"
                                />
                            )}
                            <div className={`gallery-badge ${mode}`}>
                                {mode === "rent" ? "FOR RENT" : "BUY NEW"}
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
                        <div className="pdp-info">

                            {/* TOGGLE */}
                            <div className="pdp-toggle">
                                {rentData?.enabled && (
                                    <button
                                        className={`toggle-btn ${mode === "rent" ? "active" : ""}`}
                                        onClick={() => setMode("rent")}
                                    >
                                        RENT THIS PIECE
                                    </button>
                                )}

                                {buyData?.enabled && (
                                    <button
                                        className={`toggle-btn ${mode === "buy" ? "active" : ""}`}
                                        onClick={() => setMode("buy")}
                                    >
                                        BUY NEW
                                    </button>
                                )}
                            </div>

                            <p className="designer-name">{product.designer}</p>

                            <h1 className="product-title">
                                {product.title} <em>{product.subTitle}</em>
                            </h1>

                            <p className="product-desc">{product.description}</p>

                            {/* RATING */}
                            <div className="rating-row">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={16}
                                        fill={product.rating >= s ? "#c5a46d" : "none"}
                                        stroke="#c5a46d"
                                    />
                                ))}
                                <span className="rating-text">{product.rating}.0</span>
                                <span className="reviews">{product.reviews} reviews</span>
                                <span className="never-worn-soft">{mode === "rent" ? "AVAILABLE FOR RENT" : "IN STOCK"}</span>
                                <span className="rent-count">
                                    {mode === "rent" ? "Rented " + rentData.availability.rentedCount + "×" : ""}
                                </span>
                            </div>

                            {/* ================= RENT MODE ================= */}
                            {mode === "rent" && rentData && (

                                <>
                                    {/* Price Block */}
                                    <div className="price-block">

                                        <p className="price-label">Rental Price</p>

                                        <h2 className="main-price">
                                            ₹{selectedWindowData?.price}
                                            <span className="duration">
                                                {" "}
                                                / {selectedWindowData?.days} days
                                            </span>
                                        </h2>

                                        <p className="price-subline">
                                            ₹{rentData.pricing.pricePerDay} per day • Minimum{" "}
                                            {rentData.pricing.minDays} days
                                        </p>

                                        {/* WINDOWS */}
                                        <div className="rental-window">
                                            {rentData.pricing.windows.map((w) => (
                                                <div
                                                    key={w.id}
                                                    className={`rental-block ${selectedWindow === w.id ? "selected" : ""
                                                        }`}
                                                    onClick={() => setSelectedWindow(w.id)}
                                                >
                                                    <p className="option-label">{w.label}</p>
                                                    <h3 className="option-amount">₹{w.price}</h3>
                                                    <p className="option-days">
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
                                        <div className="deposit-block">
                                            <Shield className="deposit-icon" />
                                            <p className="deposit-text">
                                                <b className="deposit-bold">
                                                    ₹{rentData.deposit.amount} refundable deposit
                                                </b>{" "}
                                                required • Returned within 3 -{" "}
                                                {rentData.deposit.returnDays} business days after piece is recieved and inspected
                                            </p>
                                        </div>
                                    </div>
                                    {/* SIZE BLOCK */}
                                    <div className="size-block">

                                        {/* HEADER */}
                                        <div className="size-header">
                                            <span className="size-label">Select Size</span>
                                            <span className="size-guide">Size & Measurement Guide</span>
                                        </div>

                                        {/* SIZE PILLS */}
                                        <div className="size-options">
                                            {tempSizes.map((size, i) => (
                                                <button
                                                    key={i}
                                                    disabled={!size.available}
                                                    onClick={() => size.available && setSelectedSize(size.label)}
                                                    className={`size-pill
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

                                    <div className="rental-cta">

                                        {/* PRIMARY CTA */}
                                        <button
                                            className={`cta-primary ${selectedStart && selectedEnd ? "active" : "disabled"}`}
                                            disabled={!(selectedStart && selectedEnd)}
                                        >
                                            <span className="cta-icon"><Calendar /></span>
                                            CONFIRM BOOKING
                                        </button>

                                        {/* WISHLIST */}
                                        <button className="cta-wishlist">
                                            <span className="cta-icon"><Heart /></span>
                                            SAVE TO WISHLIST
                                        </button>

                                        {/* WHATSAPP */}
                                        <button className="cta-whatsapp">
                                            <span className="cta-icon">
                                                <MessageCircleCheck />
                                            </span>
                                            ASK ON WHATSAPP
                                        </button>

                                    </div>

                                    {/* TRUST BADAGE */}

                                    <div className="trust-badages">
                                        <div className="trust-item">
                                            <ArrowRight />
                                            <span>DRY-CLEANED & DELIVERED </span>
                                        </div>
                                        <div className="trust-item">
                                            <Shield />
                                            <span>SECURE PAYMENT VIA RAZORPAY</span>
                                        </div>
                                        <div className="trust-item">
                                            <TrendingUp />
                                            <span>DEPOSIT REFUND IN 3-5 DAYS</span>
                                        </div>
                                    </div>


                                    {/*  RENTAL PAGE ACCORDANCE*/}

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

                                </>


                            )}


                            {/* ================= BUY MODE ================= */}
                            {mode === "buy" && buyData && (
                                <>
                                    {/* Authenticity Block */}
                                    <div className="buy-authenticity-block">
                                        <Shield className="buy-deposit-icon" />
                                        <p className="buy-deposit-text">
                                            <b className="buy-deposit-bold">
                                                Brand New, Never Worn
                                            </b>{" "}
                                            — Delivered with Orginal {product.designer} packaging with dust bag,
                                            care card and the certificate of authenticity
                                        </p>
                                    </div>
                                    {/* Buy Price Block */}
                                    <div className="price-block">

                                        <p className="price-label">Rental Price</p>
                                        <h2 className="main-price">{product.price}</h2>
                                        <p className="price-meta">
                                            Inclusive of all taxes · Free delivery above ₹2,999
                                        </p>

                                    </div>

                                    <div className="delivery-row">
                                        <div className="delivery-icon">
                                            <Truck />
                                        </div>

                                        <p className="delivery-text">
                                            <span className="strong">Ready to ship</span> · Dispatches in 2–3 days · Standard delivery 4–6 days
                                        </p>
                                    </div>
                                </>

                            )}

                        </div>
                    </Col>

                </Row>
            </Container>
        </section>
        <RelatedProduct/>
        </>
    );
}