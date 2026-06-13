import { useState, useEffect } from "react";
import DesktopCategoryPage from "../../components/MainCategory/DesktopCategoryPage";
import MobileCategoryPage from "../../components/MainCategory/Mobile/MobileCategoryPage";

const MainCategoryPage = () => {
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

  return isMobile ? <MobileCategoryPage /> : <DesktopCategoryPage />;
};

export default MainCategoryPage;