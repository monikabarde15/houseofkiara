import React from "react";

import "../../styles/shared/ViewAllLink.css";

const ViewAllLink = ({
  text = "View All",
  href = "#",
}) => {
  return (
    <a
      href={href}
      className="hok-view-all-link"
    >
      {text}
    </a>
  );
};

export default ViewAllLink;