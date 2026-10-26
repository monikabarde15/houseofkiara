import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListedCard from '../cards/ListedCard';
import "../../../styles/Profile/sections/MyListedPiecesSection.css";
import ListedDetailPanel from '../panels/ListedDetailPanel';

const MyListedPiecesSection = ({ listedPieces }) => {
  const piecesList = Array.isArray(listedPieces) ? listedPieces : [];
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
            block: 'nearest',
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
            block: 'nearest',
          });
        }
        scrollTimeoutRef.current = null;
      }, 40);
    }
  };

  const activePiece = piecesList.find((p) => p.id === activeCardId);

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

      {piecesList.length === 0 ? (
        <div className="profile-sub-empty" style={{ margin: "14px 0 20px" }}>
          <div className="profile-se-h">No listed pieces yet</div>
          <div className="profile-se-s">
            Have designer couture in your wardrobe? List your pieces with House of Kaira and monetize effortlessly.
          </div>
          <Link to="/list-your-piece/" className="profile-se-btn" style={{ textDecoration: 'none' }}>
            List Your Piece
          </Link>
        </div>
      ) : (
        <>
          {/* Listed Cards Grid */}
          <div className="profile-listed-grid">
            {piecesList.map((piece) => (
              <div
                key={piece.id}
                ref={(el) => {
                  if (el) cardRefs.current[piece.id] = el;
                }}
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
        </>
      )}
    </div>
  );
};

export default MyListedPiecesSection;