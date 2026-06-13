// src\App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";



// Pages
import ProductList from "./components/Products";
import RentalAndPreloved from "./components/RentalAndPreloved";
import OnlyRentalDetail from "./components/OnlyRentalDetail";
import Preloved from "./components/Preloved";
import RentalAndBuy from "./components/RentalAndBuy";
import ProductDetail from "./components/ProductDetail";
import DummyGowns from "./components/DummyGowns";

// LYP

import HomePage from "./pages/HomePage/HomePage";
import LypMain from "./components/LYP/LypMain";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import ConfirmationPage from "./pages/Confirmation/ConfirmationPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import WishlistPage from "./pages/Wishlist/WishlistPage";
import AuthPage from "./pages/Auth/AuthPage";
import MainCategoryPage from "./pages/MainCategoryPage/MainCategoryPage";



export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Products Page */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/main-page" element={<MainCategoryPage/>} />
        <Route path="/rent/gowns" element={<DummyGowns />} />
        <Route path="/rentalandpreloved/:id" element={<RentalAndPreloved />} />
        <Route path="/onlyrental/:id" element={<OnlyRentalDetail />} />
        <Route path="/preloved/:id" element={<Preloved />} />
        <Route path="/rentalandbuy/:id" element = {<RentalAndBuy/>} />
        <Route path="/list-your-piece/" element={<LypMain />} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/auth" element={<AuthPage />} />

      </Routes>

      <Footer />
    </>
  );
}