import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../styles/Profile/cards/ListedCard.css";

const ListedCard = ({ piece, isActive, onDetailsClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getModeBadges = () => {
        const badges = [];

        // Listed Active badge (always shown)
        badges.push({ class: "profile-lc-badge-lst", text: "Listed · Active" });

        // Rental badge
        if (piece.mode === "Rental" || piece.mode === "Dual") {
            badges.push({ class: "profile-lc-badge-ren", text: "Rental" });
        }

        // Resale badge
        if (piece.mode === "Resale" || piece.mode === "Dual") {
            badges.push({ class: "profile-lc-badge-resale", text: "Resale" });
        }

        return badges;
    };

    const handleClick = () => {
        if (onDetailsClick) {
            onDetailsClick(piece.id);
        }
    };

    return (
        <div
            className={`profile-lc ${isActive ? 'profile-lc-active-card' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {/* Card Image with Ribbon */}
            <div className="profile-lc-img" style={{ background: piece.imageGradient }}>
                <svg className="profile-lc-placeholder" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                </svg>

                {/* Earnings Ribbon */}
                <div className="profile-lc-ribbon">
                    <div className="profile-lc-earned">
                        <div className="profile-lc-earned-n">₹{piece.totalEarned.toLocaleString()}</div>
                        <div className="profile-lc-earned-label">Total earned</div>
                    </div>
                    {piece.timesRented !== null && (
                        <div className="profile-lc-times">
                            <div className="profile-lc-times-n">{piece.timesRented}×</div>
                            <div className="profile-lc-times-label">Rented</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Card Body */}
            <div className="profile-lc-body">
                {/* Mode Row */}
                <div className="profile-lc-mode-row">
                    {getModeBadges().map((badge, idx) => (
                        <span key={idx} className={`profile-lc-badge ${badge.class}`}>
                            {badge.text}
                        </span>
                    ))}
                </div>

                <div className="profile-lc-name">{piece.name}</div>
                {/* <div className="profile-lc-meta">{piece.designer}</div> */}

                <div className="profile-lc-listed-since">Listed since {piece.listedSince} · Size {piece.size}</div>
                {piece.mode === "Dual" ? (
                    <div className="profile-lc-pricing">
                        <div>Rental: ₹{piece.rentalPrice.toLocaleString()}{piece.rentalPriceSuffix} • Resale: ₹{piece.resalePrice.toLocaleString()}{piece.resalePriceSuffix}</div>
                        <div></div>
                    </div>
                ) : (
                    <div className="profile-lc-pricing">
                        {piece.priceLabel}: ₹{piece.price.toLocaleString()}{piece.priceSuffix}
                    </div>
                )}

                {/* Card Footer */}
                <div className="profile-lc-foot">
                    <div className="profile-lc-payout">
                        {piece.nextPayout ? (
                            <>₹{piece.nextPayout.toLocaleString()} <span>next payout</span></>
                        ) : (
                            <span className="profile-lc-no-bookings">No bookings yet</span>
                        )}
                    </div>
                    <button className="profile-lc-link" onClick={(e) => { e.stopPropagation(); onDetailsClick(piece.id); }}>
                        DETAILS
                        <ChevronRight size={10} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListedCard;