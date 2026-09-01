import React from 'react';
import EarningsTable from '../ui/EarningsTable';
import "../../../styles/Profile/panels/ListedDetailPanel.css";

const ListedDetailPanel = ({ piece, isOpen, onClose }) => {
    if (!piece) return null;

    // Booking history data - based on piece id
    const getBookingHistory = () => {
        if (piece.id === "LST-001-2025") {
            return [
                { date: "24 Apr 2025", customer: "Meera S., Mumbai", earnings: 3800 },
                { date: "18 Mar 2025", customer: "Ananya P., Delhi", earnings: 3800 },
                { date: "2 Feb 2025", customer: "Ritu K., Bangalore", earnings: 3800 },
                { date: "20 Jan 2025", customer: "Divya M., Pune", earnings: 3800 }
            ];
        }
        if (piece.id === "LST-003-2025") {
            return [
                { date: "14 May 2025", customer: "Preethi R., Chennai", earnings: 2200 }
            ];
        }
        return [];
    };

    const bookingHistory = getBookingHistory();

    const getBadges = () => {
        const badges = [{ class: "profile-lc-badge-lst", text: "Listed · Active" }];
        if (piece.mode === "Rental" || piece.mode === "Dual") {
            badges.push({ class: "profile-lc-badge-ren", text: "Rental" });
        }
        if (piece.mode === "Resale" || piece.mode === "Dual") {
            badges.push({ class: "profile-lc-badge-resale", text: "Resale" });
        }
        return badges;
    };

    const isRental = piece.mode === "Rental" || piece.mode === "Dual";
    const isResale = piece.mode === "Resale" || piece.mode === "Dual";
    const isDual = piece.mode === "Dual";

    return (
        <div className={`profile-lc-dpane ${isOpen ? 'open' : ''}`}>
            {/* Header */}
            <div className="profile-lc-dpn">
                <div className="profile-lc-dpn-title">{piece.name}</div>
                <button className="profile-lc-dpn-close" onClick={onClose}>
                    Close

                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line
                            x1="18"
                            y1="6"
                            x2="6"
                            y2="18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />

                        <line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>
            </div>

            <div className="profile-lc-dpb">
                {/* Image Cell */}
                <div
                    className="profile-lc-dp-img-cell"
                    style={{ background: piece.imageGradient }}
                >
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect x="4" y="4" width="28" height="28" stroke="currentColor" strokeWidth="1" opacity="0.18" />
                    </svg>
                </div>

                {/* Info Area */}
                <div className="profile-lc-dp-info">
                    {/* Badges */}
                    <div className="profile-lc-dp-badge-row">
                        {getBadges().map((badge, idx) => (
                            <span key={idx} className={`profile-lc-badge ${badge.class}`}>
                                {badge.text}
                            </span>
                        ))}
                    </div>

                    {/* Title & Description */}
                    <div className="profile-lc-dp-name">{piece.name}</div>
                    <div className="profile-lc-dp-des">
                        {piece.mode === "Rental" && `Listed for Rental - Size ${piece.size}`}
                        {piece.mode === "Resale" && `Listed for Resale - Size ${piece.size}`}
                        {piece.mode === "Dual" && `Listed for Rental & Resale - Size ${piece.size}`}
                    </div>

                    {/* Common Details */}
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">Listing ID</div>
                        <div className="profile-lc-dp-rv">#{piece.id}</div>
                    </div>
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">Listed Since</div>
                        <div className="profile-lc-dp-rv">{piece.listedSince}</div>
                    </div>
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">Piece Type</div>
                        <div className="profile-lc-dp-rv">
                            {piece.name.includes("Lehenga") ? "Bridal Lehenga" : piece.name.includes("Saree") ? "Saree" : "Anarkali Set"}
                        </div>
                    </div>
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">Designer</div>
                        <div className="profile-lc-dp-rv">{piece.designer}</div>
                    </div>
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">Size</div>
                        <div className="profile-lc-dp-rv">{piece.size}</div>
                    </div>
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">{piece.mode === "Resale" ? "Condition Grade" : "Condition"}</div>
                        <div className="profile-lc-dp-rv">Excellent — worn once</div>
                    </div>

                    {/* Listing Mode */}
                    <div className="profile-lc-dp-row">
                        <div className="profile-lc-dp-rl">Listing Mode</div>
                        <div className="profile-lc-dp-rv profile-lc-dp-rv-gold">
                            {isDual ? "Rental + Resale" : piece.mode}
                        </div>
                    </div>

                    {/* Rental Details Section */}
                    {isRental && (
                        <>
                            {isDual && (
                                <div className="profile-lc-dp-row profile-lc-dp-separator">
                                    <div className="profile-lc-dp-rl profile-lc-dp-rl-bold">Rental Details</div>
                                    <div className="profile-lc-dp-rv"></div>
                                </div>
                            )}
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Rental Price</div>
                                <div className="profile-lc-dp-rv">₹{piece.rentalPrice || piece.price}/ booking</div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Times Rented</div>
                                <div className="profile-lc-dp-rv profile-lc-dp-rv-gold">
                                    {piece.timesRented} time{piece.timesRented !== 1 ? 's' : ''}
                                </div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Rental Earnings</div>
                                <div className="profile-lc-dp-rv profile-lc-dp-rv-gold">
                                    ₹{piece.totalEarned.toLocaleString()}
                                </div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Your Rental Share</div>
                                <div className="profile-lc-dp-rv">40% per booking (HOK: 60%)</div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Next Rental Payout</div>
                                <div className="profile-lc-dp-rv profile-lc-dp-rv-sage">
                                    ₹{piece.nextPayout} — Processing
                                </div>
                            </div>
                            <EarningsTable
                                bookings={bookingHistory}
                                totalEarned={piece.totalEarned}
                                pendingAmount={piece.nextPayout}
                            />
                        </>
                    )}

                    {/* Resale Details Section */}
                    {isResale && !isDual && (
                        <>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Resale Price</div>
                                <div className="profile-lc-dp-rv">₹{piece.price.toLocaleString()}</div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Potential Payout on Sale</div>
                                <div className="profile-lc-dp-rv">
                                    ₹{Math.floor(piece.price * 0.75).toLocaleString()} (75% of sale price; HOK: 25%)
                                </div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Status</div>
                                <div className="profile-lc-dp-rv">Live — no enquiries yet</div>
                            </div>
                        </>
                    )}

                    {/* Resale Details for Dual Mode */}
                    {isDual && (
                        <>
                            <div className="profile-lc-dp-row profile-lc-dp-separator">
                                <div className="profile-lc-dp-rl profile-lc-dp-rl-bold">Resale Details</div>
                                <div className="profile-lc-dp-rv"></div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Resale Price</div>
                                <div className="profile-lc-dp-rv">₹{piece.resalePrice.toLocaleString()}</div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Potential Payout on Sale</div>
                                <div className="profile-lc-dp-rv">
                                    ₹{Math.floor(piece.resalePrice * 0.75).toLocaleString()} (75% of sale price; HOK: 25%)
                                </div>
                            </div>
                            <div className="profile-lc-dp-row">
                                <div className="profile-lc-dp-rl">Resale Status</div>
                                <div className="profile-lc-dp-rv">Live — no enquiries yet</div>
                            </div>
                        </>
                    )}

                    {/* Info Note */}
                    <div className="profile-lc-dp-note gold">
                        <div className="profile-lc-dp-note-h">
                            {isDual ? "How Dual Listing Works" : (piece.mode === "Resale" ? "What Happens When It Sells" : "Payout Note")}
                        </div>
                        <div className="profile-lc-dp-note-t">
                            {isDual ? (
                                "Your piece is live for both rental bookings and resale enquiries simultaneously. Once a buyer purchases it, the listing will be removed from rental availability. Rental payouts continue as bookings are completed until then."
                            ) : piece.mode === "Resale" ? (
                                "Once a buyer purchases your piece, the House of Kaira team will coordinate collection from you. Your potential payout will be processed within 7 days of the buyer confirming receipt."
                            ) : (
                                "Payouts are processed by the House of Kaira team after each booking is marked completed. You'll receive a WhatsApp confirmation when your payout is sent."
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="profile-lc-dp-btns">
                        <button className="profile-lc-btn-p">WhatsApp Team</button>
                        <button className="profile-lc-btn-s">View Live Listing</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListedDetailPanel;