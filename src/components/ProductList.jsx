import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/product-list.css";

/* ================= DATA ================= */
export  const products = [
  {
    id: 1,
    designer: "RAHUL MISHRA",
    name: "Blush Zardosi Anarkali",
    price: "₹2,40,000",
     oldPrice: "₹3,00,000",
    tag: "RENT",
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
      "https://i.pinimg.com/736x/1a/c8/5b/1ac85b6db4980e7279c43ebb569afb3c.jpg",
      "https://www.numbersea.com/cdn/shop/files/designer-blue-long-lace-prom-dresses-evening-gowns-with-detachable-train.jpg"
    ],
amazonData: {
  highlights: {
    material: "Jimmy Choo Silk",
    weave: "Woven",
    finish: "Readymade",
    pattern: "Solid",
    care: "Dry Clean Only",
    neck: "U-Neck"
  },

  about: [
    "Wine Embroidered silk lehenga with blouse and dupatta.",
    "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
    "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
    "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
    "Neck: U-Neck | Sleeve: Sleeveless"
  ],

  additional: {
    manufacturer: "Stylum Mart Private Limited, Jaipur",
    weight: "300 g",
    dimensions: "25.5 x 20.3 x 2.5 cm",
    quantity: "1",
    name: "Lehenga Choli"
  },

  style: {
    pattern: "Solid",
    sleeve: "Sleeveless",
    neck: "U-Neck",
    color: "Wine"
  },

  materialCare: {
    material: "Silk",
    fabric: "Silk",
    care: "Dry Clean Only"
  }
},
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
     oldPrice: "₹3,00,000",
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
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck"
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless"
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli"
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine"
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only"
      }
    },
    image: [
      "https://i.pinimg.com/736x/c8/59/fb/c859fbc8a0d67baf213921e88f5c0829.jpg",
      "https://i.pinimg.com/736x/37/07/fd/3707fd1fa71c713110f15b7be7b67fc9.jpg"
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
    name: "Elegant Purple Sari",
    price: "₹3,10,000",
     oldPrice: "₹3,00,000",
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
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck"
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless"
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli"
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine"
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only"
      }
    },
    image: [
      "https://i.pinimg.com/736x/e8/0a/fb/e80afbb97e03195973cb07ccee77e8b4.jpg",
      "https://i.pinimg.com/736x/2c/71/88/2c7188bf10d1e20702c8b4f8f14c8ef2.jpg",
      "https://i.pinimg.com/1200x/8b/b6/06/8bb606de890cb8f52987b32c9f6c7396.jpg"
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
    name: "Elegant Purple Sari",
    price: "₹3,10,000",
     oldPrice: "₹3,00,000",
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
    amazonData: {
      highlights: {
        material: "Jimmy Choo Silk",
        weave: "Woven",
        finish: "Readymade",
        pattern: "Solid",
        care: "Dry Clean Only",
        neck: "U-Neck"
      },

      about: [
        "Wine Embroidered silk lehenga with blouse and dupatta.",
        "Blouse Material: Silk Blend | Bottom: Silk Blend | Dupatta: Crepe",
        "Package: 1 Lehenga + 1 Blouse + 1 Dupatta",
        "Blouse Length: 15 inch | Bottom Length: 42 inch | Dupatta: 2.5m",
        "Neck: U-Neck | Sleeve: Sleeveless"
      ],

      additional: {
        manufacturer: "Stylum Mart Private Limited, Jaipur",
        weight: "300 g",
        dimensions: "25.5 x 20.3 x 2.5 cm",
        quantity: "1",
        name: "Lehenga Choli"
      },

      style: {
        pattern: "Solid",
        sleeve: "Sleeveless",
        neck: "U-Neck",
        color: "Wine"
      },

      materialCare: {
        material: "Silk",
        fabric: "Silk",
        care: "Dry Clean Only"
      }
    },
    image: [
      "https://i.pinimg.com/736x/0b/38/6d/0b386d4ad511c3191adc8e0d8e347652.jpg",
      "https://i.pinimg.com/736x/5c/96/c0/5c96c0d3a91b73a6d6d02d4964332876.jpg",
      "https://i.pinimg.com/736x/72/41/16/7241160a89d381e15af363914b23bd99.jpg"
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

  // ✅ ADD THIS (MISSING DATA FIX)
  description:
    "Pure silk georgette • Ivory & antique gold • Hand-done chikankari & zardozi threadwork",

  rating: 5,
  reviews: 3,

  badges: [
    item.tag === "NEW" ? "BUY NEW" : null,
    "NEVER WORN"
  ].filter(Boolean),

  delivery:
    "Ready to ship • Dispatches in 2–3 days • Standard delivery 4–6 days • Express available",

  note:
    item.sizeNote ||
    "This piece is unstitched. It runs true to size — Need help choosing?",

  features: [
    "AUTHENTICATED",
    "DIRECT FROM DESIGNER",
    "READY TO SHIP"
  ],

  // ✅ IMPORTANT
  images: item.image || [],

  colors:
    item.colors?.map((c, i) => ({
      code: c.code,
      name: c.name || `Color ${i + 1}`,
      images: c.images || [item.image?.[0]]
    })) || [],

  sizes: ["XS", "S", "M", "L", "XL"],

  shipping: item.shipping || [],
  care: item.care || [],
});
/* ================= COMPONENT ================= */
export default function ProductList() {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <section className="luxury-products">
      <Container>

        {/* HEADER */}
        <div className="lux-header">
          <div>
            <p className="sub">FROM THE SAME HOUSE</p>
            <h2>
              More by <span>Rahul Mishra</span>
            </h2>
          </div>

          <Link to="/products" className="p-view-all">
            VIEW ALL
          </Link>
        </div>

        {/* GRID */}
        <Row className="g-4 justify-content-start">
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
                  className="text-decoration-none"
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
    hoveredId === item.id && item.image?.[1]
      ? item.image[1]
      : item.image?.[0]
  }
  alt={item.name}
/>

    <span className={`badge-${item.tag.toLowerCase()}`}>
      {item.tag}
    </span>

   <button
  className="wishlist"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation(); // 🔥 IMPORTANT
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
    <div className="price-wrap">
      <span className="price">{item.price}</span>
      {item.oldPrice && (
        <span className="old-price">{item.oldPrice}</span>
      )}
    </div>
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