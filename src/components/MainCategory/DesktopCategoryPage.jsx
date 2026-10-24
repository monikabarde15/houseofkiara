// src\pages\MainCategoryPage\MainCategoryPage.jsx
import "../../styles/maincategorypage/main-category-page.css";

import { useEffect, useState } from "react";

import Filters from "../../components/MainCategory/Filters";
import ProductCard from "../../components/MainCategory/ProductCard";

import Breadcrumbs from "../../components/MainCategory/Breadcrumbs";
import ListingHeader from "../../components/MainCategory/ListingHeader";
import ActiveFilters from "../../components/MainCategory/ActiveFilters";

import staticProducts from "../../data/mainCategoryPageData";

// For dropdown nav
import { buildHeading } from "../../components/MainCategory/utils/buildHeading"
import { buildBreadcrumb } from "../../components/MainCategory/utils/buildBreadcrumb";
import {
  matchCategory,
  matchGender,
  matchDesigner,
  matchOccasion,
  matchColor,
  matchBudget,
  getPriceNumber,
} from "../../components/MainCategory/utils/filterHelpers";
import { useSearchParams } from "react-router-dom";

function DesktopCategoryPage({ productsData }) {
  const products = (productsData && productsData.length > 0) ? productsData : staticProducts;
  const [filters, setFilters] = useState({
    rentType: [],
    gender: [],
    category: [],
    designer: [],
    occasion: [],
    size: [],
    color: [],
    condition: [],
    budget: {
      min: 0,
      max: Infinity,
    },
  });



  const [sortBy, setSortBy] = useState("recommended");

  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // dropdown nav
  const [searchParams] = useSearchParams();

  const section = searchParams.get("section");
  const mode = searchParams.get("mode");
  const category = searchParams.get("category");
  const designer = searchParams.get("designer");
  const occasion = searchParams.get("occasion");
  const gender = searchParams.get("gender");

  const condition = searchParams.get("condition");

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const activeCategory =
    filters.category.length > 0
      ? filters.category[0]
      : filters.category.length === 0 && category
      ? ""
      : category;
  const activeDesigner =
    filters.designer.length > 0
      ? filters.designer[0]
      : filters.designer.length === 0 && designer
      ? ""
      : designer;
  const activeOccasion =
    filters.occasion.length > 0
      ? filters.occasion[0]
      : filters.occasion.length === 0 && occasion
      ? ""
      : occasion;
  const activeSection =
    filters.rentType.length > 0
      ? filters.rentType[0]
      : filters.rentType.length === 0 && section
      ? ""
      : section || mode || "rent";

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
  useEffect(() => {
    const nextFilters = {
      rentType: [],
      gender: [],
      category: [],
      designer: [],
      occasion: [],
      size: [],
      color: [],
      budget: {
        min: 0,
        max: Infinity,
      },

      
    };

    // if (mode) {
    //   nextFilters.rentType = [mode];
    // }

    if (
      section === "rent" ||
      section === "preloved" ||
      section === "new"
    ) {
      nextFilters.rentType = [section];
    }

    if (gender) {
      nextFilters.gender = [gender];
    }

    if (category) {
      nextFilters.category = [category];
    }

    if (designer) {
      nextFilters.designer = [designer];
    }

    if (occasion) {
      nextFilters.occasion = [occasion];
    }

    if (condition) {
      nextFilters.condition = [condition];
    }

    if (minPrice || maxPrice) {
      nextFilters.budget = {
        min: Number(minPrice) || 0,
        max: maxPrice
          ? Number(maxPrice)
          : Infinity,
      };
    }

    setFilters(nextFilters);

  }, [
    section,
    gender,
    category,
    designer,
    occasion,
    condition,
    minPrice,
  maxPrice,
  ]);

  const mainDesigners = [
    "Sabyasachi",
    "Manish Malhotra",
    "Tarun Tahiliani",
    "Anita Dongre",
    "Ritu Kumar",
    "Rahul Mishra",
  ];

  const getPrice = (price) => {
    if (!price) return 0;

    if (typeof price === "number") return price;

    if (typeof price === "string") {
      return (
        parseInt(price.replace(/,/g, ""), 10) || 0
      );
    }

    return 0;
  };

  // FILTERING

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

  const filteredProducts = products.filter((item) => {
    // DESIGNER
    if (filters.designer.length) {
      const match = filters.designer.some((d) => matchDesigner(item.designer, d));
      if (!match) return false;
    }

    // RENT TYPE
    if (filters.rentType.length) {
      const match = filters.rentType.some((type) => {
        if (type === "rent") return item.rent;
        if (type === "preloved") return item.preloved;
        if (type === "new") return item.isNew;
        return false;
      });
      if (!match) return false;
    }

    // GENDER
    if (filters.gender.length) {
      const match = filters.gender.some((g) => matchGender(item.gender, g));
      if (!match) return false;
    }

    // CATEGORY
    if (filters.category.length) {
      const match = filters.category.some((c) => matchCategory(item.category, c));
      if (!match) return false;
    }

    // OCCASION
    if (filters.occasion.length) {
      const match = filters.occasion.some((o) => matchOccasion(item.occasion, o));
      if (!match) return false;
    }

    // BUDGET
    if (!matchBudget(item, filters.budget, isRentActive, isBuyActive)) {
      return false;
    }

    // SIZE
    if (filters.size.length) {
      const itemSizes = Array.isArray(item.size)
        ? item.size.map((s) => String(s).toUpperCase())
        : [String(item.size || "").toUpperCase()];
      const match = filters.size.some((s) =>
        itemSizes.includes(String(s).toUpperCase())
      );
      if (!match) return false;
    }

    // COLOR
    if (filters.color.length) {
      const match = filters.color.some((c) => matchColor(item.color, c));
      if (!match) return false;
    }

    return true;
  });

  // SORTING

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = isRentActive
      ? getPriceNumber(a.rentPrice) || getPriceNumber(a.buyPrice)
      : getPriceNumber(a.buyPrice) || getPriceNumber(a.rentPrice);

    const priceB = isRentActive
      ? getPriceNumber(b.rentPrice) || getPriceNumber(b.buyPrice)
      : getPriceNumber(b.buyPrice) || getPriceNumber(b.rentPrice);

    const originalA = getPriceNumber(
      a.originalPrice || a.mrp || 0
    );

    const originalB = getPriceNumber(
      b.originalPrice || b.mrp || 0
    );

    const discountA =
      originalA ? ((originalA - priceA) / originalA) * 100 : 0;

    const discountB =
      originalB ? ((originalB - priceB) / originalB) * 100 : 0;

    switch (sortBy) {
      case "low":
        return priceA - priceB;

      case "high":
        return priceB - priceA;

      case "newest":
        return b.id - a.id;

      case "popular":
        return (b.popularity || 0) - (a.popularity || 0);

      case "discount":
        return discountB - discountA;

      case "recommended":
        return (
          (b.popularity || 0) * 0.6 +
          (b.id || 0) * 0.4 -
          ((a.popularity || 0) * 0.6 + (a.id || 0) * 0.4)
        );

      default:
        return 0;
    }
  });

  // PAGINATION

  const totalPages = Math.ceil(
    filteredProducts.length /
    ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const currentProducts =
    sortedProducts.slice(
      startIndex,
      startIndex +
      ITEMS_PER_PAGE
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="clp">

      <Breadcrumbs
        parent={breadcrumb.parent}
        current={breadcrumb.current}
      />

      <div className="clp__container">

        <Filters
          filters={filters}
          setFilters={setFilters}
          products={products}
        />

        <div className="clp__main">

          <ListingHeader
            heading={heading}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalProducts={filteredProducts.length}
          />

          <ActiveFilters
            filters={filters}
            setFilters={setFilters}
          />

          <div className="clp__grid">
            {currentProducts.map(
              (item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                />
              )
            )}
          </div>

          <div className="pagination">

            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev - 1
                )
              }
            >
              ‹
            </button>

            {[...Array(totalPages)].map(
              (_, i) => (
                <button
                  key={i}
                  className={
                    currentPage ===
                      i + 1
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(
                      i + 1
                    )
                  }
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev + 1
                )
              }
            >
              ›
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DesktopCategoryPage;

