import React from "react";
import { FaInstagram } from "react-icons/fa";
import instagramData from "../../../data/home/instagramData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const DesktopInstagram = () => {
  return (
    <section className="desk-instagram">
      <div className="desk-instagram-header">
        <SectionEyebrow
          text={instagramData.eyebrow}
        />

        <SectionTitle>
          As seen on <em>Instagram</em>
        </SectionTitle>
      </div>

      <div className="desk-instagram-grid">
        {instagramData.posts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="desk-instagram-tile"
          >
            <img
              src={post.image}
              alt={`Instagram ${post.id}`}
            />

            <div className="desk-instagram-overlay">
              <FaInstagram />
            </div>
          </a>
        ))}
      </div>

      <div className="desk-instagram-follow-row">
        <span className="desk-instagram-line" />

        <p className="desk-instagram-follow-text">
          Follow our story at{" "}
          <a
            href="https://instagram.com/houseofkaira"
            target="_blank"
            rel="noreferrer"
          >
            @houseofkaira
          </a>
        </p>

        <span className="desk-instagram-line" />
      </div>
    </section>
  );
};

export default DesktopInstagram;