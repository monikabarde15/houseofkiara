import React from "react";
import "../styles/featured.css";

const products = [
  {
    tag: "RENT",
    tagClass: "rent",
    name: "Gulabi Silk Bridal Lehenga",
    brand: "SABYASACHI",
    price: "₹12,000 / 4 days",
    image: "https://i.pinimg.com/736x/91/41/da/9141da71db6df4508b2a41f53957969a.jpg"
  },
  {
    tag: "PRELOVED",
    tagClass: "preloved",
    name: "Ivory Embroidered Sherwani",
    brand: "MANISH MALHOTRA",
    price: "₹38,000",
    image: "https://i.pinimg.com/736x/09/0f/48/090f48f8c93ab1203c9d00ade5f38554.jpg"
  },
  {
    tag: "NEW",
    tagClass: "new",
    name: "Midnight Blue Crepe Saree",
    brand: "TARUN TAHILIANI",
    price: "₹68,000",
    image: "https://i.pinimg.com/1200x/18/cf/0f/18cf0f3223c943c6b6fd6206ef63e489.jpg"
  },
  {
    tag: "RENT",
    tagClass: "rent",
    name: "Rose Georgette Anarkali",
    brand: "ANITA DONGRE",
    price: "₹6,500 / 4 days",
    image: "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg"
  }
];

// helper (clean way)
const formatPrice = (price) => {
  const [main, sub] = price.split(" /");
  return { main, sub };
};

export default function Featured() {
  return (
    <section className="featured">
      <div className="container-custom">

        {/* HEADER */}
        <div className="featured-header">
          <div className="heading-block">
            <div className="eyebrow-row">
              <div className="heading-line"></div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
            </div>

            <h2 className="title">
              Featured <em>Pieces</em>
            </h2>
          </div>

          <div className="view-all-f">VIEW ALL →</div>
        </div>

        {/* GRID (IMPORTANT) */}
        <div className="featured-grid">
          {products.map((item, i) => {
            const { main, sub } = formatPrice(item.price);

            return (
              <div className="card" key={i}>
                {/* IMAGE */}
                <div className="image-box">
                  <img src={item.image} alt={item.name} />

                  {/* TAG */}
                  <div className="tags">
                    <span className={`tag ${item.tagClass}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* WISHLIST */}
                  <div className="wishlist">♡</div>
                </div>

                {/* TEXT */}
                <p className="brand">{item.brand}</p>
                <h4 className="name">{item.name}</h4>

                <p className="price">
                  {main} {sub && <span>/ {sub}</span>}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}