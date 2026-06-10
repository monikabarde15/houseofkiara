import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";

const DropdownOccasions = () => {
  const data = dropdownData.occasions;

  return (
    <>
      {/* Left Column */}
      <div className="dd-col-left">
        <span className="dd-label">
          {data.leftLabel}
        </span>

        {data.categories.map(
          (category) => (
            <a
              key={category}
              className="dd-cat"
            >
              {category}
            </a>
          )
        )}
      </div>

      {/* Middle Column */}
      <div className="dd-col-mid">
        <span className="dd-label">
          {data.middleLabel}
        </span>

        {data.modes.map(
          (mode) => (
            <a
              key={mode}
              className="dd-link"
            >
              {mode}
            </a>
          )
        )}

        <div className="dd-divider" />

        <span className="dd-label">
          {data.quickFilterLabel}
        </span>

        {data.quickFilters.map(
          (filter) => (
            <a
              key={filter}
              className="dd-link"
            >
              {filter}
            </a>
          )
        )}
      </div>

      {/* Right Column */}
      <div className="dd-col-right">
        <div className="dd-cards-header">
          <h3 className="dd-cards-title">
            {data.cardsTitle
              .split(" ")
              .slice(0, -1)
              .join(" ")}{" "}
            <em>
              {
                data.cardsTitle
                  .split(" ")
                  .slice(-1)[0]
              }
            </em>
          </h3>

          <button className="dd-view-all">
            View all →
          </button>
        </div>

        <div className="dd-cards">
          {data.cards.map((card) => (
            <DropdownCard
              key={`${card.designer}-${card.name}`}
              badge={card.badge}
              badgeClass={
                card.badgeClass
              }
              designer={
                card.designer
              }
              name={card.name}
              price={card.price}
              imageClass={
                card.imageClass
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DropdownOccasions;