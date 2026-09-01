import React from "react";
import "../../../styles/maincategorypage/mobile/mobile-active-tags-row.css";

const MobileActiveTagsRow = ({ activeTags = [], onRemoveTag, onClearAll }) => {
  // If no active tags, don't render anything
  if (!activeTags || activeTags.length === 0) {
    return null;
  }

  return (
    <div className="mob-active-tags-row">
      <div className="mob-active-tags-row__scroll">
        
        {/* Individual Tag Chips */}
        {activeTags.map((tag, index) => (
          <button
            key={`${tag}-${index}`}
            className="mob-active-tags-row__tag"
            onClick={() => onRemoveTag(tag)}
          >
            <span>{tag}</span>
            <svg
              className="mob-active-tags-row__tag-close"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ))}

        {/* Clear All Button */}
        <button
          className="mob-active-tags-row__clear-all"
          onClick={onClearAll}
        >
          Clear All
        </button>

      </div>
    </div>
  );
};

export default MobileActiveTagsRow;