import React from "react";

import "../../styles/shared/SectionTitle.css";

const SectionTitle = ({ children }) => {
  return (
    <h2 className="hok-section-title">
      {children}
    </h2>
  );
};

export default SectionTitle;