// src/components/FAQ/Hero/HygienePromise.jsx
// Hygiene Promise Banner (B11) per Section B11 & Appendix E
import React from "react";
import { HygieneIcon } from "../common/FaqIcons";

export default function HygienePromise({ onSelectQuestion }) {
  const handleClick = () => {
    // Opens the answer "How do you keep every piece clean and hygienic?" (Section B11)
    if (onSelectQuestion) {
      onSelectQuestion("hygiene", true);
    }
  };

  return (
    <div className="promise enter e4">
      <div className="promise-ic" aria-hidden="true">
        <HygieneIcon className="promise-svg" />
      </div>
      <div className="promise-content">
        <span className="promise-k">Our hygiene promise</span>
        <p className="promise-t">
          Every piece is professionally dry-cleaned{" "}
          <em>before it reaches you, and again after every rental.</em>
        </p>
        <p className="promise-s">
          Hygiene is something we take most seriously. Each piece is also inspected and pressed by our team before it is packed for you.
        </p>
      </div>
      <button
        type="button"
        className="promise-go"
        onClick={handleClick}
      >
        How we keep pieces fresh
      </button>
    </div>
  );
}
