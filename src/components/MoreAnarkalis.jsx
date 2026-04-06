import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/product-list.css";

/* ================= DATA ================= */
const products = [
  {
    id: 1,
    designer: "RAHUL MISHRA",
    name: "Sharon Said Ombre Pink Elegant Evening Dress with Cape Sleeve Criss Cross Halter Backless Women's Party Gowns SS309 Customized",
    price: "₹2,40,000",
    tag: "RENT",
     colors: [
  {
    code: "#3c487b",
    images: [
      "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
    ]
  },
  {
    code: "#5860a4",
    images: [
      "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg"
    ]
  }
],
    image: [
      "https://i.pinimg.com/736x/50/f6/76/50f676ea2edb3ff2d3bf09187d3c7025.jpg",
      "https://i.pinimg.com/736x/23/5c/71/235c712d349a1893fbfd259dd1cf5651.jpg",
      "https://www.yoyocamp.com/cdn/shop/files/S81397aeec3cf46d3ba4b0d7f053d9db6V.webp?v=1770617117&width=1200"
    ],

    // 🔥 UNIQUE DATA
    craft: `
    Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
    This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

    The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

    Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
    `,
        sizeNote: `
    This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
    Please refer to the size guide below and check your measurements carefully before ordering. 
    For any sizing queries, reach out to us on WhatsApp before placing your order.
    `,
    sizeTable: [
      { size: "XS", bust: '30"', waist: '24"', hips: '32"', height: '5\'0"–5\'3"' },
      { size: "S", bust: '32"', waist: '26"', hips: '34"', height: '5\'2"–5\'5"' },
      { size: "M", bust: '34"', waist: '28"', hips: '36"', height: '5\'4"–5\'7"', recommended: true },
      { size: "L", bust: '36"', waist: '30"', hips: '38"', height: '5\'5"–5\'8"' },
      { size: "XL", bust: '38"', waist: '32"', hips: '40"', height: '5\'6"–5\'9"' }
    ],
    care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs."
    ],
        shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      { method: "Same-day (Indore only)", time: "Within 6 hours", cost: "₹299" }
    ],

    details: {
      fabric: "Silk Georgette",
      technique: "Zardozi",
      includes: "Anarkali Set",
      delivery: "3–5 days",
      color: "Blush Pink",
      thread: "Gold thread",
      occasion: "Wedding",
      origin: "India"
    }
  },

  {
    id: 2,
    designer: "RAHUL MISHRA",
    name: "Midnight Sharara",
    price: "₹3,10,000",
    tag: "NEW",
    colors: [
      {
        code: "#f5d0c5",
        images: [
          "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
        ]
      },
      {
        code: "#d4a373",
        images: [
          "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg"
        ]
      }
    ],

    image: [
      "https://i.pinimg.com/1200x/c9/36/73/c936736989d58738115b66e0941bee5c.jpg",
      "https://i.pinimg.com/736x/f5/09/a1/f509a12c790483f38db358965ca1d99f.jpg"
    ],

    craft: `
      Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
      This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

      The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

      Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
      `,
          sizeNote: `
      This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
      Please refer to the size guide below and check your measurements carefully before ordering. 
      For any sizing queries, reach out to us on WhatsApp before placing your order.
      `,
      sizeTable: [
        { size: "XS", bust: '30"', waist: '24"', hips: '32"', height: '5\'0"–5\'3"' },
        { size: "S", bust: '32"', waist: '26"', hips: '34"', height: '5\'2"–5\'5"' },
        { size: "M", bust: '34"', waist: '28"', hips: '36"', height: '5\'4"–5\'7"', recommended: true },
        { size: "L", bust: '36"', waist: '30"', hips: '38"', height: '5\'5"–5\'8"' },
        { size: "XL", bust: '38"', waist: '32"', hips: '40"', height: '5\'6"–5\'9"' }
      ],
   care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs."
    ],
      shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      { method: "Same-day (Indore only)", time: "Within 6 hours", cost: "₹299" }
    ],

    details: {
      fabric: "Velvet",
      technique: "Threadwork",
      includes: "Sharara Set",
      delivery: "2–4 days",
      color: "Midnight Blue",
      thread: "Silk thread",
      occasion: "Party",
      origin: "India"
    }
  },
   {
    id: 3,
    designer: "RAHUL MISHRA",
    name: "Rose Pink Off The Shoulder Tulle Appliques Ball Gown ,Formal Prom Dress Evening Dress Y8383",
    price: "₹3,10,000",
    tag: "NEW",
     colors: [
        {
          code: "#f5d0c5",
          images: [
            "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
          ]
        },
        {
          code: "#d4a373",
          images: [
            "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg"
          ]
        }
      ],

    image: [
      "https://www.yoyocamp.com/cdn/shop/files/CL__JN_3_AA____T7NSVVS.jpg?v=1770100661&width=1200",
      "https://www.yoyocamp.com/cdn/shop/files/3_A_E7GZ9_RAS1U_AI1F7M.jpg?v=1770100666&width=1200",
      "https://www.yoyocamp.com/cdn/shop/files/9Z9F_H0_2Y_0_1D_3VULVGC.jpg?v=1770100663&width=1200"
    ],

    craft: `
      Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
      This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

      The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

      Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
      `,
          sizeNote: `
      This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
      Please refer to the size guide below and check your measurements carefully before ordering. 
      For any sizing queries, reach out to us on WhatsApp before placing your order.
      `,
      sizeTable: [
        { size: "XS", bust: '30"', waist: '24"', hips: '32"', height: '5\'0"–5\'3"' },
        { size: "S", bust: '32"', waist: '26"', hips: '34"', height: '5\'2"–5\'5"' },
        { size: "M", bust: '34"', waist: '28"', hips: '36"', height: '5\'4"–5\'7"', recommended: true },
        { size: "L", bust: '36"', waist: '30"', hips: '38"', height: '5\'5"–5\'8"' },
        { size: "XL", bust: '38"', waist: '32"', hips: '40"', height: '5\'6"–5\'9"' }
      ],
   care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs."
    ],
      shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      { method: "Same-day (Indore only)", time: "Within 6 hours", cost: "₹299" }
    ],

    details: {
      fabric: "Velvet",
      technique: "Threadwork",
      includes: "Sharara Set",
      delivery: "2–4 days",
      color: "Midnight Blue",
      thread: "Silk thread",
      occasion: "Party",
      origin: "India"
    }
  },
    {
    id: 4,
    designer: "RAHUL MISHRA",
    name: "Rainbow lehenga",
    price: "₹3,10,000",
    tag: "NEW",
    colors: [
      {
        code: "#f5d0c5",
        images: [
          "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg"
        ]
      },
      {
        code: "#d4a373",
        images: [
          "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg"
        ]
      }
    ],

    image: [
      "https://i.pinimg.com/736x/e6/df/56/e6df567d08ba1b6da45615b7df5ccbf1.jpg",
      "https://i.pinimg.com/736x/ad/f0/f0/adf0f0f22977127a5285b50a4575851c.jpg",
      "https://i.pinimg.com/736x/0a/03/5c/0a035c37c457a63e6fc8283006e874ed.jpg"
    ],

    craft: `
      Each Rahul Mishra anarkali begins as a sketch and becomes a conversation between designer and artisan. 
      This ivory georgette set was worked on by fourteen karigars over the course of nine weeks in a Lucknow atelier — each responsible for a different section of the chikankari floral field. 

      The zardozi border at the hem is done in antique gold bullion wire, hand-coiled and stitched in the shadow-work style native to Uttar Pradesh. No two pieces are identical.

      Styling note: The ivory colour photographs exceptionally under both daylight and warm studio lighting. Pair with uncut diamond or polki jewellery to let the threadwork breathe. The floor-length silhouette is flattering across all heights — the dupatta can be draped or pinned for different looks.
      `,
          sizeNote: `
      This is an unstitched set — it includes the fabric panels for the anarkali, churidar, and dupatta. 
      Please refer to the size guide below and check your measurements carefully before ordering. 
      For any sizing queries, reach out to us on WhatsApp before placing your order.
      `,
      sizeTable: [
        { size: "XS", bust: '30"', waist: '24"', hips: '32"', height: '5\'0"–5\'3"' },
        { size: "S", bust: '32"', waist: '26"', hips: '34"', height: '5\'2"–5\'5"' },
        { size: "M", bust: '34"', waist: '28"', hips: '36"', height: '5\'4"–5\'7"', recommended: true },
        { size: "L", bust: '36"', waist: '30"', hips: '38"', height: '5\'5"–5\'8"' },
        { size: "XL", bust: '38"', waist: '32"', hips: '40"', height: '5\'6"–5\'9"' }
      ],
   care: [
      "Dry clean only. Do not machine wash or hand wash — silk georgette and hand-done threadwork require specialist cleaning.",
      "Store in a cool, dark space in the muslin garment bag provided. Avoid plastic storage — it traps moisture and damages silk fibres.",
      "Do not iron directly on the embroidered surface. Use a pressing cloth and low heat on the reverse only.",
      "Avoid prolonged exposure to direct sunlight, which can yellow ivory silk over time.",
      "If beads or thread snag, do not pull — visit a specialist karigar for repairs."
    ],
      shipping: [
      { method: "Standard delivery", time: "3–5 business days", cost: "Free" },
      { method: "Express delivery", time: "1–2 business days", cost: "₹499" },
      { method: "Same-day (Indore only)", time: "Within 6 hours", cost: "₹299" }
    ],

    details: {
      fabric: "Velvet",
      technique: "Threadwork",
      includes: "Sharara Set",
      delivery: "2–4 days",
      color: "Midnight Blue",
      thread: "Silk thread",
      occasion: "Party",
      origin: "India"
    }
  }
];

