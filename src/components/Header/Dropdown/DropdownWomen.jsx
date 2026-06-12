import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { useNavigate } from "react-router-dom";

const DropdownWomen = () => {
  const data = dropdownData.women;
  const navigate = useNavigate();

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
              onClick={() =>
                navigate(
                  `/main-page?section=women&gender=Women&category=${encodeURIComponent(
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

        <a
          className="dd-sub"
          onClick={() =>
            navigate(
              "/main-page?section=women&gender=Women"
            )
          }
        >
          {data.leftFooter}
        </a>
      </div>

      {/* Middle Column */}
      <div className="dd-col-mid">
        <span className="dd-label">
          {data.middleLabel}
        </span>

        {data.occasions.map(
          (occasion) => (
            <a
              key={occasion}
              className="dd-link"
              onClick={() =>
                navigate(
                  `/main-page?section=women&gender=Women&occasion=${encodeURIComponent(
                    occasion
                  )}`
                )
              }
            >
              {occasion}
            </a>
          )
        )}

        <div className="dd-divider" />

        <span className="dd-label">
          {data.modeLabel}
        </span>

        {data.modes.map(
          (mode) => (
            <a
              key={mode}
              className="dd-link"
              onClick={() => {

                if (mode === "Rent") {
                  navigate(
                    "/main-page?section=rent&gender=Women"
                  );
                  return;
                }

                if (mode === "Buy Preloved") {
                  navigate(
                    "/main-page?section=preloved&gender=Women"
                  );
                  return;
                }

                if (mode === "Buy New") {
                  navigate(
                    "/main-page?section=new&gender=Women"
                  );
                }
              }}
            >
              {mode}
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
                "/main-page?section=women&gender=Women"
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

export default DropdownWomen;