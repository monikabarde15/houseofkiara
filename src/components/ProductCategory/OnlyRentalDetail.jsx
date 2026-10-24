// src\components\OnlyRentalDetail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, TrendingUp, Calendar, MessageCircleCheck, Shield, ArrowRight, X, Plus, Truck } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import "../../styles/productcategory/onlyrentaldetail.css";
import { formatProductDetail, parsePrice } from "../../utils/productNavigation";
import staticProducts from "../../data/mainCategoryPageData";
import RentalCalendar from "../RentalCalendar";
import RelatedProduct from "../RelatedProduct";
import GalleryColumn from "../GalleryColumn";
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


export default function RentalProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const incomingBooking = location.state?.booking || null; // if coming from cart page

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

  // ===== STATES =====
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

  const [activeImage, setActiveImage] = useState(product?.images?.[0]);
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
  const rentPrice =
    parsePrice(product?.rentalPrice) ||
    parsePrice(product?.rentPrice) ||
    parsePrice(product?.modes?.rent?.pricing?.windows?.[0]?.price) ||
    parsePrice(product?.price) ||
    parsePrice(product?.listingPrice) ||
    0;

  const retail =
    parsePrice(product?.originalRetailPrice) ||
    parsePrice(product?.retailPrice) ||
    parsePrice(product?.originalPrice) ||
    parsePrice(product?.modes?.preloved?.pricing?.originalPrice) ||
    parsePrice(product?.modes?.rent?.pricing?.originalRetailPrice) ||
    parsePrice(product?.modes?.rent?.pricing?.retailPrice) ||
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

  // ===== SELECTED WINDOW =====
  const selectedWindowData =
    rentData?.pricing?.windows?.find((w) => w.id === selectedWindow) ||
    rentData?.pricing?.windows?.[0];

  const currentRentPrice = parsePrice(selectedWindowData?.price) || rentPrice;
  const discount =
    retail > currentRentPrice && retail > 0 && currentRentPrice > 0
      ? Math.round(((retail - currentRentPrice) / retail) * 100)
      : 0;

  // for Dot color
  const grade = product?.condition?.grade || "pristine";

  if (loading) return <div style={{ padding: 60, textAlign: "center", fontFamily: "Cinzel, serif" }}>Loading rental details...</div>;
  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const eventDate = new Date(selectedStart);
  eventDate.setDate(eventDate.getDate() + 2); // delivery → event


  // Function to handle confirm booking
  const handleConfirmBooking = () => {
    if (!selectedStart || !selectedEnd) return;

    const rentalWindowDays =
      Math.ceil((selectedEnd - selectedStart) / (1000 * 60 * 60 * 24)) + 1;

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


  // Function to handle save to wishlist 
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

  // Function to connect to the whatsapp

  const handleWhatsApp = () => {
    const phoneNumber = "919999999999"; // Replace with your WhatsApp number

    const message = `
Hi,

I am interested in renting this product.

Product: ${product.title}
Designer: ${product.designer}
Rental Price: ₹${selectedWindowData?.price}
Rental Duration: ${selectedWindowData?.days} Days
Size: ${selectedSize || "Not Selected"}

${selectedStart && selectedEnd
        ? `
Delivery Date: ${formatDate(selectedStart)}
Return Date: ${formatDate(selectedEnd)}
`
        : ""
      }

Product ID: ${product.id}
`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
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
              <span className="rental-crumb">{product.category || "None"}</span>
              <span className="rental-sep">›</span>
              <span className="rental-crumb rental-current">
                {product.title || product.name || "None"}
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
                productId={product.id || product.productId || id}
                product={product}
              />

            </Col>

            {/* RIGHT */}
            <Col md={6}>
              <div className="rental-pdp-info">

                <div className="rental-eyebrow-strip">
                  <span className="rental-eyebrow-line"></span>
                  <span className="rental-eyebrow-text">Rental Piece</span>
                </div>

                <p className="rental-designer-name">{product.designer || ""}</p>

                <h1 className="rental-product-title">
                  {product.title || product.name || ""} <em>{product.subTitle || ""}</em>
                </h1>

                {product.description && product.description !== "None" && (
                  <p className="rental-product-desc">{product.description}</p>
                )}

                {/* RATING */}
                <div className="rental-rating-row">

                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      className="rental-star-icon"
                      key={s}
                      size={16}
                      fill={(product.rating || 0) >= s ? "#c5a46d" : "none"}
                      stroke="#c5a46d"
                    />
                  ))}

                  <span className="rental-rating-text">{(product.rating || 0)}.0</span>

                  <span className="rental-rating-separator" />

                  <span className="rental-reviews">{product.reviews || product.reviewCount || 0} reviews</span>

                  <span className="rating-separator" />

                  <span
                    className="rental-never-worn-soft"
                    style={{ "--dot-color": gradeDotColor[grade] || "#6B7E5A" }}
                  >
                    {gradeLabel[grade] || "AUTHENTIC PIECE"}
                  </span>

                  <span className="rating-separator" />

                  <span className="rental-rent-count">
                    Rented {product.rentInfo?.rentedCount || product.timesRented || 0}×
                  </span>

                </div>

                {/* Price Block */}
                <div className="rental-price-block">

                  <p className="rental-price-label">Rental Price</p>

                  <div className="rental-price-header-row">
                    <h2 className="rental-main-price">
                      ₹{Number(selectedWindowData?.price || rentPrice || 0).toLocaleString("en-IN")}
                      <span className="onlyduration">
                        {" "}
                        / {selectedWindowData?.days || 4} days
                      </span>
                    </h2>

                    {retail > 0 && (
                      <div className="rental-savings-wrap">
                        <span className="rental-retail-struck">
                          retail ₹{Number(retail).toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                          <span className="rental-save-badge">
                            Save {discount}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="rental-price-subline">
                    ₹{Number(rentData?.pricing?.pricePerDay || 0).toLocaleString("en-IN")} per day • Minimum{" "}
                    {rentData?.pricing?.minDays || 3} days
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
                    {availableSizes.length > 0 ? (
                      availableSizes.map((size, i) => (
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
                      ))
                    ) : (
                      <span className="rental-size-pill">None</span>
                    )}
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
                  <button
                    className={`rental-cta-wishlist ${isWishlisted ? "active" : ""}`}
                    onClick={handleAddToWishlist}
                  >
                    <span className="rental-cta-icon">
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
                  <button className="rental-cta-whatsapp"
                  onClick={handleWhatsApp}
                  >
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
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Designer</span><p>{product.designer || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Fabric</span><p>{product.details?.fabric || product.material || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Craft Technique</span><p>{product.details?.technique || product.technique || product.embellishments || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Includes</span><p>{product.details?.includes || product.setIncludes || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Delivery Time</span><p>{product.details?.delivery || product.delivery || "None"}</p></div>
                          </div>

                          <div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Category</span><p>{product.category || product.subTitle || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Colour</span><p>{product.details?.color || product.color || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Thread</span><p>{product.details?.thread || product.threadWork || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Occasion</span><p>{product.details?.occasion || product.occasion || "None"}</p></div>
                            <div className="rental-pdp-row"><span className="rental-pdp-label">Origin</span><p>{product.details?.origin || product.origin || "None"}</p></div>
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
                          {product.craft || product.story || product.description || "None"}
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

                        {product.sizeNote || product.sizeGuide ? (
                          <p className="rental-size-intro">{product.sizeNote || product.sizeGuide}</p>
                        ) : null}

                        {product.sizeTable && product.sizeTable.length > 0 ? (
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
                              {product.sizeTable.map((row, i) => (
                                <tr key={i} className={row.recommended ? "rental-active-row" : ""}>
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
                          <table className="rental-size-table">
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
                              <tr className="rental-active-row">
                                <td>{product.sizes?.[0] || "Standard"}</td>
                                <td>{product.measurements.bust || "-"}</td>
                                <td>{product.measurements.waist || "-"}</td>
                                <td>{product.measurements.hips || "-"}</td>
                                <td>{product.measurements.length || "-"}</td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (!product.sizeNote && !product.sizeGuide) ? (
                          <p className="rental-size-intro" style={{ margin: 0 }}>None</p>
                        ) : null}

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
                          {Array.isArray(product.care) && product.care.length > 0 ? (
                            product.care.map((item, i) => (
                              <li key={i}>
                                <span className="rental-dash">—</span>
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
                  <div className="pdp-rental-item">
                    <div className="pdp-rental-header" onClick={() => toggle("shipping")}>
                      <span>SHIPPING & DELIVERY</span>

                      <Plus className={`onlyrental-icon ${isOpen("shipping") ? "open" : ""}`} />
                    </div>

                    {isOpen("shipping") && (
                      <div className="rental-pdp-content">

                        {Array.isArray(product.shipping) && product.shipping.length > 0 ? (
                          <table className="rental-shipping-table">
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
                                  <td className="rental-cost">{item.cost || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="rental-shipping-item">None</p>
                        )}

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