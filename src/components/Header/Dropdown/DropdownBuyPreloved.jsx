import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { useNavigate } from "react-router-dom";


const DropdownBuyPreloved = () => {
  const data = dropdownData.buyPreloved;
  const navigate = useNavigate();

  return (
    <>
      {/* Left Column */}
      <div className="dd-col-left">
        <span className="dd-label">
          {data.leftLabel}
        </span>

        {/* Categeory */}
        {data.categories.map(
          (category) => (
            <a
              key={category}
              className="dd-cat"
              onClick={() =>
                navigate(
                  `/main-page?section=preloved&category=${encodeURIComponent(
                    category
                  )}`
                )
              }
            >
              {category}
            </a>
          )
        )}

        <div className="dd-divider" />

        {data.secondaryLinks.map(
          (item) => (
            <a
              key={item}
              className="dd-link"
              onClick={() =>
                navigate(
                  `/main-page?section=preloved&condition=${encodeURIComponent(
                    item
                  )}`
                )
              }
            >
              {item}
            </a>
          )
        )}
      </div>

      {/* Middle Column */}
      <div className="dd-col-mid">
        <span className="dd-label">
          {data.middleLabel}
        </span>

        {/* Designers */}
        {data.designers.map(
          (designer) => (
            <a
              key={designer.label}
              className={`dd-link ${designer.featured
                ? "bold"
                : ""
                }`}
              onClick={() =>
                navigate(
                  `/main-page?section=preloved&designer=${encodeURIComponent(
                    designer.label
                  )}`
                )
              }
            >
              {designer.label}
            </a>
          )
        )}

        <div className="dd-divider" />

        {data.priceLinks.map(
          (price) => (
            <a
              key={price.label}
              className="dd-link"
              onClick={() => {
                const params =
                  new URLSearchParams({
                    section: "preloved",
                  });

                if (
                  price.min !== null
                ) {
                  params.set(
                    "minPrice",
                    price.min
                  );
                }

                if (
                  price.max !== null
                ) {
                  params.set(
                    "maxPrice",
                    price.max
                  );
                }

                navigate(
                  `/main-page?${params.toString()}`
                );
              }}
            >
              {price.label}
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

          <button
            className="dd-view-all"
            onClick={() =>
              navigate(
                "/main-page?section=preloved"
              )
            }
          >
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

export default DropdownBuyPreloved;