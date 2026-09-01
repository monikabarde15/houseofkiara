import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

import featuredDesignersData from "../../../data/home/featuredDesignersData";

const MobileDesigners = () => {
  const designers = useMemo(
    () => featuredDesignersData.designers,
    []
  );
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const touchStartX = useRef(0);

  const totalSlides = designers.length;

  const nextSlide = () => {
    setActiveIndex(
      (prev) => (prev + 1) % totalSlides
    );
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) =>
        (prev - 1 + totalSlides) % totalSlides
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (event) => {
    touchStartX.current =
      event.changedTouches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const touchEndX =
      event.changedTouches[0].clientX;

    const swipeDistance =
      touchStartX.current - touchEndX;

    if (Math.abs(swipeDistance) < 44) {
      return;
    }

    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  };


  const handleHomeDesignersClick = (designer) => {
    navigate(
      `/main-page?section=designers&designer=${designer.variant}`
    );

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <section
      className="mobile-designers"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {designers.map((designer, index) => (
        <div
          key={designer.id}
          className={`mobile-designer-slide ${
            activeIndex === index
              ? "mobile-designer-slide-active"
              : ""
          }`}
        >
          <img
            src={designer.image}
            alt={designer.name}
            className="mobile-designer-image"
          />

          <div className="mobile-designer-overlay" />

          <div className="mobile-designer-content">
            <span className="mobile-designer-eyebrow">
              {featuredDesignersData.eyebrow}
            </span>

            <h2 className="mobile-designer-title">
              {designer.name}
            </h2>

            <p className="mobile-designer-count">
              {designer.pieces}
            </p>

            <button className="mobile-designer-cta"
            onClick={() => handleHomeDesignersClick(designer)}
            >
              <span>Explore Designer</span>

              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      ))}

      <div className="mobile-designer-dots">
        {designers.map((designer, index) => (
          <button
            key={designer.id}
            className={`mobile-designer-dot ${
              activeIndex === index
                ? "mobile-designer-dot-active"
                : ""
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <div className="mobile-designer-arrows">
        <button
          className="mobile-designer-arrow"
          onClick={prevSlide}
          aria-label="Previous designer"
        >
          <ChevronLeft size={12} />
        </button>

        <button
          className="mobile-designer-arrow"
          onClick={nextSlide}
          aria-label="Next designer"
        >
          <ChevronRight size={12} />
        </button>
      </div>
    </section>
  );
};

export default MobileDesigners;