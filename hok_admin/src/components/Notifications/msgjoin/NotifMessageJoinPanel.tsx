import React from "react";
import "./styles/NotifMessageJoinPanel.css";

export interface MessageJoinItem {
  id?: string;
  name: string;
  firesOn: string;
  channels: string;
  joinedTo: string | null;
}

interface NotifMessageJoinPanelProps {
  items?: MessageJoinItem[];
  onNavigate?: (target: { page: string; id?: string }) => void;
}

export function NotifMessageJoinPanel({
  items = [],
  onNavigate,
}: NotifMessageJoinPanelProps) {
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
        {items.length === 0 ? (
          <div className="ntf-msg-row">
            <div className="ntf-msg-copy">
              <div className="ntf-msg-s">
                No desk messages configured in database yet.
              </div>
            </div>
          </div>
        ) : (
          items.map((message) => (
            <div className="ntf-msg-row" key={message.id || message.name}>
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
                  onNavigate?.({ page: "messaging", id: message.id });
                }}
              >
                Wording
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
