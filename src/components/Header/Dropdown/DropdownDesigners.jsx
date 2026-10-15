import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { useNavigate } from "react-router-dom";

const DropdownDesigners = () => {
  const data = dropdownData.designers;
  const navigate = useNavigate();

  return (
    <>
      {/* Left Column */}
      <div className="dd-col-left">
        <span className="dd-label">
          {data.leftLabel}
        </span>

        {data.categories.map(
          (designer) => (
            <a
              key={designer}
              className="dd-cat"
              onClick={() =>
                navigate(
                  `/main-page?section=designers&designer=${encodeURIComponent(
                    designer
                  )}`
                )
              }
            >
              {designer}
            </a>
          )
        )}

        <div className="dd-divider" />
        {/* A–Z Index */}
        <a
          className="dd-sub"
          onClick={() =>
            navigate(
              "/main-page?section=designers"
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

        {data.discoverLinks.map(
          (link) => (
            <a
              key={link}
              className="dd-link"
              onClick={() =>
                navigate(
                  "/main-page?section=designers"
                )
              }
            >
              {link}
            </a>
          )
        )}

        <div className="dd-divider" />

        <span className="dd-label">
          {data.newToHokLabel}
        </span>

        {data.newToHok.map(
          (designer) => (
            <a
              key={designer}
              className="dd-link bold"
              onClick={() =>
                navigate(
                  `/main-page?section=designers&designer=${encodeURIComponent(
                    designer
                  )}`
                )
              }
            >
              {designer}
            </a>
          )
        )}

        <div className="dd-divider" />

        {/* Partner With HOK */}
        <a
          className="dd-sub"
          onClick={() =>
            navigate(
              "/main-page?section=designers"
            )
          }
        >
          {data.middleFooter}
        </a>
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

export default DropdownDesigners;