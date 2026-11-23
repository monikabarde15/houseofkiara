import PageNotFound from "../../pages/PageNotFound";

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
import ProductCoreAccordions, {
  CONDITION_DOT_COLOR,
  CONDITION_LABEL,
  formatRatingValue,
} from "./ProductCoreAccordions";

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
  const grade = product?.condition?.grade
    ? String(product.condition.grade).toLowerCase()
    : "";

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
  if (!product) return <PageNotFound />;


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
            {product.category && (
              <>
                <span className="sep">›</span>
                <span className="crumb">{product.category}</span>
              </>
            )}
            {product.designer && (
              <>
                <span className="sep">›</span>
                <span className="crumb current">{product.designer}</span>
              </>
            )}
            <span className="sep">›</span>
            <span className="crumb current">{product.title || product.name || ""}</span>
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

              {product.designer && (
                <p className="preloved-designer-name">{product.designer}</p>
              )}

              <h1 className="preloved-product-title">
                {product.title || product.name || ""}{" "}
                {product.subTitle ? <em>{product.subTitle}</em> : null}
              </h1>

              {product.description && product.description !== "None" && (
                <p className="preloved-product-desc">{product.description}</p>
              )}

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

                <span className="preloved-rating-text">
                  {formatRatingValue(product.rating)}
                </span>

                <span className="preloved-rating-separator" />

                <span className="preloved-reviews">
                  {product.reviewCount ?? product.reviews ?? 0} reviews
                </span>

                {grade && CONDITION_LABEL[grade] && (
                  <>
                    <span className="preloved-rating-separator" />
                    <span
                      className="preloved-never-worn-soft"
                      style={{
                        "--dot-color": CONDITION_DOT_COLOR[grade] || "#6B7E5A",
                      }}
                    >
                      {CONDITION_LABEL[grade]}
                    </span>
                  </>
                )}

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
              {(product.honestDisclosure || product.disclosure) &&
                String(product.honestDisclosure || product.disclosure).trim() !== "None" && (
                  <div className="preloved-disclosure">
                    <p className="preloved-disclosure-label">
                      HONEST DISCLOSURE
                    </p>
                    <p className="preloved-disclosure-text" style={{ whiteSpace: "pre-line" }}>
                      {product.honestDisclosure || product.disclosure}
                    </p>
                  </div>
                )}


              {/* SIZE BLOCK */}
              {((Array.isArray(product.sizes) && product.sizes.length > 0) ||
                product.prelovedSize) && (
                <div className="preloved-size-block">
                  <p className="preloved-size-label">SIZE</p>
                  <div className="preloved-size-pills">
                    {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                      product.sizes.map((s, idx) => (
                        <span key={idx} className="preloved-size-pill active">
                          {typeof s === "object" ? (s.label || s.size || "") : s}
                        </span>
                      ))
                    ) : (
                      <span className="preloved-size-pill active">
                        {product.prelovedSize}
                      </span>
                    )}
                  </div>
                </div>
              )}


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


              {/* PRELOVED PAGE ACCORDION */}
              <ProductCoreAccordions
                product={product}
                isOpen={isOpen}
                toggle={toggle}
                showConditionGradeAccordion={true}
                includeDisclosureInDetails={false}
                showStoryAlways={true}
                shippingMode="list"
                classes={{
                  accordion: "preloved-accordion",
                  item: "preloved-accordion-item",
                  header: "preloved-accordion-header",
                  icon: "preloved-accordion-icon",
                  content: "preloved-accordion-content",
                  grid: "preloved-details-grid",
                  row: "preloved-details-row",
                  label: "preloved-details-label",
                  craftText: "preloved-story-text",
                  storyNote: "preloved-story-note",
                  sizeIntro: "preloved-size-intro",
                  sizeTable: "preloved-size-table",
                  activeRow: "active-row",
                  careItem: "preloved-care-item",
                  careDash: "preloved-care-dash",
                  shippingItem: "preloved-shipping-item",
                  shippingDash: "preloved-shipping-dash",
                  shippingPackaging: "preloved-shipping-packaging",
                  gradeItem: "preloved-grade-item",
                  gradeHeader: "preloved-grade-header",
                  gradeDot: "preloved-grade-dot",
                  gradeName: "preloved-grade-name",
                  gradeDesc: "preloved-grade-desc",
                }}
              />

            </div>
          </Col>
        </Row>
      </Container>
      <RelatedProduct
        product={product}
        currentProductId={id}
        category={product.category || product.subTitle}
      />
    </section>

  )
}
