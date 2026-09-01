import { useState, useEffect } from "react";
import AuthLayout from "../../components/Auth/layout/AuthLayout";
import "../../styles/Auth/AuthPage.css";

const AuthPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 860px)");
    const handleChange = (e) => setIsMobile(e.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="hok-auth-page">
      <AuthLayout isMobile={isMobile} />
    </div>
  );
};

export default AuthPage;