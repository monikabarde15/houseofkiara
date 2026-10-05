// src/components/ProductCategory/OnlyRentalDetail.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Heart,
  Star,
  TrendingUp,
  Calendar,
  MessageCircleCheck,
  Shield,
  ArrowRight,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import "../../styles/productcategory/onlyrentaldetail.css";
import { products, makeProductDetail } from "../ProductList";
import RentalCalendar from "../RentalCalendar";
import RelatedProduct from "../RelatedProduct";
import GalleryColumn from "../GalleryColumn";
import useWishlistStore from "../../store/wishlistStore";
import useCartStore from "../../store/cartStore";

const gradeDotColor = {
  pristine: "#6B7E5A",
  excellent: "#C9A96E",
  good: "#B85C38",
};

const gradeLabel = {
  pristine: "PRISTINE CONDITION",
  excellent: "EXCELLENT CONDITION",
  good: "GOOD CONDITION",
};

export default function RentalProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const incomingBooking = location.state?.booking || null; // if coming from cart page

  // ===== PRODUCT STATE & API FETCH =====
  const [product, setProduct] = useState(() => {
    if (location.state?.product) {
      return makeProductDetail(location.state.product);
    }
    const localFound = products.find(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );
    return localFound ? makeProductDetail(localFound) : null;
  });

  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        if (!location.state?.product) {
          setLoading(true);
        }
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/web-products/${id}`);
        const data = await res.json();

        if (isMounted) {
          if (data.success && data.data) {
            const formatted = makeProductDetail(data.data);
            setProduct(formatted);
          } else {
            // fallback to local mock array
            const localFound = products.find(
              (p) =>
                String(p.id) === String(id) || String(p._id) === String(id)
            );
            if (localFound) {
              setProduct(makeProductDetail(localFound));
            } else if (!product) {
              setError("Product not found");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching rental product details:", err);
        if (isMounted && !product) {
          const localFound = products.find(
            (p) =>
              String(p.id) === String(id) || String(p._id) === String(id)
          );
          if (localFound) {
            setProduct(makeProductDetail(localFound));
          } else {
            setError("Failed to load product");
          }
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

  // ===== STORE HOOKS =====
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const productId = String(product?._id || product?.id || id || "");
  const isWishlisted =
    wishlistItems.includes(productId) ||
    (product?._id && wishlistItems.includes(String(product._id))) ||
    (product?.id && wishlistItems.includes(String(product.id)));

  // ===== CALENDAR & DATES =====
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day);
  };

  const [selectedStart, setSelectedStart] = useState(
    incomingBooking?.deliveryDate
      ? parseLocalDate(incomingBooking.deliveryDate)
      : null
  );

  const [selectedEnd, setSelectedEnd] = useState(
    incomingBooking?.returnDate
      ? parseLocalDate(incomingBooking.returnDate)
      : null
  );

  const [selectedWindow, setSelectedWindow] = useState("standard");
  const [selectedSize, setSelectedSize] = useState(incomingBooking?.size || null);
  const [openSections, setOpenSections] = useState(["details"]);

  const isOpen = (key) => openSections.includes(key);

  const toggle = (key) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ===== DERIVED DATA =====
  const rentData = product?.modes?.rent || {
    pricing: {
      pricePerDay: product?.perDayRate || 2500,
      minDays: 3,
      windows: [
        {
          id: "standard",
          label: "Standard Window",
          price: product?.rentalPrice || 5000,
          days: 4,
          tag: "most popular",
        },
        {
          id: "extended",
          label: "Extended Window",
          price: product?.extendedWindowPrice || 8500,
          days: 7,
          tag: "destination weddings",
        },
      ],
    },
    deposit: {
      amount: product?.securityDeposit || 5000,
      refundable: true,
      returnDays: 5,
    },
  };

  // Available Sizes dynamically from API data
  const availableSizes = useMemo(() => {
    if (!product) return [];
    
    // 1. Prioritize sizeTable from the backend API
    if (Array.isArray(product.sizeTable) && product.sizeTable.length > 0) {
      return product.sizeTable.map((s) => ({
        label: (s.size || s.label || s || "").toString().trim().toUpperCase(),
        available: s.available !== undefined ? s.available : true,
      }));
    }
    // 2. Fallbacks for local dummy data
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes.map((s) =>
        typeof s === "string"
          ? { label: s.trim().toUpperCase(), available: true }
          : s
      );
    }
    if (
      Array.isArray(product.modes?.rent?.sizes) &&
      product.modes.rent.sizes.length > 0
    ) {
      return product.modes.rent.sizes.map((s) =>
        typeof s === "string"
          ? { label: s.trim().toUpperCase(), available: true }
          : s
      );
    }
    return [];
  }, [product]);

  // Set default size once sizes are available
  useEffect(() => {
    if (!selectedSize && availableSizes.length > 0) {
      const firstAvailable = availableSizes.find((s) => s.available);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.label);
      }
    }
  }, [availableSizes, selectedSize]);

  // Selected window fallback
  const selectedWindowData =
    rentData?.pricing?.windows?.find((w) => w.id === selectedWindow) ||
    rentData?.pricing?.windows?.[0] || {
      id: "standard",
      label: "Standard Window",
      price: product?.rentalPrice || 5000,
      days: 4,
    };

  const calendarDays =
    selectedStart && selectedEnd
      ? Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24)) + 1
      : null;

  const activeDays = calendarDays || selectedWindowData?.days || 4;

  const currentPrice = useMemo(() => {
    if (!rentData?.pricing) return 0;
    const windowMatch = rentData.pricing.windows?.find((w) => w.days === activeDays);
    if (windowMatch) return windowMatch.price;
    return activeDays * (rentData.pricing.pricePerDay || 0);
  }, [activeDays, rentData]);

  // Condition Grade
  const rawGrade = (
    product?.condition?.grade ||
    product?.condition ||
    "pristine"
  ).toLowerCase();
  const grade = gradeLabel[rawGrade] ? rawGrade : "pristine";

  const formatDate = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const eventDate = selectedStart ? new Date(selectedStart) : new Date();
  if (selectedStart) {
    eventDate.setDate(eventDate.getDate() + 2); // delivery → event
  }

  // ===== ACTIONS =====
  const handleConfirmBooking = () => {
    if (!selectedStart || !selectedEnd) {
      toast.error("Please select rental dates on the calendar");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const price = currentPrice || 0;

    const details = {
      type: "rental",
      size: selectedSize,
      price: price,
      rentalDates: {
        start: formatDate(selectedStart),
        end: formatDate(selectedEnd),
        deliveryDate: formatDate(selectedStart),
        eventDate: formatDate(eventDate),
        returnDate: formatDate(selectedEnd),
        rentalWindowDays:
          Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24)) + 1,
      },
    };

    const added = addToCart(product, details);
    if (added) {
      toast.success("Rental booking added to cart!");
      navigate("/cart");
    }
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    toggleWishlist(productId);
    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Saved to wishlist!");
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const phoneNumber = "919999999999"; // Support number

    const message = `Hi,

