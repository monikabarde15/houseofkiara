// src/components/products/ProductFilters.tsx

import React from 'react';
import { Search } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export function ProductFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  categories 
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
        <input
          type="text"
          placeholder="Search products by title, designer, category..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded text-xs outline-none focus:border-[#c5a880]"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="p-2 bg-white border border-[#eae1d8] rounded text-xs text-stone-700 font-semibold outline-none focus:border-[#c5a880]"
      >
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}