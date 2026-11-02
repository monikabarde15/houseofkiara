import DropdownCard from "./DropdownCard";
import { dropdownData } from "../../../data/dropdownData";
import { useNavigate } from "react-router-dom";


const DropdownBuyNew = ({ columns }) => {
  const data = dropdownData.buyNew;
  const navigate = useNavigate();

  return (
    <>
      {/* Left Column */}
      {(() => {
        const catCol = columns?.find(c => c.id === 'col-bn-cat' || c.heading?.toLowerCase().includes('category')) || columns?.[0];
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
                        : `/main-page?section=new&category=${encodeURIComponent(cat.label)}`
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
                      `/main-page?section=new&category=${encodeURIComponent(category)}`
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
                  onClick={() => navigate(l.path || "/main-page?section=new")}
                >
                  {l.label} →
                </a>
              ))
            ) : (
              <a
                className="dd-sub"
                onClick={() =>
                  navigate("/main-page?section=new")
                }
              >
                {data.leftFooter}
              </a>
            )}
          </div>
        );
      })()}

      {/* Middle Column */}
      {(() => {
        const desCol = columns?.find(c => c.id === 'col-bn-des' || c.heading?.toLowerCase().includes('designer')) || columns?.[1];
        const desLinks = desCol?.links ? desCol.links.filter(l => !l.hidden && l.position !== 'last') : null;
        const desLastLinks = desCol?.links ? desCol.links.filter(l => !l.hidden && l.position === 'last') : null;

        return (
          <div className="dd-col-mid">
            <span className="dd-label">
              {desCol?.heading || data.middleLabel}
            </span>

            {desLinks && desLinks.length > 0 ? (
              desLinks.map((designer) => (
                <a
                  key={designer.id || designer.label}
                  className="dd-link"
                  onClick={() =>
                    navigate(
                      designer.path?.startsWith('/main-page')
                        ? designer.path
                        : `/main-page?section=new&designer=${encodeURIComponent(designer.label)}`
                    )
                  }
                >
                  {designer.label}
                </a>
              ))
            ) : (
              data.designers.map((designer) => (
                <a
                  key={designer.label}
                  className={`dd-link ${designer.featured ? "bold" : ""}`}
                  onClick={() =>
                    navigate(
                      `/main-page?section=new&designer=${encodeURIComponent(designer.label)}`
                    )
                  }
                >
                  {designer.label}
                </a>
              ))
            )}

            <div className="dd-divider" />

            {desLastLinks && desLastLinks.length > 0 ? (
              desLastLinks.map((l) => (
                <a
                  key={l.id || l.label}
                  className="dd-sub"
                  onClick={() => navigate(l.path || "/main-page?section=new")}
                >
                  {l.label} →
                </a>
              ))
            ) : (
              <a
                className="dd-sub"
                onClick={() =>
                  navigate("/main-page?section=new")
                }
              >
                {data.middleFooter}
              </a>
            )}
          </div>
        );
      })()}

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
                "/main-page?section=new"
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

export default DropdownBuyNew;