import React from "react";
import "../../../styles/maincategorypage/mobile/mobile-breadcrumb.css";

const MobileBreadcrumb = ({ parent, current }) => {
  return (
    <div className="mob-breadcrumb">
      <span className="mob-breadcrumb__link">Home</span>
      <span className="mob-breadcrumb__separator">›</span>
      <span className="mob-breadcrumb__link">{parent}</span>
      <span className="mob-breadcrumb__separator">›</span>
      <span className="mob-breadcrumb__current">{current}</span>
    </div>
  );
};

export default MobileBreadcrumb;