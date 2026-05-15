// src\components\Confirmation\sidebar\ReturnReminder.jsx
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import "../../../styles/confirmation/sidebar/return-reminder.css";

const ReturnReminder = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    setIsMobile(mediaQuery.matches);
    
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div
      className="confirmation-return-reminder"
      data-rise={isMobile ? "2" : "3"}
    >
      <div className="confirmation-return-reminder-icon">
        <Info size={13} strokeWidth={1.5} />
      </div>
      <div className="confirmation-return-reminder-content">
        <div className="confirmation-return-reminder-title">
          Return deadline: 18 Nov (Tuesday)
        </div>
        <p className="confirmation-return-reminder-text">
          Prepaid Blue Dart label in packaging.
          Deposit refunded within 3–5 days of inspection.
        </p>
      </div>
    </div>
  );
};

export default ReturnReminder;