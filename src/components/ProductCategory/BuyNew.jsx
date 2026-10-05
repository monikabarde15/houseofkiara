import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star, Truck, Shield, User, Box, Plus, X } from "lucide-react";
import { useLocation,useParams,useNavigate } from "react-router-dom";
import "../../styles/productcategory/buy-new.css";
import RelatedProduct from "../RelatedProduct";
import GalleryColumn from "../GalleryColumn";
import { makeProductDetail } from "../ProductList";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import products from "../../data/mainCategoryPageData"; 

export default function BuyNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);

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
        if (!location.state?.product) setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/web-products/${id}`);
        const data = await res.json();

        if (isMounted) {
          if (data.success && data.data) {
            setProduct(makeProductDetail(data.data));
          } else {
            const localFound = products.find(
              (p) => String(p.id) === String(id) || String(p._id) === String(id)
            );
            if (localFound) setProduct(makeProductDetail(localFound));
            else setError("Failed to load product");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        if (isMounted) {
          const localFound = products.find(
            (p) => String(p.id) === String(id) || String(p._id) === String(id)
          );
          if (localFound) setProduct(makeProductDetail(localFound));
          else setError("Failed to load product");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [rating, setRating] = useState(4);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("highlights");
  const [openSections, setOpenSections] = useState(["details"]);

  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const productId = product?._id || product?.id || id;
  const wish = productId ? wishlistItems.includes(productId) : false;

  const displayPrice = product?.buy?.pricing?.price || product?.price || 0;
  const [price, setPrice] = useState(displayPrice);
  const [activeImage, setActiveImage] = useState(product?.images?.[0]);

  useEffect(() => {
    if (product) {
       setPrice(product.buy?.pricing?.price || product.price || 0);
       setActiveImage(product.images?.[0]);
    }
  }, [product]);

  if (loading) return <h2 style={{ padding: 40 }}>Loading...</h2>;
  if (error || !product) return <h2 style={{ padding: 40 }}>{error || "Product not found"}</h2>;

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

  useEffect(() => {
    if (product.colors?.length) {
      setSelectedColor(product.colors[0].code);
      setActiveImage(product.colors[0].images[0]);
    }
  }, [product]);

  const handleSize = (size) => {
    setSelectedSize(size);
    // You can add size-based price adjustments here if backend supports it
    setPrice(displayPrice);
  };

  const handleAddToCart = () => {
    const details = {
      type: "new",
      size: selectedSize || product.sizes?.[0] || "M",
      color: selectedColor || product?.colors?.[0]?.code || "Standard",
      price: price,
    };

    addToCart(product, details);
    setAdded(true);

    // Navigate to cart page
    setTimeout(() => {
      navigate("/cart");
    }, 300);
  };

  // Add Wishlist Function

  const handleAddToWishlist = () => {
    toggleWishlist(productId);
  };

  // Add WhatsApp Function

  const handleWhatsApp = () => {
    const phoneNumber = "919999999999"; // Replace with actual number

    const message = `
Hi,

I am interested in this product:

Product: ${product.title}
Designer: ${product.designer}
Price: ${price}
Size: ${selectedSize || "Not Selected"}
Color: ${selectedColor || "Not Selected"}

