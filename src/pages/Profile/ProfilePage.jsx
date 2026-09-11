import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import ProfileLayout from "../../components/Profile/layout/ProfileLayout";
import MobileProfileLayout from "../../components/Profile/layout/MobileProfileLayout";
import "../../styles/Profile/ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, isCheckingAuth, navigate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (isCheckingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      {isMobile ? <MobileProfileLayout /> : <ProfileLayout />}
    </div>
  );
};

export default ProfilePage;