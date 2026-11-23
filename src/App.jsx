// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import useAuthStore from "./store/authStore";
import { getProductDetailRoute } from "./utils/productNavigation";
import { getGoogleSettings, applyGoogleToDocument } from "./services/googleApi";
import {
  getMaintenanceSettings,
  defaultMaintenanceConfig,
  isUserBypassingMaintenance,
} from "./services/maintenanceApi";

// Layout
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CookieBannerContainer from "./components/cookieBanner/CookieBannerContainer";

import ProductList from "./components/Products";
import BuyNew from "./components/ProductCategory/BuyNew";
import Preloved from "./components/ProductCategory/Preloved";
import OnlyRentalDetail from "./components/ProductCategory/OnlyRentalDetail";
import RentalAndPreloved from "./components/ProductCategory/RentalAndPreloved";
import RentalAndBuy from "./components/ProductCategory/RentalAndBuy";
import DummyGowns from "./components/DummyGowns";

import HomePage from "./pages/HomePage/HomePage";
import LypMain from "./components/LYP/LypMain";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import ConfirmationPage from "./pages/Confirmation/ConfirmationPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import WishlistPage from "./pages/Wishlist/WishlistPage";
import AuthPage from "./pages/Auth/AuthPage";
import MainCategoryPage from "./pages/MainCategoryPage/MainCategoryPage";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage";
import FAQPage from "./pages/FAQPage/FAQPage";
import RefundsPage from "./pages/Refunds/RefundsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiePage from "./pages/CookiePage";
import DepositPage from "./pages/DepositPage";
import CarePolicyPage from "./pages/CarePolicyPage";
import SellerGuidelinesPage from "./pages/SellerGuidelinesPage";
import ContactUsPage from "./pages/ContactUsPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import NoSearchResultsPage from "./pages/NoSearchResultsPage";
import PageNotFound from "./pages/PageNotFound";
import MaintenancePage from "./pages/MaintenancePage";
import PricingPolicyPage from "./pages/PricingPolicyPage";
import { DynamicPageRoute, CustomSlugDynamicPage } from "./components/common/DynamicPageRoute";

function ProductRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/products/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json?.success && json?.data) {
          const { path } = getProductDetailRoute(json.data);
          navigate(path, { replace: true, state: { product: json.data } });
        } else {
          navigate(`/onlyrental/${id}`, { replace: true });
        }
      })
      .catch(() => {
        if (isMounted) navigate(`/onlyrental/${id}`, { replace: true });
      });
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  return null;
}

