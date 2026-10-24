import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams , useNavigate, useLocation } from "react-router-dom";
import { Heart, Star, TrendingUp, Gift, User, Calendar, CreditCard, MessageCircleCheck, Shield, CircleAlert, ArrowRight, ShoppingBag, X, Plus, Truck } from "lucide-react";
import { formatProductDetail, parsePrice } from "../../utils/productNavigation";
import staticProducts from "../../data/mainCategoryPageData";
import GalleryColumn from "../GalleryColumn";
import '../../styles/productcategory/rental-and-preloved.css'
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
                // Fallback to static catalog if id is a mock ID (e.g., 1, 2, 3)
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

    const [mode, setMode] = useState("buy");

    useEffect(() => {
        if (product?.modes) {
            setMode(product.modes.rent?.enabled ? "rent" : "buy");
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

    // ===== SELECTED WINDOW =====
    const selectedWindowData =
        rentData?.pricing?.windows?.find((w) => w.id === selectedWindow) ||
        rentData?.pricing?.windows?.[0];

    // for dot color
    const grade = product?.condition?.grade || "pristine";

    // ===============PRELOVED======================//

    // FOR DISCOUNT - 
    const price =
        (typeof product?.preloved?.pricing?.price === "number" && product.preloved.pricing.price > 0
            ? product.preloved.pricing.price
            : parsePrice(product?.listingPrice) || parsePrice(product?.buyPrice) || parsePrice(product?.price)) || 0;
    const retail =
        parsePrice(product?.originalRetailPrice) ||
        parsePrice(product?.originalPrice) ||
        parsePrice(product?.retailPrice) ||
        parsePrice(product?.preloved?.pricing?.originalPrice) ||
        parsePrice(product?.modes?.preloved?.pricing?.originalPrice) ||
        parsePrice(product?.modes?.rent?.pricing?.originalRetailPrice) ||
        price;
    const discount = (retail > price && retail > 0 && price > 0)
        ? Math.round(((retail - price) / retail) * 100)
        : 0;

    const currentRentPrice = parsePrice(selectedWindowData?.price) || rentPrice;
    const rentDiscount =
        retail > currentRentPrice && retail > 0 && currentRentPrice > 0
            ? Math.round(((retail - currentRentPrice) / retail) * 100)
            : 0;

    // MINIMUM AND MAXIMUM OFFER PRICE
    const minOffer = Math.round((price * 0.54) / 5000) * 5000 || 5000;
    const maxOffer = price || 10000;

    const [offer, setOffer] = useState(minOffer);      // number (slider)
    const [inputValue, setInputValue] = useState(minOffer); // (typing)

    useEffect(() => {
        if (price) {
            const min = Math.round((price * 0.54) / 5000) * 5000 || 5000;
            setOffer(min);
            setInputValue(min);
        }
    }, [price]);

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

    // Wishlist Handler
    const handleAddToWishlist = (e) => {
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

    // WhatsApp Handler
    const handleWhatsApp = () => {
        const phoneNumber = "919999999999"; // replace

        const message =
            mode === "rent"
                ? `
Hi,

I am interested in renting this product.

Product: ${product.title}
Designer: ${product.designer}
Rental Price: ₹${selectedWindowData?.price}
Rental Duration: ${selectedWindowData?.days} Days
Size: ${selectedSize || "Not Selected"}

Product ID: ${product.id}
`
                : `
Hi,

I am interested in this preloved piece.

Product: ${product.title}
Designer: ${product.designer}
Price: ₹${price.toLocaleString()}
Condition: ${product.condition?.grade || "N/A"}

Product ID: ${product.id}
`;

        window.open(
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    // Preloved Buy Now Handler
    const handleBuyNow = () => {
        const numericPrice =
            typeof price === "number"
                ? price
                : Number(String(price).replace(/[^\d]/g, "")) ||
                  product.listingPrice ||
                  product.price ||
                  0;

        useCartStore.getState().addToCart(product, {
            type: "preloved",
            size: product.prelovedSize || product.size || "Free Size",
            price: numericPrice,
            quantity: 1,
        });

        navigate("/cart");
    };



    return (
        <section className={`rap-root ${mode === "buy" ? "buy-mode" : "rent-mode"}`}>
            <Container>

                {/* BREADCRUMB */}
                <div className="rap-pdp-breadcrumb-wrapper">
                    <div className="rap-breadcrumb">
                        <span className="rap-crumb">Home</span>
                        <span className="rap-sep">›</span>
                        <span className="rap-crumb">{mode === "rent" ? "Rent" : "Buy Preloved"}</span>
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
                            variant={mode === "rent" ? "rent" : "preloved"}
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
                                        PRELOVED
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
                                                    {rentDiscount > 0 && (
                                                        <span className="rap-rental-save-badge">
                                                            Save {rentDiscount}%
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
                                            className={`rap-rental-cta-primary ${selectedStart && selectedEnd
                                                    ? "active"
                                                    : "disabled"
                                                }`}
                                            disabled={!(selectedStart && selectedEnd)}
                                            onClick={handleConfirmBooking}
                                        >
                                            <span className="rap-rental-cta-icon"><Calendar /></span>
                                            CONFIRM BOOKING
                                        </button>

                                        {/* WISHLIST */}
                                        <button className={`rap-rental-cta-wishlist ${isWishlisted ? "active" : ""}`}
                                            onClick={handleAddToWishlist}
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
                                         onClick={handleWhatsApp}
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
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Fabric</span><p>{product.details?.fabric || product.material || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Craft Technique</span><p>{product.details?.technique || product.technique || product.embellishments || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Includes</span><p>{product.details?.includes || product.setIncludes || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Delivery Time</span><p>{product.details?.delivery || product.delivery || "None"}</p></div>
                                                        </div>

                                                        <div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Category</span><p>{product.category || product.subTitle || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Colour</span><p>{product.details?.color || product.color || "None"}</p></div>
                                                            <div className="rap-rental-pdp-row"><span className="rap-rental-pdp-label">Thread</span><p>{product.details?.thread || product.threadWork || "None"}</p></div>
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
                                                        {product.craft || product.story || product.description || "None"}
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

                                                    {product.sizeNote || product.sizeGuide ? (
                                                        <p className="rap-rental-size-intro">{product.sizeNote || product.sizeGuide}</p>
                                                    ) : null}

                                                    {product.sizeTable && product.sizeTable.length > 0 ? (
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
                                                                {product.sizeTable.map((row, i) => (
                                                                    <tr key={i} className={row.recommended ? "rap-rental-active-row" : ""}>
                                                                        <td>{row.size || "None"}</td>
                                                                        <td>{row.bust || "None"}</td>
                                                                        <td>{row.waist || "None"}</td>
                                                                        <td>{row.hips || "None"}</td>
                                                                        <td>{row.height || "None"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (product.measurements && (product.measurements.bust || product.measurements.waist || product.measurements.hips || product.measurements.length)) ? (
                                                        <table className="rap-rental-size-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Size</th>
                                                                    <th>Bust</th>
                                                                    <th>Waist</th>
                                                                    <th>Hips</th>
                                                                    <th>Length</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr className="rap-rental-active-row">
                                                                    <td>{product.sizes?.[0] || "Standard"}</td>
                                                                    <td>{product.measurements.bust || "-"}</td>
                                                                    <td>{product.measurements.waist || "-"}</td>
                                                                    <td>{product.measurements.hips || "-"}</td>
                                                                    <td>{product.measurements.length || "-"}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    ) : (!product.sizeNote && !product.sizeGuide) ? (
                                                        <p className="rap-rental-size-intro" style={{ margin: 0 }}>None</p>
                                                    ) : null}

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

                                                    {Array.isArray(product.shipping) && product.shipping.length > 0 ? (
                                                        <table className="rap-rental-shipping-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Method</th>
                                                                    <th>Estimated time</th>
                                                                    <th>Cost</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {product.shipping.map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td>{item.method || "Shipping"}</td>
                                                                        <td>{item.time || "-"}</td>
                                                                        <td className="rap-rental-cost">{item.cost || "-"}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="rap-rental-shipping-item">None</p>
                                                    )}

                                                </div>
                                            )}
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* ================= Preloved MODE ================= */}
                            {mode === "buy" && (
                                <div className="rap-buy">



                                    {/* 1. PRICE */}
                                    <div className="rap-preloved-price-block">

                                        <p className="rap-preloved-price-label">
                                            LISTED RESALE PRICE
                                        </p>

                                        <h2 className="rap-preloved-main-price">
                                            ₹{Number(price).toLocaleString()}
                                        </h2>

                                        <div className="rap-preloved-price-row">
                                            {retail > 0 && (
                                                <span className="rap-preloved-retail-price">
                                                    ₹{Number(retail).toLocaleString()} retail
                                                </span>
                                            )}

                                            {discount > 0 && (
                                                <span className="rap-preloved-discount-badge">
                                                    {discount}% OFF RETAIL
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                    {/* 2. DISCLOSURE */}
                                    <div className="rap-preloved-disclosure">

                                        <p className="rap-preloved-disclosure-label">
                                            HONEST DISCLOSURE
                                        </p>

                                        <p className="rap-preloved-disclosure-text">
                                            {product.disclosure || product.honestDisclosure || "None"}
                                        </p>

                                    </div>

                                    {/* 3. SIZE */}
                                    <div className="rap-preloved-size-block">

                                        <p className="rap-preloved-size-label">
                                            SIZE
                                        </p>

                                        <div className="rap-preloved-size-pills">
                                            {product.sizes && product.sizes.length > 0 ? (
                                                product.sizes.map((s, idx) => (
                                                    <span key={idx} className="rap-preloved-size-pill active">
                                                        {typeof s === "object" ? (s.label || s.size || "None") : s}
                                                    </span>
                                                ))
                                            ) : product.prelovedSize ? (
                                                <span className="rap-preloved-size-pill active">
                                                    {product.prelovedSize}
                                                </span>
                                            ) : (
                                                <span className="rap-preloved-size-pill">None</span>
                                            )}
                                        </div>

                                    </div>

                                    {/* 4. CTA */}
                                    <div className="rap-preloved-cta-group">

                                        {/* BUY NOW */}
                                        <button className="rap-preloved-btn primary"
                                        onClick={handleBuyNow}
                                        >
                                            <span className="rap-preloved-icon"><ShoppingBag /></span>
                                            BUY NOW — ₹{price.toLocaleString()}
                                        </button>

                                        {/* WISHLIST */}
                                        <button
                                            className={`rap-preloved-btn outline ${isWishlisted ? "active" : ""}`}
                                            onClick={handleAddToWishlist}
                                        >
                                            <span className="rap-preloved-icon">
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
                                    <div className="rap-preloved-whatsapp-btn"
                                    onClick={handleWhatsApp}
                                    >
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
                                                                <p>{product.designer || "None"}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Fabric</span>
                                                                <p>{product.details?.fabric || product.material || "None"}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Embroidery</span>
                                                                <p>{product.details?.technique || product.technique || product.embellishments || "None"}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Includes</span>
                                                                <p>{product.details?.includes || product.setIncludes || "None"}</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Category</span>
                                                                <p>{product.category || product.subTitle || "None"}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Colour</span>
                                                                <p>{product.details?.color || product.color || "None"}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Occasion</span>
                                                                <p>{product.details?.occasion || product.occasion || "None"}</p>
                                                            </div>

                                                            <div className="rap-preloved-details-row">
                                                                <span className="rap-preloved-details-label">Origin</span>
                                                                <p>{product.details?.origin || product.origin || "None"}</p>
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
                                                    {product.story || product.description || "None"}
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
                                                {product.sizeNote || product.sizeGuide ? (
                                                    <p className="rap-preloved-size-intro">
                                                        {product.sizeNote || product.sizeGuide}
                                                    </p>
                                                ) : null}

                                                {/* TABLE */}
                                                {product.sizeTable && product.sizeTable.length > 0 ? (
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
                                                            {product.sizeTable.map((row, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className={row.recommended ? "active-row" : ""}
                                                                >
                                                                    <td>{row.size || "None"}</td>
                                                                    <td>{row.bust || "None"}</td>
                                                                    <td>{row.waist || "None"}</td>
                                                                    <td>{row.hips || "None"}</td>
                                                                    <td>{row.height || "None"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (product.measurements && (product.measurements.bust || product.measurements.waist || product.measurements.hips || product.measurements.length)) ? (
                                                    <table className="rap-preloved-size-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Size</th>
                                                                <th>Bust</th>
                                                                <th>Waist</th>
                                                                <th>Hips</th>
                                                                <th>Length</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className="active-row">
                                                                <td>{product.sizes?.[0] || product.prelovedSize || "Standard"}</td>
                                                                <td>{product.measurements.bust || "-"}</td>
                                                                <td>{product.measurements.waist || "-"}</td>
                                                                <td>{product.measurements.hips || "-"}</td>
                                                                <td>{product.measurements.length || "-"}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                ) : (!product.sizeNote && !product.sizeGuide) ? (
                                                    <p className="rap-preloved-size-intro" style={{ margin: 0 }}>None</p>
                                                ) : null}

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

                                                {Array.isArray(product.care) && product.care.length > 0 ? (
                                                    product.care.map((item, i) => (
                                                        <p key={i} className="rap-preloved-care-item">
                                                            <span className="rap-preloved-care-dash">—</span>
                                                            {item}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p className="rap-preloved-care-item">None</p>
                                                )}

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
                                                {(Array.isArray(product.shipping) && product.shipping.length > 0) || (Array.isArray(product.packaging) && product.packaging.length > 0) ? (
                                                    <>
                                                        {Array.isArray(product.shipping) && product.shipping.map((item, i) => (
                                                            <p key={i} className="rap-preloved-shipping-item">
                                                                <span className="rap-preloved-shipping-dash">—</span>
                                                                {typeof item === "string" ? item : `${item.method || "Shipping"}: ${item.time || ""}${item.cost ? `, ${item.cost}` : ""}`}
                                                            </p>
                                                        ))}

                                                        {/* PACKAGING */}
                                                        {Array.isArray(product.packaging) && product.packaging.map((text, i) => (
                                                            <p key={i} className="rap-preloved-shipping-packaging">
                                                                {text}
                                                            </p>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <p className="rap-preloved-shipping-item">None</p>
                                                )}

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