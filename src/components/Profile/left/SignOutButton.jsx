// src\components\Profile\left\SignOutButton.jsx
import React from 'react';
import { LogOut } from 'lucide-react';
import "../../../styles/Profile/left/SignOutButton.css";

const SignOutButton = () => {
  const handleSignOut = () => {
    // Will open Sign Out confirmation modal (Section 15.2)
    console.log("Open Sign Out modal");
  };

  return (
    <button className="profile-signout-btn" onClick={handleSignOut}>
      <LogOut />
      <span>Sign Out</span>
    </button>
  );
};

export default SignOutButton;