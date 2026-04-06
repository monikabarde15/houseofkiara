import React from "react";
import ProductSection from "./ProductList";
import MoreAnarkalis from "./MoreAnarkalis";


export default function Products() {

  const rahulMishraProducts = [
    {
      id: 1,
      designer: "RAHUL MISHRA",
      name: "Blush Zardosi Anarkali",
      price: "₹2,40,000",
      tag: "NEW",
      image: "https://via.placeholder.com/400x500/f2ede6",
    },
    // baaki products...
  ];

  const anarkaliProducts = [
    {
      id: 1,
      designer: "TARUN TAHILIANI",
      name: "Rose Gold Draped Anarkali",
      price: "₹3,60,000",
      tag: "NEW",
      color: "#eee6db",
    },
  ];

  return (
    <>
    <br/>
      <ProductSection
        subtitle="FROM THE SAME HOUSE"
        title="More by"
        highlight="Rahul Mishra"
        isImage={true}
      />
      <MoreAnarkalis
        subtitle="FROM THE SAME HOUSE"
        title="More by"
        highlight="More Anarkali"
        isImage={true}
      />
     
    </>
  );
}