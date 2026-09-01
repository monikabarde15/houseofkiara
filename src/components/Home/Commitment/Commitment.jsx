import React from "react";

import DesktopCommitment from "./DesktopCommitment";
import MobileCommitment from "./MobileCommitment";

import "../../../styles/Home/Commitment/commitment.css";
import "../../../styles/Home/Commitment/desktop-commitment.css";
import "../../../styles/Home/Commitment/mobile-commitment.css";

const Commitment = () => {
  return (
    <section className="hok-commitment">
      <div className="hok-commitment-desktop">
        <DesktopCommitment />
      </div>

      <div className="hok-commitment-mobile">
        <MobileCommitment />
      </div>
    </section>
  );
};

export default Commitment;