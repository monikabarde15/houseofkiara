// src/components/Header/mobile/MobileSubPanelContent.jsx
import React from 'react';

const MobileSubPanelContent = ({ children }) => {
  return <>{children}</>;
};

// Sub-Label Component
export const SubLabel = ({ children }) => {
  return <div className="drawer-sub-label">{children}</div>;
};

// Link Row Component
export const LinkRow = ({ children, onClick, isUtility = false }) => {
  return (
    <button className="drawer-link" onClick={onClick}>
      <span 
        className={isUtility ? "drawer-link-sans" : "drawer-link-serif"}
        data-utility={isUtility ? "true" : "false"}
      >
        {children}
      </span>
      <svg className="drawer-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

export default MobileSubPanelContent;