
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, Truck,Shield } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import "../styles/rental-product-detail.css";
import { products, makeProductDetail } from "./ProductList";

export default function RentalProductDetail() {
    const location = useLocation();
    const { id } = useParams();

    // ✅ allow reassignment
    let product = location.state?.product;

    // ✅ fallback for direct URL
    if (!product) {
        const found = products.find((p) => p.id === Number(id));
        if (found) {
            product = makeProductDetail(found);
        }
    }

    if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

    const [wish, setWish] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [activeImage, setActiveImage] = useState(product.images?.[0]);

    useEffect(() => {
        if (product.colors?.length) {
            setSelectedColor(product.colors[0].code);
            setActiveImage(product.colors[0].images[0]);
        }
    }, [product]);

    return (
        <section className="pdp">
            <Container>

                {/* BREADCRUMB */}
                <div className="pdp-breadcrumb-wrapper">
                    <div className="breadcrumb">
                        <span className="crumb">Home</span>
                        <span className="sep">›</span>
                        <span className="crumb">Rent</span>
                        <span className="sep">›</span>
                        <span className="crumb">Bridal Lehengas</span>
                        <span className="sep">›</span>
                        <span className="crumb">Sabyasachi</span>
                        <span className="sep">›</span>
                        <span className="crumb current">Crimson Zarodozi Bridal Lehenga</span>
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

                            <div className="gallery-badge">FOR RENT</div>

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
                        <div className="pdp-info">

                            <div className="eyebrow">
                                <span className="line"></span>
                                <span className="eyebrow-text">Rental Piece</span>
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
                                    EXCELLENT CONDITION
                                </span>
                                <span className="rented-count">Rented 4×</span>
                            </div>

                            {/* PRICE BLOCK */}
                            <div className="price-block">
                                <p className="price-label">Rental Price</p>
                                <h2 className="main-price">
                                    {product.price} <span className="duration">/ 4 days</span>
                                </h2>
                                <p className="price-subline"> ₹ 2500 per day • Minimum 3 days </p>

                                <div className="rental-window">
                                    <div className="rental-block selected">
                                        <p className="option-label">Standard Window</p>
                                        <h3 className="option-amount">{product.price}</h3>
                                        <p className="option-days">4 days - most popular</p>
                                    </div>
                                    <div className="rental-block">
                                        <p className="option-label">Extended Window</p>
                                        <h3 className="option-amount">{product.price}</h3>
                                        <p className="option-days">7 days - Destination Weddings</p>
                                    </div>
                                    
                                </div>

                                <div className="deposit-block">
                                    <Shield className="deposit-icon"/>
                                    <p className="deposit-text"><b className="deposit-bold">₹ 25,000 refundable deposit</b> required • Returned within 3-5 business days after piece is received and inspected </p>
                                </div>

                            </div>

                            {/* RENT DATES */}
                            <div style={{ marginBottom: "20px" }}>
                                <label>Start Date</label>
                                <input type="date" />

                                <label style={{ marginTop: "10px" }}>End Date</label>
                                <input type="date" />
                            </div>

                            {/* DELIVERY */}
                            <div className="delivery-row">
                                <Truck />
                                <p className="delivery-text">
                                    <span className="strong">Available</span> · Ready for rental
                                </p>
                            </div>

                            {/* COLORS */}
                            <div className="color-section">
                                <p className="section-label">SELECT COLOUR</p>
                                <div className="swatches-details">
                                    {product.colors?.map((c, i) => (
                                        <div
                                            key={i}
                                            className={`swatches-details ${selectedColor === c.code ? "active" : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedColor(c.code);
                                                setActiveImage(c.images[0]);
                                            }}
                                        >
                                            <div
                                                className="swatch-circle-details"
                                                style={{ backgroundColor: c.code }}
                                            ></div>
                                            <span className="swatch-name">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="cta-section">
                                <button className="add-btn">RENT NOW</button>
                                <button className="wishlist-btn">SAVE</button>
                            </div>

                        </div>
                    </Col>

                </Row>
            </Container>
        </section>
    );
}