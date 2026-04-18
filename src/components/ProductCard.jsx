import "../styles/productcard.css"
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ item }) => {


    const navigate = useNavigate();

    const handleClick = () => {
        if (item.badge?.includes("new")) {
            navigate(`/rental/${item.id}`);
            console.log(item)
        }
    };

    // dynamic discount
    const discount =
        item.originalPrice && item.buyPrice
            ? Math.round(
                ((parseInt(item.originalPrice.replace(/,/g, "")) -
                    parseInt(item.buyPrice.replace(/,/g, ""))) /
                    parseInt(item.originalPrice.replace(/,/g, ""))) *
                100
            )
            : null;

    return (
        <a href="/rental/1">
        <div className="product-card" onClick={handleClick}>

            {/* IMAGE AREA */}
            <div className="product-image">

                {/* BADGES */}
                <div className="product-badges">
                    {item.rent && <span className="badge rent">RENT</span>}
                    {item.preloved && <span className="badge preloved">PRELOVED</span>}
                    {item.isNew && <span className="badge new">NEW</span>}
                </div>

                {/* WISHLIST */}
                <button className="wishlist-btn">
                    <Heart className="wishlist-icon" />
                </button>

                {/* IMAGE AND TEXT(!image))*/}
                <div className="product-img-inner">
                    {item.image?.[0] ? (
                        <img src={item.image[0]} alt={item.name} />
                    ) : (
                        <span className="product-placeholder">Bridal Lehenga</span>
                    )}
                </div>

                {/* QUICK ADD */}
                <div className="quick-add">
                    <svg className="quick-add-icon" viewBox="0 0 24 24">
                        <path d="M6 8h12l-1.2 11H7.2L6 8Z" />
                        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                    </svg>

                    <span>QUICK ADD</span>
                </div>

            </div>

            {/* INFO */}
            <div className="product-info">

                <p className="designer">{item.designer}</p>

                <h3 className="product-name">{item.name}</h3>

                <div className="price-block">

                    {/* RENT */}
                    {item.rentPrice && (
                        <div className="price-row">
                            <span className="price-type">RENT</span>
                            <span className="price-main">₹{item.rentPrice}</span>
                            <span className="price-sub">/ 4 days</span>
                        </div>
                    )}

                    {/* BUY */}
                    {item.buyPrice && (
                        <>
                            <div className="price-row">
                                <span className="price-type">BUY</span>
                                <span className="price-main">₹{item.buyPrice}</span>

                                {item.originalPrice && (
                                    <span className="price-orignal">₹{item.originalPrice}</span>
                                )}
                            </div>

                            {/* PRICE SAVE */}
                            {discount && (
                                <p className="price-save">You save {discount}%</p>
                            )}
                        </>
                    )}

                </div>

            </div>

        </div>
        </a>
    );
};

export default ProductCard;