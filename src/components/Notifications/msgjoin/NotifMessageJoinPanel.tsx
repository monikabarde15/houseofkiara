import React from "react";
import "./styles/NotifMessageJoinPanel.css";

interface MessageJoinItem {
  name: string;
  firesOn: string;
  channels: string;
  joinedTo: string | null;
}

const MESSAGES: MessageJoinItem[] = [
  {
    name: "New Order Placed",
    firesOn: "An order is created",
    channels: "Email · WhatsApp · In panel",
    joinedTo: null,
  },
  {
    name: "New Submission",
    firesOn: "A submission is created",
    channels: "Email · WhatsApp · In panel",
    joinedTo: "Submissions past the 48-hour promise",
  },
  {
    name: "Returns Due Today",
    firesOn: "Daily digest at 08:00 IST",
    channels: "Email · In panel",
    joinedTo: "Returns due back today",
  },
  {
    name: "Returns Overdue",
    firesOn: "Daily digest at 08:00 IST",
    channels: "Email · WhatsApp · In panel",
    joinedTo: "Returns overdue",
  },
  {
    name: "Payment Failed",
    firesOn: "Gateway reports a failure",
    channels: "Email · WhatsApp · In panel",
    joinedTo: "Payments the gateway could not take",
  },
  {
    name: "Deposit Past T+3",
    firesOn: "A deposit is unreleased beyond the T+3 promise",
    channels: "Email · WhatsApp · In panel",
    joinedTo: "Deposits past the T+3 promise",
  },
  {
    name: "Booking Conflict",
    firesOn: "Two orders fall on one piece inside its cleaning window",
    channels: "Email · WhatsApp · In panel",
    joinedTo: "One piece booked twice too close together",
  },
];

export function NotifMessageJoinPanel() {
  return (
    <section className="ntf-msgs" aria-label="Message join panel">
      <div className="ntf-msgs-hd">
        How you are told when you are not looking at this
      </div>

      <div className="ntf-msgs-s">
        These are the messages addressed to this desk. They are not a second set
        of rules — each one reads the alert above it. Change what counts as late
        here; change how it reads in Messaging.
      </div>

      <div className="ntf-msg-list">
        {MESSAGES.map((message) => (
          <div className="ntf-msg-row" key={message.name}>
            <div className="ntf-msg-copy">
              <div className="ntf-msg-t">{message.name}</div>

              <div className="ntf-msg-s">
                {message.joinedTo
                  ? `the same derivation as “${message.joinedTo}” above`
                  : "fires on an event, so it has no standing state on this page"}
              </div>
            </div>

            <div className="ntf-msg-ch">{message.channels || "nowhere"}</div>

            <button
              type="button"
              className="msg-src"
              onClick={() => {
                // Messaging editor integration can be wired later.
                console.info(`Open wording editor for: ${message.name}`);
              }}
            >
              Wording
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
