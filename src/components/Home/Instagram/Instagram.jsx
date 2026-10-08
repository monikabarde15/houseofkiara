import React, { useState, useEffect } from "react";

import DesktopInstagram from "./DesktopInstagram";
import MobileInstagram from "./MobileInstagram";
import { getInstagramSection } from "../../../services/instagramApi";
import defaultInstagramData from "../../../data/home/instagramData";

import "../../../styles/Home/Instagram/instagram.css";
import "../../../styles/Home/Instagram/desktop-instagram.css";
import "../../../styles/Home/Instagram/mobile-instagram.css";

const InstagramSection = () => {
  const [instagramData, setInstagramData] = useState(() => ({
    isVisible: true,
    eyebrow: defaultInstagramData.eyebrow,
    heading: "As seen on *Instagram*",
    viewAll: { lbl: "Follow →", url: "https://instagram.com/house_of_kaira" },
    viewAllMob: "Follow →",
    strip: "Follow our story at",
    stripMob: "Follow us at",
    posts: defaultInstagramData.posts,
  }));

  useEffect(() => {
    let isMounted = true;
    getInstagramSection().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setInstagramData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (instagramData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-instagram">
      <div className="hok-instagram-desktop">
        <DesktopInstagram data={instagramData} />
      </div>

      <div className="hok-instagram-mobile">
        <MobileInstagram data={instagramData} />
      </div>
    </section>
  );
};

export default InstagramSection;
