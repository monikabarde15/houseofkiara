import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigateToProductDetail } from "../../../utils/productNavigation";
import "../../../styles/Header/Search/search-overlay.css";

const FALLBACK_SEARCH_IMAGE =
  "https://res.cloudinary.com/dv7jcu8ss/image/upload/v1792842137/submissions/image/file_h1auyp.jpg";

const SearchResultCard = ({ item, closeSearch }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(() => {
    const raw = item?.image || "";
    if (!raw || String(raw).includes("sub_1792844248")) {
      return FALLBACK_SEARCH_IMAGE;
    }
    return raw;
  });

  const handleCardClick = () => {
    if (typeof closeSearch === "function") {
      closeSearch();
    }

    if (item?.rawProduct) {
      navigateToProductDetail(navigate, item.rawProduct);
      return;
    }

    const modeLower = String(item?.mode || "").toLowerCase();
    const targetId = item?.id || "1";

    if (modeLower === "preloved") {
      navigate(`/preloved/${targetId}`);
    } else if (modeLower === "new") {
      navigate(`/buynew/${targetId}`);
    } else {
      navigate(`/onlyrental/${targetId}`);
    }
  };

  return (
    <article
      className="search-result-card"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="search-result-image">
        <span
          className={`search-result-badge ${
            item.mode === "Rent"
              ? "badge-rent"
              : item.mode === "Preloved"
              ? "badge-preloved"
              : "badge-new"
          }`}
        >
          {item.mode}
        </span>

        <div
          className={`search-result-image-inner ${
            item.imageClass || "ci-a"
          }`}
          style={{
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <img
            src={imgSrc}
            alt=""
            style={{ display: "none" }}
            onError={() => {
              if (imgSrc !== FALLBACK_SEARCH_IMAGE) {
                setImgSrc(FALLBACK_SEARCH_IMAGE);
              }
            }}
          />
        </div>
      </div>

      <div className="search-result-content">
        <span className="search-result-designer">
          {item.designer}
        </span>

        <h4 className="search-result-name">
          {item.label}
        </h4>

        <div className="search-result-price">
          {item.price}
        </div>
      </div>
    </article>
  );
};

export default SearchResultCard;
