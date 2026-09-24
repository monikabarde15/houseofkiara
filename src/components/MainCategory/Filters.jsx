import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import "../../styles/maincategorypage/filters.css"


const FilterGroup = ({title , children, defaultOpen = true}) =>{
  const [open, setOpen] = useState(defaultOpen)
  return(
    <div className="clp__group">

      <div className="clp__groupHeader" onClick={()=> setOpen(!open)}>
        <span>{title}</span>
        <span className={`chevron ${open ? "open" : ""}`}>
          <svg className="chevron__icon" viewBox="0 0 12 12">
            <path d="M3 5 L6 8 L9 5" />
          </svg>
        </span>
      </div>

    {/* // Body ke liye */}
      <div className={`clp__groupBody ${open ? "open" : ""}`}>
        {children}
      </div>

    </div>
  );
};
function Filters({ filters, setFilters, productsData }) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [categories, setCategories] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [dynamicFilters, setDynamicFilters] = useState({
    occasions: [],
    sizes: [],
    colors: [],
    budget: { min: 0, max: 100000 }
  });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Use relative paths — Vite proxy forwards /api/* to backend (no CORS issues)
    fetch(`/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));

    fetch(`/api/designers`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setDesigners(data.data);
        }
      })
      .catch(err => console.error("Error fetching designers:", err));

    fetch(`/api/web-products/filters`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDynamicFilters(data.data);
        }
      })
      .catch(err => console.error("Error fetching filters data:", err));
  }, []);

  useEffect(() => {
  setMin(
    filters.budget.min > 0
      ? String(filters.budget.min)
      : ""
  );

  setMax(
    filters.budget.max !== Infinity
      ? String(filters.budget.max)
      : ""
  );
}, [filters.budget]);
  
  return (
    <aside className="clp__sidebar">
      <div className="clp__sidebarHeader">
        <span className="title">FILTERS</span>
        <button
          type="button"
          className="clearBtn"
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
            setSearchParams(new URLSearchParams());
          }}
        >
          Clear All
        </button>
      </div>
      
      {/* SHOP BY */}
      <FilterGroup title="SHOP BY" defaultOpen={true}>
        <div className="chips">

          {["rent", "preloved", "new"].map((type) => (
            <button
              type="button" 
              key={type}
              className={`chip ${type} ${filters.rentType.includes(type) ? "active" : ""
                }`}
              onClick={() => {
                const exists = filters.rentType.includes(type);
                const newRentTypes = exists
                  ? filters.rentType.filter((t) => t !== type)
                  : [...filters.rentType, type];
                
                // Update URL to trigger API fetch
                const newParams = new URLSearchParams(searchParams);
                if (newRentTypes.length > 0) {
                  newParams.set("section", newRentTypes[0]); // Using the first one for the section param
                } else {
                  newParams.delete("section");
                }
                setSearchParams(newParams);

                setFilters({
                  ...filters,
                  rentType: newRentTypes,
                });
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}

        </div>
      </FilterGroup>

      {/* GENDER */}
      
      <FilterGroup title="GENDER" defaultOpen={true}>
        <div className="checkboxList">
          {[
            "Women",
            "Men",
            "Unisex",
          ]
          .filter((name, i, self) => self.indexOf(name) === i)
          .map((name) => {
            const count = (productsData || []).filter(p => {
               const itemGender = p.gender ? p.gender.toLowerCase() : "";
               return itemGender === name.toLowerCase();
            }).length;
            return { name, count };
          })
          .filter(item => item.count > 0)
          .map(({ name, count }) => {
            return (
            <label className="checkboxRow" key={name}>
              <input
                type="checkbox"
                checked={filters.gender.includes(name)}
                onChange={() => {
                  const exists = filters.gender.includes(name);
                  const newGender = exists
                    ? filters.gender.filter((g) => g !== name)
                    : [...filters.gender, name];

                  const newParams = new URLSearchParams(searchParams);
                  if (newGender.length > 0) {
                    newParams.set("gender", newGender[0]);
                  } else {
                    newParams.delete("gender");
                  }
                  setSearchParams(newParams);

                  setFilters({
                    ...filters,
                    gender: newGender,
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          )})}
        </div>
      </FilterGroup>

      {/* CATEGORY */}

      <FilterGroup title="CATEGORY" defaultOpen={true}>
        <div className="checkboxList">
          {categories
            .map(cat => cat.name)
            .filter((name, i, self) => self.indexOf(name) === i)
            .map((name) => {
              const count = (productsData || []).filter(p => p.category === name).length;
              return { name, count };
            })
            .filter(item => item.count > 0)
            .map(({ name, count }) => {
            return (
            <label className="checkboxRow" key={name}>
              <input
                type="checkbox"
                checked={filters.category.includes(name)}
                onChange={() => {
                  const exists = filters.category.includes(name);
                  const newCategory = exists
                    ? filters.category.filter((c) => c !== name)
                    : [...filters.category, name];

                  const newParams = new URLSearchParams(searchParams);
                  if (newCategory.length > 0) {
                    newParams.set("category", newCategory[0]);
                  } else {
                    newParams.delete("category");
                  }
                  setSearchParams(newParams);

                  setFilters({
                    ...filters,
                    category: newCategory,
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          )})}
        </div>
      </FilterGroup>

      {/* OCCASION */}
      <FilterGroup title="OCCASION" defaultOpen={true}>
        <div className="checkboxList">
          {dynamicFilters.occasions
            .filter((name, i, self) => self.indexOf(name) === i)
            .map((name) => {
              const count = (productsData || []).filter(p => p.occasion && p.occasion.includes(name)).length;
              return { name, count };
            })
            .filter(item => item.count > 0)
            .map(({ name, count }) => {
            return (
            <label className="checkboxRow" key={name}>

              <input
                type="checkbox"
                checked={filters.occasion.includes(name)}
                onChange={() => {
                  // e.stopPropagation();
                  const exists = filters.occasion.includes(name);
                  const newOccasion = exists
                    ? filters.occasion.filter((c) => c !== name)
                    : [...filters.occasion, name];

                  const newParams = new URLSearchParams(searchParams);
                  if (newOccasion.length > 0) {
                    newParams.set("occasion", newOccasion[0]);
                  } else {
                    newParams.delete("occasion");
                  }
                  setSearchParams(newParams);

                  setFilters({
                    ...filters,
                    occasion: newOccasion,
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          )})}
        </div>
      </FilterGroup>


      {/*DESIGNER*/}
      <FilterGroup title="DESIGNER" defaultOpen={true}>
        <div className="checkboxList">
          {designers
            .map(d => d.name)
            .filter((name, i, self) => self.indexOf(name) === i)
            .map((name) => {
              const count = (productsData || []).filter(p => p.designer === name).length;
              return { name, count };
            })
            .filter(item => item.count > 0)
            .map(({ name, count }) => {
            return (
            <label className="checkboxRow" key={name}>
              <input
                type="checkbox"
                checked={filters.designer.includes(name)}
                onChange={() => {
                  const exists = filters.designer.includes(name);
                  const newDesigner = exists
                    ? filters.designer.filter((d) => d !== name)
                    : [...filters.designer, name];

                  const newParams = new URLSearchParams(searchParams);
                  if (newDesigner.length > 0) {
                    newParams.set("designer", newDesigner[0]);
                  } else {
                    newParams.delete("designer");
                  }
                  setSearchParams(newParams);

                  setFilters({
                    ...filters,
                    designer: newDesigner,
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          )})}
        </div>
      </FilterGroup>

      {/* BUDGET */}

      <FilterGroup title="BUDGET" defaultOpen={true}>

        <div className="budget">

          <div className="budget__inputs">
            
            <input
              type="text"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="budget__input"
            />

            <span className="budget__separator">-</span>
            <input
              type="text"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="budget__input"
            />
          </div>

          <button
            type="button" 
            className="budget__apply"
            onClick={() => {
              const newMin = min ? parseInt(min.replace(/,/g, "")) : 0;
              const newMax = max ? parseInt(max.replace(/,/g, "")) : Infinity;
              
              const newParams = new URLSearchParams(searchParams);
              if (newMin > 0) newParams.set("minPrice", newMin);
              else newParams.delete("minPrice");
              
              if (newMax !== Infinity) newParams.set("maxPrice", newMax);
              else newParams.delete("maxPrice");
              
              setSearchParams(newParams);
              
              setFilters((prev) => ({
                ...prev,
                budget: {
                  min: newMin,
                  max: newMax,
                },
              }));
            }}
          >
            APPLY
          </button>

        </div>
      </FilterGroup>

      {/* SIZE */}
      <FilterGroup title="SIZE" defaultOpen={true}>
        <div className="sizegrid">
          {dynamicFilters.sizes
            .filter((s) => {
              // Only show this size button if at least one product has it
              return (productsData || []).some((p) => {
                const itemSizes = p.size || [];
                return itemSizes.some(
                  (is) => is && typeof is === 'string' && is.trim().toLowerCase() === s.trim().toLowerCase()
                );
              });
            })
            .map((s) => (
            <button
              type="button"
              key={s}
              className={`size ${filters.size.includes(s) ? "active" : ""}`}
              onClick={() => {
                  const exists = filters.size.includes(s);
                  const newSize = exists
                    ? filters.size.filter((size) => size !== s)
                    : [...filters.size, s];
                    
                  const newParams = new URLSearchParams(searchParams);
                  if (newSize.length > 0) newParams.set("size", newSize[0]);
                  else newParams.delete("size");
                  setSearchParams(newParams);

                  setFilters({
                    ...filters,
                    size: newSize
                  });
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* COLOR */}

      <FilterGroup title="COLOUR" defaultOpen={true}>
        <div className="colorSwatches">

          {dynamicFilters.colors
            .filter((c) => {
              // Only show this color swatch if at least one product has it
              return (productsData || []).some((p) => {
                const itemColors = p.color || [];
                return itemColors.some(
                  (ic) => ic.toLowerCase() === c.toLowerCase()
                );
              });
            })
            .map((c) => (
            <div
              key={c}
              className={`swatch ${c.toLowerCase()} ${filters.color.includes(c) ? "active" : ""
                }`}
              title={c}
              onClick={() => {
                  const exists = filters.color.includes(c);
                  const newColor = exists
                    ? filters.color.filter((col) => col !== c)
                    : [...filters.color, c];
                    
                  const newParams = new URLSearchParams(searchParams);
                  if (newColor.length > 0) newParams.set("color", newColor[0]);
                  else newParams.delete("color");
                  setSearchParams(newParams);

                  setFilters({
                    ...filters,
                    color: newColor
                  });
              }}
            />
          ))}

        </div>

        <p className="colorLabel">
          {filters.color.length
            ? filters.color.join(" · ")
            : "No color selected"}
        </p>
      </FilterGroup>

    </aside>
  )
}
export default Filters