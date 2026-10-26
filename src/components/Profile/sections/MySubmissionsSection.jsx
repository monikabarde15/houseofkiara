import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Plus } from 'lucide-react';
import SubmissionCard from '../cards/SubmissionCard';
import SubmissionDetailPanel from '../panels/SubmissionDetailPanel';
import "../../../styles/Profile/sections/MySubmissionsSection.css";

const MySubmissionsSection = ({ submissions }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const submissionsList = Array.isArray(submissions) ? submissions : [];

  const navigate = useNavigate();

  const handleSubmitNewPiece = () => {
    navigate("/list-your-piece/");
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = (cardId) => {
    const isOpening = activeCardId !== cardId;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      setActiveCardId(cardId);
      
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

  const activeSubmission = submissionsList.find(s => s.id === activeCardId);

  return (
    <div className="profile-submissions-section" id="submissions">
      {/* Submission Cards */}
      {submissionsList.length > 0 && (
        <div className="profile-submissions-list">
          {submissionsList.map((submission) => (
            <div
              key={submission.id}
              ref={(el) => {
                if (el) cardRefs.current[submission.id] = el;
              }}
            >
              <SubmissionCard
                submission={submission}
                isActive={activeCardId === submission.id}
                onClick={handleCardClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      <div ref={panelRef}>
        <SubmissionDetailPanel
          submission={activeSubmission}
          isOpen={!!activeCardId}
          onClose={() => handleCardClick(activeCardId)}
        />
      </div>

      {/* Empty State / List Another Prompt - Always shown below cards */}
      <div className="profile-sub-empty">
        <div className="profile-se-h">List another piece?</div>
        <div className="profile-se-s">
          Your wardrobe can earn for you. We handle pickup, photography, delivery, and returns.
        </div>
        <button className="profile-se-btn" onClick={handleSubmitNewPiece}>
          <Plus size={14} strokeWidth={1.5} />
          Submit a New Piece
        </button>
      </div>

      
    </div>
  );
};

export default MySubmissionsSection;