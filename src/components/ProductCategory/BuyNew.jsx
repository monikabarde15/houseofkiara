import PageNotFound from "../../pages/PageNotFound";
import { openSizeGuide } from "../../utils/sizeGuide";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, Truck, Shield, User, Box, Plus, X } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../../styles/productcategory/buy-new.css";
import RelatedProduct from "../RelatedProduct";
import GalleryColumn from "../GalleryColumn";
import { formatProductDetail, parsePrice } from "../../utils/productNavigation"; 
import staticProducts from "../../data/mainCategoryPageData";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore"; 
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import ProductCoreAccordions, { formatRatingValue } from "./ProductCoreAccordions";

export default function BuyNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Try from state first
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
          const data = await res.json();
          if (data && data.success && data.data && isMounted) {
            const formatted = formatProductDetail(data.data);
            setProduct(formatted);
            if (formatted.images?.length > 0) {
              setActiveImage(formatted.images[0]);
            }
            const numP = parsePrice(formatted.listingPrice) || parsePrice(formatted.buyPrice) || parsePrice(formatted.price);
            setPrice(`₹${numP.toLocaleString()}`);
            setLoading(false);
            return;
          }
        }
        const staticItem = staticProducts?.find(
          (sp) => String(sp.id) === String(id) || String(sp.productId) === String(id)
        );
        if (staticItem && isMounted) {
          const formatted = formatProductDetail(staticItem);
          setProduct(formatted);
          if (formatted.images?.length > 0) {
            setActiveImage(formatted.images[0]);
          }
          const numP = parsePrice(formatted.listingPrice) || parsePrice(formatted.buyPrice) || parsePrice(formatted.price);
          setPrice(`₹${numP.toLocaleString()}`);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        const staticItem = staticProducts?.find(
          (sp) => String(sp.id) === String(id) || String(sp.productId) === String(id)
        );
        if (staticItem && isMounted) {
          const formatted = formatProductDetail(staticItem);
          setProduct(formatted);
          const numP = parsePrice(formatted.listingPrice) || parsePrice(formatted.buyPrice) || parsePrice(formatted.price);
          setPrice(`₹${numP.toLocaleString()}`);
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
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [rating, setRating] = useState(4);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("highlights");
  const [openSections, setOpenSections] = useState(["details"]);

  const [price, setPrice] = useState(() => {
    const numP = parsePrice(product?.listingPrice) || parsePrice(product?.buyPrice) || parsePrice(product?.price);
    return `₹${numP.toLocaleString()}`;
  });
  const [activeImage, setActiveImage] = useState(product?.images?.[0]);

  useEffect(() => {
    if (product) {
      if (product.colors?.length) {
        setSelectedColor(
          product.colors[0].code ||
            product.colors[0].hex ||
            product.colors[0].name,
        );
        if (product.colors[0].images?.[0]) {
          setActiveImage(product.colors[0].images[0]);
        }
      }
      const numP = product.listingPrice || product.price || 0;
      if (numP > 0) {
        setPrice(`₹${Number(numP).toLocaleString()}`);
      }
      if (!activeImage && product.images?.length) {
        setActiveImage(product.images[0]);
      }
    }
  }, [product]);

  if (loading && !product) {
    return <h2 style={{ padding: 40 }}>Loading product...</h2>;
  }

  if (!product) return <PageNotFound />;

  const toggle = (key) => {
    setOpenSections((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const isOpen = (key) => openSections.includes(key);

  const availableSizes = Array.isArray(product.sizes)
    ? product.sizes.map((s) => (typeof s === "object" ? s.size || s.label : s))
    : [];

  const handleSize = (size) => {
    setSelectedSize(size);
  };

  // Function to add item in cart 
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

    setAdded(true);

    // Navigate to cart page
    setTimeout(() => {
      navigate("/cart");
    }, 300);
  };

  // Add Wishlist Function
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

  // Add WhatsApp Function
  const handleWhatsApp = () => {
    const phoneNumber = "919999999999"; // Replace with actual number

    const message = `
Hi,

I am interested in this product:

Product: ${product.title || product.name || ""}
Designer: ${product.designer || ""}
Price: ${price}
Size: ${selectedSize || "Not Selected"}
Color: ${selectedColor || "Not Selected"}

Product ID: ${product.id || product._id || ""}
`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const buySwatches = (Array.isArray(product.colors) ? product.colors : []).filter(
    (c) => c && (c.code || c.hex || c.name),
  );
  const resolvedSizeNote =
    product.sizeGuide && product.sizeGuide !== "None"
      ? product.sizeGuide
      : product.sizeNote && product.sizeNote !== "None"
        ? product.sizeNote
        : "";

  return (
    <section className="pdp">
      <Container>

        {/*  BREADCRUMB */}
        <div className="pdp-breadcrumb-wrapper">
          <div className="breadcrumb">
            <span className="crumb">Home</span>
            <span className="sep">›</span>
            <span className="crumb">Buy New</span>
            {product.category && (
              <>
                <span className="sep">›</span>
                <span className="crumb">{product.category}</span>
              </>
            )}
            {product.designer && (
              <>
                <span className="sep">›</span>
                <span className="crumb">{product.designer}</span>
              </>
            )}
            <span className="sep">›</span>
            <span className="crumb current">
              {product.title || product.name || ""}
            </span>
          </div>
        </div>

        <Row>

          {/* LEFT */}
          <Col md={6} className="buynew-pdp-left-wrap">
            <GalleryColumn
              images={product.images && product.images.length > 0 ? product.images : [activeImage]}
              video={product.video}
              variant="buy"
              productId={product.id || product.productId || id}
              product={product}
            />
          </Col>

          {/* RIGHT */}
          <Col md={6}>

            {/* INFO */}
            <div className="buynew-pdp-info">

              {/* ===== Top Tags (eyebrow + designer + title + desc + rating) ===== */}
              <div className="buynew-eyebrow">
                <span className="buynew-line"></span>

                <span className="buynew-eyebrow-text">
                  BUY NEW
                </span>

                <span className="buynew-never-worn-badge">
                  NEVER WORN
                </span>

              </div>


              {product.designer && (
                <p className="buynew-designer-name">
                  {product.designer}
                </p>
              )}

              <h1 className="buynew-product-title">
                {product.title || product.name || ""}{" "}
                {product.subTitle ? <em>{product.subTitle}</em> : null}
              </h1>

              {product.description && product.description !== "None" && (
                <p className="buynew-product-desc">
                  {product.description}
                </p>
              )}

              <div className="buynew-rating-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={(product.rating || 0) >= s ? "#c5a46d" : "none"}
                    stroke="#c5a46d"
                    strokeWidth={1.5}
                  />
                ))}

                <span className="buynew-rating-text">
                  {formatRatingValue(product.rating)}
                </span>
                <span className="buynew-reviews">
                  {product.reviewCount ?? product.reviews ?? 0} reviews
                </span>

                <span className="buynew-never-worn-soft">
                  NEVER WORN
                </span>
              </div>

              {/* ========PRICE BLOCK ====== */}

              <div className="buynew-price-block">

                <p className="buynew-price-label">Price</p>
                <h2 className="buynew-main-price">{price}</h2>
                <p className="buynew-price-meta">
                  Inclusive of all taxes · Free delivery above ₹2,999
                </p>

              </div>

              {/* =========DELIVERY ROW ======= */}

              <div className="buynew-delivery-row">
                <div className="buynew-delivery-icon">
                  <Truck />
                </div>

                <p className="buynew-delivery-text">
                  {product.deliveryTiming ? (
                    product.deliveryTiming
                  ) : (
                    <>
                      <span className="buynew-strong">Ready to ship</span> · Dispatches in 2–3 days · Standard delivery 4–6 days
                    </>
                  )}
                </p>
              </div>

              {/* COLORS */}
              {(buySwatches.length > 0 || (product.color && product.color !== "None")) && (
                <div className="buynew-color-section">
                  <p className="buynew-section-label">SELECT COLOUR</p>
                  <div className="buynew-swatches-details">
                    {buySwatches.length > 0 ? (
                      buySwatches.map((c, i) => {
                        const swatchVal = c.code || c.hex || c.name;
                        return (
                          <div
                            key={i}
                            className={`buynew-swatches-details ${selectedColor === swatchVal ? "active" : ""}`}
                            onClick={() => {
                              setSelectedColor(swatchVal);
                              if (c.images?.[0]) setActiveImage(c.images[0]);
                            }}
                          >
                            {c.code || c.hex ? (
                              <div
                                className="buynew-swatch-circle-details"
                                style={{ backgroundColor: c.code || c.hex }}
                              ></div>
                            ) : null}
                            <span className="buynew-swatch-name">
                              {c.name}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ fontSize: "14px", color: "#666" }}>
                        {product.color}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* SIZE */}
              <div className="buynew-section">
                <div className="buynew-size-header">
                  <p className="buynew-size-label">Select Size</p>
                  <span
                      className="buynew-size-guide"
                      role="button"
                      tabIndex={0}
                      style={{ cursor: "pointer" }}
                      onClick={() => openSizeGuide(setOpenSections)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openSizeGuide(setOpenSections);
                        }
                      }}
                    >
                      Size Guide & Measurements
                    </span>
                </div>
                <div className="buynew-sizes">
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
                    <span className="active">
                      {product.prelovedSize || "Free Size"}
                    </span>
                  )}
                </div>
                {resolvedSizeNote && (
                  <p className="buynew-size-note">{resolvedSizeNote}</p>
                )}
              </div>

              {/* CTA Section */}

              <div className="buynew-pdp-cta">

                <button
                  className="buynew-pdp-btn-primary"
                  onClick={handleAddToCart}
                >
                  {added ? "ADDED!" : `ADD TO BAG — ${price}`}
                </button>

                <button
                  className={`buynew-pdp-btn-outline ${isWishlisted ? "active" : ""}`}
                  onClick={handleAddToWishlist}
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

                <button
                  className="buynew-pdp-btn-whatsapp"
                  onClick={handleWhatsApp}
                >
                  ASK ON WHATSAPP
                </button>

              </div>

              {/* Trust Badages */}

              <div className="buynew-trust-badages">
                <div className="buynew-trust-item">
                  <Shield />
                  <span>Authenticated by HOK</span>
                </div>
                <div className="buynew-trust-item">
                  <Box />
                  <span>Direct from designer</span>
                </div>
                <div className="buynew-trust-item">
                  <Truck />
                  <span>Ready to Ship</span>
                </div>
              </div>

              {/* Consultant */}

              <div className="buynew-consult-box">
                <div className="buynew-consult-left">
                  <div className="buynew-consult-icon">
                    <User />
                  </div>

                  <div className="buynew-consult-text">
                    <p className="buynew-consult-title">
                      Not sure if this is the one?
                    </p>

                    <p className="buynew-consult-subtitle">
                      Our stylist can help you choose the right piece, colour, and size for your occasion.
                    </p>
                  </div>
                </div>

                <button className="buynew-consult-btn">
                  Consult a stylish
                </button>
              </div>

              {/* PRODUCTS PAGE DETAILS */}
              <ProductCoreAccordions
                product={product}
                isOpen={isOpen}
                toggle={toggle}
                includeDisclosureInDetails={true}
                shippingMode="table"
                classes={{
                  accordion: "buynew-pdp-accordion",
                  item: "buynew-pdp-item",
                  header: "buynew-pdp-header",
                  icon: "buynew-pdp-icon",
                  content: "buynew-pdp-content",
                  grid: "buynew-pdp-grid",
                  row: "buynew-pdp-row",
                  label: "buynew-pdp-label",
                  craftText: "buynew-craft-text",
                  storyNote: "buynew-craft-text",
                  sizeIntro: "buynew-size-intro",
                  sizeTable: "buynew-size-table",
                  activeRow: "buynew-active-row",
                  careList: "buynew-care-list",
                  careDash: "buynew-dash",
                  shippingTable: "buynew-shipping-table",
                  shippingCost: "buynew-cost",
                }}
              />
            </div>
          </Col>

        </Row>
      </Container>

      {/* ================= RELATED PRODUCT SECTION ================= */}
      <RelatedProduct
        product={product}
        currentProductId={id}
        category={product.category || product.subTitle}
      />

    </section>
  );
}