/* ================= FINAL HELPER ================= */
export const makeProductDetail = (item) => ({
  ...item,

  title: item.name,
  subTitle: "Anarkali Set",
  category: "Anarkali Set",
  reviews: "3 reviews",

  // ✅ images (fallback)
  images: item.image || [],

  // ✅ colors with mapping (IMPORTANT)
  colors: item.colors?.map((c, i) => {
    // agar object already hai (correct case)
    if (typeof c === "object") return c;

    // agar sirf color code hai (fallback case)
    return {
      code: c,
      images: [item.image?.[i] || item.image?.[0]]
    };
  }) || [],

  sizes: ["S", "M", "L"],
});
/* ================= COMPONENT ================= */
export default function MoreAnarkalis() {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <section className="luxury-products">
      <Container>

        {/* HEADER */}
        <div className="lux-header d-flex justify-content-between align-items-center">
          <div>
            <p className="sub">FROM THE SAME HOUSE</p>
            <h2>
              More by <span>Anarkali</span>
            </h2>
          </div>

          <Link to="/products" className="view-all">
            VIEW ALL →
          </Link>
        </div>

        {/* GRID */}
        <Row className="g-4">
          {products.map((item, index) => (
            <Col lg={3} md={4} sm={6} xs={6} key={item.id}>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >

                <Link
                  to={`/product/${item.id}`}
                  state={{ product: makeProductDetail(item) }}
                  className="text-decoration-none text-dark"
                >
                 <div
                  className="lux-card"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >

                  {/* IMAGE */}
                  <div className="img-box">
                    <img
                      src={
                        hoveredId === item.id
                          ? item.image?.[1] || item.image?.[0]
                          : item.image?.[0]
                      }
                      alt={item.name}
                      loading="lazy"
                    />

                    <span className={`badge-${item.tag.toLowerCase()}`}>
                      {item.tag}
                    </span>

                    <button
                      className="wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Wishlist clicked:", item.id);
                      }}
                    >
                      <Heart size={16} />
                    </button>

                    <div className="overlay"></div>
                  </div>

                  {/* TEXT */}
                  <div className="info">
                    <p className="designer">{item.designer}</p>
                    <h6 className="product-name">{item.name}</h6>
                    <p className="price">{item.price}</p>
                  </div>

                </div>
                </Link>

              </motion.div>

            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}