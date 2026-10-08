import React from "react";
import { FaInstagram } from "react-icons/fa";
import defaultInstagramData from "../../../data/home/instagramData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import { renderHeadline } from "../../../utils/headlineParser";

const DesktopInstagram = ({ data }) => {
  const eyebrow = data?.eyebrow || defaultInstagramData.eyebrow;
  const heading = data?.heading || "As seen on *Instagram*";
  const posts = data?.posts || defaultInstagramData.posts;
  const strip = data?.strip || "Follow our story at";
  const followUrl = data?.viewAll?.url || "https://instagram.com/houseofkaira";

  return (
    <section className="desk-instagram">
      <div className="desk-instagram-header">
        <SectionEyebrow text={eyebrow} />

        <SectionTitle>
          {renderHeadline(heading, "em")}
        </SectionTitle>
      </div>

      <div className="desk-instagram-grid">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="desk-instagram-tile"
          >
            <img src={post.image} alt={post.alt || `Instagram ${post.id}`} />

            <div className="desk-instagram-overlay">
              <FaInstagram />
            </div>
          </a>
        ))}
      </div>

      <div className="desk-instagram-follow-row">
        <span className="desk-instagram-line" />

        <p className="desk-instagram-follow-text">
          {strip}{" "}
          <a
            href={followUrl}
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
