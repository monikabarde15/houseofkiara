import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { stripExtraParentParams } from "../../../services/headerApi";
import { useNavigate } from "react-router-dom";


const DropdownBuyPreloved = ({ columns }) => {
  const data = dropdownData.buyPreloved;
  const navigate = useNavigate();

  return (
    <>
      {/* Left Column */}
      {(() => {
        const catCol = columns?.find(c => c.id === 'col-pre-cat' || c.heading?.toLowerCase().includes('category')) || columns?.[0];
        const catLinks = catCol?.links ? catCol.links.filter(l => !l.hidden && l.position !== 'last') : null;
        const condCol = columns?.find(c => c.id === 'col-pre-cond' || c.heading?.toLowerCase().includes('condition')) || columns?.[1];
        const condLinks = condCol?.links ? condCol.links.filter(l => !l.hidden && l.position !== 'last') : null;

        return (
          <div className="dd-col-left">
            <span className="dd-label">
              {catCol?.heading || data.leftLabel}
            </span>

            {/* Category */}
            {catLinks && catLinks.length > 0 ? (
              catLinks.map((cat) => (
                <a
                  key={cat.id || cat.label}
                  className="dd-cat"
                  onClick={() =>
                    navigate(
                      cat.path?.startsWith('/main-page')
                        ? stripExtraParentParams(cat.path)
                        : `/main-page?category=${encodeURIComponent(cat.label)}`
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
                      `/main-page?category=${encodeURIComponent(category)}`
                    )
                  }
                >
                  {category}
                </a>
              ))
            )}

            <div className="dd-divider" />

            {condLinks && condLinks.length > 0 ? (
              condLinks.map((item) => (
                <a
                  key={item.id || item.label}
                  className="dd-link"
                  onClick={() =>
                    navigate(
                      item.path?.startsWith('/main-page')
                        ? stripExtraParentParams(item.path)
                        : `/main-page?condition=${encodeURIComponent(item.label)}`
                    )
                  }
                >
                  {item.label}
                </a>
              ))
            ) : (
              data.secondaryLinks.map((item) => (
                <a
                  key={item}
                  className="dd-link"
                  onClick={() =>
                    navigate(
                      `/main-page?condition=${encodeURIComponent(item)}`
                    )
                  }
                >
                  {item}
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
                  `/main-page?designer=${encodeURIComponent(
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
                const params = new URLSearchParams();

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