Product ID: ${product.id}
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
            <span className="crumb">{product.category}</span>
            <span className="sep">›</span>
            <span className="crumb">{product.designer}</span>
            <span className="sep">›</span>
            <span className="crumb current">
              {product.title} {product.subTitle}
            </span>
          </div>
        </div>

        <Row>

          {/* LEFT */}
          <Col md={6} className="buynew-pdp-left-wrap">
            <GalleryColumn
              images={product.images}
              video={product.video}
              variant="buy"
              productId={productId}
            />
          </Col>

          {/* RIGHT */}
          <Col md={6}>
            

            {/* INFO */}
            <div className="buynew-pdp-info">

              {/* ===== Top Tags (eyebrow + designer + title + desc + rating) ===== */}
              <div className="buynew-eyebrow">
                <span className="buynew-line"></span>

                {/* {product.badges?.includes("BUY NEW") && (
                    <span className="eyebrow-text">BUY NEW</span>
                    )} */}

                <span className="buynew-eyebrow-text">
                  BUY NEW
                </span>

                {/* {product.badges?.includes("NEVER WORN") && (
                    <span className="never-worn-badge">
                      NEVER WORN
                    </span>
                  )} */}

                <span className="buynew-never-worn-badge">
                  NEVER WORN
                </span>

              </div>


              <p className="buynew-designer-name">
                {product.designer}
              </p>

              <h1 className="buynew-product-title">
                {product.title} <em>{product.subTitle}</em>
              </h1>

              <p className="buynew-product-desc">
                {product.description}
              </p>

              <div className="buynew-rating-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={product.rating >= s ? "#c5a46d" : "none"}
                    stroke="#c5a46d"
                    strokeWidth={1.5}
                  />
                ))}

                <span className="buynew-rating-text">{product.rating}.0</span>
                <span className="buynew-reviews">{product.reviews} reviews</span>

                {/* {product.badges?.includes("NEVER WORN") && (
                    <span className="never-worn-soft">
                      NEVER WORN
                    </span>
                  )} */}
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
                  {product.colors?.map((c, i) => (
                    <div
                      key={i}
                      className={`buynew-swatches-details ${selectedColor === c.code ? "active" : ""}`}
                      onClick={() => {
                        console.log(product.colors)
                        setSelectedColor(c.code);
                        setActiveImage(c.images[0]);
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
                  ))}
                </div>
              </div>

              {/* SIZE */}
              <div className="buynew-section">
                <div className="buynew-size-header">
                  <p className="buynew-size-label">Select Size</p>
                  <span className="buynew-size-guide">Size Guide & Measurements</span>
                </div>
                <div className="buynew-sizes">
                  {product.sizeTable?.map((s, i) => (
                    <span
                      key={i}
                      className={`${selectedSize === s.label ? "active" : ""} ${!s.available ? "disabled" : ""}`}
                      onClick={() => {
                        if (!s.available) return;
                        handleSize(s.label);
                      }}
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
                <p className="buynew-size-note">
                  This piece is unstitched. It runs true to size — for a more relaxed flare in the anarkali silhouette, consider sizing up.
                  <span className="buynew-size-help"> Need help choosing?</span>
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
                  className="buynew-pdp-btn-outline"
                  onClick={handleAddToWishlist}
                >
                  {wish ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
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
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Designer</span><p>{product.designer}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Fabric</span><p>{product.details?.fabric}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Craft Technique</span><p>{product.details?.technique}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Includes</span><p>{product.details?.includes}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Delivery Time</span><p>{product.details?.delivery}</p></div>
                        </div>

                        <div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Category</span><p>{product.subTitle}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Colour</span><p>{product.details?.color}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Thread</span><p>{product.details?.thread}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Occasion</span><p>{product.details?.occasion}</p></div>
                          <div className="buynew-pdp-row"><span className="buynew-pdp-label">Origin</span><p>{product.details?.origin}</p></div>
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
                        {product.craft}
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

                      <p className="buynew-size-intro">{product.sizeNote}</p>

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
                          {product.sizeTable?.map((row, i) => (
                            <tr key={i} className={row.recommended ? "buynew-active-row" : ""}>
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
                <div className="buynew-pdp-item">
                  <div className="buynew-pdp-header" onClick={() => toggle("care")}>
                    <span>CARE INSTRUCTIONS</span>

                    <Plus className={`buynew-pdp-icon ${isOpen("care") ? "open" : ""}`} />
                  </div>

                  {isOpen("care") && (
                    <div className="buynew-pdp-content">
                      <ul className="buynew-care-list">
                        {product.care?.map((item, i) => (
                          <li key={i}>
                            <span className="buynew-dash">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
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
                          {product.shipping?.map((item, i) => (
                            <tr key={i}>
                              <td>{item.method}</td>
                              <td>{item.time}</td>
                              <td className="buynew-cost">{item.cost}</td>
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

      {/* ================= RELATED PRODUCT SECTION ================= */}
      <RelatedProduct 
         product={product} 
         currentProductId={id} 
         category={product.subTitle || product.category} 
      />

      
      
    </section>
  );
}