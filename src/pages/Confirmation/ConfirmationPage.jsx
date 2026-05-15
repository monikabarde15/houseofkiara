import { useState, useEffect } from "react";
import ConfirmationLayout from "../../components/Confirmation/layout/ConfirmationLayout";
import MobileConfirmationLayout from "../../components/Confirmation/Mobile/layout/MobileConfirmationLayout";
import "../../styles/confirmation/confirmation-page.css";

const ConfirmationPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Add listener
    mediaQuery.addEventListener("change", handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="confirmation-page">
      {isMobile ? <MobileConfirmationLayout /> : <ConfirmationLayout />}
    </div>
  );
};

export default ConfirmationPage;