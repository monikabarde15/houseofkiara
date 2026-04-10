import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ArrowRight } from "lucide-react";

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
  ];

  return (
    <section className="hok-insta-section">

      <Container fluid="xl">

        {/* HEADER */}
        <div className="hok-insta-header">
          <div>
            <p className="hok-insta-eyebrow">
              <span className="fd__line"></span>
              OUR COMMUNITY
            </p>

            <h2 className="hok-insta-title">
              As seen on <span>Instagram</span>
            </h2>
          </div>

         
          <div className="fd__viewAll-new">
              FOLLOW US  <ArrowRight size={14} className="fd__arrowIcon" />
          </div>
          
        </div>

        <div className="hok-insta-grid">
          {posts.map((color, i) => (
            <div key={i} className="hok-insta-card" style={{ background: color }}>
              <div className="hok-insta-overlay"></div>

              <div className="hok-insta-icon">
                <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.4">
                  <rect x="3" y="3" width="22" height="22" rx="6"/>
                  <circle cx="14" cy="14" r="5"/>
                  <circle cx="19" cy="8" r="1"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="hok-insta-footer">
          <div className="hok-insta-footer-line">
            <span className="hok-insta-line"></span>

           <p className="follow-text">
              Follow our story at{" "}
              <a
                href="https://instagram.com/houseofkaira"
                target="_blank"
                rel="noopener noreferrer"
                className="insta-link"
              >
                @houseofkaira
              </a>
            </p>


            <span className="hok-insta-line"></span>
          </div>
        </div>

      </Container>

    </section>
  );
}