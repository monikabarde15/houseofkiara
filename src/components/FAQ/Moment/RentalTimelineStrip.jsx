// src/components/FAQ/Moment/RentalTimelineStrip.jsx
// Dated rental strip: 5-milestone timeline (C6) per Section C6 & 10.7
import React from "react";

export default function RentalTimelineStrip({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="strip" role="region" aria-label="Rental timeline steps">
      {/* 9px soft gold window band from step 2 to 4 (hidden on <=760px) */}
      <div className="strip-band" aria-hidden="true" />

      {steps.map((st) => {
        let stepClass = "st";
        if (st.isEvent) stepClass += " st-ev";
        if (st.isUrgent) stepClass += " st-urgent";

        return (
          <div key={st.num} className={stepClass}>
            <i>{st.num}</i>
            <span className="k">{st.label}</span>
            <span className="d">{st.date.dayMonth}</span>
            <span className="w">{st.showToday ? "Today" : st.date.weekday}</span>
          </div>
        );
      })}
    </div>
  );
}
