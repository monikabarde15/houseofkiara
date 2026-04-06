import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "../styles/designers.css";

export default function FeaturedDesigners() {

  const designers = [
    { name: "Sabyasachi", pieces: "210 Pieces", color: "#5a1d0c" },
    { name: "Manish Malhotra", pieces: "98 Pieces", color: "#1c1a3a" },
    { name: "Tarun Tahiliani", pieces: "88 Pieces", color: "#0f2e1c" },
    { name: "Anita Dongre", pieces: "84 Pieces", color: "#3a240f" },
    { name: "Anita Dongre", pieces: "84 Pieces", color: "#3a240f" },
    
  ];

  return (
    <section className="designers-section">

      <Container fluid="xl">

        {/* HEADER */}
        <div className="section-header-fd">
          <div className="heading-block">
            <div className="eyebrow-row">
              <div className="heading-line"></div>
              <p className="eyebrow">TRUSTED CREATORS</p>
            </div>

            <h2 className="title">
              Featured <em>Designers</em>
            </h2>
          </div>

          <div className="view-all-d">VIEW ALL →</div>
        </div>

        {/* SLIDER */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{
            delay: 2500,
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
          {designers.map((d, i) => (
            <SwiperSlide key={i}>

              <motion.div
                className="designer-card"
                style={{ background: d.color }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className="overlay"></div>

                <div className="content">
                  <h4>{d.name}</h4>
                  <p>{d.pieces}</p>
                  <span>SHOP NOW</span>
                </div>

              </motion.div>

            </SwiperSlide>
          ))}
        </Swiper>

      </Container>

    </section>
  );
}