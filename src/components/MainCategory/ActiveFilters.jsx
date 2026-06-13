// src\components\MainCategory\ActiveFilters.jsx
function ActiveFilters({
  filters,
  setFilters,
}) {

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
  };

  return (
    <div className="clp__activeFilters">

      <span className="clp__activeLabel">
        ACTIVE FILTERS
      </span>

      <div className="clp__tags">

        {filters.rentType.map((type) => (
          <div className="clp__tag" key={type}>
            {type}
            <span
              className="clp__tagClose"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  rentType:
                    prev.rentType.filter(
                      (t) => t !== type
                    ),
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
                setFilters((prev) => ({
                  ...prev,
                  designer:
                    prev.designer.filter(
                      (x) => x !== d
                    ),
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
                setFilters((prev) => ({
                  ...prev,
                  gender:
                    prev.gender.filter(
                      (x) => x !== g
                    ),
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
                setFilters((prev) => ({
                  ...prev,
                  category:
                    prev.category.filter(
                      (x) => x !== c
                    ),
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
                setFilters((prev) => ({
                  ...prev,
                  occasion:
                    prev.occasion.filter(
                      (x) => x !== o
                    ),
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
                setFilters((prev) => ({
                  ...prev,
                  size:
                    prev.size.filter(
                      (x) => x !== s
                    ),
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
                setFilters((prev) => ({
                  ...prev,
                  color:
                    prev.color.filter(
                      (x) => x !== c
                    ),
                }));
              }}
            >
              ×
            </span>
          </div>
        ))}

        {(filters.budget.min !== 0 ||
          filters.budget.max !== Infinity) && (
          <div className="clp__tag">

            ₹{filters.budget.min}
            {" - "}
            ₹{filters.budget.max}

            <span
              className="clp__tagClose"
              onClick={() => {
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

      <button
        type="button"
        className="clp__clearAll"
        onClick={clearAllFilters}
      >
        Clear All
      </button>

    </div>
  );
}

export default ActiveFilters;