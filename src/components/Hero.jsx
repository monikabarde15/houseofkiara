import React, { useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, useScroll, useTransform } from "framer-motion";
import "../styles/hero.css";
import MediaGrid from "./MediaGrid";

export default function Hero() {

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // scroll effects
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // stagger animation
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // magnetic buttons
  useEffect(() => {
    const magnets = document.querySelectorAll(".magnetic");

    magnets.forEach(btn => {
      const move = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      };

      const leave = () => {
        btn.style.transform = "translate(0,0)";
      };

      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);

      btn._move = move;
      btn._leave = leave;
    });

    return () => {
      magnets.forEach(btn => {
        btn.removeEventListener("mousemove", btn._move);
        btn.removeEventListener("mouseleave", btn._leave);
      });
    };
  }, []);

  return (
    <section className="hero" ref={ref}>

      <Container fluid="xl">
        <Row className="align-items-center gx-0">

          {/* LEFT */}
          <Col lg={5} md={12} className="hero-left">

            <motion.div
              style={{ opacity, y: yText }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.2 } }
              }}
              initial="hidden"
              animate="show"
            >

              <motion.p className="section-label">
                <span className="line"></span>
                <p className="label-text">INDIA'S PREMIER CIRCULAR FASHION PLATFORM</p>
              </motion.p>

              <motion.h1 className="hero-title" variants={fadeUp}>
                Wear it <br />
                with <em>love</em>. <br />
               Pass it on<span className="dot">.</span>
              </motion.h1>

              <motion.p className="hero-sub" variants={fadeUp}>
                Rent, buy preloved, or discover new designer pieces —
                all in one curated destination for India's most discerning occasions.
              </motion.p>

              <div className="hero-btns">
                <button className="btn-primary">Explore Collection</button>
                <button className="btn-outline">How It Works</button>
              </div>
            </motion.div>

          </Col>

          {/* RIGHT */}
          <Col lg={7} md={12} className="hero-right">

            {/* <div
              className="img-wrapper"
            >
              <img
                src="https://i.pinimg.com/1200x/85/e3/d7/85e3d75810dcad9df6c8dd082615705d.jpg"
                className="hero-img"/>
            </div> */}
           
              <MediaGrid />
          </Col>

        </Row>
      </Container>

    </section>
  );
}