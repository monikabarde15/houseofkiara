/**
 * House of Kaira - Care Policy Printable View (Section 6.10)
 * Activated when window.print() is called.
 */

import React from "react";
import {
  FIRST_AID_STEPS,
  MOMENT_TABS,
  WEAR_VS_DAMAGE_DATA,
  PIECE_BY_PIECE_DATA,
  OUR_CARE_DATA,
  PIECES_YOU_OWN_DATA,
  ALL_QUESTIONS
} from "../../data/care/careRegistry";
import { CARE_SETTINGS } from "../../data/care/careSettings";

export default function CarePrintDocument() {
  const getQuestion = (id) => ALL_QUESTIONS.find((q) => q.id === id);

  return (
    <div id="printAll" aria-hidden="true">
      <h1>Care, Cleaning &amp; Damage Policy</h1>
      <div className="pr-meta">
        House of Kaira · Last reviewed: {CARE_SETTINGS.last_reviewed}
      </div>

      <p className="pr-lead">
        We ask one thing of everyone who rents with us: treat the piece as your own.
        It was part of someone's most special day, and it will be part of someone
        else's next. The cleaning is always ours, and so are the gentle signs of a
        wonderful evening.
      </p>

      <h2>If something happens</h2>
      <ol className="pr-list">
        {FIRST_AID_STEPS.map((step) => (
          <li key={step.num}>
            <strong>{step.title}:</strong> {step.line}
          </li>
        ))}
      </ol>

      <h2>Normal wear, or damage?</h2>
      <p className="pr-lead">{WEAR_VS_DAMAGE_DATA.testSentence1}</p>
      <p className="pr-lead">{WEAR_VS_DAMAGE_DATA.testSentence2}</p>
      <p className="pr-lead">{WEAR_VS_DAMAGE_DATA.perspiration}</p>

      <h3>Questions about wear and damage</h3>
      {WEAR_VS_DAMAGE_DATA.questionIds.map((id) => {
        const q = getQuestion(id);
        if (!q) return null;
        return (
          <div key={id} className="pr-q">
            <h4>{q.title}</h4>
            <div className="ans">{q.answer}</div>
          </div>
        );
      })}

      <h2>Your piece, moment by moment</h2>
      {MOMENT_TABS.map((moment) => (
        <div key={moment.id}>
          <h3>{moment.heading}</h3>
          <p className="pr-lead">{moment.subheading}</p>
          <ul className="pr-list">
            {moment.notes.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
          {moment.questionIds.map((id) => {
            const q = getQuestion(id);
            if (!q) return null;
            return (
              <div key={id} className="pr-q">
                <h4>{q.title}</h4>
                <div className="ans">{q.answer}</div>
              </div>
            );
          })}
        </div>
      ))}

      <h2>Care, piece by piece</h2>
      {PIECE_BY_PIECE_DATA.map((piece) => (
        <div key={piece.id}>
          <h3>{piece.title}</h3>
          <ul className="pr-list">
            {piece.points.map((pt, idx) => (
              <li key={idx}>{pt}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Our care, and If a piece needs restoring</h2>
      <h3>Before you, and after you</h3>
      <ul className="pr-list">
        {OUR_CARE_DATA.beforeAfter.notes.map((n, idx) => (
          <li key={idx}>{n}</li>
        ))}
      </ul>
      {OUR_CARE_DATA.beforeAfter.questionIds.map((id) => {
        const q = getQuestion(id);
        if (!q) return null;
        return (
          <div key={id} className="pr-q">
            <h4>{q.title}</h4>
            <div className="ans">{q.answer}</div>
          </div>
        );
      })}

      <h3>If a piece needs restoring</h3>
      <ol className="pr-list">
        {OUR_CARE_DATA.restoring.steps.map((st) => (
          <li key={st.num}>
            <strong>{st.title}:</strong> {st.line}
          </li>
        ))}
      </ol>
      <p className="pr-lead">{OUR_CARE_DATA.restoring.closingNote}</p>
      {OUR_CARE_DATA.restoring.questionIds.map((id) => {
        const q = getQuestion(id);
        if (!q) return null;
        return (
          <div key={id} className="pr-q">
            <h4>{q.title}</h4>
            <div className="ans">{q.answer}</div>
          </div>
        );
      })}

      <h2>A piece that is yours to keep</h2>
      <p className="pr-lead">{PIECES_YOU_OWN_DATA.lead1}</p>
      <p className="pr-lead">{PIECES_YOU_OWN_DATA.lead2}</p>
      <ul className="pr-list">
        {PIECES_YOU_OWN_DATA.notes.map((n, idx) => (
          <li key={idx}>{n}</li>
        ))}
      </ul>
      {PIECES_YOU_OWN_DATA.questionIds.map((id) => {
        const q = getQuestion(id);
        if (!q) return null;
        return (
          <div key={id} className="pr-q">
            <h4>{q.title}</h4>
            <div className="ans">{q.answer}</div>
          </div>
        );
      })}
    </div>
  );
}
