// src\components\Profile\left\LeftColumn.jsx
import React from 'react';
import "../../../styles/Profile/left/LeftColumn.css";
import IdentityCard from './IdentityCard';
import LeftNav from './LeftNav';
import SignOutButton from './SignOutButton';

const LeftColumn = () => {
  return (
    <div className="profile-left-column">
      <div className="profile-left-column-content">
        {/* Identity Card  */}
        <IdentityCard />
        {/* Left Navigation*/}
        <LeftNav />
        {/* Sign Out Button */}
        <SignOutButton/>
      </div>
    </div>
  );
};

export default LeftColumn;