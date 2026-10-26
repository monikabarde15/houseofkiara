// src\components\MainCategory\ListingHeader.jsx
import { ChevronDown } from "lucide-react";

function ListingHeader({
  sortBy,
  setSortBy,
  totalProducts,
  heading,
}) {
  return (
    <div className="clp__header">

      <div className="clp__headerLeft">

        <h1 className="clp__title">
  {heading.title}{" "}
  <em>{heading.highlight}</em>
</h1>

        <p className="clp__count">
          Showing {totalProducts} pieces
        </p>

      </div>

      <div className="clp__headerRight">

        <span className="clp__sortLabel">
          SORT BY
        </span>

        <div className="clp__sortWrapper">

          <select
            className="clp__sortSelect"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="recommended">
              Recommended
            </option>

            <option value="low">
              Price Low to High
            </option>

            <option value="high">
              Price High to Low
            </option>

            <option value="newest">
              Newest First
            </option>

            <option value="popular">
              Most Popular
            </option>

            <option value="discount">
              Discount
            </option>
          </select>

          <ChevronDown
            className="clp__sortIcon"
            size={16}
          />
        </div>
      </div>

    </div>
  );
}

export default ListingHeader;