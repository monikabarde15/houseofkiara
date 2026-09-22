// src/components/FAQ/Moment/CareNote.jsx
// Care note: Treat it as your own (C4) per Section C4
import React from "react";

export default function CareNote({ onSelectQuestion }) {
  const handleClick = () => {
    if (onSelectQuestion) {
      onSelectQuestion("care", true);
    }
  };

  return (
    <div className="pledge">
      <div className="pledge-text">
        <h3 className="pledge-h">Treat it as your own.</h3>
        <p className="pledge-p">
          Every piece in our house was part of someone’s most special day, and it will be part of someone else’s next. We ask that you wear it with the same love and care it has always been given.
        </p>
      </div>
      <button
        type="button"
        className="pledge-go"
        onClick={handleClick}
      >
        What we ask of everyone
      </button>
    </div>
  );
}
