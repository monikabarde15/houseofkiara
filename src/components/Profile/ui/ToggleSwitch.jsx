import React, { useState } from 'react';
import "../../../styles/Profile/ui/ToggleSwitch.css";

const ToggleSwitch = ({ isOn, onToggle }) => {
  const [onState, setOnState] = useState(isOn);

  const handleToggle = () => {
    const newState = !onState;
    setOnState(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button 
      className={`profile-account-tog ${!onState ? 'profile-account-tog-off' : ''}`}
      onClick={handleToggle}
    />
  );
};

export default ToggleSwitch;