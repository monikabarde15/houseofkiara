import "../styles/productcard.css"
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { makeProductDetail } from "./ProductList";

const ProductCard = ({ item }) => {


    const navigate = useNavigate();


    const handleClick = () => {
        const { rent, preloved, isNew } = item;

        const productData = makeProductDetail(item); // 🔥 IMPORTANT

        /*
        ⚠️ TEMP FIX STILL APPLIES FOR ID
        */

        if (rent && preloved) {
            navigate(`/rentalandpreloved/1`, { state: { product: productData } });
        }
        else if (rent && isNew) {
            navigate(`/rentalandbuy/1`, { state: { product: productData } });
        }
        else if (rent) {
            navigate(`/onlyrental/1`, { state: { product: productData } });
        }
        else if (preloved) {
            navigate(`/preloved/1`, { state: { product: productData } });
        }
        else {
            navigate(`/product/1`, { state: { product: productData } });
        }
    };

    // const handleClick = () => {
    //     const { rent, preloved, isNew, } = item;

    //                 /*
    //         ⚠️ TEMPORARY FIX:
    //         Currently we have only static pages like:
    //         /onlyrental/1, /preloved/1, /buy/1 etc.

    //         But product cards are dynamic (id: 1–30),
    //         so routes like /onlyrental/20 will break.

    //         👉 For now, always redirect to `/1`

    //         ✅ FUTURE:
    //         Replace `/1` with `/${item.id}` once dynamic routing
    //         and product detail pages are implemented, pass id to to the item.
    //         */

    //     if (rent && preloved) {
    //         navigate(`/rentalandpreloved/1`);
    //     }
    //     else if (rent && isNew) {
    //         navigate(`/rentalandbuy/1`);
    //     }
    //     else if (rent) {
    //         navigate(`/onlyrental/1`);
    //     }
    //     else if (preloved) {
    //         navigate(`/preloved/1`);
    //     }
    //     else {
    //         navigate(`/product/1`);
    //     }
    // };

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
    );
};

export default ProductCard;