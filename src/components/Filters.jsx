import { useEffect, useState } from "react"
import "../styles/filters.css"


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
function Filters({ filters, setFilters }) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  
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
          {[
            ["Women", 480],
            ["Men", 320],
            ["Unisex", 380],
          ].map(([name, count]) => (
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
          {[
            ["Bridal Lehengas", 480],
            ["Party Lehengas", 320],
            ["Anarkalis", 380],
            ["Sarees", 640],
            ["Sherwanis", 210],
            ["Indo-Western", 290],
            ["Salwar Suits", 160],
          ].map(([name, count]) => (
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
          {[
            ["Wedding", 820],
            ["Mehendi", 340],
            ["Sangeet", 280],
            ["Reception", 460],
            ["Haldi", 190],
            ["Festive", 510]
          ].map(([name, count]) => (
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
          {[
            ["Sabyasachi", 214],
            ["Manish Malohtra", 187],
            ["Tarun Tahiliani", 143],
            ["Anita Donge", 118],
            ["Ritu Kumar", 96],
            ["Rahul Mishra", 84],
            ["Other Designers", 620]
          ].map(([name, count]) => (
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

          {[
            "red", "pink", "orange", "yellow", "green", "blue",
            "purple", "maroon", "gold", "ivory", "black", "white"
          ].map((c) => (
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