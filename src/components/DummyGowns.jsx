import React from "react";
import { useNavigate } from "react-router-dom";
import { products, makeProductDetail } from "./ProductList";

const DummyGowns = () => {
  const navigate = useNavigate();

  // 👉 just pick ONE product
  const item = products[0];
  const product = makeProductDetail(item);

  return (
    <>

      <h2>Dummy Gown (Test Page)</h2>
      <div style={{ padding: "40px", display: "flex" }}>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "20px",
            width: "300px",
          }}
        >
          {/* IMAGE */}
          <img
            src={item.image?.[0]}
            alt={item.name}
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />

          {/* NAME */}
          <h3 style={{ marginTop: "10px" }}>{item.name}</h3>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              onClick={() =>
                navigate(`/rentalandpreloved/${item.id}`, {
                  state: { product },
                })
              }
            >
              Rental + Preloved
            </button>
            <button
              onClick={() =>
                navigate(`/rentalandbuy/${item.id}`, {
                  state: { product },
                })
              }
            >
              Rental + Buy
            </button>

            <button
              onClick={() =>
                navigate(`/onlyrental/${item.id}`, {
                  state: { product },
                })
              }
            >
              Only Rental
            </button>

            <button
              onClick={() =>
                navigate(`/preloved/${item.id}`, {
                  state: { product },
                })
              }
            >
              Preloved
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
          </div>
        </div>
        {/* -------------------- */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "20px",
            width: "300px",
          }}
        >
          {/* IMAGE */}
          <img
            src={item.image?.[0]}
            alt={item.name}
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />

          {/* NAME */}
          <h3 style={{ marginTop: "10px" }}>{item.name}</h3>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button
              onClick={() =>
                navigate(`/list-your-piece/`, {
                  state: { product },
                })
              }
            >
              LYP MAIN
            </button>
            {/* <button
              onClick={() =>
                navigate(`/cart/`, {
                  state: { product },
                })
              }
            >
              CART
            </button> */}

          </div>
        </div>
      </div>
    </>
  );
};

export default DummyGowns;