import "../styles/relatedproduct.css";
import { Heart } from "lucide-react";

function RelatedProduct() {
    const dummy = [
        {
            id: 1,
            name: "Blush Zardozi Anarkali",
            designer: "Rahul Mishra",
            image: "https://images.unsplash.com/photo-1722627813009-f1169e6334bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVobmdhfGVufDB8fDB8fHww",
            price: "2,40,000",
            badge: ["new"]
        },
        {
            id: 2,
            name: "Ivory Resham Kurta Set",
            designer: "Rahul Mishra",
            image: "https://images.unsplash.com/photo-1722627813009-f1169e6334bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVobmdhfGVufDB8fDB8fHww",
            price: "1,65,000",
            badge: ["rent"],
            rentPrice: "6500",
            days: "4 days"
        },
        {
            id: 3,
            name: "Midnight Threadwork Set",
            designer: "Rahul Mishra",
            image: "https://images.unsplash.com/photo-1722627813009-f1169e6334bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVobmdhfGVufDB8fDB8fHww",
            price: "3,10,000",
            badge: ["preloved"],
        },
        {
            id: 4,
            name: "Crimson Embroidered Lehenga",
            designer: "Rahul Mishra",
            image: "https://images.unsplash.com/photo-1722627813009-f1169e6334bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVobmdhfGVufDB8fDB8fHww",
            price: "4,20,000",
            badge: ["new"]
        }
    ];

    const renderCard = (item) => (
        <div className="related-card" key={item.id}>
            <div className="related-img">

                <div className="badge-wrap">
                    {item.badge?.includes("new") && <span className="badge new">NEW</span>}
                    {item.badge?.includes("rent") && <span className="badge rent">RENT</span>}
                    {item.badge?.includes("preloved") && <span className="badge preloved">PRELOVED</span>}
                </div>

                <img src={item.image} alt={item.name} />

                <button className="wishlist">
                    <Heart size={16} strokeWidth={1.5} />
                </button>

            </div>

            <div className="related-info">
                <p className="designer">{item.designer}</p>
                <p className="name">{item.name}</p>
                {item.rentPrice ? (
                    <p className="price">
                        ₹{item.rentPrice}
                        <span className="rental"> / {item.days}</span>
                    </p>
                ) : (
                    <p className="price">₹{item.price}</p>
                )}
            </div>
        </div>
    );

    return (
        <section className="related">
            <div className="container">

                {/* SECTION 1 */}
                <div className="block">
                    <div className="header-rental">
                        <div>
                            <p className="eyebrow">FROM THE SAME HOUSE</p>
                            <h2 className="title">
                                More by <span>Rahul Mishra</span>
                            </h2>
                        </div>

                        <a href="#" className="view">
                            VIEW ALL BY RAHUL MISHRA →
                        </a>
                    </div>

                    <div className="divider" />

                    <div className="grid">
                        {dummy.map(renderCard)}
                    </div>
                </div>

                {/* SECTION 2 */}
                <div className="block">
                    <div className="header-rental">
                        <div>
                            <p className="eyebrow">SAME SILHOUETTE</p>
                            <h2 className="title">
                                More <span>Anarkalis</span>
                            </h2>
                        </div>

                        <a href="#" className="view">
                            VIEW ALL ANARKALIS →
                        </a>
                    </div>

                    <div className="divider" />

                    <div className="grid">
                        {dummy.map(renderCard)}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default RelatedProduct;