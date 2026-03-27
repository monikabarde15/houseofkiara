import React from "react";

export default function Testimonials() {
  const data = [
    {
      text: "I wore a Sabyasachi lehenga to my sister’s wedding for a fraction of the retail price. The quality, the packaging — everything felt completely premium. HOK changed how I think about occasion dressing.",
      name: "Priya Rathore",
      detail: "Mumbai · Rented for a Wedding",
      initials: "PR",
    },
    {
      text: "Listed my wedding lehenga and sold it in 3 days. The process was so smooth and I got a great price — it now lives with someone who’ll love it as much as I did.",
      name: "Aishwarya Sharma",
      detail: "Delhi · Sold her Bridal Lehenga",
      initials: "AS",
    },
    {
      text: "As someone who attends 6–8 weddings a year, HOK is a revelation. I’ve stopped buying outfits I’ll wear once. The curation is impeccable and delivery is always on time.",
      name: "Neha Kulkarni",
      detail: "Pune · Regular Renter",
      initials: "NK",
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">

        {/* TOP TEXT */}
        <div className="testimonial-header">
          <p className="eyebrow">
            <span className="line"></span>
            WORN, LOVED & SHARED ACROSS INDIA
            <span className="line"></span>
          </p>

          <h2>
            What our customers <span>say</span>
          </h2>
        </div>

        {/* CARDS */}
        <div className="testimonial-grid">
          {data.map((item, i) => (
            <div className="testimonial-card" key={i}>
              
              {/* Stars */}
              <div className="stars">★★★★★</div>

              {/* Quote */}
              <div className="quote">“</div>

              <p className="text">{item.text}</p>

              {/* User */}
              <div className="user">
                <div className="avatar">{item.initials}</div>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.detail}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}