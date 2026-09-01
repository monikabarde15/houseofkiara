// src\components\Home\Categories\MobileCategories.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import categoriesData from "../../../data/home/categoriesData";

const MobileCategories = () => {
  const slides = useMemo(
    () => [...categoriesData.rowOne, ...categoriesData.rowTwo],[] );
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = slides.length;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    touchEndX.current = event.changedTouches[0].clientX;

    const swipeDistance =
      touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) < 44) {
      return;
    }

    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  const handleMobileCategoryClick = (slide) => {
    navigate(`/main-page?section=new&category=${slide.variant}`);
  }

  return (
    <section
      className="mobile-categories"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`mobile-category-slide ${
            activeSlide === index
              ? "mobile-category-slide-active"
              : ""
          }`}
        >
          <img
            src={slide.mobile.image}
            alt={slide.name}
            className="mobile-category-image"
          />

          <div className="mobile-category-overlay" />

          <div className="mobile-category-content">
            <span className="mobile-category-eyebrow">
              {slide.mobile.eyebrow}
            </span>

            <h2 className="mobile-category-title">
              {slide.name}
            </h2>

            <p className="mobile-category-count">
              {slide.mobile.pieces}
            </p>

            <button className="mobile-category-cta"
              onClick={()=>handleMobileCategoryClick(slide)}
            >
              <span>{slide.cta}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      ))}

      <div className="mobile-category-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`mobile-category-dot ${
              activeSlide === index
                ? "mobile-category-dot-active"
                : ""
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className="mobile-category-arrows">
        <button
          className="mobile-category-arrow"
          onClick={prevSlide}
        >
          <ChevronLeft size={11} />
        </button>

        <button
          className="mobile-category-arrow"
          onClick={nextSlide}
        >
          <ChevronRight size={11} />
        </button>
      </div>
    </section>
  );
};

export default MobileCategories;