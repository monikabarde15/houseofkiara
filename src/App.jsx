import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Home Sections
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Featured from "./components/Featured";
import Categories from "./components/Categories";
import CommitmentSection from "./components/CommitmentSection";
import FeaturedDesigners from "./components/FeaturedDesigners";
import Testimonials from "./components/Testimonials";
import InstagramSection from "./components/InstagramSection";
import ProductDetail from "./components/ProductDetail";

// Pages
import ProductList from "./components/Products";
import BridalLehenga from "./components/BridalLehenga";
import RentalProductDetail from "./components/RentalProductDetail";
import OnlyRentalDetail from "./components/OnlyRentalDetail";
import Preloved from "./components/Preloved";

import DummyGowns from "./components/DummyGowns";


// ✅ Home Page Component
function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Featured />
      <Categories />
      <CommitmentSection />
      <FeaturedDesigners />
      <Testimonials />
      <InstagramSection />
    </>
  );
}

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Products Page */}
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/rent/bridal-lehengas" element={<BridalLehenga />} />
        <Route path="/rent/gowns" element={<DummyGowns />} />
        <Route path="/rental/:id" element={<RentalProductDetail />} />
        <Route path="/onlyrental/:id" element={<OnlyRentalDetail />} />
        <Route path="/preloved/:id" element={<Preloved />} />
      </Routes>

      <Footer />
    </>
  );
}