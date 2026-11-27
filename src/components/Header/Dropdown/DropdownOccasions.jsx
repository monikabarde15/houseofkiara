import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { stripExtraParentParams } from "../../../services/headerApi";
import { useNavigate } from "react-router-dom";


const DropdownOccasions = ({ columns }) => {
  const data = dropdownData.occasions;
  const navigate = useNavigate();

  return (
    <>
      {/* Left Column */}
      {(() => {
        const occCol = columns?.find(c => c.id === 'col-occ-br' || c.heading?.toLowerCase().includes('occasion')) || columns?.[0];
        const occLinks = occCol?.links ? occCol.links.filter(l => !l.hidden && l.position !== 'last') : null;

        return (
          <div className="dd-col-left">
            <span className="dd-label">
              {occCol?.heading || data.leftLabel}
            </span>

            {occLinks && occLinks.length > 0 ? (
              occLinks.map((occ) => (
                <a
                  key={occ.id || occ.label}
                  className="dd-cat"
                  onClick={() =>
                    navigate(
                      occ.path?.startsWith('/main-page')
                        ? stripExtraParentParams(occ.path)
                        : `/main-page?occasion=${encodeURIComponent(occ.label)}`
                    )
                  }
                >
                  {occ.label}
                </a>
              ))
            ) : (
              data.categories.map((category) => (
                <a
                  key={category}
                  className="dd-cat"
                  onClick={() =>
                    navigate(
                      `/main-page?occasion=${encodeURIComponent(category)}`
                    )
                  }
                >
                  {category}
                </a>
              ))
            )}
          </div>
        );
      })()}

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
              onClick={() => {

                if (mode === "Rent for the Occasion") {
                  navigate(
                    "/main-page?section=rent"
                  );
                  return;
                }

                if (mode === "Buy Preloved") {
                  navigate(
                    "/main-page?section=preloved"
                  );
                  return;
                }

                if (mode === "Buy New") {
                  navigate(
                    "/main-page?section=new"
                  );
                }

              }}
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
              onClick={() =>
                navigate(
                  "/main-page?section=occasions"
                )
              }
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

          <button
            className="dd-view-all"
            onClick={() =>
              navigate(
                "/main-page?section=occasions"
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

export default DropdownOccasions;