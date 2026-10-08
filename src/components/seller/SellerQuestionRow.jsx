/**
 * House of Kaira - Seller Question Row Component (Component C10)
 * Section 5.10 & Appendix A of Build Specification 1.0
 */

import React from "react";
import { Link } from "react-router-dom";

const LINK_DEFINITIONS = [
  {
    raw: "When your piece is sold [link: #q-not-as-described]",
    label: "When your piece is sold",
    targetQuestionId: "not-as-described"
  },
  {
    raw: "If something happens [link: #ch-protect]",
    label: "If something happens",
    targetChapterId: "protect"
  },
  {
    raw: "Care, Cleaning & Damage Policy [link: care-policy]",
    label: "Care, Cleaning & Damage Policy",
    href: "/care-policy"
  },
  {
    raw: "Pricing & Fees [link: pricing-fees]",
    label: "Pricing & Fees",
    href: "/terms#pricing-fees"
  },
  {
    raw: "Designer Partners [link: designer-partners]",
    label: "Designer Partners",
    href: "/about-us"
  },
  {
    raw: "Terms & Conditions [link: terms]",
    label: "Terms & Conditions",
    href: "/terms"
  },
  {
    raw: "My Account [link: account]",
    label: "My Account",
    href: "/profile"
  },
  {
    raw: "Lister Terms [link: lister-terms]",
    label: "Lister Terms",
    href: "/terms#lister-terms"
  },
  {
    raw: "List Your Piece [link: list-your-piece]",
    label: "List Your Piece",
    href: "/list-your-piece"
  }
];

/**
 * Resolves markdown-style [link: ...] tags into interactive links
 */
function renderAnswerText(text, { onSelectQuestion, onSelectChapter }) {
  if (!text) return null;

  // Check if text contains any configured link pattern
  let matchingDef = LINK_DEFINITIONS.find((def) => text.includes(def.raw));

  if (!matchingDef) {
    // Fallback: check for any generic [link: ...] tag
    const genericMatch = text.match(/\[link:\s*([^\]]+)\]/);
    if (!genericMatch) return text;

    const rawTag = genericMatch[0];
    const target = genericMatch[1].trim();
    const parts = text.split(rawTag);

    return (
      <>
        {parts[0]}
        {target.startsWith("#q-") ? (
          <a
            href={target}
            onClick={(e) => {
              e.preventDefault();
              if (onSelectQuestion) onSelectQuestion(target.replace("#q-", ""));
            }}
          >
            this question
          </a>
        ) : target.startsWith("#ch-") ? (
          <a
            href={target}
            onClick={(e) => {
              e.preventDefault();
              if (onSelectChapter) onSelectChapter(target.replace("#ch-", ""));
            }}
          >
            this chapter
          </a>
        ) : (
          <Link to={`/${target}`}>{target.replace("-", " ")}</Link>
        )}
        {parts[1]}
      </>
    );
  }

  const parts = text.split(matchingDef.raw);

  return (
    <>
      {parts[0]}
      {matchingDef.targetQuestionId ? (
        <a
          href={`#q-${matchingDef.targetQuestionId}`}
          onClick={(e) => {
            e.preventDefault();
            if (onSelectQuestion) onSelectQuestion(matchingDef.targetQuestionId);
          }}
        >
          {matchingDef.label}
        </a>
      ) : matchingDef.targetChapterId ? (
        <a
          href={`#ch-${matchingDef.targetChapterId}`}
          onClick={(e) => {
            e.preventDefault();
            if (onSelectChapter) onSelectChapter(matchingDef.targetChapterId);
          }}
        >
          {matchingDef.label}
        </a>
      ) : (
        <Link to={matchingDef.href}>{matchingDef.label}</Link>
      )}
      {parts[1]}
    </>
  );
}

export default function SellerQuestionRow({
  question,
  isOpen = false,
  onToggle,
  onSelectQuestion,
  onSelectChapter,
  onShowToast
}) {
  if (!question) return null;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#q-${question.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        if (onShowToast) onShowToast("Link copied");
      });
    } else {
      if (onShowToast) onShowToast("Link copied");
    }
    window.history.pushState(null, "", `#q-${question.id}`);
  };

  return (
    <div className={`q ${isOpen ? "open" : ""}`} id={`q-${question.id}`}>
      <button
        type="button"
        className="q-btn"
        onClick={() => onToggle && onToggle(question.id)}
        aria-expanded={isOpen}
        aria-controls={`ans-${question.id}`}
        id={`q-btn-${question.id}`}
      >
        <span className="q-text">{question.title}</span>

        {question.tag && (
          <span className={`q-tag ${question.tagTone || "mid"}`}>
            {question.tag}
          </span>
        )}

        <span className="q-ico" aria-hidden="true" />
      </button>

      <div
        className="q-ans"
        id={`ans-${question.id}`}
        role="region"
        aria-labelledby={`q-btn-${question.id}`}
      >
        {question.body &&
          question.body.map((item, index) => {
            if (item.type === "p") {
              return (
                <p key={index}>
                  {renderAnswerText(item.content || item.text, {
                    onSelectQuestion,
                    onSelectChapter
                  })}
                </p>
              );
            }
            if (item.type === "ul" && Array.isArray(item.items)) {
              return (
                <ul key={index}>
                  {item.items.map((bullet, bIdx) => (
                    <li key={bIdx}>
                      {renderAnswerText(bullet, {
                        onSelectQuestion,
                        onSelectChapter
                      })}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}

        <div className="q-foot">
          <button
            type="button"
            className="q-copy"
            onClick={handleCopyLink}
            aria-label={`Copy link to answer for ${question.title}`}
          >
            Copy link to this answer
          </button>
        </div>
      </div>
    </div>
  );
}
