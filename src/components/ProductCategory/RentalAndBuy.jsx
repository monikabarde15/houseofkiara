import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Heart, Star, TrendingUp, Gift, User, Calendar, Box, CreditCard, MessageCircleCheck, Shield, CircleAlert, ArrowRight, ShoppingBag, X, Plus, Truck } from "lucide-react";
import { formatProductDetail, parsePrice } from "../../utils/productNavigation";
import staticProducts from "../../data/mainCategoryPageData";
import GalleryColumn from "../GalleryColumn";
import '../../styles/productcategory/rental-and-buy.css'
import RentalCalendar from "../RentalCalendar";
import RelatedProduct from "../RelatedProduct";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";

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
    const navigate = useNavigate();
    const location = useLocation();

    // ===== PRODUCT FETCH =====
    const [product, setProduct] = useState(() => {
        return location.state?.product ? formatProductDetail(location.state.product) : null;
    });
    const [loading, setLoading] = useState(!product);

    useEffect(() => {
        let isMounted = true;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data && isMounted) {
                        setProduct(formatProductDetail(json.data));
                        setLoading(false);
                        return;
                    }
                }
                const staticItem = staticProducts?.find(
                    (sp) => String(sp.id) === String(id) || String(sp.productId) === String(id)
                );
                if (staticItem && isMounted) {
                    setProduct(formatProductDetail(staticItem));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Error fetching product by ID:", err);
                const staticItem = staticProducts?.find(
                    (sp) => String(sp.id) === String(id) || String(sp.productId) === String(id)
                );
                if (staticItem && isMounted) {
                    setProduct(formatProductDetail(staticItem));
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProduct();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const [activeImage, setActiveImage] = useState(null);
    const [mode, setMode] = useState("rent");

    useEffect(() => {
        if (product) {
            setActiveImage(product.images?.[0] || null);
            if (product.modes) {
                setMode(product.modes.rent?.enabled ? "rent" : "buy");
            }
        }
    }, [product]);

    const { isAuthenticated } = useAuthStore();
    const wishlistItems = useWishlistStore((state) => state.items);
    const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

    const targetId = String(product?.sku || product?.productId || product?._id || product?.id || id || "");
    const prodSku = String(product?.sku || "");
    const prodDbId = String(product?._id || "");
    const prodPid = String(product?.productId || "");

    const isWishlisted = targetId
        ? wishlistItems.some((itemId) => {
                const sid = String(itemId);
                return (
                    sid === targetId ||
                    (prodSku && sid === prodSku) ||
                    (prodDbId && sid === prodDbId) ||
                    (prodPid && sid === prodPid)
                );
            })
        : false;

    const [selectedWindow, setSelectedWindow] = useState("standard");
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [openSections, setOpenSections] = useState(["details"]);

    const [isOfferOpen, setIsOfferOpen] = useState(false);

    // ===== DATA =====
    const rentPrice =
        parsePrice(product?.rentalPrice) ||
        parsePrice(product?.rentPrice) ||
        parsePrice(product?.modes?.rent?.pricing?.windows?.[0]?.price) ||
        parsePrice(product?.price) ||
        parsePrice(product?.listingPrice) ||
        0;
    const perDay =
        (rentPrice > 0 ? Math.round(rentPrice / 4) : 0) || parsePrice(product?.perDayRate) || 0;
    const rentData = (product?.modes?.rent?.pricing?.windows?.[0]?.price)
        ? product.modes.rent
        : {
            pricing: {
                pricePerDay: perDay,
                minDays: product?.minimumDurationDays || 3,
                windows: [
                    { id: "standard", label: "Standard Window", price: rentPrice, days: 4, tag: "most popular" },
                    { id: "extended", label: "Extended Window", price: Math.round((rentPrice / 4) * 7), days: 7, tag: "destination weddings" }
                ]
            },
            deposit: { amount: product?.securityDeposit || Math.round(rentPrice * 1.5) || 0, returnDays: 5 }
        };
    const buyData = product?.modes?.buy || null;
    const sizes = product?.modes?.rent?.sizes || [];

    const availableSizes =
        sizes.length > 0
            ? sizes
            : Array.isArray(product?.sizes) && product.sizes.length > 0
                ? product.sizes.map((s) => ({
                    label: typeof s === "object" ? s.label || s.size || "None" : s,
                    available: true,
                }))
                : [];

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

    const retail =
        parsePrice(product?.originalRetailPrice) ||
        parsePrice(product?.retailPrice) ||
        parsePrice(product?.originalPrice) ||
        parsePrice(product?.modes?.preloved?.pricing?.originalPrice) ||
        parsePrice(product?.modes?.rent?.pricing?.originalRetailPrice) ||
        parsePrice(product?.modes?.rent?.pricing?.retailPrice) ||
        0;

    // ===== SELECTED WINDOW =====
    const selectedWindowData =
        rentData?.pricing?.windows?.find((w) => w.id === selectedWindow) ||
        rentData?.pricing?.windows?.[0];

    const currentRentPrice = parsePrice(selectedWindowData?.price) || rentPrice;
    const discount =
        retail > currentRentPrice && retail > 0 && currentRentPrice > 0
            ? Math.round(((retail - currentRentPrice) / retail) * 100)
            : 0;

    // for dot color
    const grade = product?.condition?.grade || "pristine";

    // ===============BUY NOW======================//
    const buyPriceNumeric = product?.listingPrice || product?.price || 0;
    const [price, setPrice] = useState(buyPriceNumeric ? `₹${Number(buyPriceNumeric).toLocaleString()}` : "₹0");
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        if (product) {
            const bp = product.listingPrice || product.price || 0;
            const numeric = typeof bp === 'number' ? bp : Number(String(bp).replace(/[^\d]/g, "")) || 0;
            setPrice(`₹${numeric.toLocaleString()}`);
            if (product.colors?.length) {
                setSelectedColor(product.colors[0].code);
            }
        }
    }, [product]);

    if (loading) return <div style={{ padding: 60, textAlign: "center", fontFamily: "Cinzel, serif" }}>Loading piece details...</div>;
    if (!product) return <h2>Product not found</h2>;

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        return `${y}-${m}-${d}`;
    };

    // Confirm Booking Handler
    const handleConfirmBooking = () => {
        if (!selectedStart || !selectedEnd) return;

        const eventDate = new Date(selectedStart);
        eventDate.setDate(eventDate.getDate() + 2);

        const rentalWindowDays =
            Math.ceil(
                (selectedEnd - selectedStart) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        const calculatedPerDay =
            (rentPrice > 0 ? Math.round(rentPrice / 4) : 0) ||
            rentData?.pricing?.pricePerDay ||
            product?.perDayRate ||
            0;

        let price = selectedWindowData?.price || product?.rentalPrice || 0;
        if (selectedWindow === "standard" || rentalWindowDays === 4) {
            price = rentPrice || selectedWindowData?.price || 12000;
        } else if (selectedWindow === "extended" && selectedWindowData?.price) {
            price = selectedWindowData.price;
        } else if (rentalWindowDays && calculatedPerDay > 0) {
            price = rentalWindowDays * calculatedPerDay;
        }

        useCartStore.getState().addToCart(product, {
            type: "rental",
            size: selectedSize || "M",
            deliveryDate: formatDate(selectedStart),
            eventDate: formatDate(eventDate),
            returnDate: formatDate(selectedEnd),
            rentalWindowDays,
            price,
        });

        navigate("/cart");
    };

    // Wishlist Handler Rental
    const handleRentalWishlist = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        if (!isAuthenticated) {
            toast.error("Please login to use your wishlist");
            navigate("/auth");
            return;
        }

        if (targetId) {
            const willBeActive = !isWishlisted;
            toggleWishlist(targetId, product);

            if (willBeActive) {
                toast.success("Added to your wishlist");
            } else {
                toast("Removed from your wishlist", {
                    icon: "✕",
                });
            }
        }
    };

    //  WhatsApp Handler
    const handleRentalWhatsApp = () => {
        const phoneNumber = "919999999999";

        const message = `
Product: ${product.title}
Designer: ${product.designer}
Rental Price: ₹${selectedWindowData?.price}
Duration: ${selectedWindowData?.days} Days
`;

        window.open(
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    // Handle ADD to cart Buy new
    const handleAddToCart = () => {
        const numericPrice =
            typeof price === "number"
                ? price
                : Number(String(price).replace(/[^\d]/g, "")) ||
                  product.listingPrice ||
                  product.price ||
                  0;

        useCartStore.getState().addToCart(product, {
            type: "new",
            size: selectedSize || "Free Size",
            color: selectedColor || "",
            price: numericPrice,
            quantity: 1,
        });

        navigate("/cart");
    };

    // Buy Wishlist Handler
    const handleBuyWishlist = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        if (!isAuthenticated) {
            toast.error("Please login to use your wishlist");
            navigate("/auth");
            return;
        }

        if (targetId) {
            const willBeActive = !isWishlisted;
            toggleWishlist(targetId, product);

            if (willBeActive) {
                toast.success("Added to your wishlist");
            } else {
                toast("Removed from your wishlist", {
                    icon: "✕",
                });
            }
        }
    };

    // Buy New Whatsapp Handler

    const handleBuyWhatsApp = () => {
        const phoneNumber = "919999999999";

        const message = `
Product: ${product.title}
Designer: ${product.designer}
Price: ${price}
Size: ${selectedSize || "Not Selected"}
Color: ${selectedColor || "Not Selected"}
`;

        window.open(
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };


    return (
        <section className={`rap-root ${mode === "buy" ? "buy-mode" : "rent-mode"}`}>
            <Container>

                {/* BREADCRUMB */}
                <div className="rap-pdp-breadcrumb-wrapper">
                    <div className="rap-breadcrumb">
                        <span className="rap-crumb">Home</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb">{mode === "rent" ? "Rent" : "Buy New"}</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb">{product.category || "None"}</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb current">{product.designer || "None"}</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb current">{product.title || product.name || "None"}</span>
                    </div>
                </div>

                <Row>

                    {/* ================= LEFT (COPY SAME) ================= */}
                    <Col md={6} className="rap-left">

                        <GalleryColumn
                            images={product.images}
                            video={product.video}
                            variant={mode === "rent" ? "rent" : "buy"}
                            productId={product.id || product.productId || id}
                            product={product}
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

                            <p className="rap-rental-designer-name">{product.designer || "None"}</p>

                            <h1 className="rap-rental-product-title">
                                {product.title || product.name || "None"} <em>{product.subTitle || ""}</em>
                            </h1>

                            <p className="rap-rental-product-desc">{product.description || "None"}</p>

                            {/* RATING */}
                            <div className="rap-rental-rating-row">

                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        className="rap-rental-star-icon"
                                        key={s}
                                        size={16}
                                        fill={(product.rating || 0) >= s ? "#c5a46d" : "none"}
                                        stroke="#c5a46d"
                                    />
                                ))}

                                <span className="rap-rental-rating-text">{(product.rating || 0)}.0</span>

                                <span className="rap-rental-rating-separator" />

                                <span className="rap-rental-reviews">{product.reviews || product.reviewCount || 0} reviews</span>

                                <span className="rap-rental-rating-separator" />

                                <span
                                    className="rap-rental-never-worn-soft"
                                    style={{ "--dot-color": gradeDotColor[grade] || "#6B7E5A" }}
                                >
                                    {gradeLabel[grade] || "AUTHENTIC PIECE"}
                                </span>

                            </div>

                            {/* ================= RENT MODE ================= */}
                            {mode === "rent" && (
                                <div className="rap-rent">



                                    {/* 1. PRICE BLOCK */}
                                    <div className="rap-rental-price-block">

                                        <p className="rap-rental-price-label">Rental Price</p>

                                        <div className="rap-rental-price-header-row">
                                            <h2 className="rap-rental-main-price">
                                                ₹{Number(selectedWindowData?.price || rentPrice || 0).toLocaleString("en-IN")}
                                                <span className="rap-onlyduration">
                                                    {" "}
                                                    / {selectedWindowData?.days || 4} days
                                                </span>
                                            </h2>

                                            {retail > 0 && (
                                                <div className="rap-rental-savings-wrap">
                                                    <span className="rap-rental-retail-struck">
                                                        retail ₹{Number(retail).toLocaleString("en-IN")}
                                                    </span>
                                                    {discount > 0 && (
                                                        <span className="rap-rental-save-badge">
                                                            Save {discount}%
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <p className="rap-rental-price-subline">
                                            ₹{Number(rentData?.pricing?.pricePerDay || 0).toLocaleString("en-IN")} per day • Minimum{" "}
                                            {rentData?.pricing?.minDays || 3} days
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
                                            {availableSizes.length > 0 ? (
                                                availableSizes.map((size, i) => (
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
                                                ))
                                            ) : (
                                                <span className="rap-rental-size-pill">None</span>
                                            )}
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
                                            onClick={handleConfirmBooking}
                                        >
                                            <span className="rap-rental-cta-icon"><Calendar /></span>
                                            CONFIRM BOOKING
                                        </button>

                                        {/* WISHLIST */}
                                        <button
                                            className={`rap-rental-cta-wishlist ${isWishlisted ? "active" : ""}`}
                                            onClick={handleRentalWishlist}
                                        >
                                            <span className="rap-rental-cta-icon">
                                                <Heart
                                                    style={{
                                                        fill: isWishlisted ? "#B85C38" : "none",
                                                        stroke: isWishlisted ? "#B85C38" : "currentColor",
                                                        color: isWishlisted ? "#B85C38" : "currentColor",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                />
                                            </span>

                                            {isWishlisted ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
                                        </button>

                                        {/* WHATSAPP */}
                                        <button className="rap-rental-cta-whatsapp"
                                            onClick={handleRentalWhatsApp}
                                        >
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
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Designer</span><p>{product.designer || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Fabric</span><p>{product.details?.fabric || product.fabric || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Craft Technique</span><p>{product.details?.technique || product.craftTechnique || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Includes</span><p>{product.details?.includes || product.includes || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Delivery Time</span><p>{product.details?.delivery || product.deliveryTime || "None"}</p></div>
                                                        </div>

                                                        <div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Category</span><p>{product.category || product.subTitle || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Colour</span><p>{product.details?.color || product.color || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Thread</span><p>{product.details?.thread || product.thread || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Occasion</span><p>{product.details?.occasion || product.occasion || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Origin</span><p>{product.details?.origin || product.origin || "None"}</p></div>
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
                                                        {product.craft || product.craftStory || product.story || "None"}
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

                                                    <p className="rap-rental-size-intro">{product.sizeNote || "None"}</p>

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
                                                            {Array.isArray(product.sizeTable) && product.sizeTable.length > 0 ? (
                                                                product.sizeTable.map((row, i) => (
                                                                    <tr key={i} className={row.recommended ? "rap-rental-active-row" : ""}>
                                                                        <td>{row.size || "None"}</td>
                                                                        <td>{row.bust || "None"}</td>
                                                                        <td>{row.waist || "None"}</td>
                                                                        <td>{row.hips || "None"}</td>
                                                                        <td>{row.height || "None"}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td>{selectedSize || "None"}</td>
                                                                    <td>{product.measurements?.bust || "None"}</td>
                                                                    <td>{product.measurements?.waist || "None"}</td>
                                                                    <td>{product.measurements?.hips || "None"}</td>
                                                                    <td>{product.measurements?.length || "None"}</td>
                                                                </tr>
                                                            )}
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
                                                        {Array.isArray(product.care) && product.care.length > 0 ? (
                                                            product.care.map((item, i) => (
                                                                <li key={i}>
                                                                    <span className="rap-rental-dash">—</span>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>
                                                                <span className="rap-rental-dash">—</span>
                                                                <span>None</span>
                                                            </li>
                                                        )}
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
                                                            {Array.isArray(product.shipping) && product.shipping.length > 0 ? (
                                                                product.shipping.map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td>{item.method || "None"}</td>
                                                                        <td>{item.time || "None"}</td>
                                                                        <td className="rap-rental-cost">{item.cost || "None"}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td>{product.deliveryTiming ? "Standard Delivery" : "None"}</td>
                                                                    <td>{product.deliveryTiming || "None"}</td>
                                                                    <td className="rap-rental-cost">None</td>
                                                                </tr>
                                                            )}
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
                                            {Array.isArray(product.colors) && product.colors.length > 0 ? (
                                                product.colors.map((c, i) => (
                                                    <div
                                                        key={i}
                                                        className={`rab-swatches-details ${selectedColor === c.code ? "active" : ""}`}
                                                        onClick={() => {
                                                            setSelectedColor(c.code);
                                                            if (c.images?.[0]) setActiveImage(c.images[0]);
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
                                                ))
                                            ) : (
                                                <span style={{ fontSize: "14px", color: "#666" }}>{product.color || "None"}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* SIZE */}
                                    <div className="rab-section">
                                        <div className="rab-size-header">
                                            <p className="rab-size-label">Select Size</p>
                                            <span className="rab-size-guide">Size Guide & Measurements</span>
                                        </div>
                                        <div className="rab-sizes">
                                            {availableSizes.length > 0 ? (
                                                availableSizes.map((s, i) => (
                                                    <span
                                                        key={i}
                                                        className={selectedSize === s ? "active" : ""}
                                                        onClick={() => handleSize(s)}
                                                    >
                                                        {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="active">{product.prelovedSize || "None"}</span>
                                            )}
                                        </div>
                                        <p className="rab-size-note">
                                            {product.sizeNote || "None"}
                                        </p>
                                    </div>

                                    {/* CTA Section */}

                                    <div className="rab-pdp-cta">

                                        <button className="rab-pdp-btn-primary"
                                            onClick={handleAddToCart}
                                        >
                                            ADD TO BAG — {price}
                                        </button>

                                        <button
                                            className={`rab-pdp-btn-outline ${isWishlisted ? "active" : ""}`}
                                            onClick={handleBuyWishlist}
                                        >
                                            <Heart
                                                style={{
                                                    fill: isWishlisted ? "#B85C38" : "none",
                                                    stroke: isWishlisted ? "#B85C38" : "currentColor",
                                                    color: isWishlisted ? "#B85C38" : "currentColor",
                                                    width: "16px",
                                                    height: "16px",
                                                    display: "inline-block",
                                                    verticalAlign: "middle",
                                                    marginRight: "8px",
                                                    transition: "all 0.2s ease",
                                                }}
                                            />
                                            {isWishlisted ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
                                        </button>

                                        <button className="rab-pdp-btn-whatsapp"
                                            onClick={handleBuyWhatsApp}
                                        >
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
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Designer</span><p>{product.designer || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Fabric</span><p>{product.details?.fabric || product.fabric || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Craft Technique</span><p>{product.details?.technique || product.craftTechnique || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Includes</span><p>{product.details?.includes || product.includes || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Delivery Time</span><p>{product.details?.delivery || product.deliveryTime || "None"}</p></div>
                                                        </div>

                                                        <div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Category</span><p>{product.category || product.subTitle || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Colour</span><p>{product.details?.color || product.color || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Thread</span><p>{product.details?.thread || product.thread || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Occasion</span><p>{product.details?.occasion || product.occasion || "None"}</p></div>
                                                            <div className="rab-pdp-row"><span className="rab-pdp-label">Origin</span><p>{product.details?.origin || product.origin || "None"}</p></div>
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
                                                        {product.craft || product.craftStory || product.story || "None"}
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

                                                    <p className="rab-size-intro">{product.sizeNote || "None"}</p>

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
                                                            {Array.isArray(product.sizeTable) && product.sizeTable.length > 0 ? (
                                                                product.sizeTable.map((row, i) => (
                                                                    <tr key={i} className={row.recommended ? "rab-active-row" : ""}>
                                                                        <td>{row.size || "None"}</td>
                                                                        <td>{row.bust || "None"}</td>
                                                                        <td>{row.waist || "None"}</td>
                                                                        <td>{row.hips || "None"}</td>
                                                                        <td>{row.height || "None"}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td>{selectedSize || "None"}</td>
                                                                    <td>{product.measurements?.bust || "None"}</td>
                                                                    <td>{product.measurements?.waist || "None"}</td>
                                                                    <td>{product.measurements?.hips || "None"}</td>
                                                                    <td>{product.measurements?.length || "None"}</td>
                                                                </tr>
                                                            )}
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
                                                        {Array.isArray(product.care) && product.care.length > 0 ? (
                                                            product.care.map((item, i) => (
                                                                <li key={i}>
                                                                    <span className="rab-dash">—</span>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>
                                                                <span className="rab-dash">—</span>
                                                                <span>None</span>
                                                            </li>
                                                        )}
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
                                                            {Array.isArray(product.shipping) && product.shipping.length > 0 ? (
                                                                product.shipping.map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td>{item.method || "None"}</td>
                                                                        <td>{item.time || "None"}</td>
                                                                        <td className="rab-cost">{item.cost || "None"}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td>{product.deliveryTiming ? "Standard Delivery" : "None"}</td>
                                                                    <td>{product.deliveryTiming || "None"}</td>
                                                                    <td className="rab-cost">None</td>
                                                                </tr>
                                                            )}
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