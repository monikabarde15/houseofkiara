import React, { useState } from "react";
import { Heart, Search, ZoomIn } from "lucide-react";
import '../styles/gallery-column.css'

const badgeConfig = {
    rent: {
        text: "For Rent",
        className: "gallery-badge rent"
    },
    buy: {
        text: "Buy New",
        className: "gallery-badge buy"
    },
    preloved: {
        text: "Preloved",
        className: "gallery-badge preloved"
    }
};



export default function GalleryColumn({ images = [], variant = "rent", video = null }) {

    const media = [
        ...images.map(img => ({ type: "image", src: img })),
        ...(video ? [{ type: "video", src: video }] : [])
    ];

    // const [activeMedia, setActiveMedia] = useState(media?.[0] || null);
    const [wish, setWish] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeMedia = media[activeIndex];

    const badge = badgeConfig[variant];
    return (


        <div className="gallery-column">

            {/* THUMBNAILS Image + Video */}
            <div className="thumbs">
                {media.map((item, i) => (
                    <div
                        key={i}
                        className={`thumb ${activeIndex === i ? "active" : ""}`}
                        onClick={() => setActiveIndex(i)}
                    >
                        {item.type === "video" ? (
                            <div className="video-thumb">▶</div>
                        ) : (
                            <img src={item.src} alt="" />
                        )}
                    </div>
                ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="main-img"
                onMouseMove={(e) => {
                    if (activeMedia.type !== "image") return;

                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;

                    e.currentTarget.style.setProperty("--x", `${x}%`);
                    e.currentTarget.style.setProperty("--y", `${y}%`);
                }}>

                {activeMedia.type === "video" ? (
                    <video
                        src={activeMedia.src}
                        controls
                        autoPlay
                        muted
                        playsInline
                    />
                ) : (
                    <img src={activeMedia.src} alt="" />
                )}

                {/* BADGE */}
                <div className={badge.className}>{badge.text}</div>

                {/* WISHLIST */}
                <button
                    className="gallery-wishlist-icon-btn"
                    onClick={() => setWish(!wish)}
                >
                    <Heart className={wish ? "active" : ""} />
                </button>

                {/* ZOOM */}
                {activeMedia.type === "image" && (
                    <div className="zoom-hint">
                        <ZoomIn className="zoom-hint-icon" />
                        <span>Zoom</span>
                    </div>
                )}

            </div>
        </div>
    );
}

