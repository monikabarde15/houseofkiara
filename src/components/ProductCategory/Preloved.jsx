
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ShoppingBag, Heart, Star,Check, TrendingUp, Calendar, MessageCircleCheck, Shield, ArrowRight, X, Plus, Truck, Gift, ChevronRight, CircleAlert, User, CreditCard } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { formatProductDetail, parsePrice } from "../../utils/productNavigation";
import staticProducts from "../../data/mainCategoryPageData";
import "../../styles/productcategory/preloved.css";
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

  const [selectedWindow, setSelectedWindow] = useState("standard");
  const [openSections, setOpenSections] = useState(["details"]);
  const [isOfferOpen, setIsOfferOpen] = useState(false);

  const isOpen = (key) => openSections.includes(key);

  // for Dot color
  const grade = product?.condition?.grade || "pristine";

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
    price;
  const discount = (retail > price && retail > 0 && price > 0)
    ? Math.round(((retail - price) / retail) * 100)
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

  if (loading) return <div style={{ padding: 60, textAlign: "center", fontFamily: "Cinzel, serif" }}>Loading piece details...</div>;
  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;


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

  const toggle = (key) => {
    setOpenSections((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };


  // function for adding to cart and redirecting to cart
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

  // function to add to the Wishlist
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
            <span className="crumb">{product.category || "None"}</span>
            <span className="sep">›</span>
            <span className="crumb current">{product.designer || "None"}</span>
            <span className="sep">›</span>
            <span className="crumb current">{product.title || product.name || "None"}</span>
          </div>
        </div>

        <Row>

          {/* LEFT */}
          <Col md={6} className="preloved-pdp-left-wrap">

            <GalleryColumn
              images={product.images}
              video={product.video}
              variant="preloved"
              productId={product.id || product.productId || id}
              product={product}
            />
          </Col>

          {/* RIGHT */}
          <Col md={6}>
            <div className="pdp-preloved-info">

              <div className="preloved-eyebrow-strip">
                <span className="preloved-eyebrow-line"></span>
                <span className="preloved-eyebrow-text">PRELOVED PIECE</span>
              </div>

              <p className="preloved-designer-name">{product.designer || "None"}</p>

              <h1 className="preloved-product-title">
                {product.title || product.name || "None"} <em>{product.subTitle || ""}</em>
              </h1>

              <p className="preloved-product-desc">{product.description || "None"}</p>

              {/* RATING */}
              <div className="preloved-rating-row">

                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={(product.rating || 0) >= s ? "#c5a46d" : "none"}
                    stroke="#c5a46d"
                  />
                ))}

                <span className="preloved-rating-text">{(product.rating || 0)}.0</span>

                <span className="preloved-rating-separator" />

                <span className="preloved-reviews">{product.reviews || product.reviewCount || 0} reviews</span>

                <span className="preloved-rating-separator" />

                <span
                  className="preloved-never-worn-soft"
                  style={{ "--dot-color": gradeDotColor[grade] || "#6B7E5A" }}
                >
                  {gradeLabel[grade] || "AUTHENTIC PIECE"}
                </span>

              </div>

              {/* Price Block */}

              <div className="preloved-price-block">

                <p className="preloved-price-label">
                  LISTED RESALE PRICE
                </p>

                <h2 className="preloved-main-price">
                  ₹{Number(price).toLocaleString()}
                </h2>

                <div className="preloved-price-row">
                  {retail > 0 && (
                    <span className="preloved-retail-price">
                      ₹{Number(retail).toLocaleString()} retail
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="preloved-discount-badge">
                      {discount}% OFF RETAIL
                    </span>
                  )}
                </div>

              </div>


              {/* HONEST DISCLOSURE */}
              <div className="preloved-disclosure">

                <p className="preloved-disclosure-label">
                  HONEST DISCLOSURE
                </p>

                <p className="preloved-disclosure-text">
                  {product.disclosure || product.honestDisclosure || "None"}
                </p>

              </div>


              {/* SIZE BLOCK */}

              <div className="preloved-size-block">

                <p className="preloved-size-label">
                  SIZE
                </p>

                <div className="preloved-size-pills">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((s, idx) => (
                      <span key={idx} className="preloved-size-pill active">
                        {typeof s === "object" ? (s.label || s.size || "None") : s}
                      </span>
                    ))
                  ) : product.prelovedSize ? (
                    <span className="preloved-size-pill active">
                      {product.prelovedSize}
                    </span>
                  ) : (
                    <span className="preloved-size-pill">None</span>
                  )}
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
                  className={`preloved-btn outline ${isWishlisted ? "active" : ""}`}
                  onClick={handleAddToWishlist}
                >
                  <span className="preloved-icon">
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
                            <p>{product.designer || "None"}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Fabric</span>
                            <p>{product.details?.fabric || product.material || "None"}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Embroidery</span>
                            <p>{product.details?.technique || product.technique || product.embellishments || "None"}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Includes</span>
                            <p>{product.details?.includes || product.setIncludes || "None"}</p>
                          </div>
                        </div>

                        <div>
                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Category</span>
                            <p>{product.category || product.subTitle || "None"}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Colour</span>
                            <p>{product.details?.color || product.color || "None"}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Occasion</span>
                            <p>{product.details?.occasion || product.occasion || "None"}</p>
                          </div>

                          <div className="preloved-details-row">
                            <span className="preloved-details-label">Origin</span>
                            <p>{product.details?.origin || product.origin || "None"}</p>
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
                      {product.story || product.description || "None"}
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

                    {/* INTRO */}
                    {product.sizeNote || product.sizeGuide ? (
                      <p className="preloved-size-intro">
                        {product.sizeNote || product.sizeGuide}
                      </p>
                    ) : null}

                    {/* TABLE */}
                    {product.sizeTable && product.sizeTable.length > 0 ? (
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
                      <table className="preloved-size-table">
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
                      <p className="preloved-size-intro" style={{ margin: 0 }}>None</p>
                    ) : null}

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

                    {Array.isArray(product.care) && product.care.length > 0 ? (
                      product.care.map((item, i) => (
                        <p key={i} className="preloved-care-item">
                          <span className="preloved-care-dash">—</span>
                          {item}
                        </p>
                      ))
                    ) : (
                      <p className="preloved-care-item">None</p>
                    )}

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
                    {(Array.isArray(product.shipping) && product.shipping.length > 0) || (Array.isArray(product.packaging) && product.packaging.length > 0) ? (
                      <>
                        {Array.isArray(product.shipping) && product.shipping.map((item, i) => (
                          <p key={i} className="preloved-shipping-item">
                            <span className="preloved-shipping-dash">—</span>
                            {typeof item === "string" ? item : `${item.method || "Shipping"}: ${item.time || ""}${item.cost ? `, ${item.cost}` : ""}`}
                          </p>
                        ))}

                        {/* PACKAGING */}
                        {Array.isArray(product.packaging) && product.packaging.map((text, i) => (
                          <p key={i} className="preloved-shipping-packaging">
                            {text}
                          </p>
                        ))}
                      </>
                    ) : (
                      <p className="preloved-shipping-item">None</p>
                    )}

                  </div>
                )}

              </div>



            </div>
          </Col>
        </Row>
      </Container>
      <RelatedProduct />
    </section>

  )
}
