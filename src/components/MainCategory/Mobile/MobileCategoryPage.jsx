import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "../../../styles/maincategorypage/mobile/mobile-category-page.css";

// Utilities
import { buildBreadcrumb } from "../utils/buildBreadcrumb";
import { buildHeading } from "../utils/buildHeading";

// Components
import MobileBreadcrumb from "./MobileBreadcrumb";
import MobileControlBar from "./MobileControlBar";
import MobileActiveTagsRow from "./MobileActiveTagsRow";
import MobileProductGrid from "./MobileProductGrid";
import MobileContinueBrowsing from "./MobileContinueBrowsing";
import MobileFooter from "./MobileFooter";
import MobileFilterSheet from "./MobileFilterSheet";

// Remove static import
// import productsData from "../../../data/mainCategoryPageData";

const MobileCategoryPage = ({ productsData }) => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("recommended");
  const [visibleItems, setVisibleItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Products state is passed down as a prop (productsData)
  const [filters, setFilters] = useState({
    rentType: [],
    category: [],
    occasion: [],
    designer: [],
    budget: { min: 0, max: Infinity },
    availabilityFrom: "",
    availabilityTo: "",
    size: [],
    colour: [],
    gender: []
  });

  // Get URL parameters
  const section = searchParams.get("section");
  const category = searchParams.get("category");
  const designer = searchParams.get("designer");
  const occasion = searchParams.get("occasion");
  const gender = searchParams.get("gender");
  const size = searchParams.get("size");
  const color = searchParams.get("color");

  // ===== PAGE ENTRY -  29.1 =====
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set pre-applied filters based on navigation context ( 14)
  useEffect(() => {
    const preAppliedFilters = {
      rentType: [],
      category: [],
      occasion: [],
      designer: [],
      budget: { min: 0, max: Infinity },
      availabilityFrom: "",
      availabilityTo: "",
      size: [],
      colour: [],
      gender: []
    };

    // Set mode filter based on section
    if (section === "rent") preAppliedFilters.rentType = ["rent"];
    else if (section === "preloved") preAppliedFilters.rentType = ["preloved"];
    else if (section === "new") preAppliedFilters.rentType = ["new"];

    // Set category filter
    if (category) preAppliedFilters.category = [category];

    // Set designer filter
    if (designer) preAppliedFilters.designer = [designer];

    // Set occasion filter
    if (occasion) preAppliedFilters.occasion = [occasion];

    // Set gender filter
    if (gender) {
      preAppliedFilters.gender = [gender];
    }
    
    // Set size filter
    if (size) {
      preAppliedFilters.size = [size];
    }
    
    // Set color filter
    if (color) {
      preAppliedFilters.colour = [color];
    }

    setFilters(preAppliedFilters);
  }, [section, category, designer, occasion, gender, size, color]);

  // Build heading and breadcrumb
  const heading = buildHeading({ section, category, designer, occasion });
  const breadcrumb = buildBreadcrumb({ section, category, designer, occasion });

  // ===== FILTERING LOGIC =====
  const filteredProducts = (productsData || []).filter((product) => {
    // Rent type filter
    if (filters.rentType.length > 0) {
      const match = filters.rentType.some(type => {
        if (type === "rent") return product.rent;
        if (type === "preloved") return product.preloved;
        if (type === "new") return product.isNew;
        return false;
      });
      if (!match) return false;
    }
    
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(product.category)) return false;
    
    // Occasion filter
    if (filters.occasion.length > 0 && !filters.occasion.includes(product.occasion)) return false;
    
    // Designer filter
    if (filters.designer.length > 0 && !filters.designer.includes(product.designer)) return false;

    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      const itemGender = product.gender ? product.gender.toLowerCase() : "";
      const match = filters.gender.some(g => g.toLowerCase() === itemGender);
      if (!match) return false;
    }
    
    // Size filter
    if (filters.size && filters.size.length > 0) {
      const itemSizes = product.size || [];
      const match = filters.size.some((s) =>
        itemSizes.some((is) => is && typeof is === 'string' && is.trim().toLowerCase() === s.trim().toLowerCase())
      );
      if (!match) return false;
    }

    // Color filter
    if (filters.colour && filters.colour.length > 0) {
      const itemColors = product.color || [];
      const match = filters.colour.some((c) =>
        itemColors.some((ic) => ic.toLowerCase() === c.toLowerCase())
      );
      if (!match) return false;
    }
    
    // Budget filter
    const price = product.buyPrice ? parseInt(product.buyPrice.replace(/,/g, "")) : 0;
    if (price < filters.budget.min || (filters.budget.max !== Infinity && price > filters.budget.max)) return false;
    
    return true;
  });

  // ===== SORTING LOGIC  =====
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.buyPrice ? parseInt(a.buyPrice.replace(/,/g, "")) : 0;
    const priceB = b.buyPrice ? parseInt(b.buyPrice.replace(/,/g, "")) : 0;
    
    switch (sortBy) {
      case "low":
        return priceA - priceB;
      case "high":
        return priceB - priceA;
      case "newest":
        return b.id - a.id;
      case "recommended":
      default:
        return 0;
    }
  });

  // ===== PAGINATION =====
  const visibleProducts = sortedProducts.slice(0, visibleItems);
  const hasMore = visibleItems < sortedProducts.length;

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleItems(6);
  }, [filters, sortBy]);

  // ===== LOAD MORE =====
  const handleLoadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleItems(prev => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  // ===== FILTER INTERACTIONS  =====
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handleFilterApply = () => {
    setIsFilterOpen(false);
  };

  // Remove individual filter tag
  const handleRemoveTag = (tagToRemove) => {
    if (tagToRemove === "Rent") setFilters(prev => ({ ...prev, rentType: [] }));
    else if (tagToRemove === "Preloved") setFilters(prev => ({ ...prev, rentType: [] }));
    else if (tagToRemove === "New") setFilters(prev => ({ ...prev, rentType: [] }));
    else if (filters.category.includes(tagToRemove)) {
      setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== tagToRemove) }));
    }
    else if (filters.occasion.includes(tagToRemove)) {
      setFilters(prev => ({ ...prev, occasion: prev.occasion.filter(o => o !== tagToRemove) }));
    }
    else if (filters.designer.includes(tagToRemove)) {
      setFilters(prev => ({ ...prev, designer: prev.designer.filter(d => d !== tagToRemove) }));
    }
    else if (filters.gender && filters.gender.includes(tagToRemove)) {
      setFilters(prev => ({ ...prev, gender: prev.gender.filter(g => g !== tagToRemove) }));
    }
    else if (filters.size && filters.size.includes(tagToRemove)) {
      setFilters(prev => ({ ...prev, size: prev.size.filter(s => s !== tagToRemove) }));
    }
    else if (filters.colour && filters.colour.includes(tagToRemove)) {
      setFilters(prev => ({ ...prev, colour: prev.colour.filter(c => c !== tagToRemove) }));
    }
  };

  // Clear all filters
  const handleClearAll = () => {
    setFilters({
      rentType: [],
      category: [],
      occasion: [],
      designer: [],
      budget: { min: 0, max: Infinity },
      availabilityFrom: "",
      availabilityTo: "",
      size: [],
      colour: [],
      gender: []
    });
  };

  // ===== BUILD ACTIVE TAGS FOR DISPLAY =====
  const buildActiveTags = () => {
    const tags = [];
    filters.rentType.forEach(type => {
      if (type === "rent") tags.push("Rent");
      else if (type === "preloved") tags.push("Preloved");
      else if (type === "new") tags.push("New");
    });
    filters.category.forEach(cat => tags.push(cat));
    filters.occasion.forEach(occ => tags.push(occ));
    filters.designer.forEach(des => tags.push(des));
    if (filters.gender) filters.gender.forEach(gen => tags.push(gen));
    if (filters.size) filters.size.forEach(s => tags.push(s));
    if (filters.colour) filters.colour.forEach(c => tags.push(c));
    return tags;
  };

  const activeTags = buildActiveTags();

  // ===== WISHLIST TOGGLE -  29.5 =====
  const handleWishlistToggle = (productId, isWishlisted) => {
    // API call to add/remove from wishlist
    console.log(`Product ${productId} wishlisted: ${isWishlisted}`);
  };

  return (
    <div className="mob-category-page">
      
      <MobileBreadcrumb parent={breadcrumb.parent} current={breadcrumb.current} />

      <div className="mob-heading-zone">
        <h1 className="mob-heading-zone__title">
          {heading.title} <em>{heading.highlight}</em>
        </h1>
        <p className="mob-heading-zone__count">
          Showing {visibleProducts.length} of {sortedProducts.length} pieces
        </p>
      </div>

      <div className="mob-control-bar-wrapper">
        <MobileControlBar 
          onFilterClick={handleFilterClick}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <MobileActiveTagsRow 
        activeTags={activeTags}
        onRemoveTag={handleRemoveTag}
        onClearAll={handleClearAll}
      />

      <MobileProductGrid 
        products={visibleProducts}
        onWishlistToggle={handleWishlistToggle}
      />

      <MobileContinueBrowsing 
        onClick={handleLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
      />

      {/* <MobileFooter /> */}

      <MobileFilterSheet 
        isOpen={isFilterOpen}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
        filters={filters}
        setFilters={setFilters}
      />

    </div>
  );
};

export default MobileCategoryPage;