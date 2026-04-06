import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import "../styles/product-detail.css";

export default function ProductDetail() {
  const location = useLocation();
  const product = location.state?.product;

  const [wish, setWish] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [rating, setRating] = useState(4);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState("highlights");

  const [price, setPrice] = useState(product?.price);
  const [activeImage, setActiveImage] = useState(product?.images?.[0]);

  if (!product) return <h2 style={{ padding: 40 }}>Product not found</h2>;

  useEffect(() => {
    if (product.colors?.length) {
      setSelectedColor(product.colors[0].code);
      setActiveImage(product.colors[0].images[0]);
    }
  }, [product]);

  const handleSize = (size) => {
    setSelectedSize(size);
    let base = Number(product.price.replace(/[^0-9]/g, ""));
    if (size === "M") base += 2000;
    if (size === "L") base += 5000;
    setPrice(`₹${base.toLocaleString()}`);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select size");
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <section className="pdp">
      <Container>

        <div className="breadcrumb">
          Home / {product.category} / {product.designer}
        </div>

        <Row>

          {/* LEFT */}
          <Col md={6} className="pdp-left-wrap">

            <div className="thumbs">
              {product.images?.map((img, i) => (
                <img key={i} src={img} onClick={() => setActiveImage(img)} />
              ))}
            </div>

            <div
              className="main-img"
              style={{ backgroundImage: `url(${activeImage})` }}
            >
              <img src={activeImage} alt="" />

              <div className="wishlist" onClick={() => setWish(!wish)}>
                <Heart size={16} fill={wish ? "black" : "none"} />
              </div>
            </div>

          </Col>

          {/* RIGHT */}
          <Col md={6}>
            <div className="pdp-right-grid">

              {/* INFO */}
              <div className="pdp-info">

                <div className="top-tags">
                  <div className="buy-tag">{product.tag}</div>
                  <span>READY TO SHIP</span>
                </div>

                <p className="designer">{product.designer}</p>

                <h1>
                  {product.title}
                  <span>{product.subTitle}</span>
                </h1>

                <div className="rating">
                  {[1,2,3,4,5].map((s)=>(
                    <Star key={s}
                      size={16}
                      fill={rating>=s?"#f5a623":"none"}
                      onClick={()=>setRating(s)}
                    />
                  ))}
                  <span>• {product.reviews}</span>
                </div>

                <h2 className="price">{price}</h2>

                <div className="delivery-box">
                  Ready to ship • Dispatch in 2–3 days
                </div>

                {/* COLORS */}
                <div className="section">
                  <p>SELECT COLOUR</p>
                  <div className="colors">
                    {product.colors?.map((c,i)=>(
                      <div key={i} className="color-item">
                        <span
                          style={{background:c.code}}
                          className={selectedColor===c.code?"active":""}
                          onClick={()=>{
                            setSelectedColor(c.code);
                            setActiveImage(c.images[0]);
                          }}
                        />
                        <p>{c.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SIZE */}
                <div className="section">
                  <p>SELECT SIZE</p>
                  <div className="sizes">
                    {product.sizes?.map((s,i)=>(
                      <span key={i}
                        className={selectedSize===s?"active":""}
                        onClick={()=>handleSize(s)}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* TABS */}
                <div className="tabs">
                  <span onClick={()=>setTab("highlights")} className={tab==="highlights"?"active":""}>Highlights</span>
                  <span onClick={()=>setTab("about")} className={tab==="about"?"active":""}>About</span>
                  <span onClick={()=>setTab("details")} className={tab==="details"?"active":""}>Details</span>
                </div>

                <div className="tab-content">
                  {tab==="highlights" && (
                    <ul>
                      {Object.entries(product.amazonData?.highlights || {}).map(([k,v])=>(
                        <li key={k}><b>{k}:</b> {v}</li>
                      ))}
                    </ul>
                  )}

                  {tab==="about" && (
                    <ul>
                      {product.amazonData?.about?.map((i,idx)=>(
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  )}

                  {tab==="details" && (
                    <div>
                      {Object.entries(product.amazonData?.additional || {}).map(([k,v])=>(
                        <p key={k}><b>{k}:</b> {v}</p>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* BUY CARD */}
              <div className="buy-card">

                <h2 className="card-price">{price}</h2>

                <div className="qty">
                  <span>Qty:</span>
                  <select>
                    {[1,2,3,4,5].map(q=>(
                      <option key={q}>{q}</option>
                    ))}
                  </select>
                </div>

                <button className="add-btn" onClick={handleAddToCart}>
                  {added ? "✔ ADDED" : "ADD TO BAG"}
                </button>

                <button className="buy-now">BUY NOW</button>
                <button className="wishlist-btn">SAVE TO WISHLIST</button>
                <button className="whatsapp-btn">ASK ON WHATSAPP</button>

              </div>

            </div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}