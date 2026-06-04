import React from 'react';
import '../../../styles/Auth/ui/BackLink.css';

const BackLink = ({ onClick, label = "& BACK" }) => {
  return (
    <button className="hok-auth-back-link" onClick={onClick}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default BackLink;