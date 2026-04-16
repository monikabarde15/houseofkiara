// pages/DummyGowns.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { products, makeProductDetail } from "./ProductList";

const DummyGowns = () => {
  const navigate = useNavigate();

  // 👉 only rental products
  const rentalProducts = products.filter((p) => p.tag === "RENT");

  const handleClick = (item) => {
    navigate(`/rental/${item.id}`, {
      state: { product: makeProductDetail(item) },
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Rental Gowns</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {rentalProducts.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            style={{
              width: "220px",
              border: "1px solid #eee",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <img
              src={item.image?.[0]}
              alt={item.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />

            <div style={{ padding: "10px" }}>
              <h4>{item.name}</h4>
              <p>{item.price} / day</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DummyGowns;