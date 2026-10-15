import "../../../styles/Header/dropdown.css";

const DropdownCard = ({
  badge,
  badgeClass,
  designer,
  name,
  price,
  imageClass,
}) => {
  return (
    <article className="dd-card">
      <div className="dd-card-img">
        <span
          className={`dd-badge ${badgeClass}`}
        >
          {badge}
        </span>

        <div
          className={`dd-card-inner ${imageClass}`}
        />
      </div>

      <div className="dd-card-designer">
        {designer}
      </div>

      <h4 className="dd-card-name">
        {name}
      </h4>

      <div className="dd-card-price">
        <strong>{price}</strong>
      </div>
    </article>
  );
};

export default DropdownCard;