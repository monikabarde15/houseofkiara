/**
 * House of Kaira - Care Notes List (Component C8)
 * Section 5.8 of Build Specification 2.0
 */

import React from "react";

export default function CareNotesList({ notes = [] }) {
  if (!notes || notes.length === 0) return null;

  return (
    <ul className="notes">
      {notes.map((note, idx) => (
        <li key={idx}>
          <span>{note}</span>
        </li>
      ))}
    </ul>
  );
}
