// src\pages\Profile\ProfilePage.jsx

import { useState, useEffect } from "react";
import ProfileLayout from "../../components/Profile/layout/ProfileLayout";
import MobileProfileLayout from "../../components/Profile/layout/MobileProfileLayout";
import "../../styles/Profile/ProfilePage.css";
// import "../../styles/Profile/layout/profile.css";

const ProfilePage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="profile-page">
      {isMobile ? <MobileProfileLayout /> : <ProfileLayout />}
    </div>
  );
};

export default ProfilePage;