I am interested in renting this piece from House of Kaira:

Product: ${product.title || product.name}
Designer: ${product.designer || "Designer"}
Rental Price: ₹${Number(selectedWindowData?.price || 0).toLocaleString("en-IN")} (${selectedWindowData?.days || 4} Days)
Size: ${selectedSize || "Not Selected"}
${
  selectedStart && selectedEnd
    ? `Delivery Date: ${formatDate(selectedStart)}\nReturn Date: ${formatDate(selectedEnd)}\n`
    : ""
}Product ID: ${productId}
`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          backgroundColor: "#F7F4EF",
          color: "#B8A98E",
          fontSize: "16px",
          letterSpacing: "0.05em",
        }}
      >
        Loading Rental Piece...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          padding: "80px 20px",
          textAlign: "center",
          backgroundColor: "#F7F4EF",
          color: "#6b5d52",
        }}
      >
        <h2 style={{ fontFamily: "Cinzel, serif", marginBottom: "16px" }}>
          {error || "Product not found"}
        </h2>
        <button
          onClick={() => navigate("/products")}
          style={{
            background: "#1e1412",
            color: "#fcf9f5",
            border: "none",
            padding: "10px 24px",
            cursor: "pointer",
            fontSize: "13px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Return to Collection
        </button>
      </div>
    );
  }

  // Gallery images array
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? Array.isArray(product.image)
        ? product.image
        : [product.image]
      : [];

  return (
    <>
      <section className="pdp">
        <Container>
          {/* BREADCRUMB */}
          <div className="rental-pdp-breadcrumb-wrapper">
            <div className="rental-breadcrumb">
              <span
                className="rental-crumb"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                Home
              </span>
              <span className="rental-sep">›</span>
              <span
                className="rental-crumb"
                onClick={() => navigate("/products")}
                style={{ cursor: "pointer" }}
              >
                Rent
              </span>
              <span className="rental-sep">›</span>
              <span className="rental-crumb rental-current">
                {product.title || product.name}
              </span>
            </div>
          </div>

          <Row>
            {/* LEFT */}
            <Col md={6} className="rental-pdp-left-wrap">
              <GalleryColumn
                images={galleryImages}
                variant="rent"
              productId={productId}
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

                <p className="rental-designer-name">
                  {product.designer || "Designer"}
                </p>

                <h1 className="rental-product-title">
                  {product.title || product.name}{" "}
                  <em>{product.subTitle || product.category || ""}</em>
                </h1>

                <p className="rental-product-desc">
                  {product.description || product.story || ""}
                </p>

                {/* RATING */}
                <div className="rental-rating-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      className="rental-star-icon"
                      key={s}
                      size={16}
                      fill={(product.rating || 5) >= s ? "#c5a46d" : "none"}
                      stroke="#c5a46d"
                    />
                  ))}

                  <span className="rental-rating-text">
                    {Number(product.rating || 5).toFixed(1)}
                  </span>

                  <span className="rental-rating-separator" />

                  <span className="rental-reviews">
                    {product.reviews || product.reviewCount || 12} reviews
                  </span>

                  <span className="rating-separator" />

                  <span
                    className="rental-never-worn-soft"
                    style={{ "--dot-color": gradeDotColor[grade] || "#6B7E5A" }}
                  >
                    {gradeLabel[grade] || "PRISTINE CONDITION"}
                  </span>

                  <span className="rating-separator" />

                  <span className="rental-rent-count">
                    Rented {product.rentInfo?.rentedCount || product.timesRented || 45}×
                  </span>
                </div>

                {/* Price Block */}
                <div className="rental-price-block">
                  <p className="rental-price-label">Rental Price</p>

                  <h2 className="rental-main-price">
                    ₹{Number(currentPrice || 0).toLocaleString("en-IN")}
                    <span className="onlyduration">
                      {" "}
                      / {activeDays} days
                    </span>
                  </h2>

                  <p className="rental-price-subline">
                    ₹{Number(rentData.pricing?.pricePerDay || 0).toLocaleString("en-IN")} per day • Minimum{" "}
                    {rentData.pricing?.minDays || 3} days
                  </p>

                  {/* WINDOWS */}
                  <div className="rental-rental-window">
                    {(rentData.pricing?.windows || []).map((w) => (
                      <div
                        key={w.id}
                        className={`rental-rental-block ${
                          activeDays === w.days ? "selected" : ""
                        }`}
                        onClick={() => setSelectedWindow(w.id)}
                      >
                        <p className="rental-option-label">{w.label}</p>
                        <h3 className="rental-option-amount">
                          ₹{Number(w.price).toLocaleString("en-IN")}
                        </h3>
                        <p className="rental-option-days">
                          {w.days} days —{" "}
                          {w.tag ||
                            (w.id === "standard"
                              ? "most popular"
                              : "destination weddings")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* DEPOSIT */}
                  <div className="rental-deposit-block">
                    <Shield className="rental-deposit-icon" />
                    <p className="rental-deposit-text">
                      <b className="rental-deposit-bold">
                        ₹{Number(rentData.deposit?.amount || 0).toLocaleString("en-IN")} refundable deposit
                      </b>{" "}
                      required • Returned within 3 -{" "}
                      {rentData.deposit?.returnDays || 5} business days after piece is recieved and inspected
                    </p>
                  </div>
                </div>

                {/* SIZE BLOCK */}
                {availableSizes.length > 0 && (
                  <div className="rental-size-block">
                    {/* HEADER */}
                    <div className="rental-size-header">
                      <span className="rental-size-label">Select Size</span>
                      <span
                        className="rental-size-guide"
                        onClick={() => toggle("size")}
                        style={{ cursor: "pointer" }}
                      >
                        Size & Measurement Guide
                      </span>
                    </div>

                    {/* SIZE PILLS */}
                    <div className="rental-size-options">
                      {availableSizes.map((size, i) => (
                        <button
                          key={i}
                          disabled={!size.available}
                          onClick={() =>
                            size.available && setSelectedSize(size.label)
                          }
                          className={`rental-size-pill ${
                            !size.available ? "unavailable" : ""
                          } ${selectedSize === size.label ? "active" : ""}`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* RENTAL CALENDAR */}
                <RentalCalendar
                  rentData={rentData}
                  selectedStart={selectedStart}
                  setSelectedStart={setSelectedStart}
                  selectedEnd={selectedEnd}
                  setSelectedEnd={setSelectedEnd}
                />

                {/* CTA BUTTONS */}
                <div className="rental-rental-cta">
                  {/* PRIMARY CTA */}
                  <button
                    className={`rental-cta-primary ${
                      selectedStart && selectedEnd ? "active" : "disabled"
                    }`}
                    disabled={!(selectedStart && selectedEnd)}
                    onClick={handleConfirmBooking}
                  >
                    <span className="rental-cta-icon">
                      <Calendar />
                    </span>
                    CONFIRM BOOKING
                  </button>

                  {/* WISHLIST */}
                  <button
                    className="rental-cta-wishlist"
                    onClick={handleAddToWishlist}
                  >
                    <span className="rental-cta-icon">
                      <Heart
                        fill={isWishlisted ? "#c5a46d" : "none"}
                        stroke="#c5a46d"
                      />
                    </span>
                    {isWishlisted ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
                  </button>

                  {/* WHATSAPP */}
                  <button
                    className="rental-cta-whatsapp"
                    onClick={handleWhatsApp}
                  >
                    <span className="rental-cta-icon">
                      <MessageCircleCheck />
                    </span>
                    ASK ON WHATSAPP
                  </button>
                </div>

                {/* TRUST BADGES */}
                <div className="rental-trust-badages">
                  <div className="rental-trust-item">
                    <ArrowRight />
                    <span>DRY-CLEANED & DELIVERED</span>
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

                {/* RENTAL PAGE ACCORDION */}
                <div className="pdp-rental-accordion">
                  {/* ================= PRODUCT DETAILS ================= */}
                  <div className="pdp-rental-item">
                    <div
                      className="pdp-rental-header"
                      onClick={() => toggle("details")}
                    >
                      <span>PRODUCT DETAILS</span>
                      <Plus
                        className={`onlyrental-icon ${
                          isOpen("details") ? "open" : ""
                        }`}
                      />
                    </div>

                    {isOpen("details") && (
                      <div className="rental-pdp-content">
                        <div className="rental-pdp-grid">
                          <div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Designer</span>
                              <p>{product.designer || "Designer"}</p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Fabric</span>
                              <p>
                                {product.details?.fabric ||
                                  product.material ||
                                  "Pure Georgette & Silk"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">
                                Craft Technique
                              </span>
                              <p>
                                {product.details?.technique ||
                                  product.technique ||
                                  "Handcrafted Chikankari & Zardozi"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Includes</span>
                              <p>
                                {product.details?.includes ||
                                  product.setIncludes ||
                                  "Full Garment Set + Protective Bag"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">
                                Delivery Time
                              </span>
                              <p>
                                {product.details?.delivery ||
                                  product.deliveryTiming ||
                                  "Dispatched 2 days before rental"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Category</span>
                              <p>
                                {product.subTitle ||
                                  product.category ||
                                  "Anarkali Set"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Colour</span>
                              <p>
                                {product.details?.color ||
                                  product.color ||
                                  "Ivory & Antique Gold"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Thread</span>
                              <p>
                                {product.details?.thread ||
                                  product.threadWork ||
                                  "Silk & Antique Gold Bullion Wire"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Occasion</span>
                              <p>
                                {product.details?.occasion ||
                                  product.occasion ||
                                  "Sangeet, Reception & Weddings"}
                              </p>
                            </div>
                            <div className="rental-pdp-row">
                              <span className="rental-pdp-label">Origin</span>
                              <p>
                                {product.details?.origin ||
                                  product.origin ||
                                  "Lucknow, India"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================= THE CRAFT ================= */}
                  <div className="pdp-rental-item">
                    <div
                      className="pdp-rental-header"
                      onClick={() => toggle("craft")}
                    >
                      <span>THE CRAFT</span>
                      <Plus
                        className={`onlyrental-icon ${
                          isOpen("craft") ? "open" : ""
                        }`}
                      />
                    </div>

                    {isOpen("craft") && (
                      <div className="rental-pdp-content">
                        <p className="rental-craft-text">
                          {product.craft ||
                            product.story ||
                            `Each piece in the House of Kaira rental archive begins as an exclusive conversation between master designer and artisan karigars. Handcrafted over weeks in artisanal ateliers, every motif is meticulously stitched to perfection.`}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ================= SIZE & FIT ================= */}
                  <div className="pdp-rental-item">
                    <div
                      className="pdp-rental-header"
                      onClick={() => toggle("size")}
                    >
                      <span>SIZE & FIT</span>
                      <Plus
                        className={`onlyrental-icon ${
                          isOpen("size") ? "open" : ""
                        }`}
                      />
                    </div>

                    {isOpen("size") && (
                      <div className="rental-pdp-content">
                        <p className="rental-size-intro">
                          {product.sizeNote ||
                            product.sizeGuide ||
                            "This piece fits true to standard Indian couture sizing. Please refer to measurements below before confirming your dates."}
                        </p>

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
                            {(product.sizeTable && product.sizeTable.length > 0
                              ? product.sizeTable
                              : [
                                  {
                                    size: "XS",
                                    bust: '32"',
                                    waist: '26"',
                                    hips: '35"',
                                    height: "5'2\" - 5'6\"",
                                  },
                                  {
                                    size: "S",
                                    bust: '34"',
                                    waist: '28"',
                                    hips: '37"',
                                    height: "5'3\" - 5'7\"",
                                  },
                                  {
                                    size: "M",
                                    bust: '36"',
                                    waist: '30"',
                                    hips: '39"',
                                    height: "5'4\" - 5'8\"",
                                    recommended: true,
                                  },
                                  {
                                    size: "L",
                                    bust: '38"',
                                    waist: '32"',
                                    hips: '41"',
                                    height: "5'4\" - 5'9\"",
                                  },
                                  {
                                    size: "XL",
                                    bust: '40"',
                                    waist: '34"',
                                    hips: '43"',
                                    height: "5'5\" - 5'10\"",
                                  },
                                ]
                            ).map((row, i) => (
                              <tr
                                key={i}
                                className={
                                  selectedSize === (row.size || row.label)
                                    ? "rental-active-row"
                                    : ""
                                }
                              >
                                <td>{row.size || row.label}</td>
                                <td>{row.bust || '36"'}</td>
                                <td>{row.waist || '30"'}</td>
                                <td>{row.hips || '39"'}</td>
                                <td>{row.height || "Standard"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* ================= CARE ================= */}
                  <div className="pdp-rental-item">
                    <div
                      className="pdp-rental-header"
                      onClick={() => toggle("care")}
                    >
                      <span>CARE INSTRUCTIONS</span>
                      <Plus
                        className={`onlyrental-icon ${
                          isOpen("care") ? "open" : ""
                        }`}
                      />
                    </div>

                    {isOpen("care") && (
                      <div className="rental-pdp-content">
                        <ul className="rental-care-list">
                          {(Array.isArray(product.care) && product.care.length > 0
                            ? product.care
                            : [
                                "Professional dry clean only before and after rental.",
                                "Do not iron directly over zardozi bullion threadwork or embellishments.",
                                "Store in provided HOK garment sleeve when not in use.",
                              ]
                          ).map((item, i) => (
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
                    <div
                      className="pdp-rental-header"
                      onClick={() => toggle("shipping")}
                    >
                      <span>SHIPPING & DELIVERY</span>
                      <Plus
                        className={`onlyrental-icon ${
                          isOpen("shipping") ? "open" : ""
                        }`}
                      />
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
                            {(Array.isArray(product.shipping) &&
                            product.shipping.length > 0
                              ? product.shipping
                              : [
                                  {
                                    method: "Insured White-Glove Courier",
                                    time: "Delivered 1-2 days before start date",
                                    cost: "Complimentary",
                                  },
                                  {
                                    method: "Prepaid Return Pickup",
                                    time: "Scheduled next morning after end date",
                                    cost: "Included in booking",
                                  },
                                ]
                            ).map((item, i) => (
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

      {/* RELATED PRODUCTS */}
      <RelatedProduct
        product={product}
        currentProductId={productId}
        category={product.subTitle || product.category}
      />
    </>
  );
}