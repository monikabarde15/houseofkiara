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
        setSelectedColor(product.colors[0].code);
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

  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

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

Product: ${product.title || product.name || "None"}
Designer: ${product.designer || "None"}
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

  return (
    <section className="pdp">
      <Container>

        {/*  BREADCRUMB */}
        <div className="pdp-breadcrumb-wrapper">
          <div className="breadcrumb">
            <span className="crumb">Home</span>
            <span className="sep">›</span>
            <span className="crumb">Buy New</span>
            <span className="sep">›</span>
            <span className="crumb">{product.category || "None"}</span>
            <span className="sep">›</span>
            <span className="crumb">{product.designer || "None"}</span>
            <span className="sep">›</span>
            <span className="crumb current">
              {product.title || product.name || "None"}
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


              <p className="buynew-designer-name">
                {product.designer || "None"}
              </p>

              <h1 className="buynew-product-title">
                {product.title || product.name || "None"} <em>{product.subTitle || ""}</em>
              </h1>

              <p className="buynew-product-desc">
                {product.description || "None"}
              </p>

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

                <span className="buynew-rating-text">{product.rating || 0}.0</span>
                <span className="buynew-reviews">{product.reviews || 0} reviews</span>

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
                  <span className="buynew-strong">Ready to ship</span> · Dispatches in 2–3 days · Standard delivery 4–6 days
                </p>
              </div>

              {/* COLORS */}
              <div className="buynew-color-section">
                <p className="buynew-section-label">SELECT COLOUR</p>
                <div className="buynew-swatches-details">
                  {Array.isArray(product.colors) && product.colors.length > 0 ? (
                    product.colors.map((c, i) => (
                      <div
                        key={i}
                        className={`buynew-swatches-details ${selectedColor === c.code ? "active" : ""}`}
                        onClick={() => {
                          setSelectedColor(c.code);
                          if (c.images?.[0]) setActiveImage(c.images[0]);
                        }}
                      >
                        <div
                          className="buynew-swatch-circle-details"
                          style={{ backgroundColor: c.code }}
                        ></div>
                        <span className="buynew-swatch-name">
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
              <div className="buynew-section">
                <div className="buynew-size-header">
                  <p className="buynew-size-label">Select Size</p>
                  <span className="buynew-size-guide">Size Guide & Measurements</span>
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
                    <span className="active">{product.prelovedSize || "None"}</span>
                  )}
                </div>
                <p className="buynew-size-note">
                  {product.sizeNote || "None"}
                </p>
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

              <div className="buynew-pdp-accordion">

                {/* ================= PRODUCT DETAILS ================= */}
                <div className="buynew-pdp-item">
                  <div className="buynew-pdp-header" onClick={() => toggle("details")}>
                    <span>PRODUCT DETAILS</span>

                    <Plus className={`buynew-pdp-icon ${isOpen("details") ? "open" : ""}`} />
                  </div>

                  {isOpen("details") && (
                    <div className="buynew-pdp-content">
                      <div className="buynew-pdp-grid">

                        <div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Designer</span><p>{product.designer || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Fabric</span><p>{product.details?.fabric || product.fabric || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Craft Technique</span><p>{product.details?.technique || product.craftTechnique || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Includes</span><p>{product.details?.includes || product.includes || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Delivery Time</span><p>{product.details?.delivery || product.deliveryTime || "None"}</p></div>
                        </div>

                        <div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Category</span><p>{product.category || product.subTitle || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Colour</span><p>{product.details?.color || product.color || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Thread</span><p>{product.details?.thread || product.thread || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Occasion</span><p>{product.details?.occasion || product.occasion || "None"}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Origin</span><p>{product.details?.origin || product.origin || "None"}</p></div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* ================= THE CRAFT ================= */}
                <div className="buynew-pdp-item">
                  <div className="buynew-pdp-header" onClick={() => toggle("craft")}>
                    <span>THE CRAFT</span>

                    <Plus className={`buynew-pdp-icon ${isOpen("craft") ? "open" : ""}`} />
                  </div>

                  {isOpen("craft") && (
                    <div className="buynew-pdp-content">
                      <p className="buynew-craft-text">
                        {product.craft || product.craftStory || product.story || "None"}
                      </p>
                    </div>
                  )}
                </div>

                {/* ================= SIZE & FIT ================= */}
                <div className="buynew-pdp-item">
                  <div className="buynew-pdp-header" onClick={() => toggle("size")}>
                    <span>SIZE & FIT</span>

                    <Plus className={`buynew-pdp-icon ${isOpen("size") ? "open" : ""}`} />
                  </div>

                  {isOpen("size") && (
                    <div className="buynew-pdp-content">

                      <p className="buynew-size-intro">{product.sizeNote || "None"}</p>

                      <table className="buynew-size-table">
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
                              <tr key={i} className={row.recommended ? "buynew-active-row" : ""}>
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
                <div className="buynew-pdp-item">
                  <div className="buynew-pdp-header" onClick={() => toggle("care")}>
                    <span>CARE INSTRUCTIONS</span>

                    <Plus className={`buynew-pdp-icon ${isOpen("care") ? "open" : ""}`} />
                  </div>

                  {isOpen("care") && (
                    <div className="buynew-pdp-content">
                      <ul className="buynew-care-list">
                        {Array.isArray(product.care) && product.care.length > 0 ? (
                          product.care.map((item, i) => (
                            <li key={i}>
                              <span className="buynew-dash">—</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li>
                            <span className="buynew-dash">—</span>
                            <span>None</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ================= SHIPPING ================= */}
                <div className="buynew-pdp-item">
                  <div className="buynew-pdp-header" onClick={() => toggle("shipping")}>
                    <span>SHIPPING & DELIVERY</span>

                    <Plus className={`buynew-pdp-icon ${isOpen("shipping") ? "open" : ""}`} />
                  </div>

                  {isOpen("shipping") && (
                    <div className="buynew-pdp-content">

                      <table className="buynew-shipping-table">
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
                                <td className="buynew-cost">{item.cost || "None"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td>{product.deliveryTiming ? "Standard Delivery" : "None"}</td>
                              <td>{product.deliveryTiming || "None"}</td>
                              <td className="buynew-cost">None</td>
                            </tr>
                          )}
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

      {/* ================= RELATED PRODUCT SECTION ================= */}
      <RelatedProduct/>

    </section>
  );
}