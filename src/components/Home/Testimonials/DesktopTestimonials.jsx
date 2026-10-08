import React from "react";
import { Star } from "lucide-react";

import defaultTestimonialsData from "../../../data/home/testimonialsData";
import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";

const DesktopTestimonials = ({ data }) => {
  const eyebrow = data?.eyebrow || defaultTestimonialsData.eyebrow;
  const heading = data?.heading || "What our customers *say*";
  const testimonials = data?.testimonials || defaultTestimonialsData.testimonials;

  return (
    <section className="desk-testimonials">
      <div className="desk-testimonials-header">
        <SectionEyebrow text={eyebrow} centered />

        <SectionTitle centered>
          {renderHeadline(heading, "em")}
        </SectionTitle>
      </div>

      <div className="desk-testimonials-grid">
        {testimonials.map((testimonial) => {
          const starCount = typeof testimonial.stars === "number" ? testimonial.stars : 5;
          const reviewText = testimonial.review || testimonial.q || "";

          return (
            <article key={testimonial.id} className="desk-testimonial-card">
              <div className="desk-testimonial-stars">
                {[...Array(starCount)].map((_, index) => (
                  <Star
                    key={index}
                    className="desk-testimonial-star"
                    fill="currentColor"
                  />
                ))}
              </div>

              <div className="desk-testimonial-quote-mark">"</div>

              <p className="desk-testimonial-text">{reviewText}</p>

              <div className="desk-testimonial-author">
                <div className="desk-testimonial-avatar">
                  {testimonial.initials}
                </div>

                <div className="desk-testimonial-author-info">
                  <h4>{testimonial.name}</h4>

                  <span>{testimonial.meta}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default DesktopTestimonials;
