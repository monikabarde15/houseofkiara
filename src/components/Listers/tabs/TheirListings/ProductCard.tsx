// src/components/Listers/tabs/TheirListings/ProductCard.tsx

import React from 'react';
import { inr } from '../../utils/formatter';
import './styles/ProductCard.css';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sku: string;
    designer: string;
    status: string;
    custody: string;
    rentalPrice?: number;
    resalePrice?: number;
    nextAvailable?: string;
    image?: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getStatusChip = (status: string) => {
    const mapping: Record<string, string> = {
      'Live': 's-live',
      'Paused': 's-paused',
      'Draft': 's-draft',
      'Sold': 's-sold',
      'Archived': 's-draft',
    };
    return mapping[status] || 's-draft';
  };

  const getCustodyLabel = (custody: string) => {
    if (custody === 'HOK') return 'AT HOK';
    if (custody === 'Lister') return 'WITH LISTER';
    if (custody === 'Customer') return 'WITH CUSTOMER';
    return 'AT HOK';
  };

  const price = product.rentalPrice 
    ? `${inr(product.rentalPrice)}/4d` 
    : product.resalePrice 
      ? inr(product.resalePrice) 
      : '';

  const availability = product.status === 'Live' 
    ? product.nextAvailable 
      ? `Next available ${product.nextAvailable}` 
      : 'Available now'
    : '';

  return (
    <div className="product-card">
      <div 
        className="product-card-image"
        style={{ 
          backgroundImage: product.image 
            ? `url(${product.image})` 
            : 'linear-gradient(145deg, #2A2420, #0F0B08)'
        }}
      >
        <div className="product-card-scrim" />
      </div>
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-sub">{product.sku} · {product.designer}</div>
        <div className="product-card-price-row">
          <span className="product-card-price">{price || '—'}</span>
          <span className={`s-chip ${getStatusChip(product.status)}`}>
            {product.status}
          </span>
        </div>
        {availability && (
          <div className="product-card-availability">
            Live rentals: {availability}
          </div>
        )}
        <div className="product-card-custody">
          CUSTODY: {getCustodyLabel(product.custody)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;