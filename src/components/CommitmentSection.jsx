import React from "react";
import { Heart, ShieldCheck, Repeat, Sparkles } from "lucide-react";

export default function CommitmentSection() {
  const cards = [
    {
      icon: <ShieldCheck size={18} />,
      title: `"Every piece resold is one less outfit the world needs to make."`,
      desc: "At HOK, choosing to rent isn't a compromise — it's a quiet act of intention. Wear beautifully, tread lightly.",
    },
    {
      icon: <Heart size={18} />,
      title: `"Designer craftsmanship should be experienced, not just owned."`,
      desc: "A Sabyasachi lehenga worn once and loved deeply is worth more than one that sits untouched in a box.",
    },
    {
      icon: <Repeat size={18} />,
      title: `"Your wardrobe is an asset. It's time it started acting like one."`,
      desc: "The pieces you wore once still carry value. Sell or rent them out — and let that value come back to you.",
    },
    {
      icon: <Sparkles size={18} />,
      title: `"Occasion wear that outlives the occasion."`,
      desc: "Every outfit on HOK has a story before you, and a story after. We believe that's not a compromise — that's the point.",
    },
  ];

  return (
    <section className="commitment">
      <div className="container">
        <div className="commitment-wrapper">
          
          {/* LEFT CONTENT */}
          <div className="left">
            <p className="eyebrow">OUR COMMITMENT</p>

            <h2>
              Fashion that gives <span>back</span>
            </h2>

            <p className="desc">
              Every outfit rented or resold keeps textile waste out of landfill.
              House of Kaira is building India’s most loved circular fashion
              economy — one outfit at a time.
            </p>

            <div className="buttons">
              <button>Rent</button>
              <button>Buy Preloved</button>
              <button>Buy New</button>
              <button>List & Sell</button>
            </div>
          </div>

          {/* RIGHT CARDS */}
          <div className="right">
            {cards.map((card, i) => (
              <div className="card" key={i}>
                <div className="icon">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}