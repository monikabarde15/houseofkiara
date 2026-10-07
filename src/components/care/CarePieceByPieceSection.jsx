/**
 * House of Kaira - Care Policy "Care, piece by piece" (Component C11)
 * Sections 5.11, 6.3, 7.7, 9 of Build Specification 2.0
 */

import React, { useRef, useEffect } from "react";
import CareNotesList from "./CareNotesList";
import { PIECE_BY_PIECE_DATA } from "../../data/care/careRegistry";

export default function CarePieceByPieceSection({
  activePieceChip,
  onPieceChipChange
}) {
  const scrollContainerRef = useRef(null);
  const chipRefs = useRef({});

  const currentPiece =
    PIECE_BY_PIECE_DATA.find((p) => p.id === activePieceChip) ||
    PIECE_BY_PIECE_DATA[0];

  // Auto-scroll selected chip to center on mobile (Section 6.3)
  useEffect(() => {
    const activeEl = chipRefs.current[activePieceChip];
    if (activeEl && scrollContainerRef.current) {
      const isMobile = window.innerWidth <= 760;
      if (isMobile) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest"
        });
      }
    }
  }, [activePieceChip]);

  // Arrow key navigation with wrapping (Section 6.3 & 9)
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % PIECE_BY_PIECE_DATA.length;
      const nextPiece = PIECE_BY_PIECE_DATA[nextIndex];
      onPieceChipChange(nextPiece.id);
      chipRefs.current[nextPiece.id]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex =
        (index - 1 + PIECE_BY_PIECE_DATA.length) % PIECE_BY_PIECE_DATA.length;
      const prevPiece = PIECE_BY_PIECE_DATA[prevIndex];
      onPieceChipChange(prevPiece.id);
      chipRefs.current[prevPiece.id]?.focus();
    }
  };

  // Render heading with gold italic em per Section 7.7
  const renderPieceHeading = (piece) => {
    switch (piece.id) {
      case "lehenga":
        return <>Caring for a <em>lehenga</em></>;
      case "saree":
        return <>Caring for a <em>saree</em></>;
      case "sets":
        return <>Caring for an <em>anarkali, sharara or kurta set</em></>;
      case "gowns":
        return <>Caring for a <em>gown or Indo-western piece</em></>;
      case "men":
        return <>Caring for a <em>sherwani or bandhgala</em></>;
      default:
        return piece.title;
    }
  };

  return (
    <section className="mod" id="mod-pieces" aria-labelledby="pieces-title">
      <div className="mod-hd">
        <h2 id="pieces-title">
          Care, piece by <em>piece</em>
        </h2>
        <p>Every kind of piece has its own small habits. Choose yours.</p>
      </div>

      <div
        className="pc-chips"
        ref={scrollContainerRef}
        role="tablist"
        aria-label="Kinds of piece"
      >
        {PIECE_BY_PIECE_DATA.map((piece, idx) => {
          const isSelected = piece.id === activePieceChip;
          return (
            <button
              key={piece.id}
              ref={(el) => (chipRefs.current[piece.id] = el)}
              type="button"
              role="tab"
              id={`chip-${piece.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${piece.id}`}
              tabIndex={isSelected ? 0 : -1}
              className="pc-chip"
              onClick={() => onPieceChipChange(piece.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {piece.chip}
            </button>
          );
        })}
      </div>

      <div
        className="pc-panel swap"
        key={currentPiece.id}
        role="tabpanel"
        id={`panel-${currentPiece.id}`}
        aria-labelledby={`chip-${currentPiece.id}`}
      >
        <h3>{renderPieceHeading(currentPiece)}</h3>
        <CareNotesList notes={currentPiece.points} />
      </div>
    </section>
  );
}
