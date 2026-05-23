import React, { useState, useRef, useEffect } from 'react';
import ListedCard from '../cards/ListedCard';
import "../../../styles/Profile/sections/MyListedPiecesSection.css";
import ListedDetailPanel from '../panels/ListedDetailPanel';

const MyListedPiecesSection = () => {

    // Mock data from spec 
    const listedPieces = [
        {
            id: "LST-001-2025",
            name: "Crimson Bridal Lehenga",
            designer: "Tarun Tahiliani",
            mode: "Rental",
            price: 9500,
            totalEarned: 15200,
            timesRented: 4,
            nextPayout: 3800,
            imageGradient: "linear-gradient(160deg, #2C2018, #1A1210)",
            status: "active",
            listedSince: "Jan 2025",
            size: "L",
            priceLabel: "Rental price",
            price: 9500,
            priceSuffix: " / booking"
        },
        {
            id: "LST-002-2025",
            name: "Blue Tissue Kanjivaram Saree",
            designer: "Kanjivaram Weavers Co-op",
            mode: "Resale",
            price: 42000,
            totalEarned: 0,
            timesRented: null,
            nextPayout: null,
            imageGradient: "linear-gradient(160deg, #1E2530, #131820)",
            status: "active",
            listedSince: "Apr 2025",
            size: "6-yard",
            priceLabel: "Resale price",
            price: 42000,
            priceSuffix: ""
        },
        {
            id: "LST-003-2025",
            name: "Ivory Silk Anarkali Set",
            designer: "Anita Dongre",
            mode: "Dual",
            rentalPrice: 5500,
            resalePrice: 28000,
            totalEarned: 2200,
            timesRented: 1,
            nextPayout: 2200,
            imageGradient: "linear-gradient(160deg, #2A3828, #1A2418)",
            status: "active",
            listedSince: "Mar 2025",
            size: "M",
            rentalPrice: 5500,
            rentalPriceSuffix: " / booking",
            resalePrice: 28000,
            resalePriceSuffix: ""
        }
    ];

    const [activeCardId, setActiveCardId] = useState(null);
    const panelRef = useRef(null);
    const cardRefs = useRef({});
    const scrollTimeoutRef = useRef(null);



    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    const handleDetailsClick = (pieceId) => {
        const isOpening = activeCardId !== pieceId;

        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        if (isOpening) {
            setActiveCardId(pieceId);

            scrollTimeoutRef.current = setTimeout(() => {
                if (panelRef.current) {
                    panelRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
                scrollTimeoutRef.current = null;
            }, 40);
        } else {
            const currentCardId = activeCardId;
            setActiveCardId(null);

            scrollTimeoutRef.current = setTimeout(() => {
                const cardElement = cardRefs.current[currentCardId];
                if (cardElement) {
                    cardElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
                scrollTimeoutRef.current = null;
            }, 40);
        }
    };

    const activePiece = listedPieces.find(p => p.id === activeCardId);

    return (


        <div className="profile-listed-section" id="listed">
            {/* Explainer Banner */}
            <div className="profile-listed-earnings-banner">
                <div className="profile-listed-earnings-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </div>
                <div className="profile-listed-earnings-text">
                    Earnings are attributed per completed booking. Payouts are processed manually by the House of Kaira team and confirmed via WhatsApp and email.
                </div>
            </div>

            {/* Listed Cards Grid */}
            <div className="profile-listed-grid">
                {listedPieces.map((piece) => (
                    <div
                        key={piece.id}
                        ref={(el) => { if (el) cardRefs.current[piece.id] = el; }}
                    >
                        <ListedCard
                            piece={piece}
                            isActive={activeCardId === piece.id}
                            onDetailsClick={handleDetailsClick}
                        />
                    </div>
                ))}
            </div>
            {/* Detail Panel */}
            <div ref={panelRef}>
                <ListedDetailPanel
                    piece={activePiece}
                    isOpen={!!activeCardId}
                    onClose={() => handleDetailsClick(activeCardId)}
                />
            </div>
        </div>
    );
};

export default MyListedPiecesSection;