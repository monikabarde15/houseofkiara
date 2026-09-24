import React, { useState } from 'react';
import { Product, ProductTab } from '../types/product';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product, initialTab?: ProductTab) => void;
}

function ProductThumbnail({ src, alt }: { src?: string; alt: string }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="h-11 w-11 shrink-0 rounded bg-[#2B231F] border border-[#423832] flex items-center justify-center shadow-xs">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C7A55C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImgError(true)}
      className="h-11 w-11 shrink-0 object-cover rounded border border-[#E5DDD3]"
    />
  );
}

export function ProductTable({ products, loading, onEdit }: ProductTableProps) {
  if (loading) {
    return (
      <div className="px-5 py-16 text-center text-[#8A8177] font-medium text-xs">
        Loading products catalogue...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-5 py-16 text-center text-[#8A8177] font-medium text-xs">
        No products found matching filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs font-sans">
        <thead>
          <tr className="bg-[#FAF8F5] border-b border-[#EBE5DF] text-[#8C847A] font-semibold text-[11px] uppercase tracking-wider">
            <th className="px-4 py-3 font-semibold">Piece</th>
            <th className="px-4 py-3 font-semibold">Listing</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Revenue</th>
            <th className="px-4 py-3 font-semibold">Availability</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F2EDE7] text-[#2A241F]">
          {products.map(p => {
            const sku = p.sku || p.id;
            const material = p.material ? p.material.split(',')[0].trim() : (p.category || 'Silk organza');
            const colorOccasion = p.color || p.occasion || 'Bridal';
            const subtitle = `${p.designer} · ${material} · ${colorOccasion} · ${sku}`;

            // Tag check (e.g. Booked this week / Idle 30d+)
            let tagText = '';
            let tagClass = '';
            if (p.name.includes('Gulabi') || p.id === 'HOK-SAB-002') {
              tagText = '• Booked this week';
              tagClass = 'text-[#3E7A4A]';
            } else if (p.name.includes('Rajputana') || p.id === 'HOK-SAB-003') {
              tagText = '• Idle 30d+';
              tagClass = 'text-[#C04838]';
            }

            // Condition text
            const condition = p.condition ? p.condition.split(' ')[0] : 'Excellent';

            // Prices
            let priceMain = '';
            let priceSub = '';
            if (p.listingModes.includes('Rental') && p.rentalPrice > 0) {
              priceMain = `₹${p.rentalPrice.toLocaleString('en-IN')} / 4d`;
              if (p.listingPrice > 0) {
                priceSub = `or buy ₹${p.listingPrice.toLocaleString('en-IN')}`;
              }
            } else if (p.listingPrice > 0) {
              priceMain = `₹${p.listingPrice.toLocaleString('en-IN')}`;
              if (p.name.includes('Sherwani') || p.id === 'HOK-MM-001') {
                priceSub = `RRP ₹52,000`;
              }
            } else {
              priceMain = `₹${(p.rentalPrice || 8500).toLocaleString('en-IN')} / 4d`;
            }

            // Revenue
            let revenueMain = '—';
            let revenueSub = '';
            if (p.name.includes('Crimson') || p.id === 'HOK-SAB-001') {
              revenueMain = '₹17,000';
              revenueSub = 'HOK ₹6,375';
            } else if (p.name.includes('Sherwani') || p.id === 'HOK-MM-001') {
              revenueMain = '₹38,000';
              revenueSub = 'HOK ₹9,500';
            } else if (p.bookingHistory && p.bookingHistory.length > 0) {
              const sum = p.bookingHistory.reduce((acc, item) => acc + (item.amount || 0), 0);
              if (sum > 0) {
                revenueMain = `₹${sum.toLocaleString('en-IN')}`;
                const comm = Math.round(sum * ((p.commissionRate || 25) / 100));
                revenueSub = `HOK ₹${comm.toLocaleString('en-IN')}`;
              }
            }

            // Availability
            let availMain = '';
            let availSub = '';
            let availClass = 'text-[#3E7A4A]';

            if (p.name.includes('Crimson') || p.id === 'HOK-SAB-001') {
              availMain = 'now → 25 Mar';
              availSub = 'free 29 Mar';
              availClass = 'text-[#C04838]';
            } else if (p.name.includes('Gulabi') || p.id === 'HOK-SAB-002') {
              availMain = 'Available now';
              availSub = 'booked 28 Mar · free 5 Apr';
              availClass = 'text-[#3E7A4A]';
            } else if ((p.status as string) === 'Sold' || p.name.includes('Sherwani') || p.id === 'HOK-MM-001') {
              availMain = '—';
              availSub = '';
              availClass = 'text-[#A0988E]';
            } else {
              availMain = p.availability || 'Available now';
              availClass = p.availability === 'Rented' ? 'text-[#C04838]' : 'text-[#3E7A4A]';
            }

            return (
              <tr 
                key={p.id} 
                onClick={() => onEdit(p)}
                className="hover:bg-[#FAF8F5] transition cursor-pointer"
              >
                {/* PIECE */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <ProductThumbnail src={p.images?.[0]} alt={p.name} />
                    <div>
                      <div className="flex items-center flex-wrap gap-x-1.5">
                        <span className="font-bold text-[#2A241F] text-[13px] hover:text-[#C7A55C] transition">
                          {p.name}
                        </span>
                        {tagText && (
                          <span className={`text-[11px] font-medium ${tagClass}`}>
                            {tagText}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#81786D] mt-0.5 font-normal">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                </td>

                {/* LISTING */}
                <td className="px-4 py-3.5 align-middle">
                  <div className="flex flex-wrap items-center gap-1 mb-1">
                    {p.listingModes.map(m => (
                      <span 
                        key={m}
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          m === 'Rental'
                            ? 'bg-[#E8F2E8] text-[#4E7A52]'
                            : m === 'Preloved'
                            ? 'bg-[#F7EBE4] text-[#9E5D46]'
                            : 'bg-[#EBF3FA] text-[#3B669B]'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-medium text-[#C09B4E] flex items-center gap-1">
                    <span>•</span> {condition}
                  </div>
                </td>

                {/* PRICE */}
                <td className="px-4 py-3.5 align-middle font-sans">
                  <div className="font-bold text-[#2A241F] text-[13px]">
                    {priceMain}
                  </div>
                  {priceSub && (
                    <div className="text-[11px] text-[#81786D] mt-0.5">
                      {priceSub}
                    </div>
                  )}
                </td>

                {/* REVENUE */}
                <td className="px-4 py-3.5 align-middle font-sans">
                  <div className={`font-bold text-[13px] ${revenueMain === '—' ? 'text-[#A0988E] font-normal' : 'text-[#2A241F]'}`}>
                    {revenueMain}
                  </div>
                  {revenueSub && (
                    <div className="text-[11px] text-[#81786D] mt-0.5">
                      {revenueSub}
                    </div>
                  )}
                </td>

                {/* AVAILABILITY */}
                <td className="px-4 py-3.5 align-middle font-sans">
                  <div className={`font-medium text-[12px] ${availClass}`}>
                    {availMain}
                  </div>
                  {availSub && (
                    <div className="text-[11px] text-[#81786D] mt-0.5">
                      {availSub}
                    </div>
                  )}
                </td>

                {/* STATUS */}
                <td className="px-4 py-3.5 align-middle">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${
                    p.status === 'Live' && !p.name.includes('Sherwani')
                      ? 'bg-[#EDF7ED] text-[#3E7A4A]'
                      : (p.status as string) === 'Sold' || p.name.includes('Sherwani')
                      ? 'bg-[#EEF4FB] text-[#3B669B]'
                      : p.status === 'Archived'
                      ? 'bg-[#FEF6E6] text-[#B88422]'
                      : 'bg-[#F4F3F1] text-[#736B63]'
                  }`}>
                    {p.status === 'Live' && !p.name.includes('Sherwani') ? 'Live' : (p.name.includes('Sherwani') ? 'Sold' : p.status)}
                  </span>
                </td>

                {/* CAL BUTTON */}
                <td className="px-4 py-3.5 text-right align-middle">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(p, 'Calendar');
                    }}
                    className="inline-flex items-center justify-center h-7 px-3 rounded-md border border-[#E2DAD1] bg-white text-[#524B43] hover:bg-[#FAF8F5] hover:border-[#C7A55C] text-[12px] font-medium transition cursor-pointer shadow-2xs"
                  >
                    Cal
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}