import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "../styles/instagram.css";

export default function InstagramSection() {

  const posts = [
    "#4b1f0f",
    "#1f1c3b",
    "#0f2b1f",
    "#3b240f",
    "#3a1320",
    "#102531",
    "#4b1f0f",
    "#1f1c3b"
  ];

  return (
    <section className="hok-insta-section">

      <Container fluid="xl">

        {/* HEADER */}
        <div className="hok-insta-header">
          <div>
            <p className="hok-insta-eyebrow">
              <span className="hok-insta-line"></span>
              OUR COMMUNITY
            </p>

            <h2 className="hok-insta-title">
              As seen on <span>Instagram</span>
            </h2>
          </div>

          <a href="#" className="hok-insta-btn">
            FOLLOW US →
          </a>
        </div>

        {/* SLIDER */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false
          }}
          navigation={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
          }}
        >
          {posts.map((color, i) => (
            <SwiperSlide key={i}>

              <motion.div
                className="hok-insta-card"
                style={{ background: color }}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className="hok-insta-overlay"></div>
                <div className="hok-insta-icon">⌁</div>
              </motion.div>

            </SwiperSlide>
          ))}
        </Swiper>

        {/* FOOTER */}
        <div className="hok-insta-footer">
          <div className="hok-insta-footer-line">
            <span className="hok-insta-line"></span>

            <p>
              Follow our story at <strong>@houseofkaira</strong>
            </p>

            <span className="hok-insta-line"></span>
          </div>
        </div>

      </Container>

    </section>
  );
}