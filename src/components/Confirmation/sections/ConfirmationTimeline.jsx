// src/components/Confirmation/sections/ConfirmationTimeline.jsx

import React from "react";
import "../../../styles/confirmation/sections/confirmation-timeline.css";

/* =========================================
   HELPERS
========================================= */

const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const day = d.getDate();

  const month = d.toLocaleString("en-IN", {
    month: "short",
  });

  return `${day} ${month}`;
};

const formatDay = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
  });
};

/* =========================================
   COMPONENT
========================================= */

const ConfirmationTimeline = ({ item }) => {

  const booking = item?.booking || {};

  if (!item?.booking) return null;

  const start = new Date(
    booking?.deliveryDate
  );

  const end = new Date(
    booking?.returnDate
  );

  const windowDays =
    Math.round(
      (end - start) /
      (1000 * 60 * 60 * 24)
    ) + 1 ;

  const windowLabel = `${windowDays}-Day Window`;

  return (
    <div className="confirmation-timeline">

      {/* =========================================
          DELIVERY NODE
      ========================================= */}

      <div className="confirmation-timeline__node">

        <div className="confirmation-timeline__header">

          <div className="confirmation-timeline__label">
            DELIVERY
          </div>

        </div>

        <div className="confirmation-timeline__circle confirmation-timeline__circle--filled" />

        <div className="confirmation-timeline__date">
          {formatDate(booking?.deliveryDate)}
        </div>

        <div className="confirmation-timeline__day">
          {formatDay(booking?.deliveryDate)}
        </div>

      </div>

      {/* =========================================
          EVENT NODE
      ========================================= */}

      <div className="confirmation-timeline__node">

        <div className="confirmation-timeline__header">

          <div className="confirmation-timeline__window">
            {windowLabel}
          </div>

          <div className="confirmation-timeline__label">
            YOUR EVENT
          </div>

        </div>

        <div className="confirmation-timeline__circle confirmation-timeline__circle--filled" />

        <div className="confirmation-timeline__date">
          {formatDate(booking?.eventDate)}
        </div>

        <div className="confirmation-timeline__day">
          {formatDay(booking?.eventDate)}
        </div>

      </div>

      {/* =========================================
          RETURN NODE
      ========================================= */}

      <div className="confirmation-timeline__node">

        <div className="confirmation-timeline__header">

          <div className="confirmation-timeline__label">
            RETURN BY
          </div>

        </div>

        <div className="confirmation-timeline__circle confirmation-timeline__circle--urgent" />

        <div className="confirmation-timeline__date">
          {formatDate(booking?.returnDate)}
        </div>

        <div className="confirmation-timeline__day">
          {formatDay(booking?.returnDate)}
        </div>

      </div>

    </div>
  );
};

export default ConfirmationTimeline;