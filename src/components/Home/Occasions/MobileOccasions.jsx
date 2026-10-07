import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import defaultOccasionsData from "../../../data/home/occasionsData";

const MobileOccasions = ({ data }) => {
  const items = useMemo(() => {
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
    return defaultOccasionsData.items;
  }, [data]);

  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalSlides = items.length;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) < 40) return;
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  const handleOccasionClick = (occasion) => {
    navigate(`/main-page?section=occasions&occasion=${encodeURIComponent(occasion.slug || occasion.name)}`);
  };

  const ctaLbl = data?.ctaLbl || "Shop the Edit";
  const showCount = data?.showCount !== false;

  return (
    <section
      className="mobile-occasions"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mobile-occasions-nav">
        <span className="mobile-occasions-counter">
          {String(activeSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="mobile-occasions-arrow"
          onClick={prevSlide}
          aria-label="Previous occasion"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="mobile-occasions-arrow"
          onClick={nextSlide}
          aria-label="Next occasion"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {items.map((slide, index) => (
        <div
          key={slide.id}
          className={`mobile-occasion-slide ${
            activeSlide === index ? "mobile-occasion-slide-active" : ""
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt || slide.name}
            className="mobile-occasion-image"
          />
          <div className="mobile-occasion-overlay" />

          <div className="mobile-occasion-content">
            {slide.eyebrow && (
              <span className="mobile-occasion-eyebrow">{slide.eyebrow}</span>
            )}
            <h2 className="mobile-occasion-title">{slide.name}</h2>
            {showCount && slide.count && (
              <p className="mobile-occasion-count">{slide.count}</p>
            )}
            <button
              type="button"
              className="mobile-occasion-cta"
              onClick={() => handleOccasionClick(slide)}
            >
              <span>{ctaLbl}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MobileOccasions;
