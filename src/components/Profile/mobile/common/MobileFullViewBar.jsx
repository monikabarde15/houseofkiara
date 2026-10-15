import React from 'react';
import { ChevronLeft } from 'lucide-react';
import "../../../../styles/Profile/mobile/common/MobileFullViewBar.css";

const MobileFullViewBar = ({ title, count, onBack }) => {
  return (
    <div className="profile-mobile-fv-bar">
      <button className="profile-mobile-fv-back" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={1.5} />
        Back
      </button>
      <div className="profile-mobile-fv-title">{title}</div>
      <div className="profile-mobile-fv-count">{count}</div>
    </div>
  );
};

export default MobileFullViewBar;