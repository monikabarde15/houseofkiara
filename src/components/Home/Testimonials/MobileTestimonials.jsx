import React, { useState } from "react";
import { Star } from "lucide-react";

import defaultTestimonialsData from "../../../data/home/testimonialsData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";

const MobileTestimonials = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const eyebrow = data?.eyebrow || defaultTestimonialsData.eyebrow;
  const heading = data?.heading || "What our customers *say*";
  const testimonials = data?.testimonials || defaultTestimonialsData.testimonials;

  return (
    <section className="mobile-testimonials">
      <div className="mobile-testimonials-header">
        <SectionEyebrow text={eyebrow} centered />

        <SectionTitle>
          {renderHeadline(heading, "em")}
        </SectionTitle>
      </div>

      <div className="mobile-testimonials-track">
        {testimonials.map((testimonial, index) => {
          const starCount = typeof testimonial.stars === "number" ? testimonial.stars : 5;
          const reviewText = testimonial.review || testimonial.q || "";

          return (
            <article
              key={testimonial.id}
              className={`mobile-testimonial-card ${
                activeIndex === index ? "mobile-testimonial-card-active" : ""
              }`}
            >
              <div className="mobile-testimonial-stars">
                {[...Array(starCount)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    fill="currentColor"
                    className="mobile-testimonial-star"
                  />
                ))}
              </div>

              <div className="mobile-testimonial-quote">"</div>

              <p className="mobile-testimonial-review">{reviewText}</p>

              <div className="mobile-testimonial-author">
                <div className="mobile-testimonial-avatar">
                  {testimonial.initials}
                </div>

                <div className="mobile-testimonial-author-info">
                  <h4>{testimonial.name}</h4>

                  <span>{testimonial.meta}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mobile-testimonial-dots">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            className={`mobile-testimonial-dot ${
              activeIndex === index ? "mobile-testimonial-dot-active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default MobileTestimonials;
