import { useEffect, useState, useMemo } from "react"
import "../../styles/maincategorypage/filters.css"
import {
  matchCategory,
  matchGender,
  matchDesigner,
  matchOccasion,
  matchColor,
} from "../../components/MainCategory/utils/filterHelpers";

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
const DEFAULT_GENDER = [
  ["Women", 11],
  ["Men", 2],
  ["Unisex", 0],
];

const DEFAULT_CATEGORY = [
  ["Anarkalis", 2],
  ["Bridal Lehengas", 4],
  ["Gowns", 1],
  ["Indo-Western", 1],
  ["Kurta Sets", 0],
  ["Lehengas", 1],
  ["Sarees", 2],
  ["Sherwanis", 1],
];

const DEFAULT_OCCASION = [
  ["Wedding", 3],
  ["Mehendi", 0],
  ["Sangeet", 1],
  ["Reception", 0],
  ["Haldi", 1],
  ["Festive", 8],
];

const DEFAULT_DESIGNER = [
  ["Neha Tomar", 5],
  ["Other Designers", 8],
];

function Filters({ filters, setFilters, products = [] }) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [filterData, setFilterData] = useState({
    gender: DEFAULT_GENDER,
    category: DEFAULT_CATEGORY,
    occasion: DEFAULT_OCCASION,
    designer: DEFAULT_DESIGNER,
  });

  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5003";
    fetch(`${backendUrl}/api/web-products/filters`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFilterData({
            gender: data.data.gender || DEFAULT_GENDER,
            category: data.data.category || DEFAULT_CATEGORY,
            occasion: data.data.occasion || DEFAULT_OCCASION,
            designer: data.data.designer || DEFAULT_DESIGNER,
          });
        }
      })
      .catch((err) => {
        console.error("Error loading filter counts:", err);
      });
  }, []);

  // Compute exact counts from real database products so counts and listings match 100%
  const computedFilterData = useMemo(() => {
    if (!products || products.length === 0) return filterData;

    const genderList = filterData.gender && filterData.gender.length > 0 ? filterData.gender : DEFAULT_GENDER;
    const categoryList = filterData.category && filterData.category.length > 0 ? filterData.category : DEFAULT_CATEGORY;
    const occasionList = filterData.occasion && filterData.occasion.length > 0 ? filterData.occasion : DEFAULT_OCCASION;
    const designerList = filterData.designer && filterData.designer.length > 0 ? filterData.designer : DEFAULT_DESIGNER;

    const genderCounts = genderList.map(([name]) => [
      name,
      products.filter((p) => matchGender(p.gender, name)).length,
    ]);

    const categoryCounts = categoryList.map(([name]) => [
      name,
      products.filter((p) => matchCategory(p.category, name)).length,
    ]);

    const occasionCounts = occasionList.map(([name]) => [
      name,
      products.filter((p) => matchOccasion(p.occasion, name)).length,
    ]);

    const designerCounts = designerList.map(([name]) => [
      name,
      products.filter((p) => matchDesigner(p.designer, name)).length,
    ]);

    return {
      gender: genderCounts,
      category: categoryCounts,
      occasion: occasionCounts,
      designer: designerCounts,
    };
  }, [products, filterData]);

  // Extract only colors that actually exist in the database products
  const dbColors = useMemo(() => {
    const allColors = [
      "red", "pink", "orange", "yellow", "green", "blue",
      "purple", "maroon", "gold", "ivory", "black", "white"
    ];
    if (!products || products.length === 0) return allColors;

    const present = allColors.filter((col) =>
      products.some((p) => matchColor(p.color, col))
    );
    return present.length > 0 ? present : allColors;
  }, [products]);

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
                setFilters((prev) => {
                  const exists = prev.rentType.includes(type);

                  return {
                    ...prev,
                    rentType: exists
                      ? prev.rentType.filter((t) => t !== type)
                      : [...prev.rentType, type],
                  };
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
          {computedFilterData.gender.map(([name, count]) => (
            <label className="checkboxRow" key={name}>
              <input
                type="checkbox"
                checked={filters.gender.includes(name)}
                onChange={() => {
                  setFilters((prev) => {
                    const exists = prev.gender.includes(name);

                    return {
                      ...prev,
                      gender: exists
                        ? prev.gender.filter((g) => g !== name)
                        : [...prev.gender, name],
                    };
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* CATEGORY */}

      <FilterGroup title="CATEGORY" defaultOpen={true}>
        <div className="checkboxList">
          {computedFilterData.category.map(([name, count]) => (
            <label className="checkboxRow" key={name}>
              <input
                type="checkbox"
                checked={filters.category.includes(name)}
                onChange={() => {
                  setFilters((prev) => {
                    const exists = prev.category.includes(name);
                    return {
                      ...prev,
                      category: exists
                        ? prev.category.filter((c) => c !== name)
                        : [...prev.category, name],
                    };
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {/* OCCASION */}
      <FilterGroup title="OCCASION" defaultOpen={true}>
        <div className="checkboxList">
          {computedFilterData.occasion.map(([name, count]) => (
            <label className="checkboxRow" key={name}>

              <input
                type="checkbox"
                checked={filters.occasion.includes(name)}
                onChange={() => {
                  // e.stopPropagation();
                  setFilters((prev) => {
                    const exists = prev.occasion.includes(name);
                    return {
                      ...prev,
                      occasion: exists
                        ? prev.occasion.filter((c) => c !== name)
                        : [...prev.occasion, name],
                    };
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          ))}
        </div>
      </FilterGroup>


      {/*DESIGNER*/}
      <FilterGroup title="DESIGNER" defaultOpen={true}>
        <div className="checkboxList">
          {computedFilterData.designer.map(([name, count]) => (
            <label className="checkboxRow" key={name}>

              <input
                type="checkbox"
                checked={filters.designer.includes(name)}
                onChange={() => {
                  setFilters((prev) => {
                    const exists = prev.designer.includes(name);
                    return {
                      ...prev,
                      designer: exists
                        ? prev.designer.filter((d) => d !== name)
                        : [...prev.designer, name],
                    };
                  });
                }}
              />
              <span className="labelText">{name}</span>
              <span className="count">{count}</span>
            </label>
          ))}
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
              setFilters((prev) => ({
                ...prev,
                budget: {
                  min: min ? parseInt(min.replace(/,/g, "")) : 0,
                  max: max ? parseInt(max.replace(/,/g, "")) : Infinity,
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
          {["XS", "S", "M", "L", "XL", "XXL", "Free", "Custom"].map((s) => (
            <button
              type="button"
              key={s}
              className={`size ${filters.size.includes(s) ? "active" : ""}`}
              onClick={() => {
                setFilters((prev) => {
                  const exists = prev.size.includes(s);

                  return {
                    ...prev,
                    size: exists
                      ? prev.size.filter((size) => size !== s)
                      : [...prev.size, s],
                  };
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

          {dbColors.map((c) => (
            <div
              key={c}
              className={`swatch ${c} ${filters.color.includes(c) ? "active" : ""
                }`}
              onClick={() => {
                setFilters((prev) => {
                  const exists = prev.color.includes(c);

                  return {
                    ...prev,
                    color: exists
                      ? prev.color.filter((col) => col !== c)
                      : [...prev.color, c],
                  };
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