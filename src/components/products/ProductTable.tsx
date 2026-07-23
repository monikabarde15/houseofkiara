// src/components/products/ProductTable.tsx

import React from 'react';
import { Edit } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
}

export function ProductTable({ products, loading, onEdit }: ProductTableProps) {
  if (loading) {
    return (
      <div className="px-5 py-12 text-center text-stone-400">
        Loading products from API...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-5 py-12 text-center text-stone-400">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-stone-50 text-stone-400 font-sans uppercase font-bold text-[10px] border-b border-stone-150 tracking-wider">
            <th className="px-5 py-3.5">Asset</th>
            <th className="px-5 py-3.5">Product Name</th>
            <th className="px-5 py-3.5">Designer</th>
            <th className="px-5 py-3.5">Modes</th>
            <th className="px-5 py-3.5">Rates / Prices</th>
            <th className="px-5 py-3.5">Condition</th>
            <th className="px-5 py-3.5">Calendar Status</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-stone-600 font-sans">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-[#fcf9f5] transition">
              <td className="px-5 py-3">
                <img 
                  src={p.images[0]} 
                  alt={p.name} 
                  className="h-10 w-10 object-cover rounded-md border border-stone-150" 
                />
              </td>
              <td className="px-5 py-3 font-bold text-stone-850 max-w-[180px] truncate">
                {p.name}
              </td>
              <td className="px-5 py-3 font-semibold text-[#c5a880]">
                {p.designer}
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-1">
                  {p.listingModes.map(m => (
                    <span 
                      key={m} 
                      className="px-1.5 py-0.2 rounded bg-stone-50 border border-stone-200 text-[8px] uppercase tracking-wider font-bold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3">
                {p.rentalPrice > 0 ? (
                  <div className="font-semibold text-stone-800">
                    ₹{p.rentalPrice.toLocaleString('en-IN')} / 4d
                    <p className="text-[9px] text-stone-400 font-normal">
                      Deposit: ₹{p.securityDeposit.toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <span className="font-semibold text-stone-800">
                    ₹{p.listingPrice.toLocaleString('en-IN')} Sale
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-stone-500 font-medium">
                {p.condition}
              </td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                  p.availability === 'Available Now'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {p.availability}
                </span>
              </td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                  p.status === 'Live' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-stone-50 text-stone-500 border border-stone-200'
                }`}>
                  {p.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => onEdit(p)}
                  className="px-2.5 py-1.5 border border-stone-200 hover:border-[#c5a880] text-stone-600 hover:text-stone-900 rounded bg-white hover:bg-stone-50 transition cursor-pointer font-semibold inline-flex items-center gap-1 text-[11px]"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}