import React from "react";

import "../../styles/shared/ProductBadge.css";

const ProductBadge = ({ type }) => {
  const badgeClass = `hok-product-badge hok-product-badge-${type.toLowerCase()}`;

  return <span className={badgeClass}>{type}</span>;
};

export default ProductBadge;