export default function App() {
  const location = useLocation();
  const [maintenanceConfig, setMaintenanceConfig] = useState(defaultMaintenanceConfig);

  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    useAuthStore.getState().checkAuth();

    let isMounted = true;
    getGoogleSettings().then((google) => {
      if (isMounted && google) {
        applyGoogleToDocument(google);
      }
    });

    getMaintenanceSettings().then((cfg) => {
      if (isMounted && cfg) {
        setMaintenanceConfig(cfg);
      }
    });

    const handleGoogleUpdate = () => {
      getGoogleSettings(true).then((google) => {
        if (isMounted && google) {
          applyGoogleToDocument(google);
        }
      });
    };

    const handleMaintenanceUpdate = () => {
      getMaintenanceSettings(true).then((cfg) => {
        if (isMounted && cfg) {
          setMaintenanceConfig(cfg);
        }
      });
    };

    window.addEventListener("hok_google_updated", handleGoogleUpdate);
    window.addEventListener("hok_maintenance_updated", handleMaintenanceUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("hok_google_updated", handleGoogleUpdate);
      window.removeEventListener("hok_maintenance_updated", handleMaintenanceUpdate);
    };
  }, []);

  // Periodic polling when maintenance is active to immediately restore site when disabled in CMS
  useEffect(() => {
    if (!maintenanceConfig?.maintenance?.enabled) return;

    const interval = setInterval(() => {
      getMaintenanceSettings(true).then((cfg) => {
        if (cfg) {
          setMaintenanceConfig(cfg);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [maintenanceConfig?.maintenance?.enabled]);

  // Track SPA route navigation if tracking is configured
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (typeof window.gtag === "function" && window.__hok_ga_id) {
        window.gtag("event", "page_view", {
          page_path: location.pathname + location.search,
        });
      }
      if (typeof window.fbq === "function" && window.__hok_pixel_id) {
        window.fbq("track", "PageView");
      }
    }
  }, [location.pathname, location.search]);

  // Check if visitor bypasses maintenance mode
  const isBypassed = isUserBypassingMaintenance(
    authUser,
    maintenanceConfig?.maintenance?.allowList
  );

  const isMaintenanceActive =
    Boolean(maintenanceConfig?.maintenance?.enabled) && !isBypassed;

  const isMaintenancePage =
    location.pathname === "/maintenance" || isMaintenanceActive;

  // Global Toaster config
  const toasterElement = (
    <Toaster
      position="top-right"
      containerStyle={{
        top: 55,
        right: 28,
        zIndex: 99999,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1e1412',
          color: '#fcf9f5',
          border: '1px solid #c5a880',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(197, 168, 128, 0.25)',
          borderRadius: '8px',
          padding: '12px 20px',
          fontSize: '13.5px',
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          maxWidth: '400px',
        },
        success: {
          iconTheme: {
            primary: '#c5a880',
            secondary: '#1e1412',
          },
        },
        error: {
          style: {
            background: '#1e1412',
            color: '#fcf9f5',
            border: '1px solid #e06c75',
          },
          iconTheme: {
            primary: '#e06c75',
            secondary: '#1e1412',
          },
        },
      }}
    />
  );

  // When maintenance is active, all public routes show maintenance, but auth and admin routes stay accessible
  if (
    isMaintenanceActive &&
    location.pathname !== "/auth" &&
    !location.pathname.startsWith("/hok_admin")
  ) {
    return (
      <>
        {toasterElement}
        <MaintenancePage settings={maintenanceConfig.maintenance} />
      </>
    );
  }

  return (
    <>
      {toasterElement}
      {!isMaintenancePage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Products Page */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/main-page" element={<MainCategoryPage/>} />
        <Route path="/search" element={<NoSearchResultsPage />} />

        <Route path="/buynew/:id" element={<BuyNew />} />
        <Route path="/preloved/:id" element={<Preloved />} />
        <Route path="/onlyrental/:id" element={<OnlyRentalDetail />} />
        <Route path="/rentalandpreloved/:id" element={<RentalAndPreloved />} />
        <Route path="/rentalandbuy/:id" element = {<RentalAndBuy/>} />
        <Route path="/product/:id" element={<ProductRedirect />} />

        {/* <Route path="/rent/gowns" element={<DummyGowns />} /> */}
        <Route path="/list-your-piece/" element={<LypMain />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/how-it-works" element={<DynamicPageRoute slug="/how-it-works" fallback={<HowItWorks />} />} />
        <Route path="/about-us" element={<DynamicPageRoute slug="/about" fallback={<AboutUsPage />} />} />
        <Route path="/faqs" element={<DynamicPageRoute slug="/faqs" fallback={<FAQPage />} />} />
        <Route path="/shipping-policy" element={<DynamicPageRoute slug="/shipping-policy" fallback={<ShippingPolicyPage />} />} />
        <Route path="/shipping" element={<Navigate to="/shipping-policy" replace />} />
        <Route path="/shipping-and-delivery" element={<Navigate to="/shipping-policy" replace />} />
        <Route path="/refunds" element={<DynamicPageRoute slug="/refunds" fallback={<RefundsPage />} />} />
        <Route path="/refunds-cancellations" element={<Navigate to="/refunds" replace />} />
        <Route path="/refund" element={<Navigate to="/refunds" replace />} />
        <Route path="/terms" element={<DynamicPageRoute slug="/terms" fallback={<TermsPage />} />} />
        <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
        <Route path="/terms-conditions" element={<Navigate to="/terms" replace />} />
        <Route path="/privacy" element={<DynamicPageRoute slug="/privacy" fallback={<PrivacyPage />} />} />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/cookies" element={<DynamicPageRoute slug="/cookies" fallback={<CookiePage />} />} />
        <Route path="/cookie" element={<Navigate to="/cookies" replace />} />
        <Route path="/cookie-policy" element={<Navigate to="/cookies" replace />} />
        <Route path="/deposit" element={<DynamicPageRoute slug="/deposit-policy" fallback={<DepositPage />} />} />
        <Route path="/deposit-policy" element={<Navigate to="/deposit" replace />} />
        <Route path="/care-policy" element={<DynamicPageRoute slug="/care-policy" fallback={<CarePolicyPage />} />} />
        <Route path="/care" element={<Navigate to="/care-policy" replace />} />
        <Route path="/care-cleaning-damage" element={<Navigate to="/care-policy" replace />} />
        <Route path="/care-damage" element={<Navigate to="/care-policy" replace />} />
        <Route path="/seller-guidelines" element={<DynamicPageRoute slug="/seller-guidelines" fallback={<SellerGuidelinesPage />} />} />
        <Route path="/seller" element={<Navigate to="/seller-guidelines" replace />} />
        <Route path="/seller-faq" element={<Navigate to="/seller-guidelines" replace />} />
        <Route path="/pricing-fees" element={<DynamicPageRoute slug="/pricing-fees" fallback={<PricingPolicyPage />} />} />
        <Route path="/pricing" element={<Navigate to="/pricing-fees" replace />} />
        <Route path="/contact-us" element={<DynamicPageRoute slug="/contact" fallback={<ContactUsPage />} />} />
        <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
        <Route path="/contactus" element={<Navigate to="/contact-us" replace />} />
        <Route
          path="/maintenance"
          element={<MaintenancePage settings={maintenanceConfig.maintenance} />}
        />
        <Route path="/p/:slug" element={<CustomSlugDynamicPage />} />
        <Route path="/:slug" element={<CustomSlugDynamicPage />} />
        {/* Wildcard 404 handler: preserves exact requested address */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {!isMaintenancePage && <Footer />}

      {/* Global Cookie Banner & Consent Controller */}
      {!isMaintenancePage && <CookieBannerContainer />}
    </>
  );
}
