import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import SignOutModal from '../modals/SignOutModal';
import Toast from '../ui/Toast';
import "../../../styles/Profile/left/SignOutButton.css";

const SignOutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSignOut = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSignOut = () => {
    setIsModalOpen(false);
    setToastMessage("Signed out successfully");
    setShowToast(true);
    // Add actual sign out logic here
    console.log("User signed out");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="profile-signout-btn" onClick={handleSignOut}>
        <LogOut size={13} strokeWidth={1.5} />
        <span>Sign Out</span>
      </button>

      <SignOutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSignOut}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default SignOutButton;