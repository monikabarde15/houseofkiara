import { useState, useEffect } from "react";
import DesktopAboutUs from "../../components/AboutUs/Desktop/DesktopAboutUs";
import MobileAboutUs from "../../components/AboutUs/Mobile/MobileAboutUs";
import { usePageContent } from "../../hooks/usePageContent";

const AboutUsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { getVal } = usePageContent("/about");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");

    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile ? <MobileAboutUs getVal={getVal} /> : <DesktopAboutUs getVal={getVal} />;
};

export default AboutUsPage;
