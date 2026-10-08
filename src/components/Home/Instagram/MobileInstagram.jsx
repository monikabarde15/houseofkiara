import React from "react";
import { FaInstagram } from "react-icons/fa";

import defaultInstagramData from "../../../data/home/instagramData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";

const MobileInstagram = ({ data }) => {
  const eyebrow = data?.eyebrow || defaultInstagramData.eyebrow;
  const heading = data?.heading || "As seen on *Instagram*";
  const posts = data?.posts || defaultInstagramData.posts;
  const stripMob = data?.stripMob || "Follow us at";
  const followBtnText = data?.viewAllMob || data?.viewAll?.lbl || "Follow →";
  const followUrl = data?.viewAll?.url || "https://instagram.com/houseofkaira";

  return (
    <section className="mobile-instagram">
      <div className="mobile-instagram-header">
        <div>
          <SectionEyebrow text={eyebrow} />

          <SectionTitle>
            {renderHeadline(heading, "em")}
          </SectionTitle>
        </div>

        <a
          href={followUrl}
          target="_blank"
          rel="noreferrer"
          className="mobile-instagram-follow-btn"
          style={{ textDecoration: "none" }}
        >
          {followBtnText}
        </a>
      </div>

      <div className="mobile-instagram-grid">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="mobile-instagram-tile"
          >
            <img
              src={post.image}
              alt={post.alt || `Instagram Post ${post.id}`}
              className="mobile-instagram-image"
            />

            <div className="mobile-instagram-overlay">
              <FaInstagram />
            </div>
          </a>
        ))}
      </div>

      <div className="mobile-instagram-handle-row">
        <span className="mobile-instagram-line" />

        <p className="mobile-instagram-handle">
          {stripMob}{" "}
          <a
            href={followUrl}
            target="_blank"
            rel="noreferrer"
          >
            @houseofkaira
          </a>
        </p>

        <span className="mobile-instagram-line" />
      </div>
    </section>
  );
};

export default MobileInstagram;
