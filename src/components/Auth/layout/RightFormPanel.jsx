import React from 'react';
import '../../../styles/Auth/layout/RightFormPanel.css';

const RightFormPanel = ({ children }) => {
  return (
    <div className="hok-auth-right-panel">
      <div className="hok-auth-form-wrap">
        {children}
      </div>
    </div>
  );
};

export default RightFormPanel;