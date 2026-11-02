import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { useNavigate } from "react-router-dom";

const DropdownMen = ({ columns }) => {
  const data = dropdownData.men;
  const navigate = useNavigate();

  return (
    <>
      {/* Left Column */}
      {(() => {
        const catCol = columns?.find(c => c.id === 'col-m-cat' || c.heading?.toLowerCase().includes('category')) || columns?.[0];
        const catLinks = catCol?.links ? catCol.links.filter(l => !l.hidden && l.position !== 'last') : null;
        const catLastLinks = catCol?.links ? catCol.links.filter(l => !l.hidden && l.position === 'last') : null;

        return (
          <div className="dd-col-left">
            <span className="dd-label">
              {catCol?.heading || data.leftLabel}
            </span>

            {catLinks && catLinks.length > 0 ? (
              catLinks.map((cat) => (
                <a
                  key={cat.id || cat.label}
                  className="dd-cat"
                  onClick={() =>
                    navigate(
                      cat.path?.startsWith('/main-page')
                        ? cat.path
                        : `/main-page?section=men&gender=Men&category=${encodeURIComponent(cat.label)}`
                    )
                  }
                >
                  {cat.label}
                </a>
              ))
            ) : (
              data.categories.map((category) => (
                <a
                  key={category}
                  className="dd-cat"
                  onClick={() =>
                    navigate(
                      `/main-page?section=men&gender=Men&category=${encodeURIComponent(category)}`
                    )
                  }
                >
                  {category}
                </a>
              ))
            )}

            <div className="dd-divider" />

            {catLastLinks && catLastLinks.length > 0 ? (
              catLastLinks.map((l) => (
                <a
                  key={l.id || l.label}
                  className="dd-sub"
                  onClick={() => navigate(l.path || "/main-page?section=men&gender=Men")}
                >
                  {l.label} →
                </a>
              ))
            ) : (
              <a
                className="dd-sub"
                onClick={() =>
                  navigate("/main-page?section=men&gender=Men")
                }
              >
                {data.leftFooter}
              </a>
            )}
          </div>
        );
      })()}

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
                  `/main-page?section=men&gender=Men&occasion=${encodeURIComponent(
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
                    "/main-page?section=rent&gender=Men"
                  );
                  return;
                }

                if (mode === "Buy Preloved") {
                  navigate(
                    "/main-page?section=preloved&gender=Men"
                  );
                  return;
                }

                if (mode === "Buy New") {
                  navigate(
                    "/main-page?section=new&gender=Men"
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
                "/main-page?section=men&gender=Men"
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

export default DropdownMen;