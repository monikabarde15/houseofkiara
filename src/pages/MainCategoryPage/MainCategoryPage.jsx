import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DesktopCategoryPage from "../../components/MainCategory/DesktopCategoryPage";
import MobileCategoryPage from "../../components/MainCategory/Mobile/MobileCategoryPage";

const MainCategoryPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    fetch(`${backendUrl}/api/web-products${location.search}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F7F4EF', color: '#B8A98E' }}>Loading Products...</div>;
  }

  return isMobile ? <MobileCategoryPage productsData={products} /> : <DesktopCategoryPage productsData={products} />;
};

export default MainCategoryPage;