// src\components\Confirmation\discovery\DiscoveryStrip.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { products } from "../../ProductList";

import "../../../styles/confirmation/discovery/discovery-strip.css";

/* =========================================================
   DISCOVERY STRIP DATA
========================================================= */

const confirmationDiscoveryCards = products
    .slice(0, 4)
    .map((item, index) => {

        const isRental =
            item.tag === "RENT";

        const isPreloved =
            item.tag === "PRELOVED";

        const isNew =
            item.tag === "NEW";

        return {

            id: item.id,

            brand: item.designer,

            name: item.name,

            image: item.image?.[0],

            price: isRental
                ? item.modes?.rent?.pricing?.pricePerDay
                : item.price,

            suffix: isRental
                ? ` / ${item.modes?.rent?.pricing?.minDays || 3}-day window`
                : isPreloved
                    ? " buy to own"
                    : " new",

            modeLabel: isRental
                ? "Rent"
                : isPreloved
                    ? "Preloved"
                    : "New",

            modeClass: isRental
                ? "hok-confirmation-discovery-mode-pill-rental"
                : isPreloved
                    ? "hok-confirmation-discovery-mode-pill-preloved"
                    : "hok-confirmation-discovery-mode-pill-new",

            thumbGradientClass:
                `hok-confirmation-discovery-thumb-gradient-${index + 1}`,
        };

    });

/* =========================================================
   COMPONENT
========================================================= */

const DiscoveryStrip = () => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 430px)");
        setIsMobile(mediaQuery.matches);

        const handleChange = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (

        <section
            className="hok-confirmation-discovery-strip"
            data-rise={isMobile ? "6" : "5"}
        >

            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="hok-confirmation-discovery-header">

                <h2 className="hok-confirmation-discovery-heading">
                    Continue <em>Your Edit</em>
                </h2>

                <Link
                    to="/products"
                    className="hok-confirmation-discovery-link"
                >
                    View all pieces →
                </Link>

            </div>

            {/* =========================================================
                PRODUCT GRID
            ========================================================= */}

            <div className="hok-confirmation-discovery-grid">

                {confirmationDiscoveryCards.map((card) => (

                    <Link
                        key={card.id}
                        to={`/product/${card.id}`}
                        className="hok-confirmation-discovery-card"
                    >

                        {/* =========================================================
                            CARD THUMB
                        ========================================================= */}

                        <div
                            className={`
                                hok-confirmation-discovery-card-thumb
                                ${card.thumbGradientClass}
                            `}
                        >

                            <img
                                src={card.image}
                                alt={card.name}
                                className="hok-confirmation-discovery-thumb-image"
                            />

                            <div
                                className={`
                                    hok-confirmation-discovery-mode-pill
                                    ${card.modeClass}
                                `}
                            >
                                {card.modeLabel}
                            </div>

                        </div>

                        {/* =========================================================
                            BRAND
                        ========================================================= */}

                        <div className="hok-confirmation-discovery-card-brand">
                            {card.brand}
                        </div>

                        {/* =========================================================
                            NAME
                        ========================================================= */}

                        <h3 className="hok-confirmation-discovery-card-name">
                            {card.name}
                        </h3>

                        {/* =========================================================
                            PRICE
                        ========================================================= */}

                        <div className="hok-confirmation-discovery-card-price">

                            ₹{card.price}

                            <span>
                                {card.suffix}
                            </span>

                        </div>

                    </Link>

                ))}

            </div>

        </section>

    );

};

export default DiscoveryStrip;