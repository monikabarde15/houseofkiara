import React, { useState, useEffect } from "react";

import DesktopCommitment from "./DesktopCommitment";
import MobileCommitment from "./MobileCommitment";
import { getCommitmentSection, resolveCommitmentFromCms } from "../../../services/commitmentApi";

import "../../../styles/Home/Commitment/commitment.css";
import "../../../styles/Home/Commitment/desktop-commitment.css";
import "../../../styles/Home/Commitment/mobile-commitment.css";

const Commitment = () => {
  const [commitmentData, setCommitmentData] = useState(() => resolveCommitmentFromCms(null));

  useEffect(() => {
    let isMounted = true;
    getCommitmentSection().then((cmsData) => {
      if (!isMounted || !cmsData) return;
      setCommitmentData((prev) => ({
        ...prev,
        ...cmsData,
        isVisible: cmsData.isVisible !== false,
      }));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (commitmentData.isVisible === false) {
    return null;
  }

  return (
    <section className="hok-commitment">
      <div className="hok-commitment-desktop">
        <DesktopCommitment data={commitmentData} />
      </div>

      <div className="hok-commitment-mobile">
        <MobileCommitment data={commitmentData} />
      </div>
    </section>
  );
};

export default Commitment;
