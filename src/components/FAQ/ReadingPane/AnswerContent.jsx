// src/components/FAQ/ReadingPane/AnswerContent.jsx
// Formatted Answer Body (D4) with support for paragraphs, gold bullets, bold phrases, and links
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AnswerContent({ answer, onSelectQuestion }) {
  const navigate = useNavigate();

  if (!answer) return null;

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    if (link.targetQuestionId && onSelectQuestion) {
      onSelectQuestion(link.targetQuestionId, true);
    } else if (link.url) {
      navigate(link.url);
    }
  };

  // Helper to render text with bold phrases or links if specified
  const renderParagraph = (text, idx) => {
    // If paragraph contains specific links, handle them
    if (answer.links && answer.links.length > 0) {
      let elements = [text];
      answer.links.forEach((link, lIdx) => {
        const nextElements = [];
        elements.forEach((el) => {
          if (typeof el === "string" && el.includes(link.text)) {
            const parts = el.split(link.text);
            parts.forEach((p, pIdx) => {
              nextElements.push(p);
              if (pIdx < parts.length - 1) {
                nextElements.push(
                  <button
                    key={`lnk-${idx}-${lIdx}-${pIdx}`}
                    type="button"
                    className="lnk"
                    onClick={(e) => handleLinkClick(e, link)}
                  >
                    {link.text}
                  </button>
                );
              }
            });
          } else {
            nextElements.push(el);
          }
        });
        elements = nextElements;
      });
      return <p key={idx}>{elements}</p>;
    }

    return <p key={idx}>{text}</p>;
  };

  return (
    <div className="ans">
      {/* Paragraphs */}
      {answer.paragraphs &&
        answer.paragraphs.map((p, idx) => renderParagraph(p, idx))}

      {/* Bullet List (D4) */}
      {answer.bullets && answer.bullets.length > 0 && (
        <ul>
          {answer.bullets.map((b, idx) => (
            <li key={idx}>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {/* After-bullets paragraphs */}
      {answer.afterBullets &&
        answer.afterBullets.map((p, idx) => renderParagraph(p, `after-${idx}`))}
    </div>
  );
}
