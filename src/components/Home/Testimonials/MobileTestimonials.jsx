import React, { useState } from "react";
import { Star } from "lucide-react";

import testimonialsData from "../../../data/home/testimonialsData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const MobileTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mobile-testimonials">
      <div className="mobile-testimonials-header">
        <SectionEyebrow
          text={testimonialsData.eyebrow}
          centered
        />

        <SectionTitle>
          What our customers <em>say</em>
        </SectionTitle>
      </div>

      <div className="mobile-testimonials-track">
        {testimonialsData.testimonials.map(
          (testimonial, index) => (
            <article
              key={testimonial.id}
              className={`mobile-testimonial-card ${
                activeIndex === index
                  ? "mobile-testimonial-card-active"
                  : ""
              }`}
            >
              <div className="mobile-testimonial-stars">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    fill="currentColor"
                    className="mobile-testimonial-star"
                  />
                ))}
              </div>

              <div className="mobile-testimonial-quote">
                "
              </div>

              <p className="mobile-testimonial-review">
                {testimonial.review}
              </p>

              <div className="mobile-testimonial-author">
                <div className="mobile-testimonial-avatar">
                  {testimonial.initials}
                </div>

                <div className="mobile-testimonial-author-info">
                  <h4>{testimonial.name}</h4>

                  <span>
                    {testimonial.meta}
                  </span>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      <div className="mobile-testimonial-dots">
        {testimonialsData.testimonials.map(
          (testimonial, index) => (
            <button
              key={testimonial.id}
              className={`mobile-testimonial-dot ${
                activeIndex === index
                  ? "mobile-testimonial-dot-active"
                  : ""
              }`}
              onClick={() => setActiveIndex(index)}
            />
          )
        )}
      </div>
    </section>
  );
};

export default MobileTestimonials;