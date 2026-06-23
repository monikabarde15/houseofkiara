import React, { useEffect, useRef } from "react";
import "../../../styles/aboutus/shared/scroll-progress-bar.css";

const ScrollProgressBar = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }
    };

    // Update on scroll (passive listener)
    window.addEventListener("scroll", updateProgress, { passive: true });
    
    // Update on load
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="scroll-progress-bar" ref={progressRef}></div>
  );
};

export default ScrollProgressBar;