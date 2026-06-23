import React, { useState, useEffect } from "react";
import "../../../styles/aboutus/shared/toast.css";

let toastTimer = null;
let toastCallback = null;

const Toast = () => {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Expose showToast globally for this page
    window.showAboutToast = (msg, callback) => {
      setMessage(msg);
      setIsVisible(true);
      
      if (toastCallback) {
        toastCallback();
        toastCallback = null;
      }
      
      if (callback) {
        toastCallback = callback;
      }

      if (toastTimer) {
        clearTimeout(toastTimer);
      }

      toastTimer = setTimeout(() => {
        setIsVisible(false);
        if (toastCallback) {
          toastCallback();
          toastCallback = null;
        }
      }, 2200);
    };

    // Cleanup
    return () => {
      if (toastTimer) {
        clearTimeout(toastTimer);
      }
      window.showAboutToast = undefined;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="au-toast show">
      <span className="au-toast__message">{message}</span>
    </div>
  );
};

// Helper function for components to use
export const showToast = (message, callback) => {
  if (window.showAboutToast) {
    window.showAboutToast(message, callback);
  } else {
    console.warn("Toast not initialized yet:", message);
  }
};

export default Toast;