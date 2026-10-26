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

// Product data
import staticProducts from "../../../data/mainCategoryPageData";
import {
  matchCategory,
  matchGender,
  matchDesigner,
  matchOccasion,
  matchColor,
  matchBudget,
  getPriceNumber,
} from "../utils/filterHelpers";

const MobileCategoryPage = ({ productsData: dynamicProducts }) => {
  const products =
    dynamicProducts && dynamicProducts.length > 0
      ? dynamicProducts
      : staticProducts;
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("recommended");
  const [visibleItems, setVisibleItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    rentType: [],
    gender: [],
    category: [],
    occasion: [],
    designer: [],
    budget: { min: 0, max: Infinity },
    availabilityFrom: "",
    availabilityTo: "",
    size: [],
    colour: []
  });

  // Get URL parameters
  const section = searchParams.get("section");
  const mode = searchParams.get("mode");
  const category = searchParams.get("category");
  const designer = searchParams.get("designer");
  const occasion = searchParams.get("occasion");
  const gender = searchParams.get("gender");

  // ===== PAGE ENTRY -  29.1 =====
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set pre-applied filters based on navigation context ( 14)
  useEffect(() => {
    const preAppliedFilters = {
      rentType: [],
      gender: [],
      category: [],
      occasion: [],
      designer: [],
      budget: { min: 0, max: Infinity },
      availabilityFrom: "",
      availabilityTo: "",
      size: [],
      colour: []
    };

    // Set mode filter based on section
    if (section === "rent" || mode === "rent") preAppliedFilters.rentType = ["rent"];
    else if (section === "preloved" || mode === "preloved") preAppliedFilters.rentType = ["preloved"];
    else if (section === "new" || mode === "new") preAppliedFilters.rentType = ["new"];

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

    setFilters(preAppliedFilters);
  }, [section, mode, category, designer, occasion, gender]);

  // Build heading and breadcrumb
  const activeCategory =
    filters.category.length > 0 ? filters.category[0] : category;
  const activeDesigner =
    filters.designer.length > 0 ? filters.designer[0] : designer;
  const activeOccasion =
    filters.occasion.length > 0 ? filters.occasion[0] : occasion;
  const activeSection =
    filters.rentType.length > 0 ? filters.rentType[0] : section || mode || "rent";

  const heading = buildHeading({
    section: activeSection,
    category: activeCategory,
    designer: activeDesigner,
    occasion: activeOccasion,
  });
  const breadcrumb = buildBreadcrumb({
    section: activeSection,
    category: activeCategory,
    designer: activeDesigner,
    occasion: activeOccasion,
  });

  // ===== FILTERING LOGIC =====
  const isRentActive =
    filters.rentType.includes("rent") ||
    (!filters.rentType.includes("preloved") &&
      !filters.rentType.includes("new") &&
      (section === "rent" || mode === "rent"));
  const isBuyActive =
    filters.rentType.includes("preloved") ||
    filters.rentType.includes("new") ||
    section === "preloved" ||
    section === "new" ||
    mode === "preloved" ||
    mode === "new";

  const filteredProducts = products.filter((product) => {
    // Rent type filter
    if (filters.rentType.length > 0) {
      const match = filters.rentType.some((type) => {
        if (type === "rent") return product.rent;
        if (type === "preloved") return product.preloved;
        if (type === "new") return product.isNew;
        return false;
      });
      if (!match) return false;
    }

    // Gender filter
    if (filters.gender && filters.gender.length > 0) {
      const match = filters.gender.some((g) => matchGender(product.gender, g));
      if (!match) return false;
    }
    
    // Category filter
    if (filters.category.length > 0) {
      const match = filters.category.some((c) => matchCategory(product.category, c));
      if (!match) return false;
    }
    
    // Occasion filter
    if (filters.occasion.length > 0) {
      const match = filters.occasion.some((o) => matchOccasion(product.occasion, o));
      if (!match) return false;
    }
    
    // Designer filter
    if (filters.designer.length > 0) {
      const match = filters.designer.some((d) => matchDesigner(product.designer, d));
      if (!match) return false;
    }
    
    // Budget filter
    if (!matchBudget(product, filters.budget, isRentActive, isBuyActive)) {
      return false;
    }

    // Size filter
    if (filters.size && filters.size.length > 0) {
      const itemSizes = Array.isArray(product.size)
        ? product.size.map((s) => String(s).toUpperCase())
        : [String(product.size || "").toUpperCase()];
      const match = filters.size.some((s) => itemSizes.includes(String(s).toUpperCase()));
      if (!match) return false;
    }

    // Color filter
    if (filters.colour && filters.colour.length > 0) {
      const match = filters.colour.some((c) => matchColor(product.color, c));
      if (!match) return false;
    }
    
    return true;
  });

  // ===== SORTING LOGIC  =====
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = isRentActive
      ? getPriceNumber(a.rentPrice) || getPriceNumber(a.buyPrice)
      : getPriceNumber(a.buyPrice) || getPriceNumber(a.rentPrice);
    const priceB = isRentActive
      ? getPriceNumber(b.rentPrice) || getPriceNumber(b.buyPrice)
      : getPriceNumber(b.buyPrice) || getPriceNumber(b.rentPrice);
    
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
      colour: []
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
        products={products}
      />

    </div>
  );
};

export default MobileCategoryPage;