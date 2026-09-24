import React from 'react';
import { Search, Plus } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  selectedMode: string;
  onModeChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  onAddProduct: () => void;
}

export function ProductFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  categories,
  selectedMode,
  onModeChange,
  selectedStatus,
  onStatusChange,
  sortOption,
  onSortChange,
  onAddProduct
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A0988E]" />
        <input
          type="text"
          placeholder="Search by name, SKU, designer..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DAD1] rounded-md text-xs text-[#2A241F] placeholder-[#A0988E] outline-none focus:border-[#C7A55C] transition shadow-2xs"
        />
      </div>

      {/* Dropdowns & Add Button */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Modes Filter */}
        <select
          value={selectedMode}
          onChange={(e) => onModeChange(e.target.value)}
          className="py-2 px-3 bg-white border border-[#E2DAD1] rounded-md text-xs text-[#38332D] font-medium outline-none focus:border-[#C7A55C] cursor-pointer hover:bg-[#FAF8F5] transition shadow-2xs"
        >
          <option value="All Modes">All Modes</option>
          <option value="Rental">Rental</option>
          <option value="Preloved">Preloved</option>
          <option value="Buy">Buy</option>
        </select>

        {/* Statuses Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="py-2 px-3 bg-white border border-[#E2DAD1] rounded-md text-xs text-[#38332D] font-medium outline-none focus:border-[#C7A55C] cursor-pointer hover:bg-[#FAF8F5] transition shadow-2xs"
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Live">Live</option>
          <option value="Draft">Draft</option>
          <option value="Paused">Paused</option>
          <option value="Archived">Archived</option>
          <option value="Sold">Sold</option>
        </select>

        {/* Sort Filter */}
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="py-2 px-3 bg-white border border-[#E2DAD1] rounded-md text-xs text-[#38332D] font-medium outline-none focus:border-[#C7A55C] cursor-pointer hover:bg-[#FAF8F5] transition shadow-2xs"
        >
          <option value="Sort: Recent">Sort: Recent</option>
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
          <option value="Name: A-Z">Name: A-Z</option>
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="py-2 px-3 bg-white border border-[#E2DAD1] rounded-md text-xs text-[#38332D] font-medium outline-none focus:border-[#C7A55C] cursor-pointer hover:bg-[#FAF8F5] transition shadow-2xs"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Add Product Button */}
        <button
          onClick={onAddProduct}
          className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#C7A55C] hover:bg-[#B9974B] text-[#2A2118] font-semibold text-xs rounded-md transition cursor-pointer shadow-2xs shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
}