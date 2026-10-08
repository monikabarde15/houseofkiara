// src\App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import useAuthStore from "./store/authStore";

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

export default function App() {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1412',
            color: '#fcf9f5',
            border: '1px solid #c5a880',
            fontSize: '13px',
            fontFamily: 'sans-serif',
            zIndex: 9999,
          },
          success: {
            iconTheme: {
              primary: '#c5a880',
              secondary: '#1e1412',
            },
          },
        }}
      />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Products Page */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/main-page" element={<MainCategoryPage/>} />

        <Route path="/buynew/:id" element={<BuyNew />} />
        <Route path="/preloved/:id" element={<Preloved />} />
        <Route path="/onlyrental/:id" element={<OnlyRentalDetail />} />
        <Route path="/rentalandpreloved/:id" element={<RentalAndPreloved />} />
        <Route path="/rentalandbuy/:id" element = {<RentalAndBuy/>} />

        {/* <Route path="/rent/gowns" element={<DummyGowns />} /> */}
        <Route path="/list-your-piece/" element={<LypMain />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/refunds" element={<RefundsPage />} />
        <Route path="/refunds-cancellations" element={<Navigate to="/refunds" replace />} />
        <Route path="/refund" element={<Navigate to="/refunds" replace />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
        <Route path="/terms-conditions" element={<Navigate to="/terms" replace />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/cookies" element={<CookiePage />} />
        <Route path="/cookie" element={<Navigate to="/cookies" replace />} />
        <Route path="/cookie-policy" element={<Navigate to="/cookies" replace />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/deposit-policy" element={<Navigate to="/deposit" replace />} />
        <Route path="/care-policy" element={<CarePolicyPage />} />
        <Route path="/care" element={<Navigate to="/care-policy" replace />} />
        <Route path="/care-cleaning-damage" element={<Navigate to="/care-policy" replace />} />
        <Route path="/care-damage" element={<Navigate to="/care-policy" replace />} />
        <Route path="/seller-guidelines" element={<SellerGuidelinesPage />} />
        <Route path="/seller" element={<Navigate to="/seller-guidelines" replace />} />
        <Route path="/seller-faq" element={<Navigate to="/seller-guidelines" replace />} />

      </Routes>

      <Footer />

      {/* Global Cookie Banner & Consent Controller */}
      <CookieBannerContainer />
    </>
  );
}