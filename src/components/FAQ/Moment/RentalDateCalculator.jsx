// src/components/FAQ/Moment/RentalDateCalculator.jsx
// Dated rental strip: panel and interactive controls (C5, C6) per Section C5, C6 & 10.7
import React, { useState, useMemo } from "react";
import RentalTimelineStrip from "./RentalTimelineStrip";
import { calculateRentalTimeline } from "../../../utils/rentalDateCalculator";

export default function RentalDateCalculator() {
  // Preset event date to today + 30 days on load (Section 10.2 & 10.7)
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  }, []);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Earliest date is tomorrow (Section 10.7)
    return d.toISOString().split("T")[0];
  }, []);

  const [eventDate, setEventDate] = useState(defaultDate);
  const [windowDays, setWindowDays] = useState(4); // 4 days (Standard) or 7 days (Extended)

  // Calculate milestones
  const timelineData = useMemo(() => {
    return calculateRentalTimeline(eventDate, windowDays);
  }, [eventDate, windowDays]);

  return (
    <div className="plan" role="region" aria-label="Your rental date by date planner">
      <div className="plan-top">
        <h3 className="plan-ttl">
          Your rental, <em>date by date</em>
        </h3>

        <div className="plan-ctl">
          <label htmlFor="faq-event-date-input" className="plan-date-label">
            Your event date
          </label>
          <input
            id="faq-event-date-input"
            type="date"
            min={minDate}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />

          <div className="plan-win" role="radiogroup" aria-label="Rental window duration">
            <button
              type="button"
              role="radio"
              aria-checked={windowDays === 4}
              aria-pressed={windowDays === 4}
              onClick={() => setWindowDays(4)}
            >
              Standard · 4 days
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={windowDays === 7}
              aria-pressed={windowDays === 7}
              onClick={() => setWindowDays(7)}
            >
              Extended · 7 days
            </button>
          </div>
        </div>
      </div>

      {/* Note line (C5) */}
      <div className="plan-note" role="status" aria-live="polite">
        {timelineData.noteMessage}
      </div>

      {/* Timeline Grid (C6) */}
      <RentalTimelineStrip steps={timelineData.steps} />

      {/* Footnote (C6) */}
      <p className="plan-foot">
        Your piece reaches you 2 days before your event and your window starts that day. We collect it within 24 hours of your window ending, inspect it within 24 hours, and refund your deposit within 3 to 5 business days. Exact dates are confirmed at checkout.
      </p>
    </div>
  );
}
