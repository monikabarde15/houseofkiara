// src\components\MainCategory\ProductCard.jsx
import "../../styles/maincategorypage/productcard.css"
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { makeProductDetail } from "../ProductList";
import useWishlistStore from "../../store/wishlistStore";
import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import toast from 'react-hot-toast';

const ProductCard = ({ item }) => {
    const navigate = useNavigate();

    // Store hooks
    const { toggleWishlist, items: wishlistItems } = useWishlistStore();
    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const productId = item._id || item.id;
    const isWishlisted = wishlistItems.includes(productId);

    const handleClick = () => {
        const rent = item.rent;
        const preloved = item.preloved;
        const isNew = item.isNew;

        const productData = makeProductDetail(item); // 🔥 IMPORTANT

        if (rent && preloved && isNew) {
            navigate(`/all-modes/${productId}`, { state: { product: productData } });
        }
        else if (rent && preloved) {
            navigate(`/rentalandpreloved/${productId}`, { state: { product: productData } });
        }
        else if (rent && isNew) {
            navigate(`/rentalandbuy/${productId}`, { state: { product: productData } });
        }
        else if (rent) {
            navigate(`/onlyrental/${productId}`, { state: { product: productData } });
        }
        else if (preloved) {
            navigate(`/preloved/${productId}`, { state: { product: productData } });
        }
        else {
            navigate(`/buynew/${productId}`, { state: { product: productData } });
        }
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        toggleWishlist(productId);
        if (isWishlisted) {
            toast.success("Removed from wishlist");
        } else {
            toast.success("Added to wishlist!");
        }
    };

    const handleQuickAdd = (e) => {
        e.stopPropagation();
        const details = {
            price: item.rentPrice || item.buyPrice || 0,
            type: item.rent ? 'rental' : (item.preloved ? 'preloved' : 'buy'),
            size: item.sizes?.[0] || 'Default',
            rentalDates: null
        };
        const added = addToCart(item, details);
        if (added) {
            toast.success("Added to cart!");
        } else {
            toast("Already in cart", { icon: "ℹ️" });
        }
    };

    // dynamic discount
    const discount =
        item.originalPrice && item.buyPrice
            ? Math.round(
                ((parseInt(item.originalPrice.toString().replace(/,/g, "")) -
                    parseInt(item.buyPrice.toString().replace(/,/g, ""))) /
                    parseInt(item.originalPrice.toString().replace(/,/g, ""))) *
                100
            )
            : null;

    // Get image - support both item.images (from PDP fetch) and item.image (from listing fetch)
    const imgSrc = (item.images?.[0] || item.image?.[0]);

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
                <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlistClick}>
                    <Heart 
                        className="wishlist-icon" 
                        style={{
                            fill: isWishlisted ? "#B85C38" : "none",
                            stroke: isWishlisted ? "#B85C38" : "currentColor",
                            color: isWishlisted ? "#B85C38" : "inherit"
                        }}
                    />
                </button>

                {/* IMAGE AND TEXT(!image))*/}
                <div className="product-img-inner">
                    {imgSrc ? (
                        <img src={imgSrc} alt={item.name} />
                    ) : (
                        <span className="product-placeholder">Bridal Lehenga</span>
                    )}
                </div>

                {/* QUICK ADD */}
                <div className="quick-add" onClick={handleQuickAdd}>
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