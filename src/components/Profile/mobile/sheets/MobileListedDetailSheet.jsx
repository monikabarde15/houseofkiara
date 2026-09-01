import MobileBottomSheet from "./MobileBottomSheet";
import "../../../../styles/Profile/mobile/sheets/MobileListedDetailSheet.css";

const MobileListedDetailSheet = ({ isOpen, onClose, piece }) => {
    if (!piece) {
        return null;
    }

    const isRental = piece.mode === "Rental" || piece.mode === "Dual";
    const isResale = piece.mode === "Resale" || piece.mode === "Dual";
    const isDual = piece.mode === "Dual";

    const getBadgeClass = (type) => {
        switch (type) {
            case "Listed Active":
                return "profile-mobile-b-lst";
            case "Rental":
                return "profile-mobile-b-ren";
            case "Resale":
                return "profile-mobile-b-resale";
            default:
                return "";
        }
    };

    // Common detail rows for all listing types
    const commonRows = [
        { label: "Listing ID", value: piece.id },
        { label: "Listed Since", value: piece.listedSince },
        { label: "Piece Type", value: piece.pieceType },
        { label: "Designer", value: piece.designer },
        { label: "Size", value: piece.size },
        { label: isResale ? "Condition Grade" : "Condition", value: "Excellent — worn once" }
    ];

    // Rental-specific rows - only if rental data exists
    const rentalRows = isRental ? [
        { label: "Listing Mode", value: "Rental", valueClass: "profile-mobile-dv-gold" },
        { label: "Rental Price", value: `₹${(piece.rentalPrice || piece.price || 0).toLocaleString()}/booking` },
        { label: "Times Rented", value: `${piece.timesRented || 0} times`, valueClass: "profile-mobile-dv-gold" },
        { label: "Total Earnings", value: `₹${(piece.totalEarned || 0).toLocaleString()}`, valueClass: "profile-mobile-dv-gold" },
        { label: "Your Revenue Share", value: "40% per booking (HOK: 60%)" },
        { label: "Next Payout", value: `₹${(piece.nextPayout || 0).toLocaleString()} — Processing`, valueClass: "profile-mobile-dv-sage" }
    ] : [];

    // Resale-specific rows - only if resale data exists
    const resaleRows = isResale ? [
        { label: "Listing Mode", value: "Resale" },
        { label: "Resale Price", value: `₹${(piece.resalePrice || piece.price || 0).toLocaleString()}` },
        { label: "Potential Payout on Sale", value: `₹${Math.floor((piece.resalePrice || piece.price || 0) * 0.75).toLocaleString()} (75% of sale price; HOK: 25%)` },
        { label: "Status", value: "Live — no enquiries yet" }
    ] : [];

    // Booking History data (only for rental pieces with timesRented)
    const bookingHistory = (piece.mode === "Rental" && piece.timesRented === 4) ? [
        { date: "24 Apr 2025", customer: "Meera S., Mumbai", earnings: 3800, status: "paid" },
        { date: "18 Mar 2025", customer: "Ananya P., Delhi", earnings: 3800, status: "paid" },
        { date: "2 Feb 2025", customer: "Ritu K., Bangalore", earnings: 3800, status: "pending" },
        { date: "20 Jan 2025", customer: "Divya M., Pune", earnings: 3800, status: "pending" }
    ] : (piece.mode === "Dual" && piece.timesRented === 1) ? [
        { date: "14 May 2025", customer: "Preethi R., Chennai", earnings: 2200, status: "pending" }
    ] : [];

    const getNote = () => {
        if (piece.mode === "Dual") {
            return {
                variant: "profile-mobile-note-gold",
                title: "How Dual Listing Works",
                text: "Your piece is live for both rental bookings and resale enquiries simultaneously. Once a buyer purchases it, the listing will be removed from rental availability. Rental payouts continue as bookings are completed until then."
            };
        }
        if (piece.mode === "Resale") {
            return {
                variant: "profile-mobile-note-gold",
                title: "What Happens When It Sells",
                text: "Once a buyer purchases your piece, the House of Kaira team will coordinate collection from you. Your potential payout will be processed within 7 days of the buyer confirming receipt."
            };
        }
        return {
            variant: "profile-mobile-note-gold",
            title: "Payout Note",
            text: "Payouts are processed by the House of Kaira team after each booking is marked completed. You'll receive a WhatsApp confirmation when your payout is sent."
        };
    };

    const getActions = () => {
        if (piece.mode === "Resale") {
            return { primary: "View Listing", secondary: "WhatsApp Team" };
        }
        if (piece.mode === "Dual") {
            return { primary: "View Listing", secondary: "WhatsApp Team" };
        }
        return { primary: "View Listing", secondary: "Payout Query" };
    };

    const currentNote = getNote();
    const currentActions = getActions();

    return (
        <MobileBottomSheet isOpen={isOpen} onClose={onClose} title={piece.name}>
            {/* Product Header Block */}
            <div className="profile-mobile-sheet-product">
                <div
                    className="profile-mobile-sheet-product-img"
                    style={{ "--sheet-bg": piece.imageGradient }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>

                <div className="profile-mobile-sheet-product-info">
                    <div className="profile-mobile-listed-badges">
                        <span className={`profile-mobile-badge ${getBadgeClass("Listed Active")}`}>
                            Listed · Active
                        </span>
                        {isRental && (
                            <span className={`profile-mobile-badge ${getBadgeClass("Rental")}`}>
                                Rental
                            </span>
                        )}
                        {isResale && (
                            <span className={`profile-mobile-badge ${getBadgeClass("Resale")}`}>
                                Resale
                            </span>
                        )}
                    </div>
                    <div className="profile-mobile-sheet-product-name">{piece.name}</div>
                    <div className="profile-mobile-sheet-product-meta">
                        {isDual ? "Listed for Rental & Resale" : (isRental ? "Listed for Rental" : "Listed for Resale")}
                    </div>
                </div>
            </div>

            {/* Detail Body */}
            <div className="profile-mobile-sheet-detail-body">
                {/* Common Rows */}
                {commonRows.map((row) => (
                    <div key={row.label} className="profile-mobile-drow">
                        <div className="profile-mobile-dl">{row.label}</div>
                        <div className="profile-mobile-dv">{row.value}</div>
                    </div>
                ))}

                {/* Rental Section */}
                {isRental && rentalRows.length > 0 && (
                    <>
                        {isDual && (
                            <div className="profile-mobile-section-divider">
                                <div className="profile-mobile-section-title">Rental Details</div>
                            </div>
                        )}
                        {rentalRows.map((row) => (
                            <div key={row.label} className="profile-mobile-drow">
                                <div className="profile-mobile-dl">{row.label}</div>
                                <div className={`profile-mobile-dv ${row.valueClass || ""}`}>
                                    {row.value}
                                </div>
                            </div>
                        ))}

                        {/* Booking History */}
                        {bookingHistory.length > 0 && (
                            <div className="profile-mobile-booking-history">
                                <div className="profile-mobile-booking-title">
                                    Booking History
                                </div>

                                {bookingHistory.map((booking, idx) => (
                                    <div
                                        key={idx}
                                        className="profile-mobile-drow"
                                    >
                                        <div className="profile-mobile-dl">
                                            {booking.date} · {booking.customer}
                                        </div>

                                        <div
                                            className={`profile-mobile-dv ${booking.status === "pending"
                                                    ? "profile-mobile-dv-pending"
                                                    : "profile-mobile-dv-paid"
                                                }`}
                                        >
                                            ₹{booking.earnings.toLocaleString()}

                                            {booking.status === "pending" && (
                                                <span className="profile-mobile-pending-label">
                                                    {" "}pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="profile-mobile-drow profile-mobile-total-row">
                                    <div className="profile-mobile-dl">
                                        Total Earned
                                    </div>

                                    <div className="profile-mobile-dv profile-mobile-total-amount">
                                        ₹{(
                                            (piece.totalEarned || 0) -
                                            (piece.nextPayout || 0)
                                        ).toLocaleString()}

                                        {(piece.nextPayout || 0) > 0 && (
                                            <span className="profile-mobile-total-pending">
                                                + ₹{(
                                                    piece.nextPayout || 0
                                                ).toLocaleString()} pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Resale Section (for Dual mode) */}
                {isDual && resaleRows.length > 0 && (
                    <>
                        <div className="profile-mobile-section-divider">
                            <div className="profile-mobile-section-title">Resale Details</div>
                        </div>
                        {resaleRows.map((row) => (
                            <div key={row.label} className="profile-mobile-drow">
                                <div className="profile-mobile-dl">{row.label}</div>
                                <div className="profile-mobile-dv">{row.value}</div>
                            </div>
                        ))}
                    </>
                )}

                {/* Resale-Only Section */}
                {!isRental && isResale && resaleRows.length > 0 && (
                    <>
                        {resaleRows.map((row) => (
                            <div key={row.label} className="profile-mobile-drow">
                                <div className="profile-mobile-dl">{row.label}</div>
                                <div className="profile-mobile-dv">{row.value}</div>
                            </div>
                        ))}
                    </>
                )}

                {/* Note Block */}
                <div className={`profile-mobile-note ${currentNote.variant}`}>
                    <div className="profile-mobile-note-title">{currentNote.title}</div>
                    <div className="profile-mobile-note-text">{currentNote.text}</div>
                </div>

                {/* Action Buttons */}
                <button type="button" className="profile-mobile-sbtn-p active">
                    {currentActions.primary}
                </button>
                <button type="button" className="profile-mobile-sbtn-s">
                    {currentActions.secondary}
                </button>
            </div>
        </MobileBottomSheet>
    );
};

export default MobileListedDetailSheet;