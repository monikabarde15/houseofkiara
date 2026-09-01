import React from "react";

import "../../styles/shared/SectionEyebrow.css";

const SectionEyebrow = ({
  text,
  centered = false,
}) => {
  return (
    <div
      className={`hok-section-eyebrow ${
        centered
          ? "hok-section-eyebrow-centered"
          : ""
      }`}
    >
      <span className="hok-section-eyebrow-line"></span>

      <span className="hok-section-eyebrow-text">
        {text}
      </span>

      {centered && (
        <span className="hok-section-eyebrow-line"></span>
      )}
    </div>
  );
};

export default SectionEyebrow;