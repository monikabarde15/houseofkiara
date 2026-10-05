// src\components\MainCategory\ActiveFilters.jsx
import { useSearchParams } from "react-router-dom";

function ActiveFilters({ filters, setFilters }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const clearAllFilters = () => {
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
  };

  return (
    <div className="clp__activeFilters">
      <span className="clp__activeLabel">ACTIVE FILTERS</span>

      <div className="clp__tags">
        {filters.rentType.map((type) => (
          <div className="clp__tag" key={type}>
            {type}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("section");
                setSearchParams(newParams);
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

        {filters.designer.map((d) => (
          <div className="clp__tag" key={d}>
            {d}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                const updatedDesigners = filters.designer.filter(
                  (x) => x !== d,
                );
                newParams.delete("designer");
                if (updatedDesigners.length > 0)
                  newParams.set("designer", updatedDesigners[0]); // assuming single select in url for now, matching Filters.jsx behavior
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  designer: updatedDesigners,
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {filters.gender.map((g) => (
          <div className="clp__tag" key={g}>
            {g}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                const updatedGender = filters.gender.filter((x) => x !== g);
                newParams.delete("gender");
                if (updatedGender.length > 0)
                  newParams.set("gender", updatedGender[0]);
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  gender: updatedGender,
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {filters.category.map((c) => (
          <div className="clp__tag" key={c}>
            {c}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                const updatedCategory = filters.category.filter((x) => x !== c);
                newParams.delete("category");
                if (updatedCategory.length > 0)
                  newParams.set("category", updatedCategory[0]);
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  category: updatedCategory,
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {filters.occasion.map((o) => (
          <div className="clp__tag" key={o}>
            {o}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                const updatedOccasion = filters.occasion.filter((x) => x !== o);
                newParams.delete("occasion");
                if (updatedOccasion.length > 0)
                  newParams.set("occasion", updatedOccasion[0]);
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  occasion: updatedOccasion,
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {filters.size.map((s) => (
          <div className="clp__tag" key={s}>
            {s}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                const updatedSize = filters.size.filter((x) => x !== s);
                newParams.delete("size");
                if (updatedSize.length > 0)
                  newParams.set("size", updatedSize[0]);
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  size: updatedSize,
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {filters.color.map((c) => (
          <div className="clp__tag" key={c}>
            {c}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                const updatedColor = filters.color.filter((x) => x !== c);
                newParams.delete("color");
                if (updatedColor.length > 0)
                  newParams.set("color", updatedColor[0]);
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  color: updatedColor,
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {(filters.budget.min !== 0 || filters.budget.max !== Infinity) && (
          <div className="clp__tag">
            ₹{filters.budget.min}
            {" - "}₹{filters.budget.max}
            <span
              className="clp__tagClose"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("minPrice");
                newParams.delete("maxPrice");
                setSearchParams(newParams);
                setFilters((prev) => ({
                  ...prev,
                  budget: {
                    min: 0,
                    max: Infinity,
                  },
                }));
              }}
            >
              ×
            </span>
          </div>
        )}
      </div>

      <button type="button" className="clp__clearAll" onClick={clearAllFilters}>
        Clear All
      </button>
    </div>
  );
}

export default ActiveFilters;
