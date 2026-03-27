import React from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Featured from "./components/Featured";
import Categories from "./components/Categories";
import CommitmentSection from "./components/CommitmentSection";
import FeaturedDesigners from "./components/FeaturedDesigners";
import Testimonials from "./components/Testimonials";
import InstagramSection from "./components/InstagramSection";

import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Featured />
      <Categories />
      <CommitmentSection />
      <FeaturedDesigners />
      <Testimonials />
      <InstagramSection />
      <Footer />
    </>
  );
}