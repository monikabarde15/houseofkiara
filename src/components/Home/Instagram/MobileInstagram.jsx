import React from "react";
import { FaInstagram } from "react-icons/fa";

import instagramData from "../../../data/home/instagramData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";

const MobileInstagram = () => {
    return (
        <section className="mobile-instagram">
            <div className="mobile-instagram-header">
                <div>
                    <SectionEyebrow
                        text={instagramData.eyebrow}
                    />

                    <SectionTitle>
                        As seen on <em>Instagram</em>
                    </SectionTitle>
                </div>

                <button className="mobile-instagram-follow-btn">
                    Follow →
                </button>
            </div>

            <div className="mobile-instagram-grid">
                {instagramData.posts.map((post) => (
                    <a
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mobile-instagram-tile"
                    >
                        <img
                            src={post.image}
                            alt={`Instagram Post ${post.id}`}
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
                    Follow us at{" "}
                    <a
                        href="https://instagram.com/houseofkaira"
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