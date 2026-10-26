import React, { useState, useEffect } from "react";
import "../../../styles/maincategorypage/mobile/mobile-filter-sheet.css";

const MobileFilterSheet = ({ isOpen, onClose, onApply, filters, setFilters }) => {
  // Local state for filter selections (resets when sheet opens)
  const [localFilters, setLocalFilters] = useState({
    rentType: [],
    category: [],
    occasion: [],
    designer: [],
    priceMin: "",
    priceMax: "",
    availabilityFrom: "",
    availabilityTo: "",
    size: [],
    colour: []
  });

  // Accordion open/close states ( Groups 1-4 open, 5-8 closed)
  const [openGroups, setOpenGroups] = useState({
    shopBy: true,      // Group 1 - Open
    category: true,    // Group 2 - Open
    occasion: true,    // Group 3 - Open
    designer: true,    // Group 4 - Open
    price: false,      // Group 5 - Closed
    availability: false, // Group 6 - Closed
    size: false,       // Group 7 - Closed
    colour: false      // Group 8 - Closed
  });

  // Check if Rent mode is selected (for showing Availability group - Option B)
  const isRentSelected = localFilters.rentType.includes("rent");

  // Initialize local filters when sheet opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        rentType: filters.rentType || [],
        category: filters.category || [],
        occasion: filters.occasion || [],
        designer: filters.designer || [],
        priceMin: filters.budget?.min > 0 ? String(filters.budget.min) : "",
        priceMax: filters.budget?.max !== Infinity ? String(filters.budget.max) : "",
        availabilityFrom: filters.availabilityFrom || "",
        availabilityTo: filters.availabilityTo || "",
        size: filters.size || [],
        colour: filters.colour || []
      });
    }
  }, [isOpen, filters]);

  // Toggle accordion group
  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Toggle chip selection (multi-select)
  const toggleChip = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  // Handle price input change
  const handlePriceChange = (type, value) => {
    setLocalFilters(prev => ({ ...prev, [type]: value }));
  };

  // Handle size chip toggle
  const toggleSize = (size) => {
    setLocalFilters(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  };

  // Handle colour swatch toggle
  const toggleColour = (colour) => {
    setLocalFilters(prev => ({
      ...prev,
      colour: prev.colour.includes(colour)
        ? prev.colour.filter(c => c !== colour)
        : [...prev.colour, colour]
    }));
  };

  // Reset all filters
  const handleReset = () => {
    setLocalFilters({
      rentType: [],
      category: [],
      occasion: [],
      designer: [],
      priceMin: "",
      priceMax: "",
      availabilityFrom: "",
      availabilityTo: "",
      size: [],
      colour: []
    });
  };

  // Apply filters and close
  const handleApply = () => {
    const appliedFilters = {
      rentType: localFilters.rentType,
      category: localFilters.category,
      occasion: localFilters.occasion,
      designer: localFilters.designer,
      budget: {
        min: localFilters.priceMin ? parseInt(localFilters.priceMin) : 0,
        max: localFilters.priceMax ? parseInt(localFilters.priceMax) : Infinity
      },
      availabilityFrom: localFilters.availabilityFrom,
      availabilityTo: localFilters.availabilityTo,
      size: localFilters.size,
      colour: localFilters.colour
    };
    setFilters(appliedFilters);
    onApply();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="mob-filter-overlay" onClick={onClose} />

      {/* Filter Sheet  */}
      <div className="mob-filter-sheet">
        
        {/* Drag Handle - */}
        <div className="mob-filter-sheet__handle" />

        {/* Header  */}
        <div className="mob-filter-sheet__header">
          <span className="mob-filter-sheet__title">Filters</span>
          <button className="mob-filter-sheet__clear-btn" onClick={handleReset}>
            Clear All
          </button>
        </div>

        {/* Body  */}
        <div className="mob-filter-sheet__body">
          
          {/* GROUP 1: Shop by  */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("shopBy")}>
              <span className="mob-filter-group__label">Shop by</span>
              <svg className={`mob-filter-group__chevron ${openGroups.shopBy ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.shopBy ? "open" : ""}`}>
              <div className="mob-filter-chips">
                <button
                  className={`mob-filter-chip rent ${localFilters.rentType.includes("rent") ? "active" : ""}`}
                  onClick={() => toggleChip("rentType", "rent")}
                >
                  Rent
                </button>
                <button
                  className={`mob-filter-chip preloved ${localFilters.rentType.includes("preloved") ? "active-pre" : ""}`}
                  onClick={() => toggleChip("rentType", "preloved")}
                >
                  Preloved
                </button>
                <button
                  className={`mob-filter-chip new ${localFilters.rentType.includes("new") ? "active-new" : ""}`}
                  onClick={() => toggleChip("rentType", "new")}
                >
                  New
                </button>
              </div>
            </div>
          </div>

          {/* GROUP 2: Category  */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("category")}>
              <span className="mob-filter-group__label">Category</span>
              <svg className={`mob-filter-group__chevron ${openGroups.category ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.category ? "open" : ""}`}>
              <div className="mob-filter-chips">
                {["Bridal Lehengas", "Sarees", "Anarkalis", "Sharara Sets", "Sherwanis", "Kurta Sets", "Gowns"].map(cat => (
                  <button
                    key={cat}
                    className={`mob-filter-chip ${localFilters.category.includes(cat) ? "active" : ""}`}
                    onClick={() => toggleChip("category", cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GROUP 3: Occasion  */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("occasion")}>
              <span className="mob-filter-group__label">Occasion</span>
              <svg className={`mob-filter-group__chevron ${openGroups.occasion ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.occasion ? "open" : ""}`}>
              <div className="mob-filter-chips">
                {["Bridal", "Wedding Guest", "Mehendi & Sangeet", "Festive", "Cocktail", "Reception", "Groom"].map(occ => (
                  <button
                    key={occ}
                    className={`mob-filter-chip ${localFilters.occasion.includes(occ) ? "active" : ""}`}
                    onClick={() => toggleChip("occasion", occ)}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GROUP 4: Designer */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("designer")}>
              <span className="mob-filter-group__label">Designer</span>
              <svg className={`mob-filter-group__chevron ${openGroups.designer ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.designer ? "open" : ""}`}>
              <div className="mob-filter-chips">
                {["Sabyasachi", "Manish Malhotra", "Anita Dongre", "Tarun Tahiliani", "Raw Mango", "Torani", "Rimzim Dadu"].map(des => (
                  <button
                    key={des}
                    className={`mob-filter-chip ${localFilters.designer.includes(des) ? "active" : ""}`}
                    onClick={() => toggleChip("designer", des)}
                  >
                    {des}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GROUP 5: Price Range  */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("price")}>
              <span className="mob-filter-group__label">Price Range</span>
              <svg className={`mob-filter-group__chevron ${openGroups.price ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.price ? "open" : ""}`}>
              <div className="mob-price-inputs">
                <input
                  type="text"
                  className="mob-price-input"
                  placeholder="Min"
                  value={localFilters.priceMin}
                  onChange={(e) => handlePriceChange("priceMin", e.target.value)}
                />
                <span className="mob-price-separator">—</span>
                <input
                  type="text"
                  className="mob-price-input"
                  placeholder="Max"
                  value={localFilters.priceMax}
                  onChange={(e) => handlePriceChange("priceMax", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* GROUP 6: Availability  (Only shown when Rent selected - Option B) */}
          {isRentSelected && (
            <div className="mob-filter-group">
              <div className="mob-filter-group__header" onClick={() => toggleGroup("availability")}>
                <span className="mob-filter-group__label">Availability</span>
                <svg className={`mob-filter-group__chevron ${openGroups.availability ? "open" : ""}`} viewBox="0 0 24 24">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </div>
              <div className={`mob-filter-group__body ${openGroups.availability ? "open" : ""}`}>
                <input
                  type="date"
                  className="mob-date-input"
                  value={localFilters.availabilityFrom}
                  onChange={(e) => handlePriceChange("availabilityFrom", e.target.value)}
                  placeholder="Available from"
                />
                <input
                  type="date"
                  className="mob-date-input"
                  value={localFilters.availabilityTo}
                  onChange={(e) => handlePriceChange("availabilityTo", e.target.value)}
                  placeholder="Available until"
                />
              </div>
            </div>
          )}

          {/* GROUP 7: Size  */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("size")}>
              <span className="mob-filter-group__label">Size</span>
              <svg className={`mob-filter-group__chevron ${openGroups.size ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.size ? "open" : ""}`}>
              <div className="mob-size-grid">
                {["XS", "S", "M", "L", "XL", "XXL", "Free", "Custom"].map(sz => (
                  <button
                    key={sz}
                    className={`mob-size-chip ${localFilters.size.includes(sz) ? "active" : ""}`}
                    onClick={() => toggleSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GROUP 8: Colour  */}
          <div className="mob-filter-group">
            <div className="mob-filter-group__header" onClick={() => toggleGroup("colour")}>
              <span className="mob-filter-group__label">Colour</span>
              <svg className={`mob-filter-group__chevron ${openGroups.colour ? "open" : ""}`} viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
            <div className={`mob-filter-group__body ${openGroups.colour ? "open" : ""}`}>
              <div className="mob-swatch-row">
                {[
                  { name: "Crimson", color: "#B22222" },
                  { name: "Blush Pink", color: "#FFB6C1", hasBorder: true },
                  { name: "Orange", color: "#FF8C00" },
                  { name: "Gold", color: "#FFD700" },
                  { name: "Forest Green", color: "#228B22" },
                  { name: "Navy", color: "#00008B" },
                  { name: "Indigo", color: "#4B0082" },
                  { name: "Burgundy", color: "#800020" },
                  { name: "Champagne", color: "#C9A96E" },
                  { name: "Ivory", color: "#F5EDD8", hasBorder: true },
                  { name: "Charcoal", color: "#1A1612", hasBorder: true },
                  { name: "White", color: "#FFFFFF", hasBorder: true }
                ].map(swatch => (
                  <div
                    key={swatch.name}
                    className={`mob-swatch ${localFilters.colour.includes(swatch.name) ? "active" : ""}`}
                    style={{ 
                      backgroundColor: swatch.color,
                      border: swatch.hasBorder ? "1.5px solid #E8E0D4" : "2px solid transparent"
                    }}
                    onClick={() => toggleColour(swatch.name)}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer  */}
        <div className="mob-filter-sheet__footer">
          <button className="mob-filter-sheet__reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="mob-filter-sheet__apply-btn" onClick={handleApply}>
            Show Results
          </button>
        </div>

      </div>
    </>
  );
};

export default MobileFilterSheet;