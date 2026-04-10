import React from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Repeat, Sparkles } from "lucide-react";
import "../styles/commitment.css";

export default function CommitmentSection() {

  const cards = [
    {
      icon: <ShieldCheck size={16} strokeWidth={1.4} />,
      title: `"Every piece rented is one less outfit the world needed to make."`,
      desc: "At HOK, choosing to rent isn't a compromise — it's a quiet act of intention. Wear beautifully, tread lightly."
    },
    {
      icon:  <Heart size={16} strokeWidth={1.4} />,
      title: `"Designer craftsmanship should be experienced, not just owned."`,
      desc: "A Sabyasachi lehenga worn once and loved deeply is worth more than one that sits untouched in a box."
    },
    {
      icon: <Sparkles size={16} strokeWidth={1.4} />,
      title: `"Your wardrobe is an asset. It's time it started acting like one."`,
      desc: "The pieces you wore once still carry value. Sell or rent them out — and let that value come back to you."
    },
    {
      icon: <Repeat size={16} strokeWidth={1.4} />,
      title: `"Occasion wear that outlives the occasion."`,
      desc: "Every outfit on HOK has a story before you, and a story after. That's not a compromise — that's the point."
    }
  ];

  return (
    <section className="commitment-section">

      <div className="row"> {/* IMPORTANT: custom grid */}

        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="commit-eyebrow">
              <span className="commit-line"></span> Our Commitment
            </p>

            <h2 className="commit-title">
              Fashion that gives <span>back</span>
            </h2>

            <p className="desc">
              Every outfit rented or resold keeps textile waste out of landfill.
              House of Kaira is building India's most loved circular fashion economy — one outfit at a time.
            </p>

            {/* PILLS */}
            <div className="pills">
              {["Rent","Buy Preloved","Buy New","List & Sell"].map((item,i)=>(
                <div key={i} className="pill">{item}</div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="cards-grid">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="commit-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="icon">{card.icon}</div>
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
}