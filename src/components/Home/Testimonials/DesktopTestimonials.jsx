import React from "react";
import { Star } from "lucide-react";

import testimonialsData from "../../../data/home/testimonialsData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const DesktopTestimonials = () => {
  return (
    <section className="desk-testimonials">
      <div className="desk-testimonials-header">
        <SectionEyebrow
          text={testimonialsData.eyebrow}
          centered
        />

        <SectionTitle centered>
          What our customers <em>say</em>
        </SectionTitle>
      </div>

      <div className="desk-testimonials-grid">
        {testimonialsData.testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="desk-testimonial-card"
          >
            <div className="desk-testimonial-stars">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="desk-testimonial-star"
                  fill="currentColor"
                />
              ))}
            </div>

            <div className="desk-testimonial-quote-mark">
              "
            </div>

            <p className="desk-testimonial-text">
              {testimonial.review}
            </p>

            <div className="desk-testimonial-author">
              <div className="desk-testimonial-avatar">
                {testimonial.initials}
              </div>

              <div className="desk-testimonial-author-info">
                <h4>{testimonial.name}</h4>

                <span>
                  {testimonial.meta}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DesktopTestimonials;