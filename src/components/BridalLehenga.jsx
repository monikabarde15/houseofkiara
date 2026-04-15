import "../styles/bridallehenga.css"
import Filters from "./Filters"
import products from "../data/bridalLehengaProducts";
import ProductCard from "./ProductCard";
import { useEffect, useState} from "react";


function BridalLehenga() {

  const [filters, setFilters] = useState({
    rentType: [],
    gender:[],
    category:[],
    designer: [],
    occasion:[],
    size: [],
    color:[],
    budget: {
      min: 0,
      max: Infinity,
    },
  });
  const [sortBy, setSortBy] = useState("recommended");
  
   
  const getPrice = (price) => {
    return parseInt(price?.replace(/,/g, "")) || 0;
  };

  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  
  const mainDesigners = [
    "Sabyasachi",
    "Manish Malhotra",
    "Tarun Tahiliani",
    "Anita Dongre",
    "Ritu Kumar",
    "Rahul Mishra",
  ];

  const filteredProducts = products.filter((item) => {


    // Designer filter logic
    if (filters.designer.length) {

      const isOtherSelected = filters.designer.includes("Other Designers");
      const isExactMatch = filters.designer.includes(item.designer);
      const isOtherMatch =
        isOtherSelected && !mainDesigners.includes(item.designer);

      if (!isExactMatch && !isOtherMatch) {
        return false;
      }
    }

    // Shop by Filter
    if(filters.rentType.length){
      const match = filters.rentType.some((type)=>{
        if (type === "rent") return item.rent;
        if (type === "preloved") return item.preloved;
        if (type == "new") return item.isNew;

        return false;
      })
      if(!match) return false;
    }

    // gender filter
    if (filters.gender.length) {
      if (!filters.gender.includes(item.gender)) {
        return false;
      }
    }

    // CATEGORY FILTER
    if (filters.category.length) {
      if (!filters.category.includes(item.category)) {
        return false;
      }
    }

    // OCCASION FILTER
    if (filters.occasion.length){
      if(!filters.occasion.includes(item.occasion)){
        return false;
      }
    }

    // BUDGET FILTER
    const price = getPrice(item.buyPrice);

    if (
      price < filters.budget.min ||
      price > filters.budget.max
    ) {
      return false;
    }

    // SIZE FILTER

    if (filters.size.length) {
      const match = filters.size.some((s) =>
        item.size?.includes(s)
      );

      if (!match) return false;
    }

    //Color Filter

    if (filters.color.length) {
      const match = filters.color.some((c) =>
        item.color?.includes(c)
      );

      if (!match) return false;
    }

    return true;
  });

  // SORT BY 
  const sortedProducts = [...filteredProducts].sort((a, b) => {

    const priceA = getPrice(a.buyPrice);
    const priceB = getPrice(b.buyPrice);

    switch (sortBy) {

      case "low":
        return priceA - priceB;

      case "high":
        return priceB - priceA;

      case "newest":
        return b.id - a.id; // assuming higher id = newer

      case "popular":
        return (b.popularity || 0) - (a.popularity || 0);

      default:
        return 0; // recommended
    }
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // SLICE PRODUCTS
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(()=>{
    setCurrentPage(1)
  }, [filters])

  return (
    <div className="clp">

      {/* Breadcrumb heading */}
      <div className="breadcrumb">
        <span className="link">Home</span>
        <span className="separator">›</span>

        <span className="link">Rent</span>
        <span className="separator">›</span>

        <span className="current">Bridal Lehengas</span>
      </div>

      <div className="clp__container">

        {/* Filter section */}
        
          <Filters filters={filters} setFilters={setFilters} />

        {/* Main container Section */}
        <div className="clp__main">

          {/* Header  */}
          <div className="clp__header">

            {/* LEFT */}
            <div className="clp__headerLeft">
              <h1 className="clp__title">
                Bridal <em>Lehengas</em>
              </h1>
              <p className="clp__count">
                Showing 480 pieces
              </p>
            </div>

            {/* RIGHT */}
            <div className="clp__headerRight">
              <span className="clp__sortLabel">SORT BY</span>

              <select 
                className="clp__sortSelect"
                value={sortBy}
                onChange={(e)=> setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="low">Price Low to High</option>
                <option value="high">Price High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

          </div>

          {/* Active filter */}
          <div className="clp__activeFilters">

            <span className="clp__activeLabel">ACTIVE FILTERS</span>

            <div className="clp__tags">

              {/* SHOP BY */}
              {filters.rentType.map((type) => (
                <div className="clp__tag" key={type}>
                  {type}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        rentType: prev.rentType.filter((t) => t !== type),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* DESIGNER */}
              {filters.designer.map((d) => (
                <div className="clp__tag" key={d}>
                  {d}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        designer: prev.designer.filter((x) => x !== d),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* GENDER */}
              {filters.gender.map((g) => (
                <div className="clp__tag" key={g}>
                  {g}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        gender: prev.gender.filter((x) => x !== g),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* CATEGORY */}
              {filters.category.map((c) => (
                <div className="clp__tag" key={c}>
                  {c}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        category: prev.category.filter((x) => x !== c),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* OCCASION */}
              {filters.occasion.map((o) => (
                <div className="clp__tag" key={o}>
                  {o}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        occasion: prev.occasion.filter((x) => x !== o),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* SIZE */}
              {filters.size.map((s) => (
                <div className="clp__tag" key={s}>
                  {s}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        size: prev.size.filter((x) => x !== s),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* COLOR */}
              {filters.color.map((c) => (
                <div className="clp__tag" key={c}>
                  {c}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        color: prev.color.filter((x) => x !== c),
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}

              {/* BUDGET */}
              {(filters.budget.min !== 0 || filters.budget.max !== Infinity) && (
                <div className="clp__tag">
                  ₹{filters.budget.min} - ₹{filters.budget.max}
                  <span
                    className="clp__tagClose"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        budget: { min: 0, max: Infinity },
                      }));
                    }}
                  >
                    ×
                  </span>
                </div>
              )}

            </div>

            <button
              type="button"
              className="clp__clearAll"
              onClick={() => {
                setFilters({
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
                });
              }}
            >
              Clear All
            </button>

          </div>


          {/* Product Card Grid*/}
          <div className="clp__grid">
            {currentProducts.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
           
           {/* Pagination */}
          <div className="pagination">

            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              ‹
            </button>

            {/* PAGE NUMBERS */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              ›
            </button>

          </div>


        </div>

      </div>

    </div>
  )
}
export default BridalLehenga