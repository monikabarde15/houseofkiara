import React from "react";

export default function CareIntro({ getVal }) {
  const dynamicBody = getVal ? getVal("care_intro_body", null) : null;
  if (dynamicBody) {
    return <p className="care-intro">{dynamicBody}</p>;
  }

  return (
    <p className="care-intro">
      We ask one thing of everyone who rents with us: treat the piece as your own.
      It was part of someone's most special day, and it will be part of someone
      else's next.{" "}
      <strong>
        The cleaning is always ours, and so are the gentle signs of a wonderful
        evening.
      </strong>
    </p>
  );
}
